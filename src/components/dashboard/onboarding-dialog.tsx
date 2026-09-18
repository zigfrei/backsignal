'use client';

import { Dialog } from '@base-ui/react/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { completeOnboarding } from '@/actions/onboarding';
import { useRouter } from '@/i18n/navigation';
import { FormField } from '@/components/ui/form-field';
import { LogoutButton } from '@/components/auth/logout-button';
import type { OnboardingSummary } from '@/lib/onboarding-schema';
import { OnboardingQr } from './onboarding-qr';

export function OnboardingDialog({
  hasOrganization,
  summary,
}: {
  hasOrganization: boolean;
  summary: OnboardingSummary | null;
}) {
  const t = useTranslations('Dashboard.Onboarding');
  const locale = useLocale();
  const router = useRouter();
  const [created, setCreated] = useState<OnboardingSummary>();
  const [error, setError] = useState<string>();
  const schema = z.object({
    name: z.string().trim().min(2, t('errors.name')).max(100, t('errors.name')),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string }>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });
  const open = Boolean(created) || !summary;

  const submit = handleSubmit(async (values) => {
    setError(undefined);
    try {
      const result = await completeOnboarding(values, locale);
      if (!result.success) {
        setError(t(`errors.${result.error}`));
        return;
      }
      setCreated(result.summary);
      router.refresh();
    } catch {
      setError(t('errors.default'));
    }
  });

  return (
    <Dialog.Root
      open={open}
      disablePointerDismissal
      onOpenChange={(_, details) => details.cancel()}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className='fixed inset-0 z-[100] bg-base-black/55' />
        <Dialog.Popup className='fixed left-1/2 top-1/2 z-[101] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-xl border border-divider bg-base-white p-5 text-text-primary outline-none sm:p-8'>
          <Dialog.Title className='typo-h2'>
            {created ? t('successTitle') : t('title')}
          </Dialog.Title>
          <Dialog.Description className='mb-6 mt-3 typo-body text-text-secondary'>
            {created
              ? t('successDescription', { name: created.name })
              : t('description')}
          </Dialog.Description>
          {created ? (
            <>
              <OnboardingQr summary={created} />
              <button
                type='button'
                disabled={!summary}
                onClick={() => {
                  setCreated(undefined);
                  router.refresh();
                }}
                className='mt-6 min-h-11 w-full rounded-lg bg-primary px-5 py-2.5 text-base-white disabled:opacity-50'
              >
                {t('continue')}
              </button>
            </>
          ) : hasOrganization ? (
            <p role='alert' className='mb-5 text-red-700'>
              {t('errors.incomplete')}
            </p>
          ) : (
            <form onSubmit={submit} noValidate className='flex flex-col gap-5'>
              <FormField
                id='organization-name'
                label={t('name')}
                autoComplete='organization'
                maxLength={100}
                error={errors.name}
                {...register('name')}
              />
              <p className='typo-body-small text-text-secondary'>
                {t('nameHint')}
              </p>
              {error && (
                <p role='alert' className='text-red-700'>
                  {error}
                </p>
              )}
              <button
                type='submit'
                disabled={isSubmitting}
                className='min-h-11 rounded-lg bg-primary px-5 py-2.5 text-base-white disabled:opacity-50'
              >
                {isSubmitting ? t('submitting') : t('submit')}
              </button>
            </form>
          )}
          {!created && (
            <div className='mt-4'>
              <LogoutButton className='w-full' />
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
