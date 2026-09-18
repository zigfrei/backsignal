'use client';

import { CheckIcon } from '@heroicons/react/24/outline';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

interface LocaleOptionsProps {
  onSelect: () => void;
}

export function LocaleOptions({ onSelect }: LocaleOptionsProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Layout.LocaleSwitcher');
  const [isPending, startTransition] = useTransition();

  const changeLocale = (nextLocale: Locale) => {
    onSelect();

    if (nextLocale === locale) {
      return;
    }

    const destination =
      pathname + window.location.search + window.location.hash;

    startTransition(() => {
      router.replace(destination, {
        locale: nextLocale,
        scroll: false,
      });
    });
  };

  return (
    <div className='flex flex-col gap-2' aria-busy={isPending}>
      {routing.locales.map((itemLocale) => {
        const isActive = itemLocale === locale;

        return (
          <button
            key={itemLocale}
            type='button'
            aria-pressed={isActive}
            disabled={isPending}
            className='flex min-h-12 w-full items-center gap-3 rounded-lg border border-divider px-4 py-2 text-left transition-colors hover:border-primary hover:bg-primary/10 disabled:cursor-wait disabled:opacity-60'
            onClick={() => changeLocale(itemLocale)}
          >
            <span className='typo-body-small font-semibold uppercase text-primary'>
              {itemLocale}
            </span>
            <span className='typo-body text-text-primary'>
              {t(`languages.${itemLocale}`)}
            </span>
            {isActive ? (
              <CheckIcon
                aria-hidden='true'
                className='ml-auto size-5 shrink-0 stroke-2 text-primary'
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
