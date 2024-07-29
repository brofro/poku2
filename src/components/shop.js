import React from 'react';
import { DragdropWrapper, DragBox, DropBox } from './dnd-wrapper';
import { COLORS } from './dnd-wrapper';
import "./Shop.css"
import Card from './Card';
import ItemEffect from './ItemEffect';

export function ItemShop({ G, moves, _nextPage }) {
    const { roster, bench, bags, storage, shop } = G

    const flattenObject = ({ id, ...rest }) => {
        const [name, value] = Object.entries(rest)[0];
        return { name, ...value };
    };


    const isRosterIncomplete = () => roster.some(card => card === null);


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
            if (itemType === "shop") moves.buy(data);
            if (itemType === "bag") moves.bag2storage(bagId, data)
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
            if (itemType === "storage") moves.storage2bag(bagId, data)
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
    const RosterDrop = ({ rosterCard, index, ...props }) => {
        const p = {};
        p.className = "shop-roster";
        p.itemType = "card";
        p._canDrop = (item) => item.itemType === "card" && item.from === "bench";
        p._afterDrop = ({ card, from }) => {
            if (from === "bench") moves.bench2roster(index, card)
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

    const BenchDrop = ({ bench, ...props }) => {
        const p = {};
        p.className = "shop-bench";
        p.itemType = "card";
        p._canDrop = (item) => item.itemType === "card" && item.from === "roster";
        p._afterDrop = ({ card, from, index }) => {
            if (from === "roster") moves.roster2bench(index, card)
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
        p.dragData = { card: card, itemType: "card", from, index };
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

    return (
        <div className="shop-container">
            <button className="generate-log-button" onClick={() => _nextPage()} disabled={isRosterIncomplete()}>battle</button>
            <DragdropWrapper className="shop-main">
                <div className="shop-bag-container">
                    {Object.keys(bags).map((bagId, index) => (
                        <div key={bagId} className="shop-bag">
                            <RosterDrop
                                rosterCard={roster[index]}
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
                />
            </DragdropWrapper>
        </div>
    );
}