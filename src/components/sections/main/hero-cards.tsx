import {
  BuildingStorefrontIcon,
  CubeIcon,
  ShoppingCartIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { CardLabel } from '@/components/ui/card-label';
import Image from 'next/image';
import type { ComponentType, SVGProps } from 'react';

interface HeroCard {
  image: string;
  alt: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const cards: HeroCard[] = [
  {
    image: '/hero-card-1.png',
    alt: 'QR-код для сбора обратной связи в кафе',
    label: 'Кафе и рестораны',
    Icon: BuildingStorefrontIcon,
  },
  {
    image: '/hero-card-2.png',
    alt: 'QR-код для сбора обратной связи в сфере услуг',
    label: 'Сфера услуг',
    Icon: WrenchScrewdriverIcon,
  },
  {
    image: '/hero-card-3.png',
    alt: 'QR-код для обратной связи о доставке и заказах',
    label: 'Маркетплейсы и доставка',
    Icon: CubeIcon,
  },
  {
    image: '/hero-card-4.png',
    alt: 'QR-код для обратной связи в магазинах и на маркетплейсах',
    label: 'Чеки',
    Icon: ShoppingCartIcon,
  },
];

export function HeroCards() {
  return (
    <div className='grid aspect-square w-full grid-cols-2 gap-1 overflow-hidden rounded-lg'>
      {cards.map(({ image, alt, label, Icon }) => (
        <div key={image} className='relative aspect-square min-w-0 overflow-hidden rounded-lg'>
          <Image
            src={image}
            alt={alt}
            fill
            sizes='(min-width: 1280px) 25vw, 50vw'
            className='object-cover'
          />
          <CardLabel
            icon={Icon}
            className='absolute bottom-3 left-3 sm:bottom-4 sm:left-4'
          >
            {label}
          </CardLabel>
        </div>
      ))}
    </div>
  );
}
