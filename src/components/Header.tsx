import { RotateCcw, HelpCircle, Moon, Sun, BarChart3, Share2 } from 'lucide-react';
import logo from "/logo.png";
import { DifficultyLevel } from '@/lib/managers/DifficultyManager';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onNewGame?: () => void;
  onHelp: () => void;
  onStats: () => void;
  onShare: () => void;
  currentDifficulty?: DifficultyLevel;
  currentWordLength?: number;
  attemptsRemaining?: number;
}

export function Header({
  onNewGame,
  onHelp,
  onStats,
  onShare,
  currentDifficulty,
  currentWordLength,
  attemptsRemaining,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="w-full border-b border-border">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onHelp}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="How to play"
            >
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </button>
            <button
              onClick={onStats}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Open stats"
            >
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </button>
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                ) : (
                  <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center justify-center">
            <img src={logo} alt="Freedle" className="h-10 w-auto object-contain" />
          </h1>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onShare}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Share challenge"
            >
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </button>
            {onNewGame && (
              <button
                onClick={onNewGame}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="New game"
              >
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 min-h-8">
          {currentDifficulty && currentWordLength && (
            <>
              <span
                className={cn(
                  'px-3 py-1 text-xs sm:text-sm font-medium rounded-md',
                  currentDifficulty === 'easy' && 'bg-green-500/10 text-green-600',
                  currentDifficulty === 'medium' && 'bg-blue-500/10 text-blue-600',
                  currentDifficulty === 'hard' && 'bg-red-500/10 text-red-600'
                )}
              >
                {currentDifficulty.toUpperCase()}
              </span>
              <span className="px-3 py-1 text-xs sm:text-sm font-medium rounded-md bg-secondary text-secondary-foreground">
                {currentWordLength === 7 ? '7+' : currentWordLength} Letters
              </span>
              {typeof attemptsRemaining === 'number' && (
                <span className="px-3 py-1 text-xs sm:text-sm font-medium rounded-md bg-secondary text-secondary-foreground">
                  {attemptsRemaining} Tries Left
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
