import { cn } from '@/lib/utils';

type KeycapProps = {
  character: string;
  className?: string;
  absolute?: boolean;
};

export default function Keycap({
  character,
  className,
  absolute = true,
}: KeycapProps) {
  return (
    <div
      className={cn(
        'w-8 h-8 bg-muted-foreground p-0.5 pb-1 rounded-md',
        absolute &&
          'absolute top-0 translate-y-3 left-0 -translate-x-[120%] animate-bubble',
        className
      )}
    >
      <div className='text-sm text-foreground bg-background rounded-sm flex justify-center items-center h-full'>
        {character}
      </div>
    </div>
  );
}
