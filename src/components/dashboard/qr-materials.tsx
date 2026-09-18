'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  printFormats,
  type MaterialOptions,
  type PrintFormat,
} from '@/lib/qr-materials';
import type { OnboardingSummary } from '@/lib/onboarding-schema';
import { Select } from '@/components/ui/select';

export function QrMaterials({ summary }: { summary: OnboardingSummary }) {
  const t = useTranslations('Dashboard.Qr');
  const currentLocale = useLocale();
  const [locale, setLocale] = useState(currentLocale === 'en' ? 'en' : 'ru');
  const [format, setFormat] = useState<PrintFormat>('A6');
  const [name, setName] = useState(summary.name);
  const [prompt, setPrompt] = useState(
    t(`defaults.${currentLocale === 'en' ? 'en' : 'ru'}.prompt`),
  );
  const [customPrompt, setCustomPrompt] = useState(false);
  const [preview, setPreview] = useState<{
    url: string;
    options: MaterialOptions;
  }>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const url = `https://backsignal.tech/q/${summary.publicId}`;
  const options: MaterialOptions = {
    format,
    locale: locale === 'en' ? 'en' : 'ru',
    name: name.trim(),
    prompt: prompt.trim(),
    url,
    brand: t(`defaults.${locale}.brand`),
    caption: t(`defaults.${locale}.caption`),
  };
  const valid = Boolean(options.name && options.prompt);
  const stale =
    !preview || JSON.stringify(preview.options) !== JSON.stringify(options);
  useEffect(() => {
    const objectUrl = preview?.url;
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [preview]);

  async function generate() {
    if (!valid || pending) return;
    setPending(true);
    setError(false);
    try {
      const [{ pdf }, { QrMaterialDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./qr-material-document'),
      ]);
      const blob = await pdf(<QrMaterialDocument options={options} />).toBlob();
      setPreview({ url: URL.createObjectURL(blob), options });
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  const fieldClass =
    'min-h-11 w-full rounded-lg border border-divider bg-base-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-primary';
  const buttonClass =
    'min-h-11 rounded-lg border border-primary px-4 py-2 text-primary disabled:opacity-50';
  return (
    <section className='grid min-w-0 gap-6 lg:grid-cols-2'>
      <div className='flex min-w-0 flex-col gap-5 rounded-xl border border-divider bg-base-white p-5'>
        <p className='text-text-secondary'>{t('description')}</p>
        <Select<PrintFormat>
          label={t('format')}
          value={format}
          onValueChange={setFormat}
          items={Object.entries(printFormats).map(([key, dimensions]) => ({ value: key as PrintFormat, label: `${t(`formats.${key}`)} — ${dimensions.join(' × ')} ${t('mm')}` }))}
        />
        <Select
          label={t('language')}
          value={locale}
          items={[{ value: 'ru', label: 'Русский' }, { value: 'en', label: 'English' }]}
          onValueChange={(next) => {
              setLocale(next);
              if (!customPrompt) setPrompt(t(`defaults.${next}.prompt`));
          }}
        />
        <label className='flex flex-col gap-2'>
          {t('name')}
          <input
            className={fieldClass}
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className='flex flex-col gap-2'>
          {t('prompt')}
          <textarea
            className={fieldClass}
            rows={3}
            maxLength={160}
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              setCustomPrompt(true);
            }}
          />
        </label>
        <p className='typo-body-small text-text-secondary'>{t('textHint')}</p>
        <button
          type='button'
          className={buttonClass}
          disabled={!valid || pending}
          onClick={generate}
        >
          {pending ? t('generating') : t('preview')}
        </button>
        {error && (
          <p role='alert' className='text-red-700'>
            {t('error')}
          </p>
        )}
      </div>
      <div className='flex min-w-0 flex-col gap-4'>
        {preview ? (
          <>
            <iframe
              title={t('previewTitle')}
              src={preview.url}
              className='hidden h-[36rem] w-full rounded-xl border border-divider bg-base-white sm:block'
            />
            {stale && (
              <p role='status' className='text-text-secondary'>
                {t('stale')}
              </p>
            )}
            <a
              className={buttonClass}
              href={preview.url}
              target='_blank'
              rel='noopener noreferrer'
            >
              {t('open')}
            </a>
            {!stale && (
              <a
                className={buttonClass}
                href={preview.url}
                download={`backsignal-${summary.publicId}-${preview.options.format}.pdf`}
              >
                {t('download')}
              </a>
            )}
          </>
        ) : (
          <p className='rounded-xl border border-divider bg-base-white p-6 text-text-secondary'>
            {t('emptyPreview')}
          </p>
        )}
        <p className='typo-body-small text-text-secondary'>{t(format === 'PYRAMID' ? 'pyramidHint' : 'printHint')}</p>
      </div>
    </section>
  );
}
