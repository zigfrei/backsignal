import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('Dashboard');
  return (
    <div role='status' className='flex flex-col gap-6'>
      <span className='sr-only'>{t('loading')}</span>
      <div
        aria-hidden='true'
        className='h-9 w-48 rounded-lg bg-divider motion-safe:animate-pulse'
      />
      {[1, 2, 3].map((key) => (
        <div
          key={key}
          aria-hidden='true'
          className='h-36 rounded-xl bg-base-white motion-safe:animate-pulse'
        />
      ))}
    </div>
  );
}
