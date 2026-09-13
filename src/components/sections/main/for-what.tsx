import {
  ChatBubbleLeftRightIcon,
  HeartIcon,
  WrenchScrewdriverIcon, FaceFrownIcon, LightBulbIcon, QrCodeIcon
} from '@heroicons/react/24/solid';
import SectionBlock from '@/components/ui/section';
import { FeatureCard } from '@/components/ui/feature-card';
import { useTranslations } from 'next-intl';

const reasons = [
  {
    CardNumber: '1',
    Icon: ChatBubbleLeftRightIcon,
  },
  {
    CardNumber: '2',
    Icon: FaceFrownIcon,
  },
  {
    CardNumber: '3',
    Icon: LightBulbIcon,
  },
  {
    CardNumber: '4',
    Icon: QrCodeIcon,
  },
  {
    CardNumber: '5',
    Icon: HeartIcon,
  },
  {
    CardNumber: '6',
    Icon: WrenchScrewdriverIcon,
  },
]

export default function ForWhat() {
  const t = useTranslations('Landing.ForWhat');
  return (
    <SectionBlock id='for-what' wrapperClassName='gap-12 lg:gap-16'>
      <div className='flex w-full flex-col items-center justify-center gap-3'>
        <h2 className='typo-h2 text-center'>{t('title')}</h2>
        <p className='typo-body-large text-center text-text-secondary'>
          {t('description')}
        </p>
      </div>

      <div className='grid w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8'>
        {reasons.map(({ CardNumber, Icon }) => (
          <FeatureCard
            key={CardNumber}
            title={t(`cards.${CardNumber}.title`)}
            description={t(`cards.${CardNumber}.description`)}
            icon={Icon}
          />
        ))}
      </div>
    </SectionBlock>
  );
}
