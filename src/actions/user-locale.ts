'use server';

import { hasLocale } from 'next-intl';
import { getCurrentSession } from '@/data/auth';
import { prisma } from '@/lib/prisma';
import { routing } from '@/i18n/routing';

export async function updateUserLocale(locale: unknown): Promise<{ success: boolean; error?: 'migrationRequired' }> {
  if (typeof locale !== 'string' || !hasLocale(routing.locales, locale)) return { success: false };
  try {
    const session = await getCurrentSession();
    // Guests only change URL/cookie. Never accept a user ID from the browser.
    if (!session) return { success: true };
    await prisma.user.updateMany({
      where: { id: session.user.id, preferredLocale: { not: locale } },
      data: { preferredLocale: locale },
    });
    return { success: true };
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : 'unknown_error';
    console.error('User locale save failed', { code });
    if (code === 'P2022') return { success: false, error: 'migrationRequired' };
    return { success: false };
  }
}
