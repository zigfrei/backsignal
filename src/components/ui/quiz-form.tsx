'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { QuizFormField } from '../../lib/definitions';
import { BigButton } from '@/components/ui/buttons';
import { submitQuizForm } from '@/app/actions';
import clsx from 'clsx';
import Checkbox from '@/components/ui/checkbox';
import Link from 'next/link';

type QuizFormProps = {
  answers: Record<string, string>;
};

export function QuizForm({ answers }: QuizFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidCooldown, setIsInvalidCooldown] = useState(false);
  const [invalidSubmitAttempt, setInvalidSubmitAttempt] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuizFormField>({
    defaultValues: {
      email: '',
      phone: '',
      policyAgreed: false,
    },
  });

  const onSubmit: SubmitHandler<QuizFormField> = async (values) => {
    setServerError(null);
    values.quizAnswers = answers;

    const response = await submitQuizForm(values);

    if (!response.success) {
      setServerError(response.message);
      return;
    }

    setIsSuccess(true);
    reset();
  };

  const onInvalidSubmit: SubmitErrorHandler<QuizFormField> = () => {
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
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
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
        </motion.div>
      ) : (
        <motion.form
          key='form'
          className='w-full'
          onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
          noValidate
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <p className='typo-h4 mb-4'>
            Наш технолог приступил к подбору средств, оставьте свои контакты
          </p>
          <div className='w-full flex flex-col items-center justify-center'>
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
                  'base-input',
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
                  'base-input',
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
              className='w-full'
              type='submit'
              disabled={isSubmitting || isInvalidCooldown}
            >
              {isSubmitting
                ? 'Отправка...'
                : isInvalidCooldown
                  ? 'Исправьте ошибки...'
                  : 'Подобрать средство'}
            </BigButton>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
