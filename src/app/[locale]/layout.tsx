import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SnackbarProvider } from '@/components/ui/snackbar';
import { YandexMetrika } from '@/components/analytics/yandex-metrika';
// import { GoogleTagManager } from '@/components/analytics/google-tag-manager';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
// const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
const yandexWebmasterVerification = process.env.YANDEX_WEBMASTER_VERIFICATION;


export const metadata: Metadata = {
  metadataBase: new URL('https://backsignal.tech'),
  robots: {
    index: false,
    follow: false,
  },
  verification: yandexWebmasterVerification
    ? {
        yandex: yandexWebmasterVerification,
      }
    : undefined,
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml', rel: 'icon' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${inter.className} antialiased`}>
      <body
        className='bg-main-background text-base-black flex min-h-dvh flex-col items-center justify-start'
      >
        <NextIntlClientProvider>
          <SnackbarProvider>
            {/* {googleTagManagerId ? <GoogleTagManager containerId={googleTagManagerId} /> : null} */}
            {children}
            {yandexMetrikaId ? <YandexMetrika counterId={yandexMetrikaId} /> : null}
          </SnackbarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
