import { useState, useCallback, useEffect, useRef } from 'react';
import { createEmptyGrid, evaluateGuess, updateKeyboardState, type GameState } from '@/lib/game';
import {
  DifficultyLevel,
  getDefaultLengthForDifficulty,
  getDifficultyConfig,
  isLengthAllowedForDifficulty,
} from '@/lib/managers/DifficultyManager';
import {
  getRandomWordForGame,
  getWordCategory,
  isValidGuessForLength,
} from '@/lib/managers/WordEngine';
import {
  createDefaultStats,
  loadStats,
  recordGameResult,
  resetStats as clearStats,
  type GameStatsSchema,
} from '@/lib/managers/StatsManager';
import {
  createHintState,
  canRevealLetterHint,
  pickRevealLetterPosition,
  toggleHintState,
  type HintState,
} from '@/lib/managers/HintManager';
import {
  buildChallengeLink,
  readChallengeFromUrl,
  type ChallengePayload,
} from '@/lib/managers/MultiplayerManager';
import {
  buildCoopRoomLink,
  createCoopRoom,
  evaluateKeyboardFromGuesses,
  getOrCreatePlayerIdentity,
  isRealtimeConfigured,
  joinCoopRoom,
  readCoopRoomFromUrl,
  startNewCoopRound,
  submitCoopGuess,
  subscribeToRoom,
  type CoopMember,
  type CoopRoomData,
} from '@/lib/managers/RealtimeMultiplayerManager';
import { createInitialGameState } from '@/lib/managers/GameStateManager';
import { fetchWordDefinition } from '@/lib/dictionary';

const REVEAL_DELAY = 300;
const MESSAGE_DURATION = 2200;

type GameModeSource = 'standard' | 'challenge' | 'co-op';

interface StartGameOptions {
  difficulty: DifficultyLevel;
  wordLength: number;
  targetWord?: string;
  maxAttempts?: number;
  source?: GameModeSource;
}

function createPendingGameState(): GameState {
  return {
    targetWord: '',
    difficulty: 'medium',
    maxAttempts: 6,
    wordLength: 5,
    guesses: [],
    currentRow: 0,
    currentCol: 0,
    gameStatus: 'playing',
    keyboardState: {},
    isShaking: false,
    message: '',
  };
}

function mapRoomToGameState(room: CoopRoomData, previousMessage = ''): GameState {
  const { config, guesses, status } = room;
  const grid = createEmptyGrid(config.wordLength, config.maxAttempts);
  const keyboardState = evaluateKeyboardFromGuesses(config.targetWord, guesses);

  guesses.forEach((guess, rowIndex) => {
    const states = evaluateGuess(guess, config.targetWord);
    for (let column = 0; column < config.wordLength; column += 1) {
      grid[rowIndex][column] = {
        letter: guess[column],
        state: states[column],
      };
    }
  });

  return {
    targetWord: config.targetWord,
    difficulty: config.difficulty,
    maxAttempts: config.maxAttempts,
    wordLength: config.wordLength,
    guesses: grid,
    currentRow: Math.min(guesses.length, config.maxAttempts),
    currentCol: 0,
    gameStatus: status,
    keyboardState,
    isShaking: false,
    message: previousMessage,
  };
}

