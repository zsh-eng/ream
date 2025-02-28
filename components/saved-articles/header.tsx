import { useFocusSearchBar } from '@/hooks/use-keyboard-shortcut';
import { cn } from '@/lib/utils';
import { CalendarArrowDown, CalendarArrowUp, X } from 'lucide-react';
import { useRef } from 'react';
import '~/assets/main.css';
import { Button } from '~/components/ui/button';

type SavedArticlesHeaderProps = {
  search: string;
  setSearch: (search: string) => void;
  dateSort: 'asc' | 'desc';
  setDateSort: (dateSort: 'asc' | 'desc') => void;
  isSidePanel?: boolean;
};

export function SavedArticlesHeader({
  search,
  setSearch,
  dateSort,
  setDateSort,
  isSidePanel = false,
}: SavedArticlesHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useFocusSearchBar(inputRef);

  return (
    <div
      className={cn(
        'flex flex-col gap-0 sticky top-0 z-20 pt-[1.5em] pb-[0.5em]',
        // Ensure that the stick covers the scaled up version of the article card
        !isSidePanel &&
          'bg-background before:absolute before:content-[""] before:bg-background before:h-full before:w-[200px] before:right-full before:top-0 after:absolute after:content-[""] after:bg-background after:h-full after:w-[200px] after:left-full after:top-0',
        isSidePanel ? 'w-full' : 'w-[var(--container-2xl)]'
      )}
    >
      <div className='flex items-center gap-2 h-[2.5em]'>
        <h1 className={cn('text-4xl font-bold', isSidePanel && 'text-[1.5em]')}>
          Saved Articles
        </h1>
        <div className='flex-1'></div>

        {!search && (
          <Button
            variant='ghost'
            size='icon'
            className='!size-[3.5em] px-[1.5em]'
            onClick={() => setDateSort(dateSort === 'asc' ? 'desc' : 'asc')}
          >
            {dateSort === 'asc' ? (
              <CalendarArrowUp className='!size-[1.5em]' />
            ) : (
              <CalendarArrowDown className='!size-[1.5em]' />
            )}
          </Button>
        )}
      </div>

      <div className='mt-[0.5em] relative'>
        <input
          ref={inputRef}
          type='text'
          placeholder='Search...'
          className={cn(
            'w-full py-[0.5em] px-[1em] text-lg rounded-none focus:outline-none border border-solid border-muted-foreground/30 focus:border-muted-foreground focus:transition-colors',
            isSidePanel && 'text-[1em]'
          )}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              inputRef.current?.blur();
            }

            e.stopPropagation();
          }}
        />
        <div className='absolute top-1/2 -translate-y-1/2 right-[0.25em]'>
          {search && (
            <Button
              variant='ghost'
              size='icon'
              className='size-[2.5em] cursor-pointer hover:bg-transparent'
              onClick={() => {
                setSearch('');
              }}
            >
              <X className='size-[1.25em]' />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
