import { getLocale, getTranslations } from 'next-intl/server';
import { getCurrentSession } from '@/data/auth';
import { redirect } from '@/i18n/navigation';
import { getDashboardMetadata } from '@/lib/dashboard-metadata';

export async function generateMetadata() {
  return getDashboardMetadata('Profile', '/dashboard/settings/profile');
}

export default async function ProfilePage() {
  const [session, locale, t] = await Promise.all([getCurrentSession(), getLocale(), getTranslations('Dashboard.Profile')]);
  if (!session) return redirect({ href: '/login', locale });
  return (
    <section className='flex max-w-3xl flex-col gap-6'>
      <div className='rounded-xl border border-divider bg-base-white p-5 sm:p-6'>
        <dl className='flex flex-col gap-5'>
          <div><dt className='typo-body-small text-text-secondary'>{t('name')}</dt><dd className='mt-1 break-words typo-body font-semibold'>{session.user.name}</dd></div>
          <div><dt className='typo-body-small text-text-secondary'>{t('email')}</dt><dd className='mt-1 break-all typo-body font-semibold'>{session.user.email}</dd></div>
        </dl>
        <p className='mt-6 rounded-lg bg-disabled p-3 typo-body-small text-text-secondary'>{t('comingSoon')}</p>
      </div>
    </section>
  );
}
