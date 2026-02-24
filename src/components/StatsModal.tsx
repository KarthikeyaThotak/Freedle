import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type GameStatsSchema } from '@/lib/managers/StatsManager';

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  stats: GameStatsSchema;
  onReset: () => void;
}

export function StatsModal({ open, onClose, stats, onReset }: StatsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Player Stats</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="Games" value={stats.gamesPlayed} />
          <StatCard label="Wins" value={stats.gamesWon} />
          <StatCard label="Win %" value={`${stats.winPercentage}%`} />
          <StatCard label="Streak" value={stats.currentStreak} />
          <StatCard label="Max Streak" value={stats.maxStreak} />
          <StatCard label="Avg Guesses" value={stats.averageGuesses || 0} />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">By Difficulty</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <Bucket title="Easy" played={stats.byDifficulty.easy.played} won={stats.byDifficulty.easy.won} />
            <Bucket title="Medium" played={stats.byDifficulty.medium.played} won={stats.byDifficulty.medium.won} />
            <Bucket title="Hard" played={stats.byDifficulty.hard.played} won={stats.byDifficulty.hard.won} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">By Word Length</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            {Object.keys(stats.byLength).length === 0 ? (
              <p className="text-muted-foreground col-span-full">No games recorded yet.</p>
            ) : (
              Object.entries(stats.byLength)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([length, data]) => (
                  <Bucket key={length} title={`${length}L`} played={data.played} won={data.won} />
                ))
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">Last updated: {new Date(stats.lastUpdatedAt).toLocaleString()}</p>
          <Button variant="destructive" onClick={onReset}>Reset Progress</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function Bucket({ title, played, won }: { title: string; played: number; won: number }) {
  return (
    <Card>
      <CardContent className="p-3">
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{won} won / {played} played</p>
      </CardContent>
    </Card>
  );
}
