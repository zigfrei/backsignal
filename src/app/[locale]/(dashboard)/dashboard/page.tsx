import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { MessagesList } from '@/components/dashboard/messages-list';
import { getCurrentSession } from '@/data/auth';
import { getUserOnboarding } from '@/data/onboarding';
import { getOrganizationMessagesPage, getOrganizationMessage } from '@/data/messages';
import { redirect } from '@/i18n/navigation';

const siteUrl = 'https://backsignal.tech';

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations('Meta.Dashboard'),
  ]);
  const pathname = locale === 'ru' ? '/dashboard' : `/${locale}/dashboard`;

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: new URL(pathname, siteUrl).toString(),
      languages: {
        ru: new URL('/dashboard', siteUrl).toString(),
        en: new URL('/en/dashboard', siteUrl).toString(),
      },
    },
    openGraph: {
      title: t('title'),
      description: t('openGraphDescription'),
      url: new URL(pathname, siteUrl).toString(),
      siteName: t('siteName'),
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      type: 'website',
      images: [
        {
          url: new URL(t('openGraphImagePath'), siteUrl).toString(),
          width: 1200,
          height: 630,
          alt: t('openGraphAlt'),
        },
      ],
    },
  };
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ page?: string | string[]; message?: string | string[] }> }) {
  const session = await getCurrentSession();
  if (!session) return redirect({ href: '/login', locale: await getLocale() });
  const onboarding = await getUserOnboarding(session.user.id);
  const query = await searchParams;
  const requestedPage = Number(query.page ?? 1);
  const selectedId = typeof query.message === 'string' && query.message.length <= 128 ? query.message : undefined;
  const result = onboarding.summary
    ? await getOrganizationMessagesPage(session.user.id, onboarding.summary.organizationId, requestedPage)
    : { messages: [], total: 0, page: 1, pages: 1 };
  const selected = selectedId && onboarding.summary ? await getOrganizationMessage(session.user.id, onboarding.summary.organizationId, selectedId) : null;
  if (selected && !result.messages.some((message) => message.id === selected.id)) result.messages.unshift(selected);
  return <MessagesList {...result} expandedMessageId={selected?.id} />;
}
