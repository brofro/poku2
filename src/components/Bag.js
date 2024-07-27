import React from 'react';
import { useGame } from '../contexts/GameContext';
import { PLAYER_ONE } from '../data/constants';

const Bag = () => {
    const { bag } = useGame();

    if (!bag || bag.length === 0) return null;

    return (
        <div className="bag">
            <h2>Player One Bag</h2>
            <div className="player-area">
                {bag.map((item, index) => (
                    <div key={`bag-${index}`} className="bag-item">
                        {item.divineShield && <span>Divine Shield</span>}
                        {item.ranged && <span>Ranged</span>}
                        {item.deathrattleText && <span>{item.deathrattleText}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bag;