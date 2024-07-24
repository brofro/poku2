import React from 'react';
import Card from './Card';
import { useGame } from '../contexts/GameContext';
import { PLAYER_ONE, PLAYER_TWO } from '../constants';

const BattleField = () => {
    // Get the current game state from our GameContext
    const { gameState } = useGame();

    // If the game state hasn't been initialized yet, don't render anything
    if (!gameState) return null;

    return (
        <div className="battlefield">
            {/* Player Two's area (typically displayed at the top) */}
            <div className="player-area player-two">
                {/* Map through Player Two's cards and render each one */}
                {gameState[PLAYER_TWO].map((card, index) => (
                    <Card
                        key={`p2-${card.id}`} // Unique key for React list rendering
                        {...card} // Spread all card properties
                        player={PLAYER_TWO} // Specify this is a Player Two card
                        index={index} // Pass the index of the card in the player's hand
                    />
                ))}
            </div>
            {/* Player One's area (typically displayed at the bottom) */}
            <div className="player-area player-one">
                {/* Map through Player One's cards and render each one */}
                {gameState[PLAYER_ONE].map((card, index) => (
                    <Card
                        key={`p1-${card.id}`} // Unique key for React list rendering
                        {...card} // Spread all card properties
                        player={PLAYER_ONE} // Specify this is a Player One card
                        index={index} // Pass the index of the card in the player's hand
                    />
                ))}
            </div>
        </div>
    );
};

export default BattleField;