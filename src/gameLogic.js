// src/gameLogic.js

// Card states
const CARD_STATE = {
    ACTIVE: 'ACTIVE',
    FATIGUED: 'FATIGUED',
    FAINTED: 'FAINTED'
};

// Player identifiers
const PLAYER_ONE = 'P1';
const PLAYER_TWO = 'P2';

let actionId = 0;

/**
 * Creates a log entry
 * @param {string} action - The action that occurred
 * @param {Object} data - Additional data about the action
 * @returns {Object} A log entry object
 */
function createLogEntry(action, data) {
    return {
        id: actionId++,
        action,
        ...data
    };
}


/**
 * Initializes a card with game state properties
 * @param {Object} cardData - The original card data
 * @returns {Object} A new card object with added game state properties
 */
function initializeCard(cardData) {
    return {
        ...cardData,
        state: CARD_STATE.ACTIVE,
        currentHp: cardData.hp
    };
}

/**
 * Initializes the game state
 * @param {Object} initialCardData - The initial card data for both players
 * @returns {Object} The initial game state
 */
function initializeGameState(initialCardData) {
    return {
        [PLAYER_ONE]: initialCardData[PLAYER_ONE].map(initializeCard),
        [PLAYER_TWO]: initialCardData[PLAYER_TWO].map(initializeCard),
        currentPlayer: PLAYER_ONE,
        round: 1
    };
}

/**
 * Gets the opposing player
 * @param {string} currentPlayer - The current player
 * @returns {string} The opposing player
 */
function getOpposingPlayer(currentPlayer) {
    return currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
}

/**
 * Finds the leftmost active card for a player
 * @param {Array} playerCards - The player's cards
 * @returns {Object|null} The leftmost active card or null if none found
 */
function findLeftmostActiveCard(playerCards) {
    return playerCards.find(card => card.state === CARD_STATE.ACTIVE) || null;
}

/**
 * Finds the leftmost non-fainted card for a player
 * @param {Array} playerCards - The player's cards
 * @returns {Object|null} The leftmost non-fainted card or null if none found
 */
function findLeftmostNonFaintedCard(playerCards) {
    return playerCards.find(card => card.state !== CARD_STATE.FAINTED) || null;
}

/**
 * Performs an attack between two cards
 * @param {Object} attackerCard - The attacking card
 * @param {Object} defenderCard - The defending card
 * @returns {Object} The updated attacker and defender cards
 */
function performAttack(attackerCard, defenderCard) {
    const updatedAttacker = { ...attackerCard };
    const updatedDefender = { ...defenderCard };

    updatedDefender.currentHp = Math.max(0, defenderCard.currentHp - attackerCard.atk);
    updatedAttacker.currentHp = Math.max(0, attackerCard.currentHp - defenderCard.atk);

    if (updatedDefender.currentHp === 0) {
        updatedDefender.state = CARD_STATE.FAINTED;
    }

    if (updatedAttacker.currentHp === 0) {
        updatedAttacker.state = CARD_STATE.FAINTED;
    } else {
        updatedAttacker.state = CARD_STATE.FATIGUED;
    }

    return { updatedAttacker, updatedDefender };
}

/**
 * Checks if all cards of a player are in a specific state
 * @param {Array} playerCards - The player's cards
 * @param {string} state - The state to check for
 * @returns {boolean} True if all cards are in the specified state, false otherwise
 */
function areAllCardsInState(playerCards, state) {
    return playerCards.every(card => card.state === state);
}

/**
 * Resets the fatigue of all non-fainted cards
 * @param {Array} playerCards - The player's cards
 * @returns {Array} The updated player cards with fatigue reset
 */
function resetFatigue(playerCards) {
    return playerCards.map(card =>
        card.state === CARD_STATE.FATIGUED ? { ...card, state: CARD_STATE.ACTIVE } : card
    );
}

/**
 * Abbreviates a name to 3 letters
 * @param {string} name - The name to abbreviate
 * @returns {string} The abbreviated name
 */
function abbreviateName(name) {
    return name.substring(0, 3).toUpperCase();
}

/**
 * Finds the position of a card in the player's hand
 * @param {Array} playerCards - The player's cards
 * @param {Object} targetCard - The card to find
 * @returns {number} The position of the card (1-based index)
 */
function findCardPosition(playerCards, targetCard) {
    return playerCards.findIndex(card => card.id === targetCard.id);
}

/**
 * Performs a single turn in the game
 * @param {Object} gameState - The current game state
 * @returns {Object} The updated game state after the turn and the log entries
 */
