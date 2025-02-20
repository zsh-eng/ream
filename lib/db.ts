import Dexie, { EntityTable } from 'dexie';

export const ReamDB = new Dexie('ReamDB') as Dexie & {
  articles: EntityTable<
    {
      url: string;
      title: string;
      excerpt: string;
    },
    'url'
  >;
  articleContents: EntityTable<
    {
      url: string;
      content: string;
    },
    'url'
  >;
};

ReamDB.version(1).stores({
  articles: 'url, title, excerpt',
  articleContents: 'url, content',
});
