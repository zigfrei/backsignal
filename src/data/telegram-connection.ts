import 'server-only';

import { createHash, randomBytes } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { notificationOrigin } from '@/lib/email/notification-policy';

const TOKEN_LIFETIME_MS = 15 * 60 * 1000;

function origin() {
  return notificationOrigin();
}

export function telegramConfigured() {
  return Boolean(
    process.env.TELEGRAM_BOT_TOKEN &&
    process.env.TELEGRAM_WEBHOOK_SECRET &&
    /^[a-zA-Z0-9_]{5,32}$/.test(process.env.TELEGRAM_BOT_USERNAME ?? ''),
  );
}

export function hashTelegramToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function getTelegramConnection(userId: string) {
  const connection = await prisma.telegramConnection.findUnique({
    where: { userId_origin: { userId, origin: origin() } },
  });
  return connection ? {
    connected: Boolean(connection.chatId),
    enabled: connection.enabled,
    username: connection.username,
    pending: Boolean(connection.pendingTokenHash && connection.pendingExpiresAt && connection.pendingExpiresAt > new Date()),
    pendingConfirmation: Boolean(connection.pendingChatId && connection.pendingExpiresAt && connection.pendingExpiresAt > new Date()),
  } : { connected: false, enabled: false, username: null, pending: false, pendingConfirmation: false };
}

export async function beginTelegramConnection(userId: string) {
  if (!telegramConfigured()) throw new Error('Telegram not configured');
  const token = randomBytes(32).toString('base64url');
  const pendingTokenHash = hashTelegramToken(token);
  await prisma.telegramConnection.upsert({
    where: { userId_origin: { userId, origin: origin() } },
    create: { userId, origin: origin(), pendingTokenHash, pendingExpiresAt: new Date(Date.now() + TOKEN_LIFETIME_MS) },
    update: { pendingTokenHash, pendingExpiresAt: new Date(Date.now() + TOKEN_LIFETIME_MS), pendingChatId: null, pendingTelegramUserId: null, pendingUsername: null },
  });
  return `https://t.me/${process.env.TELEGRAM_BOT_USERNAME}?start=${token}`;
}

export async function receiveTelegramStart(token: string, chatId: string, telegramUserId: string, username: string | null) {
  if (!/^[a-zA-Z0-9_-]{43}$/.test(token)) return false;
  const updated = await prisma.telegramConnection.updateMany({
    where: { pendingTokenHash: hashTelegramToken(token), pendingExpiresAt: { gt: new Date() }, pendingChatId: null, origin: origin() },
    data: { pendingChatId: chatId, pendingTelegramUserId: telegramUserId, pendingUsername: username },
  });
  return updated.count === 1;
}

export async function confirmTelegramConnection(userId: string) {
  const connection = await prisma.telegramConnection.findUnique({ where: { userId_origin: { userId, origin: origin() } } });
  if (!connection?.pendingChatId || !connection.pendingTelegramUserId || !connection.pendingExpiresAt || connection.pendingExpiresAt <= new Date()) return false;
  try {
    const updated = await prisma.telegramConnection.updateMany({
      where: { id: connection.id, pendingChatId: connection.pendingChatId, pendingExpiresAt: { gt: new Date() } },
      data: {
        chatId: connection.pendingChatId,
        telegramUserId: connection.pendingTelegramUserId,
        username: connection.pendingUsername,
        enabled: true,
        connectedAt: new Date(),
        pendingTokenHash: null,
        pendingExpiresAt: null,
        pendingChatId: null,
        pendingTelegramUserId: null,
        pendingUsername: null,
      },
    });
    return updated.count === 1;
  } catch {
    // The same Telegram chat cannot be connected to another account.
    return false;
  }
}

export async function setTelegramConnectionEnabled(userId: string, enabled: boolean) {
  const updated = await prisma.telegramConnection.updateMany({ where: { userId, origin: origin(), chatId: { not: null } }, data: { enabled } });
  return updated.count === 1;
}

export async function disconnectTelegramConnection(userId: string) {
  await prisma.telegramConnection.deleteMany({ where: { userId, origin: origin() } });
}
