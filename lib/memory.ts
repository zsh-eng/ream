// In-memory cache of saved articles
import { Article, ReamDB } from '@/lib/db';

let articles: Article[] = [];

let isLoading = false;
const subscribers: Set<(articles: Article[]) => void> = new Set();

async function loadArticles() {
  if (isLoading) {
    return;
  }

  isLoading = true;
  try {
    articles = await ReamDB.articles.toArray();
  } finally {
    isLoading = false;
  }
}

loadArticles();

ReamDB.articles.hook('creating', (_, article) => {
  articles.push(article);
  notifySubscribers();
});

ReamDB.articles.hook('updating', (modifiedArticle, url) => {
  const index = articles.findIndex((a) => a.url === url);
  if (index !== -1) {
    articles[index] = {
      ...articles[index],
      ...modifiedArticle,
    };
  }
  notifySubscribers();
});

ReamDB.articles.hook('deleting', (url) => {
  const index = articles.findIndex((a) => a.url === url);
  if (index !== -1) {
    articles.splice(index, 1);
  }

  notifySubscribers();
});

function notifySubscribers() {
  // To avoid mutating the set while iterating over it
  const subscribersArray = Array.from(subscribers);
  subscribersArray.forEach((subscriber) => {
    subscriber(articles);
  });
}

export function subscribeToArticles(subscriber: (articles: Article[]) => void) {
  console.log('subscribing', subscriber);
  subscribers.add(subscriber);
  return () => {
    console.log('unsubscribing', subscriber);
    subscribers.delete(subscriber);
  };
}

export function getArticles() {
  return articles;
}
