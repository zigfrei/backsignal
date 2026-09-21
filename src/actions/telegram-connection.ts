'use server';

import { getCurrentSession } from '@/data/auth';
import { beginTelegramConnection, confirmTelegramConnection, disconnectTelegramConnection, getTelegramConnection, setTelegramConnectionEnabled } from '@/data/telegram-connection';
import { sendTelegramTest } from '@/data/telegram-notifications';

async function currentUserId() {
  const session = await getCurrentSession();
  return session?.user.id;
}

export async function startTelegramConnection() {
  const userId = await currentUserId();
  if (!userId) return { success: false as const };
  try { return { success: true as const, url: await beginTelegramConnection(userId) }; }
  catch { return { success: false as const }; }
}

export async function checkTelegramConnection() {
  const userId = await currentUserId();
  if (!userId) return { success: false as const };
  try { return { success: true as const, state: await getTelegramConnection(userId) }; }
  catch { return { success: false as const }; }
}

export async function approveTelegramConnection() {
  const userId = await currentUserId();
  if (!userId) return { success: false as const };
  return { success: await confirmTelegramConnection(userId) };
}

export async function toggleTelegramConnection(enabled: boolean) {
  const userId = await currentUserId();
  if (!userId || typeof enabled !== 'boolean') return { success: false as const };
  return { success: await setTelegramConnectionEnabled(userId, enabled) };
}

export async function removeTelegramConnection() {
  const userId = await currentUserId();
  if (!userId) return { success: false as const };
  await disconnectTelegramConnection(userId);
  return { success: true as const };
}

export async function sendTestTelegramNotification(locale: 'ru' | 'en') {
  const userId = await currentUserId();
  if (!userId || (locale !== 'ru' && locale !== 'en')) return { success: false as const };
  return { success: await sendTelegramTest(userId, locale) };
}
