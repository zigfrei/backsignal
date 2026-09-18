'use client';

import { Menu } from '@base-ui/react/menu';
import {
  ArrowRightStartOnRectangleIcon,
  CheckIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
  GlobeAltIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { useLocaleNavigation } from '@/components/layout/locale-switcher/use-locale-navigation';
import { useDashboardLogout } from './use-dashboard-logout';
import type { DashboardUser } from './dashboard-sidebar';

const item =
  'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 typo-body-small outline-none transition-colors data-highlighted:bg-primary/10 data-highlighted:text-primary data-disabled:opacity-50';
const popup =
  'max-w-[calc(100vw-2rem)] rounded-xl border border-divider bg-base-white p-2 text-text-primary shadow-lg outline-none transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none';

export function DashboardProfileMenu({
  user,
  onNavigate,
}: {
  user: DashboardUser;
  onNavigate?: () => void;
}) {
  const t = useTranslations('Dashboard');
  const languages = useTranslations('Layout.LocaleSwitcher.languages');
  const logout = useTranslations('Auth.Logout');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const { changeLocale, isPending: pending } = useLocaleNavigation(() => setOpen(false));
  const { loggingOut, error, handleLogout } = useDashboardLogout(() => {
    setOpen(false);
    onNavigate?.();
  });
  const [failedImage, setFailedImage] = useState<string>();

  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      <Menu.Trigger
        aria-label={t('profileMenu')}
        className='flex min-h-12 w-full min-w-0 cursor-pointer items-center gap-3 rounded-lg p-2 text-left hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary'
      >
        {user.image && failedImage !== user.image ? (
          <Image
            src={user.image}
            alt=''
            width={40}
            height={40}
            unoptimized
            onError={() => setFailedImage(user.image!)}
            className='size-10 shrink-0 rounded-full object-cover'
          />
        ) : (
          <UserCircleIcon
            aria-hidden='true'
            className='size-10 shrink-0 text-primary'
          />
        )}
        <span className='min-w-0 flex-1'>
          <span className='block truncate typo-body-small font-semibold'>
            {user.name}
          </span>
          <span className='block truncate typo-caption text-text-secondary'>
            {user.email}
          </span>
        </span>
        <EllipsisVerticalIcon aria-hidden='true' className='size-5 shrink-0' />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          side='top'
          align='start'
          sideOffset={8}
          collisionPadding={16}
          className='z-[85]'
        >
          <Menu.Popup className={`${popup} w-64`}>
            <div className='min-w-0 px-3 py-2'>
              <p className='truncate typo-body-small font-semibold'>
                {user.name}
              </p>
              <p className='truncate typo-caption text-text-secondary'>
                {user.email}
              </p>
            </div>
            <Menu.Separator className='my-2 h-px bg-divider' />
            <Menu.LinkItem
              closeOnClick
              render={
                <Link href='/dashboard/settings/profile' onClick={onNavigate} />
              }
              className={item}
            >
              <UserIcon aria-hidden='true' className='size-5' />
              {t('sections.profile')}
            </Menu.LinkItem>
            <Menu.LinkItem
              closeOnClick
              render={<Link href='/dashboard/settings' onClick={onNavigate} />}
              className={item}
            >
              <Cog6ToothIcon aria-hidden='true' className='size-5' />
              {t('sections.settings')}
            </Menu.LinkItem>
            <Menu.SubmenuRoot>
              <Menu.SubmenuTrigger className={item}>
                <GlobeAltIcon aria-hidden='true' className='size-5' />
                {t('language')}
                <span className='ml-auto typo-caption uppercase'>{locale}</span>
                <ChevronRightIcon aria-hidden='true' className='size-4' />
              </Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner
                  side='right'
                  align='start'
                  sideOffset={8}
                  collisionPadding={16}
                  className='z-[86]'
                >
                  <Menu.Popup className={`${popup} w-44`}>
                    <Menu.RadioGroup
                      value={locale}
                      onValueChange={(value) => changeLocale(value as Locale)}
                    >
                      {routing.locales.map((language) => (
                        <Menu.RadioItem
                          key={language}
                          value={language}
                          disabled={pending}
                          closeOnClick={false}
                          className={item}
                        >
                          <span>{languages(language)}</span>
                          <Menu.RadioItemIndicator className='ml-auto'>
                            <CheckIcon
                              aria-hidden='true'
                              className='size-5 text-primary'
                            />
                          </Menu.RadioItemIndicator>
                        </Menu.RadioItem>
                      ))}
                    </Menu.RadioGroup>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.SubmenuRoot>
            <Menu.Separator className='my-2 h-px bg-divider' />
            <Menu.Item
              disabled={loggingOut}
              closeOnClick={false}
              onClick={handleLogout}
              className={item}
            >
              <ArrowRightStartOnRectangleIcon
                aria-hidden='true'
                className='size-5'
              />
              {loggingOut ? logout('pending') : logout('submit')}
            </Menu.Item>
            {error ? (
              <p role='alert' className='px-3 py-2 typo-caption text-red-700'>
                {error}
              </p>
            ) : null}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
