'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { EmptyState } from './empty-state';

export function MessagesPreview() {
  const t = useTranslations('Dashboard.Messages');
  const [showDemo, setShowDemo] = useState(false);
  return (
    <section className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div><h1 className='typo-h2'>{t('title')}</h1><p className='mt-2 typo-body text-text-secondary'>{t('description')}</p></div>
        {showDemo && <button type='button' onClick={() => setShowDemo(false)} className='min-h-11 rounded-lg border border-primary px-4 py-2 text-primary'>{t('hideDemo')}</button>}
      </div>
      {showDemo ? (
        <>
          <p role='status' className='rounded-lg bg-primary/10 p-3 typo-body-small text-primary'>{t('demoNotice')}</p>
          <ul className='flex flex-col gap-3'>
            {(['1', '2', '3'] as const).map((key, index) => (
              <li key={key} className='min-w-0 rounded-xl border border-divider bg-base-white p-4 sm:p-6'>
                <details>
                  <summary className='cursor-pointer list-none rounded-md focus-visible:outline-2 focus-visible:outline-primary'>
                    <span className='flex flex-wrap items-center justify-between gap-2'><span className='typo-caption font-semibold text-primary'>{index === 0 ? t('unread') : t('read')}</span><span className='typo-caption text-text-secondary'>{t(`demo.${key}.time`)}</span></span>
                    <span className='mt-3 block break-words typo-body font-semibold'>{t(`demo.${key}.title`)}</span>
                    <span className='mt-2 block typo-body-small text-primary'>{t('openMessage')}</span>
                  </summary>
                  <p className='mt-4 whitespace-pre-wrap break-words border-t border-divider pt-4 typo-body text-text-secondary'>{t(`demo.${key}.body`)}</p>
                </details>
              </li>
            ))}
          </ul>
        </>
      ) : <EmptyState title={t('emptyTitle')} description={t('emptyDescription')}><button type='button' onClick={() => setShowDemo(true)} className='min-h-11 rounded-lg bg-primary px-5 py-2.5 text-base-white hover:bg-primary-hover'>{t('showDemo')}</button></EmptyState>}
    </section>
  );
}
