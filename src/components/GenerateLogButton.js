import React from 'react';
import { ACTION_TYPES } from '../data/constants';

const GenerateLogButton = ({ isLogGenerated, currentAction, resetGameState }) => {



    const buttonText = isLogGenerated ? 'Reset Game' : 'Generate Battle Log';
    const isDisabled = isLogGenerated && currentAction?.action !== ACTION_TYPES.GAME_END;

    return (
        <button
            disabled={isDisabled}
            className="generate-log-button"
        >
            {buttonText}
        </button>
    );
};

export default GenerateLogButton;