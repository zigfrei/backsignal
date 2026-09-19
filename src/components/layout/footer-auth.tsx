import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Layout.Footer');
  return (
    <footer className='w-full bg-main-background border-t-[1px] border-quaternary'>
      <div className='w-full px-4 py-4 lg:px-6 lg:py-8 max-w-[1440px] flex flex-col items-start justify-start mx-auto'>
        <div className='flex w-full flex-col lg:flex-row items-center justify-between mx-auto gap-4 lg:gap-16'>
            <p className='typo-caption w-full text-left'>
              © {new Date().getFullYear()} {t('copyright')}
            </p>

          <div className='order-first lg:order-none w-full flex flex-col lg:items-end justify-end gap-4'>
            <Link
              href='/policy'
              className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
            >
              {t('links.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
