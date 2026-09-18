'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CopyButton } from '@/components/ui/copy-button';
import type { OnboardingSummary } from '@/lib/onboarding-schema';

export function OnboardingQr({ summary }: { summary: OnboardingSummary }) {
  const t = useTranslations('Dashboard.Onboarding');
  const canvas = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<{
    url: string;
    png?: string;
    svg?: string;
    error?: boolean;
  }>();
  const url = `https://backsignal.tech/q/${summary.publicId}`;
  const png = result?.url === url ? result.png : undefined;
  const svg = result?.url === url ? result.svg : undefined;
  const error = result?.url === url && result.error;

  useEffect(() => {
    let canceled = false;
    import('qrcode')
      .then(async (qr) => {
        if (canceled || !canvas.current) return;
        await qr.toCanvas(canvas.current, url, {
          width: 2048,
          margin: 4,
          errorCorrectionLevel: 'M',
        });
        const svgContent = await qr.toString(url, { type: 'svg', margin: 4, errorCorrectionLevel: 'M' });
        if (!canceled)
          setResult({ url, png: canvas.current.toDataURL('image/png'), svg: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}` });
      })
      .catch(() => {
        if (!canceled) setResult({ url, error: true });
      });
    return () => {
      canceled = true;
    };
  }, [url]);

  return (
    <div className='flex min-w-0 flex-col items-center gap-4'>
      <div className='aspect-square w-full max-w-60'>
        <canvas
          ref={canvas}
          role='img'
          aria-label={t('qrAlt', { name: summary.name })}
          className='!h-full !w-full rounded-lg bg-base-white'
        />
      </div>
      {error && (
        <p role='alert' className='text-red-700'>
          {t('qrError')}
        </p>
      )}
      <div className='flex w-full min-w-0 items-center gap-2 rounded-lg border border-divider p-2'>
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex min-h-11 min-w-0 flex-1 items-center break-all rounded-md typo-body-small text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
        >
          {url}
        </a>
        <CopyButton value={url} />
      </div>
      {png && (
        <a
          href={png}
          download={`backsignal-${summary.publicId}.png`}
          className='flex min-h-11 items-center rounded-lg border border-primary px-4 py-2 text-primary'
        >
          {t('download')}
        </a>
      )}
      {svg && (
        <a href={svg} download={`backsignal-${summary.publicId}.svg`} className='flex min-h-11 items-center rounded-lg border border-primary px-4 py-2 text-primary'>
          {t('downloadSvg')}
        </a>
      )}
    </div>
  );
}
