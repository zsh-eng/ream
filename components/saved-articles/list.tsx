import { PartialArticle } from '@/hooks/use-articles';
import { cn } from '@/lib/utils';
import { LinkIcon } from 'lucide-react';
import { Link } from 'wouter';

type SavedArticlesListProps = {
  articles: PartialArticle[];
};

export function SavedArticlesList({ articles }: SavedArticlesListProps) {
  return (
    <div className='flex flex-col gap-1 mt-4'>
      {articles?.map((article) => (
        <Link
          key={article.url}
          href={`/article/${encodeURIComponent(article.url)}`}
        >
          <div
            className={cn(
              'bg-muted p-4 cursor-pointer border border-solid border-transparent',
              'hover:border-foreground hover:scale-[101%] transition-transform'
            )}
          >
            <div className='text-xl'>{article.title}</div>
            <div className='flex items-center gap-1 mb-2 mt-1'>
              <LinkIcon className='size-3' />
              <p className='text-xs text-muted-foreground underline line-clamp-1 overflow-ellipsis'>
                {article.url}
              </p>
            </div>
            <p className='line-clamp-3 overflow-ellipsis'>{article.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
