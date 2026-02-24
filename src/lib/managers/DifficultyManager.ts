export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  id: DifficultyLevel;
  label: string;
  description: string;
  attempts: number;
  allowedLengths: number[];
  defaultLength: number;
  vocabularyTier: 'common' | 'moderate' | 'rare';
}

const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'Easy',
    description: '4-letter common vocabulary',
    attempts: 6,
    allowedLengths: [4],
    defaultLength: 4,
    vocabularyTier: 'common',
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    description: '5-letter moderate vocabulary',
    attempts: 6,
    allowedLengths: [5],
    defaultLength: 5,
    vocabularyTier: 'moderate',
  },
  hard: {
    id: 'hard',
    label: 'Hard',
    description: '6+ letter rare vocabulary',
    attempts: 5,
    allowedLengths: [6, 7],
    defaultLength: 6,
    vocabularyTier: 'rare',
  },
};

export function getDifficultyConfig(difficulty: DifficultyLevel): DifficultyConfig {
  return DIFFICULTY_CONFIGS[difficulty];
}

export function getAllDifficultyConfigs(): DifficultyConfig[] {
  return [DIFFICULTY_CONFIGS.easy, DIFFICULTY_CONFIGS.medium, DIFFICULTY_CONFIGS.hard];
}

export function isLengthAllowedForDifficulty(difficulty: DifficultyLevel, length: number): boolean {
  return DIFFICULTY_CONFIGS[difficulty].allowedLengths.includes(length);
}

export function getDefaultLengthForDifficulty(difficulty: DifficultyLevel): number {
  return DIFFICULTY_CONFIGS[difficulty].defaultLength;
}
