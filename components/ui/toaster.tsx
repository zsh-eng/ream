import { cn, stripQueryParams } from '@/lib/utils';
import { BookmarkIcon } from 'lucide-react';
import { useEffect } from 'react';

const subscribers = new Set<{
  onBookmarked: (isBookmarked: boolean) => void;
}>();

function notifySubscribers(isBookmarked: boolean) {
  for (const subscriber of subscribers) {
    subscriber.onBookmarked(isBookmarked);
  }
}

// A basic toaster component
// I'm not using Sonner because it uses absolute positioning, whereas our
// shadow root requires us to use fixed positioning to display the toaster properly
export function Toaster() {
  const [currentBookmarked, setCurrentBookmarked] = useState<boolean | null>(
    null
  );
  const [previousDisplayedState, setPreviousDisplayedState] = useState<
    boolean | null
  >(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const listener = {
      onBookmarked: (isBookmarked: boolean) => {
        setCurrentBookmarked(isBookmarked);
        setPreviousDisplayedState(isBookmarked);
      },
    };

    subscribers.add(listener);
    return () => {
      subscribers.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      setCurrentBookmarked(null);
    }, 2000);
  }, [currentBookmarked]);

  const isVisible = currentBookmarked !== null;

  return (
    <div
      className={cn(
        'fixed bottom-[2em] right-[2em] p-[1em] w-[24em] translate-x-0 translate-y-0 transition-all bg-background border border-solid border-muted-foreground duration-200',
        !isVisible && 'opacity-0 pointer-events-none translate-y-[50%]'
      )}
    >
      <div className='flex items-center gap-[1em]'>
        <BookmarkIcon
          className='size-[1.5em] transition-all'
          fill={previousDisplayedState ? 'currentColor' : 'none'}
        />
        <span className='text-[1em]'>
          {previousDisplayedState ? 'Saved' : 'Removed from saved'}
        </span>

        {previousDisplayedState && (
          <button
            className='ml-auto text-[1em] underline text-foreground cursor-pointer'
            onClick={() => {
              const encodedURL = encodeURIComponent(
                stripQueryParams(window.location.href)
              );
              browser.runtime.sendMessage({
                type: 'NAVIGATE_SAVED_ARTICLE',
                articleUrl: encodedURL,
              });
            }}
          >
            View Article
          </button>
        )}
      </div>
    </div>
  );
}

export function toast(isBookmarked: boolean) {
  notifySubscribers(isBookmarked);
}
