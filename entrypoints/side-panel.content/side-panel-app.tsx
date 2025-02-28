import { SavedArticlesHeader } from '@/components/saved-articles/header';
import { SavedArticlesList } from '@/components/saved-articles/list';
import { useSearchedArticles, useSortedArticles } from '@/hooks/use-articles';
import { useSidePanelMessage } from '@/hooks/use-side-panel-message';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import '~/assets/main.css';

export default function SidePanelApp() {
  const { isOpen } = useSidePanelMessage();
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
          'fixed top-8 right-8 rounded-none h-[80%] flex items-start px-4 bg-background w-sm border border-solid border-muted-foreground/30 transition-all',
          !isOpen && 'translate-x-1/4 opacity-0'
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
