'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import clsx from 'clsx';

import { useRouter } from '@/i18n/navigation';
import { signOut } from '@/lib/auth-client';

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const t = useTranslations('Auth.Logout');
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setError(undefined);
    setIsPending(true);

    const { error: logoutError } = await signOut();

    if (logoutError) {
      setError(t('error'));
      setIsPending(false);
      return;
    }

    router.replace('/login');
    router.refresh();
  };

  return (
    <div className='flex flex-col items-start gap-2'>
      <button
        type='button'
        disabled={isPending}
        className={clsx(
          'min-h-11 rounded-lg border border-primary px-5 py-2.5 text-primary disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        onClick={handleLogout}
      >
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
