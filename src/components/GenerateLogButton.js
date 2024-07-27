import React from 'react';
import { useGame } from '../contexts/GameContext';
import { ACTION_TYPES } from '../data/constants';

const GenerateLogButton = () => {
    const { handleGenerateLog, isLogGenerated, currentAction, resetGameState } = useGame();

    const handleButtonClick = () => {
        if (isLogGenerated) {
            resetGameState()
        } else {
            handleGenerateLog();
        }
    };

    const buttonText = isLogGenerated ? 'Reset Game' : 'Generate Battle Log';
    const isDisabled = isLogGenerated && currentAction?.action !== ACTION_TYPES.GAME_END;

    return (
        <button
            onClick={handleButtonClick}
            disabled={isDisabled}
            className="generate-log-button"
        >
            {buttonText}
        </button>
    );
};

export default GenerateLogButton;