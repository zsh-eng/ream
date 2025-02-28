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
        'flex flex-col gap-0 sticky top-0 z-20 pt-6 pb-2',
        // Ensure that the stick covers the scaled up version of the article card
        !isSidePanel &&
          'bg-background before:absolute before:content-[""] before:bg-background before:h-full before:w-[200px] before:right-full before:top-0 after:absolute after:content-[""] after:bg-background after:h-full after:w-[200px] after:left-full after:top-0',
        isSidePanel ? 'w-full' : 'w-[var(--container-2xl)]'
      )}
    >
      <div className='flex items-center gap-2 h-10'>
        <h1 className={cn('text-4xl font-bold', isSidePanel && 'text-2xl')}>
          Saved Articles
        </h1>
        <div className='flex-1'></div>

        {!search && (
          <Button
            variant='ghost'
            size='icon'
            className='size-10'
            onClick={() => setDateSort(dateSort === 'asc' ? 'desc' : 'asc')}
          >
            {dateSort === 'asc' ? (
              <CalendarArrowUp className='size-6' />
            ) : (
              <CalendarArrowDown className='size-6' />
            )}
          </Button>
        )}
      </div>

      <div className='mt-2 relative'>
        <input
          ref={inputRef}
          type='text'
          placeholder='Search...'
          className='w-full py-2 px-3 text-lg rounded-none focus:outline-none border border-solid border-muted-foreground/30 focus:border-muted-foreground focus:transition-colors'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              inputRef.current?.blur();
            }

            e.stopPropagation();
          }}
        />
        <div className='absolute top-1/2 -translate-y-1/2 right-1'>
          {search && (
            <Button
              variant='ghost'
              size='icon'
              className='size-10 cursor-pointer hover:bg-transparent'
              onClick={() => {
                setSearch('');
              }}
            >
              <X className='size-5' />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
