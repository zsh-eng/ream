import Keycap from '@/components/keycap';
import { ThemeSwitchPopup } from '@/components/theme-switch-popup';
import { ActiveDropdownContext } from '@/hooks/active-dropdown-context';
import { useThemeShortcut } from '@/hooks/theme-shortcut';
import { useThemeSwitcher } from '@/hooks/use-theme-switcher';
import { COLOR_PALETTE_OPTIONS, ColorPalette } from '@/lib/theme';
import { cn, kebabToTitleCase } from '@/lib/utils';
import { PaintbrushIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useTheme } from '~/hooks/use-theme';

type ColorPaletteDropdownMenuItemProps = {
  selected?: boolean;
  theme: ColorPalette;
  onClick: () => void;
};

function ColorPaletteDropdownMenuItem({
  theme,
  onClick,
  selected = false,
}: ColorPaletteDropdownMenuItemProps) {
  const themeString = kebabToTitleCase(theme);
  return (
    <DropdownMenuItem onClick={onClick}>
      <div
        className={cn(
          'w-60 h-12 flex justify-center items-center bg-background text-foreground',
          selected && 'border-2 border-solid border-blue-300'
        )}
        data-color-palette={theme}
      >
        {themeString}
      </div>
    </DropdownMenuItem>
  );
}

export default function ColorPaletteDropdownMenu({
  showKeyboardShortcuts = false,
}: {
  showKeyboardShortcuts?: boolean;
}) {
  const portalTarget = useContext(PortalTargetContext);
  const { activeDropdown, setActiveDropdown } = useContext(
    ActiveDropdownContext
  );

  const { 'data-color-palette': currentColorPalette } = useTheme();

  const {
    isPopupVisible,
    isAnimatingOut,
    handleColorPaletteChange: handleThemeChange,
  } = useThemeSwitcher(currentColorPalette as ColorPalette, portalTarget);

  const isActive = activeDropdown === 'theme';
  useThemeShortcut('theme', '3');

  return (
    <>
      {isPopupVisible && (
        <ThemeSwitchPopup
          theme={currentColorPalette as ColorPalette}
          isAnimatingOut={isAnimatingOut}
          portalTarget={portalTarget}
        />
      )}

      <DropdownMenu
        open={isActive}
        onOpenChange={(open) => setActiveDropdown(open ? 'theme' : null)}
      >
        <DropdownMenuTrigger asChild>
          <div className='relative'>
            {showKeyboardShortcuts && <Keycap character='3' />}
            <Button
              variant='ghost'
              size={'icon'}
              className='data-[state=open]:bg-muted data-[state=open]:text-foreground'
            >
              <PaintbrushIcon className='size-6' />
            </Button>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className='border border-solid border-muted mt-8'
          align='center'
          side='left'
        >
          <DropdownMenuLabel className=''>Themes</DropdownMenuLabel>

          <div className='flex flex-col h-96 overflow-y-auto'>
            {COLOR_PALETTE_OPTIONS.map((theme) => (
              <ColorPaletteDropdownMenuItem
                key={theme}
                theme={theme}
                onClick={() => handleThemeChange(theme)}
                selected={currentColorPalette === theme}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
