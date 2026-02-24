import { LetterState } from '@/lib/game';
import { cn } from '@/lib/utils';
import { Delete } from 'lucide-react';

interface KeyboardProps {
  keyboardState: Record<string, LetterState>;
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export function Keyboard({ keyboardState, onKeyPress, disabled }: KeyboardProps) {
  const getKeyClass = (key: string) => {
    const state = keyboardState[key];
    if (state === 'correct') return 'key-correct';
    if (state === 'misplaced') return 'key-misplaced';
    if (state === 'incorrect') return 'key-incorrect';
    return '';
  };

  return (
    <div className="w-full flex flex-col items-center gap-1.5 sm:gap-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="w-full flex justify-center gap-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              disabled={disabled}
              className={cn(
                'key',
                (key === 'ENTER' || key === 'BACKSPACE') && 'key-wide',
                getKeyClass(key)
              )}
            >
              {key === 'BACKSPACE' ? (
                <Delete className="w-5 h-5" />
              ) : (
                key
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
