import { cn } from '@/lib/utils';

interface MessageProps {
  message: string;
  visible: boolean;
}

export function Message({ message, visible }: MessageProps) {
  return (
    <div
      className={cn(
        'fixed top-20 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 z-50',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      )}
    >
      {message}
    </div>
  );
}
