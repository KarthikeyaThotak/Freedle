import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Grid } from '@/components/Grid';
import { Keyboard } from '@/components/Keyboard';
import { Message } from '@/components/Message';
import { HelpModal } from '@/components/HelpModal';
import { LossCard } from '@/components/LossCard';
import { WinCard } from '@/components/WinCard';
import { useFreedleGame } from '@/hooks/useFreedleGame';


const Index = () => {
  const { gameState, showMessage, isRevealing, isLoading, handleKeyPress, resetGame, startEasyGame, startHardGame, currentDifficulty } = useFreedleGame();
  const [helpOpen, setHelpOpen] = useState(false);
  const [showLossCard, setShowLossCard] = useState(false);
  const [showWinCard, setShowWinCard] = useState(false);

  // Show loss card when game is lost
  useEffect(() => {
    if (gameState.gameStatus === 'lost' && gameState.targetWord) {
      setShowLossCard(true);
    } else {
      setShowLossCard(false);
    }
  }, [gameState.gameStatus, gameState.targetWord]);

  // Show win card when game is won
  useEffect(() => {
    if (gameState.gameStatus === 'won') {
      setShowWinCard(true);
    } else {
      setShowWinCard(false);
    }
  }, [gameState.gameStatus]);

  <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="karthikeyaT" data-description="Support me on Buy me a coffee!" data-message="Thank-you for supporting🫶🫶" data-color="#5F7FFF" data-position="Right" data-x_margin="18" data-y_margin="18"></script>

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onNewGame={resetGame} 
        onHelp={() => setHelpOpen(true)}
        onEasy={startEasyGame}
        onHard={startHardGame}
        currentDifficulty={currentDifficulty}
      />
      
      <Message message={gameState.message} visible={showMessage} />
      
      <main className="flex-1 flex flex-col items-center justify-between py-6 px-4 max-w-lg mx-auto w-full">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Loading word...</div>
              <div className="text-sm text-muted-foreground">Fetching word...</div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 flex items-center">
              <Grid
                guesses={gameState.guesses}
                currentRow={gameState.currentRow}
                isShaking={gameState.isShaking}
                gameStatus={gameState.gameStatus}
              />
            </div>
            
            <div className="w-full">
              <Keyboard
                keyboardState={gameState.keyboardState}
                onKeyPress={handleKeyPress}
                disabled={isRevealing || gameState.gameStatus !== 'playing' || isLoading}
              />
            </div>
            
          </>
        )}
      </main>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      
      {showLossCard && gameState.gameStatus === 'lost' && gameState.targetWord && (
        <LossCard 
          word={gameState.targetWord}
          onClose={() => setShowLossCard(false)}
        />
      )}

      {showWinCard && gameState.gameStatus === 'won' && (
        <WinCard 
          onReplay={() => {
            setShowWinCard(false);
            resetGame();
          }}
          onClose={() => setShowWinCard(false)}
        />
      )}
    </div>
  );
};

export default Index;
