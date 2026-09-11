'use client';

import { CheckIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

interface CopyButtonProps {
  value: string;
  className?: string;
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isCopied]);

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <button
      type='button'
      aria-label={isCopied ? 'Ссылка скопирована' : 'Скопировать ссылку'}
      title={isCopied ? 'Скопировано' : 'Скопировать ссылку'}
      className={clsx(
        'flex size-11 shrink-0 items-center justify-center rounded-md text-primary transition-colors duration-200 hover:bg-base-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:text-primary-active',
        className,
      )}
      onClick={copyValue}
    >
      <span className='relative size-6'>
        <AnimatePresence initial={false}>
          <motion.span
            key={isCopied ? 'copied' : 'copy'}
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, scale: 0.7, rotate: -12 }
            }
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.7, rotate: 12 }
            }
            transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: 'easeOut' }}
            className='absolute inset-0'
          >
            {isCopied ? (
              <CheckIcon aria-hidden='true' className='size-6 stroke-2' />
            ) : (
              <Square2StackIcon aria-hidden='true' className='size-6 stroke-2' />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className='sr-only' aria-live='polite'>
        {isCopied ? 'Ссылка скопирована' : ''}
      </span>
    </button>
  );
}
