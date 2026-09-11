'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type CatalogPaginationProps = {
  currentPage: number;
  totalPages: number;
};

type PageItem = number | 'dots';

function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: PageItem[] = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) items.push('dots');

  for (let p = left; p <= right; p += 1) {
    items.push(p);
  }

  if (right < totalPages - 1) items.push('dots');

  items.push(totalPages);
  return items;
}

export default function CatalogPagination({
  currentPage,
  totalPages,
}: CatalogPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageItems = useMemo(
    () => buildPageItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }

    const query = params.toString();

    return query ? `${pathname}?${query}` : pathname;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className='flex items-center flex-wrap gap-4 self-end'
      aria-label='Пагинация каталога'
    >
      {currentPage > 1 && (
        <Link
          href={buildPageHref(currentPage - 1)}
          className='typo-h4 bg-primary base-frame lg:base-frame-interactive cursor-pointer px-3 py-1 disabled:opacity-50'
        >
          Назад
        </Link>
      )}

      <div className='flex items-center gap-4'>
        {pageItems.map((item, index) =>
          item === 'dots' ? (
            <span key={`dots-${index}`} className='px-2'>
              …
            </span>
          ) : (
            <Link
              key={item}
              href={buildPageHref(item)}
              className={`typo-h4 base-frame lg:base-frame-interactive cursor-pointer px-3 py-1 ${
                item === currentPage ? 'bg-primary' : ''
              }`}
              aria-current={item === currentPage ? 'page' : undefined}
            >
              {item}
            </Link>
          ),
        )}
      </div>

      {currentPage < totalPages && (
        <Link
          href={buildPageHref(currentPage + 1)}
          className='typo-h4 bg-primary base-frame lg:base-frame-interactive cursor-pointer px-3 py-1 disabled:opacity-50'
        >
          Вперёд
        </Link>
      )}
    </nav>
  );
}
