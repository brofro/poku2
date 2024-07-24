import React from 'react';
import { ATK_ICON, HP_ICON } from '../constants';
import { getImageUrl } from '../data/cardData'
import './Card.css';

const Card = ({ id, name, img, atk, hp, currentHp, state }) => {
    const cardClasses = ['card'];
    if (state === 'FATIGUED') cardClasses.push('fatigued');
    if (state === 'FAINTED') cardClasses.push('fainted');


    return (
        <div className={cardClasses.join(' ')}>
            <div className="card-image-container">
                <img src={getImageUrl(id)} alt={`${name} #${id}`} className="card-image" />
            </div>
            <div className="card-info">
                <div className="card-name">{name} #{id}</div>
                <div className="card-stats">
                    <div className="card-stat">
                        <img src={ATK_ICON} alt="Attack" className="stat-icon" />
                        <span>{atk}</span>
                    </div>
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