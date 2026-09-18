'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { updateUserLocale } from '@/actions/user-locale';
import type { Locale } from '@/i18n/routing';
import { showSnackbar } from '@/components/ui/snackbar';

export function useLocaleNavigation(onSelect?: () => void) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Layout.LocaleSwitcher');
  const [isPending, startTransition] = useTransition();

  function changeLocale(next: Locale) {
    if (isPending) return;
    const destination = pathname + window.location.search + window.location.hash;
    startTransition(async () => {
      try {
        const result = await updateUserLocale(next);
        if (!result.success) { showSnackbar(t(result.error === 'migrationRequired' ? 'migrationRequired' : 'error'), 'error', 'user-locale'); return; }
        onSelect?.();
        if (next !== locale) router.replace(destination, { locale: next, scroll: false });
      } catch {
        showSnackbar(t('error'), 'error', 'user-locale');
      }
    });
  }

  return { changeLocale, isPending };
}
