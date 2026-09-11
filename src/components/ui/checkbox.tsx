import { CheckIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useId } from 'react';

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
  children?: React.ReactNode;
  labelClassName?: string;
};

export default function Checkbox({
  label,
  children,
  className,
  labelClassName,
  id,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const labelContent = children ?? label;

  return (
    <label htmlFor={checkboxId} className={clsx('group flex items-start gap-2 cursor-pointer', className)}>
      <input
        id={checkboxId}
        type='checkbox'
        className='peer sr-only'
        {...rest}
      />

      <span className='w-5 h-5 mt-[5px] lg:mt-[7px] shrink-0 border-[2px] border-base-black flex items-center justify-center bg-base-white peer-checked:bg-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-base-black transition-colors'>
        <CheckIcon className='w-4 h-4 text-base-black opacity-0 group-has-[:checked]:opacity-100 transition-opacity' />
      </span>

      {labelContent ? (
        <span className={clsx('typo-b2 uppercase font-bold', labelClassName)}>{labelContent}</span>
      ) : null}
    </label>
  );
}