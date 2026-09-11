'use client';
import type { ComponentPropsWithoutRef } from 'react';
import { useState } from 'react';
import styles from './faq-item.module.css';
import clsx from 'clsx';

type FAQProps = ComponentPropsWithoutRef<'details'> & {
  question: string;
  answer: string;
};

export default function FAQItem({
  question,
  answer,
  className = '',
  ...rest
}: FAQProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='w-full flex items-center justify-center relative'>
      <details
        open={isOpen}
        className={clsx(
          'w-full rounded-xl bg-white p-4 lg:p-8 pr-9 lg:pr-16 flex flex-col items-start justify-start',
          className, styles.details
        )}
        {...rest}
      >
        <summary
          className='list-none cursor-pointer flex w-full items-center justify-start'
          onClick={(e) => {
            e.preventDefault();
            handleToggle();
          }}
        >
          <h4 className='typo-h4'>{question}</h4>
        </summary>
        <div className={clsx(styles.content, isOpen && styles.contentOpen)}>
          <p className='typo-body'>{answer}</p>
        </div>
      </details>
      <button
        className={clsx(styles.plusminus, isOpen && styles.active)}
        onClick={handleToggle}
        type='button'
        aria-label='Toggle FAQ'
      />
    </div>
  );
}