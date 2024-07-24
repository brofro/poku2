import { PLAYER_ONE, PLAYER_TWO } from '../constants.js';
export const CARD_DEFINITIONS = {
    CYNDAQUIL: {
        id: 'CYNDAQUIL',
        name: "Cyndaquil",
        img: "https://veekun.com/dex/media/pokemon/dream-world/155.svg",
        atk: 2,
        hp: 2,
    },
    TOTODILE: {
        id: 'TOTODILE',
        name: "Totodile",
        img: "https://veekun.com/dex/media/pokemon/dream-world/158.svg",
        atk: 3,
        hp: 3,
    },
    SNORLAX: {
        id: 'SNORLAX',
        name: "Snorlax",
        img: "https://veekun.com/dex/media/pokemon/dream-world/143.svg",
        atk: 1,
        hp: 5,
    },
    CHIKORITA: {
        id: 'CHIKORITA',
        name: "Chikorita",
        img: "https://veekun.com/dex/media/pokemon/dream-world/152.svg",
        atk: 1,
        hp: 1,
    },
};



export const initialCardData = {
    [PLAYER_ONE]: [CARD_DEFINITIONS.CYNDAQUIL, CARD_DEFINITIONS.TOTODILE],
    [PLAYER_TWO]: [CARD_DEFINITIONS.SNORLAX, CARD_DEFINITIONS.CHIKORITA],
};