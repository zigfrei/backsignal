'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import SectionBlock from '@/components/ui/section';
import { Icon } from '@iconify/react';
import { BigButton } from '@/components/ui/buttons';
import { motion, AnimatePresence } from 'motion/react';
import { QuizForm } from '@/components/ui/quiz-form';

const steps = [
  {
    answerLabel: 'Материал',
    question: 'Из какого материала оборудование или поверхность?',
    options: [
      {
        label: 'Нержавеющая сталь',
        icon: 'material-symbols:settings',
      },
      {
        label: 'Пластик и полимеры',
        icon: 'material-symbols:water-bottle-outline',
      },
      {
        label: 'Керамика и плитка',
        icon: 'material-symbols:grid-view',
      },
      {
        label: 'Резина и уплотнители',
        icon: 'material-symbols:donut-small',
      },
      {
        label: 'Комбинированные поверхности',
        icon: 'material-symbols:layers',
      },
    ],
  },
  {
    answerLabel: 'Тип загрязнения',
    question: 'Какое загрязнение необходимо удалить?',
    options: [
      {
        label: 'Жир и масла',
        icon: 'material-symbols:oil-barrel-outline',
      },
      {
        label: 'Белковые загрязнения',
        icon: 'material-symbols:egg',
      },
      {
        label: 'Молочный камень',
        icon: 'material-symbols:local-drink',
      },
      {
        label: 'Пивной камень',
        icon: 'material-symbols:sports-bar',
      },
      {
        label: 'Известковый налет и соли',
        icon: 'material-symbols:grain',
      },
      {
        label: 'Ржавчина и окисления',
        icon: 'material-symbols:flare',
      },
      {
        label: 'Органические загрязнения / биопленка',
        icon: 'material-symbols:eco',
      },
      {
        label: 'Микробиологические загрязнения',
        icon: 'material-symbols:coronavirus',
      },
      {
        label: 'Смешанные загрязнения',
        icon: 'material-symbols:layers',
      },
    ],
  },
  {
    answerLabel: 'Вид мойки',
    question: 'Какой тип мойки используется?',
    options: [
      {
        label: 'Пенная мойка',
        icon: 'material-symbols:bubble-chart',
      },
      {
        label: 'Беспенная мойка',
        icon: 'material-symbols:shower',
      },
      {
        label: 'CIP-мойка',
        icon: 'material-symbols:sync-alt',
      },
      {
        label: 'Ручная мойка',
        icon: 'material-symbols:back-hand',
      },
      {
        label: 'Автоматическая мойка',
        icon: 'material-symbols:precision-manufacturing',
      },
      {
        label: 'Дезинфекция',
        icon: 'material-symbols:health-and-safety',
      },
    ],
  },
];

type Answers = Record<number, string>;

type QuizProgressProps = {
  currentStep: number;
  totalSteps: number;
};

function QuizProgress({ currentStep, totalSteps }: QuizProgressProps) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const progressLabel = Math.round(progress);

  return (
    <div
      className='w-full flex flex-col items-start justify-center gap-2'
      aria-label={`Шаг ${currentStep + 1} из ${totalSteps}`}
    >
      <div className='w-full flex items-center justify-between gap-4 typo-b2 text-base-black'>
        <p>
          Шаг {currentStep + 1} из {totalSteps}
        </p>
        <p>{progressLabel}%</p>
      </div>
      <div className='w-full h-5 bg-main-background base-frame overflow-hidden'>
        <div
          className='h-full bg-secondary transition-[width] duration-300 ease-out'
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function Quiz() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const quizTitleRef = useRef<HTMLHeadingElement>(null);

  const isFormStep = currentStepIndex === steps.length;
  const currentStep = steps[currentStepIndex];
  const selectedAnswer = answers[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const canGoNext = !isFormStep && Boolean(selectedAnswer);

  const preparedAnswers = useMemo(
    () => {
      return steps.reduce<Record<string, string>>((result, step, index) => {
        const answer = answers[index];

        if (answer) {
          result[step.answerLabel] = answer;
        }

        return result;
      }, {});
    },
    [answers],
  );

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, []);

  const goToNextStep = () => {
    if (!canGoNext) {
      return;
    }

    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
    }

    setCurrentStepIndex((step) => Math.min(steps.length, step + 1));
  };

  const goToPreviousStep = () => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
    }

    setCurrentStepIndex((step) => Math.max(0, step - 1));
  };

  const handleSelect = (optionLabel: string) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentStepIndex]: optionLabel,
    }));

    quizTitleRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
    }

    autoAdvanceTimer.current = setTimeout(() => {
      setCurrentStepIndex((step) => Math.min(steps.length, step + 1));
    }, 260);
  };

  return (
    <SectionBlock>
      <div className='w-full flex flex-col items-start justify-center gap-4 lg:gap-8'>
        <h2 ref={quizTitleRef} className='typo-h3 text-center scroll-mt-20 lg:scroll-mt-28'>
          Подбор промышленной химии под ваше производство
        </h2>
        <div className='base-frame w-full flex flex-col items-start justify-center gap-4 p-4 lg:p-8'>
          <AnimatePresence mode='wait' initial={false}>
            {isFormStep ? (
              <motion.div
                key='quiz-form'
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className='w-full flex flex-col items-start gap-4'
              >
                <QuizForm answers={preparedAnswers} />
              </motion.div>
            ) : (
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className='w-full flex flex-col items-start gap-4'
              >
                <QuizProgress
                  currentStep={currentStepIndex}
                  totalSteps={steps.length}
                />
                <p className='typo-h4'>{currentStep.question}</p>
                <div className='grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3'>
                  {currentStep.options.map((option) => {
                    const isSelected = selectedAnswer === option.label;

                    return (
                      <button
                        key={option.label}
                        type='button'
                        onClick={() => handleSelect(option.label)}
                        aria-pressed={isSelected}
                        className={clsx(
                          'group flex min-h-24 flex-col items-center lg:items-start justify-between gap-2 p-4 text-left transition-colors base-frame base-outline',
                          isSelected
                            ? 'bg-primary'
                            : 'bg-main-background hover:bg-primary',
                        )}
                      >
                        <Icon
                          icon={option.icon}
                          className='h-20 w-20 text-base-black'
                        />
                        <span className='typo-h45 text-base-black text-center lg:text-left'>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!isFormStep ? (
            <div className='w-full flex items-center justify-center gap-4'>
              <BigButton
                type='button'
                onClick={goToPreviousStep}
                disabled={isFirstStep}
                className='bg-main-background text-base-black'
              >
                Назад
              </BigButton>
              <BigButton
                type='button'
                onClick={goToNextStep}
                disabled={!canGoNext}
                className='bg-primary text-base-black'
              >
                Далее
              </BigButton>
            </div>
          ) : null}
        </div>
      </div>
    </SectionBlock>
  );
}
