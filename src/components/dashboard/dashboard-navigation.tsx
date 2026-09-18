'use client';

import { ChatBubbleLeftRightIcon, Cog6ToothIcon, DocumentPlusIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { useDashboardUnreadCount } from './dashboard-unread-context';

const items = [
  { href: '/dashboard', key: 'messages', Icon: ChatBubbleLeftRightIcon },
  { href: '/dashboard/qr', key: 'qr', Icon: DocumentPlusIcon },
  { href: '/dashboard/qr-code', key: 'qrCode', Icon: QrCodeIcon },
  { href: '/dashboard/settings', key: 'settings', Icon: Cog6ToothIcon },
] as const;

export function DashboardNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const unreadCount = useDashboardUnreadCount();
  return (
    <nav aria-label={t('navigation')}>
      <ul className='flex flex-col gap-2'>
        {items.map(({ href, key, Icon }) => {
          const active = href === '/dashboard/settings' ? pathname.startsWith(`${href}/`) || pathname === href : pathname === href;
          return (
            <li key={key}>
              <Link href={href} onClick={(event) => {
                if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                if (key === 'messages' && pathname === href) {
                  event.preventDefault();
                  router.refresh();
                }
                onNavigate?.();
              }} aria-current={active ? 'page' : undefined}
                className={clsx('flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 typo-body font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary', active ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-disabled')}>
                <Icon aria-hidden='true' className='size-5 shrink-0' />{t(`sections.${key}`)}
                {key === 'messages' && unreadCount > 0 && <span className='ml-auto rounded-full bg-primary px-2 py-0.5 typo-caption font-semibold text-base-white'><span aria-hidden='true'>{unreadCount}</span><span className='sr-only'>{t('Messages.unreadCount', { count: unreadCount })}</span></span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
