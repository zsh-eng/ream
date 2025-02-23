import { ArticleContent } from '@/components/article-content';
import NavigationAndShorcutsContainer from '@/components/navigation-and-shortcuts';
import { Button } from '@/components/ui/button';
import useBookmark from '@/hooks/use-bookmark';
import { useSaveArticleKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';
import { getCurrentPageFaviconUrl } from '@/lib/favicon';
import { stripQueryParams } from '@/lib/utils';
import { BookmarkIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTheme } from '~/hooks/use-theme';

type ReadabilityContent = {
  title: string;
  length: number;
  excerpt: string;
  byline: string;
  dir: string;
  siteName: string;
  lang: string;
  publishedTime: string;
  content: Node;
  textContent: string;
};

type AppProps = {
  article: ReadabilityContent;
};

const additionalShortcuts = [
  {
    id: 'save-article',
    characters: ['s'],
    description: 'Save / unsave article',
  },
  {
    id: 'toggle-reader-mode',
    characters: ['⇧', '⌘', 'Y'],
    description: 'Toggle reader mode',
  },
];

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

export default function App({ article }: AppProps) {
  const { content: contentNode, title, byline, textContent } = article;
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
  const faviconUrl = getCurrentPageFaviconUrl();
  const handleBookmark = () => {
    if (!articleRef.current) return;

    const html = articleRef.current.innerHTML;
    onBookmark({
      ...article,
      url: stripQueryParams(window.location.href),
      faviconUrl,
      content: textContent,
      html,
    });
  };
  useSaveArticleKeyboardShortcut(handleBookmark);

  return (
    <>
      <div className='w-full min-h-screen flex items-start py-4 md:py-16 animate-fadein'>
        <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground' />

        <ArticleContent
          title={title}
          author={byline}
          size={size}
          articleRef={articleRef}
          faviconUrl={faviconUrl}
        />
      </div>

      <NavigationAndShorcutsContainer
        additionalShortcuts={additionalShortcuts}
        renderActionButtons={() => (
          <Button variant='ghost' size='icon' onClick={handleBookmark}>
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
