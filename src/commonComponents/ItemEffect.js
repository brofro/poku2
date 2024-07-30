import React from 'react';
import '../css/ItemEffect.css';
import { Popover } from 'antd';

const ItemEffect = ({ icon, alt, text, isShopItem }) => (
    <Popover content={text}>
        {isShopItem ?
            <img src={icon} alt={alt} className={`item-effect-icon shop-item`} />
            :
            <img src={icon} alt={alt} className={"item-effect-icon"} />}
    </Popover>
);

export default ItemEffect;