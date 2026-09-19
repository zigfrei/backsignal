import Image from 'next/image';
import SectionBlock from '@/components/ui/section';
import { LandingCta } from './landing-cta';
import { useTranslations } from 'next-intl';

export default function CTA() {
    const t = useTranslations('Landing.CTA');
  return (
    <SectionBlock id='cta' wrapperClassName='py-8 lg:py-18'>
      <div className='grid w-full overflow-hidden rounded-2xl bg-disabled/70 lg:grid-cols-2'>
        <div className='flex flex-col items-start justify-center p-6 sm:p-10 lg:p-12'>
          <p className='typo-caption font-semibold uppercase tracking-[0.2em] text-primary'>
            {t('pre-title')}
          </p>

          <h2 className='mt-5 typo-h1 text-text-primary'>
                        {t.rich('title', {
              accent: (chunks) => <span className='text-secondary'>{chunks}</span>,
            })}
          </h2>

          <p className='mt-6 max-w-xl typo-body-large text-text-secondary'>
            {t('description')}
          </p>

          <LandingCta
            guestLabel={t('CTA')}
            className='group mt-8 w-full max-w-[28rem] justify-center gap-0 sm:w-auto'
          />

          <p className='mt-4 typo-body-small font-semibold text-text-secondary'>
            {t('subtitle')}
          </p>
        </div>

        <div className='relative aspect-[627/522] w-full max-w-[600px] justify-self-center lg:aspect-auto lg:h-full lg:min-h-[32rem] lg:justify-self-end lg:self-end'>
          <Image
            src={t('CTAImage.imagePath')}
            alt={t('CTAImage.imageAlt')}
            fill
            sizes='(min-width: 1024px) 600px, (min-width: 632px) 600px, calc(100vw - 2rem)'
            className='object-contain object-center lg:object-bottom-right'
          />
        </div>
      </div>
    </SectionBlock>
  );
}
