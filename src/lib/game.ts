export type LetterState = 'empty' | 'filled' | 'correct' | 'misplaced' | 'incorrect';

export interface TileData {
  letter: string;
  state: LetterState;
  isRevealing?: boolean;
  delay?: number;
}

export interface GameState {
  targetWord: string;
  wordLength: number;
  guesses: TileData[][];
  currentRow: number;
  currentCol: number;
  gameStatus: 'playing' | 'won' | 'lost';
  keyboardState: Record<string, LetterState>;
  isShaking: boolean;
  message: string;
}

export const MAX_GUESSES = 6;

export function createEmptyGrid(wordLength: number, rows: number = MAX_GUESSES): TileData[][] {
  return Array(rows).fill(null).map(() =>
    Array(wordLength).fill(null).map(() => ({
      letter: '',
      state: 'empty' as LetterState,
    }))
  );
}

export function evaluateGuess(guess: string, target: string): LetterState[] {
  const length = target.length;
  const result: LetterState[] = Array(length).fill('incorrect');
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  const used = Array(length).fill(false);

  // First pass: mark correct letters
  for (let i = 0; i < length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }

  // Second pass: mark misplaced letters
  for (let i = 0; i < length; i++) {
    if (result[i] === 'correct') continue;
    
    for (let j = 0; j < length; j++) {
      if (!used[j] && guessLetters[i] === targetLetters[j]) {
        result[i] = 'misplaced';
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

export function updateKeyboardState(
  currentState: Record<string, LetterState>,
  guess: string,
  states: LetterState[]
): Record<string, LetterState> {
  const newState = { ...currentState };
  
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const newLetterState = states[i];
    const currentLetterState = newState[letter];

    // Priority: correct > misplaced > incorrect
    if (newLetterState === 'correct') {
      newState[letter] = 'correct';
    } else if (newLetterState === 'misplaced' && currentLetterState !== 'correct') {
      newState[letter] = 'misplaced';
    } else if (!currentLetterState) {
      newState[letter] = newLetterState;
    }
  }

  return newState;
}
