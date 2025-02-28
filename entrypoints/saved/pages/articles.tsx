import NavigationAndShorcutsContainer from '@/components/navigation-and-shortcuts';
import { SavedArticlesHeader } from '@/components/saved-articles/header';
import { SavedArticlesList } from '@/components/saved-articles/list';
import {
  useArticles,
  useSearchedArticles,
  useSortedArticles,
} from '@/hooks/use-articles';
import { useState } from 'react';
import '~/assets/main.css';

const additionalShortcuts = [
  {
    id: 'focus-search',
    characters: ['/'],
    description: 'Focus on the search bar',
  },
];

export default function ArticlesPage() {
  const articles = useArticles();

  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');

  const sortedArticles = useSortedArticles(articles, dateSort);
  const searchResults = useSearchedArticles(articles, search);

  const articlesToDisplay = search ? searchResults : sortedArticles;

  return (
    <>
      <div className='w-full min-h-screen flex items-start py-4 md:py-16 animate-fadein px-4'>
        <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground' />
        <div className='flex flex-col gap-0 max-w-2xl'>
          <SavedArticlesHeader
            search={search}
            setSearch={setSearch}
            dateSort={dateSort}
            setDateSort={setDateSort}
          />

          <SavedArticlesList articles={articlesToDisplay ?? []} />
        </div>
      </div>

      <NavigationAndShorcutsContainer
        additionalShortcuts={additionalShortcuts}
      />
    </>
  );
}
