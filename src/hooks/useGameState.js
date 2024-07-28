import { useState, useEffect } from 'react';
import { initialCardData } from '../data/cardData';
import { initialShopData } from '../data/effectsData';
import { PLAYER_ONE, PLAYER_TWO, PLAY_SPEED } from '../data/constants';
import { runGameLoop, getGameStateAtLogIndex } from '../core/gameLogic';

const useGameState = () => {
    // State variables to manage the game
    const [gameState, setGameState] = useState(null);  // Current state of the game board
    const [gameLog, setGameLog] = useState([]);  // Log of all game actions
    const [currentLogIndex, setCurrentLogIndex] = useState(-1);  // Index of current action in the log
    const [isPlaying, setIsPlaying] = useState(false);  // Whether the game is auto-playing
    const [currentAction, setCurrentAction] = useState(null);  // The current action being performed
    const [isLogGenerated, setIsLogGenerated] = useState(false);

    // states for roster and bag
    const [roster, setRoster] = useState(initialCardData[PLAYER_ONE]);
    const [bench, setBench] = useState([])
    const [bags, setBags] = useState(Object.fromEntries(Array.from({ length: roster.length }, (_, i) => [i, {}])));
    const [shop, setShop] = useState(initialShopData)
    const [storage, setStorage] = useState({})

    const handleGenerateLog = () => {
        const { gameLog } = runGameLoop({ [PLAYER_ONE]: roster, [PLAYER_TWO]: initialCardData[PLAYER_TWO] }, bags);
        setGameState(getGameStateAtLogIndex(gameLog, -1));
        setGameLog(gameLog);
        setIsLogGenerated(true);
    };

    const resetGameState = () => {
        setGameLog([])
        setIsLogGenerated(false)
        setCurrentAction(null)
        setCurrentLogIndex(-1)
    }

    //updates bag at index
    const updateBag = (index, effects) => setBags(prev => ({ ...prev, [index]: Object.fromEntries(effects.map((effect, i) => [i, effect])) }));

    // Function to play the next action in the log
    const handlePlayNext = () => {
        if (currentLogIndex < gameLog.length - 1) {
            const nextIndex = currentLogIndex + 1;
            setCurrentLogIndex(nextIndex);
            setGameState(getGameStateAtLogIndex(gameLog, nextIndex));

            // Set the current action
            setCurrentAction(gameLog[nextIndex]);
        } else {
            setIsPlaying(false);
            setCurrentAction(null);  // Clear the action at the end of the game
        }
    };

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

    const setGameStateFromLog = (index) => {
        setCurrentLogIndex(index);
        setGameState(getGameStateAtLogIndex(gameLog, index));
        setIsPlaying(false);
        setCurrentAction(gameLog[index]);
    };

    // Return all necessary state and functions
    return {
        gameState,
        gameLog,
        currentLogIndex,
        isPlaying,
        isLogGenerated,
        currentAction,
        roster,
        bench,
        bags,
        shop,
        storage,
        handleGenerateLog,
        handlePlayNext,
        handlePlayPause,
        handleRestart,
        setGameStateFromLog,
        resetGameState,
        setShop,
        setStorage,
        setBags,
        setRoster,
        setBench
    };
};

export default useGameState;