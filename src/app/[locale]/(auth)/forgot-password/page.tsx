import { getTranslations } from 'next-intl/server';

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default async function ForgotPasswordPage() {
  const t = await getTranslations('Auth.ForgotPassword');

  return (
    <main className='flex min-h-0 w-full flex-1 items-center justify-center px-4'>
      <section className='w-full max-w-md rounded-xl bg-base-white p-6'>
        <h1 className='mb-2 typo-h2'>{t('title')}</h1>
        <p className='mb-6 text-text-secondary'>{t('description')}</p>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
