// src/App.js
import React from 'react';
import BattleField from './components/Battlefield.js';
import { initialCardData, PLAYER_ONE, PLAYER_TWO } from './data/cardData';
import './App.css';

function App() {
  return (
    <div className="App">
      <BattleField 
        player1Cards={initialCardData[PLAYER_ONE]}
        player2Cards={initialCardData[PLAYER_TWO]}
      />
    </div>
  );
}

export default App;