import React from 'react';
import './App.css';
import BattleField from '../components/Battlefield';
import ControlButtons from '../components/ControlButtons';
import GameLog from '../components/GameLog';
import GenerateLogButton from '../components/GenerateLogButton';
import { GameProvider, useGame } from '../contexts/GameContext';
import Roster from '../components/Roster';
import { ItemShop, test_shop_items } from '../shop';

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
            <ItemShop shopItems={test_shop_items} bagData={{ b1: {}, b2: {}, b3: {} }} />
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