'use client';

import { useId, useState } from 'react';
import Image, { type ImageProps } from 'next/image';

type BeforeAndAfterItemProps = {
  beforeSrc: ImageProps['src'];
  afterSrc: ImageProps['src'];
  beforeAlt?: string;
  afterAlt?: string;
};

export default function BeforeAndAfterItem({
  beforeSrc,
  afterSrc,
  beforeAlt = 'До',
  afterAlt = 'После',
}: BeforeAndAfterItemProps) {
  const [position, setPosition] = useState(50);
  const sliderId = useId();

  return (
        <div className='relative w-full overflow-hidden base-frame lg:base-frame-big'>
          <div className='relative aspect-[16/9] w-full select-none'>
          <div className='absolute top-2 left-2 z-2 flex items-center justify-center px-4 py-2 bg-base-black'> 
              <p className='typo-h5 text-base-white'>До</p>
          </div>
          <div className='absolute top-2 right-2 z-2 flex items-center justify-center px-4 py-2 bg-base-black base-shadow'> 
              <p className='typo-h5 text-primary'>После</p>
            </div>
            <Image
              src={afterSrc}
              alt={afterAlt}
              fill
              sizes='75vw'
              className='object-cover'
            />
            <div
              className='absolute inset-0 overflow-hidden'
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <Image
                src={beforeSrc}
                alt={beforeAlt}
                fill
                sizes='75vw'
                className='object-cover brightness-[.75] contrast-125 saturate-75'
              />
            </div>

            <div
              className='pointer-events-none absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[8px_0px_20px_1px_var(--color-primary)]'
              style={{ left: `${position}%` }}
            />
            <div
              className='pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border border-white bg-black/60 px-2 py-1 text-xs text-white whitespace-nowrap'
              style={{ left: `${position}%` }}
            >
              ◀ ▶
            </div>

            <label htmlFor={sliderId} className='sr-only'>
              Сравнение до и после
            </label>
            <input
              id={sliderId}
              type='range'
              min={0}
              max={100}
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className='absolute inset-0 h-full w-full cursor-ew-resize opacity-0'
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={position}
            />
          </div>
        </div>
  );
}
