import { DifficultyLevel } from '@/lib/managers/DifficultyManager';

export interface ChallengePayload {
  word: string;
  difficulty: DifficultyLevel;
  length: number;
  attempts: number;
  createdAt: string;
}

const CHALLENGE_PARAM = 'challenge';

function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}

export function encodeChallenge(payload: ChallengePayload): string {
  return toBase64Url(JSON.stringify(payload));
}

export function decodeChallenge(encoded: string): ChallengePayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded)) as ChallengePayload;
    if (!parsed.word || !parsed.length || !parsed.difficulty || !parsed.attempts) {
      return null;
    }
    return {
      ...parsed,
      word: parsed.word.toUpperCase(),
    };
  } catch {
    return null;
  }
}

export function buildChallengeLink(payload: ChallengePayload): string {
  const url = new URL(window.location.href);
  url.searchParams.set(CHALLENGE_PARAM, encodeChallenge(payload));
  return url.toString();
}

export function readChallengeFromUrl(): ChallengePayload | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get(CHALLENGE_PARAM);
  if (!encoded) {
    return null;
  }

  return decodeChallenge(encoded);
}
