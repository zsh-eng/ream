import Keycap from '@/components/keycap';
import { ActiveDropdownContext } from '@/hooks/active-dropdown-context';
import { Font, FONTS } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { Type } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useThemeShortcut } from '~/hooks/theme-shortcut';

type FontsDropdownMenuItemProps = {
  font: string;
  onClick: () => void;
  selected?: boolean;
};

function FontsDropdownMenuItem({
  font,
  onClick,
  selected = false,
}: FontsDropdownMenuItemProps) {
  return (
    <DropdownMenuItem onClick={onClick}>
      <div
        className={cn(
          'w-60 h-12 flex justify-center items-center bg-background text-foreground',
          selected && 'border-2 border-solid border-blue-300'
        )}
        data-body={font}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {font}
      </div>
    </DropdownMenuItem>
  );
}

export default function TextDropdownMenu({
  showKeyboardShortcuts = false,
}: {
  showKeyboardShortcuts?: boolean;
}) {
  const portalTarget = useContext(PortalTargetContext);
  const { activeDropdown, setActiveDropdown } = useContext(
    ActiveDropdownContext
  );
  const { 'data-body': currentFont } = useTheme();

  const setFontAttribute = (font: Font) => {
    portalTarget?.setAttribute('data-body', font);
  };
  useThemeShortcut('text', '5');

  return (
    <DropdownMenu
      open={activeDropdown === 'text'}
      onOpenChange={(open) => setActiveDropdown(open ? 'text' : null)}
    >
      <DropdownMenuTrigger asChild>
        <div className='relative'>
          {showKeyboardShortcuts && <Keycap character='5' />}
          <Button
            variant='ghost'
            size={'icon'}
            className='data-[state=open]:bg-muted data-[state=open]:text-foreground'
          >
            <Type className='size-6' />
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='border border-solid border-muted h-96 overflow-y-auto'
        align='start'
        side='left'
      >
        <DropdownMenuLabel className=''>Text Font</DropdownMenuLabel>
        {FONTS.map((font) => (
          <FontsDropdownMenuItem
            key={`body-font-${font}`}
            font={font}
            onClick={() => setFontAttribute(font)}
            selected={currentFont === font}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
