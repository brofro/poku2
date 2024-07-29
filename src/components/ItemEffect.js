import React from 'react';
import './ItemEffect.css';
import { Popover } from 'antd';

const ItemEffect = ({ icon, alt, text, isShopItem }) => (
    <Popover content={text}>
        <img src={icon} alt={alt} className={`item-effect-icon ${isShopItem ? 'shop-item' : ''}`} />
    </Popover>
);

export default ItemEffect;