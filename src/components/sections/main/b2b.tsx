import SectionBlock from '@/components/ui/section';
import { LinkButton } from '@/components/ui/links';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Experiment from '@/assets/icons/b2b/experiment.svg';
import Package from '@/assets/icons/b2b/package.svg';
import Shipping from '@/assets/icons/b2b/local_shipping.svg';
import Support from '@/assets/icons/b2b/support_agent.svg';
import Link from 'next/link';

export default function B2B() {
  return (
    <SectionBlock>
      <div className='w-full flex-col lg:flex-row flex items-stretch justify-stretch base-frame-big'>
        <div className='w-full flex items-center lg:items-start flex-col gap-4 bg-tertiary p-4 lg:p-8 border-b-[5px] lg:border-b-0 lg:border-r-[5px] border-base-black'>
          <p className='text-center lg:text-left typo-b3 uppercase bg-primary text-base-black inline-block px-4 py-2'>
            Контрактное производство под вашей маркой
          </p>
          <Link href='/kontraktnoe-proizvodstvo-moyushchih-i-dezinficiruyushchih-sredstv'>
            <h2 className='w-full typo-h2 lg:text-[3rem] xl:text-[4rem] text-center lg:text-left'>
              Надёжный поставщик Private Label и&nbsp;White Label
            </h2>
          </Link>
        </div>
        <div className='w-full flex flex-col items-start gap-4 p-4 lg:p-8'>
          <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <div className='p-2 base-frame flex flex-col items-start gap-2 bg-primary'>
              <Experiment className='h-16 w-16' />
              <p className='typo-h5'>своя лаборатория</p>
              <p className='typo-b3'>
                Ваши рецептуры или готовая база из 100+ формул
              </p>
            </div>

            <div className='p-2 base-frame flex flex-col items-start gap-2 bg-base-white'>
              <Package className='h-16 w-16' />
              <p className='typo-h5'>Поставка в любых объемах</p>
              <p className='typo-b3'>
                Еврокубы с&nbsp;обрешёткой на&nbsp;1000&nbsp;л, бочки
                200&nbsp;л, канистры, ПЭТ-бутылки и&nbsp;флаконы
              </p>
            </div>

            <div className='p-2 base-frame flex flex-col items-start gap-2 bg-primary lg:bg-base-white'>
              <Shipping className='h-16 w-16' />
              <p className='typo-h5'>Собственная логистика</p>
              <p className='typo-b3'>Быстрая и надежная доставка</p>
            </div>

            <div className='p-2 base-frame flex flex-col items-start gap-2 bg-base-white lg:bg-primary'>
              <Support className='h-16 w-16' />
              <p className='typo-h5'>Поддержка клиентов</p>
              <p className='typo-b3'>
                Квалифицированная помощь и консультации по всем вопросам
              </p>
            </div>
          </div>
          <LinkButton
            href='/kontakty/#obraschenie'
            className='group flex items-center justify-center gap-2 p-3! h-auto!'
          >
            Запросить коммерческое предложение
            <ArrowRightIcon className='shrink-0 h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1 [&>path]:stroke-[2]' />
          </LinkButton>

          <LinkButton
            href='/kontraktnoe-proizvodstvo-moyushchih-i-dezinficiruyushchih-sredstv'
            className='group flex items-center justify-center gap-2 bg-main-background!'
          >
            Подробнее
            <ArrowRightIcon className='h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1 [&>path]:stroke-[2]' />
          </LinkButton>
        </div>
      </div>
    </SectionBlock>
  );
}
