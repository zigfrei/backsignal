import SectionBlock from '@/components/ui/section';
import { BigLinkButton } from '@/components/ui/links';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import EEU from '@/assets/icons/documents/Emblem_of_the_Eurasian_Economic_Union.svg';
import SMK from '@/assets/icons/documents/smk.svg';
import EAC from '@/assets/icons/documents/eac.svg';
import TISI from '@/assets/icons/documents/tisi.svg';
import Halal from '@/assets/icons/documents/halal.svg';
import Link from 'next/link';

export default function Documents() {
  return (
    <SectionBlock>
      <div className='w-full flex flex-col items-stretch justify-stretch gap-4 lg:gap-8 base-frame-big p-4 lg:p-8'>
        <Link href='/sertifikaty'>
          <h2 className='w-full text-[1.6rem] sm:text-[2rem] lg:text-[4rem] typo-h2 text-center lg:text-left'>
            Сертификация и разрешения
          </h2>
        </Link>
        <div className='w-full flex-col lg:flex-row flex items-center justify-center gap-4 lg:gap-8'>
          <div className='w-full flex items-center justify-center gap-4 p-4 base-frame'>
            <EEU className='w-30 h-30' />
          </div>
          <div className='w-full flex items-center justify-center gap-4 p-4 base-frame'>
            <SMK className='w-30 h-30' />
          </div>
          <div className='w-full flex items-center justify-center gap-4 p-4 base-frame'>
            <EAC className='w-30 h-30' />
          </div>
          <div className='w-full flex items-center justify-center gap-4 p-4 base-frame'>
            <Halal className='w-30 h-30' />
          </div>
        </div>
        <p className='w-full border-l-[5px] border-base-black pl-4 typo-body'>
          Соответствие требованиям ТР ТС, стандартам РФ и РБ. Полное юридическое
          сопровождение сделок и наличие всей разрешительной документации на
          цикл производства и оптовых поставок.
        </p>
        <BigLinkButton
          href='/sertifikaty'
          className='group self-center flex items-center justify-center gap-2'
        >
          Перейти к документам
          <ArrowRightIcon className='h-8 w-8 transition-transform duration-300 ease-out group-hover:translate-x-1 [&>path]:stroke-[3]' />
        </BigLinkButton>
      </div>
    </SectionBlock>
  );
}
