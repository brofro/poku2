import React, { createContext, useContext } from 'react';
import useGameState from '../hooks/useGameState';

// Create a new context for our game
const GameContext = createContext();

// This component will wrap our entire app and provide the game state to all children
export const GameProvider = ({ children }) => {
    // Use our custom hook to manage all game state
    const gameState = useGameState();

    // Provide the game state to all children components
    return <GameContext.Provider value={gameState}>{children}</GameContext.Provider>;
};

// This custom hook allows easy access to the game context in any component
export const useGame = () => useContext(GameContext);