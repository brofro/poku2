import { initialCardData } from "../data/cardData";
import { PLAYER_ONE, PLAYER_TWO } from "../data/constants";
import { initialShopData } from "../data/effectsData";

const Game = {
    setup: () => ({
        gold: 10,
        storage: {},
        board: {},
        bags: { 0: {}, 1: {} },
        roster: [null, null],
        P2: initialCardData[PLAYER_TWO],
        bench: initialCardData[PLAYER_ONE],
        shop: initialShopData,
        b1: {}, b2: {}, b3: {}
    }),
    moves: {
        buy: ({ G }, data) => {
            delete G.shop[data.id]
            G.storage[data.id] = data
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
            G.roster[index] = card
            G.bench = G.bench.filter(benchCards => benchCards.id !== card.id)
        },
        roster2bench: ({ G }, index, card) => {
            G.bench = [...G.bench, card]
            G.roster[index] = null
        }
    }
}

export default Game