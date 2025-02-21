import NavigationAndShorcutsContainer from '@/components/navigation-and-shortcuts';
import { Button } from '@/components/ui/button';
import { ReamDB } from '@/lib/db';
import { cn } from '@/lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { CalendarArrowDown, CalendarArrowUp, LinkIcon } from 'lucide-react';
import { Link } from 'wouter';

export default function ArticlesPage() {
  const articles = useLiveQuery(async () => {
    return ReamDB.articles.toArray();
  });

  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');

  return (
    <>
      <div className='w-full min-h-screen flex items-start bg-background py-16 animate-fadein'>
        <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground' />
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-0 sticky top-0 bg-background z-20 py-6 before:absolute before:content-[""] before:bg-background before:h-full before:w-[200px] before:right-full before:top-0 after:absolute after:content-[""] after:bg-background after:h-full after:w-[200px] after:left-full after:top-0'>
            <h1 className='text-4xl font-bold'>
              Saved Articles
            </h1>
            <div className='flex-1'></div>

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
          </div>

          <div className='max-w-2xl flex flex-col gap-1'>
            {articles?.map((article) => (
              <Link
                key={article.url}
                href={`/article/${encodeURIComponent(article.url)}`}
              >
                <div
                  className={cn(
                    'bg-muted p-4 cursor-pointer border border-solid border-transparent',
                    'hover:border-foreground hover:scale-[101%] transition-all'
                  )}
                >
                  <div className='text-xl'>{article.title}</div>
                  <div className='flex items-center gap-1 mb-2 mt-1'>
                    <LinkIcon className='size-3' />
                    <a
                      href={article.url}
                      className='text-xs text-muted-foreground underline line-clamp-1 overflow-ellipsis'
                    >
                      {article.url}
                    </a>
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

      <NavigationAndShorcutsContainer />
    </>
  );
}
