type AppProps = {
  // markdown: string;
  title?: string;
  html?: string;
  author?: string;
};

export default function App({ html, title, author }: AppProps) {
  return (
    <div className='w-full min-h-screen flex flex-col items-center bg-black py-32'>
      {/* <h1 className="font-bold tracking-tight text-5xl mb-6 text-white w-[720px] pl-12">{title}</h1> */}
      <div className='max-w-2xl'>
        <h1 className='font-bold tracking-tight text-5xl mb-2 text-white'>
          {title}
        </h1>
        {author && <div className='mb-6 uppercase text-gray-300'>{author}</div>}
        <article className='prose prose-invert'>
          <section dangerouslySetInnerHTML={{ __html: html ?? '' }}></section>
        </article>
      </div>
    </div>
  );
}
