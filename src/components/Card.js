import React from 'react';
import { ATK_ICON, HP_ICON } from '../constants';
import { getImageUrl } from '../data/cardData';
import './Card.css';

const Card = ({ id, img, name, atk, hp, currentHp, state, player, index, isAttacking, isCounterAttacking }) => {
    // Initialize an array of CSS classes for the card
    const cardClasses = ['card'];

    // Add appropriate classes based on the card's state
    if (state === 'FATIGUED') cardClasses.push('fatigued');
    if (state === 'FAINTED') cardClasses.push('fainted');
    // Add 'attacking' class if the card is currently attacking
    if (isAttacking) cardClasses.push('attacking');
    if (isCounterAttacking) cardClasses.push('counter-attacking');

    return (
        <div className={cardClasses.join(' ')}>
            {/* Card image */}
            <div className="card-image-container">
                <img src={img || getImageUrl(id)} alt={`${name} #${id}`} className="card-image" />
            </div>
            {/* Card information */}
            <div className="card-info">
                {/* Card name and ID */}
                <div className="card-name">{name} #{id}</div>
                {/* Card stats */}
                <div className="card-stats">
                    {/* Attack stat */}
                    <div className="card-stat">
                        <img src={ATK_ICON} alt="Attack" className="stat-icon" />
                        <span>{atk}</span>
                    </div>
                    {/* Health stat */}
                    <div className="card-stat">
                        <img src={HP_ICON} alt="Health" className="stat-icon" />
                        <span>{currentHp}/{hp}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;