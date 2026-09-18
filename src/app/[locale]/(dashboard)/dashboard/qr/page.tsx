import { getLocale, getTranslations } from 'next-intl/server';
import { getCurrentSession } from '@/data/auth';
import { getUserOnboarding } from '@/data/onboarding';
import { redirect } from '@/i18n/navigation';
import { QrMaterials } from '@/components/dashboard/qr-materials';

export async function generateMetadata() {
  const t = await getTranslations('Dashboard.Qr');
  return { title: t('title'), description: t('description') };
}

export default async function QrPage() {
  const session = await getCurrentSession();
  const locale = await getLocale();
  if (!session) return redirect({ href: '/login', locale });
  const { summary } = await getUserOnboarding(session.user.id);
  if (!summary) return redirect({ href: '/dashboard', locale });
  return <QrMaterials summary={summary} />;
}
