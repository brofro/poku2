import React from 'react';
import { Tooltip } from 'react-tooltip';
import { ATK_ICON, HP_ICON } from '../constants';
import { getImageUrl } from '../data/cardData';
import './Card.css';
import rangedicon from './ranged.svg'
import deathrattleicon from './deathrattle.svg';
import divineshieldicon from './divineshield.svg';

const Card = ({ id, img, name, atk, hp, currentHp, state, player, index, isAttacking, isCounterAttacking, divineShield, ranged, deathrattleText }) => {
    // Initialize an array of CSS classes for the card
    const cardClasses = ['card'];

    // Add appropriate classes based on the card's state
    if (state === 'FATIGUED') cardClasses.push('fatigued');
    if (state === 'FAINTED') cardClasses.push('fainted');
    if (isAttacking) cardClasses.push('attacking');
    if (isCounterAttacking) cardClasses.push('counter-attacking');
    if (divineShield) cardClasses.push('divine-shield');

    return (
        <div className={cardClasses.join(' ')}>
            {/* Card image */}
            <div className="card-image-container">
                <img src={img || getImageUrl(id)} alt={`${name} #${id}`} className="card-image" />
                <div className='card-icons'>
                    {ranged && <img src={rangedicon} alt="Ranged" className="card-icon" data-tooltip-id='icon-tooltip' data-tooltip-content="Ranged: This card does not take counter-attack damage" />}
                    {deathrattleText && <img src={deathrattleicon} alt="Deathrattle" className="card-icon" data-tooltip-id='icon-tooltip' data-tooltip-content={`Deathrattle: ${deathrattleText}`} />}
                    {divineShield && <img src={divineshieldicon} alt="Divine Shield" className="card-icon" data-tooltip-id='icon-tooltip' data-tooltip-content="Divine Shield: This card negates the first instance of damage" />}
                </div>
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
            <Tooltip id="icon-tooltip" />
        </div>
    );
};

export default Card;