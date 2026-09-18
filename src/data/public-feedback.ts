import 'server-only';

import { cache } from 'react';
import { z } from 'zod';
import { cookies, headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { selectFeedbackLocale } from '@/lib/public-feedback-schema';

export const getPublicFeedbackContext = cache(async (publicId: string) => {
  const [cookieStore, requestHeaders] = await Promise.all([
    cookies(),
    headers(),
  ]);
  const channel = z.uuid().safeParse(publicId).success
    ? await prisma.feedbackChannel.findFirst({
        where: { publicId, isActive: true, target: { isActive: true } },
        select: {
          target: { select: { publicName: true, defaultLocale: true } },
        },
      })
    : null;
  const locale = selectFeedbackLocale(
    cookieStore.get('NEXT_LOCALE')?.value,
    channel?.target.defaultLocale,
    requestHeaders.get('accept-language'),
  );
  return { locale, name: channel?.target.publicName ?? null };
});
