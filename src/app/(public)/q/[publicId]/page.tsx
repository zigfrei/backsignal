import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPublicFeedbackContext } from '@/data/public-feedback';
import { PublicFeedbackForm } from '@/components/public-feedback/public-feedback-form';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicId: string }>;
}): Promise<Metadata> {
  const { publicId } = await params;
  const { locale, name } = await getPublicFeedbackContext(publicId);
  const t = await getTranslations({ locale, namespace: 'PublicFeedback' });
  const title = name ? t('metaTitleWithName', { name }) : t('metaTitle');
  const description = name
    ? t('metaDescriptionWithName', { name })
    : t('metaDescription');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://backsignal.tech/q/${publicId}`,
      siteName: locale === 'ru' ? 'Обратный сигнал' : 'Back signal',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      type: 'website',
      images: [locale === 'ru' ? 'https://backsignal.tech/og-image.png' : 'https://backsignal.tech/en/og-image.png'],
    },
  };
}

export default async function PublicFeedbackPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  const { locale, name } = await getPublicFeedbackContext(publicId);
  const t = await getTranslations({ locale, namespace: 'PublicFeedback' });
  if (!name)
    return (
      <main className='mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6'>
        <h1 className='typo-h2'>{t('unavailableTitle')}</h1>
        <p className='text-text-secondary'>{t('unavailableDescription')}</p>
      </main>
    );
  return <PublicFeedbackForm key={publicId} publicId={publicId} name={name} />;
}
