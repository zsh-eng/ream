import {
  GetArticlesMessage,
  GetArticlesResponse,
} from '@/lib/article-messaging';
import { Article, ReamDB } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import MiniSearch from 'minisearch';
import { useMemo } from 'react';
import '~/assets/main.css';


/**
 * useArticles hook, but communicates with the background script to fetch the data.
 */
export function useArticlesMessaging({
  isOpen,
}: {
  isOpen: boolean;
}) {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const message: GetArticlesMessage = { type: 'GET_ARTICLES' };
    browser.runtime.sendMessage(message, (response: GetArticlesResponse) => {
      if (response.type === 'GET_ARTICLES_RESPONSE') {
        setArticles(response.articles);
      }
    });
  }, [isOpen]);

  return { articles };
}

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

export type PartialArticle = Pick<
  Article,
  'title' | 'url' | 'siteName' | 'excerpt'
>;

export function useSearchedArticles(
  articles: Article[] | undefined,
  searchQuery: string
) {
  return useMemo(() => {
    if (!searchQuery || !articles?.length) return [];

    const miniSearch = new MiniSearch<Article>({
      fields: ['title', 'url', 'siteName', 'excerpt'],
      storeFields: ['title', 'url', 'siteName', 'excerpt'],
    });

    miniSearch.addAll(
      articles.map((article) => ({
        ...article,
        id: article.url,
      }))
    );

    const results = miniSearch.search(searchQuery, {
      prefix: true,
    }) as unknown as PartialArticle[];
    return results;
  }, [articles, searchQuery]);
}
