import clsx from 'clsx';
import type { moods } from '@/lib/public-feedback-schema';

export function MoodIcon({ mood, className }: { mood: (typeof moods)[number]; className?: string }) {
  return <span aria-hidden='true' className={clsx('flex shrink-0 items-center justify-center rounded-full text-base-black', mood === 'POSITIVE' ? 'bg-primary/20' : mood === 'NEGATIVE' ? 'bg-red-200' : 'bg-slate-200', className)}>
    <svg viewBox='0 0 40 40' className='size-[62.5%] fill-current'><circle cx='13' cy='14' r='2.5' /><circle cx='27' cy='14' r='2.5' /><path d={mood === 'POSITIVE' ? 'M11 25 Q20 36 29 25' : mood === 'NEGATIVE' ? 'M11 30 Q20 19 29 30' : 'M12 27 H28'} fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' /></svg>
  </span>;
}
