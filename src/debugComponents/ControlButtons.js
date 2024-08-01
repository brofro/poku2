import React from 'react';

const ControlButtons = ({ handlePlayNext, handlePlayPause, handleRestart, isPlaying, isLogGenerated }) => {
    if (!isLogGenerated) return null;
    return (
        <div className="control-buttons">
            {/* Button to play the next action */}
            <button onClick={handlePlayNext}>Play Next Log Only</button>
            {/* Button to start/pause continuous play */}
            <button onClick={handlePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            {/* Button to restart the game */}
            <button onClick={handleRestart}>Restart</button>
        </div>
    );
};

export default ControlButtons;