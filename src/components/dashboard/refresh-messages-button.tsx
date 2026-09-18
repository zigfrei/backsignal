'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';

export function RefreshMessagesButton() {
  const t = useTranslations('Dashboard.Messages');
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <button type='button' disabled={pending} onClick={() => startTransition(() => router.refresh())} className='flex min-h-11 items-center gap-2 rounded-lg border border-divider bg-base-white px-4 py-2 text-primary disabled:opacity-50'><ArrowPathIcon aria-hidden='true' className={`size-5 ${pending ? 'animate-spin motion-reduce:animate-none' : ''}`} />{pending ? t('refreshing') : t('refresh')}</button>;
}
