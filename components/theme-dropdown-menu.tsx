import { ActiveDropdownContext } from '@/hooks/active-dropdown-context';
import {
  COLOR_PALETTE_OPTIONS,
  ColorPalette,
} from '@/lib/theme';
import { cn } from '@/lib/utils';
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

function kebabToTitleCase(theme: string) {
  return theme
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

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

export default function ColorPaletteDropdownMenu() {
  const portalTarget = useContext(PortalTargetContext);
  const { activeDropdown, setActiveDropdown } = useContext(
    ActiveDropdownContext
  );

  const { 'data-color-palette': currentColorPalette } = useTheme();
  const setColorPaletteAttribute = (colorPalette: ColorPalette) => {
    portalTarget?.setAttribute('data-color-palette', colorPalette);
  };

  return (
    <DropdownMenu
      open={activeDropdown === 'theme'}
      onOpenChange={(open) => setActiveDropdown(open ? 'theme' : null)}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size={'icon'}
          className='data-[state=open]:bg-muted data-[state=open]:text-foreground'
        >
          <PaintbrushIcon className='size-6' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='border border-solid border-muted'
        align='start'
        side='left'
      >
        <DropdownMenuLabel className=''>Themes</DropdownMenuLabel>

        <div className='flex flex-col h-96 overflow-y-auto'>
          {COLOR_PALETTE_OPTIONS.map((theme) => (
            <ColorPaletteDropdownMenuItem
              key={theme}
              theme={theme}
              onClick={() => setColorPaletteAttribute(theme)}
              selected={currentColorPalette === theme}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
