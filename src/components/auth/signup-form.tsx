'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getPathname, Link } from '@/i18n/navigation';
import { signUp } from '@/lib/auth-client';
import { FormField } from '@/components/ui/form-field';

export function SignupForm() {
  const t = useTranslations('Auth.Signup');
  const fieldT = useTranslations('Auth.Fields');
  const locale = useLocale();
  const [formError, setFormError] = useState<string>();
  const [isSuccess, setIsSuccess] = useState(false);
  const schema = z.object({
    name: z.string().trim().min(2, t('errors.name')),
    email: z.email(t('errors.email')),
    password: z.string().min(8, t('errors.password')),
  });
  type SignupValues = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(undefined);

    const { error } = await signUp.email({
      ...values,
      callbackURL: getPathname({ locale, href: '/dashboard' }),
    });

    if (error) {
      const isExistingUser =
        error.code === 'USER_ALREADY_EXISTS' ||
        error.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL';

      setFormError(
        isExistingUser ? t('errors.userAlreadyExists') : t('errors.default'),
      );
      return;
    }

    setIsSuccess(true);
  });

  if (isSuccess) {
    return <p role='status'>{t('success')}</p>;
  }

  return (
    <form className='flex flex-col gap-5' onSubmit={onSubmit} noValidate>
      <FormField
        id='signup-name'
        label={t('name')}
        type='text'
        autoComplete='name'
        error={errors.name}
        {...register('name')}
      />
      <FormField
        id='signup-email'
        label={t('email')}
        type='email'
        autoComplete='email'
        error={errors.email}
        {...register('email')}
      />
      <FormField
        id='signup-password'
        label={t('password')}
        type='password'
        autoComplete='new-password'
        error={errors.password}
        showPasswordLabel={fieldT('showPassword')}
        hidePasswordLabel={fieldT('hidePassword')}
        {...register('password')}
      />

      {formError ? <p className='text-red-700' role='alert'>{formError}</p> : null}

      <button
        type='submit'
        disabled={isSubmitting}
        className='min-h-11 rounded-lg bg-primary px-5 py-2.5 text-base-white disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </button>

      <p className='typo-body-small'>
        {t('hasAccount')}{' '}
        <Link href='/login' className='text-primary underline'>
          {t('login')}
        </Link>
      </p>
    </form>
  );
}
