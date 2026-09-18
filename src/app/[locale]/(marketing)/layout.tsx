import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

const allowIndexing = process.env.APP_ENV === 'production';

export const metadata: Metadata = {
  robots: { index: allowIndexing, follow: allowIndexing },
};

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
