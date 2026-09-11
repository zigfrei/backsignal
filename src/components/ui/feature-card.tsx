import clsx from 'clsx';
import type { ComponentType, SVGProps } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  className,
}: FeatureCardProps) {
  return (
    <article
      className={clsx(
        'flex h-full flex-col items-start rounded-xl border border-divider bg-base-white p-6',
        className,
      )}
    >
      <div className='mb-7 flex size-12 items-center justify-center rounded-full bg-disabled'>
        <Icon aria-hidden='true' className='size-6 shrink-0 stroke-2 text-base-black' />
      </div>
      <h3 className='typo-h3 text-text-primary'>{title}</h3>
      <p className='mt-3 typo-body text-text-secondary'>{description}</p>
    </article>
  );
}
