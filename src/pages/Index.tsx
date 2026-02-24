import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Grid } from '@/components/Grid';
import { Keyboard } from '@/components/Keyboard';
import { Message } from '@/components/Message';
import { HelpModal } from '@/components/HelpModal';
import { LossCard } from '@/components/LossCard';
import { WinCard } from '@/components/WinCard';
import { LevelSelection } from '@/components/LevelSelection';
import { StatsModal } from '@/components/StatsModal';
import { HintPanel } from '@/components/HintPanel';
import { MultiplayerPanel } from '@/components/MultiplayerPanel';
import { useFreedleGame } from '@/hooks/useFreedleGame';

const Index = () => {
  const {
    gameState,
    gameStarted,
    gameSource,
    showMessage,
    isRevealing,
    isLoading,
    selectedDifficulty,
    selectedWordLength,
    stats,
    hintState,
    hintDefinition,
    hintCategory,
    realtimeEnabled,
    coOpRoomId,
    coOpMembers,
    coOpConnected,
    isCoOpHost,
    coOpPlayerId,
    handleKeyPress,
    startGame,
    resetGame,
    selectDifficulty,
    selectWordLength,
    joinRealtimeRoom,
    createRealtimeRoom,
    startCoOpNewRound,
    toggleHints,
    useDefinitionHint,
    useCategoryHint,
    useRevealLetterHint,
    generateChallengeLink,
    resetStats,
  } = useFreedleGame();

  const [helpOpen, setHelpOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [showLossCard, setShowLossCard] = useState(false);
  const [showWinCard, setShowWinCard] = useState(false);

  useEffect(() => {
    if (gameState.gameStatus === 'lost' && gameState.targetWord) {
      setShowLossCard(true);
      return;
    }

    setShowLossCard(false);
  }, [gameState.gameStatus, gameState.targetWord]);

  useEffect(() => {
    if (gameState.gameStatus === 'won') {
      setShowWinCard(true);
      return;
    }

    setShowWinCard(false);
  }, [gameState.gameStatus]);

  const attemptsRemaining = useMemo(() => {
    if (!gameStarted) return undefined;
    return Math.max(0, gameState.maxAttempts - gameState.currentRow);
  }, [gameStarted, gameState.currentRow, gameState.maxAttempts]);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Header
        onNewGame={gameStarted ? resetGame : undefined}
        onHelp={() => setHelpOpen(true)}
        onStats={() => setStatsOpen(true)}
        onShare={() => generateChallengeLink()}
        currentDifficulty={gameStarted ? gameState.difficulty : undefined}
        currentWordLength={gameStarted ? gameState.wordLength : undefined}
        attemptsRemaining={attemptsRemaining}
      />

      <Message message={gameState.message} visible={showMessage} />

      {!gameStarted ? (
        <LevelSelection
          selectedDifficulty={selectedDifficulty}
          selectedWordLength={selectedWordLength}
          onSelectDifficulty={selectDifficulty}
          onSelectWordLength={selectWordLength}
          onStartGame={() => startGame({ difficulty: selectedDifficulty, wordLength: selectedWordLength })}
        />
      ) : (
        <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 gap-4">
          {gameSource === 'challenge' && (
            <p className="text-xs sm:text-sm text-center text-muted-foreground">
              Multiplayer challenge mode: everyone with this link gets the same word.
            </p>
          )}

          {gameSource === 'co-op' && (
            <p className="text-xs sm:text-sm text-center text-muted-foreground">
              Realtime co-op mode: solve the same board together live.
            </p>
          )}

          <MultiplayerPanel
            realtimeEnabled={realtimeEnabled}
            roomId={coOpRoomId}
            coOpConnected={coOpConnected}
            isHost={isCoOpHost}
            members={coOpMembers}
            playerId={coOpPlayerId}
            onCreateRoom={() => {
              void createRealtimeRoom();
            }}
            onJoinRoom={(roomId) => {
              void joinRealtimeRoom(roomId);
            }}
            onStartNewRound={() => {
              void startCoOpNewRound();
            }}
          />

          <HintPanel
            hintState={hintState}
            definition={hintDefinition}
            category={hintCategory}
            onToggleHints={toggleHints}
            onRevealLetter={useRevealLetterHint}
            onShowDefinition={useDefinitionHint}
            onShowCategory={useCategoryHint}
            disabled={isLoading || isRevealing || gameState.gameStatus !== 'playing'}
          />

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">Loading game...</div>
                <div className="text-sm text-muted-foreground">Preparing your next word</div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 flex items-center justify-center overflow-x-auto pb-2">
                <Grid
                  guesses={gameState.guesses}
                  currentRow={gameState.currentRow}
                  isShaking={gameState.isShaking}
                  gameStatus={gameState.gameStatus}
                />
              </div>

              <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border rounded-t-xl p-2 sm:p-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <Keyboard
                  keyboardState={gameState.keyboardState}
                  onKeyPress={handleKeyPress}
                  disabled={isRevealing || gameState.gameStatus !== 'playing' || isLoading}
                />
              </div>
            </>
          )}
        </main>
      )}

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />

      <StatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        stats={stats}
        onReset={resetStats}
      />

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
