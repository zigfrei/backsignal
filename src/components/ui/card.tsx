import clsx from 'clsx';
import Image from 'next/image';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './card.module.css';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Product } from '@/features/catalog/products/config';
import Link from 'next/link';
import { getProductHref } from '@/features/catalog/filters';

type CardProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & Product;

export function Card({
  id,
  name,
  seoName,
  description,
  seoDescription,
  image,
  slug,
  label,
  labelImage,
  productType,
  foamType,
  sanitationObjects,
  contaminationType,
  className,
  ...rest
}: CardProps) {
  return (
    <Link
      {...rest}
      href={getProductHref({ slug, productType })}
      aria-label={`Подробнее о ${name}`}
      className={clsx(
        'w-full h-full p-2 flex flex-col items-start base-frame gap-2',
        styles.card,
        className,
      )}
    >
      <div
        className={clsx(
          'w-full aspect-square shrink-0 border-2 border-base-black',
          styles.cardImageWrapper,
        )}
      >
        <Image
          src={image}
          alt={seoName || name}
          fill
          sizes='(min-width: 768px) 50vw, 100vw'
          className={styles.cardImage}
        />
      </div>
      <div className='w-full flex-1 min-h-0 flex flex-col justify-start gap-2 mt-auto'>
        <h3 className='typo-h4'>{name}</h3>
        {description && (
          <p className='typo-b2 line-clamp-3 font-regular mb-auto'>
            {description}
          </p>
        )}
      </div>
      <div aria-hidden="true" className='flex h-13.5 px-6 py-2 items-center typo-h5 base-frame lg:base-frame-interactive group w-full items-center justify-center gap-2 bg-base-black text-primary shadow-[5px_5px_0_0_var(--color-primary)]! hover:shadow-[4px_4px_0_0_var(--color-primary)]! '>
        Подробнее
        <ArrowRightIcon className='h-6 w-6 transition-transform duration-300 ease-out group-hover:translate-x-1 [&>path]:stroke-[2]' />
      </div>
    </Link>
  );
}
