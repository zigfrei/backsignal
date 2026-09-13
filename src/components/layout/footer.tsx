import { Link } from '@/i18n/navigation';
import Logo from '@/assets/icons/logo.svg';
import EnLogo from '@/assets/icons/en/logo.svg';
// import InstagramIcon from '@/assets/icons/instagram.svg';
import TelegramIcon from '@/assets/icons/telegram.svg';
import MaxIcon from '@/assets/icons/max.svg';
import ViberIcon from '@/assets/icons/viber.svg';
import WhatsappIcon from '@/assets/icons/whatsapp.svg';
import { Icon } from '@iconify/react';
import { useLocale, useTranslations } from 'next-intl';


export function Footer() {
  const t = useTranslations('Layout.Footer');
  const locale = useLocale();
    const LogoComponent = locale === 'en' ? EnLogo : Logo;
  return (
    <footer className='w-full bg-footer border-t-[1px] border-text-secondary'>
      <div className='w-full px-4 py-6 lg:px-12 lg:py-16 max-w-[1440px] flex flex-col items-start justify-start mx-auto'>
        <div className='flex flex-col lg:flex-row items-start justify-between mx-auto gap-4 lg:gap-16'>
          <div className='w-full flex flex-col items-start justify-start gap-4'>
            <Link href='/' aria-label={t('aria-label')}>
              <LogoComponent className='h-[56px] w-auto cursor-pointer transition-transform duration-300 ease-out hover:scale-105' />
            </Link>
            <p className='typo-body-large text-left'>
              {t('description')}
            </p>
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
          <div className='w-full flex flex-col items-start justify-start gap-4'>
            {/* <p className='typo-body-large'>Ссылки</p>
            <nav>
              <ul className='flex flex-col items-start justify-start gap-2'>
                <li>
                  <Link
                    href='/kontraktnoe-proizvodstvo-moyushchih-i-dezinficiruyushchih-sredstv'
                    className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
                  >
                    Контрактное производство
                  </Link>
                </li>
                <li>
                  <Link
                    href='/produktsiya'
                    className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
                  >
                    Продукция
                  </Link>
                </li>
                <li>
                  <Link
                    href='/o-kompanii'
                    className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
                  >
                    О компании
                  </Link>
                </li>
                <li>
                  <Link
                    href='/kontakty'
                    className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
                  >
                    Контакты
                  </Link>
                </li>
                <li>
                  <Link
                    href='/sertifikaty'
                    className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
                  >
                    Сертификаты
                  </Link>
                </li>
                <li>
                  <Link
                    href='/usloviya-sotrudnichestva'
                    className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
                  >
                    Условия сотрудничества
                  </Link>
                </li>
                <li>
                  <Link
                    href='/razrabotka-sredstva-seifgat'
                    className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
                  >
                    Разработка средства «СейфГат»
                  </Link>
                </li>
                <li>
                  <Link
                    href='/sredstvo-dlya-myagkih-okon'
                    className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
                  >
                    Средство для мягких окон
                  </Link>
                </li>
              </ul>
            </nav> */}
          </div>
          <div className='w-full flex flex-col items-start justify-start gap-4'>
            {/* <p className='typo-h5'>Мессенджеры</p>
            <ul className='flex items-center justify-center gap-2'>
              <li>
                <a
                  href='https://t.me/proffhim_ru'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-12 h-12 flex items-center justify-center bg-base-black base-frame lg:base-frame-interactive'
                >
                  <TelegramIcon className='w-6 h-6 inline-block text-white' />
                </a>
              </li>

              <li>
                <a
                  href='https://max.ru/u/f9LHodD0cOLTiT9h85Bj0wYC2qHqfeO2n7RAIZ4j7T7M6gtB3aIQQ4SJxsw'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-12 h-12 flex items-center justify-center bg-base-black base-frame lg:base-frame-interactive'
                >
                  <MaxIcon className='w-6 h-6 inline-block text-white' />
                </a>
              </li>

              <li>
                <a
                  href='viber://chat?number=%2B375292659068'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-12 h-12 flex items-center justify-center bg-base-black base-frame lg:base-frame-interactive'
                >
                  <ViberIcon className='w-6 h-6 inline-block text-white' />
                </a>
              </li>
              <li>
                <a
                  href='https://wa.me/375293317064'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-12 h-12 flex items-center justify-center bg-base-black base-frame lg:base-frame-interactive'
                >
                  <WhatsappIcon className='w-6 h-6 inline-block text-white' />
                </a>
              </li> */}

              {/* <li>
                <a
                  href='https://www.instagram.com/proffhim.by/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-12 h-12 flex items-center justify-center bg-base-black base-frame lg:base-frame-interactive'
                >
                  <InstagramIcon className='w-6 h-6 inline-block text-white' />
                </a>
              </li>
              <li>
                <a
                  href='https://vk.com/public182349785'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-12 h-12 flex items-center justify-center bg-base-black base-frame lg:base-frame-interactive'
                >
                  <VKIcon className='w-6 h-6 inline-block text-white' />
                </a>
              </li>
              <li>
                <a
                  href='https://www.tiktok.com/@proffhim'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-12 h-12 flex items-center justify-center bg-base-black base-frame lg:base-frame-interactive'
                >
                  <TikTokIcon className='w-6 h-6 inline-block text-white' />
                </a>
              </li>

              <li>
                <a
                  href='https://www.facebook.com/proffhim'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-12 h-12 flex items-center justify-center bg-base-black base-frame lg:base-frame-interactive'
                >
                  <FacebookIcon className='w-6 h-6 inline-block text-white' />
                </a>
              </li>
              <li>
                <a
                  href='https://www.threads.net/@proffhim'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-12 h-12 flex items-center justify-center bg-base-black base-frame lg:base-frame-interactive'
                >
                  <ThreadsIcon className='w-6 h-6 inline-block text-white' />
                </a>
              </li> */}
            {/* </ul> */}
          </div>
        </div>
        <div className='w-full h-[1px] bg-base-black my-6 lg:mt-16 lg:mb-8'></div>
        <div className='w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4'>
          <p className='typo-caption lg:text-center'>
            © {new Date().getFullYear()} {t('copyright')}
          </p>
          <Link
            href='/politika-konfidencialnosti'
            className='typo-body text-base-black inline-block border-b-[1px] border-transparent hover:border-primary hover:text-primary transition-[color,border-color] duration-200'
          >
            {t('links.privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
