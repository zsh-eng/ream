import {
    AddBookmarkMessage,
    CheckBookmarkMessage,
    DeleteBookmarkMessage,
} from '@/lib/bookmark-messaging';
import { useEffect, useState } from 'react';

const useBookmark = (url: string) => {
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
    async ({
      url,
      title,
      excerpt,
      content,
    }: {
      url: string;
      title: string;
      excerpt: string;
      content: string;
    }) => {
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
          data: { url, title, excerpt, content },
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

export default useBookmark;
