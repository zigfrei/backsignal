'use client';

import { useTranslations } from 'next-intl';
import { useDashboardUnreadCount } from './dashboard-unread-context';

export function UnreadMessagesCount() {
  const t = useTranslations('Dashboard.Messages');
  const count = useDashboardUnreadCount();
  return (
    <p
      aria-live='polite'
      className='mt-2 typo-body-small font-semibold text-primary'
    >
      {t('unreadCount', { count })}
    </p>
  );
}
