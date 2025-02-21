import { ArticleToAdd, ReamDB } from '@/lib/db';

// This file contains the messages and responses for the bookmark feature
// It is necessary because the content script will create the DB in the
// current tab's origin, not the extension's origin.
// This means that the content script can't access the DB directly.
// So we need to send messages to the background script to handle the DB.

export type CheckBookmarkMessage = {
  type: 'CHECK_BOOKMARK';
  url: string;
};

export type AddBookmarkMessage = {
  type: 'ADD_BOOKMARK';
  data: ArticleToAdd;
};

export type DeleteBookmarkMessage = {
  type: 'DELETE_BOOKMARK';
  url: string;
};

export type BookmarkMessage =
  | CheckBookmarkMessage
  | AddBookmarkMessage
  | DeleteBookmarkMessage;

type AddBookmarkResponse = {
  type: 'ADD_BOOKMARK_RESPONSE';
  success: boolean;
};

type DeleteBookmarkResponse = {
  type: 'DELETE_BOOKMARK_RESPONSE';
  success: boolean;
};

type CheckBookmarkResponse = {
  type: 'CHECK_BOOKMARK_RESPONSE';
  bookmarked: boolean;
};

export type BookmarkResponse =
  | AddBookmarkResponse
  | DeleteBookmarkResponse
  | CheckBookmarkResponse;

export function handleBookmarkMessage(
  message: BookmarkMessage,
  sendResponse: (response: BookmarkResponse) => void
) {
  if (message.type === 'CHECK_BOOKMARK') {
    ReamDB.articles.get(message.url!).then((article) =>
      sendResponse({
        type: 'CHECK_BOOKMARK_RESPONSE',
        bookmarked: !!article,
      })
    );
    return true;
  }

  if (message.type === 'ADD_BOOKMARK') {
    Promise.all([
      ReamDB.articles.add({
        url: message.data.url,
        createdAt: Date.now(),

        faviconUrl: message.data.faviconUrl,
        title: message.data.title,
        length: message.data.length,
        excerpt: message.data.excerpt,
        byline: message.data.byline,
        dir: message.data.dir,
        siteName: message.data.siteName,
        lang: message.data.lang,
        publishedTime: message.data.publishedTime,
      }),
      ReamDB.articleTexts.add({
        url: message.data.url,
        content: message.data.textContent,
      }),
      ReamDB.articleHtmls.add({
        url: message.data.url,
        html: message.data.html,
      }),
    ]).then(() =>
      sendResponse({
        type: 'ADD_BOOKMARK_RESPONSE',
        success: true,
      })
    );
    return true;
  }

  if (message.type === 'DELETE_BOOKMARK') {
    Promise.all([
      ReamDB.articles.delete(message.url!),
      ReamDB.articleTexts.delete(message.url!),
      ReamDB.articleHtmls.delete(message.url!),
    ]).then(() =>
      sendResponse({
        type: 'DELETE_BOOKMARK_RESPONSE',
        success: true,
      })
    );
    return true;
  }
}
