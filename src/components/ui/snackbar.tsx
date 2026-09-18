'use client';

import type { ReactNode } from 'react';
import { Toast } from '@base-ui/react/toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

const manager = Toast.createToastManager();

export function showSnackbar(message: string, type: 'success' | 'error' | 'info' = 'info', id?: string) {
  return manager.add({
    id,
    description: message,
    type,
    priority: type === 'error' ? 'high' : 'low',
    timeout: type === 'error' ? 7000 : 4000,
  });
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider toastManager={manager} limit={3}>
      {children}
      <SnackbarViewport />
    </Toast.Provider>
  );
}

function SnackbarViewport() {
  const { toasts } = Toast.useToastManager();
  const t = useTranslations('System.Snackbar');
  return (
    <Toast.Portal>
      <Toast.Viewport
        aria-label={t('label')}
        className='pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[200] flex flex-col gap-3 outline-none sm:left-auto sm:right-6 sm:w-96'
      >
        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            toast={toast}
            swipeDirection={['down', 'right']}
            className={`pointer-events-auto relative flex items-center gap-3 rounded-xl border bg-base-white p-3 text-text-primary shadow-lg transition-[opacity,translate] duration-200 data-starting-style:translate-y-2 data-starting-style:opacity-0 data-ending-style:translate-y-2 data-ending-style:opacity-0 data-limited:hidden motion-reduce:transition-none ${toast.type === 'error' ? 'border-red-300' : toast.type === 'success' ? 'border-primary/30' : 'border-divider'}`}
          >
            <Toast.Content className='min-w-0 flex-1'>
              <Toast.Description className='break-words typo-body-small' />
            </Toast.Content>
            <Toast.Close aria-label={t('close')} className='flex size-11 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-disabled focus-visible:outline-2 focus-visible:outline-primary'>
              <XMarkIcon aria-hidden='true' className='size-5' />
            </Toast.Close>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}
