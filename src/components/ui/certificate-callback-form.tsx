'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { CertificateCallBackFormField } from '../../lib/definitions';
import { BigButton } from '@/components/ui/buttons';
import { submitCallbackForm } from '@/app/sertifikaty/actions';
import clsx from 'clsx';
import Checkbox from '@/components/ui/checkbox';
import Link from 'next/link';

export function CertificateCallbackForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidCooldown, setIsInvalidCooldown] = useState(false);
  const [invalidSubmitAttempt, setInvalidSubmitAttempt] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CertificateCallBackFormField>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      policyAgreed: false,
      message: '',
    },
  });

  const onSubmit: SubmitHandler<CertificateCallBackFormField> = async (values) => {
    setServerError(null);

    const response = await submitCallbackForm(values);

    if (!response.success) {
      setServerError(response.message);
      return;
    }

    setIsSuccess(true);
    reset();
  };

  const onInvalidSubmit: SubmitErrorHandler<CertificateCallBackFormField> = () => {
    setIsInvalidCooldown(true);
    setInvalidSubmitAttempt((previous) => previous + 1);
  };

  useEffect(() => {
    if (!isInvalidCooldown) {
      return;
    }

    const timer = setTimeout(() => {
      setIsInvalidCooldown(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [isInvalidCooldown, invalidSubmitAttempt]);

  return (
    <AnimatePresence mode='wait'>
      {isSuccess ? (
        <motion.div
          key='success'
          className='w-full flex flex-col items-center justify-center gap-4 lg:gap-8'
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <p
            className='w-full typo-h4 text-base-black p-4 bg-quaternary text-center base-frame lg:base-frame-big'
            role='alert'
            aria-live='polite'
          >
            Спасибо! Ваше сообщение успешно отправлено. Мы&nbsp;свяжемся
            с&nbsp;вами в&nbsp;ближайшее время.
          </p>
          <BigButton
            className='w-full'
            type='button'
            onClick={() => setIsSuccess(false)}
          >
            Отправить ещё одно сообщение
          </BigButton>
        </motion.div>
      ) : (
        <motion.form
          key='form'
          className='w-full'
          onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
          noValidate
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className='w-full flex flex-col items-center justify-center'>
            <div className='w-full flex flex-col lg:flex-row items-center justify-center lg:gap-4'>
              <div className='w-full flex flex-col items-start justify-start'>
                <label htmlFor='name' className='sr-only'>
                  Ваше имя
                </label>
                <input
                  id='name'
                  type='text'
                  aria-describedby='name-error'
                  aria-invalid={Boolean(errors.name)}
                  placeholder='Ваше имя'
                  className={clsx(
                    'base-input focus:shadow-[0_0_20px_5px_var(--color-secondary)]',
                    errors.name && 'border-tertiary',
                  )}
                  {...register('name', {
                    required: 'Введите ваше имя',
                  })}
                />

                <p
                  id='name-error'
                  className='w-full typo-caption lg:typo-b2 text-tertiary h-8 lg:h-10 pt-2 uppercase'
                  aria-live='polite'
                >
                  {''}
                  {errors.name?.message}
                </p>
              </div>
              <div className='w-full flex flex-col items-start justify-start'>
                <label htmlFor='phone' className='sr-only'>
                  Ваш телефон
                </label>
                <input
                  id='phone'
                  type='text'
                  aria-describedby='phone-error'
                  aria-invalid={Boolean(errors.phone)}
                  placeholder='Ваш телефон'
                  className={clsx(
                    'base-input focus:shadow-[0_0_20px_5px_var(--color-secondary)]',
                    errors.phone && 'border-tertiary',
                  )}
                  {...register('phone', {
                    required: 'Введите телефон',
                    validate: (value) =>
                      value.replace(/\D/g, '').length >= 10 ||
                      'Телефон должен содержать минимум 10 цифр',
                  })}
                />
                <p
                  id='phone-error'
                  className='w-full typo-caption lg:typo-b2 text-tertiary h-8 lg:h-10 pt-2 uppercase'
                  aria-live='polite'
                >
                  {''}
                  {errors.phone?.message}
                </p>
              </div>
            </div>
            <div className='w-full flex flex-col items-start justify-start'>
              <label htmlFor='email' className='sr-only'>
                Ваш email
              </label>
              <input
                id='email'
                type='email'
                aria-describedby='email-error'
                aria-invalid={Boolean(errors.email)}
                placeholder='Ваш email'
                className={clsx(
                  'base-input focus:shadow-[0_0_20px_5px_var(--color-secondary)]',
                  errors.email && 'border-tertiary',
                )}
                {...register('email', {
                  required: 'Введите email',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Введите корректный email',
                  },
                })}
              />
              <p
                id='email-error'
                className='w-full typo-caption lg:typo-b2 text-tertiary h-8 lg:h-10 pt-2 uppercase'
                aria-live='polite'
              >
                {''}
                {errors.email?.message}
              </p>
            </div>

            <div className='w-full flex flex-col items-start justify-start'>
              <label htmlFor='company' className='sr-only'>
                Ваша организация
              </label>
              <input
                id='company'
                type='text'
                aria-describedby='company-error'
                aria-invalid={Boolean(errors.company)}
                placeholder='Ваша организация'
                className={clsx(
                  'base-input focus:shadow-[0_0_20px_5px_var(--color-secondary)]',
                  errors.company && 'border-tertiary',
                )}
                {...register('company', {
                  required: 'Введите название компании',
                })}
              />
              <p
                id='company-error'
                className='w-full typo-caption lg:typo-b2 text-tertiary h-8 lg:h-10 pt-2 uppercase'
                aria-live='polite'
              >
                {''}
                {errors.company?.message}
              </p>
            </div>

            <div className='w-full flex flex-col items-start justify-start'>
              <label htmlFor='message' className='sr-only'>
                Какой документ вас интересует и&nbsp;какая информация нужна?
              </label>
              <textarea
                id='message'
                aria-describedby='message-error'
                aria-invalid={Boolean(errors.message)}
                placeholder='Какой документ вас интересует и&nbsp;какая информация нужна?'
                className={clsx(
                  'base-input focus:shadow-[0_0_20px_5px_var(--color-secondary)]',
                  errors.message && 'border-tertiary',
                )}
                rows={5}
                {...register('message', {
                  required: 'Введите сообщение',
                })}
              />
              <p
                id='message-error'
                className='w-full typo-caption lg:typo-b2 text-tertiary h-8 lg:h-10 pt-2 uppercase'
                aria-live='polite'
              >
                {''}
                {errors.message?.message}
              </p>
            </div>

            <div className='w-full flex flex-col items-start justify-start'>
              <Checkbox
                id='policyAgreed'
                aria-describedby='policyAgreed-error'
                aria-invalid={Boolean(errors.policyAgreed)}
                {...register('policyAgreed', {
                  required:
                    'Необходимо ваше согласие с политикой конфиденциальности',
                })}
                className='w-full'
                labelClassName='typo-b3!'
              >
                Я ознакомлен(а) с{' '}
                <Link
                  href='/politika-konfidencialnosti'
                  target='_blank'
                  className='underline'
                >
                  Политикой в отношении обработки персональных данных
                </Link>{' '}
                и даю согласие ООО «ПроффХим» на обработку моих персональных
                данных, включая их передачу в мессенджер Telegram, в целях
                рассмотрения моего обращения.
              </Checkbox>
              <p
                id='policyAgreed-error'
                className='w-full typo-caption lg:typo-b2 text-tertiary lg:h-10 pt-2 uppercase'
                aria-live='polite'
              >
                {''}
                {errors.policyAgreed?.message}
              </p>
            </div>

            {serverError ? (
              <p
                className='w-full typo-caption lg:typo-b2 text-tertiary h-8 lg:h-10 pt-2 uppercase'
                role='alert'
                aria-live='polite'
              >
                {''}
                {serverError}
              </p>
            ) : null}
            <BigButton
              className='w-full bg-secondary focus:shadow-[0_0_20px_5px_var(--color-secondary)]'
              type='submit'
              disabled={isSubmitting || isInvalidCooldown}
            >
              {isSubmitting
                ? 'Отправка...'
                : isInvalidCooldown
                  ? 'Исправьте ошибки...'
                  : 'Отправить сообщение'}
            </BigButton>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
