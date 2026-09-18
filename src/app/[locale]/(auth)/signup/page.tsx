import { getLocale, getTranslations } from 'next-intl/server';

import { SignupForm } from '@/components/auth/signup-form';
import { getCurrentSession } from '@/data/auth';
import { redirect } from '@/i18n/navigation';
import { getAuthMetadata } from '@/lib/auth-metadata';

export async function generateMetadata() {
  return getAuthMetadata('Signup');
}

export default async function SignupPage() {
  const [session, locale, t] = await Promise.all([
    getCurrentSession(),
    getLocale(),
    getTranslations('Auth.Signup'),
  ]);

  if (session) {
    redirect({ href: '/dashboard', locale });
  }

  return (
    <main className='flex w-full flex-1 shrink-0 items-center justify-center px-4 pt-28 pb-8 lg:pb-0 lg:pt-20'>
      <section className='w-full max-w-md rounded-xl bg-base-white p-6'>
        <h1 className='mb-2 typo-h2'>{t('title')}</h1>
        <p className='mb-6 text-text-secondary'>{t('description')}</p>
        <SignupForm />
      </section>
    </main>
  );
}
