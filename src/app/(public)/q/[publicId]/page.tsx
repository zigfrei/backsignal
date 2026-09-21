import { getTranslations } from 'next-intl/server';
import { getPublicFeedbackContext } from '@/data/public-feedback';
import { PublicFeedbackForm } from '@/components/public-feedback/public-feedback-form';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { locale } = await getPublicFeedbackContext((await params).publicId);
  const t = await getTranslations({ locale, namespace: 'PublicFeedback' });
  return { title: t('metaTitle'), description: t('metaDescription') };
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
