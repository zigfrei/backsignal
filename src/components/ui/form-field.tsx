'use client';

import { Field } from '@base-ui/react/field';
import { Input } from '@base-ui/react/input';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { forwardRef, useState, type ComponentPropsWithoutRef } from 'react';
import type { FieldError } from 'react-hook-form';

interface FormFieldProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: FieldError;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField(
    {
      label,
      error,
      type = 'text',
      className,
      showPasswordLabel = 'Show password',
      hidePasswordLabel = 'Hide password',
      ...props
    },
    ref,
  ) {
    const isPassword = type === 'password';
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputType = isPassword && isPasswordVisible ? 'text' : type;

    return (
      <Field.Root className='flex flex-col gap-2' invalid={Boolean(error)}>
        <Field.Label className='typo-body-small font-medium'>
          {label}
        </Field.Label>

        <div className='relative'>
          <Input
            {...props}
            ref={ref}
            type={inputType}
            className={clsx(
              'min-h-11 w-full rounded-lg border border-quaternary bg-base-white px-3 py-2 outline-none transition-colors focus:border-primary data-[invalid]:border-red-600',
              isPassword && 'pr-12',
              className,
            )}
          />

          {isPassword ? (
            <button
              type='button'
              aria-label={
                isPasswordVisible ? hidePasswordLabel : showPasswordLabel
              }
              aria-pressed={isPasswordVisible}
              className='absolute inset-y-0 right-0 flex min-h-11 min-w-11 items-center justify-center text-text-secondary transition-colors hover:text-primary'
              onClick={() => setIsPasswordVisible((visible) => !visible)}
            >
              {isPasswordVisible ? (
                <EyeSlashIcon aria-hidden='true' className='size-5' />
              ) : (
                <EyeIcon aria-hidden='true' className='size-5' />
              )}
            </button>
          ) : null}
        </div>

        <Field.Error
          match={Boolean(error)}
          className='typo-body-small text-red-700'
        >
          {error?.message}
        </Field.Error>
      </Field.Root>
    );
  },
);
