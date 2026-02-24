import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { HintState } from '@/lib/managers/HintManager';

interface HintPanelProps {
  hintState: HintState;
  definition: string | null;
  category: string | null;
  onToggleHints: () => void;
  onRevealLetter: () => void;
  onShowDefinition: () => void;
  onShowCategory: () => void;
  disabled?: boolean;
}

export function HintPanel({
  hintState,
  definition,
  category,
  onToggleHints,
  onRevealLetter,
  onShowDefinition,
  onShowCategory,
  disabled,
}: HintPanelProps) {
  return (
    <div className="w-full rounded-lg border border-border p-3 space-y-3 bg-card">
      <div className="flex items-center justify-between">
        <Label htmlFor="hints-enabled" className="text-sm font-semibold">Hints</Label>
        <Switch id="hints-enabled" checked={hintState.enabled} onCheckedChange={onToggleHints} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" disabled={disabled || !hintState.enabled || hintState.usedDefinition} onClick={onShowDefinition}>
          Meaning
        </Button>
        <Button size="sm" variant="secondary" disabled={disabled || !hintState.enabled || hintState.usedCategory} onClick={onShowCategory}>
          Category
        </Button>
        <Button size="sm" variant="secondary" disabled={disabled || !hintState.enabled || hintState.revealHintsUsed >= hintState.maxRevealHints} onClick={onRevealLetter}>
          Reveal Letter (-1 try)
        </Button>
      </div>

      {definition && (
        <p className="text-sm text-muted-foreground leading-relaxed"><span className="font-medium text-foreground">Meaning:</span> {definition}</p>
      )}

      {category && (
        <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Category:</span> {category}</p>
      )}
    </div>
  );
}
