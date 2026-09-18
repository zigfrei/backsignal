import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

const siteUrl = 'https://backsignal.tech';

export async function getDashboardMetadata(
  section: 'Settings' | 'Profile',
  path: string,
): Promise<Metadata> {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations('Meta.Dashboard'),
  ]);
  const pathname = locale === 'ru' ? path : `/${locale}${path}`;
  const title = t(`${section}.title`);
  const description = t(`${section}.description`);

  return {
    title,
    description,
    alternates: {
      canonical: new URL(pathname, siteUrl).toString(),
      languages: {
        ru: new URL(path, siteUrl).toString(),
        en: new URL(`/en${path}`, siteUrl).toString(),
      },
    },
    openGraph: {
      title,
      description,
      url: new URL(pathname, siteUrl).toString(),
      siteName: t('siteName'),
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      type: 'website',
      images: [{
        url: new URL(t('openGraphImagePath'), siteUrl).toString(),
        width: 1200,
        height: 630,
        alt: t('openGraphAlt'),
      }],
    },
  };
}
