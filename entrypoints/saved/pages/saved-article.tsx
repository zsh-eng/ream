import { ArticleContent } from '@/components/article-content';
import NavigationAndShorcutsContainer from '@/components/navigation-and-shortcuts';
import { ReamDB } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import '~/assets/main.css';

export default function SavedArticlePage({ url }: { url: string }) {
  const article = useLiveQuery(
    async () => {
      const [article, contents, html] = await Promise.all([
        ReamDB.articles.get(url),
        ReamDB.articleTexts.get(url),
        ReamDB.articleHtmls.get(url),
      ]);
      if (!article || !contents || !html) {
        return null;
      }

      return {
        ...article,
        content: contents.content,
        html: html.html,
      };
    },
    [url],
    undefined
  );
  const { 'data-size': size } = useTheme();
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!article) return;
    if (!articleRef.current) return;

    while (articleRef.current.firstChild) {
      articleRef.current.removeChild(articleRef.current.firstChild);
    }

    articleRef.current.innerHTML = article.html;
  }, [article]);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <>
      <div className='w-full min-h-screen flex items-start bg-background py-16 animate-fadein'>
        <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground' />

        <ArticleContent
          title={article.title}
          author={article.byline}
          size={size}
          articleRef={articleRef}
          faviconUrl={article.faviconUrl}
        />
      </div>

      <NavigationAndShorcutsContainer />
    </>
  );
}
