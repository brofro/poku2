import React from 'react';
import './ItemEffect.css';

const ItemEffect = ({ icon, alt, isShopItem }) => (
    <img src={icon} alt={alt} className={`item-effect-icon ${isShopItem ? 'shop-item' : ''}`} />
);

export default ItemEffect;