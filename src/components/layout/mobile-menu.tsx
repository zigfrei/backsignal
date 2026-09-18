'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Link, usePathname } from '@/i18n/navigation';
import { type ReactNode, useEffect, useId, useState } from 'react';
import Logo from '@/assets/icons/logo.svg';
import EnLogo from '@/assets/icons/en/logo.svg';
import { useLocale, useTranslations } from 'next-intl';
import { isMenuItemActive, type MenuItem } from './menu-item';

interface MobileMenuProps {
  variant?: 'marketing' | 'auth';
  items: MenuItem[];
  authActions: ReactNode;
}

export function MobileMenu({ items, authActions, variant = 'marketing' }: MobileMenuProps) {
  const t = useTranslations('Layout.MobileMenu');
  const locale = useLocale();
  const isMarketing = variant === 'marketing';
  const LogoComponent = locale === 'en' ? EnLogo : Logo;
  const animationDurationMs = 300;
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dialogId = useId();

  const openMenu = () => {
    setIsMounted(true);
  };

  const closeMenu = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || isVisible) {
      return;
    }

    const closeTimeoutId = window.setTimeout(() => {
      setIsMounted(false);
    }, animationDurationMs);

    return () => {
      window.clearTimeout(closeTimeoutId);
    };
  }, [animationDurationMs, isMounted, isVisible]);

  return (
    <>
      <button
        type='button'
        aria-label={t('open')}
        aria-expanded={isMounted}
        aria-controls={dialogId}
        className='flex h-10 w-10 items-center justify-center'
        onClick={openMenu}
      >
        <Bars3Icon
          className={clsx(
            'h-10 w-10 [&>path]:stroke-[2]',
            isMarketing ? 'text-white' : 'text-base-black',
          )}
        />
      </button>

      {isMounted && (
        <div
          id={dialogId}
          role='dialog'
          aria-modal='true'
          aria-label={t('title')}
          className='fixed inset-0 z-[70] lg:hidden'
        >
          <button
            type='button'
            aria-label={t('close')}
            className={clsx(
              'absolute inset-0 bg-base-black/45 transition-opacity duration-300 ease-out',
              isVisible ? 'opacity-100' : 'opacity-0',
            )}
            onClick={closeMenu}
          />
          <div
            className={clsx(
              'relative z-10 ml-auto flex h-auto w-full flex-col gap-8 bg-main-background p-4 transition-all duration-300 ease-out',
              isVisible ? 'opacity-100' : 'opacity-0',
            )}
          >
            <div className='flex items-center justify-between'>
              <Link href='/' aria-label={t('home')} className='inline-block' onClick={closeMenu}>
                <LogoComponent className='h-[60px] w-auto cursor-pointer transition-transform duration-300 ease-out hover:scale-105' />
              </Link>
              <button
                type='button'
                aria-label={t('close')}
                className='flex h-10 w-10 items-center justify-center rounded-lg text-base-black transition-colors hover:bg-primary/10'
                onClick={closeMenu}
              >
                <XMarkIcon className='h-6 w-6 [&>path]:stroke-[2]' />
              </button>
            </div>

            <nav className='py-8'>
              <ul className='flex flex-col gap-6'>
                {items.map((item) => {
                  const isActive = isMenuItemActive({ href: item.href, pathname });

                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={clsx(
                          'typo-h4 p-2 text-[1.75rem] transition-colors duration-200',
                          isActive ? 'bg-base-black text-main-background' : 'text-base-black',
                        )}
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className='mb-4 flex flex-col gap-3'>
              {authActions}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
