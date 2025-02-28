import { ArticleToAdd } from '@/lib/db';
import { getCurrentPageFaviconUrl } from '@/lib/favicon';
import { Readability } from '@mozilla/readability';

export type ReadabilityContent = {
  title: string;
  length: number;
  excerpt: string;
  byline: string;
  dir: string;
  siteName: string;
  lang: string;
  publishedTime: string;
  content: Node;
  textContent: string;
};

export function parseArticle() {
  const documentClone = document.cloneNode(true) as Document;
  return new Readability(documentClone, {
    serializer: (el) => el,
  }).parse();
}

export function readabilityContentToArticleToAdd(
  content: ReadabilityContent
): ArticleToAdd {
  return {
    url: window.location.href,
    faviconUrl: getCurrentPageFaviconUrl(),
    title: content.title,
    content: content.textContent,
    html: (content.content as HTMLDivElement).innerHTML,
    publishedTime: content.publishedTime,
    siteName: content.siteName,
    lang: content.lang,
    length: content.textContent.length,
    excerpt: content.excerpt,
    byline: content.byline,
    dir: content.dir,
  };
}
