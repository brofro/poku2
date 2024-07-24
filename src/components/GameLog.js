// src/components/GameLog.js
import React from 'react';

const GameLog = ({ log }) => {
    return (
        <div className="game-log">
            <h2>Game Log</h2>
            <div className="log-entries">
                {log.map((entry) => (
                    <div key={entry.id} className="log-entry">
                        <span className="log-id">{entry.id}:</span> {entry.log || entry.action}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameLog;