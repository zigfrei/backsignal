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
import { Fragment } from 'react';

const stages = [
  {
    title: 'Ваш бизнес',
    description: 'Размещаете QR-код',
    Icon: BuildingStorefrontIcon,
  },
  {
    title: 'QR-код',
    description: 'Клиент видит и сканирует',
    Icon: QrCodeIcon,
  },
  {
    title: 'Клиент',
    description: 'Оставляет обратную связь',
    Icon: UserIcon,
  },
  {
    title: 'Обратный сигнал',
    description: 'Сообщение приходит к вам',
    Icon: ChatBubbleLeftRightIcon,
  },
  {
    title: 'Ваш бизнес',
    description: 'Узнаёте мнение и становитесь лучше',
    Icon: ChartBarIcon,
  },
];

export function FeedbackLoop() {
  return (
    <div className='relative w-full max-w-[32rem] lg:max-w-none rounded-xl bg-disabled/70 p-5 sm:p-8 lg:pt-24'>
      <div className='mb-6 hidden lg:flex w-full items-start justify-between gap-6 lg:mb-0'>
        <HowItWorksNoteOne
          aria-hidden='true'
          className='h-auto max-w-[42%] lg:absolute lg:left-6 lg:top-5 lg:w-56'
        />
        <HowItWorksNoteTwo
          aria-hidden='true'
          className='h-auto max-w-[34%] lg:absolute lg:right-6 lg:top-4 lg:w-36'
        />
      </div>
      <p className='sr-only'>
        Весь процесс в одной цепочке. Сигнал возвращается обратно вашему бизнесу,
        помогая получать больше довольных клиентов.
      </p>

      <div
        role='list'
        className='grid grid-cols-1 items-center gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4'
      >
        {stages.map(({ title, description, Icon }, index) => (
          <Fragment key={title + index}>
            <div role='listitem' className='flex min-w-0 flex-col items-center text-center'>
              <div className='flex size-20 items-center justify-center rounded-full border-2 border-primary/15 bg-base-white/70 shadow-sm'>
                <Icon aria-hidden='true' className='size-8 text-base-black' />
              </div>
              <h3 className='mt-4 typo-h4 text-text-primary'>{title}</h3>
              <p className='mt-1 max-w-44 typo-body text-text-secondary'>{description}</p>
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
