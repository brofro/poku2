import React from 'react';
import Card from './Card';
import { PLAYER_ONE, PLAYER_TWO } from '../data/constants';

const BattleField = ({ gameState, currentAction, isLogGenerated }) => {

    // If the game state hasn't been initialized, don't render anything
    if (!isLogGenerated) return null;
    if (!gameState) return null;

    // Helper function to determine if a specific card is currently attacking
    const isCardAttacking = (player, index) => {
        // Check if there's a current action and it's an attack
        return currentAction &&
            currentAction.action === 'ATTACK' &&
            // Check if the card position matches the source of the attack
            currentAction.action_details.sourceCardPosition === index &&
            // Check if the player matches the source of the attack
            player === currentAction.action_details.actingPlayer
    };

    // Helper function to determine if a specific card is currently counter-attacking
    const isCardCounterAttacking = (player, index) => {
        // Check if there's a current action and it's a counter-attack
        return currentAction &&
            currentAction.action === 'COUNTER_ATTACK' &&
            // Check if the card position matches the source of the counter-attack
            currentAction.action_details.sourceCardPosition === index &&
            // Check if the player matches the source of the counter-attack
            player === currentAction.action_details.actingPlayer;
    };



    return (
        <div className="battlefield">
            {/* Player Two's area (typically displayed at the top) */}
            <div className="player-area player-two">
                {gameState[PLAYER_TWO].map((card, index) => (
                    <Card
                        key={`p2-${card.id}`}
                        {...card}
                        player={PLAYER_TWO}
                        index={index}
                        // Pass down whether this specific card is attacking
                        isAttacking={isCardAttacking(PLAYER_TWO, index)}
                        isCounterAttacking={isCardCounterAttacking(PLAYER_TWO, index)}
                    />
                ))}
            </div>
            {/* Player One's area (typically displayed at the bottom) */}
            <div className="player-area player-one">
                {gameState[PLAYER_ONE].map((card, index) => (
                    <Card
                        key={`p1-${card.id}`}
                        {...card}
                        player={PLAYER_ONE}
                        index={index}
                        // Pass down whether this specific card is attacking
                        isAttacking={isCardAttacking(PLAYER_ONE, index)}
                        isCounterAttacking={isCardCounterAttacking(PLAYER_ONE, index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BattleField;