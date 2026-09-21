import 'server-only';

import { randomUUID } from 'node:crypto';
import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { notificationOrigin } from '@/lib/email/notification-policy';
import { createTelegramFeedbackText } from '@/lib/telegram/message';
import { sendTelegramMessage } from '@/lib/telegram/send';

export async function enqueueFeedbackTelegram(
  tx: Prisma.TransactionClient,
  messageId: string,
) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return [];
  const message = await tx.message.findUniqueOrThrow({
    where: { id: messageId },
    select: {
      channel: {
        select: {
          target: {
            select: {
              organization: {
                select: {
                  memberships: {
                    where: { role: 'OWNER' },
                    select: { userId: true },
                    orderBy: { createdAt: 'asc' },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  const ownerId = message.channel.target.organization.memberships[0]?.userId;
  if (!ownerId) return [];
  const origin = notificationOrigin();
  const connection = await tx.telegramConnection.findUnique({
    where: { userId_origin: { userId: ownerId, origin } },
  });
  if (!connection?.enabled || !connection.chatId) return [];
  const job = await tx.telegramNotification.create({
    data: {
      messageId,
      recipientUserId: ownerId,
      origin,
      chatId: connection.chatId,
    },
    select: { id: true },
  });
  return [job.id];
}

async function processOne(id: string) {
  const now = new Date();
  const lease = randomUUID();
  const claimed = await prisma.telegramNotification.updateMany({
    where: {
      id,
      origin: notificationOrigin(),
      status: 'PENDING',
      nextAttemptAt: { lte: now },
    },
    data: {
      status: 'PROCESSING',
      lockToken: lease,
      lockedUntil: new Date(now.getTime() + 30_000),
      attempts: { increment: 1 },
    },
  });
  if (!claimed.count) return;
  const job = await prisma.telegramNotification.findUniqueOrThrow({
    where: { id },
    include: {
      recipient: { select: { preferredLocale: true } },
      message: {
        select: {
          text: true,
          mood: true,
          channel: {
            select: {
              target: { select: { organizationId: true, publicName: true } },
            },
          },
        },
      },
    },
  });
  const finish = (data: Prisma.TelegramNotificationUpdateManyMutationInput) =>
    prisma.telegramNotification.updateMany({
      where: { id, lockToken: lease, status: 'PROCESSING' },
      data: { ...data, lockToken: null, lockedUntil: null },
    });
  const [connection, membership] = await Promise.all([
    prisma.telegramConnection.findUnique({
      where: {
        userId_origin: { userId: job.recipientUserId, origin: job.origin },
      },
    }),
    prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: job.recipientUserId,
          organizationId: job.message.channel.target.organizationId,
        },
      },
    }),
  ]);
  if (
    !connection?.enabled ||
    connection.chatId !== job.chatId ||
    membership?.role !== 'OWNER'
  ) {
    await finish({ status: 'CANCELED' });
    return;
  }
  const body = createTelegramFeedbackText({
    locale: job.recipient.preferredLocale,
    name: job.message.channel.target.publicName,
    text: job.message.text,
    mood: job.message.mood,
    origin: job.origin,
    messageId: job.messageId,
  });
  const result = await sendTelegramMessage(job.chatId, body);
  if (result.ok) {
    await finish({
      status: 'SENT',
      sentAt: new Date(),
      providerMessageId: result.messageId,
    });
  } else {
    if (result.code === 'blocked')
      await prisma.telegramConnection.updateMany({
        where: { id: connection.id, chatId: job.chatId },
        data: { enabled: false },
      });
    // Retry only an explicit rate-limit response; timeouts may have been delivered.
    const retry = result.code === 'rate_limited' && job.attempts < 3;
    await finish({
      status: retry ? 'PENDING' : 'FAILED',
      lastErrorCode: result.code,
      nextAttemptAt: retry
        ? new Date(Date.now() + Math.max(60, result.retryAfter ?? 60) * 1000)
        : job.nextAttemptAt,
    });
  }
}

export async function processTelegramNotifications(ids?: string[]) {
  const now = new Date();
  // A worker that died during sending leaves an ambiguous result. Do not resend blindly.
  await prisma.telegramNotification.updateMany({
    where: {
      origin: notificationOrigin(),
      status: 'PROCESSING',
      lockedUntil: { lt: now },
    },
    data: {
      status: 'FAILED',
      lastErrorCode: 'uncertain_expired',
      lockToken: null,
      lockedUntil: null,
    },
  });
  const where = {
    origin: notificationOrigin(),
    status: 'PENDING' as const,
    nextAttemptAt: { lte: now },
    ...(ids?.length ? { id: { in: ids } } : {}),
  };
  const pending = await prisma.telegramNotification.findMany({
    where,
    select: { id: true },
    orderBy: { createdAt: 'asc' },
    take: 10,
  });
  for (const item of pending) await processOne(item.id);
  return { processed: pending.length };
}

export async function sendTelegramTest(userId: string, locale: string) {
  const connection = await prisma.telegramConnection.findUnique({
    where: { userId_origin: { userId, origin: notificationOrigin() } },
  });
  if (!connection?.chatId) return false;
  const result = await sendTelegramMessage(
    connection.chatId,
    locale === 'en'
      ? 'Test notification from Backsignal. New feedback will appear here.'
      : 'Тестовое уведомление от «Обратного сигнала». Здесь будут появляться новые отзывы.',
  );
  if (!result.ok && result.code === 'blocked')
    await prisma.telegramConnection.updateMany({
      where: { id: connection.id },
      data: { enabled: false },
    });
  return result.ok;
}
