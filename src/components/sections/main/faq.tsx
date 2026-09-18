import SectionBlock from '@/components/ui/section';
import FAQItem from '@/components/ui/faq-item';
import { useTranslations } from 'next-intl';
import { faqItemKeys } from '@/lib/landing-faq';

export default function FAQ() {
  const t = useTranslations('Landing.FAQ');

  return (
    <SectionBlock id='faq' className='bg-disabled'>
      <div className='w-full flex items-center justify-center gap-4 lg:gap-8 flex-col faq-container'>
        <h3 className='typo-h2'>{t('title')}</h3>
        {faqItemKeys.map((itemKey) => (
          <FAQItem
            key={itemKey}
            question={t(`items.${itemKey}.question`)}
            answer={t(`items.${itemKey}.answer`)}
          />
        ))}
      </div>
    </SectionBlock>
  );
}
