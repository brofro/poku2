import { getNewTeam, getGymLeader, getTestCards } from "../data/cardData";
import { generateMultipleItems } from "../data/itemUtils";
import { INVALID_MOVE } from "boardgame.io/core";

const Game = {
    setup: () => ({
        //set isMobile on game start
        isMobile: window.innerWidth <= 768,
        gymLevel: 0,
        gold: 10,
        storage: [],
        bags: [[], []],
        roster: getTestCards(),
        P2: getGymLeader(0),
        bench: getNewTeam(2),
        shop: generateMultipleItems(5),
        wild: getNewTeam(1)[0],
        shopLevel: 0,
        playerResult: null,
        lastGameLog: []
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
            if (currentCard !== null) G.bench.push(currentCard)
            //Put it in roster
            G.roster[index] = card
            //Remove the FIRST instance of matching id from bench (this wont work if the cards are unique)
            const indexToRemove = G.bench.findIndex(benchCard => benchCard.id === card.id);
            if (indexToRemove !== -1) G.bench = [...G.bench.slice(0, indexToRemove), ...G.bench.slice(indexToRemove + 1)]
        },
        roster2bench: ({ G }, index, card) => {
            G.bench = [...G.bench, card]
            G.roster[index] = null
        },
        addGold: ({ G }, amount) => {
            G.gold += amount
        },
        getNewOpponent: ({ G }) => {
            //Get new gym leader win or lose
            G.gymLevel += 1
            G.P2 = getGymLeader(Math.min(G.gymLevel, 12))
        },
        setNewWildCard: ({ G }) => {
            G.wild = getNewTeam(1)[0]
        },
        setNewShop: ({ G }) => {
            G.shop = generateMultipleItems(5)
        },
        setPlayerResult: ({ G }, result) => {
            G.playerResult = result
        },
        increaseShopLevel: ({ G }) => {
            G.shopLevel += 0.01
        },
        setGameLog: ({ G }, gameLog) => {
            G.lastGameLog = gameLog
        }
    }
}

export default Game