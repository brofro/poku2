import React, { useState } from 'react';
import { DragdropWrapper, DragBox, DropBox } from './dnd-wrapper';
import { COLORS } from './dnd-wrapper';
import "./shop.css"

const numShopItems = 3;
const numBags = 3;

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

    const remove = (id, obj) => {
        const copy = { ...obj };
        delete copy[id];
        return copy;
    };

    const ItemCard = ({ obj, ...props }) => {
        return <pre>{JSON.stringify(obj, null, 2)}</pre>;
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
        return (
            <DragBox {...p} {...props}>
                <ItemCard obj={obj} {...props} />
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
            <div className="shop-guide">
                <ol>
                    <li>you have x monies</li>
                    <li>dragndrop from shop into storage</li>
                    <li>dragndrop storage into bag</li>
                </ol>
            </div>
            <DragdropWrapper className="shop-main">
                <div className="shop-bag">
                    bag
                    {Object.keys(bags).map((bagId) => (
                        <BagDrop bagId={bagId} className="shop-bag-box" key={bagId} />
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