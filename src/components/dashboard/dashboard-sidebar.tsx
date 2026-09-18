'use client';

import { useLocale, useTranslations } from 'next-intl';
import Logo from '@/assets/icons/logo.svg';
import EnLogo from '@/assets/icons/en/logo.svg';
import { Link } from '@/i18n/navigation';
import { DashboardProfileMenu } from './dashboard-profile-menu';
import { DashboardProfileDrawer } from './dashboard-profile-drawer';
import { DashboardNavigation } from './dashboard-navigation';

export interface DashboardUser {
  name: string;
  email: string;
  image?: string | null;
}

export function DashboardSidebar({
  user,
  onNavigate,
}: {
  user: DashboardUser;
  onNavigate?: () => void;
}) {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const LogoComponent = locale === 'en' ? EnLogo : Logo;
  return (
    <div className='flex min-h-full flex-col gap-8 p-5'>
      <Link
        href='/dashboard'
        aria-label={t('home')}
        onClick={onNavigate}
        className='flex lg:justify-center'
      >
        <LogoComponent className='h-auto w-full max-w-52' />
      </Link>
      <DashboardNavigation onNavigate={onNavigate} />
      <div className='mt-auto flex flex-col gap-4 border-t border-divider pt-5'>
        <div className='hidden lg:block'>
          <DashboardProfileMenu user={user} onNavigate={onNavigate} />
        </div>
        <div className='lg:hidden'>
          <DashboardProfileDrawer user={user} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
