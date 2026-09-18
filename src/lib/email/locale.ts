import 'server-only';

import type { Locale } from '@/i18n/routing';

export function getEmailLocale(request?: Request): Locale {
  const cookie = request?.headers.get('cookie');
  const cookieLocale = cookie?.match(/(?:^|;\s*)NEXT_LOCALE=(ru|en)(?:;|$)/)?.[1];

  if (cookieLocale === 'en') {
    return 'en';
  }

  return 'ru';
}
