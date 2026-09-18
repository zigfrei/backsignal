import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getCurrentSession } from '@/data/auth';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { getUserOnboarding } from '@/data/onboarding';
import { OnboardingDialog } from '@/components/dashboard/onboarding-dialog';
import { countUnreadOrganizationMessages } from '@/data/messages';
import { LocalePreferenceSync } from '@/components/dashboard/locale-preference-sync';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, locale] = await Promise.all([
    getCurrentSession(),
    getLocale(),
  ]);
  if (!session) return redirect({ href: '/login', locale });
  const onboarding = await getUserOnboarding(session.user.id);
  const unreadCount = onboarding.summary ? await countUnreadOrganizationMessages(session.user.id, onboarding.summary.organizationId) : 0;
  return (
    <DashboardShell
      unreadCount={unreadCount}
      user={{ name: session.user.name, email: session.user.email, image: session.user.image }}
    >
      {children}
      <LocalePreferenceSync />
      <OnboardingDialog {...onboarding} />
    </DashboardShell>
  );
}
