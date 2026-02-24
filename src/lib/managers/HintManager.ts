import { TileData } from '@/lib/game';

export interface HintState {
  enabled: boolean;
  usedDefinition: boolean;
  usedCategory: boolean;
  revealHintsUsed: number;
  maxRevealHints: number;
}

export function createHintState(enabled = true): HintState {
  return {
    enabled,
    usedDefinition: false,
    usedCategory: false,
    revealHintsUsed: 0,
    maxRevealHints: 1,
  };
}

export function toggleHintState(current: HintState): HintState {
  return {
    ...current,
    enabled: !current.enabled,
  };
}

export function canRevealLetterHint(hints: HintState): boolean {
  return hints.enabled && hints.revealHintsUsed < hints.maxRevealHints;
}

function findAlreadySolvedColumns(guesses: TileData[][]): Set<number> {
  const solved = new Set<number>();

  guesses.forEach((row) => {
    row.forEach((tile, index) => {
      if (tile.state === 'correct') {
        solved.add(index);
      }
    });
  });

  return solved;
}

export function pickRevealLetterPosition(targetWord: string, guesses: TileData[][]): number | null {
  const solved = findAlreadySolvedColumns(guesses);
  const available = targetWord
    .split('')
    .map((_, index) => index)
    .filter(index => !solved.has(index));

  if (!available.length) {
    return null;
  }

  return available[Math.floor(Math.random() * available.length)];
}
