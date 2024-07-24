import { useState, useEffect } from 'react';
import { initialCardData } from '../data/cardData';
import { PLAYER_ONE, PLAYER_TWO, PLAY_SPEED } from '../constants';
import { runGameLoop, getGameStateAtLogIndex } from '../gameLogic';

const useGameState = () => {
    // State variables to manage the game
    const [gameState, setGameState] = useState(null);  // Current state of the game board
    const [gameLog, setGameLog] = useState([]);  // Log of all game actions
    const [currentLogIndex, setCurrentLogIndex] = useState(-1);  // Index of current action in the log
    const [isPlaying, setIsPlaying] = useState(false);  // Whether the game is auto-playing
    const [currentAction, setCurrentAction] = useState(null);  // The current action being performed

    // Initialize the game when the component mounts
    useEffect(() => {
        const { finalState, gameLog } = runGameLoop(initialCardData);
        setGameState(getGameStateAtLogIndex(gameLog, -1));  // Set initial game state
        setGameLog(gameLog);  // Set the full game log
    }, []);

    // Handle auto-play functionality
    useEffect(() => {
        let timeoutId;
        if (isPlaying && currentLogIndex < gameLog.length - 1) {
            // Set a timeout to play the next action
            timeoutId = setTimeout(() => {
                handlePlayNext();
            }, PLAY_SPEED);
        } else if (currentLogIndex >= gameLog.length - 1) {
            // Stop playing if we've reached the end of the log
            setIsPlaying(false);
        }
        // Clean up the timeout when the component unmounts or dependencies change
        return () => clearTimeout(timeoutId);
    }, [isPlaying, currentLogIndex, gameLog.length]);

    // Function to play the next action in the log
    const handlePlayNext = () => {
        if (currentLogIndex < gameLog.length - 1) {
            setCurrentLogIndex(prevIndex => prevIndex + 1);
            setGameState(getGameStateAtLogIndex(gameLog, currentLogIndex + 1));
        } else {
            setIsPlaying(false);
        }
    };

    // Function to start or pause auto-play
    const handlePlayPause = () => {
        if (!isPlaying) {
            // If starting to play, reset to the beginning
            setCurrentLogIndex(-1);
            setGameState(getGameStateAtLogIndex(gameLog, -1));
        }
        setIsPlaying(!isPlaying);
    };

    // Function to restart the game
    const handleRestart = () => {
        setCurrentLogIndex(-1);
        setGameState(getGameStateAtLogIndex(gameLog, -1));
        setIsPlaying(false);
    };

    // Return all necessary state and functions
    return {
        gameState,
        gameLog,
        currentLogIndex,
        isPlaying,
        currentAction,
        handlePlayNext,
        handlePlayPause,
        handleRestart,
    };
};

export default useGameState;