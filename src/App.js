// src/App.js
import React, { useState, useEffect } from 'react';
import BattleField from './components/Battlefield.js';
import GameLog from './components/GameLog';
import { initialCardData } from './data/cardData';
import { PLAYER_ONE, PLAYER_TWO } from './constants.js'
import { runGameLoop } from './gameLogic';
import './App.css';

function App() {
  const [gameState, setGameState] = useState(null);
  const [gameLog, setGameLog] = useState([]);

  useEffect(() => {
    const { finalState, gameLog } = runGameLoop(initialCardData);
    setGameState(finalState);
    setGameLog(gameLog);
  }, []);

  return (
    <div className="App">
      <div className="game-container">
        {gameState && (
          <BattleField
            player1Cards={gameState[PLAYER_ONE]}
            player2Cards={gameState[PLAYER_TWO]}
          />
        )}
        <GameLog log={gameLog} />
      </div>
    </div>
  );
}

export default App;