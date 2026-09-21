import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getDashboardMetadata } from '@/lib/dashboard-metadata';
import { getCurrentSession } from '@/data/auth';
import { getUserOnboarding } from '@/data/onboarding';
import { OnboardingQr } from '@/components/dashboard/onboarding-qr';
import { NotificationSettings } from '@/components/dashboard/notification-settings';
import { getNotificationSettings } from '@/data/email-notifications';
import { getTelegramConnection, telegramConfigured } from '@/data/telegram-connection';
import { TelegramConnectionCard } from '@/components/dashboard/telegram-connection-card';

export async function generateMetadata() {
  return getDashboardMetadata('Settings', '/dashboard/settings');
}

export default async function SettingsPage() {
  const t = await getTranslations('Dashboard.Settings');
  const session = await getCurrentSession();
  const onboarding = session ? await getUserOnboarding(session.user.id) : null;
  const notifications = session && onboarding?.summary ? await getNotificationSettings(session.user.id, onboarding.summary.organizationId) : null;
  const telegram = session && onboarding?.summary ? await getTelegramConnection(session.user.id) : null;
  return (
    <section className='flex max-w-3xl flex-col gap-6'>
      <div className='rounded-xl border border-divider bg-base-white p-5 sm:p-6'>
        <h2 className='typo-h3'>{t('organizationTitle')}</h2>
        {onboarding?.summary && (
          <p className='mt-3 break-words typo-body font-semibold'>
            {onboarding.summary.name}
          </p>
        )}
        <p className='mt-3 typo-body text-text-secondary'>
          {t('organizationDescription')}
        </p>
        <p className='mt-4 rounded-lg bg-disabled p-3 typo-body-small text-text-secondary'>
          {t('comingSoon')}
        </p>
      </div>
      {onboarding?.summary && (
        <div className='rounded-xl border border-divider bg-base-white p-5 sm:p-6'>
          <OnboardingQr summary={onboarding.summary} />
        </div>
      )}
      {notifications && <NotificationSettings settings={notifications} />}
      {telegram && <TelegramConnectionCard initialState={telegram} configured={telegramConfigured()} compact />}
      <Link
        href='/dashboard/settings/profile'
        className='flex min-h-11 items-center rounded-xl border border-divider bg-base-white p-5 font-medium text-primary hover:bg-disabled'
      >
        {t('profileLink')}
      </Link>
    </section>
  );
}
