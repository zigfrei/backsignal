'use server';

import { headers, cookies } from 'next/headers';
import { after } from 'next/server';
import { enqueueFeedbackEmails, processEmailNotifications } from '@/data/email-notifications';
import { enqueueFeedbackTelegram, processTelegramNotifications } from '@/data/telegram-notifications';
import { prisma } from '@/lib/prisma';
import { feedbackSchema } from '@/lib/public-feedback-schema';
import { consumeAttemptLimit, consumePublicLimit, getClientFingerprint } from '@/data/public-rate-limit';

type Result = { success: true } | { success: false; error: 'invalid' | 'unavailable' | 'rateLimit' | 'default'; retryAfter?: number };

export async function submitPublicFeedback(input: unknown): Promise<Result> {
  try {
    const fingerprint = getClientFingerprint(await headers());
    const attempt = await consumeAttemptLimit(fingerprint);
    if (!attempt.allowed) return { success: false, error: 'rateLimit', retryAfter: attempt.retryAfter };
    const parsed = feedbackSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: 'invalid' };
    const { publicId, submissionId, text, mood, locale, website } = parsed.data;
    if (website) return { success: true }; // Honeypot: silently discard automated submissions.
    const notifications: string[] = [];
    const telegramNotifications: string[] = [];
    const result = await prisma.$transaction(async (tx): Promise<Result> => {
      const channel = await tx.feedbackChannel.findFirst({
        where: { publicId, isActive: true, target: { isActive: true } },
        select: { id: true },
      });
      if (!channel) return { success: false, error: 'unavailable' };
      // Concurrent retries with the same id cannot both create a message or spend the success quota.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`${channel.id}:${submissionId}`}, 0))::text`;
      const existing = await tx.message.findUnique({ where: { channelId_submissionId: { channelId: channel.id, submissionId } }, select: { id: true } });
      if (existing) return { success: true };
      const limit = await consumePublicLimit(tx, `channel:${channel.id}`, fingerprint, 3);
      if (!limit.allowed) return { success: false, error: 'rateLimit', retryAfter: limit.retryAfter };
      const message = await tx.message.create({ data: { channelId: channel.id, submissionId, text, mood, locale, status: 'NEW' } });
      notifications.push(...await enqueueFeedbackEmails(tx, message.id));
      telegramNotifications.push(...await enqueueFeedbackTelegram(tx, message.id));
      return { success: true };
    }, { timeout: 15000 });
    if (result.success && notifications.length) {
      // Scheduling or delivery failure must never report a saved feedback as rejected.
      try { after(async () => { try { await processEmailNotifications(notifications); } catch { console.error('Feedback email processing failed'); } }); }
      catch { console.error('Feedback email scheduling failed'); }
    }
    if (result.success && telegramNotifications.length) {
      try { after(async () => { try { await processTelegramNotifications(telegramNotifications); } catch { console.error('Feedback Telegram processing failed'); } }); }
      catch { console.error('Feedback Telegram scheduling failed'); }
    }
    return result;
  } catch {
    console.error('Public feedback submission failed');
    return { success: false, error: 'default' };
  }
}

export async function setPublicFeedbackLocale(locale: unknown) {
  if (locale !== 'ru' && locale !== 'en') return;
  (await cookies()).set('NEXT_LOCALE', locale, { path: '/', sameSite: 'lax', maxAge: 31536000, secure: process.env.NODE_ENV === 'production' });
}
