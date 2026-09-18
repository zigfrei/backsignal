import { getLocale, getTranslations, getNow } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { getOrganizationMessagesPage } from '@/data/messages';
import { EmptyState } from './empty-state';
import { RefreshMessagesButton } from './refresh-messages-button';
import { MessageCard } from './message-card';
import { UnreadMessagesCount } from './unread-messages-count';

type MessagesPage = Awaited<ReturnType<typeof getOrganizationMessagesPage>>;

export async function MessagesList({
  messages,
  page,
  pages,
  total,
  expandedMessageId,
}: MessagesPage & { expandedMessageId?: string }) {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations('Dashboard.Messages'),
  ]);
  const formatDate = new Intl.DateTimeFormat(
    locale === 'ru' ? 'ru-RU' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    },
  );

  const initialNow = (await getNow()).getTime();

  return (
    <section className='flex min-w-0 flex-col gap-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <p className='typo-body text-text-secondary'>
            {t('description')}
          </p>
          <div className='hidden lg:block'>
          <p className='mt-2 typo-body-small text-text-secondary'>
            {t('total', { count: total })}
          </p>
          <UnreadMessagesCount />
          </div>
        </div>
        <RefreshMessagesButton />
      </div>
      {!messages.length ? (
        <EmptyState
          title={t('emptyTitle')}
          description={t('emptyDescription')}
        />
      ) : (
        <ul className='flex flex-col gap-3'>
          {messages.map((message) => (
            <MessageCard
              key={`${message.id}-${expandedMessageId === message.id}`}
              initiallyOpen={expandedMessageId === message.id}
              message={{ id: message.id, text: message.text, mood: message.mood, status: message.status, createdAt: message.createdAt.toISOString() }}
              dateLabel={formatDate.format(message.createdAt)}
              initialNow={initialNow}
            />
          ))}
        </ul>
      )}
      {pages > 1 && (
        <nav
          aria-label={t('pagination')}
          className='flex flex-wrap items-center justify-between gap-3'
        >
          {page > 1 ? (
            <Link
              href={{ pathname: '/dashboard', query: { page: page - 1 } }}
              className='flex min-h-11 items-center rounded-lg border border-divider bg-base-white px-4 text-primary'
            >
              {t('previous')}
            </Link>
          ) : (
            <span />
          )}
          <span className='typo-body-small text-text-secondary'>
            {t('page', { page, pages })}
          </span>
          {page < pages ? (
            <Link
              href={{ pathname: '/dashboard', query: { page: page + 1 } }}
              className='flex min-h-11 items-center rounded-lg border border-divider bg-base-white px-4 text-primary'
            >
              {t('next')}
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </section>
  );
}
