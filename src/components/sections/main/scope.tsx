import SectionBlock from '@/components/ui/section';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import type { ComponentType, SVGProps } from 'react';
import CowIcon from '@/assets/icons/scope/cow.svg';
import MilkIcon from '@/assets/icons/scope/milk.svg';
import MeatIcon from '@/assets/icons/scope/meat.svg';
import ChickenIcon from '@/assets/icons/scope/chicken.svg';
import FishIcon from '@/assets/icons/scope/fish.svg';
import SugarIcon from '@/assets/icons/scope/sugar.svg';
import AlcoholIcon from '@/assets/icons/scope/alcohol.svg';
import BreadIcon from '@/assets/icons/scope/bread.svg';
import BarnIcon from '@/assets/icons/scope/barn.svg';
import FactoryIcon from '@/assets/icons/scope/factory.svg';
import CarIcon from '@/assets/icons/scope/car.svg';

type ScopeLayout = 'icon-leading' | 'icon-middle' | 'stacked';

interface ScopeItem {
  number: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  areaClassName: string;
  mobileBgClassName: string;
  desktopBgClassName?: string;
  layout: ScopeLayout;
  desktopColumnLayout?: boolean;
  iconClassName: string;
  imageWrapperClassName: string;
  contentClassName?: string;
  titleClassName?: string;
  link?: string;
}

