'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { LinkButton } from '../ui/links';
import Logo from '@/assets/icons/logo.svg';
import { isMenuItemActive, type MenuItem } from './menu-item';

interface MobileMenuProps {
  items: MenuItem[];
}

export function MobileMenu({ items }: MobileMenuProps) {
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
        aria-label='Открыть меню'
        aria-expanded={isMounted}
        aria-controls={dialogId}
        className='flex h-10 w-10 items-center justify-center border-[3px] border-base-black bg-primary'
        onClick={openMenu}
      >
        <Bars3Icon className='h-6 w-6 [&>path]:stroke-[2]' />
      </button>

      {isMounted && (
        <div
          id={dialogId}
          role='dialog'
          aria-modal='true'
          aria-label='Мобильное меню'
          className='fixed inset-0 z-[70] lg:hidden'
        >
          <button
            type='button'
            aria-label='Закрыть меню'
            className={clsx(
              'absolute inset-0 bg-base-black/45 transition-opacity duration-300 ease-out',
              isVisible ? 'opacity-100' : 'opacity-0',
            )}
            onClick={closeMenu}
          />
          <div
            className={clsx(
              'relative z-10 ml-auto flex h-auto w-full flex-col gap-8 bg-primary p-4 transition-all duration-300 ease-out',
              isVisible ? 'opacity-100' : 'opacity-0',
            )}
          >
            <div className='flex items-center justify-between'>
              <Link href='/' aria-label='На главную' className='inline-block' onClick={closeMenu}>
                <Logo className='w-[195px] h-[44px] [&_path]:fill-[var(--color-base-black)]' />
              </Link>
              <button
                type='button'
                aria-label='Закрыть меню'
                className='flex h-10 w-10 items-center justify-center border-[3px] border-base-black bg-primary'
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

            <LinkButton
              href='/kontakty/#obraschenie'
              onClick={closeMenu}
              className={clsx('w-full justify-center mb-4')}
            >
              Связаться
            </LinkButton>
          </div>
        </div>
      )}
    </>
  );
}
