import ColorPaletteDropdownMenu from '@/components/color-palette-dropdown-menu';
import HeadingDropdownMenu from '@/components/heading-dropdown-menu';
import Keycap from '@/components/keycap';
import TextDropdownMenu from '@/components/text-dropdown-menu';
import { Button } from '@/components/ui/button';
import { SIZES } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { AArrowDown, AArrowUp } from 'lucide-react';

type NavigationBarProps = {
  size: string;
  isNavBarAutoHide: boolean;
  isSmallDevice: boolean;
  showKeyboardShortcuts: boolean;
  onSizeIncrease: () => void;
  onSizeDecrease: () => void;
  /** Render props for additional action buttons in the navigation bar */
  renderActionButtons?: () => React.ReactNode;
};

export function NavigationBar({
  size,
  isNavBarAutoHide,
  showKeyboardShortcuts,
  onSizeIncrease,
  onSizeDecrease,
  renderActionButtons,
  isSmallDevice,
}: NavigationBarProps) {
  return (
    <>
      {/* Used to trigger the navigation bar when it is auto-hidden */}
      <div className='hover-trigger fixed top-0 right-0 h-full w-20 peer' />
      <div
        className={cn(
          'fixed top-0 right-0 md:top-0 md:right-4 flex flex-col transition-all duration-300 py-4 h-screen z-30',
          'translate-x-40 translate-y-0 peer-hover:translate-x-0 hover:translate-x-0',
          'has-data-[state=open]:translate-x-0',
          !isSmallDevice && !isNavBarAutoHide && 'translate-x-0',
          isSmallDevice && 'border-l border-solid border-muted bg-background'
        )}
      >
        <div className='relative'>
          {showKeyboardShortcuts && <Keycap character='1' className='' />}
          <Button
            variant='ghost'
            size='icon'
            disabled={size === SIZES[SIZES.length - 1]}
            onClick={onSizeIncrease}
          >
            <AArrowUp className='size-7' />
          </Button>
        </div>

        <div className='relative'>
          {showKeyboardShortcuts && <Keycap character='2' />}
          <Button
            variant='ghost'
            size='icon'
            disabled={size === SIZES[0]}
            onClick={onSizeDecrease}
          >
            <AArrowDown className='size-7' />
          </Button>
        </div>

        <ColorPaletteDropdownMenu
          showKeyboardShortcuts={showKeyboardShortcuts}
        />
        <HeadingDropdownMenu showKeyboardShortcuts={showKeyboardShortcuts} />
        <TextDropdownMenu showKeyboardShortcuts={showKeyboardShortcuts} />
        <div className='flex-1 h-full' />

        {renderActionButtons?.()}

      </div>
    </>
  );
}
