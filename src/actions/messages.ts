'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentSession } from '@/data/auth';
import { markUserMessageRead } from '@/data/messages';

export async function markMessageRead(messageId: unknown): Promise<{ success: boolean }> {
  const parsed = z.string().min(1).max(128).safeParse(messageId);
  if (!parsed.success) return { success: false };
  const session = await getCurrentSession();
  if (!session) return { success: false };
  try {
    if (!await markUserMessageRead(session.user.id, parsed.data)) return { success: false };
  } catch { return { success: false }; }
  revalidatePath('/[locale]/(dashboard)', 'layout');
  return { success: true };
}
