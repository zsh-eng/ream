import { ReamDB } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

const useBookmark = (url: string) => {
  const bookmarked = useLiveQuery(
    async () => {
      const article = await ReamDB.articles.get(url);
      return !!article;
    },
    [url],
    false
  );

  const onBookmark = useCallback(
    async ({
      url,
      title,
      excerpt,
      content,
    }: {
      url: string;
      title: string;
      excerpt: string;
      content: string;
    }) => {
      if (bookmarked) {
        console.log('deleting', url);
        await ReamDB.articles.delete(url);
      } else {
        await Promise.all([
          ReamDB.articles.add({ url, title, excerpt }),
          ReamDB.articleContents.add({ url, content }),
        ]);
      }
    },
    [bookmarked, url]
  );

  return { bookmarked, onBookmark };
};

export default useBookmark;
