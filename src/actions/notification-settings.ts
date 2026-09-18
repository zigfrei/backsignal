'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getCurrentSession } from '@/data/auth';
import { getUserOnboarding } from '@/data/onboarding';
import { saveNotificationSettings } from '@/data/email-notifications';

export async function updateNotificationSettings(input: unknown) {
  const parsed = z.object({ enabled: z.boolean(), locale: z.enum(['ru', 'en']) }).safeParse(input);
  if (!parsed.success) return { success: false };
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false };
    const { summary } = await getUserOnboarding(session.user.id);
    if (!summary) return { success: false };
    await saveNotificationSettings(session.user.id, summary.organizationId, parsed.data.enabled, parsed.data.locale);
    revalidatePath('/[locale]/(dashboard)/dashboard/settings', 'page');
    return { success: true };
  } catch { return { success: false }; }
}
