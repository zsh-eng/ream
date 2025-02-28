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

/**
 * Toggle bookmark helps us avoid having to communicate back and forth between
 * the side panel content script and the background script, since we don't need
 * to render the bookmarked page in the side panel.
 */
export type ToggleBookmarkMessage = {
  type: 'TOGGLE_BOOKMARK';
  data: ArticleToAdd;
};

export type BookmarkMessage =
  | CheckBookmarkMessage
  | AddBookmarkMessage
  | DeleteBookmarkMessage
  | ToggleBookmarkMessage;

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

export type ToggleBookmarkResponse = {
  type: 'TOGGLE_BOOKMARK_RESPONSE';
  bookmarked: boolean;
};

export type BookmarkResponse =
  | AddBookmarkResponse
  | DeleteBookmarkResponse
  | CheckBookmarkResponse
  | ToggleBookmarkResponse;

async function addArticle(data: ArticleToAdd) {
  return Promise.all([
    ReamDB.articles.add({
      url: data.url,
      createdAt: Date.now(),

      faviconUrl: data.faviconUrl,
      title: data.title,
      length: data.length,
      excerpt: data.excerpt,
      byline: data.byline,
      dir: data.dir,
      siteName: data.siteName,
      lang: data.lang,
      publishedTime: data.publishedTime,
    }),
    ReamDB.articleTexts.add({
      url: data.url,
      content: data.content,
    }),
    ReamDB.articleHtmls.add({
      url: data.url,
      html: data.html,
    }),
  ]);
}

async function deleteArticle(url: string) {
  return Promise.all([
    ReamDB.articles.delete(url),
    ReamDB.articleTexts.delete(url),
    ReamDB.articleHtmls.delete(url),
  ]);
}

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

  if (message.type === 'TOGGLE_BOOKMARK') {
    ReamDB.articles.get(message.data.url).then((article) => {
      const promise = article
        ? deleteArticle(message.data.url)
        : addArticle(message.data);
      promise.then(() =>
        sendResponse({
          type: 'TOGGLE_BOOKMARK_RESPONSE',
          bookmarked: !article,
        })
      );
    });

    return true;
  }

  if (message.type === 'ADD_BOOKMARK') {
    addArticle(message.data).then(() =>
      sendResponse({
        type: 'ADD_BOOKMARK_RESPONSE',
        success: true,
      })
    );
    return true;
  }

  if (message.type === 'DELETE_BOOKMARK') {
    deleteArticle(message.url!).then(() =>
      sendResponse({
        type: 'DELETE_BOOKMARK_RESPONSE',
        success: true,
      })
    );
    return true;
  }
}
