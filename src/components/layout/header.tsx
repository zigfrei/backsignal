import Link from 'next/link';
import { GhostLinkButton, LinkButton } from '../ui/links';
import Logo from '@/assets/icons/logo3.svg';
import { HeaderNavLinks } from './header-nav-links';
import { type MenuItem } from './menu-item';
import { MobileMenu } from './mobile-menu';

const menuItems: MenuItem[] = [
  {
    href: '/#for-what',
    label: 'Зачем это нужно?',
  },
  {
    href: '/#how-it-works',
    label: 'Как это работает?',
  },
];

export function Header() {
  return (
    <header className='fixed top-0 z-50 w-full bg-main-background border-b-[1px] border-quaternary'>
      <div className='w-full p-4 lg:px-12 lg:py-0 h-20 max-w-[1440px] flex items-center justify-between mx-auto'>
        <Link href='/' aria-label='На главную' className='inline-block'>
          <Logo className='w-[160px] h-[60px] transition-transform duration-300 ease-out hover:scale-105 cursor-pointer' />
        </Link>
        <nav className='hidden lg:flex items-center justify-center'>
          <HeaderNavLinks items={menuItems} />
        </nav>


        <div className='flex items-center justify-center gap-4'>
          <GhostLinkButton href='/kontakty/#obraschenie' className='px-6 py-2 hidden lg:flex'>
            Войти
          </GhostLinkButton>
        <LinkButton href='/kontakty/#obraschenie' className='px-6 py-2 hidden lg:flex'>
          Начать пользоваться
        </LinkButton>
        </div>

        <div className='lg:hidden'>
          <MobileMenu items={menuItems} />
        </div>
      </div>
    </header>
  );
}
