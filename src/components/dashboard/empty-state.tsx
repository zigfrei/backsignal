import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

export function EmptyState({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <div className='flex flex-col items-center gap-4 rounded-2xl border border-divider bg-base-white px-5 py-12 text-center'>
      <ChatBubbleLeftRightIcon aria-hidden='true' className='size-12 text-primary' />
      <h2 className='typo-h3'>{title}</h2><p className='max-w-md typo-body text-text-secondary'>{description}</p>{children}
    </div>
  );
}
