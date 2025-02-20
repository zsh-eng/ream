import { ReamDB } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function ArticlesPage() {
  const articles = useLiveQuery(async () => {
    console.log('fetching articles');
    return ReamDB.articles.toArray();
  });

  return (
    <div>
      <h1>Articles</h1>
      {articles?.map((article) => (
        <div key={article.url}>
          <h2>{article.title}</h2>
          <p>{article.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
