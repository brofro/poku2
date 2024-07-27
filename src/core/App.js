import React from 'react';
import './App.css';
import BattleField from '../components/Battlefield';
import ControlButtons from '../components/ControlButtons';
import GameLog from '../components/GameLog';
import GenerateLogButton from '../components/GenerateLogButton';
import { GameProvider, useGame } from '../contexts/GameContext';
import Roster from '../components/Roster';

function AppContent() {
  const { isLogGenerated } = useGame()

  return <div className="App">
    <div className="game-container">
      {/* Control buttons for game flow */}
      <ControlButtons />
      <div className="battlefield-container">
        {/* The main game board */}
        <GenerateLogButton />
        {isLogGenerated ? (
          <BattleField />
        ) : (
          <>
            <Roster />
          </>
        )}
      </div>
      {/* Log of game actions */}
      <GameLog />
    </div>
  </div>

}

function App() {
  return (
    // Wrap the entire app with the GameProvider to make game state available everywhere
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;