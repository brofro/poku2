import React from 'react';
import BattleField from './components/Battlefield';
import GameLog from './components/GameLog';
import ControlButtons from './components/ControlButtons';
import { GameProvider } from './contexts/GameContext';
import './App.css';

function App() {
  return (
    // Wrap the entire app with the GameProvider to make game state available everywhere
    <GameProvider>
      <div className="App">
        <div className="game-container">
          {/* Control buttons for game flow */}
          <ControlButtons />
          <div className="battlefield-container">
            {/* The main game board */}
            <BattleField />
          </div>
          {/* Log of game actions */}
          <GameLog />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;