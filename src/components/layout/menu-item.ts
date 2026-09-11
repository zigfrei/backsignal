export interface MenuItem {
  href: string;
  label: string;
}

const HASH_SYMBOL = '#';
const QUERY_SYMBOL = '?';

const normalizePath = (value: string) => {
  const normalized = value.split(QUERY_SYMBOL)[0]?.split(HASH_SYMBOL)[0] || '/';

  if (normalized.length > 1 && normalized.endsWith('/')) {
    return normalized.slice(0, -1);
  }

  return normalized;
};

export const isMenuItemActive = ({ href, pathname }: { href: string; pathname: string }) => {
  if (href.includes(HASH_SYMBOL)) {
    return false;
  }

  const normalizedHref = normalizePath(href);
  const normalizedPathname = normalizePath(pathname);

  if (normalizedHref === '/') {
    return normalizedPathname === normalizedHref;
  }

  return (
    normalizedPathname === normalizedHref ||
    normalizedPathname.startsWith(`${normalizedHref}/`)
  );
};
