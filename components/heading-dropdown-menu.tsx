import { Font, FONTS } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { Heading } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { ActiveDropdownContext } from '~/hooks/active-dropdown-context';
import { useTheme } from '~/hooks/use-theme';

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
        data-headings={font}
        style={{ fontFamily: 'var(--font-headings)' }}
      >
        {font}
      </div>
    </DropdownMenuItem>
  );
}

export default function HeadingDropdownMenu() {
  const portalTarget = useContext(PortalTargetContext);
  const { activeDropdown, setActiveDropdown } = useContext(
    ActiveDropdownContext
  );
  const { 'data-headings': currentFont } = useTheme();

  const setFontAttribute = (font: Font) => {
    portalTarget?.setAttribute('data-headings', font);
  };

  return (
    <DropdownMenu
      open={activeDropdown === 'heading'}
      onOpenChange={(open) => setActiveDropdown(open ? 'heading' : null)}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size={'icon'}
          className='data-[state=open]:bg-muted data-[state=open]:text-foreground'
        >
          <Heading className='size-6' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='border border-solid border-muted'
        align='start'
        side='left'
      >
        <DropdownMenuLabel className=''>Heading Font</DropdownMenuLabel>
        <div className='flex flex-col h-96 overflow-y-auto'>
          {FONTS.map((font) => (
            <FontsDropdownMenuItem
              key={`heading-font-${font}`}
              font={font}
              onClick={() => setFontAttribute(font)}
              selected={currentFont === font}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
