import React from 'react';
import { useGame } from '../contexts/GameContext';
import './LogEntry.css';

const LogEntry = ({ entry, index, currentIndex }) => {
    const { setGameStateFromLog } = useGame();

    const handleClick = () => {
        setGameStateFromLog(index);
    };

    return (
        <div
            className={`log-entry ${index === currentIndex ? 'current-log' : ''}`}
            onClick={handleClick}
        >
            <span className="log-id">{entry.id}:</span> {entry.log || entry.action}
        </div>
    );
};

export default LogEntry;