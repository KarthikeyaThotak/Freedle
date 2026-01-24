import { TileData } from '@/lib/game';
import { Tile } from './Tile';
import { cn } from '@/lib/utils';

interface GridProps {
  guesses: TileData[][];
  currentRow: number;
  isShaking: boolean;
  gameStatus: 'playing' | 'won' | 'lost';
}

export function Grid({ guesses, currentRow, isShaking, gameStatus }: GridProps) {
  const wordLength = guesses[0]?.length || 5;
  
  // Dynamic sizing based on word length
  const getTileSize = () => {
    if (wordLength <= 4) return 'tile-lg';
    if (wordLength <= 5) return 'tile-md';
    if (wordLength <= 6) return 'tile-sm';
    return 'tile-xs';
  };

  return (
    <div 
      className={cn(
        "flex flex-col gap-1.5 transition-all duration-300",
        getTileSize()
      )}
    >
      {guesses.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 justify-center">
          {row.map((tile, colIndex) => (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              data={tile}
              isShaking={isShaking && rowIndex === currentRow}
              isBouncing={
                gameStatus === 'won' &&
                rowIndex === currentRow - 1 &&
                tile.state === 'correct'
              }
              bounceDelay={colIndex * 100}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
