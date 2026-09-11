import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

type BreadcrumbsProps = ComponentPropsWithoutRef<'nav'> & {
  breadcrumbs: Breadcrumb[];
  withSchema?: boolean;
};

const SITE_URL = 'https://proffhim.by';

function getAbsoluteUrl(href: string) {
  return new URL(href, SITE_URL).toString();
}

export default function Breadcrumbs({
  breadcrumbs,
  className,
  withSchema = true,
}: BreadcrumbsProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.label,
      item: getAbsoluteUrl(breadcrumb.href),
    })),
  };

  return (
    <>
      <nav aria-label='Breadcrumb' className={className}>
        <ol className='flex flex-wrap items-center justify-start gap-y-1 typo-b2 uppercase font-bold text-base-black'>
          {breadcrumbs.map((breadcrumb, index) => (
            <li
              key={breadcrumb.href}
              aria-current={breadcrumb.active ? 'page' : undefined}
              className='inline-flex items-center'
            >
              <Link
                href={breadcrumb.href}
                className='inline hover:text-primary transition-colors duration-200 ease-in-out'
              >
                {breadcrumb.label}
              </Link>
              {index < breadcrumbs.length - 1 ? (
                <span className='mx-2 inline-block shrink-0'>{'>'}</span>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>
      {withSchema ? (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
          }}
        />
      ) : null}
    </>
  );
}
