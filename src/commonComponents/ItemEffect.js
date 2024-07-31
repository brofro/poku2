import React from 'react';
import '../css/ItemEffect.css';
import { Popover, Space, Typography, Card } from 'antd';
import { ITEM_RARITY } from '../data/constants';

const { Text } = Typography


const ItemEffect = ({ icon, alt, text, rarity, isShopItem, dynamicText }) => {
    const rarityClass = `rarity-${rarity.toLowerCase()}`;
    const shopClass = isShopItem ? 'shop-item' : '';

    const rarityColors = {
        [ITEM_RARITY.COMMON]: "black",
        [ITEM_RARITY.UNCOMMON]: "green",
        [ITEM_RARITY.RARE]: "blue",
        [ITEM_RARITY.EPIC]: "purple",
        [ITEM_RARITY.LEGENDARY]: "orange"
    }

    const details = (
        <Card size='small' bordered={false}

            title={
                <>
                    <Text>{alt.charAt(0).toUpperCase() + alt.slice(1)}</Text>
                    <Text strong style={{ color: rarityColors[rarity] }}>{` [${rarity}]`}</Text>
                </>
            }>
            <Space direction='vertical'>
                <Text italic>{text}</Text>
                <Text>{dynamicText}</Text>
            </Space>
        </Card>
    );

    return (
        <Popover placement="bottom" content={details}>
            <img
                src={icon}
                alt={alt}
                className={`item-effect-icon ${rarityClass} ${shopClass}`}
            />
        </Popover>
    );
};

export default ItemEffect;