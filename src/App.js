import React, { useState, useEffect } from 'react';
import BattleField from './components/Battlefield.js';
import GameLog from './components/GameLog';
import ControlButtons from './components/ControlButtons';
import { initialCardData } from './data/cardData';
import { PLAYER_ONE, PLAYER_TWO } from './constants.js'
import { runGameLoop, getGameStateAtLogIndex } from './gameLogic';
import './App.css';

function App() {
  const [gameState, setGameState] = useState(null);
  const [gameLog, setGameLog] = useState([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);

  useEffect(() => {
    const { finalState, gameLog } = runGameLoop(initialCardData);
    setGameState(getGameStateAtLogIndex(gameLog, -1));
    setGameLog(gameLog);
  }, []);

  useEffect(() => {
    if (currentLogIndex >= 0 && currentLogIndex < gameLog.length) {
      const action = gameLog[currentLogIndex];
      console.log('Current action:', action); // Debug log
      if (action.action === 'ATTACK' || action.action === 'COUNTER_ATTACK') {
        setCurrentAction({
          type: action.action,
          playerIndex: action.action_details.sourceCardPosition < 2 ? 0 : 1,
          cardId: action.action_details.sourceCardPosition % 2
        });
      } else {
        setCurrentAction(null);
      }
    } else {
      setCurrentAction(null);
    }
  }, [currentLogIndex, gameLog]);

  const handlePlayNext = () => {
    if (currentLogIndex < gameLog.length - 1) {
      setCurrentLogIndex(prevIndex => prevIndex + 1);
      setGameState(getGameStateAtLogIndex(gameLog, currentLogIndex + 1));
    }
  };



  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentLogIndex(-1);
    setGameState(getGameStateAtLogIndex(gameLog, -1));
    setIsPlaying(false);
  };

  return (
    <div className="App">
      <div className="game-container">
        <ControlButtons
          onPlayNext={handlePlayNext}
          onPlayPause={handlePlayPause}
          onRestart={handleRestart}
          isPlaying={isPlaying}
        />
        <div className="battlefield-container">
          {gameState && (
            <BattleField
              player1Cards={gameState[PLAYER_ONE]}
              player2Cards={gameState[PLAYER_TWO]}
              currentAction={currentAction}
            />
          )}
        </div>
        <GameLog log={gameLog} currentLogIndex={currentLogIndex} />
      </div>
    </div>
  );
}

export default App;