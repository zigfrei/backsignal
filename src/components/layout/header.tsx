import { Link } from '@/i18n/navigation';
import { GhostLinkButton, LinkButton } from '../ui/links';
import Logo from '@/assets/icons/logo.svg';
import EnLogo from '@/assets/icons/en/logo.svg';
import { HeaderNavLinks } from './header-nav-links';
import { type MenuItem } from './menu-item';
import { MobileMenu } from './mobile-menu';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleSwitcher } from './locale-switcher';

const menuItemConfig = [
  {
    href: '/#for-what',
    labelKey: 'for-what',
  },
  {
    href: '/#how-it-works',
    labelKey: 'how-it-works',
  },
] as const;

export function Header() {
  const t = useTranslations('Layout.Header');
  const locale = useLocale();
  const LogoComponent = locale === 'en' ? EnLogo : Logo;
  const menuItems: MenuItem[] = menuItemConfig.map(({ href, labelKey }) => ({
    href,
    label: t(`links.${labelKey}`),
  }));

  return (
    <header className='fixed top-0 z-50 w-full bg-main-background border-b-[1px] border-quaternary'>
      <div className='w-full p-4 lg:px-12 lg:py-0 h-20 max-w-[1440px] flex items-center justify-between mx-auto'>
        <Link href='/' aria-label={t('aria-label')} className='inline-block'>
          <LogoComponent className='h-[60px] w-auto cursor-pointer transition-transform duration-300 ease-out hover:scale-105' />
        </Link>
        <nav className='hidden lg:flex items-center justify-center'>
          <HeaderNavLinks items={menuItems} />
        </nav>


        <div className='flex items-center justify-center gap-4'>
          <LocaleSwitcher />
          <GhostLinkButton href='/kontakty/#obraschenie' className='px-6 py-2 hidden lg:flex'>
            {t('login')}
          </GhostLinkButton>
          <LinkButton href='/kontakty/#obraschenie' className='px-6 py-2 hidden lg:flex'>
            {t('signup')}
          </LinkButton>
          <div className='lg:hidden'>
            <MobileMenu items={menuItems} />
          </div>
        </div>
      </div>
    </header>
  );
}
