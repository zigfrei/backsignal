import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

const siteUrl = 'https://backsignal.tech';
const sections = ['operator', 'data', 'purposes', 'sharing', 'storage', 'rights', 'cookies'] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Meta.Policy');
  const pathname = locale === 'ru' ? '/policy' : '/en/policy';

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: pathname,
      languages: { ru: '/policy', en: '/en/policy' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
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
    robots: { index: false, follow: false },
  };
}

export default async function PolicyPage() {
  const t = await getTranslations('Policy');

  return (
    <main className='w-full flex-1 px-4 pb-12 sm:px-6 lg:pb-20 pt-28'>
      <article className='mx-auto max-w-3xl text-text-primary'>
        <h1 className='typo-h1 whitespace-pre-line max-sm:text-[clamp(1.4rem,7vw,2.25rem)] max-sm:leading-tight'>{t('title')}</h1>
        <p className='mt-4 typo-body text-text-secondary'>{t('intro')}</p>
        <div className='mt-10 space-y-9'>
          {sections.map((section) => (
            <section key={section} aria-labelledby={`policy-${section}`}>
              <h2 id={`policy-${section}`} className='typo-h3'>
                {t(`sections.${section}.title`)}
              </h2>
              <p className='mt-3 whitespace-pre-line typo-body text-text-secondary'>
                {t(`sections.${section}.body`)}
              </p>
            </section>
          ))}
        </div>
        <p className='mt-10 typo-body-small text-text-secondary'>{t('updated')}</p>
      </article>
    </main>
  );
}