export function useFreedleGame() {
  const [gameState, setGameState] = useState<GameState>(createPendingGameState);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [selectedWordLength, setSelectedWordLength] = useState<number>(5);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSource, setGameSource] = useState<GameModeSource>('standard');

  const [stats, setStats] = useState<GameStatsSchema>(() => createDefaultStats());
  const [hintState, setHintState] = useState<HintState>(() => createHintState(true));
  const [hintDefinition, setHintDefinition] = useState<string | null>(null);
  const [hintCategory, setHintCategory] = useState<string | null>(null);

  const [coOpRoomId, setCoOpRoomId] = useState<string | null>(null);
  const [coOpMembers, setCoOpMembers] = useState<CoopMember[]>([]);
  const [coOpPlayerId, setCoOpPlayerId] = useState<string | null>(null);
  const [coOpPlayerName, setCoOpPlayerName] = useState<string | null>(null);
  const [coOpConnected, setCoOpConnected] = useState(false);
  const [coOpHostId, setCoOpHostId] = useState<string | null>(null);

  const statsRecordedRef = useRef(false);
  const roomUnsubscribeRef = useRef<(() => void) | null>(null);

  const realtimeEnabled = isRealtimeConfigured();

  const showTemporaryMessage = useCallback((message: string) => {
    setGameState(prev => ({ ...prev, message }));
    setShowMessage(true);
    window.setTimeout(() => setShowMessage(false), MESSAGE_DURATION);
  }, []);

  const applyRoomSnapshot = useCallback((room: CoopRoomData | null) => {
    if (!room) {
      setCoOpConnected(false);
      setCoOpRoomId(null);
      setCoOpMembers([]);
      showTemporaryMessage('Room not found or closed');
      return;
    }

    setGameState(prev => mapRoomToGameState(room, prev.message));
    setSelectedDifficulty(room.config.difficulty);
    setSelectedWordLength(room.config.wordLength);
    setGameStarted(true);
    setGameSource('co-op');
    setCoOpHostId(room.hostId);

    const members = Object.values(room.members || {}).sort((left, right) => {
      if (right.guessesSubmitted !== left.guessesSubmitted) {
        return right.guessesSubmitted - left.guessesSubmitted;
      }
      return left.name.localeCompare(right.name);
    });

    setCoOpMembers(members);
    setCoOpConnected(true);
  }, [showTemporaryMessage]);

  const attachRoomSubscription = useCallback((roomId: string) => {
    if (roomUnsubscribeRef.current) {
      roomUnsubscribeRef.current();
      roomUnsubscribeRef.current = null;
    }

    roomUnsubscribeRef.current = subscribeToRoom(roomId, applyRoomSnapshot);
  }, [applyRoomSnapshot]);

  const joinRealtimeRoom = useCallback(async (roomId: string) => {
    if (!realtimeEnabled) {
      showTemporaryMessage('Realtime mode requires Firebase env setup');
      return false;
    }

    try {
      setIsLoading(true);
      const identity = getOrCreatePlayerIdentity();
      setCoOpPlayerId(identity.playerId);
      setCoOpPlayerName(identity.playerName);

      await joinCoopRoom(roomId, identity.playerId, identity.playerName);
      setCoOpRoomId(roomId);
      attachRoomSubscription(roomId);
      showTemporaryMessage('Joined co-op room');
      return true;
    } catch (error) {
      console.error('Failed to join co-op room:', error);
      showTemporaryMessage('Failed to join room');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [attachRoomSubscription, realtimeEnabled, showTemporaryMessage]);

  useEffect(() => {
    setStats(loadStats());

    const challenge = readChallengeFromUrl();
    if (challenge) {
      const sanitizedDifficulty = challenge.difficulty;
      const sanitizedLength = challenge.length;

      setSelectedDifficulty(sanitizedDifficulty);
      setSelectedWordLength(sanitizedLength);

      startGame({
        difficulty: sanitizedDifficulty,
        wordLength: sanitizedLength,
        targetWord: challenge.word,
        maxAttempts: challenge.attempts,
        source: 'challenge',
      });
      return;
    }

    const roomId = readCoopRoomFromUrl();
    if (roomId) {
      joinRealtimeRoom(roomId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (roomUnsubscribeRef.current) {
        roomUnsubscribeRef.current();
        roomUnsubscribeRef.current = null;
      }
    };
  }, []);

  const startGame = useCallback(async (options?: StartGameOptions) => {
    const difficulty = options?.difficulty ?? selectedDifficulty;
    const wordLength = options?.wordLength ?? selectedWordLength;

    if (!isLengthAllowedForDifficulty(difficulty, wordLength)) {
      showTemporaryMessage('Length is not allowed for this difficulty');
      return;
    }

    if (roomUnsubscribeRef.current) {
      roomUnsubscribeRef.current();
      roomUnsubscribeRef.current = null;
    }

    setCoOpConnected(false);
    setCoOpRoomId(null);
    setCoOpMembers([]);
    setCoOpHostId(null);

    setIsLoading(true);
    setShowMessage(false);
    setIsRevealing(false);
    setHintState(createHintState(true));
    setHintDefinition(null);
    setHintCategory(null);
    statsRecordedRef.current = false;

    try {
      const difficultyConfig = getDifficultyConfig(difficulty);
      const targetWord = options?.targetWord ?? getRandomWordForGame(difficulty, wordLength);
      const maxAttempts = options?.maxAttempts ?? difficultyConfig.attempts;

      const nextState = createInitialGameState({
        targetWord: targetWord.toUpperCase(),
        difficulty,
        wordLength,
        maxAttempts,
      });

      setSelectedDifficulty(difficulty);
      setSelectedWordLength(wordLength);
      setGameSource(options?.source ?? 'standard');
      setGameState(nextState);
      setGameStarted(true);
    } catch (error) {
      console.error('Failed to start game:', error);
      showTemporaryMessage('Failed to create game. Try another mode.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDifficulty, selectedWordLength, showTemporaryMessage]);

  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    if (gameState.gameStatus === 'playing' || statsRecordedRef.current) {
      return;
    }

    const won = gameState.gameStatus === 'won';
    const guessesUsed = won ? gameState.currentRow : gameState.maxAttempts;

    setStats(prev => recordGameResult(prev, {
      won,
      guessesUsed,
      difficulty: gameState.difficulty,
      wordLength: gameState.wordLength,
    }));

    statsRecordedRef.current = true;
  }, [gameStarted, gameState]);

  const addLetter = useCallback((letter: string) => {
    if (gameState.gameStatus !== 'playing' || isRevealing || !gameStarted) return;
    if (gameState.currentCol >= gameState.wordLength) return;
    if (gameState.currentRow >= gameState.maxAttempts) return;

    setGameState(prev => {
      const newGuesses = [...prev.guesses];
      newGuesses[prev.currentRow] = [...newGuesses[prev.currentRow]];
      newGuesses[prev.currentRow][prev.currentCol] = {
        letter: letter.toUpperCase(),
        state: 'filled',
      };

      return {
        ...prev,
        guesses: newGuesses,
        currentCol: prev.currentCol + 1,
      };
    });
  }, [gameState.gameStatus, gameState.currentCol, gameState.wordLength, gameState.currentRow, gameState.maxAttempts, gameStarted, isRevealing]);

  const removeLetter = useCallback(() => {
    if (gameState.gameStatus !== 'playing' || isRevealing || !gameStarted) return;
    if (gameState.currentCol === 0) return;

    setGameState(prev => {
      const newGuesses = [...prev.guesses];
      newGuesses[prev.currentRow] = [...newGuesses[prev.currentRow]];
      newGuesses[prev.currentRow][prev.currentCol - 1] = {
        letter: '',
        state: 'empty',
      };

      return {
        ...prev,
        guesses: newGuesses,
        currentCol: prev.currentCol - 1,
      };
    });
  }, [gameState.gameStatus, gameState.currentCol, gameStarted, isRevealing]);

  const submitGuess = useCallback(async () => {
    if (gameState.gameStatus !== 'playing' || isRevealing || !gameStarted) return;

    if (gameState.currentCol !== gameState.wordLength) {
      setGameState(prev => ({ ...prev, isShaking: true }));
      showTemporaryMessage('Not enough letters');
      window.setTimeout(() => {
        setGameState(prev => ({ ...prev, isShaking: false }));
      }, 450);
      return;
    }

    const guess = gameState.guesses[gameState.currentRow]
      .map(tile => tile.letter)
      .join('');

    if (!isValidGuessForLength(guess, gameState.wordLength)) {
      setGameState(prev => ({ ...prev, isShaking: true }));
      showTemporaryMessage('Not in word list');
      window.setTimeout(() => {
        setGameState(prev => ({ ...prev, isShaking: false }));
      }, 450);
      return;
    }

    if (gameSource === 'co-op' && coOpRoomId && coOpPlayerId) {
      const result = await submitCoopGuess(coOpRoomId, coOpPlayerId, guess);
      if (!result.accepted) {
        showTemporaryMessage(result.reason || 'Guess not accepted');
      }
      return;
    }

    setIsRevealing(true);
    const states = evaluateGuess(guess, gameState.targetWord);

    setGameState(prev => {
      const newGuesses = [...prev.guesses];
      newGuesses[prev.currentRow] = newGuesses[prev.currentRow].map((tile, index) => ({
        ...tile,
        state: states[index],
        isRevealing: true,
        delay: index * REVEAL_DELAY,
      }));
      return { ...prev, guesses: newGuesses };
    });

    const revealDuration = gameState.wordLength * REVEAL_DELAY + 280;

    window.setTimeout(() => {
      setGameState(prev => {
        const cleanedGuesses = prev.guesses.map(row =>
          row.map(tile => ({ ...tile, isRevealing: false }))
        );

        const nextKeyboardState = updateKeyboardState(prev.keyboardState, guess, states);
        const isWin = guess === prev.targetWord;
        const didExhaustRows = prev.currentRow === prev.maxAttempts - 1;
        const isLoss = !isWin && didExhaustRows;

        const nextStatus = isWin ? 'won' : isLoss ? 'lost' : 'playing';

        return {
          ...prev,
          guesses: cleanedGuesses,
          currentRow: prev.currentRow + 1,
          currentCol: 0,
          gameStatus: nextStatus,
          keyboardState: nextKeyboardState,
        };
      });

      setIsRevealing(false);

      const isWin = guess === gameState.targetWord;
      if (isWin) {
        const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
        showTemporaryMessage(messages[gameState.currentRow] || 'Nice!');
      } else if (gameState.currentRow === gameState.maxAttempts - 1) {
        showTemporaryMessage(gameState.targetWord);
      }
    }, revealDuration);
  }, [
    gameStarted,
    gameState,
    isRevealing,
    showTemporaryMessage,
    gameSource,
    coOpRoomId,
    coOpPlayerId,
  ]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'ENTER') {
      submitGuess();
      return;
    }

    if (key === 'BACKSPACE') {
      removeLetter();
      return;
    }

    if (/^[A-Z]$/.test(key)) {
      addLetter(key);
    }
  }, [addLetter, removeLetter, submitGuess]);

  const resetGame = useCallback(async () => {
    if (gameSource === 'co-op') {
      showTemporaryMessage('Create a new room for a fresh co-op round');
      return;
    }

    if (!gameStarted) {
      await startGame({
        difficulty: selectedDifficulty,
        wordLength: selectedWordLength,
      });
      return;
    }

    await startGame({
      difficulty: gameState.difficulty,
      wordLength: gameState.wordLength,
      source: gameSource,
    });
  }, [gameSource, gameStarted, gameState.difficulty, gameState.wordLength, selectedDifficulty, selectedWordLength, showTemporaryMessage, startGame]);

  const useDefinitionHint = useCallback(async () => {
    if (!hintState.enabled || hintState.usedDefinition || !gameStarted) {
      return;
    }

    try {
      const definition = await fetchWordDefinition(gameState.targetWord);
      setHintDefinition(definition);
      setHintState(prev => ({ ...prev, usedDefinition: true }));
      showTemporaryMessage('Definition hint unlocked');
    } catch {
      showTemporaryMessage('Definition unavailable');
    }
  }, [gameStarted, gameState.targetWord, hintState.enabled, hintState.usedDefinition, showTemporaryMessage]);

  const useCategoryHint = useCallback(() => {
    if (!hintState.enabled || hintState.usedCategory || !gameStarted) {
      return;
    }

    const category = getWordCategory(gameState.targetWord, gameState.difficulty);
    if (category) {
      setHintCategory(category);
      setHintState(prev => ({ ...prev, usedCategory: true }));
      showTemporaryMessage('Category hint unlocked');
      return;
    }

    showTemporaryMessage('Category unavailable');
  }, [gameStarted, gameState.difficulty, gameState.targetWord, hintState.enabled, hintState.usedCategory, showTemporaryMessage]);

  const useRevealLetterHint = useCallback(() => {
    if (gameSource === 'co-op') {
      showTemporaryMessage('Reveal-letter hint is disabled in co-op rooms');
      return;
    }

    if (!gameStarted || gameState.gameStatus !== 'playing') {
      return;
    }

    if (!canRevealLetterHint(hintState)) {
      showTemporaryMessage('No reveal hints left');
      return;
    }

    const position = pickRevealLetterPosition(gameState.targetWord, gameState.guesses);
    if (position === null) {
      showTemporaryMessage('No hidden letters to reveal');
      return;
    }

    setGameState(prev => {
      const newGuesses = prev.guesses.map(row => [...row]);
      const revealLetter = prev.targetWord[position];

      if (newGuesses[prev.currentRow]) {
        newGuesses[prev.currentRow][position] = {
          letter: revealLetter,
          state: 'filled',
        };
      }

      const nextRow = prev.currentRow + 1;
      if (newGuesses[nextRow]) {
        newGuesses[nextRow][position] = {
          letter: revealLetter,
          state: 'filled',
        };
      }

      const isLoss = nextRow >= prev.maxAttempts;

      return {
        ...prev,
        guesses: newGuesses,
        currentRow: isLoss ? prev.currentRow : nextRow,
        currentCol: 0,
        gameStatus: isLoss ? 'lost' : prev.gameStatus,
      };
    });

    setHintState(prev => ({
      ...prev,
      revealHintsUsed: prev.revealHintsUsed + 1,
    }));

    showTemporaryMessage('Letter revealed (cost: 1 attempt)');
  }, [gameSource, gameStarted, gameState.gameStatus, gameState.guesses, gameState.targetWord, hintState, showTemporaryMessage]);

  const toggleHints = useCallback(() => {
    setHintState(prev => toggleHintState(prev));
  }, []);

  const generateChallengeLink = useCallback((): string | null => {
    if (!gameStarted || !gameState.targetWord) {
      showTemporaryMessage('Start a game before sharing challenge');
      return null;
    }

    const payload: ChallengePayload = {
      word: gameState.targetWord,
      difficulty: gameState.difficulty,
      length: gameState.wordLength,
      attempts: gameState.maxAttempts,
      createdAt: new Date().toISOString(),
    };

    const challengeLink = buildChallengeLink(payload);

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(challengeLink).catch(() => undefined);
    }

    showTemporaryMessage('Challenge link copied');
    return challengeLink;
  }, [gameStarted, gameState, showTemporaryMessage]);

  const createRealtimeRoom = useCallback(async (): Promise<string | null> => {
    if (!realtimeEnabled) {
      showTemporaryMessage('Realtime mode requires Firebase env setup');
      return null;
    }

    if (!gameStarted || !gameState.targetWord) {
      showTemporaryMessage('Start a game before creating a co-op room');
      return null;
    }

    try {
      setIsLoading(true);
      const identity = getOrCreatePlayerIdentity();
      setCoOpPlayerId(identity.playerId);
      setCoOpPlayerName(identity.playerName);

      const roomId = await createCoopRoom({
        targetWord: gameState.targetWord,
        difficulty: gameState.difficulty,
        wordLength: gameState.wordLength,
        maxAttempts: gameState.maxAttempts,
      }, identity.playerId, identity.playerName);

      setCoOpRoomId(roomId);
      setGameSource('co-op');
      attachRoomSubscription(roomId);

      const roomLink = buildCoopRoomLink(roomId);
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(roomLink).catch(() => undefined);
      }

      showTemporaryMessage('Co-op room link copied');
      return roomLink;
    } catch (error) {
      console.error('Failed to create co-op room:', error);
      showTemporaryMessage('Failed to create co-op room');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [attachRoomSubscription, gameStarted, gameState, realtimeEnabled, showTemporaryMessage]);

  const startCoOpNewRound = useCallback(async () => {
    if (gameSource !== 'co-op' || !coOpRoomId || !coOpPlayerId) {
      showTemporaryMessage('Join a co-op room first');
      return;
    }

    const result = await startNewCoopRound(coOpRoomId, coOpPlayerId);
    if (!result.accepted) {
      showTemporaryMessage(result.reason || 'Unable to start new round');
      return;
    }

    showTemporaryMessage('New co-op round started');
  }, [coOpPlayerId, coOpRoomId, gameSource, showTemporaryMessage]);

  const resetStats = useCallback(() => {
    setStats(clearStats());
    showTemporaryMessage('Stats reset');
  }, [showTemporaryMessage]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const key = event.key.toUpperCase();
      if (key === 'ENTER') {
        event.preventDefault();
        handleKeyPress('ENTER');
        return;
      }

      if (key === 'BACKSPACE') {
        event.preventDefault();
        handleKeyPress('BACKSPACE');
        return;
      }

      if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeyPress]);

  const selectDifficulty = useCallback((difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    const defaultLength = getDefaultLengthForDifficulty(difficulty);
    setSelectedWordLength(defaultLength);
  }, []);

  const selectWordLength = useCallback((length: number) => {
    setSelectedWordLength(length);
  }, []);

  const isCoOpHost = gameSource === 'co-op' && !!coOpHostId && coOpHostId === coOpPlayerId;

  return {
    gameState,
    gameStarted,
    gameSource,
    showMessage,
    isRevealing,
    isLoading,
    selectedDifficulty,
    selectedWordLength,
    stats,
    hintState,
    hintDefinition,
    hintCategory,
    realtimeEnabled,
    coOpRoomId,
    coOpMembers,
    coOpConnected,
    coOpHostId,
    isCoOpHost,
    coOpPlayerId,
    coOpPlayerName,
    handleKeyPress,
    startGame,
    resetGame,
    selectDifficulty,
    selectWordLength,
    joinRealtimeRoom,
    createRealtimeRoom,
    startCoOpNewRound,
    toggleHints,
    useDefinitionHint,
    useCategoryHint,
    useRevealLetterHint,
    generateChallengeLink,
    resetStats,
  };
}
