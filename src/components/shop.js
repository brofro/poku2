import React, { useState } from 'react';
import { DragdropWrapper, DragBox, DropBox } from './dnd-wrapper';
import { COLORS } from './dnd-wrapper';
import "./shop.css"
import Card from './Card';
import { useGame } from '../contexts/GameContext';
import ItemEffect from './ItemEffect';

export const test_shop_items = {
    id1: { id: "id1", name: "divine shield" },
    id2: { id: "id2", name: "onDeath1/1" },
    id3: { id: "id3", name: "support: +2atk" },
    id4: { id: "id4", name: "ranged" }
};

export function ItemShop(props) {
    const [shop, setShop] = useState(props.shopItems);
    const [storage, setStorage] = useState({});
    const [bags, setBags] = useState(props.bagData);
    const [roster, setRoster] = useState(props.roster);

    const remove = (id, obj) => {
        const copy = { ...obj };
        delete copy[id];
        return copy;
    };

    const ItemCard = ({ obj, ...props }) => {
        return <img src={obj.icon} />;
    };

    const flattenObject = ({ id, ...rest }) => {
        const [name, value] = Object.entries(rest)[0];
        return { name, ...value };
    };

    const ItemDrag = ({ obj, itemType, bagId, ...props }) => {
        const p = {};
        p.className = "shop-item-card";
        p.itemType = itemType; //"shop", "storage", "bag"
        p.dragData = { data: obj, itemType, bagId };
        p._canDrag = () => true;
        p.isDraggingStyle = {
            boxSizing: "border-box",
            borderWidth: "4px"
        };

        const flat = flattenObject(obj)

        return (
            <DragBox {...p} {...props}>
                <ItemEffect key={flat.id} icon={flat.icon} alt={flat.name} isShopItem={true} />
            </DragBox>
        );
    };

    const StorageDrop = (props) => {
        const p = {};
        p.className = "shop-storage";
        p.itemType = ["shop", "bag"];
        p._canDrop = () => true;
        p._afterDrop = ({ data, itemType, bagId }) => {
            if (itemType === "shop") setShop(remove(data.id, shop));
            if (itemType === "bag")
                setBags({ ...bags, [bagId]: remove(data.id, bags[bagId]) });
            setStorage({ ...storage, [data.id]: data });
        };
        p.canDropStyle = { backgroundColor: COLORS.green };
        p.isOverStyle = { opacity: "50%" };

        return <DropBox {...p} {...props} />;
    };

    const BagDrop = ({ bagId, ...props }) => {
        const p = {};
        p.itemType = "storage";
        p._canDrop = () => true;
        p._afterDrop = ({ data, itemType }) => {
            //storage to bag
            if (itemType === "storage") {
                setStorage(remove(data.id, storage));
                setBags({ ...bags, [bagId]: { ...bags[bagId], [data.id]: data } });
            }
        };
        p.canDropStyle = { backgroundColor: COLORS.green };
        p.isOverStyle = { opacity: "50%" };
        return (
            <DropBox {...p} {...props}>
                {bagId}
                {Object.values(bags[bagId]).map((obj, index) => (
                    <ItemDrag itemType="bag" bagId={bagId} obj={obj} key={index} />
                ))}
            </DropBox>
        );
    };

    return (
        <div className="shop-container">
            <DragdropWrapper className="shop-main">
                <div className="shop-bag-container">
                    {Object.keys(bags).map((bagId, index) => (
                        <div key={bagId} className="shop-bag">
                            <div className="shop-roster">
                                {roster[index] && (
                                    <Card
                                        {...roster[index]}
                                    />
                                )}
                            </div>
                            <BagDrop bagId={bagId} className="shop-bag-box">
                                {bagId}
                                {Object.values(bags[bagId]).map((obj, idx) => (
                                    <ItemDrag itemType="bag" bagId={bagId} obj={obj} key={idx} />
                                ))}
                            </BagDrop>
                        </div>
                    ))}
                </div>
                <StorageDrop className="shop-storage">
                    storage
                    {Object.values(storage).map((obj, index) => (
                        <ItemDrag itemType="storage" obj={obj} key={index} />
                    ))}
                </StorageDrop>
                <div className="shop-items">
                    shop
                    {Object.values(shop).map((obj, index) => (
                        <ItemDrag itemType="shop" obj={obj} key={index} />
                    ))}
                </div>
            </DragdropWrapper>
        </div>
    );
}