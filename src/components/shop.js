import React from 'react';
import { DragdropWrapper, DragBox, DropBox } from './dnd-wrapper';
import { COLORS } from './dnd-wrapper';
import "./shop.css";
import Card from './Card';
import ItemEffect from './ItemEffect';

export function ItemShop({ G, moves, _nextPage }) {
    //For some reason when components (ItemDrag, RosterDrop, etc.) are moved out of this scope where G is destructured
    //Data passed in becomes inconsistent?
    const { roster, bench, bags, storage, gold, shop } = G;
    const isRosterIncomplete = () => roster.some(card => card === null);

    const flattenObject = ({ id, ...rest }) => {
        const [name, value] = Object.entries(rest)[0];
        return { name, ...value };
    };

    const ItemDrag = ({ obj, itemType, bagId, ...props }) => {
        const dragProps = {
            itemType: itemType,
            dragData: { data: obj, itemType, bagId },
            _canDrag: () => true,
            isDraggingStyle: {
                boxSizing: "border-box",
                borderWidth: "4px"
            },
            ...props
        };

        const flat = flattenObject(obj);

        return (
            <DragBox {...dragProps}>
                <ItemEffect key={flat.id} icon={flat.icon} alt={flat.name} text={flat.text} isShopItem={true} shopCost={flat.cost} />
            </DragBox>
        );
    };

    const StorageDrop = ({ children, ...props }) => {
        const dropProps = {
            className: "shop-storage",
            itemType: ["shop", "bag"],
            _canDrop: () => true,
            _afterDrop: ({ data, itemType, bagId }) => {
                if (itemType === "shop") props.moves.buy(data);
                if (itemType === "bag") props.moves.bag2storage(bagId, data);
            },
            canDropStyle: { backgroundColor: COLORS.green },
            isOverStyle: { opacity: "50%" },
            ...props
        };

        return <DropBox {...dropProps}>{children}</DropBox>;
    };

    const ShopDrop = ({ children, ...props }) => {
        const dropProps = {
            className: "shop-shopItems",
            itemType: ["storage", "bag"],
            _canDrop: () => true,
            _afterDrop: ({ data, bagId }) => {
                props.moves.sell(bagId, data)
            },
            canDropStyle: { backgroundColor: COLORS.green },
            isOverStyle: { opacity: "50%" },
            ...props
        };

        return <DropBox {...dropProps}>{children}</DropBox>;
    };

    const BagDrop = ({ bagId, bags, ...props }) => {
        const dropProps = {
            itemType: "storage",
            _canDrop: () => true,
            _afterDrop: ({ data }) => props.moves.storage2bag(bagId, data),
            canDropStyle: { backgroundColor: COLORS.green },
            isOverStyle: { opacity: "50%" },
            ...props
        };

        return (
            <DropBox {...dropProps}>
                <div className="shop-bag-content">
                    {Object.values(bags[bagId]).map((obj, index) => (
                        <ItemDrag itemType="bag" bagId={bagId} obj={obj} key={index} />
                    ))}
                </div>
            </DropBox>
        );
    };

    const RosterDrop = ({ rosterCard, index, ...props }) => {
        const dropProps = {
            className: "shop-roster",
            itemType: "card",
            _canDrop: (item) => item.itemType === "card" && item.from === "bench",
            _afterDrop: ({ card }) => props.moves.bench2roster(index, card),
            canDropStyle: { backgroundColor: COLORS.green },
            isOverStyle: { opacity: "50%" },
            ...props
        };

        return (
            <DropBox {...dropProps}>
                {rosterCard ? (
                    <CardDrag card={rosterCard} from="roster" index={index} />
                ) : (
                    <div className="empty-roster-slot">Drag a card here</div>
                )}
            </DropBox>
        );
    };

    const BenchDrop = ({ bench, ...props }) => {
        const dropProps = {
            className: "shop-bench",
            itemType: "card",
            _canDrop: (item) => item.itemType === "card" && item.from === "roster",
            _afterDrop: ({ card, index }) => props.moves.roster2bench(index, card),
            canDropStyle: { backgroundColor: COLORS.green },
            isOverStyle: { opacity: "50%" },
            ...props
        };

        return (
            <DropBox {...dropProps}>
                Bench
                {bench.map((card, index) => (
                    <CardDrag key={card.id} card={card} index={index} from="bench" />
                ))}
            </DropBox>
        );
    };

    const CardDrag = ({ card, from, index, ...props }) => {
        const dragProps = {
            className: "shop-card-drag",
            itemType: "card",
            dragData: { card: card, itemType: "card", from, index },
            _canDrag: () => true,
            isDraggingStyle: {
                opacity: 0.5,
                boxShadow: '0 0 10px rgba(0,0,0,0.3)'
            },
            ...props
        };

        return (
            <DragBox {...dragProps}>
                <Card {...card} isShopCard={true} />
            </DragBox>
        );
    };

    return (
        <div className="shop-page">
            <button
                className="generate-log-button"
                onClick={() => _nextPage()}
                disabled={isRosterIncomplete()}
            >
                Battle
            </button>
            <DragdropWrapper className='shop-container'>
                <div className='shop-card-1'>
                    <RosterDrop rosterCard={roster[0]} index={0} moves={moves} />
                    <BagDrop bagId={0} bags={bags} moves={moves} />
                </div>
                <div className='shop-card-2'>
                    <RosterDrop rosterCard={roster[1]} index={1} moves={moves} />
                    <BagDrop bagId={1} bags={bags} moves={moves} />
                </div>
                <StorageDrop moves={moves}>
                    Storage
                    {Object.values(storage).map((obj, index) => (
                        <ItemDrag itemType="storage" obj={obj} key={index} />
                    ))}
                </StorageDrop>
                <ShopDrop moves={moves}>
                    Shop, Gold:{gold}
                    {Object.values(shop).map((obj, index) => (
                        <ItemDrag itemType="shop" obj={obj} key={index} />
                    ))}
                </ShopDrop>
                <BenchDrop bench={bench} moves={moves} />
            </DragdropWrapper>
        </div>
    );
}