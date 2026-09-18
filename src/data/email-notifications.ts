import 'server-only';

import { randomUUID } from 'node:crypto';
import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { requireOrganizationRole } from './access';
import { createFeedbackEmail } from '@/lib/email/feedback-email-template';
import { notificationOrigin, retryNotification } from '@/lib/email/notification-policy';
import { sendNotificationEmail } from '@/lib/email';
import { EmailDeliveryError } from '@/lib/email/types';

export async function enqueueFeedbackEmails(tx: Prisma.TransactionClient, messageId: string) {
  const message = await tx.message.findUniqueOrThrow({
    where: { id: messageId },
    include: {
      channel: {
        include: {
          target: {
            include: {
              organization: {
                include: {
                  settings: true,
                  memberships: {
                    where: { role: 'OWNER', user: { emailVerified: true } },
                    include: { user: true },
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
  const organization = message.channel.target.organization;
  if (!organization.settings?.emailNotifications) return [];
  const owner = organization.memberships[0]?.user;
  if (!owner) return [];
  const origin = notificationOrigin();
  const template = createFeedbackEmail({ locale: owner.preferredLocale, name: message.channel.target.publicName, text: message.text, mood: message.mood, origin, messageId });
  const job = await tx.emailNotification.create({ data: {
    messageId, recipientUserId: owner.id, recipientEmail: owner.email,
    origin, senderEmail: process.env.NOTIFICATION_EMAIL_FROM || 'Backsignal <notifications@notify.backsignal.tech>', ...template,
  }, select: { id: true } });
  return [job.id];
}

export async function getNotificationSettings(userId: string, organizationId: string) {
  await requireOrganizationRole(userId, organizationId, ['OWNER']);
  const [settings, user] = await Promise.all([
    prisma.organizationSettings.findUniqueOrThrow({ where: { organizationId } }),
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true, emailVerified: true } }),
  ]);
  return { enabled: settings.emailNotifications, ...user };
}

export async function saveNotificationSettings(userId: string, organizationId: string, enabled: boolean) {
  await requireOrganizationRole(userId, organizationId, ['OWNER']);
  await prisma.$transaction(async (tx) => {
    await tx.organizationSettings.update({ where: { organizationId }, data: { emailNotifications: enabled } });
    if (!enabled) await tx.emailNotification.updateMany({ where: { status: 'PENDING', message: { channel: { target: { organizationId } } } }, data: { status: 'CANCELED' } });
  });
}

async function processOne(id: string) {
  const now = new Date();
  const token = randomUUID();
  // Lease token prevents a stale worker from overwriting the result of a newer worker.
  const claimed = await prisma.emailNotification.updateMany({ where: { id, origin: notificationOrigin(), nextAttemptAt: { lte: now }, OR: [{ status: 'PENDING' }, { status: 'PROCESSING', lockedUntil: { lte: now } }] }, data: { status: 'PROCESSING', lockToken: token, lockedUntil: new Date(now.getTime() + 120_000) } });
  if (!claimed.count) return;
  const job = await prisma.emailNotification.findUniqueOrThrow({ where: { id }, include: { recipient: true, message: { include: { channel: { include: { target: { include: { organization: { include: { settings: true } } } } } } } } } });
  const finish = (data: Prisma.EmailNotificationUpdateManyMutationInput) => prisma.emailNotification.updateMany({ where: { id, lockToken: token, status: 'PROCESSING' }, data: { ...data, lockToken: null, lockedUntil: null } });
  const membership = await prisma.membership.findUnique({ where: { userId_organizationId: { userId: job.recipientUserId, organizationId: job.message.channel.target.organizationId } } });
  if (!membership || membership.role !== 'OWNER' || !job.recipient.emailVerified || job.recipient.email !== job.recipientEmail || !job.message.channel.target.organization.settings?.emailNotifications) {
    await finish({ status: 'CANCELED' });
    return;
  }
  // A reclaimed PROCESSING job may have sent before its worker died.
  const uncertain = job.uncertain || Boolean(job.firstAttemptAt && job.lastErrorCode === null);
  if (!retryNotification({ attempts: job.attempts, uncertain, firstAttemptAt: job.firstAttemptAt, now })) {
    await finish({ status: 'FAILED', lastErrorCode: uncertain ? 'ambiguous_expired' : 'attempts_exhausted' });
    return;
  }
  await prisma.emailNotification.updateMany({ where: { id, lockToken: token }, data: { attempts: { increment: 1 }, firstAttemptAt: job.firstAttemptAt ?? now, uncertain: true, lastErrorCode: null } });
  try {
    const result = await sendNotificationEmail({ from: job.senderEmail, to: job.recipientEmail, subject: job.subject, text: job.text, html: job.html, idempotencyKey: `feedback-notification/${id}` });
    await finish({ status: 'SENT', sentAt: new Date(), providerEmailId: result.id, uncertain: false, lastErrorCode: null });
  } catch (error) {
    const delivery = error instanceof EmailDeliveryError ? error : new EmailDeliveryError('transport_error', true, true);
    const canRetry = delivery.retryable && job.attempts + 1 < 5;
    await finish({ status: canRetry ? 'PENDING' : 'FAILED', uncertain: uncertain || delivery.uncertain, lastErrorCode: delivery.code, nextAttemptAt: new Date(Date.now() + 60 * 60 * 1000) });
    console.error('Feedback email attempt failed', { notificationId: id, code: delivery.code });
  }
}

export async function processEmailNotifications(ids?: string[]) {
  const startedAt = Date.now();
  const now = new Date();
  const jobs = await prisma.emailNotification.findMany({ where: { origin: notificationOrigin(), ...(ids ? { id: { in: ids } } : {}), nextAttemptAt: { lte: now }, OR: [{ status: 'PENDING' }, { status: 'PROCESSING', lockedUntil: { lte: now } }] }, orderBy: { createdAt: 'asc' }, take: 20, select: { id: true } });
  let processed = 0;
  for (const job of jobs) {
    if (Date.now() - startedAt > 35_000) break;
    try { await processOne(job.id); }
    catch { console.error('Feedback email worker failed', { notificationId: job.id }); }
    processed++;
  }
  return { processed };
}
