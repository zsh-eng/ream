import NavigationAndShorcutsContainer from '@/components/navigation-and-shortcuts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollText } from 'lucide-react';
import { useTheme } from '~/hooks/use-theme';

export default function Website() {
  const { 'data-size': size } = useTheme();
  return (
    <>
      <div className='w-full min-h-screen flex items-center py-16 animate-fadein'>
        <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground' />
        <article className={cn('prose', size)}>
          <h1 className='mb-0'>Ream</h1>
          <p className=''>
            <span>Ream is a free, modern, </span>
            <a href='https://github.com/zsh-eng/ream' target='_blank'>
              open-source
            </a>
            <span> reader mode extension.</span>
            <br />
            <span>
              Ream simplifies the web by removing ads, sidebars, and unnecessary
              formatting, leaving only the essential text and images for you to
              read.
            </span>
          </p>
          <p className=''></p>
          <p>
            <span>You can find Ream in the </span>
            <a
              href='https://chromewebstore.google.com/detail/ream/ghflcpbbkigpaagelodcpbdjjomikdoe'
              target='_blank'
            >
              Chrome Web Store
            </a>
            <span> or the </span>
            <a
              href='https://addons.mozilla.org/en-GB/firefox/addon/ream/'
              target='_blank'
            >
              Firefox Add-ons
            </a>
            <span> store.</span>
          </p>
          <div className='h-40'></div>
        </article>
      </div>

      <NavigationAndShorcutsContainer
        renderActionButtons={() => (
          <div className='flex items-center gap-2'>
            <a href='https://github.com/zsh-eng/ream' target='_blank'>
              <Button variant='ghost' size='icon'>
                <ScrollText className='size-7' />
              </Button>
            </a>
          </div>
        )}
      />
    </>
  );
}
