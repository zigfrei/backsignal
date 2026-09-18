import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PublicFeedbackProvider } from '@/components/public-feedback/public-feedback-provider';
import { getMessages } from 'next-intl/server';
import { getPublicFeedbackContext } from '@/data/public-feedback';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' });
export const metadata: Metadata = { robots: { index: false, follow: false }, icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' } };

export default async function PublicFeedbackLayout({ children, params }: { children: React.ReactNode; params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const { locale } = await getPublicFeedbackContext(publicId);
  const messages = await getMessages({ locale });
  return <html lang={locale} className={inter.className}><body className='min-h-dvh bg-background-auth bg-circle-decorators text-base-black'><PublicFeedbackProvider locale={locale} messages={{ PublicFeedback: messages.PublicFeedback }}>{children}</PublicFeedbackProvider></body></html>;
}
