import {
  ArrowDownIcon,
  ArrowRightIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  QrCodeIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import HowItWorksNoteOne from '@/assets/illustrations/how-it-work-note-1.svg';
import HowItWorksNoteTwo from '@/assets/illustrations/how-it-work-note-2.svg';
import EnHowItWorksNoteOne from '@/assets/illustrations/en/how-it-work-note-1.svg';
import EnHowItWorksNoteTwo from '@/assets/illustrations/en/how-it-work-note-2.svg';
import { Fragment } from 'react';
import { useLocale, useTranslations } from 'next-intl';

const stages = [
  {
    key: '1',
    Icon: BuildingStorefrontIcon,
  },
  {
    key: '2',
    Icon: QrCodeIcon,
  },
  {
    key: '3',
    Icon: UserIcon,
  },
  {
    key: '4',
    Icon: ChatBubbleLeftRightIcon,
  },
  {
    key: '5',
    Icon: ChartBarIcon,
  },
];

export function FeedbackLoop() {
  const t = useTranslations('Landing.HowItWorks');
  const locale = useLocale();
  const HowItWorksNoteOneComponent =
    locale === 'en' ? EnHowItWorksNoteOne : HowItWorksNoteOne;
  const HowItWorksNoteTwoComponent =
    locale === 'en' ? EnHowItWorksNoteTwo : HowItWorksNoteTwo;

  return (
    <div className='relative w-full max-w-[32rem] lg:max-w-none rounded-xl bg-disabled/70 p-5 sm:p-8 lg:pt-24'>
      <div className='mb-6 hidden lg:flex w-full items-start justify-between gap-6 lg:mb-0'>
        <HowItWorksNoteOneComponent
          aria-hidden='true'
          className='h-auto max-w-[42%] lg:absolute lg:left-6 lg:top-5 lg:w-56'
        />
        <HowItWorksNoteTwoComponent
          aria-hidden='true'
          className='h-auto max-w-[34%] lg:absolute lg:right-6 lg:top-4 lg:w-36'
        />
      </div>
      <p className='sr-only'>
        {t('decorator')}
      </p>

      <div
        role='list'
        className='grid grid-cols-1 items-center gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4'
      >
        {stages.map(({ key, Icon }, index) => (
          <Fragment key={key}>
            <div role='listitem' className='flex min-w-0 flex-col items-center text-center'>
              <div className='flex size-20 items-center justify-center rounded-full border-2 border-primary/15 bg-base-white/70 shadow-sm'>
                <Icon aria-hidden='true' className='size-8 text-base-black' />
              </div>
              <h3 className='mt-4 typo-h4 text-text-primary'>{t(`stages.${key}.title`)}</h3>
              <p className='mt-1 max-w-44 typo-body text-text-secondary'>{t(`stages.${key}.description`)}</p>
            </div>

            {index < stages.length - 1 && (
              <>
                <ArrowDownIcon
                  aria-hidden='true'
                  className='mx-auto size-6 text-primary lg:hidden'
                />
                <ArrowRightIcon
                  aria-hidden='true'
                  className='hidden size-7 shrink-0 text-primary lg:block'
                />
              </>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
