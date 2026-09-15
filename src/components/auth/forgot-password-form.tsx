'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormField } from '@/components/ui/form-field';
import { getPathname, Link } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

export function ForgotPasswordForm() {
  const t = useTranslations('Auth.ForgotPassword');
  const locale = useLocale();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string>();
  const schema = z.object({
    email: z.email(t('errors.email')),
  });
  type ForgotPasswordValues = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async ({ email }) => {
    setFormError(undefined);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: getPathname({ locale, href: '/reset-password' }),
    });

    if (error) {
      setFormError(t('errors.default'));
      return;
    }

    setIsSuccess(true);
  });

  if (isSuccess) {
    return (
      <div className='flex flex-col gap-4'>
        <p role='status'>{t('success')}</p>
        <Link href='/login' className='text-primary underline'>
          {t('backToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <form className='flex flex-col gap-5' onSubmit={onSubmit} noValidate>
      <FormField
        id='forgot-password-email'
        label={t('email')}
        type='email'
        autoComplete='email'
        error={errors.email}
        {...register('email')}
      />

      {formError ? <p className='text-red-700' role='alert'>{formError}</p> : null}

      <button
        type='submit'
        disabled={isSubmitting}
        className='min-h-11 rounded-lg bg-primary px-5 py-2.5 text-base-white disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
