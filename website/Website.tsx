import NavigationAndShorcutsContainer from '@/components/navigation-and-shortcuts';
import { cn } from '@/lib/utils';
import { useTheme } from '~/hooks/use-theme';

export default function Website() {
  const { 'data-size': size } = useTheme();
  return (
    <>
      <div className='w-full min-h-screen flex items-center py-16 animate-fadein'>
        <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground' />
        <article className={cn('prose', size)}>
          <h1 className='mb-0'>Ream</h1>
          <p className='mt-4 mb-0'>
            <span>Ream is a free, modern, </span>
            <a href='https://github.com/zsh-eng/ream'>open-source</a>
            <span> reader mode extension.</span>
          </p>
          <p className='mt-0'>
            Ream simplifies the web for reading by removing ads, sidebars, and
            unnecessary formatting, leaving only the essential text and images.
          </p>
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

      <NavigationAndShorcutsContainer />
    </>
  );
}
