import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const t = await getTranslations('Dashboard');

  return (
    <div className='flex h-screen w-full flex-col'>
      <header className='flex h-16 w-full items-center border-b border-quaternary px-4 lg:px-8'>
        <Link href='/dashboard' className='font-semibold text-primary'>
          {t('header')}
        </Link>
      </header>
      {children}
    </div>
  );
}
