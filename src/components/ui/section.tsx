import type { ComponentPropsWithoutRef } from 'react';

type SectionProps = ComponentPropsWithoutRef<'section'> & {
  wrapperClassName?: string;
};

export default function SectionBlock({ children, className = '', wrapperClassName='', ...rest }: SectionProps) {
  return (
    <section className={`flex w-full flex items-center justify-center scroll-mt-20 ${className}`} {...rest}>
        <div className={`w-full px-4 py-8 lg:px-12 lg:py-18 max-w-[1440px] flex flex-col items-center justify-center ${wrapperClassName}`}>
          {children}
        </div>
    </section>
  );
}

export function SectionBlockSmall({ children, className = '', wrapperClassName='', ...rest }: SectionProps) {
  return (
    <section className={`flex w-full flex items-center justify-center ${className}`} {...rest}>
        <div className={`w-full px-4 py-6 lg:px-12 lg:py-12 max-w-[1440px] flex flex-col items-center justify-center ${wrapperClassName}`}>
          {children}
        </div>
    </section> 
  );
}
