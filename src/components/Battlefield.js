import React from 'react';
import Card from './Card';

const BattleField = ({ player1Cards, player2Cards, currentAction }) => {

    return (
        <div className="battlefield">
            <div className="player-area player-two">
                {player2Cards.map((card) => (
                    <Card key={`p2-${card.id}`} {...card} />
                ))}
            </div>
            <div className="player-area player-one">
                {player1Cards.map((card) => (
                    <Card key={`p1-${card.id}`} {...card} />
                ))}
            </div>
        </div>
    );
};

export default BattleField;