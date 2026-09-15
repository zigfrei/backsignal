import { getTranslations } from 'next-intl/server';

import { GhostLinkButton, LinkButton } from '@/components/ui/links';
import { getCurrentSession } from '@/data/auth';

interface HeaderAuthActionsProps {
  variant?: 'desktop' | 'mobile';
}

export async function HeaderAuthActions({
  variant = 'desktop',
}: HeaderAuthActionsProps) {
  const [session, t] = await Promise.all([
    getCurrentSession(),
    getTranslations('Layout.Header'),
  ]);

  if (session) {
    return (
      <LinkButton
        href='/dashboard'
        className={
          variant === 'desktop'
            ? 'hidden px-6 py-2 lg:flex'
            : 'w-full justify-center'
        }
      >
        {t('dashboard')}
      </LinkButton>
    );
  }

  return (
    <>
      <GhostLinkButton
        href='/login'
        className={
          variant === 'desktop'
            ? 'hidden px-6 py-2 lg:flex'
            : 'w-full justify-center'
        }
      >
        {t('login')}
      </GhostLinkButton>
      <LinkButton
        href='/signup'
        className={
          variant === 'desktop'
            ? 'hidden px-6 py-2 lg:flex'
            : 'w-full justify-center'
        }
      >
        {t('signup')}
      </LinkButton>
    </>
  );
}
