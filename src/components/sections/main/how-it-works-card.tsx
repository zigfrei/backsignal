import Image from 'next/image';

interface HowItWorksCardProps {
  number: string;
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export function HowItWorksCard({
  number,
  label,
  title,
  description,
  image,
  imageAlt,
}: HowItWorksCardProps) {
  return (
    <article className='flex h-full flex-col rounded-xl border border-divider bg-base-white p-4 sm:p-5'>
      <div className='flex items-center gap-4'>
        <span className='flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-xl font-bold text-base-black'>
          {number}
        </span>
        <p className='typo-caption font-semibold uppercase tracking-[0.14em] text-text-primary'>
          {label}
        </p>
      </div>

      <h3 className='mt-5 typo-h3 text-text-primary'>{title}</h3>
      <p className='mt-3 typo-body text-text-secondary'>{description}</p>

      <div className='mt-auto w-full pt-4'>
        <div className='relative mx-auto aspect-square w-full max-w-[600px]'>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes='(min-width: 1024px) 400px, (min-width: 672px) 600px, calc(100vw - 4rem)'
            className='rounded-lg object-cover object-center'
          />
        </div>
      </div>
    </article>
  );
}
