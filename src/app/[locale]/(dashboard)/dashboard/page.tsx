import { getLocale, getTranslations } from 'next-intl/server';

import { LogoutButton } from '@/components/auth/logout-button';
import { getCurrentSession } from '@/data/auth';
import { redirect } from '@/i18n/navigation';

export default async function DashboardPage() {
  const [session, locale, t] = await Promise.all([
    getCurrentSession(),
    getLocale(),
    getTranslations('Dashboard'),
  ]);

  if (!session) {
    return redirect({ href: '/login', locale });
  }

  return (
    <main className='flex min-h-screen w-full items-center justify-center px-4 pt-20'>
      <section className='w-full max-w-xl rounded-xl bg-base-white p-6'>
        <h1 className='mb-6 typo-h2'>{t('title')}</h1>
        <dl className='mb-6 grid gap-3'>
          <div>
            <dt className='font-semibold'>{t('name')}</dt>
            <dd>{session.user.name}</dd>
          </div>
          <div>
            <dt className='font-semibold'>{t('email')}</dt>
            <dd>{session.user.email}</dd>
          </div>
        </dl>
        <LogoutButton />
      </section>
    </main>
  );
}
