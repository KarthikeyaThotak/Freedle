import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">How to Play</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-foreground">
          <p>Guess the <strong>FREEDLE</strong> in 6 tries.</p>
          
          <ul className="space-y-2 text-sm">
            <li>• Each guess must be a valid 5-letter word.</li>
            <li>• The color of the tiles will change to show how close your guess was.</li>
          </ul>
          
          <div className="space-y-3">
            <p className="font-semibold">Examples</p>
            
            <div className="space-y-2">
              <div className="flex gap-1">
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold tile-correct rounded">W</div>
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-border rounded">E</div>
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-border rounded">A</div>
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-border rounded">R</div>
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-border rounded">Y</div>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>W</strong> is in the word and in the correct spot.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex gap-1">
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-border rounded">P</div>
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold tile-misplaced rounded">I</div>
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-border rounded">L</div>
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-border rounded">O</div>
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-border rounded">T</div>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>I</strong> is in the word but in the wrong spot.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex gap-1">
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-border rounded">V</div>
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-border rounded">A</div>
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-border rounded">G</div>
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold tile-incorrect rounded">U</div>
                <div className="w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-border rounded">E</div>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>U</strong> is not in the word in any spot.
              </p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground pt-2 border-t border-border">
            Click the refresh icon to start a new game at any time.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
