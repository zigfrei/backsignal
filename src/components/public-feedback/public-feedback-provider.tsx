'use client';

import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/routing';

// The public route has no [locale] segment: do not use the server provider's
// implicit request-config lookup for formats, timeZone or now.
export function PublicFeedbackProvider({ locale, messages, children }: { locale: Locale; messages: AbstractIntlMessages; children: ReactNode }) {
  return <NextIntlClientProvider locale={locale} messages={messages} timeZone='UTC'>{children}</NextIntlClientProvider>;
}
