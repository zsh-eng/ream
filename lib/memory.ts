// In-memory cache of saved articles
import { Article, ReamDB } from '@/lib/db';

let articles: Article[] = [];

let isLoading = false;

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
});

ReamDB.articles.hook('updating', (modifiedArticle, url) => {
  const index = articles.findIndex((a) => a.url === url);
  if (index !== -1) {
    articles[index] = {
      ...articles[index],
      ...modifiedArticle,
    };
  }
});

ReamDB.articles.hook('deleting', (url) => {
  const index = articles.findIndex((a) => a.url === url);
  if (index !== -1) {
    articles.splice(index, 1);
  }
});

export function getArticles() {
  return articles;
}
