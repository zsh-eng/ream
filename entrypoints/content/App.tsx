import { ArticleContent } from '@/components/article-content';
import NavigationAndShorcutsContainer from '@/components/navigation-and-shortcuts';
import { Button } from '@/components/ui/button';
import useBookmark from '@/hooks/use-bookmark';
import { stripQueryParams } from '@/lib/utils';
import { BookmarkIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTheme } from '~/hooks/use-theme';

type AppProps = {
  // markdown: string;
  title?: string;
  contentNode?: Node;
  author?: string;
  excerpt?: string;
  textContent?: string;
};

// The top level is .readability-content
// Which might be wrapped by .readability-page if the library detects pages present
// This might be further wrapped by article tags
// To obtain a flatter structure for our Gemini calls, we need to unravel at least some of these
function extractContentElements(contentNode: Node) {
  const children = Array.from((contentNode as unknown as Element).children);
  const readabilityPageChildren = children.flatMap((child) =>
    child.id?.startsWith('readability-page')
      ? Array.from(child.children)
      : [child]
  );
  const articleChildren = readabilityPageChildren.flatMap((child) =>
    child.tagName === 'ARTICLE' ? Array.from(child.children) : [child]
  );
  return articleChildren;
}

export default function App({
  contentNode,
  title,
  author,
  excerpt,
  textContent,
}: AppProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const { 'data-size': size } = useTheme();

  useEffect(() => {
    if (!contentNode || !articleRef.current) return;
    while (articleRef.current.firstChild) {
      articleRef.current.removeChild(articleRef.current.firstChild);
    }

    const nodes = extractContentElements(contentNode);
    nodes.forEach((node) => {
      articleRef.current?.appendChild(node);
    });
  }, [contentNode]);

  const { bookmarked, onBookmark } = useBookmark(window.location.href);

  return (
    <>
      <div className='w-full min-h-screen flex items-start bg-background py-16 animate-fadein'>
        <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground' />

        <ArticleContent
          title={title}
          author={author}
          size={size}
          articleRef={articleRef}
        />
      </div>

      <NavigationAndShorcutsContainer
        renderActionButtons={() => (
          <Button
            variant='ghost'
            size='icon'
            onClick={() =>
              onBookmark({
                url: stripQueryParams(window.location.href),
                title: title ?? '',
                excerpt: excerpt ?? '',
                content: textContent ?? '',
              })
            }
          >
            <BookmarkIcon
              className='size-6'
              fill={bookmarked ? 'currentColor' : 'none'}
              strokeWidth={bookmarked ? 0 : 2}
            />
          </Button>
        )}
      />
    </>
  );
}
