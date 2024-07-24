import React from 'react';

const ControlButtons = ({ onPlayNext, onPlayPause, onRestart, isPlaying }) => {
    return (
        <div className="control-buttons">
            <button onClick={onPlayNext}>Play Next Log Only</button>
            <button onClick={onPlayPause}>
                {isPlaying ? 'Pause' : 'Continuously Play'}
            </button>
            <button onClick={onRestart}>Restart</button>
        </div>
    );
};

export default ControlButtons;