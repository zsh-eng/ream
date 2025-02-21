import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import { ColorPalette } from '@/lib/theme';
import { kebabToTitleCase } from '@/lib/utils';

type ThemeSwitchPopupProps = {
  theme: ColorPalette;
  isAnimatingOut: boolean;
  portalTarget: Element | null;
};

export function ThemeSwitchPopup({
  theme,
  isAnimatingOut,
  portalTarget,
}: ThemeSwitchPopupProps) {
  return createPortal(
    <div
      className={cn(
        'fixed left-4 top-4 w-60 h-12 flex justify-center items-center bg-background text-foreground text-base',
        'border-2 border-solid border-blue-300',
        isAnimatingOut ? 'animate-fadeout' : 'animate-fadein'
      )}
      data-color-palette={theme}
    >
      {kebabToTitleCase(theme)}
    </div>,
    portalTarget ?? document.body
  );
}
