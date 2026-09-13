'use client';

import { Drawer } from '@base-ui/react/drawer';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { LocaleOptions } from './locale-options';

export function MobileLocaleDrawer() {
  const locale = useLocale();
  const t = useTranslations('Layout.LocaleSwitcher');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      swipeDirection='down'
    >
      <Drawer.Trigger
        aria-label={t('triggerLabel', { locale: locale.toUpperCase() })}
        className='flex size-10 items-center justify-center gap-1 rounded-lg border border-divider bg-base-white text-text-primary'
      >
        <GlobeAltIcon aria-hidden='true' className='size-5 stroke-2' />
        <span className='sr-only uppercase'>{locale}</span>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Backdrop className='fixed inset-0 z-[80] bg-base-black/45 transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0' />
        <Drawer.Viewport className='pointer-events-none fixed inset-0 z-[81] flex items-end'>
          <Drawer.Popup className='pointer-events-auto w-full rounded-t-2xl bg-base-white pb-[max(2rem,env(safe-area-inset-bottom))] [transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-200 ease-out data-[ending-style]:[transform:translateY(100%)] data-[starting-style]:[transform:translateY(100%)]'>
            <div className='flex h-10 items-center justify-center'>
              <div
                aria-hidden='true'
                className='h-1.5 w-10 rounded-full bg-divider'
              />
            </div>
            <Drawer.Content className='mx-auto w-full max-w-md px-4'>
              <Drawer.Title className='mb-4 typo-h4 text-text-primary'>
                {t('title')}
              </Drawer.Title>
              <LocaleOptions onSelect={() => setIsOpen(false)} />
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
