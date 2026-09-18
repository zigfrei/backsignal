import { getLocale, getTranslations } from 'next-intl/server';

import { LoginForm } from '@/components/auth/login-form';
import { getCurrentSession } from '@/data/auth';
import { redirect } from '@/i18n/navigation';
import { getOAuthErrorMessageKey } from '@/lib/auth-oauth-errors';
import { getAuthMetadata } from '@/lib/auth-metadata';

export async function generateMetadata() {
  return getAuthMetadata('Login');
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [session, locale, t, { error }] = await Promise.all([
    getCurrentSession(),
    getLocale(),
    getTranslations('Auth.Login'),
    searchParams,
  ]);

  if (session) {
    redirect({ href: '/dashboard', locale });
  }

  const oauthErrorKey = getOAuthErrorMessageKey(error);

  return (
    <main className='flex w-full flex-1 shrink-0 items-center justify-center px-4 pt-28 pb-8 lg:pb-0 lg:pt-20'>
      <section className='w-full max-w-md rounded-xl bg-base-white p-6'>
        <h1 className='mb-2 typo-h2'>{t('title')}</h1>
        <p className='mb-6 text-text-secondary'>{t('description')}</p>
        {oauthErrorKey ? (
          <p className='mb-5 text-red-700' role='alert'>
            {t(`oauthErrors.${oauthErrorKey}`)}
          </p>
        ) : null}
        <LoginForm />
      </section>
    </main>
  );
}
