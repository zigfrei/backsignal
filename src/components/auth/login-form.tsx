'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Link, useRouter } from '@/i18n/navigation';
import { signIn } from '@/lib/auth-client';
import { FormField } from '@/components/ui/form-field';

export function LoginForm() {
  const t = useTranslations('Auth.Login');
  const fieldT = useTranslations('Auth.Fields');
  const router = useRouter();
  const [formError, setFormError] = useState<string>();
  const schema = z.object({
    email: z.email(t('errors.email')),
    password: z.string().min(1, t('errors.password')),
  });
  type LoginValues = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(undefined);

    const { error } = await signIn.email(values);

    if (error) {
      setFormError(
        error.code === 'EMAIL_NOT_VERIFIED'
          ? t('errors.emailNotVerified')
          : t('errors.default'),
      );
      return;
    }

    router.replace('/dashboard');
    router.refresh();
  });

  return (
    <form className='flex flex-col gap-5' onSubmit={onSubmit} noValidate>
      <FormField
        id='login-email'
        label={t('email')}
        type='email'
        autoComplete='email'
        error={errors.email}
        {...register('email')}
      />
      <FormField
        id='login-password'
        label={t('password')}
        type='password'
        autoComplete='current-password'
        error={errors.password}
        showPasswordLabel={fieldT('showPassword')}
        hidePasswordLabel={fieldT('hidePassword')}
        {...register('password')}
      />

      <Link href='/forgot-password' className='self-start text-primary underline'>
        {t('forgotPassword')}
      </Link>

      {formError ? <p className='text-red-700' role='alert'>{formError}</p> : null}

      <button
        type='submit'
        disabled={isSubmitting}
        className='min-h-11 rounded-lg bg-primary px-5 py-2.5 text-base-white disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </button>

      <p className='typo-body-small'>
        {t('noAccount')}{' '}
        <Link href='/signup' className='text-primary underline'>
          {t('signup')}
        </Link>
      </p>
    </form>
  );
}
