import { getCurrentPageFaviconUrl } from '@/lib/favicon';
import { cn } from '@/lib/utils';
import { RefObject } from 'react';

type MainContentProps = {
  title?: string;
  author?: string;
  size: string;
  articleRef?: RefObject<HTMLDivElement | null>;
};

export function ArticleContent({
  title,
  author,
  size,
  articleRef,
}: MainContentProps) {
  const faviconUrl = getCurrentPageFaviconUrl();

  return (
    <div className='max-w-2xl px-4'>
      <div className='flex items-center gap-1 mb-2' />
      <h1
        className={cn(
          'tracking-tight mb-2 text-foreground',
          size === 'prose-sm' && 'text-2xl',
          size === 'prose-base' && 'text-3xl',
          size === 'prose-lg' && 'text-4xl',
          size === 'prose-xl' && 'text-5xl',
          size === 'prose-2xl' && 'text-6xl'
        )}
      >
        {title}
      </h1>
      {author && (
        <div className='mb-6 flex gap-2 items-center'>
          <img src={faviconUrl} alt={'favicon'} className='w-5 h-5' />
          <div className='uppercase text-muted-foreground line-clamp-1 overflow-ellipsis'>
            {author}
          </div>
        </div>
      )}
      <article className={cn('prose', size)} ref={articleRef} />
    </div>
  );
}
