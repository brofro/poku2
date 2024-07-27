import React from 'react';
import Card from './Card';
import { useGame } from '../contexts/GameContext';
import { PLAYER_ONE } from '../data/constants';

const Roster = () => {
    const { roster } = useGame();

    if (!roster || roster.legnth === 0) return null;

    return (
        <div className="roster">
            <h2>Player One Roster</h2>
            <div className="player-area">
                {roster.map((card, index) => (
                    <Card
                        key={`p1-${card.id}`}
                        {...card}
                        player={PLAYER_ONE}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default Roster;