const SCOPE_ITEMS: ScopeItem[] = [
  {
    number: '01.',
    title: 'Молочная отрасль',
    imageSrc: '/scope/milk.png',
    icon: MilkIcon,
    areaClassName: 'lg:[grid-area:cell1]',
    mobileBgClassName: 'bg-main-background',
    layout: 'icon-leading',
    iconClassName: 'w-12 h-12 lg:w-22 lg:h-22',
    imageWrapperClassName:
      'relative w-[20%] shrink-0 self-stretch overflow-hidden border-2 border-base-black grayscale',
    link: '/moyushchie-sredstva-dlya-molochnoj-promyshlennosti',
  },
  {
    number: '02.',
    title: 'Мясная отрасль',
    imageSrc: '/scope/meat.png',
    icon: MeatIcon,
    areaClassName: 'lg:[grid-area:cell2]',
    mobileBgClassName: 'bg-base-white',
    layout: 'icon-middle',
    iconClassName: 'w-12 h-12 lg:w-20 lg:h-20',
    imageWrapperClassName:
      'relative w-[20%] shrink-0 self-stretch overflow-hidden border-2 border-base-black grayscale',
    link: '/moyushchie-sredstva-dlya-myasnoj-promyshlennosti',
  },
  {
    number: '03.',
    title: 'Переработка птицы',
    imageSrc: '/scope/chicken.png',
    icon: ChickenIcon,
    areaClassName: 'lg:[grid-area:cell3]',
    mobileBgClassName: 'bg-primary',
    layout: 'stacked',
    iconClassName: 'w-12 h-12',
    imageWrapperClassName:
      'relative w-[20%] shrink-0 self-stretch overflow-hidden border-2 border-base-black grayscale lg:w-[20%]',
    link: '/moyushchie-sredstva-dlya-myasnoj-promyshlennosti',
  },
  {
    number: '07.',
    title: 'Рыбная отрасль',
    imageSrc: '/scope/fish.png',
    icon: FishIcon,
    areaClassName: 'lg:[grid-area:cell4]',
    mobileBgClassName: 'bg-main-background',
    layout: 'stacked',
    iconClassName: 'w-12 h-12',
    imageWrapperClassName:
      'relative w-[20%] shrink-0 self-stretch overflow-hidden border-2 border-base-black grayscale lg:w-[20%]',
    titleClassName: 'whitespace-normal break-words',
    link: '/moyushchie-sredstva-dlya-myasnoj-promyshlennosti',
  },
  // {
  //   number: '05.',
  //   title: 'Сахарная отрасль',
  //   imageSrc: '/scope/sugar.png',
  //   icon: SugarIcon,
  //   areaClassName: 'lg:[grid-area:cell5]',
  //   mobileBgClassName: 'bg-primary',
  //   layout: 'stacked',
  //   iconClassName: 'w-12 h-12',
  //   imageWrapperClassName:
  //     'relative w-[20%] shrink-0 self-stretch overflow-hidden border-2 border-base-black grayscale lg:w-[20%]',
  //   titleClassName: 'whitespace-normal break-words',
  // },
    {
    number: '05.',
    title: 'Автомойки и СТО',
    imageSrc: '/scope/car.webp',
    icon: CarIcon,
    areaClassName: 'lg:[grid-area:cell5]',
    mobileBgClassName: 'bg-primary',
    layout: 'stacked',
    iconClassName: 'w-12 h-12',
    imageWrapperClassName:
      'relative w-[20%] shrink-0 self-stretch overflow-hidden border-2 border-base-black grayscale lg:w-[20%]',
    titleClassName: 'whitespace-normal break-words',
    link: '/professionalnaya-avtohimiya',
  },
  {
    number: '06.',
    title: 'Ликероводочная, пивоваренная и безалкогольная отрасль',
    imageSrc: '/scope/brewing.png',
    icon: AlcoholIcon,
    areaClassName: 'lg:[grid-area:cell6]',
    mobileBgClassName: 'bg-base-white',
    layout: 'icon-leading',
    iconClassName: 'w-12 h-12 lg:w-30 lg:h-30',
    imageWrapperClassName:
      'relative w-[20%] shrink-0 self-stretch overflow-hidden border-2 border-base-black grayscale',
    link: '/moyushchie-sredstva-dlya-pivovarennoj-promyshlennosti',
  },
  {
    number: '04.',
    title: 'Хлебобулоч\u00ADная и кондитер\u00ADская отрасль',
    imageSrc: '/scope/cake.png',
    icon: BreadIcon,
    areaClassName: 'lg:[grid-area:cell7]',
    mobileBgClassName: 'bg-main-background',
    desktopBgClassName: 'lg:bg-primary',
    layout: 'stacked',
    desktopColumnLayout: true,
    iconClassName: 'w-12 h-12',
    imageWrapperClassName:
      'relative w-[20%] shrink-0 self-stretch overflow-hidden border-2 border-base-black grayscale lg:w-full lg:h-[40%]',
    titleClassName: 'whitespace-normal break-words',
    link: '/moyushchie-sredstva-dlya-hlebobulochnoj-i-konditerskoj-promyshlennosti',
  },
  {
    number: '08.',
    title: 'Агро-промышлен\u00ADные предприятия',
    imageSrc: '/scope/farm.png',
    icon: BarnIcon,
    areaClassName: 'lg:[grid-area:cell8]',
    mobileBgClassName: 'bg-primary',
    layout: 'stacked',
    desktopColumnLayout: true,
    iconClassName: 'w-12 h-12',
    imageWrapperClassName:
      'relative w-[20%] shrink-0 self-stretch overflow-hidden border-2 border-base-black grayscale lg:w-full lg:h-[60%]',
    titleClassName: 'whitespace-normal break-words',
    link: '/zoogigienicheskie-sredstva-dlya-obrabotki-vymeni-i-kopyt',
  },
  {
    number: '09.',
    title: 'Молочно-товарные фермы',
    imageSrc: '/scope/cow.png',
    icon: CowIcon,
    areaClassName: 'lg:[grid-area:cell9]',
    mobileBgClassName: 'bg-base-white',
    layout: 'stacked',
    iconClassName: 'w-12 h-12',
    imageWrapperClassName:
      'relative w-[20%] shrink-0 self-stretch overflow-hidden border-2 border-base-black grayscale lg:w-[20%]',
    titleClassName: 'whitespace-normal break-words',
    link: '/zoogigienicheskie-sredstva-dlya-obrabotki-vymeni-i-kopyt',
  },
  {
    number: '10.',
    title: 'Ж/д составы, объекты промышленных предприятий',
    imageSrc: '/scope/train.png',
    icon: FactoryIcon,
    areaClassName: 'lg:[grid-area:cell10]',
    mobileBgClassName: 'bg-main-background',
    desktopBgClassName: 'lg:bg-primary',
    layout: 'stacked',
    iconClassName: 'w-12 h-12',
    imageWrapperClassName:
      'relative w-[20%] shrink-0 self-stretch overflow-hidden border-2 border-base-black grayscale lg:w-[20%]',
    titleClassName: 'whitespace-normal break-words',
  },
];

