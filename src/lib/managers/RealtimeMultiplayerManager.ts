import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  runTransaction,
  off,
  get,
  type Database,
  type DataSnapshot,
} from 'firebase/database';
import { evaluateGuess } from '@/lib/game';
import { DifficultyLevel } from '@/lib/managers/DifficultyManager';

const ROOM_PARAM = 'room';
const PLAYER_KEY = 'freedle.player.id';
const PLAYER_NAME_KEY = 'freedle.player.name';

export interface CoopRoomConfig {
  targetWord: string;
  difficulty: DifficultyLevel;
  wordLength: number;
  maxAttempts: number;
}

export interface CoopMember {
  id: string;
  name: string;
  guessesSubmitted: number;
  lastSeenAt: number;
}

export interface CoopRoomData {
  hostId: string;
  config: CoopRoomConfig;
  guesses: string[];
  status: 'playing' | 'won' | 'lost';
  winnerId?: string;
  createdAt: number;
  updatedAt: number;
  members: Record<string, CoopMember>;
}

interface SubmitGuessResult {
  accepted: boolean;
  reason?: string;
}

let firebaseApp: FirebaseApp | null = null;
let database: Database | null = null;

function getFirebaseConfig() {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const hasRequiredConfig = !!config.apiKey && !!config.projectId && !!config.databaseURL;
  return { config, hasRequiredConfig };
}

function ensureFirebase(): Database {
  if (database) {
    return database;
  }

  const { config, hasRequiredConfig } = getFirebaseConfig();
  if (!hasRequiredConfig) {
    throw new Error('Realtime multiplayer is not configured. Add VITE_FIREBASE_* variables.');
  }

  firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(config);
  database = getDatabase(firebaseApp);
  return database;
}

function nowTimestamp(): number {
  return Date.now();
}

export function isRealtimeConfigured(): boolean {
  return getFirebaseConfig().hasRequiredConfig;
}

export function getOrCreatePlayerIdentity(): { playerId: string; playerName: string } {
  const existingId = localStorage.getItem(PLAYER_KEY);
  const existingName = localStorage.getItem(PLAYER_NAME_KEY);

  if (existingId && existingName) {
    return {
      playerId: existingId,
      playerName: existingName,
    };
  }

  const playerId = `p_${Math.random().toString(36).slice(2, 10)}`;
  const playerName = `Player-${playerId.slice(-4).toUpperCase()}`;

  localStorage.setItem(PLAYER_KEY, playerId);
  localStorage.setItem(PLAYER_NAME_KEY, playerName);

  return { playerId, playerName };
}

export async function createCoopRoom(config: CoopRoomConfig, playerId: string, playerName: string): Promise<string> {
  const db = ensureFirebase();
  const roomsRef = ref(db, 'rooms');
  const roomRef = push(roomsRef);

  const roomData: CoopRoomData = {
    hostId: playerId,
    config,
    guesses: [],
    status: 'playing',
    createdAt: nowTimestamp(),
    updatedAt: nowTimestamp(),
    members: {
      [playerId]: {
        id: playerId,
        name: playerName,
        guessesSubmitted: 0,
        lastSeenAt: nowTimestamp(),
      },
    },
  };

  await set(roomRef, roomData);
  return roomRef.key as string;
}

export async function joinCoopRoom(roomId: string, playerId: string, playerName: string): Promise<void> {
  const db = ensureFirebase();
  const roomRef = ref(db, `rooms/${roomId}`);

  const snapshot = await get(roomRef);
  if (!snapshot.exists()) {
    throw new Error('Room not found');
  }

  await runTransaction(roomRef, (current: CoopRoomData | null) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      updatedAt: nowTimestamp(),
      members: {
        ...(current.members || {}),
        [playerId]: {
          id: playerId,
          name: playerName,
          guessesSubmitted: current.members?.[playerId]?.guessesSubmitted ?? 0,
          lastSeenAt: nowTimestamp(),
        },
      },
    };
  });
}

export function subscribeToRoom(roomId: string, onUpdate: (room: CoopRoomData | null) => void): () => void {
  const db = ensureFirebase();
  const roomRef = ref(db, `rooms/${roomId}`);

  const unsubscribe = onValue(roomRef, (snapshot: DataSnapshot) => {
    if (!snapshot.exists()) {
      onUpdate(null);
      return;
    }

    onUpdate(snapshot.val() as CoopRoomData);
  });

  return () => {
    off(roomRef);
    unsubscribe();
  };
}

