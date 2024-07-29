import React from 'react';
import './ItemEffect.css';
import { Popover, Badge } from 'antd';

const ItemEffect = ({ icon, alt, text, isShopItem, shopCost }) => (
    <Popover content={text}>
        {isShopItem ?
            <Badge count={shopCost} color={"gold"}>
                <img src={icon} alt={alt} className={`item-effect-icon shop-item`} />
            </Badge> :
            <img src={icon} alt={alt} className={"item-effect-icon"} />}
    </Popover>
);

export default ItemEffect;