function performTurn(gameState) {
    const currentPlayerCards = gameState[gameState.currentPlayer];
    const opposingPlayer = getOpposingPlayer(gameState.currentPlayer);
    const opposingPlayerCards = gameState[opposingPlayer];

    const attacker = findLeftmostActiveCard(currentPlayerCards);
    const defender = findLeftmostNonFaintedCard(opposingPlayerCards);

    if (!attacker || !defender) {
        // If no valid attacker or defender, switch turns
        return {
            gameState: {
                ...gameState,
                currentPlayer: opposingPlayer
            },
            logEntries: [createLogEntry("TURN_SKIPPED", { log: `${gameState.currentPlayer}_TURN_SKIPPED` })]
        };
    }

    const { updatedAttacker, updatedDefender } = performAttack(attacker, defender);

    const attackerPosition = findCardPosition(currentPlayerCards, attacker);
    const defenderPosition = findCardPosition(opposingPlayerCards, defender);

    const updatedCurrentPlayerCards = currentPlayerCards.map(card =>
        card.id === updatedAttacker.id ? updatedAttacker : card
    );

    const updatedOpposingPlayerCards = opposingPlayerCards.map(card =>
        card.id === updatedDefender.id ? updatedDefender : card
    );

    const updatedGameState = {
        ...gameState,
        [gameState.currentPlayer]: updatedCurrentPlayerCards,
        [opposingPlayer]: updatedOpposingPlayerCards,
        currentPlayer: opposingPlayer
    };

    const logEntries = [
        createLogEntry("ATTACK", {
            log: `${gameState.currentPlayer}_${attackerPosition}(${abbreviateName(attacker.name)})_ATK ${attacker.atk}_${defenderPosition}(${abbreviateName(defender.name)})`
        }),
        createLogEntry("COUNTER_ATTACK", {
            log: `${opposingPlayer}_${defenderPosition}(${abbreviateName(defender.name)})_CATK ${defender.atk}_${attackerPosition}(${abbreviateName(attacker.name)})`
        }),
        createLogEntry("HP_UPDATE", {
            log: `${attackerPosition}(${abbreviateName(attacker.name)})_HP ${updatedAttacker.currentHp}_${defenderPosition}(${abbreviateName(defender.name)})_HP ${updatedDefender.currentHp}`
        })
    ];

    if (updatedAttacker.currentHp <= 0) {
        logEntries.push(createLogEntry("FAINTED", {
            log: `${gameState.currentPlayer}_${attackerPosition}(${abbreviateName(attacker.name)})_FAINTED`
        }));
    }

    if (updatedDefender.currentHp <= 0) {
        logEntries.push(createLogEntry("FAINTED", {
            log: `${opposingPlayer}_${defenderPosition}(${abbreviateName(defender.name)})_FAINTED`
        }));
    }

    return { gameState: updatedGameState, logEntries };
}

/**
 * Checks if the game has ended
 * @param {Object} gameState - The current game state
 * @returns {boolean} True if the game has ended, false otherwise
 */
function isGameOver(gameState) {
    return areAllCardsInState(gameState[PLAYER_ONE], CARD_STATE.FAINTED) ||
        areAllCardsInState(gameState[PLAYER_TWO], CARD_STATE.FAINTED);
}

/**
 * Performs a full round of the game
 * @param {Object} gameState - The current game state
 * @returns {Object} The updated game state after the round and the log entries
 */
function performRound(gameState) {
    let updatedGameState = { ...gameState };
    const logEntries = [];

    while (!areAllCardsInState(updatedGameState[PLAYER_ONE], CARD_STATE.FATIGUED) &&
        !areAllCardsInState(updatedGameState[PLAYER_TWO], CARD_STATE.FATIGUED) &&
        !isGameOver(updatedGameState)) {
        const { gameState: newState, logEntries: turnLogEntries } = performTurn(updatedGameState);
        updatedGameState = newState;
        logEntries.push(...turnLogEntries);
    }

    // Reset fatigue for both players
    updatedGameState[PLAYER_ONE] = resetFatigue(updatedGameState[PLAYER_ONE]);
    updatedGameState[PLAYER_TWO] = resetFatigue(updatedGameState[PLAYER_TWO]);

    logEntries.push(createLogEntry("ROUND_END", { log: `ROUND_${updatedGameState.round}_END` }));

    return {
        gameState: {
            ...updatedGameState,
            round: updatedGameState.round + 1,
            currentPlayer: PLAYER_ONE // Reset to player one for the next round
        },
        logEntries
    };
}

/**
 * Runs the main game loop
 * @param {Object} initialCardData - The initial card data for both players
 * @returns {Object} The final game state and the complete game log
 */
function runGameLoop(initialCardData) {
    let gameState = initializeGameState(initialCardData);
    const gameLog = [createLogEntry("GAME_START", { initialState: gameState })];

    while (!isGameOver(gameState)) {
        const { gameState: newState, logEntries } = performRound(gameState);
        gameState = newState;
        gameLog.push(...logEntries);
    }

    gameLog.push(createLogEntry("GAME_END", { finalState: gameState }));

    return { finalState: gameState, gameLog };
}

export {
    CARD_STATE,
    PLAYER_ONE,
    PLAYER_TWO,
    initializeGameState,
    performTurn,
    performRound,
    runGameLoop,
    isGameOver
};