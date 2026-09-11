import SectionBlock from '@/components/ui/section';
import { HowItWorksCard } from './how-it-works-card';
import { BigLinkButton } from '@/components/ui/links';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { FeedbackLoop } from './feedback-loop';

const steps = [
  {
    number: '01',
    label: 'Разместите QR-код',
    title: 'Разместите QR-код в удобном для клиента месте',
    description:
      'На столе, стойке, чеке, упаковке, двери или в любом другом месте, где клиент его увидит.',
    image: '/how-it-works-card-1.png',
    imageAlt: 'Табличка с QR-кодом на столе',
  },
  {
    number: '02',
    label: 'Клиент оставляет отзыв',
    title: 'Клиент сканирует QR-код и оставляет обратную связь',
    description:
      'Клиент открывает простую форму в браузере, без регистрации, приложений и передачи контактных данных.',
    image: '/how-it-works-card-2.png',
    imageAlt: 'Форма обратной связи на экране телефона',
  },
  {
    number: '03',
    label: 'Получите сигнал',
    title: 'Вы получаете уведомление',
    description:
      'Сообщение сразу приходит в ваш личный кабинет или на email. Вы можете быстро узнать, что понравилось клиенту, что пошло не так или какие есть идеи для улучшения.',
    image: '/how-it-works-card-3.png',
    imageAlt: 'Новые сообщения клиентов в личном кабинете',
  },
];

export default function HowItWorks() {
  return (
    <SectionBlock
      id='how-it-works'
      className='scroll-mt-20 bg-[linear-gradient(to_bottom,var(--color-secondary-background)_0_30%,var(--color-main-background)_30%_100%)]'
      wrapperClassName='gap-8 lg:gap-12'
    >
      <div className='flex w-full flex-col items-center justify-center gap-2'>
        <p className='typo-caption font-semibold uppercase tracking-[0.16em] text-secondary'>
          Простой процесс
        </p>
        <h2 className='typo-h2 text-center text-base-white'>
          Как работает «Обратный сигнал»
        </h2>
        <p className='typo-body-large text-center text-base-white'>
          Три простых шага — и вы начинаете получать обратную связь от своих
          клиентов.
        </p>
      </div>

      <div className='grid w-full grid-cols-1 gap-6 lg:grid-cols-3'>
        {steps.map((step) => (
          <HowItWorksCard key={step.number} {...step} />
        ))}
      </div>

      <FeedbackLoop />

      <BigLinkButton
        href='/#'
        className='group w-full max-w-[420px] justify-center self-center gap-0 lg:w-auto lg:max-w-none'
      >
        <span className='px-2'>Начать получать обратную связь</span>

        <ArrowRightIcon
          aria-hidden='true'
          className='size-6 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-1'
        />
      </BigLinkButton>
    </SectionBlock>
  );
}
