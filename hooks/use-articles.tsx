import { Article } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import MiniSearch from 'minisearch';
import { useMemo } from 'react';
import '~/assets/main.css';
import { ReamDB } from '@/lib/db';

export function useArticles() {
  const articles = useLiveQuery(async () => {
    return ReamDB.articles.toArray();
  });

  return articles;
}

export function useSortedArticles(
  articles: Article[] | undefined,
  sortDirection: 'asc' | 'desc'
) {
  return useMemo(() => {
    return articles?.sort((a, b) => {
      return sortDirection === 'asc'
        ? a.createdAt - b.createdAt
        : b.createdAt - a.createdAt;
    });
  }, [articles, sortDirection]);
}

export function useSearchedArticles(
  articles: Article[] | undefined,
  searchQuery: string
) {
  return useMemo(() => {
    if (!searchQuery || !articles?.length) return [];

    const miniSearch = new MiniSearch({
      fields: ['title', 'url', 'siteName', 'excerpt'],
      storeFields: ['title', 'url', 'siteName', 'excerpt'],
    });
    miniSearch.addAll(
      articles.map((article) => ({
        ...article,
        id: article.url,
      }))
    );

    return miniSearch.search(searchQuery, { prefix: true });
  }, [articles, searchQuery]);
}
