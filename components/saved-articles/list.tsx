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
    <div
      className={cn('flex flex-col gap-[0.5em] mt-4', isSidePanel && 'mt-0')}
    >
      {articles?.map((article) => (
        <LinkComponent
          key={article.url}
          encodedURL={encodeURIComponent(article.url)}
        >
          <div
            className={cn(
              'bg-muted p-[1em] cursor-pointer border border-solid border-transparent',
              'hover:border-foreground hover:scale-[101%] transition-transform'
            )}
          >
            {/* We have to hard code the text sizing because the HTML parent's
            base font size still affects the text sizing.
            Some sites like to set font size to be a percentage, which messes with
            the default tailwind text sizing. */}
            <div className={cn('text-xl', isSidePanel && 'text-[1em]')}>
              {article.title}
            </div>
            <div className='flex items-center gap-[0.25em] mb-[0.5em] mt-[0.25em]'>
              <LinkIcon className='size-[1em]' />
              <p
                className={cn(
                  'text-xs text-muted-foreground underline line-clamp-1 overflow-ellipsis',
                  isSidePanel && 'text-[0.75em]'
                )}
              >
                {article.url}
              </p>
            </div>
            <p
              className={cn(
                'line-clamp-3 overflow-ellipsis',
                isSidePanel && 'line-clamp-2 text-[0.875em]'
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
