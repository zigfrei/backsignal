'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DashboardSidebar, type DashboardUser } from './dashboard-sidebar';

export function DashboardMobileMenu({ user }: { user: DashboardUser }) {
  const t = useTranslations('Dashboard');
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger aria-label={t('openMenu')} className='flex size-11 items-center justify-center rounded-lg text-text-primary hover:bg-disabled lg:hidden'><Bars3Icon aria-hidden='true' className='size-6' /></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className='fixed inset-0 z-[70] bg-base-black/45 transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none' />
        <Dialog.Popup className='fixed inset-y-0 left-0 z-[71] w-[min(20rem,90vw)] overflow-y-auto bg-base-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] shadow-xl transition-transform duration-200 data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full motion-reduce:transition-none'>
          <Dialog.Title className='sr-only'>{t('navigation')}</Dialog.Title>
          <Dialog.Close aria-label={t('closeMenu')} className='absolute right-2 top-2 flex size-11 items-center justify-center rounded-lg text-text-primary hover:bg-disabled'><XMarkIcon aria-hidden='true' className='size-6' /></Dialog.Close>
          <div className='h-full pt-10'><DashboardSidebar user={user} onNavigate={() => setOpen(false)} /></div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
