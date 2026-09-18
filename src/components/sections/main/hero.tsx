import SectionBlock from '@/components/ui/section';
import { HeroCards } from './hero-cards';
import { HeroScenarios } from './hero-scenarios';
import { LandingCta } from './landing-cta';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Landing.Hero');

  return (
    <div className='relative w-full flex items-center justify-center bg-secondary-background'>
    <SectionBlock wrapperClassName='relative overflow-hidden p-4! lg:p-12! lg:h-[calc(100vh-80px)] min-h-[720px] xl:min-h-[850px]'>
      <div className='z-10 flex w-full flex-1 flex-col items-start justify-center gap-8 lg:gap-16 lg:flex-row lg:items-center'>
        <div className='flex h-full w-full flex-col items-start justify-center gap-4 lg:gap-8 lg:min-w-0 lg:flex-1 lg:basis-0'>
          <h1 className='typo-h1 text-base-white'>
            {t.rich('title', {
              accent: (chunks) => <span className='text-secondary'>{chunks}</span>,
            })}
          </h1>
          <p className='typo-body-large text-base-white'>
            {t('description')}
          </p>
          <LandingCta
            guestLabel={t('cta')}
            className='group w-full lg:w-auto max-w-[420px] lg:max-w-none justify-center self-center lg:self-start gap-0'
          />
          <HeroScenarios />
        </div>
        <div className='w-full lg:min-w-0 lg:flex-1 lg:basis-0'>
          <HeroCards />
        </div>
      </div>
      
    </SectionBlock>
    </div>
  );
}
