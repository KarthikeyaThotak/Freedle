import { WORDS_BY_LENGTH } from '@/lib/words';
import { DifficultyLevel, getDifficultyConfig } from '@/lib/managers/DifficultyManager';

const WORD_CATEGORY_MAP: Record<string, string> = {
  APPLE: 'Food',
  PIZZA: 'Food',
  BEACH: 'Nature',
  TIGER: 'Animal',
  OCEAN: 'Nature',
  CAMERA: 'Object',
  COFFEE: 'Food',
  DRAGON: 'Mythical',
  FREEDOM: 'Abstract',
  LIBERTY: 'Abstract',
};

function getDifficultySlice(words: string[], difficulty: DifficultyLevel): string[] {
  if (difficulty === 'easy') {
    return words.slice(0, Math.max(1, Math.floor(words.length * 0.7)));
  }

  if (difficulty === 'medium') {
    const start = Math.floor(words.length * 0.1);
    const end = Math.floor(words.length * 0.9);
    return words.slice(start, Math.max(start + 1, end));
  }

  const start = Math.floor(words.length * 0.3);
  return words.slice(start);
}

export function getWordPool(difficulty: DifficultyLevel, length: number): string[] {
  const baseWords = WORDS_BY_LENGTH[length] ?? [];
  if (!baseWords.length) {
    return [];
  }

  return getDifficultySlice(baseWords, difficulty);
}

export function getRandomWordForGame(difficulty: DifficultyLevel, length: number): string {
  const config = getDifficultyConfig(difficulty);
  if (!config.allowedLengths.includes(length)) {
    throw new Error(`Length ${length} is not allowed for ${difficulty}`);
  }

  const pool = getWordPool(difficulty, length);
  if (!pool.length) {
    throw new Error(`No words available for difficulty=${difficulty}, length=${length}`);
  }

  return pool[Math.floor(Math.random() * pool.length)].toUpperCase();
}

export function isValidGuessForLength(word: string, targetLength: number): boolean {
  const candidate = word.trim().toUpperCase();
  return /^[A-Z]+$/.test(candidate) && candidate.length === targetLength;
}

export function getWordCategory(word: string, difficulty: DifficultyLevel): string | null {
  const knownCategory = WORD_CATEGORY_MAP[word.toUpperCase()];
  if (knownCategory) {
    return knownCategory;
  }

  const config = getDifficultyConfig(difficulty);
  if (config.vocabularyTier === 'common') {
    return 'Everyday vocabulary';
  }

  if (config.vocabularyTier === 'moderate') {
    return 'General vocabulary';
  }

  return 'Advanced vocabulary';
}
