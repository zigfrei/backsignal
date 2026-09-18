'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Select<Value extends string>({ label, items, value, onValueChange, className, disabled, name }: {
  label: ReactNode;
  items: { value: Value; label: string }[];
  value: Value;
  onValueChange: (value: Value) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
}) {
  return (
    <BaseSelect.Root items={items} value={value} onValueChange={(next) => { if (next !== null) onValueChange(next); }} disabled={disabled} name={name}>
      <div className={clsx('flex min-w-0 flex-col gap-2', className)}>
        <BaseSelect.Label>{label}</BaseSelect.Label>
        <BaseSelect.Trigger className='flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-divider bg-base-white px-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50'>
          <BaseSelect.Value className='min-w-0 truncate' />
          <BaseSelect.Icon className='shrink-0'><ChevronDownIcon aria-hidden='true' className='size-5 text-text-secondary' /></BaseSelect.Icon>
        </BaseSelect.Trigger>
      </div>
      <BaseSelect.Portal>
        <BaseSelect.Positioner alignItemWithTrigger={false} align='start' sideOffset={6} className='z-[100]' style={{ width: 'var(--anchor-width)', maxWidth: 'calc(100vw - 2rem)' }}>
          <BaseSelect.Popup className='w-full rounded-lg border border-divider bg-base-white p-1 shadow-lg'>
            <BaseSelect.List className='max-h-[min(20rem,var(--available-height))] overflow-y-auto'>
              {items.map((item) => (
                <BaseSelect.Item key={item.value} value={item.value} className='flex min-h-11 cursor-default items-center justify-between gap-3 rounded-md px-3 py-2 outline-none data-highlighted:bg-primary/10 data-highlighted:text-primary'>
                  <BaseSelect.ItemText>{item.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator><CheckIcon aria-hidden='true' className='size-5 shrink-0 text-primary' /></BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
