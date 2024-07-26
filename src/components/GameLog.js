import React from 'react';
import { useGame } from '../contexts/GameContext';
import LogEntry from './LogEntry';

const GameLog = () => {
    // Get the game log and current log index from our game context
    const { gameLog, currentLogIndex, isLogGenerated } = useGame();

    if (!isLogGenerated) return null;

    return (
        <div className="game-log">
            <h2>Game Log</h2>
            <div className="log-entries">
                {gameLog.map((entry, index) => (
                    <LogEntry
                        key={entry.id}
                        entry={entry}
                        index={index}
                        currentIndex={currentLogIndex}
                    />
                ))}
            </div>
        </div>
    );
};

export default GameLog;