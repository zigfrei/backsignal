import {
  BuildingStorefrontIcon,
  CubeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import HeroScenariosNote from '@/assets/illustrations/hero-scenarios-note.svg';
import EnHeroScenariosNote from '@/assets/illustrations/en/hero-scenarios-note.svg';
import { CardLabel } from '@/components/ui/card-label';
import { useLocale, useTranslations } from 'next-intl';

const scenarios = [
  {
    labelKey: 'cafe',
    Icon: BuildingStorefrontIcon,
  },
  {
    labelKey: 'service',
    Icon: WrenchScrewdriverIcon,
  },
  {
    labelKey: 'shop',
    Icon: ShoppingBagIcon,
  },
  {
    labelKey: 'order',
    Icon: CubeIcon,
  },
  {
    labelKey: 'marketplace',
    Icon: ShoppingCartIcon,
  },
];

export function HeroScenarios() {
  const t = useTranslations('Landing.Hero');
  const locale = useLocale();
  const ScenariosNoteComponent =
    locale === 'en' ? EnHeroScenariosNote : HeroScenariosNote;

  return (
    <div className='flex w-full flex-col gap-3'>
      <p className='typo-caption font-semibold uppercase tracking-[0.16em] text-base-white/60'>
        {t('label')}
      </p>
      <div className='flex flex-wrap gap-2'>
        {scenarios.map(({ labelKey, Icon }) => (
          <CardLabel key={labelKey} icon={Icon} variant='outline'>
            {t(`scenarios.${labelKey}`)}
          </CardLabel>
        ))}
      </div>
      <div className='ml-6 mt-1 w-[23rem] max-w-[calc(100%-1.5rem)]'>
        <ScenariosNoteComponent
          aria-hidden='true'
          className='h-auto w-full hidden lg:block'
        />
        <span className='sr-only'>{t('decorator')}</span>
      </div>
    </div>
  );
}
