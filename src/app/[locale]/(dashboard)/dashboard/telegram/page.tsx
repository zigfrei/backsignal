import { getLocale } from 'next-intl/server';
import { TelegramConnectionCard } from '@/components/dashboard/telegram-connection-card';
import { getCurrentSession } from '@/data/auth';
import { getUserOnboarding } from '@/data/onboarding';
import { getTelegramConnection, telegramConfigured } from '@/data/telegram-connection';
import { redirect } from '@/i18n/navigation';
import { getDashboardMetadata } from '@/lib/dashboard-metadata';

export async function generateMetadata() {
  return getDashboardMetadata('Telegram', '/dashboard/telegram');
}

export default async function TelegramPage() {
  const locale = await getLocale();
  const session = await getCurrentSession();
  if (!session) return redirect({ href: '/login', locale });
  const { summary } = await getUserOnboarding(session.user.id);
  if (!summary) return redirect({ href: '/dashboard', locale });
  const connection = await getTelegramConnection(session.user.id);

  return (
    <div className='max-w-3xl'>
      <TelegramConnectionCard initialState={connection} configured={telegramConfigured()} />
    </div>
  );
}
