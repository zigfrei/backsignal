'use client';

import { Drawer } from '@base-ui/react/drawer';
import { ArrowRightStartOnRectangleIcon, ChevronRightIcon, Cog6ToothIcon, GlobeAltIcon, UserCircleIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { LocaleOptions } from '@/components/layout/locale-switcher/locale-options';
import { useDashboardLogout } from './use-dashboard-logout';
import type { DashboardUser } from './dashboard-sidebar';

const row = 'flex min-h-12 w-full items-center gap-3 rounded-lg px-3 py-2 text-left typo-body hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary';
const sheet = 'pointer-events-auto max-h-[85dvh] w-full overflow-y-auto overscroll-contain rounded-t-2xl border border-b-0 border-divider bg-base-white shadow-xl pb-[max(1.5rem,env(safe-area-inset-bottom))] text-text-primary outline-none [transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-200 ease-out data-starting-style:[transform:translateY(100%)] data-ending-style:[transform:translateY(100%)] data-swiping:transition-none motion-reduce:transition-none';

export function DashboardProfileDrawer({ user, compact = false, onNavigate }: { user: DashboardUser; compact?: boolean; onNavigate?: () => void }) {
  const t = useTranslations('Dashboard');
  const languageT = useTranslations('Layout.LocaleSwitcher');
  const logout = useTranslations('Auth.Logout');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [failedImage, setFailedImage] = useState<string>();
  const closeAndNavigate = () => { setOpen(false); onNavigate?.(); };
  const { loggingOut, error, handleLogout } = useDashboardLogout(closeAndNavigate);

  return (
    <Drawer.Root open={open} onOpenChange={(next) => { setOpen(next); if (!next) setLanguageOpen(false); }} swipeDirection='down'>
      <Drawer.Trigger aria-label={t('profileMenu')} className={compact ? 'flex size-11 shrink-0 items-center justify-center rounded-lg text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary' : `${row} min-w-0`}>
        {user.image && failedImage !== user.image ? <Image src={user.image} alt='' width={40} height={40} unoptimized onError={() => setFailedImage(user.image!)} className='size-9 shrink-0 rounded-full object-cover' /> : <UserCircleIcon aria-hidden='true' className='size-9 shrink-0 text-primary' />}
        {!compact && <><span className='min-w-0 flex-1'><span className='block truncate typo-body-small font-semibold'>{user.name}</span><span className='block truncate typo-caption text-text-secondary'>{user.email}</span></span><ChevronRightIcon aria-hidden='true' className='size-5 shrink-0' /></>}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop forceRender onClick={(event) => { event.stopPropagation(); setOpen(false); setLanguageOpen(false); }} className='fixed inset-0 z-[80] bg-base-black/45 transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none' />
        <Drawer.Viewport className='pointer-events-none fixed inset-0 z-[81] flex items-end'>
          <Drawer.Popup className={sheet}>
            <div aria-hidden='true' className='mx-auto my-3 h-1.5 w-10 rounded-full bg-divider' />
            <Drawer.Content className='mx-auto max-w-md px-4'>
              <div className='mb-3 flex items-center justify-between gap-3'>
                <Drawer.Title className='typo-h4'>{t('sections.profile')}</Drawer.Title>
                <Drawer.Close aria-label={t('closeProfileMenu')} className='flex size-11 items-center justify-center rounded-lg hover:bg-disabled'><XMarkIcon aria-hidden='true' className='size-6' /></Drawer.Close>
              </div>
              <div className='mb-3 min-w-0 px-3'><p className='truncate font-semibold'>{user.name}</p><p className='truncate typo-body-small text-text-secondary'>{user.email}</p></div>
              <Link href='/dashboard/settings/profile' onClick={closeAndNavigate} className={row}><UserIcon aria-hidden='true' className='size-5' />{t('sections.profile')}</Link>
              <Link href='/dashboard/settings' onClick={closeAndNavigate} className={row}><Cog6ToothIcon aria-hidden='true' className='size-5' />{t('sections.settings')}</Link>
              <Drawer.Root open={languageOpen} onOpenChange={setLanguageOpen} swipeDirection='down'>
                <Drawer.Trigger className={row}><GlobeAltIcon aria-hidden='true' className='size-5' />{t('language')}<span className='ml-auto typo-body-small text-text-secondary'>{languageT(`languages.${locale}`)}</span><ChevronRightIcon aria-hidden='true' className='size-5' /></Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Backdrop forceRender onClick={(event) => { event.stopPropagation(); setLanguageOpen(false); }} className='fixed inset-0 z-[82] bg-base-black/30 transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none' />
                  <Drawer.Viewport className='pointer-events-none fixed inset-0 z-[83] flex items-end'>
                    <Drawer.Popup className={sheet}>
                      <div aria-hidden='true' className='mx-auto my-3 h-1.5 w-10 rounded-full bg-divider' />
                      <Drawer.Content className='mx-auto max-w-md px-4'>
                        <div className='mb-3 flex items-center justify-between gap-3'><Drawer.Title className='typo-h4'>{languageT('title')}</Drawer.Title><Drawer.Close aria-label={t('closeLanguageMenu')} className='flex size-11 items-center justify-center rounded-lg hover:bg-disabled'><XMarkIcon aria-hidden='true' className='size-6' /></Drawer.Close></div>
                        <LocaleOptions onSelect={() => setLanguageOpen(false)} />
                      </Drawer.Content>
                    </Drawer.Popup>
                  </Drawer.Viewport>
                </Drawer.Portal>
              </Drawer.Root>
              <div className='my-3 h-px bg-divider' />
              <button type='button' disabled={loggingOut} onClick={handleLogout} className={`${row} disabled:opacity-50`}><ArrowRightStartOnRectangleIcon aria-hidden='true' className='size-5' />{loggingOut ? logout('pending') : logout('submit')}</button>
              {error && <p role='alert' className='px-3 py-2 typo-body-small text-red-700'>{error}</p>}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
