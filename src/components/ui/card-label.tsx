import clsx from 'clsx';
import type { ComponentType, PropsWithChildren, SVGProps } from 'react';

interface CardLabelProps extends PropsWithChildren {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
  variant?: 'overlay' | 'outline';
}

export function CardLabel({
  icon: Icon,
  children,
  className,
  variant = 'overlay',
}: CardLabelProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-2 rounded-full border px-3 py-2 text-base-white sm:px-4',
        variant === 'overlay'
          ? 'max-w-[calc(100%-1.5rem)] border-primary/85 bg-base-black/65 backdrop-blur-sm'
          : 'border-base-white/30 bg-base-black/20',
        className,
      )}
    >
      <Icon
        aria-hidden='true'
        className={clsx(
          'size-5 shrink-0 stroke-2',
          variant === 'overlay' && 'sm:size-6',
        )}
      />
      <span
        className={clsx(
          'typo-body-small font-semibold leading-tight',
          variant === 'overlay' && 'sm:typo-body',
        )}
      >
        {children}
      </span>
    </div>
  );
}
