import { getLocale, getTranslations } from 'next-intl/server';
import { getCurrentSession } from '@/data/auth';
import { getUserOnboarding } from '@/data/onboarding';
import { redirect } from '@/i18n/navigation';
import { OnboardingQr } from '@/components/dashboard/onboarding-qr';

export async function generateMetadata() {
  const t = await getTranslations('Dashboard.QrCode');
  return { title: t('title'), description: t('description') };
}

export default async function QrCodePage() {
  const session = await getCurrentSession();
  const locale = await getLocale();
  if (!session) return redirect({ href: '/login', locale });
  const { summary } = await getUserOnboarding(session.user.id);
  if (!summary) return redirect({ href: '/dashboard', locale });
  const t = await getTranslations('Dashboard.QrCode');
  return (
    <section className='flex max-w-3xl flex-col gap-6 rounded-xl border border-divider bg-base-white p-5 sm:p-6'>
      <p className='text-text-secondary'>{t('description')}</p>
      <OnboardingQr summary={summary} />
    </section>
  );
}
