'use client';

import { Popover } from '@base-ui/react/popover';
import {
  ChevronDownIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { LocaleOptions } from './locale-options';

export function DesktopLocalePopover() {
  const locale = useLocale();
  const t = useTranslations('Layout.LocaleSwitcher');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger
        aria-label={t('triggerLabel', { locale: locale.toUpperCase() })}
        className='flex min-h-10 items-center gap-2 rounded-lg border border-divider bg-base-white px-3 py-2 text-text-primary transition-colors hover:border-primary hover:text-primary [&[data-popup-open]_.locale-chevron]:rotate-180'
      >
        <GlobeAltIcon aria-hidden='true' className='size-5 stroke-2' />
        <span className='typo-button uppercase'>{locale}</span>
        <ChevronDownIcon
          aria-hidden='true'
          className='locale-chevron size-4 stroke-2 transition-transform duration-200'
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          side='bottom'
          align='end'
          sideOffset={8}
          className='z-[80]'
        >
          <Popover.Popup className='w-64 origin-[var(--transform-origin)] rounded-xl border border-divider bg-base-white p-3 shadow-lg transition-[opacity,transform] duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0'>
            <Popover.Title className='sr-only'>{t('title')}</Popover.Title>
            <LocaleOptions onSelect={() => setIsOpen(false)} />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
