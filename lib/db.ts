import Dexie, { EntityTable } from 'dexie';

export type Article = {
  url: string;
  title: string;
  excerpt: string;
};

export type ArticleContent = {
  url: string;
  content: string;
};

export const ReamDB = new Dexie('ReamDB') as Dexie & {
  articles: EntityTable<Article, 'url'>;
  articleContents: EntityTable<ArticleContent, 'url'>;
};

ReamDB.version(1).stores({
  articles: 'url, title, excerpt',
  articleContents: 'url, content',
});
