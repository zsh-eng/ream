import KeyboardShortcutMenu from '@/components/keyboard-shortcut-menu';
import { MainContent } from '@/components/main-content';
import { NavigationBar } from '@/components/navigation-bar';
import { useFontSize } from '@/hooks/use-font-size';
import {
  useFontSizeKeyboardShortcut,
  useKeyboardShortcut,
  useScrollKeyboardShortcut,
} from '@/hooks/use-keyboard-shortcut';
import { FontSize } from '@/lib/fonts';
import { useContext, useEffect, useRef } from 'react';
import { PortalTargetContext } from '~/hooks/portal-target-context.tsx';
import { useTheme } from '~/hooks/use-theme';

type AppProps = {
  // markdown: string;
  title?: string;
  contentNode?: Node;
  author?: string;
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

export default function App({ contentNode, title, author }: AppProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const { 'data-size': size } = useTheme();
  const portalTarget = useContext(PortalTargetContext);

  useFontSizeKeyboardShortcut(portalTarget);
  useScrollKeyboardShortcut(portalTarget);
  const { isNavBarAutoHide, showKeyboardShortcuts } = useKeyboardShortcut();
  const { setSize, getPreviousSize, getNextSize } = useFontSize(portalTarget);

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

  return (
    <div className='w-full min-h-screen flex items-start bg-background py-16 animate-fadein'>
      <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground' />

      <MainContent
        title={title}
        author={author}
        size={size}
        articleRef={articleRef}
      />

      <KeyboardShortcutMenu
        showKeyboardShortcuts={showKeyboardShortcuts}
      />

      <NavigationBar
        size={size}
        isNavBarAutoHide={isNavBarAutoHide}
        showKeyboardShortcuts={showKeyboardShortcuts}
        onSizeIncrease={() => setSize(getNextSize(size as FontSize))}
        onSizeDecrease={() => setSize(getPreviousSize(size as FontSize))}
      />
    </div>
  );
}
