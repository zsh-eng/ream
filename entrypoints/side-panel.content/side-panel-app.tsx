import { useSidePanelMessage } from '@/hooks/use-side-panel-message';
import { cn } from '@/lib/utils';

export default function SidePanelApp() {
  const { isOpen, setIsOpen } = useSidePanelMessage();
  return (
    <div
      className={cn(
        'bg-red-500 fixed top-0 right-0 w-80 h-80',
        !isOpen && '-right-full'
      )}
    >
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
    </div>
  );
}
