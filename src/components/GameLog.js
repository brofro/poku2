import React from 'react';
import { useGame } from '../contexts/GameContext';

const GameLog = () => {
    // Get the game log and current log index from our game context
    const { gameLog, currentLogIndex, isLogGenerated } = useGame();

    if (!isLogGenerated) return null;

    return (
        <div className="game-log">
            <h2>Game Log</h2>
            <div className="log-entries">
                {gameLog.map((entry, index) => (
                    <div
                        key={entry.id}
                        // Highlight the current log entry
                        className={`log-entry ${index === currentLogIndex ? 'current-log' : ''}`}
                    >
                        <span className="log-id">{entry.id}:</span> {entry.log || entry.action}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameLog;