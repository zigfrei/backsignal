'use client';

import { useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { updateNotificationSettings } from '@/actions/notification-settings';
import { getPathname } from '@/i18n/navigation';
import { sendVerificationEmail } from '@/lib/auth-client';
import { showSnackbar } from '@/components/ui/snackbar';

export function NotificationSettings({ settings }: { settings: { enabled: boolean; email: string; emailVerified: boolean } }) {
  const t = useTranslations('Dashboard.Notifications');
  const currentLocale = useLocale();
  const [verificationPending, setVerificationPending] = useState(false);
  const [enabled, setEnabled] = useState(settings.enabled);
  const [pending, startTransition] = useTransition();
  const saving = useRef(false);
  function save(nextEnabled: boolean) {
    if (saving.current || !settings.emailVerified) return;
    saving.current = true;
    const previousEnabled = enabled;
    setEnabled(nextEnabled);
    startTransition(async () => {
      try {
        const result = await updateNotificationSettings({ enabled: nextEnabled });
        if (!result.success) setEnabled(previousEnabled);
        showSnackbar(t(result.success ? 'success' : 'error'), result.success ? 'success' : 'error', 'notification-settings');
      } catch {
        setEnabled(previousEnabled);
        showSnackbar(t('error'), 'error', 'notification-settings');
      } finally {
        saving.current = false;
      }
    });
  }
  async function verifyEmail() {
    if (verificationPending) return;
    setVerificationPending(true);
    try {
      const { error } = await sendVerificationEmail({
        email: settings.email,
        callbackURL: getPathname({ locale: currentLocale, href: '/dashboard/settings' }),
      });
      showSnackbar(t(error ? 'verificationError' : 'verificationSent'), error ? 'error' : 'success', 'email-verification');
    } catch {
      showSnackbar(t('verificationError'), 'error', 'email-verification');
    } finally {
      setVerificationPending(false);
    }
  }
  return (
    <section aria-busy={pending} className='flex flex-col gap-4 rounded-xl border border-divider bg-base-white p-5 sm:p-6'>
      <h2 className='typo-h3'>{t('title')}</h2>
      <label className='flex min-h-11 items-center gap-3'><input type='checkbox' className='size-5 accent-primary' checked={settings.emailVerified && enabled} disabled={pending || !settings.emailVerified} onChange={(event) => save(event.target.checked)} />{t('enabled')}</label>
      <p className='break-all typo-body-small text-text-secondary'>{t('recipient', { email: settings.email })}</p>
      {!settings.emailVerified && (
        <div className='flex flex-col items-start gap-3'>
          <p className='text-red-700'>{t('unverified')}</p>
          {enabled && <p className='typo-body-small text-text-secondary'>{t('activationPending')}</p>}
          <button type='button' onClick={verifyEmail} disabled={verificationPending} className='min-h-11 rounded-lg border border-primary px-4 py-2 text-primary disabled:opacity-50'>
            {t(verificationPending ? 'verificationSending' : 'verifyEmail')}
          </button>
        </div>
      )}
    </section>
  );
}
