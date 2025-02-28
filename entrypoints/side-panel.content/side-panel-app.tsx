import { SavedArticlesHeader } from '@/components/saved-articles/header';
import { SavedArticlesList } from '@/components/saved-articles/list';
import { useSearchedArticles, useSortedArticles } from '@/hooks/use-articles';
import { useToggleSidePanelMessage } from '@/hooks/use-side-panel-message';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import '~/assets/main.css';

// Note: all styling must be in em to avoid being affected by the parent's root font size.
// Many websites like to set the root font size to be a percentage, which messes with
// the default tailwind sizing.
export default function SidePanelApp() {
  useToggleSaveArticleMessage();
  const { isOpen } = useToggleSidePanelMessage();
  const { articles } = useArticlesMessaging({ isOpen });

  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');

  const sortedArticles = useSortedArticles(articles, dateSort);
  const searchResults = useSearchedArticles(articles, search);

  const articlesToDisplay = search ? searchResults : sortedArticles;

  return (
    <>
      <div
        className={cn(
          'fixed top-[2em] right-[2em] rounded-none h-[80%] flex items-start px-[1em] bg-background w-[24em] border border-solid border-muted-foreground/30 transition-all translate-x-0% duration-200 translate-y-0',
          !isOpen && 'translate-x-1/4 opacity-0 pointer-events-none'
        )}
      >
        <div className='flex flex-col gap-0 w-full h-full'>
          <SavedArticlesHeader
            search={search}
            setSearch={setSearch}
            dateSort={dateSort}
            setDateSort={setDateSort}
            isSidePanel={true}
          />

          <SavedArticlesList
            isSidePanel={true}
            articles={articlesToDisplay ?? []}
          />
        </div>
      </div>
    </>
  );
}
