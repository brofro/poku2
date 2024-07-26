import { useEffect, useRef, React } from 'react';
import { ATK_ICON, HP_ICON, getImageUrl } from '../constants';
import './Card.css';
import rangedicon from './ranged.svg'
import deathrattleicon from './deathrattle.svg';
import divineshieldicon from './divineshield.svg';

const Card = ({ id, img, name, atk, hp, currentHp, state, player, index, isAttacking, isCounterAttacking, divineShield, ranged, deathrattleText }) => {
    const healthRef = useRef(null);

    useEffect(() => {
        if (healthRef.current) {
            healthRef.current.classList.add('changed');
            setTimeout(() => {
                healthRef.current?.classList.remove('changed');
            }, 1000);
        }
    }, [currentHp]);

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
                    {ranged && <img src={rangedicon} alt="Ranged" className="card-icon" />}
                    {deathrattleText && <img src={deathrattleicon} alt="Deathrattle" className="card-icon" />}
                    {divineShield && <img src={divineshieldicon} alt="Divine Shield" className="card-icon" />}
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
                    <div ref={healthRef} className="card-stat health">
                        <img src={HP_ICON} alt="Health" className="stat-icon" />
                        <span>{currentHp}/{hp}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;