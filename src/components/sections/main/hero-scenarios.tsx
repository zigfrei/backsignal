import {
  BuildingStorefrontIcon,
  CubeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import HeroScenariosNote from '@/assets/illustrations/hero-scenarios-note.svg';
import { CardLabel } from '@/components/ui/card-label';

const scenarios = [
  {
    label: 'В заведении',
    Icon: BuildingStorefrontIcon,
  },
  {
    label: 'После услуги',
    Icon: WrenchScrewdriverIcon,
  },
  {
    label: 'В магазине',
    Icon: ShoppingBagIcon,
  },
  {
    label: 'В заказе',
    Icon: CubeIcon,
  },
  {
    label: 'На маркетплейсе',
    Icon: ShoppingCartIcon,
  },
];

export function HeroScenarios() {
  return (
    <div className='flex w-full flex-col gap-3'>
      <p className='typo-caption font-semibold uppercase tracking-[0.16em] text-base-white/60'>
        Один QR-код — десятки сценариев
      </p>
      <div className='flex flex-wrap gap-2'>
        {scenarios.map(({ label, Icon }) => (
          <CardLabel key={label} icon={Icon} variant='outline'>
            {label}
          </CardLabel>
        ))}
      </div>
      <div className='ml-6 mt-1 w-[23rem] max-w-[calc(100%-1.5rem)]'>
        <HeroScenariosNote aria-hidden='true' className='h-auto w-full hidden lg:block' />
        <span className='sr-only'>
          Подходит для любого бизнеса, который работает с клиентами
        </span>
      </div>
    </div>
  );
}
