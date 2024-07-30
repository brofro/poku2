import { getNewTeam } from "../data/cardData";
import { initialShopData } from "../data/effectsData";
import { generateMultipleItems } from "../data/itemUtils";
import { INVALID_MOVE } from "boardgame.io/core";

const Game = {
    setup: () => ({
        gold: 10,
        storage: [],
        bags: [[], []],
        roster: [null, null],
        P2: getNewTeam(2),
        bench: getNewTeam(2),
        shop: generateMultipleItems(5),
        wild: getNewTeam(1)[0]
    }),
    moves: {
        //Currently only supports shop->storage
        buyItem: ({ G }, item) => {
            if (item.cost <= G.gold) {
                G.shop = G.shop.filter(shopItem => shopItem.id !== item.id);
                G.storage.push(item)
                G.gold -= item.cost;
            }
            else return INVALID_MOVE
        },
        buyCard: ({ G }, index, data) => {
            const cost = (data.atk + data.hp) * 2 + data.spd
            if (cost <= G.gold) {
                G.wild = null
                if (index < 0) G.bench = [...G.bench, data]
                //repeated code
                else {
                    let currentCard = null
                    if (G.roster[index] !== null) currentCard = G.roster[index]
                    G.roster[index] = data
                    G.bench = G.bench.filter(benchCards => benchCards.id !== data.id)
                    if (currentCard !== null) G.bench.push(currentCard)
                }
                G.gold -= cost
            }

        },
        sellItem: ({ G }, bagId, item) => {
            //Currently unsupported
            //Should probably not be operating on undefined
            if (bagId !== undefined) {
                G.bags[bagId] = G.bags[bagId].filter(bagItem => bagItem.id !== item.id)
            }
            else G.storage = G.storage.filter(storageItem => storageItem.id !== item.id)
            G.gold += item.cost
        },
        sellCard: ({ G }, rosterId, data) => {
            if (rosterId < 0) {
                G.bench = G.bench.filter(benchCards => benchCards.id !== data.id)
            }
            else G.roster[rosterId] = null
            //always sells for 10 gold
            G.gold += 10
        },
        bag2storage: ({ G }, bagId, item) => {
            //Currently not supported
            G.bags[bagId] = G.bags[bagId].filter(bagItem => bagItem.id !== item.id)
            G.storage.push(item)
        },
        storage2bag: ({ G }, bagId, item) => {
            G.bags[bagId].push(item)
            G.storage = G.storage.filter(storageItems => storageItems.id !== item.id)
        },
        bench2roster: ({ G }, index, card) => {
            let currentCard = null
            //if theres a current card in slot, take it and put it into bench
            if (G.roster[index] !== null) currentCard = G.roster[index]
            G.roster[index] = card
            G.bench = G.bench.filter(benchCards => benchCards.id !== card.id)
            if (currentCard !== null) G.bench.push(currentCard)
        },
        roster2bench: ({ G }, index, card) => {
            G.bench = [...G.bench, card]
            G.roster[index] = null
        },
        addGold: ({ G }, amount) => {
            G.gold += amount
        },
        getNewOpponent: ({ G }) => {
            G.P2 = getNewTeam(2)
        },
        setNewWildCard: ({ G }) => {
            G.wild = getNewTeam(1)[0]
        },
        setNewShop: ({ G }) => {
            G.shop = generateMultipleItems(5)
        }
    }
}

export default Game