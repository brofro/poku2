import React from 'react';

const GameLog = ({ log, currentLogIndex }) => {
    return (
        <div className="game-log">
            <h2>Game Log</h2>
            <div className="log-entries">
                {log.map((entry, index) => (
                    <div
                        key={entry.id}
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