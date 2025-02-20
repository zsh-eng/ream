import Keycap from '@/components/keycap';
import { cn } from '@/lib/utils';

type KeyboardShortcutMenuProps = {
  showKeyboardShortcuts: boolean;
};

export default function KeyboardShortcutMenu({
  showKeyboardShortcuts,
}: KeyboardShortcutMenuProps) {
  return (
    showKeyboardShortcuts && (
      <div
        className={cn(
          'fixed top-18 left-4 h-fit w-80 flex flex-col gap-2 items-start border border-solid border-foreground p-4 bg-background animate-fadein-fast',
          'max-h-[calc(100%-80px)] overflow-y-auto'
        )}
      >
        <div
          className={cn(
            'px-2 py-1.5 text-lg font-semibold uppercase text-foreground'
          )}
        >
          Keyboard Shortcuts
        </div>
        <div className='flex flex-col gap-2 px-2 w-full'>
          <div className='flex items-center justify-between gap-2 w-full'>
            <p className='text-base text-foreground'>Increase font size</p>
            <Keycap character='1' absolute={false} />
          </div>

          <div className='flex items-center justify-between gap-2 w-full'>
            <p className='text-base text-foreground'>Decrease font size</p>
            <Keycap character='2' absolute={false} />
          </div>

          <div className='flex items-center justify-between gap-2 w-full'>
            <p className='text-base text-foreground'>Previous color palette</p>
            <Keycap character='[' absolute={false} />
          </div>

          <div className='flex items-center justify-between gap-2 w-full'>
            <p className='text-base text-foreground'>Next color palette</p>
            <Keycap character=']' absolute={false} />
          </div>

          <div className='flex items-center justify-between gap-2 w-full'>
            <p className='text-base text-foreground'>
              Toggle keyboard shortcuts
            </p>
            <Keycap character='?' absolute={false} />
          </div>

          <div className='flex items-center justify-between gap-2 w-full'>
            <p className='text-base text-foreground'>
              Toggle auto-hide navigation bar
            </p>
            <Keycap character='h' absolute={false} />
          </div>

          <div className='flex items-center justify-between gap-2 w-full'>
            <p className='text-base text-foreground'>Scroll down</p>
            <Keycap character='j' absolute={false} />
          </div>

          <div className='flex items-center justify-between gap-2 w-full'>
            <p className='text-base text-foreground'>Scroll up</p>
            <Keycap character='k' absolute={false} />
          </div>

          <div className='flex items-center justify-between gap-2 w-full'>
            <p className='text-base text-foreground'>Scroll down half a page</p>
            <Keycap character='d' absolute={false} />
          </div>

          <div className='flex items-center justify-between gap-2 w-full'>
            <p className='text-base text-foreground'>Scroll up half a page</p>
            <Keycap character='u' absolute={false} />
          </div>

          <div className='flex items-center justify-between gap-2 w-full'>
            <p className='text-base text-foreground'>Scroll to bottom</p>
            <Keycap character='g' absolute={false} />
          </div>

          <div className='flex items-center justify-between gap-2 w-full'>
            <p className='text-base text-foreground'>Scroll to top</p>
            <Keycap character='G' absolute={false} />
          </div>
        </div>
      </div>
    )
  );
}
