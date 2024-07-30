import { PLAYER_ONE, PLAYER_TWO, CARD_STATE } from '../data/constants.js';

/**
 * Gets the opposing player
 * @param {string} currentPlayer - The current player
 * @returns {string} The opposing player
 */
export function getOpposingPlayer(currentPlayer) {
    return currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
}

/**
 * Finds the leftmost active card for a player
 * @param {Array} playerCards - The player's cards
 * @returns {Object|null} The leftmost active card or null if none found
 */
export function findLeftmostActiveCard(playerCards) {
    return playerCards.find(card => card.state === CARD_STATE.ACTIVE) || null;
}

/**
 * Finds the leftmost non-fainted card for a player
 * @param {Array} playerCards - The player's cards
 * @returns {Object|null} The leftmost non-fainted card or null if none found
 */
export function findLeftmostNonFaintedCard(playerCards) {
    return playerCards.find(card => card.state !== CARD_STATE.FAINTED) || null;
}

/**
 * Checks if all cards of a player are in a specific state
 * @param {Array} playerCards - The player's cards
 * @param {string} state - The state to check for
 * @returns {boolean} True if all cards are in the specified state, false otherwise
 */
export function areAllCardsInState(playerCards, state) {
    return playerCards.every(card => card.state === state);
}

/**
 * Checks if any cards of a player are in a specific state
 * @param {Array} playerCards - The player's cards
 * @param {string} state - The state to check for
 * @returns {boolean} True if any cards are in the specified state, false otherwise
 */
export function areAnyCardsInState(playerCards, state) {
    return playerCards.some(card => card.state === state);
}

/**
 * Abbreviates a name to 3 letters
 * @param {string} name - The name to abbreviate
 * @returns {string} The abbreviated name
 */
export function abbreviateName(name) {
    return name.substring(0, 3).toUpperCase();
}

export function getGameStateAtLogIndex(gameLog, index) {
    if (index < 0) {
        // Return initial state
        return gameLog[0].board_state;
    }

    for (let i = index; i >= 0; i--) {
        if (gameLog[i].board_state) {
            return gameLog[i].board_state;
        }
    }

    // If no board state found, return the initial state
    return gameLog[0].board_state;
}

/**
 * Checks if a card has an effect and if it is active
 */
export function isEffectActiveOnCard(effectName, card) {
    // Check if card.effects exists and is an array
    if (!card.effects || !Array.isArray(card.effects)) {
        console.log("Invalid card effects structure", card, card.effects)
        return false;
    }

    const effect = card.effects.find(e => e.effect === effectName);
    if (!effect) {
        return false; // Effect not found on the card
    }
    return effect.active;
}