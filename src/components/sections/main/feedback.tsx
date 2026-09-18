import {
  BoltIcon,
  HeartIcon,
  LinkIcon,
  QrCodeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { CopyButton } from '@/components/ui/copy-button';
import SectionBlock from '@/components/ui/section';
import { useTranslations } from 'next-intl';

const benefits = [
  {
    Icon: BoltIcon,
  },
  {
    Icon: ShieldCheckIcon,
  },
  {
    Icon: HeartIcon,
  },
];

const feedbackUrl = 'https://backsignal.tech/f/demo-7k2m';

export default function Feedback() {
  const t = useTranslations('Landing.Feedback');
  return (
    <SectionBlock
      id='feedback'
      className='scroll-mt-20 bg-secondary-background'
      wrapperClassName='py-8 lg:py-18'
    >
      <div className='relative grid min-w-0 w-full grid-cols-1 overflow-hidden rounded-2xl border border-primary/20 bg-base-black lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]'>
        <div
          aria-hidden='true'
          className='absolute -right-24 -top-48 size-[32rem] rounded-full bg-primary/10'
        />
        <div
          aria-hidden='true'
          className='absolute bottom-[-10rem] left-[52%] size-[28rem] rounded-full bg-primary/10'
        />

        <div className='relative z-10 flex flex-col items-start justify-center p-6 sm:p-10 lg:p-16'>
          <p className='typo-caption font-semibold uppercase tracking-[0.24em] text-secondary'>
            {t('pre-title')}
          </p>

          <h2 className='mt-5 typo-h1 text-base-white'>
                        {t.rich('title', {
              accent: (chunks) => <span className='text-secondary'>{chunks}</span>,
            })}
          </h2>

          <div className='mt-6 max-w-2xl space-y-2 text-base-white'>
            <p className='typo-h3 font-light'>
              {t('description')}
            </p>
            <p className='typo-h3 font-semibold'>
              {t('description2')}
            </p>
          </div>

          <ul className='mt-9 grid w-full grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6'>
            {benefits.map(({ Icon }, index) => (
              <li key={index} className='flex items-center gap-3 sm:flex-col'>
                <span className='flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-secondary'>
                  <Icon aria-hidden='true' className='size-7 stroke-2' />
                </span>
                <span className='typo-body text-base-white lg:text-center'>{t(`benefits.${index+1}.title`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className='relative z-10 flex min-w-0 items-center justify-center p-6 pt-0 sm:p-10 sm:pt-0 lg:p-12'>
          <div className='flex min-w-0 w-full max-w-md flex-col items-center rounded-2xl bg-base-white p-5 text-center shadow-xl sm:p-8'>
            <div
              role='img'
              aria-label={t('note1')}
              className='flex aspect-square w-full max-w-64 items-center justify-center rounded-xl border-2 border-dashed border-divider bg-main-background text-text-muted'
            >
              <QrCodeIcon aria-hidden='true' className='size-32 stroke-1' />
            </div>

            <p className='mt-5 typo-body text-text-secondary'>
              {t('note2')}
            </p>

            <div className='my-5 flex w-full items-center gap-4 text-text-muted'>
              <span className='h-px flex-1 bg-divider' />
              <span className='typo-body'>{t('note3')}</span>
              <span className='h-px flex-1 bg-divider' />
            </div>

            <div className='flex min-w-0 w-full items-center gap-1 rounded-lg border border-primary/20 bg-disabled/70 p-1 text-primary transition-colors duration-300 hover:bg-disabled'>
              <a
                href={feedbackUrl}
                className='flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-md px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
              >
                <LinkIcon aria-hidden='true' className='size-6 shrink-0 stroke-2' />
                <span className='min-w-0 truncate typo-body font-semibold'>
                  backsignal.tech/f/demo-7k2m
                </span>
              </a>
              <CopyButton value={feedbackUrl} />
            </div>

            <p className='mt-3 typo-body-small text-text-secondary'>
              {t('note4')}
            </p>
          </div>
        </div>
      </div>
    </SectionBlock>
  );
}
