import { ArticleContent } from '@/components/article-content';
import NavigationAndShorcutsContainer from '@/components/navigation-and-shortcuts';
import { ReamDB } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import '~/assets/main.css';

export default function SavedArticlePage({ url }: { url: string }) {
  const article = useLiveQuery(
    async () => {
      const article = await ReamDB.articles.get(url);
      const contents = await ReamDB.articleContents.get(url);
      if (!article || !contents) {
        return null;
      }

      return {
        ...article,
        content: contents.content,
      };
    },
    [url],
    undefined
  );

  const { 'data-size': size } = useTheme();

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <>
      <div className='w-full min-h-screen flex items-start bg-background py-16'>
        <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground' />

        <ArticleContent title={article.title} author={''} size={size} />
      </div>

      <NavigationAndShorcutsContainer
        title={article.title}
        excerpt={article.excerpt}
        textContent={article.content}
      />
    </>
  );
}
