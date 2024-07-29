import { PLAYER_ONE, PLAYER_TWO } from './constants.js';
import cardData151 from './151cardData.json'

export const CARD_DEFINITIONS = cardData151
const baseFormIds = [1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 84, 86, 88, 90, 92, 95, 96, 98, 100, 102, 104, 106, 107, 108, 109, 111, 113, 114, 115, 116, 118, 120, 122, 123, 124, 125, 126, 127, 128, 129, 131, 132, 133, 137, 138, 140, 142, 143, 144, 145, 146, 147, 150, 151]

export const initialCardData = {
    [PLAYER_ONE]: [CARD_DEFINITIONS[143], CARD_DEFINITIONS[Math.floor(Math.random() * 151) + 1]],
    [PLAYER_TWO]: [CARD_DEFINITIONS[Math.floor(Math.random() * 151) + 1], CARD_DEFINITIONS[Math.floor(Math.random() * 151) + 1]],
};