'use client';

import { useTranslations } from 'next-intl';
import { EmptyState } from '@/components/dashboard/empty-state';

export default function DashboardError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useTranslations('Dashboard.Error');
  return (
    <EmptyState title={t('title')} description={t('description')}>
      <button type='button' onClick={retry} className='min-h-11 rounded-lg bg-primary px-5 py-2.5 text-base-white hover:bg-primary-hover'>{t('retry')}</button>
    </EmptyState>
  );
}
