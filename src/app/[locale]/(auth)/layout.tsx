import { Footer } from '@/components/layout/footer-auth';
import { Header } from '@/components/layout/header-auth';

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='flex h-screen w-full flex-col bg-background-auth bg-circle-decorators'>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
