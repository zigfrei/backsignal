'use client';

import { DesktopLocalePopover } from './desktop-locale-popover';
import { MobileLocaleDrawer } from './mobile-locale-drawer';

export function LocaleSwitcher() {
  return (
    <>
      <div className='hidden lg:block'>
        <DesktopLocalePopover />
      </div>
      <div className='lg:hidden'>
        <MobileLocaleDrawer />
      </div>
    </>
  );
}
