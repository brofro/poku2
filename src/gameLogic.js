import { PLAYER_ONE, PLAYER_TWO, CARD_STATE, ACTION_TYPES } from './constants.js';

let actionId = 0;
let gameLog = [];

/**
 * Creates a log entry and adds it to the global gameLog
 * @param {string} action - The action that occurred
 * @param {Object} data - Additional data about the action
 * @returns {Object} The created log entry
 */
function createLogEntry(action, data) {
    const baseEntry = {
        id: actionId++,
        action,
        log: data.log
    };

    let logEntry;

    switch (action) {
        case ACTION_TYPES.ATTACK:
        case ACTION_TYPES.COUNTER_ATTACK:
            logEntry = {
                ...baseEntry,
                action_details: {
                    actingPlayer: data.actingPlayer,
                    sourceCardPosition: data.sourceCardPosition,
                    sourceCardName: data.sourceCardName,
                    attackValue: data.attackValue,
                    targetCardPosition: data.targetCardPosition,
                    targetCardName: data.targetCardName
                }
            };
            break;
        case ACTION_TYPES.FAINTED:
            logEntry = {
                ...baseEntry,
                action_details: {
                    faintedCardPos: data.faintedCardPos,
                    faintedCardName: data.faintedCardName
                }
            };
            break;
        case ACTION_TYPES.DEATHRATTLE:
            logEntry = {
                ...baseEntry,
                board_state: data.boardState,
                action_details: {
                    triggeredCard: data.sourceCardName
                }
            }
            break;
        case ACTION_TYPES.HP_UPDATE:
        case ACTION_TYPES.ROUND_END:
        case ACTION_TYPES.GAME_END:
        case ACTION_TYPES.GAME_START:
            logEntry = {
                ...baseEntry,
                board_state: data.boardState
            };
            break;
        default:
            logEntry = baseEntry;
    }

    gameLog.push(logEntry);
    return logEntry;
}


/**
 * Initializes a card with game state properties
 * @param {Object} cardData - The original card data
 * @returns {Object} A new card object with added game state properties
 */
