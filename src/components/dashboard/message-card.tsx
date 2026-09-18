'use client';

import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { markMessageRead } from '@/actions/messages';
import { MoodIcon } from '@/components/ui/mood-icon';
import type { moods } from '@/lib/public-feedback-schema';
import { MessageTime } from './message-time';

export function MessageCard({
  message,
  dateLabel,
  initialNow,
  initiallyOpen = false,
}: {
  message: {
    id: string;
    text: string;
    mood: (typeof moods)[number];
    status: string;
    createdAt: string;
  };
  dateLabel: string;
  initialNow: number;
  initiallyOpen?: boolean;
}) {
  const t = useTranslations('Dashboard.Messages');
  const [read, setRead] = useState(false);
  const [open, setOpen] = useState(initiallyOpen);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  const reading = useRef(false);
  const initiallyReadMessage = useRef<string | null>(null);
  const isNew = message.status === 'NEW' && !read;

  const markRead = useCallback(() => {
    if (!isNew || reading.current) return;
    reading.current = true;
    setError(false);
    startTransition(async () => {
      try {
        const result = await markMessageRead(message.id);
        if (result.success) setRead(true);
        else setError(true);
      } catch {
        setError(true);
      } finally {
        reading.current = false;
      }
    });
  }, [isNew, message.id, startTransition]);

  // An email deep link is rendered open already; hydration need not fire onToggle.
  useEffect(() => {
    if (!initiallyOpen || initiallyReadMessage.current === message.id) return;
    initiallyReadMessage.current = message.id;
    markRead();
  }, [initiallyOpen, message.id, markRead]);

  return (
    <li
      className={`min-w-0 rounded-xl border p-4 transition-colors sm:p-6 ${isNew ? 'border-primary/25 bg-primary/10' : 'border-divider bg-base-white'}`}
    >
      <details
        open={open}
        className='group'
        onToggle={(event) => {
          setOpen(event.currentTarget.open);
          if (event.currentTarget.open) markRead();
        }}
      >
        <summary className='flex cursor-pointer list-none items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-5'>
          <MoodIcon
            mood={message.mood}
            className='size-16 border border-base-black/20 sm:size-18'
          />
          <span className='sr-only'>
            {t(`moods.${message.mood}`)}.{' '}
            {t(
              `statuses.${isNew ? 'NEW' : message.status === 'ARCHIVED' ? 'ARCHIVED' : 'READ'}`,
            )}
          </span>
          <span className='min-w-0 flex-1'>
            <MessageTime
              createdAt={message.createdAt}
              dateLabel={dateLabel}
              initialNow={initialNow}
            />
            <span
              className={`mt-2 block truncate typo-body ${isNew ? 'font-semibold' : ''}`}
            >
              {message.text.replace(/\s+/g, ' ')}
            </span>
            <span className='sr-only'>{t('openMessage')}</span>
          </span>
          <ChevronRightIcon
            aria-hidden='true'
            className='size-5 shrink-0 text-text-secondary transition-transform group-open:rotate-90 motion-reduce:transition-none'
          />
        </summary>
        <p className='mt-4 whitespace-pre-wrap break-words border-t border-divider pt-4 typo-body [overflow-wrap:anywhere]'>
          {message.text}
        </p>
      </details>
      {error && (
        <div
          role='alert'
          className='mt-3 flex flex-wrap items-center gap-2 typo-body-small text-red-700'
        >
          <p>{t('readError')}</p>
          <button
            type='button'
            disabled={pending}
            onClick={markRead}
            className='min-h-11 rounded-lg border border-current px-3 disabled:opacity-50'
          >
            {t('retryRead')}
          </button>
        </div>
      )}
    </li>
  );
}
