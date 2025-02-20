import { ActiveDropdownContext } from '@/hooks/active-dropdown-context';
import { COLOR_PALETTE_OPTIONS, ColorPalette } from '@/lib/theme';
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

function getNextTheme(currentTheme: ColorPalette) {
  const index = COLOR_PALETTE_OPTIONS.indexOf(currentTheme);
  return COLOR_PALETTE_OPTIONS[(index + 1) % COLOR_PALETTE_OPTIONS.length];
}

function getPreviousTheme(currentTheme: ColorPalette) {
  const index = COLOR_PALETTE_OPTIONS.indexOf(currentTheme);
  return COLOR_PALETTE_OPTIONS[
    (index - 1 + COLOR_PALETTE_OPTIONS.length) % COLOR_PALETTE_OPTIONS.length
  ];
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

  // Keyboard shortcut for toggling through themes
  const [colorPalettePopupVisible, setColorPalettePopupVisible] =
    useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // This is a relatively hacky way to time the animations
  // ideally we should just use AnimatePresence from motion.dev
  // But since this is the only exit animation we have so far,
  // we can leave this as is
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const visibleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let nextTheme: ColorPalette | null = null;
      if (event.key === ']') {
        nextTheme = getNextTheme(currentColorPalette as ColorPalette);
      } else if (event.key === '[') {
        nextTheme = getPreviousTheme(currentColorPalette as ColorPalette);
      }
      if (!nextTheme) return;

      setColorPaletteAttribute(nextTheme);
      setIsAnimatingOut(false);
      setColorPalettePopupVisible(true);

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (visibleTimeoutRef.current) {
        clearTimeout(visibleTimeoutRef.current);
      }

      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimatingOut(true);
      }, 700);

      visibleTimeoutRef.current = setTimeout(() => {
        setColorPalettePopupVisible(false);
        setIsAnimatingOut(false);
      }, 1000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentColorPalette]);

  const isActive = activeDropdown === 'theme';

  return (
    <DropdownMenu
      open={isActive}
      onOpenChange={(open) => setActiveDropdown(open ? 'theme' : null)}
    >
      {colorPalettePopupVisible && (
        <div
          className={cn(
            'absolute right-16 top-8 w-60 h-12 flex justify-center items-center bg-background text-foreground',
            'border-2 border-solid border-blue-300',
            isAnimatingOut ? 'animate-fadeout' : 'animate-fadein'
          )}
          data-color-palette={currentColorPalette}
        >
          {kebabToTitleCase(currentColorPalette as ColorPalette)}
        </div>
      )}

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
