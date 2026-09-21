'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { approveTelegramConnection, checkTelegramConnection, removeTelegramConnection, sendTestTelegramNotification, startTelegramConnection, toggleTelegramConnection } from '@/actions/telegram-connection';

type State = { connected: boolean; enabled: boolean; username: string | null; pending: boolean; pendingConfirmation: boolean };

export function TelegramConnectionCard({ initialState, configured, compact = false }: { initialState: State; configured: boolean; compact?: boolean }) {
  const t = useTranslations('Dashboard.Telegram');
  const locale = useLocale();
  const [state, setState] = useState(initialState);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  const checking = useRef(false);

  useEffect(() => {
    if (!state.pending || state.pendingConfirmation || state.connected) return;
    let active = true;
    async function check() {
      if (!active || checking.current || document.visibilityState === 'hidden') return;
      checking.current = true;
      try {
        const result = await checkTelegramConnection();
        if (active && result.success) setState(result.state);
      } catch {
        // A temporary connection error should not interrupt the linking flow.
      } finally {
        checking.current = false;
      }
    }
    const interval = window.setInterval(check, 4000);
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', check);
    void check();
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, [state.pending, state.pendingConfirmation, state.connected]);

  function run(task: () => Promise<void>) {
    setError(false);
    startTransition(async () => { try { await task(); } catch { setError(true); } });
  }

  return (
    <section aria-busy={pending} className='flex flex-col gap-4 rounded-xl border border-divider bg-base-white p-5 sm:p-6'>
      <div>
        <h2 className='typo-h3'>{t('title')}</h2>
        <p className='mt-2 typo-body text-text-secondary'>{t(compact ? 'settingsDescription' : 'description')}</p>
      </div>
      {!configured ? <p className='typo-body-small text-text-secondary'>{t('unavailable')}</p> : state.connected ? (
        <div className='flex flex-col items-start gap-3'>
          <p className='typo-body-small text-primary'>{t(state.enabled ? 'connected' : 'paused')}{state.username ? ` · @${state.username}` : ''}</p>
          <div className='flex flex-wrap gap-2'>
            <button type='button' disabled={pending} className='min-h-11 rounded-lg border border-primary px-4 py-2 text-primary disabled:opacity-50' onClick={() => run(async () => { const result = await toggleTelegramConnection(!state.enabled); if (!result.success) throw new Error(); setState({ ...state, enabled: !state.enabled }); })}>{t(state.enabled ? 'pause' : 'resume')}</button>
            <button type='button' disabled={pending} className='min-h-11 rounded-lg border border-divider px-4 py-2 text-primary disabled:opacity-50' onClick={() => run(async () => { const result = await sendTestTelegramNotification(locale === 'en' ? 'en' : 'ru'); if (!result.success) throw new Error(); })}>{t('sendTest')}</button>
            <button type='button' disabled={pending} className='min-h-11 rounded-lg border border-divider px-4 py-2 text-text-secondary disabled:opacity-50' onClick={() => run(async () => { const result = await removeTelegramConnection(); if (!result.success) throw new Error(); setState({ connected: false, enabled: false, username: null, pending: false, pendingConfirmation: false }); setUrl(null); })}>{t('disconnect')}</button>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-start gap-3'>
          {state.pendingConfirmation ? (
            <>
              <p className='typo-body-small text-text-secondary'>{t('confirmHint', { username: state.username ? `@${state.username}` : t('unknownAccount') })}</p>
              <button type='button' disabled={pending} className='min-h-11 rounded-lg bg-primary px-4 py-2 text-base-white disabled:opacity-50' onClick={() => run(async () => { const result = await approveTelegramConnection(); if (!result.success) throw new Error(); setState({ connected: true, enabled: true, username: state.username, pending: false, pendingConfirmation: false }); setUrl(null); })}>{t('confirm')}</button>
              <button type='button' disabled={pending} className='min-h-11 rounded-lg border border-divider px-4 py-2 text-primary disabled:opacity-50' onClick={() => run(async () => { const result = await startTelegramConnection(); if (!result.success) throw new Error(); setUrl(result.url); setState({ ...state, pending: true, pendingConfirmation: false, username: null }); window.location.assign(result.url); })}>{t('newLink')}</button>
            </>
          ) : state.pending ? (
            <>
              <p role='status' className='typo-body-small text-text-secondary'>{t('waiting')}</p>
              {url && <a href={url} className='inline-flex min-h-11 items-center rounded-lg border border-primary px-4 py-2 text-primary'>{t('openBot')}</a>}
              <button type='button' disabled={pending} className='min-h-11 rounded-lg border border-divider px-4 py-2 text-primary disabled:opacity-50' onClick={() => run(async () => { const result = await checkTelegramConnection(); if (!result.success) throw new Error(); setState(result.state); })}>{t('check')}</button>
              <button type='button' disabled={pending} className='min-h-11 px-2 py-2 text-primary disabled:opacity-50' onClick={() => run(async () => { const result = await startTelegramConnection(); if (!result.success) throw new Error(); setUrl(result.url); window.location.assign(result.url); })}>{t('newLink')}</button>
            </>
          ) : (
            <button type='button' disabled={pending} className='min-h-11 rounded-lg bg-primary px-4 py-2 text-base-white disabled:opacity-50' onClick={() => run(async () => { const result = await startTelegramConnection(); if (!result.success) throw new Error(); setUrl(result.url); setState({ ...state, pending: true }); window.location.assign(result.url); })}>{t('connect')}</button>
          )}
        </div>
      )}
      {error && <p role='alert' className='typo-body-small text-red-700'>{t('error')}</p>}
    </section>
  );
}
