import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchWordDefinition } from '@/lib/dictionary';
import { Loader2 } from 'lucide-react';

interface LossCardProps {
  word: string;
  onClose?: () => void;
}

export function LossCard({ word, onClose }: LossCardProps) {
  const [definition, setDefinition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDefinition = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const def = await fetchWordDefinition(word);
        setDefinition(def);
      } catch (err) {
        console.error('Failed to load definition:', err);
        setError('Could not load definition');
      } finally {
        setIsLoading(false);
      }
    };

    if (word) {
      loadDefinition();
    }
  }, [word]);

  return (
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
        <CardHeader>
          <CardTitle className="text-center text-2xl">Game Over</CardTitle>
          <CardDescription className="text-center">
            The word was
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold tracking-wider text-primary mb-2">
              {word.toUpperCase()}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Definition:</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <p className="text-sm text-muted-foreground italic">{error}</p>
            ) : definition ? (
              <p className="text-sm leading-relaxed">{definition}</p>
            ) : null}
          </div>

          {onClose && (
            <div className="flex justify-center pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-primary hover:underline"
              >
                Close
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

