import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CoopMember } from '@/lib/managers/RealtimeMultiplayerManager';

interface MultiplayerPanelProps {
  realtimeEnabled: boolean;
  roomId: string | null;
  coOpConnected: boolean;
  isHost: boolean;
  members: CoopMember[];
  playerId: string | null;
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  onStartNewRound: () => void;
}

export function MultiplayerPanel({
  realtimeEnabled,
  roomId,
  coOpConnected,
  isHost,
  members,
  playerId,
  onCreateRoom,
  onJoinRoom,
  onStartNewRound,
}: MultiplayerPanelProps) {
  const [joinInput, setJoinInput] = useState('');

  return (
    <div className="w-full rounded-lg border border-border p-3 bg-card space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Realtime Co-op</p>
        <Badge variant={coOpConnected ? 'default' : 'secondary'}>
          {coOpConnected ? 'Connected' : 'Offline'}
        </Badge>
      </div>

      {!realtimeEnabled ? (
        <p className="text-sm text-muted-foreground">
          Configure Firebase env variables to enable live co-op rooms.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={onCreateRoom}>Create Co-op Room</Button>
            <Input
              value={joinInput}
              onChange={(event) => setJoinInput(event.target.value)}
              placeholder="Enter room id"
              className="max-w-[180px] h-9"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                if (!joinInput.trim()) return;
                onJoinRoom(joinInput.trim());
              }}
            >
              Join
            </Button>
            {roomId && isHost && (
              <Button
                size="sm"
                variant="outline"
                onClick={onStartNewRound}
              >
                Start New Round
              </Button>
            )}
          </div>

          {roomId && (
            <p className="text-xs text-muted-foreground">
              Room ID: <span className="font-medium text-foreground">{roomId}</span>
            </p>
          )}

          {members.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {members.map(member => (
                <Card key={member.id}>
                  <CardContent className="p-2.5">
                    <p className="text-sm font-medium">
                      {member.name}
                      {playerId === member.id ? ' (You)' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Guesses submitted: {member.guessesSubmitted}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
