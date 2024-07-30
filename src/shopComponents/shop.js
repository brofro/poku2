import React from 'react';
import { Badge } from 'antd';
import { DragdropWrapper, DragBox, DropBox } from './dnd-wrapper';
import { COLORS } from './dnd-wrapper';
import "../css/shop.css";
import Card from '../commonComponents/Card';
import ItemEffect from '../commonComponents/ItemEffect';
import ShapeView from './inventory/ShapeView';
import BagGrid from './inventory/BagGrid';

export function ItemShop({ G, moves, _nextPage }) {
    //For some reason when components (ItemDrag, RosterDrop, etc.) are moved out of this scope where G is destructured
    //Data passed in becomes inconsistent?
    const { roster, bench, bags, storage, gold, shop, wild } = G;
    const isRosterIncomplete = () => roster.some(card => card === null);

    const flattenObject = ({ id, shape, ...rest }) => {
        const [name, value] = Object.entries(rest)[0];
        return { name, ...value };
    };

    const ItemDrag = ({ item, itemType, bagId, sIndex = 0, ...props }) => {
        const [shapeIndex, setShapeIndex] = React.useState(sIndex)


        const dragProps = {
            dependencyArr: [shapeIndex],
            itemType: itemType,
            dragData: { data: item, itemType, bagId, shape: item.shape[shapeIndex] },
            _canDrag: () => true,
            isDraggingStyle: {
                boxSizing: "border-box",
                borderWidth: "4px"
            },
            ...props
        };

        const rotate = () => shapeIndex < 3 ? setShapeIndex(shapeIndex + 1) : setShapeIndex(0)

        return (
            <DragBox {...dragProps}>
                <Badge count={item.cost} color={"gold"}>
                    <ItemEffect key={item.id} icon={item.icon} alt={item.name} text={item.text} isShopItem={true} shopCost={item.cost} />
                </Badge>
                <ShapeView shapes={item.shape} shapeIndex={shapeIndex} _rotate={rotate} />
            </DragBox>
        );
    };

    const StorageDrop = ({ children, ...props }) => {
        const dropProps = {
            className: "shop-storage",
            itemType: ["shop", "bag"],
            _canDrop: () => true,
            _afterDrop: ({ data, itemType, bagId }) => {
                if (itemType === "shop") props.moves.buyItem(data);
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
                props.moves.sellItem(bagId, data)
            },
            canDropStyle: { backgroundColor: COLORS.green },
            isOverStyle: { opacity: "50%" },
            ...props
        };

        return <DropBox {...dropProps}>{children}</DropBox>;
    };

    const BagDrop = ({ bagId }) => {
        const addItem = (data) => {
            moves.storage2bag(bagId, data)
        }
        //Workaround for now, turns it back to {index:item}
        const gridCompatibleBag = bags[bagId].reduce((obj, item, index) => ({ ...obj, [index]: item }), {})
        return <BagGrid _addItem={addItem} bagItems={gridCompatibleBag} />
    };

    const RosterDrop = ({ rosterCard, index, ...props }) => {
        const dropProps = {
            className: "shop-roster",
            itemType: "card",
            _canDrop: (item) => item.itemType === "card" && (item.from === "bench" || item.from === "wild"),
            _afterDrop: (dragged) => {
                if (dragged.from === "bench") {

                    props.moves.bench2roster(index, dragged.card)
                }
                if (dragged.from === "wild") props.moves.buyCard(index, dragged.card)
            },
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
            _canDrop: (item) => item.itemType === "card" && (item.from === "roster" || item.from === "wild"),
            _afterDrop: (dragged) => {
                console.log(dragged)
                if (dragged.from === "roster") props.moves.roster2bench(dragged.index, dragged.card)
                if (dragged.from === "wild") props.moves.buyCard(-1, dragged.card)
            },
            canDropStyle: { backgroundColor: COLORS.green },
            isOverStyle: { opacity: "50%" },
            ...props
        };

        return (
            <DropBox {...dropProps}>
                Bench
                {bench.map((card, index) => (
                    <CardDrag key={card.id} card={card} index={-1} from="bench" />
                ))}
            </DropBox>
        );
    };

    const WildDrop = ({ rosterCard, index, ...props }) => {
        const dropProps = {
            className: "shop-wild",
            itemType: "card",
            _canDrop: (item) => item.itemType === "card" && (item.from === "bench" || item.from === "roster"),
            _afterDrop: (dragged) => props.moves.sellCard(dragged.index, dragged.card),
            canDropStyle: { backgroundColor: COLORS.green },
            isOverStyle: { opacity: "50%" },
            ...props
        };

        return (
            <DropBox {...dropProps}>
                {rosterCard ? (
                    <Badge count={(rosterCard.atk + rosterCard.hp) * 2 + rosterCard.spd} color={"gold"}>
                        <CardDrag card={rosterCard} from="wild" index={-1} />
                    </Badge>
                ) : (
                    <div className="">Sell Card for 10g</div>
                )}
            </DropBox>
        );
    };

    const CardDrag = ({ card, from, index, ...props }) => {
        const dragProps = {
            className: "shop-card-drag",
            itemType: "card",
            from: from,
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
                <WildDrop rosterCard={wild} index={-1} moves={moves} />
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
                    {storage.map((item) => (
                        <ItemDrag itemType="storage" item={item} key={item.id} />
                    ))}
                </StorageDrop>
                <ShopDrop moves={moves}>
                    Shop, Gold:{gold}
                    {shop.map((item) => (
                        <ItemDrag itemType="shop" item={item} key={item.id} />
                    ))}
                </ShopDrop>
                <BenchDrop bench={bench} moves={moves} />
            </DragdropWrapper>
        </div>
    );
}