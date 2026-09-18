import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer-auth';
import { Header } from '@/components/layout/header-auth';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='flex min-h-dvh w-full flex-col bg-background-auth bg-circle-decorators lg:h-dvh'>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
