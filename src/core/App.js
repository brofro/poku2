import React from 'react';
import './App.css';
import BattleField from '../components/Battlefield';
import ControlButtons from '../components/ControlButtons';
import GameLog from '../components/GameLog';
import GenerateLogButton from '../components/GenerateLogButton';
import { GameProvider } from '../contexts/GameContext';

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
            <GenerateLogButton />

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