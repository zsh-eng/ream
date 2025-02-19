import HeadingDropdownMenu from '@/components/heading-dropdown-menu';
import TextDropdownMenu from '@/components/text-dropdown-menu';
import ColorPaletteDropdownMenu from '@/components/color-palette-dropdown-menu';
import { Button } from '@/components/ui/button';
import { getCurrentPageFaviconUrl } from '@/lib/favicon';
import { ArchiveIcon } from 'lucide-react';

type AppProps = {
  // markdown: string;
  title?: string;
  html?: string;
  author?: string;
};

export default function App({ html, title, author }: AppProps) {
  const faviconUrl = getCurrentPageFaviconUrl();

  return (
    <div className='w-full min-h-screen flex items-start bg-background py-16 animate-fadein'>
      <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground'></div>
      <div className='max-w-2xl px-4'>
        <div className='flex items-center gap-1 mb-2'></div>

        <h1 className='tracking-tight text-3xl md:text-5xl mb-2 text-foreground'>
          {title}
        </h1>
        {author && (
          <div className='mb-6 flex gap-2 items-center'>
            <img src={faviconUrl} alt={'favicon'} className='w-5 h-5' />
            <div className='uppercase text-muted-foreground'>{author}</div>
          </div>
        )}
        <article className='prose prose-xl max-w-none'>
          <section dangerouslySetInnerHTML={{ __html: html ?? '' }}></section>
        </article>
      </div>
      <div className='fixed top-4 right-4 flex flex-col'>
        <ColorPaletteDropdownMenu />
        <HeadingDropdownMenu />
        <TextDropdownMenu />
        <div className='flex-1'></div>
      </div>

      <a
        href={`https://archive.ph/timegate/${window.location.href}`}
        target='_blank'
        className='fixed bottom-4 right-4'
      >
        <Button variant='ghost' size='icon'>
          <ArchiveIcon className='size-6' />
        </Button>
      </a>
    </div>
  );
}
