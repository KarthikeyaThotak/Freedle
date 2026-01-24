import { useState, useCallback, useEffect } from 'react';
import { GameState, createEmptyGrid, evaluateGuess, updateKeyboardState, MAX_GUESSES } from '@/lib/game';
import { isValidWord } from '@/lib/words';
import { fetchRandomWord, type Difficulty } from '@/lib/wordnik';

const REVEAL_DELAY = 300;
const MESSAGE_DURATION = 2000;

function createEmptyGameState(): GameState {
  return {
    targetWord: '',
    wordLength: 5, // Default, will be updated when word is fetched
    guesses: createEmptyGrid(5),
    currentRow: 0,
    currentCol: 0,
    gameStatus: 'playing',
    keyboardState: {},
    isShaking: false,
    message: '',
  };
}

export function useFreedleGame() {
  const [gameState, setGameState] = useState<GameState>(createEmptyGameState);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('hard');

  const [showMessage, setShowMessage] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  // Fetch word on mount (default to hard)
  useEffect(() => {
    loadWord('hard');
  }, []);

  const loadWord = useCallback(async (difficulty: Difficulty = 'hard') => {
    try {
      setIsLoading(true);
      setCurrentDifficulty(difficulty);
      const word = await fetchRandomWord(difficulty);
      const wordLength = word.length;
      setGameState({
        targetWord: word,
        wordLength,
        guesses: createEmptyGrid(wordLength),
        currentRow: 0,
        currentCol: 0,
        gameStatus: 'playing',
        keyboardState: {},
        isShaking: false,
        message: '',
      });
    } catch (error) {
      console.error('Failed to load word:', error);
      // Fallback to a default word if fetch fails
      const fallbackWord = 'HELLO';
      setGameState({
        targetWord: fallbackWord,
        wordLength: fallbackWord.length,
        guesses: createEmptyGrid(fallbackWord.length),
        currentRow: 0,
        currentCol: 0,
        gameStatus: 'playing',
        keyboardState: {},
        isShaking: false,
        message: 'Using fallback word',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showTemporaryMessage = useCallback((msg: string) => {
    setGameState(prev => ({ ...prev, message: msg }));
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), MESSAGE_DURATION);
  }, []);

  const addLetter = useCallback((letter: string) => {
    if (gameState.gameStatus !== 'playing' || isRevealing) return;
    if (gameState.currentCol >= gameState.wordLength) return;

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
  }, [gameState.gameStatus, gameState.currentCol, gameState.wordLength, isRevealing]);

  const removeLetter = useCallback(() => {
    if (gameState.gameStatus !== 'playing' || isRevealing) return;
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
  }, [gameState.gameStatus, gameState.currentCol, isRevealing]);

  const submitGuess = useCallback(() => {
    if (gameState.gameStatus !== 'playing' || isRevealing) return;
    if (gameState.currentCol !== gameState.wordLength) {
      setGameState(prev => ({ ...prev, isShaking: true }));
      showTemporaryMessage('Not enough letters');
      setTimeout(() => {
        setGameState(prev => ({ ...prev, isShaking: false }));
      }, 500);
      return;
    }

    const guess = gameState.guesses[gameState.currentRow]
      .map(tile => tile.letter)
      .join('');

    if (!isValidWord(guess, gameState.wordLength)) {
      setGameState(prev => ({ ...prev, isShaking: true }));
      showTemporaryMessage('Not in word list');
      setTimeout(() => {
        setGameState(prev => ({ ...prev, isShaking: false }));
      }, 500);
      return;
    }

    setIsRevealing(true);
    const states = evaluateGuess(guess, gameState.targetWord);

    // Reveal tiles one by one
    setGameState(prev => {
      const newGuesses = [...prev.guesses];
      newGuesses[prev.currentRow] = newGuesses[prev.currentRow].map((tile, i) => ({
        ...tile,
        state: states[i],
        isRevealing: true,
        delay: i * REVEAL_DELAY,
      }));
      return { ...prev, guesses: newGuesses };
    });

    // After all tiles revealed, update game state
    const revealDuration = gameState.wordLength * REVEAL_DELAY + 300;
    setTimeout(() => {
      setGameState(prev => {
        const newGuesses = prev.guesses.map(row =>
          row.map(tile => ({ ...tile, isRevealing: false }))
        );

        const newKeyboardState = updateKeyboardState(
          prev.keyboardState,
          guess,
          states
        );

        const isWin = guess === prev.targetWord;
        const isLoss = !isWin && prev.currentRow === MAX_GUESSES - 1;

        let newStatus = prev.gameStatus;
        if (isWin) {
          newStatus = 'won';
        } else if (isLoss) {
          newStatus = 'lost';
        }

        return {
          ...prev,
          guesses: newGuesses,
          currentRow: prev.currentRow + 1,
          currentCol: 0,
          gameStatus: newStatus,
          keyboardState: newKeyboardState,
        };
      });

      setIsRevealing(false);

      // Show end game message
      const isWin = guess === gameState.targetWord;
      if (isWin) {
        const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
        showTemporaryMessage(messages[gameState.currentRow] || 'Nice!');
      } else if (gameState.currentRow === MAX_GUESSES - 1) {
        showTemporaryMessage(gameState.targetWord);
      }
    }, revealDuration);
  }, [gameState, isRevealing, showTemporaryMessage]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      removeLetter();
    } else if (/^[A-Z]$/.test(key)) {
      addLetter(key);
    }
  }, [submitGuess, removeLetter, addLetter]);

  const resetGame = useCallback(async (difficulty?: Difficulty) => {
    setShowMessage(false);
    setIsRevealing(false);
    await loadWord(difficulty || currentDifficulty);
  }, [loadWord, currentDifficulty]);

  const startEasyGame = useCallback(() => {
    resetGame('easy');
  }, [resetGame]);

  const startHardGame = useCallback(() => {
    resetGame('hard');
  }, [resetGame]);

  // Physical keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const key = e.key.toUpperCase();
      if (key === 'ENTER') {
        e.preventDefault();
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        e.preventDefault();
        handleKeyPress('BACKSPACE');
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return {
    gameState,
    showMessage,
    isRevealing,
    isLoading,
    currentDifficulty,
    handleKeyPress,
    resetGame,
    startEasyGame,
    startHardGame,
  };
}
