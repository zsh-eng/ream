import {
  parseArticle,
  readabilityContentToArticleToAdd,
} from '@/lib/parse-article';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useToggleSidePanelMessage() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const listener = (message: { action: string }) => {
      if (message.action === 'toggle-sidepanel') {
        setIsOpen((open) => !open);
      }
    };

    browser.runtime.onMessage.addListener(listener);
    return () => {
      browser.runtime.onMessage.removeListener(listener);
    };
  }, []);

  return { isOpen, setIsOpen };
}

export function useToggleSaveArticleMessage() {
  const { toggle } = useBookmarkToggle({
    onComplete: (isBookmarked) => {
      if (isBookmarked) {
        toast.success('Article saved');
      } else {
        toast.error('Article removed');
      }
    },
  });

  useEffect(() => {
    const listener = (message: { action: string }) => {
      if (message.action === 'toggle-save-article') {
        const article = parseArticle();
        if (!article) {
          console.error('Failed to parse article');
          return;
        }

        const articleToAdd = readabilityContentToArticleToAdd(article);
        console.log('articleToAdd', articleToAdd);
        toggle(articleToAdd);
      }
    };

    browser.runtime.onMessage.addListener(listener);
    return () => {
      browser.runtime.onMessage.removeListener(listener);
    };
  }, [toggle]);
}
