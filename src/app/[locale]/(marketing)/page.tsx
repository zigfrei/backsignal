import FAQ from '@/components/sections/main/faq';
import Hero from '@/components/sections/main/hero';
import ForWhat from '@/components/sections/main/for-what';
import type { Metadata } from 'next';
import HowItWorks from '@/components/sections/main/how-it-works';
import CTA from '@/components/sections/main/cta';
import Feedback from '@/components/sections/main/feedback';
import { getLocale, getTranslations } from 'next-intl/server';

import { faqItemKeys } from '@/lib/landing-faq';

const siteUrl = 'https://backsignal.tech';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Meta.Landing');
  const pathname = locale === 'ru' ? '/' : `/${locale}`;

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: pathname,
      languages: {
        ru: '/',
        en: '/en',
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

export default async function Home() {
  const [locale, faq, meta] = await Promise.all([
    getLocale(),
    getTranslations('Landing.FAQ'),
    getTranslations('Meta.Landing'),
  ]);
  const pageUrl = new URL(locale === 'ru' ? '/' : '/en', siteUrl).toString();
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    url: pageUrl,
    inLanguage: locale,
    mainEntity: faqItemKeys.map((key) => ({
      '@type': 'Question',
      name: faq(`items.${key}.question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq(`items.${key}.answer`),
      },
    })),
  };
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: meta('siteName'),
    url: siteUrl,
    description: meta('description'),
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqSchema, organizationSchema]).replace(
            /</g,
            '\\u003c',
          ),
        }}
      />
      <main className='flex flex-col items-center justify-center w-full pt-20'>
        <Hero />
        <ForWhat />
        <HowItWorks />
        <CTA />
        <FAQ />
        <Feedback />
      </main>
    </>
  );
}
