'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import YandexIcon from '@/assets/icons/ya.svg';
import { getPathname } from '@/i18n/navigation';
import { signIn } from '@/lib/auth-client';

export function YandexAuthButton() {
  const locale = useLocale();
  const t = useTranslations('Auth.Yandex');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();

  const handleSignIn = async () => {
    setError(undefined);
    setIsPending(true);

    const { error: signInError } = await signIn.social({
      provider: 'yandex',
      callbackURL: getPathname({ locale, href: '/dashboard' }),
      errorCallbackURL: getPathname({ locale, href: '/login' }),
    });

    if (signInError) {
      setError(t('startError'));
      setIsPending(false);
    }
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-3' aria-hidden='true'>
        <span className='h-px flex-1 bg-quaternary' />
        <span className='typo-body-small text-text-secondary'>{t('or')}</span>
        <span className='h-px flex-1 bg-quaternary' />
      </div>

      <button
        type='button'
        disabled={isPending}
        onClick={handleSignIn}
        className='flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-black px-[1.625rem] text-base font-medium leading-5 text-white outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
      >
        <YandexIcon
          aria-hidden='true'
          className='size-[1.625rem] shrink-0'
        />
        {isPending ? t('pending') : t('submit')}
      </button>

      {error ? (
        <p className='text-red-700' role='alert'>
          {error}
        </p>
      ) : null}
    </div>
  );
}
