import SectionBlock from '@/components/ui/section';
import { HowItWorksCard } from './how-it-works-card';
import { BigLinkButton } from '@/components/ui/links';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { FeedbackLoop } from './feedback-loop';
import { useTranslations } from 'next-intl';

const steps = ['01', '02', '03'] as const;

export default function HowItWorks() {
  const t = useTranslations('Landing.HowItWorks');
  return (
    <SectionBlock
      id='how-it-works'
      className='scroll-mt-20 bg-[linear-gradient(to_bottom,var(--color-secondary-background)_0_30%,var(--color-main-background)_30%_100%)]'
      wrapperClassName='gap-8 lg:gap-12'
    >
      <div className='flex w-full flex-col items-center justify-center gap-2'>
        <p className='typo-caption font-semibold uppercase tracking-[0.16em] text-secondary'>
          {t('pre-title')}
        </p>
        <h2 className='typo-h2 text-center text-base-white'>
          {t('title')}
        </h2>
        <p className='typo-body-large text-center text-base-white'>
          {t('description')}
        </p>
      </div>

      <div className='grid w-full grid-cols-1 gap-6 lg:grid-cols-3'>
        {steps.map((number) => {
          const cardKey = `cards.${Number(number)}`;

          return (
            <HowItWorksCard
              key={number}
              number={number}
              label={t(`${cardKey}.label`)}
              title={t(`${cardKey}.title`)}
              description={t(`${cardKey}.description`)}
              image={t(`${cardKey}.imagePath`)}
              imageAlt={t(`${cardKey}.imageAlt`)}
            />
          );
        })}
      </div>

      <FeedbackLoop />

      <BigLinkButton
        href='/#'
        className='group w-full max-w-[420px] justify-center self-center gap-0 lg:w-auto lg:max-w-none'
      >
        <span className='px-2'>{t('CTA')}</span>

        <ArrowRightIcon
          aria-hidden='true'
          className='size-6 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-1'
        />
      </BigLinkButton>
    </SectionBlock>
  );
}
