'use client';

import { useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Select } from '@/components/ui/select';
import { updateNotificationSettings } from '@/actions/notification-settings';
import { getPathname } from '@/i18n/navigation';
import { sendVerificationEmail } from '@/lib/auth-client';

export function NotificationSettings({ settings }: { settings: { enabled: boolean; locale: 'ru' | 'en'; email: string; emailVerified: boolean } }) {
  const t = useTranslations('Dashboard.Notifications');
  const currentLocale = useLocale();
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);
  const [verificationPending, setVerificationPending] = useState(false);
  const [enabled, setEnabled] = useState(settings.enabled);
  const [locale, setLocale] = useState(settings.locale);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [pending, startTransition] = useTransition();
  function save() {
    setStatus(null);
    startTransition(async () => {
      try { const result = await updateNotificationSettings({ enabled, locale }); setStatus(result.success ? 'success' : 'error'); }
      catch { setStatus('error'); }
    });
  }
  async function verifyEmail() {
    if (verificationPending) return;
    setVerificationPending(true);
    setVerificationStatus(null);
    try {
      const { error } = await sendVerificationEmail({
        email: settings.email,
        callbackURL: getPathname({ locale: currentLocale, href: '/dashboard/settings' }),
      });
      setVerificationStatus(error ? 'error' : 'success');
    } catch {
      setVerificationStatus('error');
    } finally {
      setVerificationPending(false);
    }
  }
  return (
    <section className='flex flex-col gap-4 rounded-xl border border-divider bg-base-white p-5 sm:p-6'>
      <h2 className='typo-h3'>{t('title')}</h2>
      <label className='flex min-h-11 items-center gap-3'><input type='checkbox' className='size-5 accent-primary' checked={settings.emailVerified && enabled} disabled={pending || !settings.emailVerified} onChange={(event) => { setEnabled(event.target.checked); setStatus(null); }} />{t('enabled')}</label>
      <p className='break-all typo-body-small text-text-secondary'>{t('recipient', { email: settings.email })}</p>
      {!settings.emailVerified && (
        <div className='flex flex-col items-start gap-3'>
          <p className='text-red-700'>{t('unverified')}</p>
          {enabled && <p className='typo-body-small text-text-secondary'>{t('activationPending')}</p>}
          <button type='button' onClick={verifyEmail} disabled={verificationPending} className='min-h-11 rounded-lg border border-primary px-4 py-2 text-primary disabled:opacity-50'>
            {t(verificationPending ? 'verificationSending' : 'verifyEmail')}
          </button>
          {verificationStatus && <p role={verificationStatus === 'error' ? 'alert' : 'status'} className={verificationStatus === 'error' ? 'text-red-700' : 'text-primary'}>{t(verificationStatus === 'success' ? 'verificationSent' : 'verificationError')}</p>}
        </div>
      )}
      <Select<'ru' | 'en'> label={t('language')} value={locale} disabled={pending} onValueChange={(next) => { setLocale(next); setStatus(null); }} items={[{ value: 'ru', label: 'Русский' }, { value: 'en', label: 'English' }]} />
      <button type='button' onClick={save} disabled={pending} className='min-h-11 self-start rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-50'>{t(pending ? 'saving' : 'save')}</button>
      {status && <p role={status === 'error' ? 'alert' : 'status'} className={status === 'error' ? 'text-red-700' : 'text-primary'}>{t(status)}</p>}
    </section>
  );
}
