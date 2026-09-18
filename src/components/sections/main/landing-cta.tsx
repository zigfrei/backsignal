import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';

import { getCurrentSession } from '@/data/auth';
import { BigLinkButton } from '@/components/ui/links';

interface LandingCtaProps {
  guestLabel: string;
  className?: string;
}

export async function LandingCta({
  guestLabel,
  className,
}: LandingCtaProps) {
  const [session, t] = await Promise.all([
    getCurrentSession(),
    getTranslations('Landing.Common'),
  ]);

  return (
    <BigLinkButton
      href={session ? '/dashboard' : '/signup'}
      className={className}
    >
      <span className='px-2 text-center text-balance'>
        {session ? t('authenticatedCta') : guestLabel}
      </span>
      <ArrowRightIcon
        aria-hidden='true'
        className='size-6 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-1'
      />
    </BigLinkButton>
  );
}
