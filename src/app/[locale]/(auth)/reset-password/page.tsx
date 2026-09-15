import { getTranslations } from 'next-intl/server';

import { ResetPasswordForm } from '@/components/auth/reset-password-form';

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const [{ token, error }, t] = await Promise.all([
    searchParams,
    getTranslations('Auth.ResetPassword'),
  ]);

  return (
    <main className='flex min-h-0 w-full flex-1 items-center justify-center px-4'>
      <section className='w-full max-w-md rounded-xl bg-base-white p-6'>
        <h1 className='mb-2 typo-h2'>{t('title')}</h1>
        <p className='mb-6 text-text-secondary'>{t('description')}</p>
        <ResetPasswordForm
          token={token}
          hasTokenError={error === 'INVALID_TOKEN'}
        />
      </section>
    </main>
  );
}
