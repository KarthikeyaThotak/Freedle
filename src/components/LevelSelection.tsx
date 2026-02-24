import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DifficultyLevel, getAllDifficultyConfigs, isLengthAllowedForDifficulty } from '@/lib/managers/DifficultyManager';
import { cn } from '@/lib/utils';

interface LevelSelectionProps {
  selectedDifficulty: DifficultyLevel;
  selectedWordLength: number;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
  onSelectWordLength: (length: number) => void;
  onStartGame: () => void;
}

const LENGTH_OPTIONS = [4, 5, 6, 7];

export function LevelSelection({
  selectedDifficulty,
  selectedWordLength,
  onSelectDifficulty,
  onSelectWordLength,
  onStartGame,
}: LevelSelectionProps) {
  const difficultyConfigs = getAllDifficultyConfigs();
  const isValidSelection = isLengthAllowedForDifficulty(selectedDifficulty, selectedWordLength);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Choose Game Mode</CardTitle>
          <CardDescription>Pick your difficulty and word length to start a new Freedle challenge.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {difficultyConfigs.map((config) => (
              <button
                key={config.id}
                onClick={() => onSelectDifficulty(config.id)}
                className={cn(
                  'rounded-lg border p-3 text-left transition-colors',
                  selectedDifficulty === config.id
                    ? 'border-primary bg-secondary'
                    : 'border-border hover:bg-secondary/60'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{config.label}</p>
                  <Badge variant="secondary">{config.attempts} tries</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Word Length</p>
            <div className="flex flex-wrap gap-2">
              {LENGTH_OPTIONS.map((length) => {
                const allowed = isLengthAllowedForDifficulty(selectedDifficulty, length);
                const label = length === 7 ? '7+' : String(length);

                return (
                  <button
                    key={length}
                    onClick={() => onSelectWordLength(length)}
                    className={cn(
                      'h-10 px-4 rounded-md border text-sm font-medium transition-colors',
                      selectedWordLength === length ? 'border-primary bg-secondary' : 'border-border',
                      allowed ? 'hover:bg-secondary/60' : 'opacity-45 cursor-not-allowed'
                    )}
                    disabled={!allowed}
                  >
                    {label} letters
                  </button>
                );
              })}
            </div>
            {!isValidSelection && (
              <p className="text-sm text-destructive">This length is not available for the selected difficulty.</p>
            )}
          </div>

          <Button className="w-full sm:w-auto" onClick={onStartGame} disabled={!isValidSelection}>
            Start Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
