import React from "react";
import { useState, useEffect, useRef } from "react";
import { Button, FloatButton, Image, Flex } from "antd";
import "../css/BattleDebug.css"
import ControlButtons from './ControlButtons';
import GameLog from './GameLog';
import { getGameStateAtLogIndex } from "../core/gameLogicUtils";
import { PLAY_SPEED } from "../data/constants";
import BattleField from "../commonComponents/Battlefield";
import shopicon from "../icons/shop.svg"

const BattleDebug = ({ G, _nextPage }) => {
    const [gameState, setGameState] = useState(null);  // Current state of the game board
    // const [gameLog, setGameLog] = useState([]);  // Log of all game actions
    const [currentLogIndex, setCurrentLogIndex] = useState(-1);  // Index of current action in the log
    const [isPlaying, setIsPlaying] = useState(true);  // Whether the game is auto-playing
    const [currentAction, setCurrentAction] = useState(null);  // The current action being performed
    const [isLogGenerated, setIsLogGenerated] = useState(false);

    //Strict mode workaround
    // const gameLoopRan = useRef(false)

    const { lastGameLog: gameLog, isMobile } = G

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
            // If starting to play, only reset if we're at the end of the log
            if (currentLogIndex >= gameLog.length - 1) {
                setCurrentLogIndex(-1);
                setGameState(getGameStateAtLogIndex(gameLog, -1));
            }
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
        setGameState(getGameStateAtLogIndex(gameLog, -1));
        setIsLogGenerated(true);

        // // Start auto-play after log generation
        setCurrentLogIndex(-1);
        setIsPlaying(true);

    }, [])



    return (
        <>
            {isMobile ? (
                <FloatButton
                    onClick={_nextPage}
                    icon={<Image src={shopicon} preview={false} />}
                    type="primary"
                    style={{ right: 24, top: 24 }}
                >
                    Shop
                </FloatButton>
            ) : (

                <Flex justify='center' align='center' style={{ width: '100%', marginTop: '20px' }}>
                    <Button
                        onClick={_nextPage}
                        type="primary"
                        disabled={isPlaying}
                        style={{ width: '25%' }}
                    >
                        Back to Shop
                    </Button>
                </Flex>
            )}
            <div className="game-container">
                {!isMobile && (
                    <ControlButtons
                        handlePlayNext={handlePlayNext}
                        handlePlayPause={handlePlayPause}
                        handleRestart={handleRestart}
                        isPlaying={isPlaying}
                        isLogGenerated={isLogGenerated}
                    />
                )}
                <div className={`battlefield-container${isMobile ? ' mobile' : ''}`}>
                    <BattleField gameState={gameState} currentAction={currentAction} isLogGenerated={isLogGenerated} />
                </div>
                {!isMobile && (
                    <GameLog
                        gameLog={gameLog}
                        currentLogIndex={currentLogIndex}
                        isLogGenerated={isLogGenerated}
                        setGameStateFromLog={setGameStateFromLog}
                    />
                )}
            </div>
        </>
    )
}

export default BattleDebug