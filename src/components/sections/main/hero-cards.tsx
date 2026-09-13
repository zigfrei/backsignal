import {
  BuildingStorefrontIcon,
  CubeIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { CardLabel } from '@/components/ui/card-label';
import Image from 'next/image';
import type { ComponentType, SVGProps } from 'react';
import { useTranslations } from 'next-intl';

interface HeroCard {
  key: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const cards: HeroCard[] = [
  {
    key: 'cafe',
    Icon: BuildingStorefrontIcon,
  },
  {
    key: 'service',
    Icon: WrenchScrewdriverIcon,
  },
  {
    key: 'marketplace',
    Icon: CubeIcon,
  },
  {
    key: 'shop',
    Icon: ShoppingCartIcon,
  },
];

export function HeroCards() {
  const t = useTranslations('Landing.Hero');
  return (
    <div className='grid aspect-square w-full grid-cols-2 gap-1 overflow-hidden rounded-lg'>
      {cards.map(({ key, Icon }) => (
        <div key={key} className='relative aspect-square min-w-0 overflow-hidden rounded-lg'>
          <Image
            src={t(`cards.${key}.imagePath`)}
            alt={t(`cards.${key}.alt`)}
            fill
            sizes='(min-width: 1280px) 25vw, 50vw'
            className='object-cover'
          />
          <CardLabel
            icon={Icon}
            className='absolute bottom-3 left-3 sm:bottom-4 sm:left-4'
          >
            {t(`cards.${key}.label`)}
          </CardLabel>
        </div>
      ))}
    </div>
  );
}
