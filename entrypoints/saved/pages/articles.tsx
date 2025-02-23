import NavigationAndShorcutsContainer from '@/components/navigation-and-shortcuts';
import { Button } from '@/components/ui/button';
import { useFocusSearchBar } from '@/hooks/use-keyboard-shortcut';
import { ReamDB } from '@/lib/db';
import { cn } from '@/lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { CalendarArrowDown, CalendarArrowUp, LinkIcon, X } from 'lucide-react';
import MiniSearch from 'minisearch';
import { useRef } from 'react';
import { Link } from 'wouter';

const additionalShortcuts = [
  {
    id: 'focus-search',
    characters: ['/'],
    description: 'Focus on the search bar',
  },
];

export default function ArticlesPage() {
  const articles = useLiveQuery(async () => {
    return ReamDB.articles.toArray();
  });

  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');

  const sortedArticles = useMemo(() => {
    return articles?.sort((a, b) => {
      return dateSort === 'asc'
        ? a.createdAt - b.createdAt
        : b.createdAt - a.createdAt;
    });
  }, [articles, dateSort]);

  const miniSearch = new MiniSearch({
    fields: ['title', 'url', 'siteName', 'excerpt'],
    storeFields: ['title', 'url', 'siteName', 'excerpt'],
  });

  miniSearch.addAll(
    articles?.map((article) => ({
      ...article,
      id: article.url,
    })) ?? []
  );
  const searchResults = useMemo(
    () => miniSearch.search(search, { prefix: true }),
    [miniSearch, search]
  );

  const articlesToDisplay = search ? searchResults : sortedArticles;
  const inputRef = useRef<HTMLInputElement>(null);
  useFocusSearchBar(inputRef);

  return (
    <>
      <div className='w-full min-h-screen flex items-start py-4 md:py-16 animate-fadein px-4'>
        <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground' />
        <div className='flex flex-col gap-0 max-w-2xl'>
          <div
            className={cn(
              'flex flex-col gap-0 sticky top-0 bg-background z-20 pt-6 pb-2',
              // Ensure that the stick covers the scaled up version of the article card
              'before:absolute before:content-[""] before:bg-background before:h-full before:w-[200px] before:right-full before:top-0 after:absolute after:content-[""] after:bg-background after:h-full after:w-[200px] after:left-full after:top-0',
              'w-[var(--container-2xl)]'
            )}
          >
            <div className='flex items-center gap-2'>
              <h1 className='text-4xl font-bold'>Saved Articles</h1>
              <div className='flex-1'></div>

              {!search && (
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-10'
                  onClick={() =>
                    setDateSort(dateSort === 'asc' ? 'desc' : 'asc')
                  }
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

          <div className='flex flex-col gap-1 mt-4'>
            {articlesToDisplay?.map((article) => (
              <Link
                key={article.url}
                href={`/article/${encodeURIComponent(article.url)}`}
              >
                <div
                  className={cn(
                    'bg-muted p-4 cursor-pointer border border-solid border-transparent',
                    'hover:border-foreground hover:scale-[101%] transition-transform'
                  )}
                >
                  <div className='text-xl'>{article.title}</div>
                  <div className='flex items-center gap-1 mb-2 mt-1'>
                    <LinkIcon className='size-3' />
                    <p className='text-xs text-muted-foreground underline line-clamp-1 overflow-ellipsis'>
                      {article.url}
                    </p>
                  </div>
                  <p className='line-clamp-3 overflow-ellipsis'>
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <NavigationAndShorcutsContainer
        additionalShortcuts={additionalShortcuts}
      />
    </>
  );
}
