import React from "react";
import { useState, useEffect } from "react";
import ControlButtons from '../components/ControlButtons';
import GameLog from '../components/GameLog';
import { runGameLoop } from "../core/gameLogic";
import { getGameStateAtLogIndex } from "../core/gameLogicUtils";
import { PLAYER_ONE, PLAYER_TWO, PLAY_SPEED } from "../data/constants";
import BattleField from "../components/Battlefield";

const BattleDebug = ({ G, moves, _nextPage }) => {
    const [gameState, setGameState] = useState(null);  // Current state of the game board
    const [gameLog, setGameLog] = useState([]);  // Log of all game actions
    const [currentLogIndex, setCurrentLogIndex] = useState(-1);  // Index of current action in the log
    const [isPlaying, setIsPlaying] = useState(false);  // Whether the game is auto-playing
    const [currentAction, setCurrentAction] = useState(null);  // The current action being performed
    const [isLogGenerated, setIsLogGenerated] = useState(false);
    const [playerWin, setPlayerWin] = useState(false)

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

    useEffect(() => {
        const { playerWin, gameLog } = runGameLoop({ [PLAYER_ONE]: G.roster, [PLAYER_TWO]: G.P2 }, G.bags)
        setPlayerWin(playerWin)
        setGameLog(gameLog)
        setGameState(getGameStateAtLogIndex(gameLog, -1));
        setIsLogGenerated(true);
        moves.getNewOpponent()
        moves.setNewWildCard()
    }, [])

    useEffect(() => {
        if (playerWin) moves.addGold(5)
    }, [playerWin, gameLog])


    return (
        <div className="game-container">
            {/* Control buttons for game flow */}
            <ControlButtons handlePlayNext={handlePlayNext} handlePlayPause={handlePlayPause} handleRestart={handleRestart} isPlaying={isPlaying} isLogGenerated={isLogGenerated} />
            <div className="battlefield-container">
                <button className="generate-log-button" onClick={_nextPage}>Shop </button>

                {/* The main game board */}

                <BattleField gameState={gameState} currentAction={currentAction} isLogGenerated={isLogGenerated} />

            </div>
            {/* Log of game actions */}
            <GameLog gameLog={gameLog} currentLogIndex={currentLogIndex} isLogGenerated={isLogGenerated} setGameStateFromLog={setGameStateFromLog} />
        </div>
    )
}

export default BattleDebug