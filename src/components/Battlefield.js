// src/components/BattleField.js
import React from 'react';
import Card from './Card';

const BattleField = ({ player1Cards, player2Cards }) => {
    return (
        <div className="battlefield">
            <div className="player-area player-two">
                {player2Cards.map((card, index) => (
                    <Card key={`p2-${index}`} {...card} />
                ))}
            </div>
            <div className="player-area player-one">
                {player1Cards.map((card, index) => (
                    <Card key={`p1-${index}`} {...card} />
                ))}
            </div>
        </div>
    );
};

export default BattleField;