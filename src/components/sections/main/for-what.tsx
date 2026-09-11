import {
  ChatBubbleLeftRightIcon,
  HeartIcon,
  WrenchScrewdriverIcon, FaceFrownIcon, LightBulbIcon, QrCodeIcon
} from '@heroicons/react/24/solid';
import SectionBlock from '@/components/ui/section';
import { FeatureCard } from '@/components/ui/feature-card';

const reasons = [
  {
    title: 'Услышать недовольного клиента',
    description:
      'Дайте клиенту возможность рассказать о проблеме сразу, пока он ещё у вас и ситуацию можно исправить.',
    Icon: ChatBubbleLeftRightIcon,
  },
  {
    title: 'Дать эмоциям правильный выход',
    description:
      'Если клиент расстроен или зол, ему важно высказаться. Лучше услышать его напрямую, чем узнать о проблеме из публичного отзыва.',
    Icon: FaceFrownIcon,
  },
  {
    title: 'Получать не только жалобы',
    description:
      'Клиенты могут делиться идеями и предложениями. А постоянные гости часто лучше других знают, что можно улучшить.',
    Icon: LightBulbIcon,
  },
  {
    title: 'Не заставлять клиента подстраиваться',
    description:
      'Не нужен ваш мессенджер, аккаунт или электронная почта. Достаточно открыть QR-код и написать.',
    Icon: QrCodeIcon,
  },
  {
    title: 'Получать честную обратную связь',
    description:
      'Без регистрации и необходимости раскрывать свои контакты клиенту проще сказать то, что он действительно думает.',
    Icon: HeartIcon,
  },
  {
    title: 'Исправлять проблемы раньше',
    description:
      'Сообщение приходит напрямую ответственному человеку — без публикации на сторонних площадках.',
    Icon: WrenchScrewdriverIcon,
  },
]

export default function ForWhat() {
  return (
    <SectionBlock id='for-what' wrapperClassName='gap-12 lg:gap-16'>
      <div className='flex w-full flex-col items-center justify-center gap-3'>
        <h2 className='typo-h2 text-center'>Зачем нужен «Обратный сигнал»</h2>
        <p className='typo-body-large text-center text-text-secondary'>
          Лучше узнать о проблеме от клиента, чем из отзыва в интернете.
        </p>
      </div>

      <div className='grid w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8'>
        {reasons.map(({ title, description, Icon }) => (
          <FeatureCard
            key={title}
            title={title}
            description={description}
            icon={Icon}
          />
        ))}
      </div>
    </SectionBlock>
  );
}
