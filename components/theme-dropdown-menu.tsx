import { DEFAULT_THEME, Theme } from '@/lib/theme';
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
import { ActiveDropdownContext } from '@/hooks/active-dropdown-context';
import { getCurrentPageFaviconUrl } from '@/lib/favicon';

type ThemeDropdownMenuItemProps = {
  selected?: boolean;
  theme: Theme;
  onClick: () => void;
};

function kebabToTitleCase(theme: string) {
  return theme
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function ThemeDropdownMenuItem({
  theme,
  onClick,
  selected = false,
}: ThemeDropdownMenuItemProps) {
  const themeString = kebabToTitleCase(theme);
  return (
    <DropdownMenuItem onClick={onClick}>
      <div
        className={cn(
          'w-60 h-12 flex justify-center items-center bg-background text-foreground',
          selected && 'border-2 border-solid border-blue-300'
        )}
        data-theme={theme}
      >
        {themeString}
      </div>
    </DropdownMenuItem>
  );
}

export default function ThemeDropdownMenu() {
  const portalTarget = useContext(PortalTargetContext);
  const [currentTheme, setCurrentTheme] = useState<string>(
    portalTarget?.getAttribute('data-theme') || DEFAULT_THEME
  );
  const { activeDropdown, setActiveDropdown } = useContext(
    ActiveDropdownContext
  );
  const setThemeAttribute = (theme: Theme) => {
    portalTarget?.setAttribute('data-theme', theme);
    setCurrentTheme(theme);
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

      <DropdownMenuContent className='border border-solid border-muted' align='start' side='left'>
        <DropdownMenuLabel className=''>
          Themes
        </DropdownMenuLabel>

        <ThemeDropdownMenuItem
          theme='flexoki-light'
          onClick={() => setThemeAttribute('flexoki-light')}
          selected={currentTheme === 'flexoki-light'}
        />
        <ThemeDropdownMenuItem
          theme='flexoki-dark'
          onClick={() => setThemeAttribute('flexoki-dark')}
          selected={currentTheme === 'flexoki-dark'}
        />
        <ThemeDropdownMenuItem
          theme='tokyo-night'
          onClick={() => setThemeAttribute('tokyo-night')}
          selected={currentTheme === 'tokyo-night'}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
