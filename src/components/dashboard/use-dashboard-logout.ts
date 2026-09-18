'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { signOut } from '@/lib/auth-client';

export function useDashboardLogout(onSuccess: () => void) {
  const t = useTranslations('Auth.Logout');
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string>();

  async function handleLogout() {
    setError(undefined);
    setLoggingOut(true);
    try {
      const result = await signOut();
      if (result.error) throw new Error('Sign out failed');
      onSuccess();
      router.replace('/login');
      router.refresh();
    } catch {
      setError(t('error'));
      setLoggingOut(false);
    }
  }

  return { loggingOut, error, handleLogout };
}
