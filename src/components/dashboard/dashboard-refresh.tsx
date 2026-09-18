'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from '@/i18n/navigation';

// Shared layouts survive navigation, so their server-side counters need an explicit refresh.
export function DashboardRefresh() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const router = useRouter();

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    router.refresh();
  }, [pathname, router]);

  useEffect(() => {
    let lastRefresh = 0;
    function refreshWhenVisible() {
      if (document.visibilityState !== 'visible') return;
      const now = Date.now();
      if (now - lastRefresh < 1000) return;
      lastRefresh = now;
      router.refresh();
    }
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [router]);

  return null;
}
