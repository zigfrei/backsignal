import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
// import { YandexMetrika } from '@/components/analytics/yandex-metrika';
// import { GoogleTagManager } from '@/components/analytics/google-tag-manager';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';
// const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
// const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
// const yandexWebmasterVerification = process.env.YANDEX_WEBMASTER_VERIFICATION;


export const metadata: Metadata = {
  // metadataBase: new URL('https://backsignal.tech'),
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
  },
  // verification: yandexWebmasterVerification
  //   ? {
  //       yandex: yandexWebmasterVerification,
  //     }
  //   : undefined,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru' className={`${inter.className} antialiased`}>
      <body
        className={`bg-main-background text-base-black flex flex-col items-center justify-center min-h-screen`}
      >
        {/* {googleTagManagerId ? <GoogleTagManager containerId={googleTagManagerId} /> : null} */}
        <Header />
        {children}
        <Footer />
        {/* {yandexMetrikaId ? <YandexMetrika counterId={yandexMetrikaId} /> : null} */}
      </body>
    </html>
  );
}
