import { DifficultyLevel } from '@/lib/managers/DifficultyManager';
import { GameState, createEmptyGrid } from '@/lib/game';

export interface NewGameConfig {
  targetWord: string;
  difficulty: DifficultyLevel;
  wordLength: number;
  maxAttempts: number;
}

export function createInitialGameState(config: NewGameConfig): GameState {
  return {
    targetWord: config.targetWord,
    difficulty: config.difficulty,
    maxAttempts: config.maxAttempts,
    wordLength: config.wordLength,
    guesses: createEmptyGrid(config.wordLength, config.maxAttempts),
    currentRow: 0,
    currentCol: 0,
    gameStatus: 'playing',
    keyboardState: {},
    isShaking: false,
    message: '',
  };
}
