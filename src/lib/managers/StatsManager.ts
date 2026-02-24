import { DifficultyLevel } from '@/lib/managers/DifficultyManager';

const STORAGE_KEY = 'freedle.stats.v1';

export interface BucketStats {
  played: number;
  won: number;
}

export interface GameStatsSchema {
  version: 1;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  totalGuessesForWins: number;
  averageGuesses: number;
  winPercentage: number;
  byDifficulty: Record<DifficultyLevel, BucketStats>;
  byLength: Record<string, BucketStats>;
  lastUpdatedAt: string;
}

export interface GameResultPayload {
  won: boolean;
  guessesUsed: number;
  difficulty: DifficultyLevel;
  wordLength: number;
}

export function createDefaultStats(): GameStatsSchema {
  return {
    version: 1,
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalGuessesForWins: 0,
    averageGuesses: 0,
    winPercentage: 0,
    byDifficulty: {
      easy: { played: 0, won: 0 },
      medium: { played: 0, won: 0 },
      hard: { played: 0, won: 0 },
    },
    byLength: {},
    lastUpdatedAt: new Date().toISOString(),
  };
}

export function loadStats(): GameStatsSchema {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultStats();
    }

    const parsed = JSON.parse(raw) as GameStatsSchema;
    if (!parsed.version || parsed.version !== 1) {
      return createDefaultStats();
    }

    return {
      ...createDefaultStats(),
      ...parsed,
      byDifficulty: {
        ...createDefaultStats().byDifficulty,
        ...parsed.byDifficulty,
      },
      byLength: parsed.byLength || {},
    };
  } catch {
    return createDefaultStats();
  }
}

export function persistStats(stats: GameStatsSchema): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function resetStats(): GameStatsSchema {
  const fresh = createDefaultStats();
  persistStats(fresh);
  return fresh;
}

export function recordGameResult(previous: GameStatsSchema, result: GameResultPayload): GameStatsSchema {
  const next = structuredClone(previous);

  next.gamesPlayed += 1;
  next.byDifficulty[result.difficulty].played += 1;

  const lengthKey = String(result.wordLength);
  if (!next.byLength[lengthKey]) {
    next.byLength[lengthKey] = { played: 0, won: 0 };
  }
  next.byLength[lengthKey].played += 1;

  if (result.won) {
    next.gamesWon += 1;
    next.currentStreak += 1;
    next.maxStreak = Math.max(next.maxStreak, next.currentStreak);
    next.totalGuessesForWins += result.guessesUsed;
    next.byDifficulty[result.difficulty].won += 1;
    next.byLength[lengthKey].won += 1;
  } else {
    next.currentStreak = 0;
  }

  next.winPercentage = next.gamesPlayed === 0 ? 0 : Math.round((next.gamesWon / next.gamesPlayed) * 100);
  next.averageGuesses = next.gamesWon === 0 ? 0 : Number((next.totalGuessesForWins / next.gamesWon).toFixed(2));
  next.lastUpdatedAt = new Date().toISOString();

  persistStats(next);
  return next;
}
