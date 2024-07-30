import { getNewTeam } from "../data/cardData";
import { initialShopData } from "../data/effectsData";

const Game = {
    setup: () => ({
        gold: 10,
        storage: {},
        bags: { 0: {}, 1: {} },
        roster: [null, null],
        P2: getNewTeam(2),
        bench: getNewTeam(2),
        shop: initialShopData,
        wild: getNewTeam(1)[0]
    }),
    moves: {
        //Should buy/sell just look up how much it cost vs. bubbling it in selectedEffects?
        buyItem: ({ G }, data) => {
            if (data.cost <= G.gold) {
                delete G.shop[data.id]
                G.storage[data.id] = data
                G.gold -= data.cost
            }
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
        sellItem: ({ G }, bagId, data) => {
            if (bagId !== undefined) {
                delete G.bags[bagId][data.id]
            }
            else delete G.storage[data.id]
            G.gold += data.cost
        },
        sellCard: ({ G }, rosterId, data) => {
            if (rosterId < 0) {
                G.bench = G.bench.filter(benchCards => benchCards.id !== data.id)
            }
            else G.roster[rosterId] = null
            //always sells for 10 gold
            G.gold += 10
        },
        bag2storage: ({ G }, bagId, data) => {
            delete G.bags[bagId][data.id]
            G.storage[data.id] = data
        },
        storage2bag: ({ G }, bagId, data) => {
            G.bags[bagId][data.id] = data
            delete G.storage[data.id]
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
        }
    }
}

export default Game