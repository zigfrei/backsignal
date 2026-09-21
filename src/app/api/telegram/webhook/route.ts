import { timingSafeEqual } from 'node:crypto';
import { receiveTelegramStart, telegramConfigured } from '@/data/telegram-connection';
import { notificationOrigin } from '@/lib/email/notification-policy';
import { sendTelegramMessage } from '@/lib/telegram/send';

export const runtime = 'nodejs';

function validSecret(value: string | null) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || !value) return false;
  const expected = Buffer.from(secret);
  const actual = Buffer.from(value);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function POST(request: Request) {
  if (!telegramConfigured() || !validSecret(request.headers.get('x-telegram-bot-api-secret-token'))) return new Response(null, { status: 401 });
  if (Number(request.headers.get('content-length') ?? 0) > 65_536) return new Response(null, { status: 413 });
  let update: unknown;
  try { update = await request.json(); }
  catch { return new Response(null, { status: 400 }); }
  if (!update || typeof update !== 'object' || !('message' in update)) return new Response(null, { status: 200 });
  const message = update.message;
  if (!message || typeof message !== 'object' || !('chat' in message) || !('from' in message) || !('text' in message)) return new Response(null, { status: 200 });
  const chat = message.chat;
  const from = message.from;
  if (!chat || typeof chat !== 'object' || !('type' in chat) || chat.type !== 'private' || !('id' in chat)) return new Response(null, { status: 200 });
  if (!from || typeof from !== 'object' || !('id' in from)) return new Response(null, { status: 200 });
  if (typeof message.text !== 'string' || typeof chat.id !== 'number' || typeof from.id !== 'number') return new Response(null, { status: 200 });
  const match = /^\/start(?:@[a-zA-Z0-9_]+)? ([a-zA-Z0-9_-]{43})$/.exec(message.text);
  if (!match) return new Response(null, { status: 200 });
  try {
    const locale = await receiveTelegramStart(match[1], String(chat.id), String(from.id), 'username' in from && typeof from.username === 'string' ? from.username.slice(0, 32) : null);
    if (locale) {
      const dashboardUrl = `${notificationOrigin()}${locale === 'en' ? '/en' : ''}/dashboard/telegram`;
      const text = locale === 'en'
        ? `Return to your Backsignal dashboard and confirm the Telegram connection:\n${dashboardUrl}`
        : `Вернитесь в кабинет «Обратного сигнала» и подтвердите подключение Telegram:\n${dashboardUrl}`;
      await sendTelegramMessage(String(chat.id), text);
    }
    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 500 });
  }
}
