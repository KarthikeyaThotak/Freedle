import { RotateCcw, HelpCircle } from 'lucide-react';
import logo from "/logo.png";
import { Difficulty } from '@/lib/wordnik';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onNewGame: () => void;
  onHelp: () => void;
  onEasy: () => void;
  onHard: () => void;
  currentDifficulty: Difficulty;
}

export function Header({ onNewGame, onHelp, onEasy, onHard, currentDifficulty }: HeaderProps) {
  return (
    <header className="w-full border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onHelp}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="How to play"
          >
            <HelpCircle className="w-6 h-6 text-muted-foreground" />
          </button>
          
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center justify-center">
            <img src={logo} alt="Freedle" className="h-10 w-auto object-contain" />
          </h1>
          
          <button
            onClick={onNewGame}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="New game"
          >
            <RotateCcw className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onEasy}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              currentDifficulty === 'easy'
                ? "bg-green-500 text-white shadow-md"
                : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
            )}
          >
            Easy
          </button>
          <button
            onClick={onHard}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              currentDifficulty === 'hard'
                ? "bg-red-500 text-white shadow-md"
                : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
            )}
          >
            Hard
          </button>
        </div>
      </div>
    </header>
  );
}
