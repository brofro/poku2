import { useEffect, useRef, React } from 'react';
import { ATK_ICON, HP_ICON, getImageUrl } from '../data/constants';
import '../css/Card.css';
import ItemEffect from './ItemEffect';

const Card = ({ id, img, name, atk, hp, currentHp, state, effects, isAttacking, isCounterAttacking, isShopCard }) => {
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

    if (isShopCard) cardClasses.push('shop-card')

    // Add appropriate classes based on the card's state
    if (state === 'FATIGUED') cardClasses.push('fatigued');
    if (state === 'FAINTED') cardClasses.push('fainted');
    if (isAttacking) cardClasses.push('attacking');
    if (isCounterAttacking) cardClasses.push('counter-attacking');
    //if (divineShield) cardClasses.push('divine-shield');

    return (
        <div className={cardClasses.join(' ')}>
            {/* Card image */}
            <div className="card-image-container">
                <img src={img || getImageUrl(id)} alt={`${name} #${id}`} className="card-image" />
                {effects && effects.length > 0 && (
                    <div className='card-icons'>
                        {effects.map(effect =>
                            effect.active ? (
                                <ItemEffect
                                    key={effect.id}
                                    icon={effect.icon}
                                    alt={effect.effect}
                                    text={effect.text}
                                />
                            ) : null
                        )}
                    </div>
                )}
            </div>
            {/* Card information */}
            <div className="card-info">
                {/* Card stats */}
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
    );
};

export default Card;