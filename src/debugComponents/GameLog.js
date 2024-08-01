import React from 'react';
import "../css/DebugStyles.css"
import LogEntry from './LogEntry';


const GameLog = ({ gameLog, currentLogIndex, isLogGenerated, setGameStateFromLog }) => {
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
                        setGameStateFromLog={setGameStateFromLog}
                    />
                ))}
            </div>
        </div>
    );
};

export default GameLog;