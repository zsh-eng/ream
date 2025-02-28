import { Article, ReamDB } from '@/lib/db';

export type GetArticlesMessage = {
  type: 'GET_ARTICLES';
};

export type GetArticlesResponse = {
  type: 'GET_ARTICLES_RESPONSE';
  articles: Article[];
};

export function handleGetArticlesMessage(
  message: GetArticlesMessage,
  sendResponse: (response: GetArticlesResponse) => void
) {
  if (message.type === 'GET_ARTICLES') {
    ReamDB.articles.toArray().then((articles) =>
      sendResponse({
        type: 'GET_ARTICLES_RESPONSE',
        articles,
      })
    );
    return true;
  }
}

