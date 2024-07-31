import React, { useEffect, useRef } from 'react';
import { Badge, message } from 'antd';
import { DragdropWrapper, DragBox, DropBox } from './dnd-wrapper';
import { COLORS } from './dnd-wrapper';
import { affordable, calculateCardCost } from './shopUtils';
import "../css/shop.css";
import Card from '../commonComponents/Card';
import ItemEffect from '../commonComponents/ItemEffect';
import BagEdit from './inventory/BagEdit';
import { RESULT } from '../data/constants';

export function ItemShop({ G, moves, _nextPage }) {
    //For some reason when components (ItemDrag, RosterDrop, etc.) are moved out of this scope where G is destructured
    //Data passed in becomes inconsistent?
    const { roster, bench, bags, storage, gold, shop, wild, playerResult, shopLevel } = G;
    const [messageApi, contextHold] = message.useMessage();
    const [editBagId, setEditBagId] = React.useState(null)

    const isRosterIncomplete = () => roster.some(card => card === null);

    const ItemDrag = ({ item, itemType, bagId, ...props }) => {
        const dragProps = {
            itemType: itemType,
            dragData: { data: item, itemType, bagId },
            _canDrag: () => true,
            isDraggingStyle: {
                boxSizing: "border-box",
                borderWidth: "4px"
            },
            ...props
        };

        return (
            <DragBox {...dragProps}>
                <Badge count={item.cost} color={"gold"}>
                    <ItemEffect key={item.id} icon={item.icon} alt={item.effect} text={item.text} isShopItem={true} shopCost={item.cost} rarity={item.staticRarity ? item.staticRarity : item.rarityDetails.rarity} dynamicText={item.dynamicText} />
                </Badge>
            </DragBox>
        );
    };

    const StorageDrop = ({ children, ...props }) => {
        const dropProps = {
            className: "shop-storage",
            itemType: ["shop", "bag"],
            _canDrop: () => true,
            _afterDrop: ({ data, itemType, bagId }) => {
                if (itemType === "shop") {
                    if (affordable(data, gold)) props.moves.buyItem(data)
                    else messageApi.open({ type: 'error', content: 'Not enough gold' })
                }
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

    const RosterDrop = ({ rosterCard, index, ...props }) => {
        const dropProps = {
            className: "shop-roster",
            itemType: "card",
            _canDrop: (item) => item.itemType === "card" && (item.from === "bench" || item.from === "wild"),
            _afterDrop: (dragged) => {
                if (dragged.from === "bench") {

                    props.moves.bench2roster(index, dragged.card)
                }
                if (dragged.from === "wild") {
                    if (affordable(dragged.card, gold)) props.moves.buyCard(index, dragged.card)
                    else messageApi.open({ type: 'error', content: 'Not enough gold' })

                }
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
                if (dragged.from === "roster") props.moves.roster2bench(dragged.index, dragged.card)
                if (dragged.from === "wild") {

                    if (affordable(dragged.card, gold)) props.moves.buyCard(-1, dragged.card)
                    else messageApi.open({ type: 'error', content: 'Not enough gold' })

                }
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
                    //This is the only time card cost is calculated for now
                    <Badge count={calculateCardCost(rosterCard)} color={"gold"}>
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

    //Game result
    const winEffectRan = useRef(false)
    useEffect(() => {
        if (winEffectRan.current === false) {
            if (playerResult === RESULT.WIN) {
                moves.increaseShopLevel()
                messageApi.open({ type: 'success', content: 'You win! +3 gold' })
                moves.addGold(3)
            }
            if (playerResult === RESULT.LOSE) messageApi.open({ type: 'error', content: 'You Lost!' })

            if (playerResult === RESULT.TIE) messageApi.open({ type: 'warning', content: 'Draw' })
        }
        winEffectRan.current = true
    }, [playerResult])

    return editBagId !== null ? <BagEdit bagId={editBagId} _storageToBag={(data) => moves.storage2bag(editBagId, data)} bag={bags[editBagId]} storage={storage} _back={() => setEditBagId(null)} /> :
        <div className="shop-page">
            {contextHold}
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
                    <button onClick={() => setEditBagId(0)}>edit bag{0}: {bags[0].length}</button>
                </div>
                <div className='shop-card-2'>
                    <RosterDrop rosterCard={roster[1]} index={1} moves={moves} />
                    <button onClick={() => setEditBagId(1)}>edit bag{1}: {bags[1].length}</button>
                </div>
                <StorageDrop moves={moves}>
                    Storage
                    {storage.map((item) => (
                        <ItemDrag itemType="storage" item={item} key={item.id} />
                    ))}
                </StorageDrop>
                <ShopDrop moves={moves}>
                    Shop Level: {shopLevel}, Gold:{gold}
                    {shop.map((item) => (
                        <ItemDrag itemType="shop" item={item} key={item.id} />
                    ))}
                </ShopDrop>
                <BenchDrop bench={bench} moves={moves} />
            </DragdropWrapper>
        </div>

}