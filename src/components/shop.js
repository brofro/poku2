import React from 'react';
import { DragdropWrapper, DragBox, DropBox } from './dnd-wrapper';
import { COLORS } from './dnd-wrapper';
import "./shop.css"
import Card from './Card';
import { useGame } from '../contexts/GameContext';
import ItemEffect from './ItemEffect';

export function ItemShop() {
    const { roster, setRoster, bench, setBench, shop, setShop, bags, setBags, storage, setStorage } = useGame();


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

    //Card DND
    const RosterDrop = ({ rosterCard, setRosterCard, removeBenchCard, index, ...props }) => {
        const p = {};
        p.className = "shop-roster";
        p.itemType = "card";
        p._canDrop = (item) => item.itemType === "card" && item.from === "bench";
        p._afterDrop = ({ data, from }) => {
            if (from === "bench") {
                setRosterCard(index, data);
                removeBenchCard(data.id);
            }
        };
        p.canDropStyle = { backgroundColor: COLORS.green };
        p.isOverStyle = { opacity: "50%" };

        return (
            <DropBox {...p} {...props}>
                {rosterCard ? (
                    <CardDrag card={rosterCard} from="roster" index={index} />
                ) : (
                    <div className="empty-roster-slot">Drag a card here</div>
                )}
            </DropBox>
        );
    };

    const BenchDrop = ({ bench, setBench, removeRosterCard, ...props }) => {
        const p = {};
        p.className = "shop-bench";
        p.itemType = "card";
        p._canDrop = (item) => item.itemType === "card" && item.from === "roster";
        p._afterDrop = ({ data, from, index }) => {
            if (from === "roster") {
                setBench(prev => [...prev, data]);
                removeRosterCard(index);
            }
        };
        p.canDropStyle = { backgroundColor: COLORS.green };
        p.isOverStyle = { opacity: "50%" };

        return (
            <DropBox {...p} {...props}>
                {bench.map((card, index) => (
                    <CardDrag key={card.id} card={card} index={index} from="bench" />
                ))}
            </DropBox>
        );
    };


    const CardDrag = ({ card, from, index, ...props }) => {
        const p = {};
        p.className = "shop-card-drag";
        p.itemType = "card";
        p.dragData = { data: card, itemType: "card", from, index };
        p._canDrag = () => true;
        p.isDraggingStyle = {
            opacity: 0.5,
            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        };

        return (
            <DragBox {...p} {...props}>
                <Card {...card} isShopCard={true} />
            </DragBox>
        );
    };


    const removeBenchCard = (cardId) => {
        setBench(prev => prev.filter(card => card.id !== cardId));
    };

    const setRosterCard = (index, card) => {
        setRoster(prev => {
            const newRoster = [...prev];
            newRoster[index] = card;
            return newRoster;
        });
    };

    const removeRosterCard = (index) => {
        setRoster(prev => {
            const newRoster = [...prev];
            newRoster[index] = null;
            return newRoster;
        });
    };

    return (
        <div className="shop-container">
            <DragdropWrapper className="shop-main">
                <div className="shop-bag-container">
                    {Object.keys(bags).map((bagId, index) => (
                        <div key={bagId} className="shop-bag">
                            {/* <div className="shop-roster">
                                {roster[index] && (
                                    <Card
                                        {...roster[index]}
                                    />
                                )}
                            </div> */}
                            <RosterDrop
                                rosterCard={roster[index]}
                                setRosterCard={setRosterCard}
                                removeBenchCard={removeBenchCard}
                                index={index}
                            />
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
                <BenchDrop
                    bench={bench}
                    setBench={setBench}
                    removeRosterCard={removeRosterCard}
                />
            </DragdropWrapper>
        </div>
    );
}