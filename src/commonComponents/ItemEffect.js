import React from 'react';
import '../css/ItemEffect.css';
import { Popover } from 'antd';


const ItemEffect = ({ icon, alt, text, rarity, isShopItem }) => {
    const rarityClass = `rarity-${rarity.toLowerCase()}`;
    const shopClass = isShopItem ? 'shop-item' : '';

    return (
        <Popover content={text}>
            <img
                src={icon}
                alt={alt}
                className={`item-effect-icon ${rarityClass} ${shopClass}`}
            />
        </Popover>
    );
};

export default ItemEffect;