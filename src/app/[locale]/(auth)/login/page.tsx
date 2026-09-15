import { getTranslations } from 'next-intl/server';

import { LoginForm } from '@/components/auth/login-form';

export default async function LoginPage() {
  const t = await getTranslations('Auth.Login');

  return (
    <main className='flex w-full h-full items-center justify-center px-4 pt-20'>
      <section className='w-full max-w-md rounded-xl bg-base-white p-6'>
        <h1 className='mb-2 typo-h2'>{t('title')}</h1>
        <p className='mb-6 text-text-secondary'>{t('description')}</p>
        <LoginForm />
      </section>
    </main>
  );
}
