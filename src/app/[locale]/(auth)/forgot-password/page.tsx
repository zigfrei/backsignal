import { getTranslations } from 'next-intl/server';

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { getAuthMetadata } from '@/lib/auth-metadata';

export async function generateMetadata() {
  return getAuthMetadata('ForgotPassword');
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations('Auth.ForgotPassword');

  return (
    <main className='flex w-full flex-1 shrink-0 items-center justify-center px-4 pt-28 pb-8 lg:pb-0 lg:pt-20'>
      <section className='w-full max-w-md rounded-xl bg-base-white p-6'>
        <h1 className='mb-2 typo-h2'>{t('title')}</h1>
        <p className='mb-6 text-text-secondary'>{t('description')}</p>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
