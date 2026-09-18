import { Link } from '@/i18n/navigation';
import Logo from '@/assets/icons/logo.svg';
import EnLogo from '@/assets/icons/en/logo.svg';
import { useLocale, useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Layout.Footer');
  const locale = useLocale();
  const LogoComponent = locale === 'en' ? EnLogo : Logo;
  return (
    <footer className='w-full bg-footer border-t-[1px] border-text-secondary'>
      <div className='w-full px-4 py-6 lg:px-12 lg:py-16 max-w-[1440px] flex flex-col items-start justify-start mx-auto'>
        <div className='flex w-full flex-col items-start justify-between mx-auto gap-4 lg:flex-row lg:items-stretch lg:gap-16'>
          <div className='w-full flex flex-col items-start justify-start gap-4'>
            <Link href='/' aria-label={t('aria-label')}>
              <LogoComponent className='h-[60px] w-auto cursor-pointer transition-transform duration-300 ease-out hover:scale-105' />
            </Link>
            <p className='typo-body-large text-left'>{t('description')}</p>
          </div>
          <div className='w-full flex flex-col items-start justify-start gap-4'>
            <p className='typo-body-large'>{t('links.about')}</p>
            <nav>
              <ul className='flex flex-col items-start justify-start gap-2'>
                <li>
                  <Link
                    href='/#for-what'
                    className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
                  >
                    {t('links.for-what')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/#how-it-works'
                    className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
                  >
                    {t('links.how-it-works')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/#faq'
                    className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
                  >
                    {t('links.faq')}
                  </Link>
                </li>
                <li>
                  <Link
                    href='/#feedback'
                    className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
                  >
                    {t('links.feedback')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className='w-full flex flex-col items-start lg:items-end justify-between gap-4'>
            <Link
              href='/politika-konfidencialnosti'
              className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
            >
              {t('links.privacy')}
            </Link>
            <p className='typo-caption lg:text-right'>
              © {new Date().getFullYear()} {t('copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
