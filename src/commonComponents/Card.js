import { useEffect, useState, useRef, React } from 'react';
import { motion } from 'framer-motion';
import { ATK_ICON, HP_ICON, getImageUrl } from '../data/constants';
import '../css/Card.css';
import '../css/CardAnimations.css'
import ItemEffect from './ItemEffect';

const Card = ({ id, img, name, atk, hp, currentHp, state, effects, divineShield, damageToShow, isAttacking, isCounterAttacking, isDefending, isShopCard }) => {
    const healthRef = useRef(null);
    const [showDamage, setShowDamage] = useState(false);

    //glows HP if it changed
    useEffect(() => {
        if (healthRef.current) {
            healthRef.current.classList.add('changed');
            setTimeout(() => {
                healthRef.current?.classList.remove('changed');
            }, 1000);
        }
    }, [currentHp]);

    //Damage ticker
    useEffect(() => {
        if (damageToShow !== null && damageToShow !== undefined) {
            setShowDamage(true);
            setTimeout(() => setShowDamage(false), 1000);
        }
    }, [damageToShow]);

    // Animation variants
    const cardVariants = {
        idle: { scale: 1, x: 0, y: 0, rotate: 0 },
        attacking: {
            scale: [1, 1.2, 0.9, 1],
            x: [0, 40, -10, 0],
            y: [0, -10, 5, 0],
            rotate: [0, 10, -2, 0],
            transition: {
                duration: 0.6,
                times: [0, 0.4, 0.7, 1],
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1
            }
        },
        counterAttacking: {
            scale: [1, 1.05, 1],
            x: [0, 10, 0],
            rotate: [0, -3, 0],
            transition: {
                duration: 0.5,
                times: [0, 0.5, 1],
                repeat: Infinity,
                repeatDelay: 1
            }
        },
        defending: {
            scale: [1, 0.95, 1],
            y: [0, 5, 0],
            transition: {
                duration: 0.5,
                times: [0, 0.5, 1],
                repeat: Infinity,
                repeatDelay: 1
            }
        }
    };

    // Determine the current animation state
    let animationState = 'idle';
    if (isAttacking) animationState = 'attacking';
    if (isCounterAttacking) animationState = 'counterAttacking';
    if (isDefending) animationState = 'defending';

    // Initialize an array of CSS classes for the card
    const cardClasses = ['card'];

    if (isShopCard) cardClasses.push('shop-card')

    // Add appropriate classes based on the card's state
    if (state === 'FATIGUED') cardClasses.push('fatigued');
    if (state === 'FAINTED') cardClasses.push('fainted');
    if (isAttacking) cardClasses.push('attacking');
    if (isCounterAttacking) cardClasses.push('counter-attacking');
    if (divineShield) cardClasses.push('divine-shield');

    return (
        <motion.div
            className={cardClasses}
            variants={cardVariants}
            animate={animationState}
        >
            <div className={cardClasses.join(' ')}>
                {showDamage && damageToShow !== null && damageToShow !== undefined && (
                    <span className={`damage-number animate ${damageToShow === 0 ? 'blocked' : ''}`}>
                        {damageToShow === 0 ? '0' : damageToShow}
                    </span>
                )}
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
                                        rarity={effect.staticRarity ? effect.staticRarity : effect.rarityDetails.rarity}
                                        dynamicText={effect.dynamicText}
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
        </motion.div>
    );
};

export default Card;