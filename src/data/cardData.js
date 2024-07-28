import { PLAYER_ONE, PLAYER_TWO } from './constants.js';
import cardData151 from './151cardData.json'

const CARD_DEFINITIONS = cardData151

export const initialCardData = {
    [PLAYER_ONE]: [CARD_DEFINITIONS[Math.floor(Math.random() * 151) + 1], CARD_DEFINITIONS[Math.floor(Math.random() * 151) + 1]],
    [PLAYER_TWO]: [CARD_DEFINITIONS[Math.floor(Math.random() * 151) + 1], CARD_DEFINITIONS[Math.floor(Math.random() * 151) + 1]],
};