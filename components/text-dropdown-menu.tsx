import { ActiveDropdownContext } from '@/hooks/active-dropdown-context';
import { DEFAULT_FONT, Font, FONTS } from '@/lib/fonts';
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

export default function TextDropdownMenu() {
  const portalTarget = useContext(PortalTargetContext);
  const [currentFont, setCurrentFont] = useState<Font>(
    (portalTarget?.getAttribute('data-body') as Font) || DEFAULT_FONT
  );
  const { activeDropdown, setActiveDropdown } = useContext(
    ActiveDropdownContext
  );

  const setFontAttribute = (font: Font) => {
    setCurrentFont(font);
    portalTarget?.setAttribute('data-body', font);
  };

  return (
    <DropdownMenu
      open={activeDropdown === 'text'}
      onOpenChange={(open) => setActiveDropdown(open ? 'text' : null)}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size={'icon'}
          className='data-[state=open]:bg-muted data-[state=open]:text-foreground'
        >
          <Type className='size-6' />
        </Button>
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
