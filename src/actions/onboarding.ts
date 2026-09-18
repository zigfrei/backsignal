'use server';

import { revalidatePath } from 'next/cache';
import { hasLocale } from 'next-intl';
import { getCurrentSession } from '@/data/auth';
import { createFirstOrganization, IncompleteOrganizationError } from '@/data/onboarding';
import { routing } from '@/i18n/routing';
import { onboardingSchema, type OnboardingSummary } from '@/lib/onboarding-schema';

type Result = { success: true; summary: OnboardingSummary } | { success: false; error: 'name' | 'unauthorized' | 'incomplete' | 'default' };

export async function completeOnboarding(values: unknown, requestedLocale: unknown): Promise<Result> {
  const session = await getCurrentSession();
  if (!session) return { success: false, error: 'unauthorized' };
  const parsed = onboardingSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: 'name' };
  const locale = typeof requestedLocale === 'string' && hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  let summary: OnboardingSummary;
  try {
    summary = await createFirstOrganization(session.user.id, parsed.data.name, locale);
  } catch (error) {
    if (!(error instanceof IncompleteOrganizationError)) console.error('Onboarding creation failed');
    return { success: false, error: error instanceof IncompleteOrganizationError ? 'incomplete' : 'default' };
  }
  revalidatePath('/[locale]/(dashboard)', 'layout');
  return { success: true, summary };
}
