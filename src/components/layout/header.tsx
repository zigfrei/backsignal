import { Link } from '@/i18n/navigation';
import Logo from '@/assets/icons/logo.svg';
import EnLogo from '@/assets/icons/en/logo.svg';
import LogoWhite from '@/assets/icons/logo-white.svg';
import EnLogoWhite from '@/assets/icons/en/logo-white.svg';
import { HeaderNavLinks } from './header-nav-links';
import { type MenuItem } from './menu-item';
import { MobileMenu } from './mobile-menu';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleSwitcher } from './locale-switcher';
import { HeaderAuthActions } from './header-auth-actions';

const menuItemConfig = [
  {
    href: '/#for-what',
    labelKey: 'for-what',
  },
  {
    href: '/#how-it-works',
    labelKey: 'how-it-works',
  },
  {
    href: '/#faq',
    labelKey: 'faq',
  }
] as const;

export function Header() {
  const t = useTranslations('Layout.Header');
  const locale = useLocale();
  const LogoComponent = locale === 'en' ? EnLogo : Logo;
  const LogoComponentWhite = locale === 'en' ? EnLogoWhite : LogoWhite;
  const menuItems: MenuItem[] = menuItemConfig.map(({ href, labelKey }) => ({
    href,
    label: t(`links.${labelKey}`),
  }));

  return (
    <header className='fixed top-0 z-50 w-full bg-secondary-background lg:bg-main-background border-b-[1px] border-secondary-background lg:border-quaternary'>
      <div className='w-full p-4 lg:px-12 lg:py-0 h-23 lg:h-20 max-w-[1440px] flex items-center justify-between mx-auto'>
        <Link href='/' aria-label={t('aria-label')} className='inline-block'>
          <LogoComponent className='hidden lg:block h-[60px] w-auto cursor-pointer transition-transform duration-300 ease-out hover:scale-105' />
          <LogoComponentWhite className='block lg:hidden h-[60px] w-auto cursor-pointer transition-transform duration-300 ease-out hover:scale-105' />
        </Link>
        <nav className='hidden lg:flex items-center justify-center'>
          <HeaderNavLinks items={menuItems} />
        </nav>


        <div className='flex items-center justify-center gap-4'>
          <LocaleSwitcher />
          <HeaderAuthActions />
          <div className='lg:hidden'>
            <MobileMenu
              variant='marketing'
              items={menuItems}
              authActions={<HeaderAuthActions variant='mobile' />}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
