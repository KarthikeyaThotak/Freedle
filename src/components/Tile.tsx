import { TileData } from '@/lib/game';
import { cn } from '@/lib/utils';

interface TileProps {
  data: TileData;
  isShaking?: boolean;
  isBouncing?: boolean;
  bounceDelay?: number;
}

export function Tile({ data, isShaking, isBouncing, bounceDelay = 0 }: TileProps) {
  const { letter, state, isRevealing, delay = 0 } = data;

  const stateClasses = {
    empty: '',
    filled: 'tile-filled',
    correct: 'tile-correct',
    misplaced: 'tile-misplaced',
    incorrect: 'tile-incorrect',
  };

  return (
    <div
      className={cn(
        'tile',
        stateClasses[state],
        isRevealing && 'tile-reveal',
        isShaking && 'tile-shake',
        isBouncing && 'tile-bounce'
      )}
      style={{
        animationDelay: isRevealing ? `${delay}ms` : isBouncing ? `${bounceDelay}ms` : '0ms',
      }}
    >
      {letter}
    </div>
  );
}
