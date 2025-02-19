type AppProps = {
  // markdown: string;
  title?: string;
  html?: string;
  author?: string;
};

export default function App({ html, title, author }: AppProps) {
  return (
    <div
      data-theme='flexoki-dark'
      className='w-full min-h-screen flex bg-background py-16'
    >
      <div className='w-0 lg:w-32 xl:w-48 h-full border-r-2 border-muted-foreground'></div>
      <div className='max-w-2xl px-4'>
        <h1 className='font-bold tracking-tight text-3xl lg:text-5xl mb-2 text-foreground'>
          {title}
        </h1>
        {author && (
          <div className='mb-6 uppercase text-muted-foreground'>{author}</div>
        )}
        <article className='prose prose-xl max-w-none'>
          <section dangerouslySetInnerHTML={{ __html: html ?? '' }}></section>
        </article>
      </div>
    </div>
  );
}
