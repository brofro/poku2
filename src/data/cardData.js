import { PLAYER_ONE, PLAYER_TWO } from '../constants.js';

export const getImageUrl = (pokemonNumber) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonNumber}.png`;

export const CARD_DEFINITIONS = {
    155: {
        id: 155,
        name: "Cyndaquil",
        atk: 2,
        hp: 2,
        divineShield: true
    },
    158: {
        id: 158,
        name: "Totodile",
        atk: 3,
        hp: 3,
    },
    143: {
        id: 143,
        name: "Snorlax",
        atk: 1,
        hp: 5,
        deathrattle() {
            return {
                id: 143,
                name: "Munchlax",
                atk: 1,
                hp: 1,
                currentHp: 1,
                img: getImageUrl(446)
            }
        }
    },
    152: {
        id: 152,
        name: "Chikorita",
        atk: 1,
        hp: 4,
    },
};

export const initialCardData = {
    [PLAYER_ONE]: [CARD_DEFINITIONS[155], CARD_DEFINITIONS[158]],
    [PLAYER_TWO]: [CARD_DEFINITIONS[143], CARD_DEFINITIONS[152]],
};