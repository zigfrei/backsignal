import clsx from 'clsx';

type ButtonProps = React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement>
>;

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex items-center rounded-lg bg-primary px-5 py-2.5 text-base-white typo-button cursor-pointer transition-[background-color,translate,box-shadow] duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-button-hover active:translate-y-0 active:bg-primary-active active:shadow-button-active',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function BigButton({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex px-5 py-5 items-center justify-center bg-primary transition-[background-color,translate,box-shadow] duration-300 ease-in-out typo-button-large text-base-white cursor-pointer rounded-xl hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-button-hover active:translate-y-0 active:bg-primary-active active:shadow-button-active',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex items-center rounded-lg text-primary bg-transparent border border-primary px-5 py-[0.5625rem] text-base-white typo-button font-normal cursor-pointer transition-[color,background-color,border-color,font-weight] duration-300 ease-in-out hover:bg-primary/10 hover:text-primary-hover hover:border-primary-hover active:text-primary-active active:border-primary-active',
        className,
      )}
    >
      {children}
    </button>
  );
}
