import Dexie, { EntityTable } from 'dexie';

export type Article = {
  url: string;
  /** Date of saving the article */
  createdAt: number;
  faviconUrl: string;

  // Readability attributes
  title: string;
  length: number;
  excerpt: string;
  byline: string;
  dir: string;
  siteName: string;
  lang: string;
  publishedTime: string;
};

export type ArticleText = {
  url: string;
  content: string;
};

export type ArticleHtml = {
  url: string;
  html: string;
};

export type ArticleToAdd = Omit<Article, 'createdAt'> &
  ArticleHtml &
  ArticleText;

export const ReamDB = new Dexie('ReamDB') as Dexie & {
  articles: EntityTable<Article, 'url'>;
  articleTexts: EntityTable<ArticleText, 'url'>;
  articleHtmls: EntityTable<ArticleHtml, 'url'>;
};

ReamDB.version(1).stores({
  articles:
    'url, createdAt, faviconUrl, title, length, excerpt, byline, dir, siteName, lang, publishedTime',
  articleTexts: 'url, content',
  articleHtmls: 'url, html',
});
