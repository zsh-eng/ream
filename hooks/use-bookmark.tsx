import {
  AddBookmarkMessage,
  CheckBookmarkMessage,
  DeleteBookmarkMessage,
  ToggleBookmarkMessage,
  ToggleBookmarkResponse,
} from '@/lib/bookmark-messaging';
import { ArticleToAdd } from '@/lib/db';
import { useCallback, useEffect, useState } from 'react';

export const useBookmark = (url: string) => {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const checkMessage: CheckBookmarkMessage = {
      type: 'CHECK_BOOKMARK',
      url,
    };
    browser.runtime.sendMessage(checkMessage, (response) => {
      setBookmarked(response.bookmarked);
    });
  }, [url]);

  const onBookmark = useCallback(
    async (data: ArticleToAdd) => {
      if (bookmarked) {
        const deleteMessage: DeleteBookmarkMessage = {
          type: 'DELETE_BOOKMARK',
          url,
        };
        browser.runtime.sendMessage(deleteMessage, () => {
          setBookmarked(false);
        });
      } else {
        const addMessage: AddBookmarkMessage = {
          type: 'ADD_BOOKMARK',
          data,
        };
        browser.runtime.sendMessage(addMessage, () => {
          setBookmarked(true);
        });
      }
    },
    [bookmarked, url]
  );

  return { bookmarked, onBookmark };
};

export const useBookmarkToggle = ({
  onComplete,
}: {
  onComplete: (isBookmarked: boolean) => void;
}) => {
  const toggle = useCallback(
    (data: ArticleToAdd) => {
      const toggleMessage: ToggleBookmarkMessage = {
        type: 'TOGGLE_BOOKMARK',
        data,
      };
      browser.runtime.sendMessage(toggleMessage, (response) => {
        onComplete((response as ToggleBookmarkResponse).bookmarked);
      });
    },
    [onComplete]
  );

  return { toggle };
};
