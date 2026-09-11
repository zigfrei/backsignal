import SectionBlock from '@/components/ui/section';
import { BigLinkButton } from '@/components/ui/links';
import { HeroCards } from './hero-cards';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { HeroScenarios } from './hero-scenarios';

export default function Hero() {
  return (
    <div className='relative w-full flex items-center justify-center bg-secondary-background'>
    <SectionBlock wrapperClassName='relative overflow-hidden p-4! lg:p-12! lg:h-[calc(100vh-80px)] min-h-[720px] xl:min-h-[850px]'>
      <div className='z-10 flex w-full flex-1 flex-col items-start justify-center gap-8 lg:gap-16 xl:flex-row xl:items-center'>
        <div className='flex h-full w-full flex-col items-start justify-center gap-4 lg:gap-8 xl:min-w-0 xl:flex-1 xl:basis-0'>
          <h1 className='typo-h1 text-base-white'>
            Узнайте, что думают ваши клиенты. <span className='text-secondary'>Напрямую.</span>
          </h1>
          <p className='typo-body-large text-base-white'>
            Клиент сканирует QR-код и оставляет обратную связь без регистрации. Сообщение получает только ваш бизнес.
          </p>
          <BigLinkButton
            href='/#'
            className='group w-full lg:w-auto max-w-[420px] lg:max-w-none justify-center self-center lg:self-start gap-0'
          >
            <span className='px-2'>Попробовать бесплатно</span>

            <ArrowRightIcon
              aria-hidden='true'
              className='size-6 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-1'
            />
          </BigLinkButton>
          <HeroScenarios />
        </div>
        <div className='w-full xl:min-w-0 xl:flex-1 xl:basis-0'>
          <HeroCards />
        </div>
      </div>
      
    </SectionBlock>
    </div>
  );
}
