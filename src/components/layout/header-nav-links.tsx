'use client';

import clsx from 'clsx';
import { Link, usePathname } from '@/i18n/navigation';
import { useEffect, useMemo, useState } from 'react';
import { isMenuItemActive, type MenuItem } from './menu-item';

interface HeaderNavLinksProps {
  items: MenuItem[];
}

const getHashId = (href: string) => {
  const hashIndex = href.indexOf('#');

  if (hashIndex === -1) {
    return null;
  }

  return href.slice(hashIndex + 1) || null;
};

export function HeaderNavLinks({ items }: HeaderNavLinksProps) {
  const pathname = usePathname();
  const sectionIds = useMemo(
    () => items.map((item) => getHashId(item.href)).filter((id): id is string => Boolean(id)),
    [items],
  );
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionIds.length) {
      return;
    }

    const visibleSections = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        const mostVisibleSection = [...visibleSections.entries()].sort((a, b) => b[1] - a[1])[0];
        setActiveSectionId(mostVisibleSection?.[0] ?? null);
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: 0,
      },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);

      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return (
    <ul className='flex items-center justify-center flex-wrap gap-2 gap-y-0!'>
      {items.map((item) => {
        const hashId = getHashId(item.href);
        const isActive = hashId
          ? activeSectionId === hashId
          : isMenuItemActive({ href: item.href, pathname });

        return (
          <li key={item.label} className='h-full flex items-center justify-center'>
            <Link
              href={item.href}
              className={clsx(
                'h-full text-center text-text-secondary typo-button py-2 px-4 transition-colors duration-200 whitespace-pre-line rounded-lg cursor-pointer',
                isActive
                  ? 'bg-primary !text-base-white hover:bg-primary-hover'
                  : 'hover:bg-quaternary hover:text-text-primary',
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
