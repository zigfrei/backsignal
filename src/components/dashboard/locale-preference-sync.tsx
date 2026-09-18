'use client';

import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { updateUserLocale } from '@/actions/user-locale';
import { showSnackbar } from '@/components/ui/snackbar';

// Also remember direct visits to /en/dashboard, not only language-menu clicks.
export function LocalePreferenceSync() {
  const locale = useLocale();
  const t = useTranslations('Layout.LocaleSwitcher');
  useEffect(() => {
    let active = true;
    updateUserLocale(locale).then((result) => {
      if (active && !result.success) {
        showSnackbar(t(result.error === 'migrationRequired' ? 'migrationRequired' : 'error'), 'error', 'user-locale');
      }
    }).catch(() => { if (active) showSnackbar(t('error'), 'error', 'user-locale'); });
    return () => { active = false; };
  }, [locale, t]);
  return null;
}
