'use client';

import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Logo from '@/assets/icons/logo.svg';
import EnLogo from '@/assets/icons/en/logo.svg';
import {
  submitPublicFeedback,
  setPublicFeedbackLocale,
} from '@/actions/public-feedback';
import { moods, feedbackMoodSchema } from '@/lib/public-feedback-schema';
import { MoodIcon } from '@/components/ui/mood-icon';

export function PublicFeedbackForm({
  publicId,
  name,
}: {
  publicId: string;
  name: string;
}) {
  const t = useTranslations('PublicFeedback');
  const locale = useLocale();
  const LogoComponent = locale === 'en' ? EnLogo : Logo;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>();
  const [languagePending, startLanguageTransition] = useTransition();
  const submissionId = useRef<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const schema = z.object({
    text: z.string().trim().min(10, t('textError')).max(3000, t('textError')),
    mood: feedbackMoodSchema,
  });
  type Values = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>, unknown, Values>({
    resolver: zodResolver(schema),
    defaultValues: { text: '' },
  });
  async function submit(values: Values) {
    setError(undefined);
    submissionId.current ??= crypto.randomUUID();
    try {
      const result = await submitPublicFeedback({
        ...values,
        publicId,
        submissionId: submissionId.current,
        locale,
        website: honeypot.current?.value ?? '',
      });
      if (result.success) setSuccess(true);
      else
        setError(
          result.error === 'rateLimit'
            ? t('errors.rateLimit', {
                minutes: Math.ceil((result.retryAfter ?? 60) / 60),
              })
            : t(`errors.${result.error}`),
        );
    } catch {
      setError(t('errors.default'));
    }
  }

  return (
    <main className='mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:justify-center sm:py-10'>
      <header className='mb-8 flex items-center justify-between gap-4'>
        <a
          href={locale === 'en' ? '/en' : '/'}
          aria-label={t('home')}
          className='min-w-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'
        >
          <LogoComponent className='h-14 w-auto max-w-full sm:max-w-52' />
        </a>
        <div className='flex shrink-0 gap-1' aria-label={t('language')}>
          {(['ru', 'en'] as const).map((language) => (
            <button
              key={language}
              type='button'
              disabled={languagePending || isSubmitting}
              aria-pressed={locale === language}
              onClick={() =>
                startLanguageTransition(async () => {
                  try {
                    await setPublicFeedbackLocale(language);
                  } catch {
                    setError(t('languageError'));
                  }
                })
              }
              className={`min-h-11 min-w-11 rounded-lg px-2 typo-body-small uppercase ${locale === language ? 'bg-primary/10 font-semibold text-primary' : 'text-text-secondary'}`}
            >
              {language}
            </button>
          ))}
        </div>
      </header>
      <section className='rounded-xl sm:border sm:border-divider sm:bg-base-white sm:p-6'>
        <div className='mb-6 rounded-xl border border-primary/20 bg-primary/10 p-4'>
          <p className='mb-2 typo-body-small text-text-secondary'>
            {t('recipientLabel')}
          </p>
          <p className='break-words typo-h3 text-primary'>{name}</p>
          <p className='mt-2 typo-body-small text-text-secondary'>
            {t('recipientHint')}
          </p>
        </div>
        {success ? (
          <div role='status' className='flex flex-col gap-4 py-8'>
            <CheckCircleIcon
              aria-hidden='true'
              className='size-14 text-primary'
            />
            <h1 className='typo-h2'>{t('thankYou')}</h1>
            <p className='text-text-secondary'>{t('thankYouDescription')}</p>
          </div>
        ) : (
          <>
            <h1 className='mb-5 typo-h2'>{t('title')}</h1>
            <form
              onSubmit={(event) => {
                void handleSubmit(submit)(event);
              }}
              noValidate
              className='flex flex-col gap-5'
            >
              <div>
                <label htmlFor='feedback-text' className='sr-only'>
                  {t('textLabel')}
                </label>
                <textarea
                  id='feedback-text'
                  rows={7}
                  maxLength={3000}
                  placeholder={t('placeholder')}
                  aria-invalid={Boolean(errors.text)}
                  aria-describedby={
                    errors.text ? 'feedback-text-error' : undefined
                  }
                  className='w-full resize-y rounded-xl border border-divider bg-base-white px-4 py-4 outline-none focus:border-primary'
                  {...register('text')}
                />
                {errors.text && (
                  <p
                    id='feedback-text-error'
                    role='alert'
                    className='mt-2 typo-body-small text-red-700'
                  >
                    {errors.text.message}
                  </p>
                )}
              </div>
              <div aria-hidden='true' className='hidden'>
                <label htmlFor='feedback-website'>Website</label>
                <input
                  ref={honeypot}
                  id='feedback-website'
                  name='website'
                  type='text'
                  tabIndex={-1}
                  autoComplete='off'
                />
              </div>
              <fieldset>
                <legend className='sr-only'>{t('moodLabel')}</legend>
                <div className='flex justify-around gap-4'>
                  {moods.map((mood) => (
                    <label key={mood} className='cursor-pointer'>
                      <input
                        type='radio'
                        value={mood}
                        className='peer sr-only'
                        {...register('mood')}
                      />
                      <MoodIcon mood={mood} className='size-16 border-2 border-transparent transition-transform peer-checked:scale-110 peer-checked:border-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-primary motion-reduce:transition-none' />
                      <span className='sr-only'>{t(`moods.${mood}`)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {error && (
                <p role='alert' className='typo-body-small text-red-700'>
                  {error}
                </p>
              )}
              <button
                type='submit'
                disabled={isSubmitting || languagePending}
                className='min-h-14 w-full rounded-xl bg-primary px-5 py-3 typo-button text-base-white transition-colors hover:bg-primary-hover disabled:opacity-50'
              >
                {isSubmitting ? t('submitting') : t('submit')}
              </button>
              <p className='flex items-center justify-center gap-2 typo-body-small text-text-secondary'>
                <LockClosedIcon aria-hidden='true' className='size-5' />
                {t('noRegistration')}
              </p>
              <p className='text-center typo-caption text-text-secondary'>
                {t('private')}
              </p>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
