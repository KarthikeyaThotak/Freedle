import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';

interface WinCardProps {
  onReplay: () => void;
  onClose?: () => void;
}

// Confetti component
function Confetti() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {confettiPieces.map((i) => {
        const color = colors[i % colors.length];
        const left = `${Math.random() * 100}%`;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 2;
        const rotation = Math.random() * 360;

        return (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left,
              backgroundColor: color,
              top: '-10px',
              animation: `confetti-fall ${duration}s linear ${delay}s forwards`,
              transform: `rotate(${rotation}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

export function WinCard({ onReplay, onClose }: WinCardProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation completes
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showConfetti && <Confetti />}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={(e) => {
          // Close when clicking outside the card
          if (e.target === e.currentTarget && onClose) {
            onClose();
          }
        }}
      >
        <Card 
          className="w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <PartyPopper className="w-16 h-16 text-yellow-500 animate-bounce" />
            </div>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Congratulations!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              You've successfully guessed the word!
            </p>
            
            <div className="flex justify-center pt-4">
              <Button
                onClick={onReplay}
                className="px-8 py-2 text-base font-semibold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 text-white"
              >
                Replay
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