export async function submitCoopGuess(roomId: string, playerId: string, guessInput: string): Promise<SubmitGuessResult> {
  const db = ensureFirebase();
  const roomRef = ref(db, `rooms/${roomId}`);
  const guess = guessInput.trim().toUpperCase();

  const result = await runTransaction(roomRef, (current: CoopRoomData | null) => {
    if (!current) {
      return current;
    }

    if (current.status !== 'playing') {
      return current;
    }

    const { config } = current;
    if (guess.length !== config.wordLength || !/^[A-Z]+$/.test(guess)) {
      return current;
    }

    const guesses = [...(current.guesses || [])];
    if (guesses.length >= config.maxAttempts) {
      return {
        ...current,
        status: 'lost',
        updatedAt: nowTimestamp(),
      };
    }

    guesses.push(guess);

    const isWin = guess === config.targetWord;
    const isLoss = !isWin && guesses.length >= config.maxAttempts;

    const nextStatus: CoopRoomData['status'] = isWin ? 'won' : isLoss ? 'lost' : 'playing';

    return {
      ...current,
      guesses,
      status: nextStatus,
      winnerId: isWin ? playerId : current.winnerId,
      updatedAt: nowTimestamp(),
      members: {
        ...(current.members || {}),
        [playerId]: {
          id: playerId,
          name: current.members?.[playerId]?.name || `Player-${playerId.slice(-4).toUpperCase()}`,
          guessesSubmitted: (current.members?.[playerId]?.guessesSubmitted || 0) + 1,
          lastSeenAt: nowTimestamp(),
        },
      },
    };
  });

  if (!result.snapshot.exists()) {
    return { accepted: false, reason: 'Room no longer exists' };
  }

  const latest = result.snapshot.val() as CoopRoomData;
  const included = (latest.guesses || []).includes(guess);
  if (!included) {
    return { accepted: false, reason: 'Guess rejected by room validation' };
  }

  return { accepted: true };
}

export async function startNewCoopRound(roomId: string, playerId: string): Promise<SubmitGuessResult> {
  const db = ensureFirebase();
  const roomRef = ref(db, `rooms/${roomId}`);

  const result = await runTransaction(roomRef, (current: CoopRoomData | null) => {
    if (!current) {
      return current;
    }

    if (current.hostId !== playerId) {
      return current;
    }

    const resetMembers = Object.fromEntries(
      Object.entries(current.members || {}).map(([memberId, member]) => [
        memberId,
        {
          ...member,
          guessesSubmitted: 0,
          lastSeenAt: nowTimestamp(),
        },
      ])
    );

    return {
      ...current,
      guesses: [],
      status: 'playing',
      winnerId: undefined,
      updatedAt: nowTimestamp(),
      members: resetMembers,
    };
  });

  if (!result.snapshot.exists()) {
    return { accepted: false, reason: 'Room no longer exists' };
  }

  const latest = result.snapshot.val() as CoopRoomData;
  if (latest.hostId !== playerId) {
    return { accepted: false, reason: 'Only host can start a new round' };
  }

  if ((latest.guesses || []).length !== 0 || latest.status !== 'playing') {
    return { accepted: false, reason: 'Failed to reset room state' };
  }

  return { accepted: true };
}

export function buildCoopRoomLink(roomId: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set(ROOM_PARAM, roomId);
  return url.toString();
}

export function readCoopRoomFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(ROOM_PARAM);
}

export function evaluateKeyboardFromGuesses(targetWord: string, guesses: string[]): Record<string, 'correct' | 'misplaced' | 'incorrect'> {
  return guesses.reduce<Record<string, 'correct' | 'misplaced' | 'incorrect'>>((acc, guess) => {
    const states = evaluateGuess(guess, targetWord);

    states.forEach((state, index) => {
      const letter = guess[index];
      if (!letter) return;

      if (state === 'correct') {
        acc[letter] = 'correct';
      } else if (state === 'misplaced' && acc[letter] !== 'correct') {
        acc[letter] = 'misplaced';
      } else if (!acc[letter] && state === 'incorrect') {
        acc[letter] = 'incorrect';
      }
    });

    return acc;
  }, {});
}

export function getRealtimeEnvTemplate(): string {
  return [
    'VITE_FIREBASE_API_KEY=',
    'VITE_FIREBASE_AUTH_DOMAIN=',
    'VITE_FIREBASE_DATABASE_URL=',
    'VITE_FIREBASE_PROJECT_ID=',
    'VITE_FIREBASE_STORAGE_BUCKET=',
    'VITE_FIREBASE_MESSAGING_SENDER_ID=',
    'VITE_FIREBASE_APP_ID=',
  ].join('\n');
}
