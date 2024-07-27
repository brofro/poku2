import React from 'react';
import './ItemEffect.css';

const ItemEffect = ({ icon, alt }) => (
    <img src={icon} alt={alt} className="item-effect-icon" />
);

export default ItemEffect;