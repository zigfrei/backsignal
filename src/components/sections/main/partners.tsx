import SectionBlock from '@/components/ui/section';
import Image from 'next/image';

interface Partner {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const partners: Partner[] = [
  { src: '/partners/1.webp', alt: 'Partner 1', width: 246, height: 291 },
  { src: '/partners/2.png', alt: 'Partner 2', width: 150, height: 160 },
  { src: '/partners/3.png', alt: 'Partner 3', width: 255, height: 122 },
  { src: '/partners/1.webp', alt: 'Partner 1', width: 246, height: 291 },
  { src: '/partners/2.png', alt: 'Partner 2', width: 150, height: 160 },
  { src: '/partners/3.png', alt: 'Partner 3', width: 255, height: 122 },
  { src: '/partners/1.webp', alt: 'Partner 1', width: 246, height: 291 },
  { src: '/partners/2.png', alt: 'Partner 2', width: 150, height: 160 },
  { src: '/partners/3.png', alt: 'Partner 3', width: 255, height: 122 },
  { src: '/partners/1.webp', alt: 'Partner 1', width: 246, height: 291 },
  { src: '/partners/2.png', alt: 'Partner 2', width: 150, height: 160 },
  { src: '/partners/3.png', alt: 'Partner 3', width: 255, height: 122 },
  { src: '/partners/1.webp', alt: 'Partner 1', width: 246, height: 291 },
  { src: '/partners/2.png', alt: 'Partner 2', width: 150, height: 160 },
  { src: '/partners/3.png', alt: 'Partner 3', width: 255, height: 122 },
];

export default function Partners() {
  return (
    <SectionBlock>
      <div className='w-full flex flex-col items-start justify-center gap-4 lg:gap-16'>
        <h2 className='typo-h2'>Наши партнеры</h2>
        <div className='w-full flex items-center justify-between lg:justify-center gap-3 lg:gap-4 flex-wrap'>
          {partners.map((partner, index) => (
            <div
              key={index}
              className='group flex items-center justify-center w-[100px] h-[100px] lg:w-[200px] lg:h-[150px] bg-base-white base-frame'
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                className='block w-[70px] lg:w-[100px] lg:grayscale group-hover:grayscale-0 transition-all duration-300'
              />
            </div>
          ))}
        </div>
      </div>
    </SectionBlock>
  );
}
