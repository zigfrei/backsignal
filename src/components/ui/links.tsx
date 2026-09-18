import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
import type { ComponentProps } from 'react';

type LinkButtonProps = ComponentProps<typeof Link>;

export function LinkButton({ children, className, ...rest }: LinkButtonProps) {
  return (
    <Link
      {...rest}
      className={clsx(
        'flex items-center rounded-lg bg-primary px-5 py-2.5 text-base-white typo-button cursor-pointer transition-[background-color,translate,box-shadow] duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-button-hover active:translate-y-0 active:bg-primary-active active:shadow-button-active',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function GhostLinkButton({ children, className, ...rest }: LinkButtonProps) {
  return (
    <Link
      {...rest}
      className={clsx(
        'flex items-center rounded-lg text-primary bg-transparent border border-primary px-5 py-[0.5625rem] text-base-white typo-button font-normal cursor-pointer transition-[color,background-color,border-color,font-weight] duration-300 ease-in-out hover:bg-primary/10 hover:text-primary-hover hover:border-primary-hover active:text-primary-active active:border-primary-active',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function BigLinkButton({ children, className, ...rest }: LinkButtonProps) {
  return (
    <Link
      {...rest}
      className={clsx(
        'flex px-5 py-5 items-center justify-center bg-primary transition-[background-color,translate,box-shadow] duration-300 ease-in-out typo-button-large text-base-white cursor-pointer rounded-xl hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-button-hover active:translate-y-0 active:bg-primary-active active:shadow-button-active',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function TextLink({ children, className, ...rest }: LinkButtonProps) {
  return (
    <Link
      {...rest}
      className={clsx(
        'group inline-flex items-center gap-1 text-primary typo-link cursor-pointer transition-colors duration-300 ease-in-out hover:text-primary-hover active:text-primary-active',
        className,
      )}
    >
      <span className='relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out group-hover:after:scale-x-100'>
        {children}
      </span>
      <ArrowRightIcon
        aria-hidden='true'
        className='size-5 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-1'
      />
    </Link>
  );
}
