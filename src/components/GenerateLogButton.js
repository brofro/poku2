import React from 'react';
import { useGame } from '../contexts/GameContext';

const GenerateLogButton = () => {
    const { handleGenerateLog, isLogGenerated } = useGame();

    return (
        <button
            onClick={handleGenerateLog}
            disabled={isLogGenerated}
            className="generate-log-button"
        >
            Generate Battle Log
        </button>
    );
};

export default GenerateLogButton;