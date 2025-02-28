import { PartialArticle } from '@/hooks/use-articles';
import { cn } from '@/lib/utils';
import { LinkIcon } from 'lucide-react';
import { Link } from 'wouter';

type SavedArticlesListProps = {
  articles: PartialArticle[];
  isSidePanel?: boolean;
};

export function SavedArticlesList({
  articles,
  isSidePanel = false,
}: SavedArticlesListProps) {
  const LinkComponent = ({
    encodedURL,
    children,
  }: {
    encodedURL: string;
    children: React.ReactNode;
  }) => {
    // For side panel, we have to communicate with the background script to
    // navgiate to the saved page because the content script has limited
    // permissions; it does not have access to browser.tabs.update API.
    return isSidePanel ? (
      <div
        onClick={() => {
          browser.runtime.sendMessage({
            type: 'NAVIGATE_SAVED_ARTICLE',
            articleUrl: encodedURL,
          });
        }}
      >
        {children}
      </div>
    ) : (
      <Link href={`/article/${encodedURL}`}>{children}</Link>
    );
  };

  return (
    <div className={cn('flex flex-col gap-1 mt-4', isSidePanel && 'mt-0')}>
      {articles?.map((article) => (
        <LinkComponent
          key={article.url}
          encodedURL={encodeURIComponent(article.url)}
        >
          <div
            className={cn(
              'bg-muted p-4 cursor-pointer border border-solid border-transparent',
              'hover:border-foreground hover:scale-[101%] transition-transform'
            )}
          >
            <div className={cn('text-xl', isSidePanel && 'text-base')}>
              {article.title}
            </div>
            <div className='flex items-center gap-1 mb-2 mt-1'>
              <LinkIcon className='size-3' />
              <p className='text-xs text-muted-foreground underline line-clamp-1 overflow-ellipsis'>
                {article.url}
              </p>
            </div>
            <p
              className={cn(
                'line-clamp-3 overflow-ellipsis',
                isSidePanel && 'line-clamp-2 text-sm'
              )}
            >
              {article.excerpt}
            </p>
          </div>
        </LinkComponent>
      ))}
    </div>
  );
}
