import ColorPaletteDropdownMenu from '@/components/color-palette-dropdown-menu';
import HeadingDropdownMenu from '@/components/heading-dropdown-menu';
import TextDropdownMenu from '@/components/text-dropdown-menu';
import { Button } from '@/components/ui/button';
import { getCurrentPageFaviconUrl } from '@/lib/favicon';
import { FontSize, SIZES } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { AArrowDown, AArrowUp, ArchiveIcon } from 'lucide-react';
import { useContext, useEffect, useRef } from 'react';
import { PortalTargetContext } from '~/hooks/portal-target-context.tsx';
import { useTheme } from '~/hooks/use-theme';

type AppProps = {
  // markdown: string;
  title?: string;
  contentNode?: Node;
  author?: string;
};

// The top level is .readability-content
// Which might be wrapped by .readability-page if the library detects pages present
// This might be further wrapped by article tags
// To obtain a flatter structure for our Gemini calls, we need to unravel at least some of these
function extractContentElements(contentNode: Node) {
  const children = Array.from((contentNode as unknown as Element).children);
  const readabilityPageChildren = children.flatMap((child) =>
    child.id?.startsWith('readability-page')
      ? Array.from(child.children)
      : [child]
  );
  const articleChildren = readabilityPageChildren.flatMap((child) =>
    child.tagName === 'ARTICLE' ? Array.from(child.children) : [child]
  );
  return articleChildren;
}

export default function App({ contentNode, title, author }: AppProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const faviconUrl = getCurrentPageFaviconUrl();
  const { 'data-size': size } = useTheme();
  const portalTarget = useContext(PortalTargetContext);

  useEffect(() => {
    if (!contentNode || !articleRef.current) return;
    while (articleRef.current.firstChild) {
      articleRef.current.removeChild(articleRef.current.firstChild);
    }

    const nodes = extractContentElements(contentNode);
    nodes.forEach((node) => {
      articleRef.current?.appendChild(node);
    });
  }, [contentNode]);

  const setSize = (size: FontSize) => {
    if (!portalTarget) {
      return;
    }

    portalTarget.setAttribute('data-size', size);
  };
  const getPreviousSize = (size: FontSize) => {
    const index = SIZES.indexOf(size);
    return SIZES[(index - 1 + SIZES.length) % SIZES.length] as FontSize;
  };
  const getNextSize = (size: FontSize) => {
    const index = SIZES.indexOf(size);
    return SIZES[(index + 1 + SIZES.length) % SIZES.length] as FontSize;
  };

  const [isNavBarAutoHide, setIsNavBarAutoHide] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'h') {
        setIsNavBarAutoHide((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className='w-full min-h-screen flex items-start bg-background py-16 animate-fadein'>
      <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground'></div>
      <div className='max-w-2xl px-4'>
        <div className='flex items-center gap-1 mb-2'></div>
        <h1
          className={cn(
            'tracking-tight mb-2 text-foreground',
            size === 'prose-sm' && 'text-2xl',
            size === 'prose-base' && 'text-3xl',
            size === 'prose-lg' && 'text-4xl',
            size === 'prose-xl' && 'text-5xl',
            size === 'prose-2xl' && 'text-6xl'
          )}
        >
          {title}
        </h1>
        {author && (
          <div className='mb-6 flex gap-2 items-center'>
            <img src={faviconUrl} alt={'favicon'} className='w-5 h-5' />
            <div className='uppercase text-muted-foreground line-clamp-1 overflow-ellipsis'>
              {author}
            </div>
          </div>
        )}
        <article className={cn('prose', size)} ref={articleRef} />
      </div>

      <div className='hover-trigger fixed top-0 right-0 h-full w-20 peer'></div>
      <div
        className={cn(
          'fixed top-0 right-0 md:top-0 md:right-4 flex flex-col transition-all duration-300 py-4 h-screen',
          // Display when either the hover-trigger or the navbar is hovered
          'translate-x-40 translate-y-0 peer-hover:translate-x-0 hover:translate-x-0',
          // Display when we're focusing on any of the dropdown menus
          'has-data-[state=open]:translate-x-0',
          !isNavBarAutoHide && 'translate-x-0'
        )}
      >
        <Button
          variant='ghost'
          size='icon'
          disabled={size === SIZES[SIZES.length - 1]}
          onClick={() => setSize(getNextSize(size as FontSize))}
          className=''
        >
          <AArrowUp className='size-7' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          disabled={size === SIZES[0]}
          onClick={() => {
            setSize(getPreviousSize(size as FontSize));
          }}
        >
          <AArrowDown className='size-7' />
        </Button>

        <ColorPaletteDropdownMenu />
        <HeadingDropdownMenu />
        <TextDropdownMenu />
        <div className='flex-1 h-full'></div>

        <a
          href={`https://archive.ph/timegate/${window.location.href}`}
          target='_blank'
          // className='fixed bottom-0 right-0 md:bottom-4 md:right-4'
        >
          <Button variant='ghost' size='icon'>
            <ArchiveIcon className='size-6' />
          </Button>
        </a>
      </div>
    </div>
  );
}