function initializeCard(cardData) {
    return {
        ...cardData,
        id: cardData.id,
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

function handleFainted(card) {
    if (card.currentHp <= 0) {
        card.state = CARD_STATE.FAINTED;

        if (card.deathrattle && !card.triggeredDeathrattle) {
            console.log(card.name)

            card = { ...card, ...card.deathrattle(), state: CARD_STATE.FATIGUED, triggeredDeathrattle: true }
        }
    }
    return card;
}

/**
 * Performs an attack between two cards
 * @param {Object} attackerCard - The attacking card
 * @param {Object} defenderCard - The defending card
 * @returns {Object} The updated attacker and defender cards
 */
function performAttack(attackerCard, defenderCard) {
    let updatedAttacker = { ...attackerCard };
    let updatedDefender = { ...defenderCard };

    updatedDefender.currentHp = Math.max(0, defenderCard.currentHp - attackerCard.atk);
    updatedAttacker.currentHp = Math.max(0, attackerCard.currentHp - defenderCard.atk);

    console.log(attackerCard.name, defenderCard.name)

    updatedAttacker = { ...updatedAttacker, ...handleFainted(updatedAttacker) }
    updatedDefender = { ...updatedDefender, ...handleFainted(updatedDefender) }

    updatedAttacker.state = updatedAttacker.state === CARD_STATE.FAINTED ? CARD_STATE.FAINTED : CARD_STATE.FATIGUED;


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
 * Checks if any cards of a player are in a specific state
 * @param {Array} playerCards - The player's cards
 * @param {string} state - The state to check for
 * @returns {boolean} True if any cards are in the specified state, false otherwise
 */
function areAnyCardsInState(playerCards, state) {
    return playerCards.some(card => card.state === state);
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
 * Gets the current board state
 * @param {Object} gameState - The current game state
 * @returns {Object} The current board state
 */
function getBoardState(gameState) {
    return {
        [PLAYER_ONE]: gameState[PLAYER_ONE].map(card => ({
            ...card,
            position: findCardPosition(gameState[PLAYER_ONE], card),
        })),
        [PLAYER_TWO]: gameState[PLAYER_TWO].map(card => ({
            ...card,
            position: findCardPosition(gameState[PLAYER_TWO], card),
        })),
        currentPlayer: gameState.currentPlayer,
        round: gameState.round
    };
}

/**
 * Performs a single turn in the game
 * @param {Object} gameState - The current game state
 * @returns {Object} The updated game state after the turn and the log entries
 */
function performTurn(gameState) {
    // Get the current player's cards and determine the opposing player
    const currentPlayerCards = gameState[gameState.currentPlayer];
    const opposingPlayer = getOpposingPlayer(gameState.currentPlayer);
    const opposingPlayerCards = gameState[opposingPlayer];

    // Find the first active card for the current player and the first non-fainted card for the opponent
    const attacker = findLeftmostActiveCard(currentPlayerCards);
    const defender = findLeftmostNonFaintedCard(opposingPlayerCards);

    // If either player has no valid cards, skip the turn
    if (!attacker || !defender) {
        return {
            gameState: {
                ...gameState,
                currentPlayer: opposingPlayer // Switch to the other player
            },
            logEntries: [createLogEntry(ACTION_TYPES.TURN_SKIPPED, { log: `${gameState.currentPlayer}_${ACTION_TYPES.TURN_SKIPPED}` })]
        };
    }

    // Perform the attack and get the updated attacker and defender cards
    const { updatedAttacker, updatedDefender } = performAttack(attacker, defender);

    // Find the positions of the attacker and defender in their respective card lists
    const attackerPosition = findCardPosition(currentPlayerCards, attacker);
    const defenderPosition = findCardPosition(opposingPlayerCards, defender);

    // Update the current player's card list with the new attacker state
    const updatedCurrentPlayerCards = currentPlayerCards.map(card =>
        card.id === updatedAttacker.id ? updatedAttacker : card
    );

    // Update the opposing player's card list with the new defender state
    const updatedOpposingPlayerCards = opposingPlayerCards.map(card =>
        card.id === updatedDefender.id ? updatedDefender : card
    );

    // Create the updated game state
    const updatedGameState = {
        ...gameState,
        [gameState.currentPlayer]: updatedCurrentPlayerCards,
        [opposingPlayer]: updatedOpposingPlayerCards,
        currentPlayer: opposingPlayer // Switch to the other player for the next turn
    };
    createLogEntry(ACTION_TYPES.ATTACK, {
        log: `${gameState.currentPlayer}_${attackerPosition}(${abbreviateName(attacker.name)})_ATK ${attacker.atk}_${defenderPosition}(${abbreviateName(defender.name)})`,
        actingPlayer: gameState.currentPlayer,
        sourceCardPosition: attackerPosition,
        sourceCardName: attacker.name,
        attackValue: attacker.atk,
        targetCardPosition: defenderPosition,
        targetCardName: defender.name
    });

    createLogEntry(ACTION_TYPES.COUNTER_ATTACK, {
        log: `${opposingPlayer}_${defenderPosition}(${abbreviateName(defender.name)})_ATK ${defender.atk}_${attackerPosition}(${abbreviateName(attacker.name)})`,
        actingPlayer: opposingPlayer,
        sourceCardPosition: defenderPosition,
        sourceCardName: defender.name,
        attackValue: defender.atk,
        targetCardPosition: attackerPosition,
        targetCardName: attacker.name
    });

    createLogEntry(ACTION_TYPES.HP_UPDATE, {
        log: `${attackerPosition}(${abbreviateName(attacker.name)})_HP ${updatedAttacker.currentHp} ${defenderPosition}(${abbreviateName(defender.name)})_HP ${updatedDefender.currentHp}`,
        boardState: getBoardState(updatedGameState)
    });

    if (updatedAttacker.triggeredDeathrattle) {
        createLogEntry(ACTION_TYPES.DEATHRATTLE, {
            log: `${updatedAttacker.name} triggered deathrattle`,
            sourceCardName: updatedAttacker.name,
            boardState: getBoardState(updatedGameState)
        })
    }

    if (updatedDefender.triggeredDeathrattle) {
        createLogEntry(ACTION_TYPES.DEATHRATTLE, {
            log: `${updatedDefender.name} triggered deathrattle`,
            sourceCardName: updatedDefender.name,
            boardState: getBoardState(updatedGameState)
        })
    }

    if (updatedAttacker.currentHp <= 0) {
        createLogEntry(ACTION_TYPES.FAINTED, {
            log: `${gameState.currentPlayer}_${attackerPosition}(${abbreviateName(attacker.name)})_FAINTED`,
            faintedCardPos: attackerPosition,
            faintedCardName: attacker.name
        });
    }

    if (updatedDefender.currentHp <= 0) {
        createLogEntry(ACTION_TYPES.FAINTED, {
            log: `${opposingPlayer}_${defenderPosition}(${abbreviateName(defender.name)})_FAINTED`,
            faintedCardPos: defenderPosition,
            faintedCardName: defender.name
        });
    }

    return { gameState: updatedGameState };
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

    while ((areAnyCardsInState(updatedGameState[PLAYER_ONE], CARD_STATE.ACTIVE) ||
        areAnyCardsInState(updatedGameState[PLAYER_TWO], CARD_STATE.ACTIVE)) &&
        !isGameOver(updatedGameState)) {
        const { gameState: newState } = performTurn(updatedGameState);
        updatedGameState = newState;
    }

    updatedGameState[PLAYER_ONE] = resetFatigue(updatedGameState[PLAYER_ONE]);
    updatedGameState[PLAYER_TWO] = resetFatigue(updatedGameState[PLAYER_TWO]);

    createLogEntry(ACTION_TYPES.ROUND_END, {
        log: `ROUND_${updatedGameState.round}_END`,
        boardState: getBoardState(updatedGameState)
    });

    return {
        gameState: {
            ...updatedGameState,
            round: updatedGameState.round + 1,
            currentPlayer: PLAYER_ONE
        }
    };
}

function getGameStateAtLogIndex(gameLog, index) {
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
 * Runs the main game loop
 * @param {Object} initialCardData - The initial card data for both players
 * @returns {Object} The final game state and the complete game log
 */
function runGameLoop(initialCardData) {
    gameLog = []; // Reset the game log
    actionId = 0; // Reset the action ID counter
    let gameState = initializeGameState(initialCardData);

    createLogEntry(ACTION_TYPES.GAME_START, {
        log: ACTION_TYPES.GAME_START,
        boardState: getBoardState(gameState)
    });

    while (!isGameOver(gameState)) {
        const { gameState: newState } = performRound(gameState);
        gameState = newState;
    }

    createLogEntry(ACTION_TYPES.GAME_END, {
        log: ACTION_TYPES.GAME_END,
        boardState: getBoardState(gameState)
    });

    return { finalState: gameState, gameLog };
}

export {
    initializeGameState,
    performTurn,
    performRound,
    runGameLoop,
    isGameOver,
    getGameStateAtLogIndex
};