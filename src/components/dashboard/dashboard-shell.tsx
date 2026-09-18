'use client';

import type { ReactNode } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { DashboardSidebar, type DashboardUser } from './dashboard-sidebar';
import { DashboardMobileMenu } from './dashboard-mobile-menu';
import { DashboardProfileDrawer } from './dashboard-profile-drawer';
import { DashboardUnreadContext } from './dashboard-unread-context';
import { DashboardRefresh } from './dashboard-refresh';
import { useRouter } from 'next/navigation';

export function DashboardShell({
  user,
  children,
  unreadCount = 0,
}: {
  user: DashboardUser;
  children: ReactNode;
  unreadCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const section =
    pathname === '/dashboard/qr-code'
      ? 'qrCode'
      : pathname === '/dashboard/qr'
      ? 'qr'
      : pathname === '/dashboard/settings/profile'
      ? 'profile'
      : pathname.startsWith('/dashboard/settings')
        ? 'settings'
        : 'messages';
  return (
    <DashboardUnreadContext.Provider value={unreadCount}>
      <DashboardRefresh />
      <div className='flex min-h-dvh w-full bg-background-auth bg-circle-decorators'>
        <a
          href='#dashboard-content'
          className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-base-white focus:p-3 focus:text-primary'
        >
          {t('skipToContent')}
        </a>
        <aside className='sticky top-0 hidden h-dvh w-64 shrink-0 overflow-y-auto border-r border-divider bg-base-white lg:block'>
          <DashboardSidebar user={user} />
        </aside>
        <div className='flex min-w-0 flex-1 flex-col'>
          <header className='flex min-h-20 shrink-0 items-center gap-3 border-b border-divider bg-base-white px-4 lg:px-8'>
            <DashboardMobileMenu user={user} />
            <h1 id='dashboard-page-title' className='min-w-0 flex-1 typo-h3 lg:typo-h2 text-text-primary'>
              {t(`sections.${section}`)}
            </h1>
            <div className='flex shrink-0 items-center gap-2 lg:hidden'>
              <Link
                href='/dashboard'
                onClick={(event) => {
                  if (pathname === '/dashboard' && event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
                    event.preventDefault();
                    router.refresh();
                  }
                }}
                aria-label={`${t('sections.messages')}. ${t('Messages.unreadCount', { count: unreadCount })}`}
                className='relative flex size-11 items-center justify-center rounded-lg text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary'
              >
                <EnvelopeIcon aria-hidden='true' className='size-7' />
                {unreadCount > 0 && (
                  <span aria-hidden='true' className='absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold leading-none text-white'>
                    {unreadCount}
                  </span>
                )}
              </Link>
              <DashboardProfileDrawer user={user} compact />
            </div>
          </header>
          <main
            id='dashboard-content'
            aria-labelledby='dashboard-page-title'
            tabIndex={-1}
            className='mx-auto w-full min-w-0 max-w-6xl flex-1 p-4 outline-none sm:p-6 lg:p-8'
          >
            {children}
          </main>
        </div>
      </div>
    </DashboardUnreadContext.Provider>
  );
}
