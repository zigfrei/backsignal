'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormField } from '@/components/ui/form-field';
import { Link } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

interface ResetPasswordFormProps {
  token?: string;
  hasTokenError: boolean;
}

export function ResetPasswordForm({
  token,
  hasTokenError,
}: ResetPasswordFormProps) {
  const t = useTranslations('Auth.ResetPassword');
  const fieldT = useTranslations('Auth.Fields');
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string>();
  const schema = z
    .object({
      password: z.string().min(8, t('errors.password')),
      passwordConfirmation: z.string().min(1, t('errors.confirmation')),
    })
    .refine((values) => values.password === values.passwordConfirmation, {
      path: ['passwordConfirmation'],
      message: t('errors.mismatch'),
    });
  type ResetPasswordValues = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(schema) });

  if (!token || hasTokenError) {
    return (
      <div className='flex flex-col gap-4'>
        <p className='text-red-700' role='alert'>{t('invalidToken')}</p>
        <Link href='/forgot-password' className='text-primary underline'>
          {t('requestAgain')}
        </Link>
      </div>
    );
  }

  const onSubmit = handleSubmit(async ({ password }) => {
    setFormError(undefined);

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
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
          {t('login')}
        </Link>
      </div>
    );
  }

  return (
    <form className='flex flex-col gap-5' onSubmit={onSubmit} noValidate>
      <FormField
        id='reset-password'
        label={t('password')}
        type='password'
        autoComplete='new-password'
        error={errors.password}
        showPasswordLabel={fieldT('showPassword')}
        hidePasswordLabel={fieldT('hidePassword')}
        {...register('password')}
      />
      <FormField
        id='reset-password-confirmation'
        label={t('passwordConfirmation')}
        type='password'
        autoComplete='new-password'
        error={errors.passwordConfirmation}
        showPasswordLabel={fieldT('showPassword')}
        hidePasswordLabel={fieldT('hidePassword')}
        {...register('passwordConfirmation')}
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