function ScopeItemIcon({
  item,
  className,
}: {
  item: ScopeItem;
  className: string;
}) {
  const Icon = item.icon;

  return <Icon className={className} />;
}

function ScopeCard({ item }: { item: ScopeItem }) {
  const isDesktopStacked = item.layout === 'stacked';
  const isDesktopIconLeading = item.layout === 'icon-leading';
  const isDesktopIconMiddle = item.layout === 'icon-middle';
  const isDesktopColumnLayout = Boolean(item.desktopColumnLayout);
  const className = clsx(
    'w-full w-min-0 base-frame flex p-2 gap-4',
    item.mobileBgClassName,
    item.desktopBgClassName,
    'items-center justify-between',
    isDesktopColumnLayout && 'lg:flex-col lg:items-stretch',
    item.areaClassName,
    item.contentClassName,
  );

  const content = (
    <>
      {isDesktopIconLeading && (
        <ScopeItemIcon
          item={item}
          className={clsx(item.iconClassName, 'hidden lg:block')}
        />
      )}

      <div
        className={clsx(
          'w-full flex flex-col items-start gap-1',
          'justify-between',
          !isDesktopStacked && 'lg:justify-start',
          isDesktopIconMiddle && 'lg:order-1',
        )}
      >
        <div
          className={clsx(
            'w-full flex items-start justify-between gap-2',
            !isDesktopStacked && 'lg:block',
          )}
        >
          <span className='text-[2rem] typo-h4'>{item.number}</span>
          <ScopeItemIcon
            item={item}
            className={clsx(
              item.iconClassName,
              !isDesktopStacked && 'lg:hidden',
            )}
          />
        </div>

        <h3 className={clsx('typo-h5', item.titleClassName)}>{item.title}</h3>

        {item.subtitle && <p className='typo-b2'>{item.subtitle}</p>}
      </div>

      {isDesktopIconMiddle && (
        <ScopeItemIcon
          item={item}
          className={clsx(item.iconClassName, 'hidden lg:block lg:order-2')}
        />
      )}

      <div
        className={clsx(
          item.imageWrapperClassName,
          isDesktopIconMiddle && 'lg:order-3',
          isDesktopColumnLayout && 'lg:self-stretch',
        )}
      >
        <Image
          src={item.imageSrc}
          alt={item.title}
          fill
          sizes='(min-width: 1024px) 10vw, 25vw'
          className='object-cover'
        />
      </div>
    </>
  );

  if (item.link) {
    return (
      <Link
        href={item.link}
        className={clsx(
          className,
          'lg:base-frame-interactive hover:!bg-secondary',
        )}
      >
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

export default function Scope() {
  return (
    <SectionBlock>
      <div className='w-full flex flex-col items-start justify-center'>
        <div
          className="
            self-center w-full max-w-[550px] grid grid-cols-1 gap-4
            lg:max-w-none
            lg:grid-cols-5
            lg:grid-rows-5
            lg:[grid-template-areas:'cell11_cell1_cell1_cell2_cell2''cell11_cell3_cell3_cell7_cell5''cell11_cell6_cell6_cell7_cell8''cell11_cell6_cell6_cell4_cell8''cell11_cell9_cell10_cell10_cell8']"
        >
          <div className='w-full p-4 bg-primary base-frame flex items-center justify-center lg:[grid-area:cell11]'>
            <h2 className='typo-h2 lg:[writing-mode:vertical-rl] lg:[text-orientation:mixed] lg:rotate-180'>
              <span className='block'>Сфера</span>{' '}
              <span className='block'>применения</span>
            </h2>
          </div>

          {SCOPE_ITEMS.map((item) => (
            <ScopeCard key={item.number} item={item} />
          ))}
        </div>
      </div>
    </SectionBlock>
  );
}
