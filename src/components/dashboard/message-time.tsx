'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

export function MessageTime({ createdAt, dateLabel, initialNow }: { createdAt: string; dateLabel: string; initialNow: number }) {
  const locale = useLocale();
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);
  const seconds = Math.max(0, Math.floor((now - Date.parse(createdAt)) / 1000));
  const [value, unit]: [number, Intl.RelativeTimeFormatUnit] = seconds < 60
    ? [seconds, 'second']
    : seconds < 3600 ? [Math.floor(seconds / 60), 'minute']
    : seconds < 86400 ? [Math.floor(seconds / 3600), 'hour']
    : seconds < 2592000 ? [Math.floor(seconds / 86400), 'day']
    : seconds < 31536000 ? [Math.floor(seconds / 2592000), 'month']
    : [Math.floor(seconds / 31536000), 'year'];
  const label = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value === 0 ? 0 : -value, unit);
  return <time dateTime={createdAt} title={dateLabel} className='block typo-caption text-text-secondary'>{label}</time>;
}
