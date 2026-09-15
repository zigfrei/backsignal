import { getTranslations } from 'next-intl/server';

import { SignupForm } from '@/components/auth/signup-form';

export default async function SignupPage() {
  const t = await getTranslations('Auth.Signup');

  return (
    <main className='flex w-full h-full items-center justify-center px-4 pt-20'>
      <section className='w-full max-w-md rounded-xl bg-base-white p-6'>
        <h1 className='mb-2 typo-h2'>{t('title')}</h1>
        <p className='mb-6 text-text-secondary'>{t('description')}</p>
        <SignupForm />
      </section>
    </main>
  );
}
