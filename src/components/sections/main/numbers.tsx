'use client';
import SectionBlock from '@/components/ui/section';
import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <p ref={ref} className='typo-h2 text-primary'>
      {displayValue}{suffix}
    </p>
  );
}

function StatItem({ value, suffix = '', label }: StatItemProps) {
  return (
    <div className='w-full p-4 lg:p-0 flex flex-col items-center justify-center border-b-[2px] lg:border-b-0 lg:border-r-[2px] border-primary last:border-0'>
      <AnimatedNumber value={value} suffix={suffix} />
      <p className='typo-body text-main-background'>{label}</p>
    </div>
  );
}

const STATS: StatItemProps[] = [
  { value: 95, suffix: '+', label: 'Постоянных партнёров' },
  { value: 50, suffix: '+', label: 'Наименований продукции' },
  { value: 25, suffix: '+', label: 'Лет опыта на рынке' },
];

export default function Numbers() {
  return (
    <SectionBlock className='bg-black'>
      <div className='w-full flex flex-col items-start justify-center lg:gap-16 lg:my-16'>
        <div className='w-full hidden lg:block h-[5px] bg-primary'></div>
        <div className='w-full flex flex-col lg:flex-row items-start justify-center lg:gap-16'>
          {STATS.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </SectionBlock>
  );
}
