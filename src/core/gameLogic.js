import { PLAYER_ONE, PLAYER_TWO, CARD_STATE, ACTION_TYPES, KEY_EFFECTS } from '../data/constants.js';
import { EFFECTS_FUNCTIONS } from '../data/effectsData.js';
import { deepCopy, generateMultipleItems, hasValidEffectFunction } from '../data/itemUtils.js';
import { getOpposingPlayer, findLeftmostActiveCard, findLeftmostNonFaintedCard, areAllCardsInState, areAnyCardsInState, abbreviateName, isEffectActiveOnCard } from './gameLogicUtils.js';

let actionId = 0;
let gameLog = [];
let gameState = {};

/**
 * Initializes a single card
 * This is the first time card and bag data are combined
 * Abilities are combined with bag to create effects
 * Initializes the position, currentHp, and state
 */
function initializeCard(cardData, bagData = {}, index) {
    //Get array of inner objects (ie effects) from bag and data, deep copy spread into a new object
    //const abilities = Object.assign({}, ...Object.values(deepCopy(selectEffects(cardData.abilities))))
    return {
        ...cardData,
        effects: deepCopy(bagData),
        state: CARD_STATE.ACTIVE,
        currentHp: cardData.hp,
        position: index
    };
}

/**
 * Initializes the game state
 * Initializes P1 and P2's cards, currentPlayer, and round
 */
function initializeGameState(initialCardData, bags) {
    return {
        [PLAYER_ONE]: initialCardData[PLAYER_ONE].map((card, index) =>
            initializeCard(card, bags[index], index)),
        [PLAYER_TWO]: initialCardData[PLAYER_TWO].map((card, index) =>
            //not sure if this is where P2 should be getting his bag
            initializeCard(card, generateMultipleItems(1), index)),

        //Refactor when starting player is randomized
        currentPlayer: PLAYER_ONE,
        round: 1
    };
}

/**
 * Handles fainting for a single card
 * First tries to faint it and create the log for it
 * Then tries to trigger deathrattle if it exists
 * Currently, initialized data on the card is not consistently handled by deathrattle
 ** Position is being copied over to the new deathrattle but currentHP is being set by the actual deathrattle effect
 */
function handleFainted(card, player, position) {
    if (card.currentHp <= 0) {
        gameState[player][position].state = CARD_STATE.FAINTED
        createLogEntry(ACTION_TYPES.FAINTED, {
            log: `${player}_${position}(${abbreviateName(card.name)})_FAINTED`,
            faintedCardPos: position,
            faintedCardName: card.name,
        });
        if (isEffectActiveOnCard(KEY_EFFECTS.DEATHRATTLE, card)) {
            performEffectForCardIfExists(card, player, position, KEY_EFFECTS.DEATHRATTLE)
            createLogEntry(ACTION_TYPES.DEATHRATTLE, {
                log: `${card.name} triggered deathrattle`,
                sourceCardName: card.name,
            });
        }
    }
}


/**
 * Performs an attack for a single attacker and a single defender
 * First tries to check if divineShield exists and is active and does not perform attack math at all if so
 * Then fatigues the card in the gameState if it was an attack
 */
function performAttack(attacker, defender, attackingPlayer, defendingPlayer, type) {
    //attacker and defender are copies and not the actual cards, actual cards are in gameState
    let atkValue = 0
    if (isEffectActiveOnCard(KEY_EFFECTS.DIVINE_SHIELD, defender)) {
        //Toggle the first instance divine shield
        toggleCardEffect(KEY_EFFECTS.DIVINE_SHIELD, defendingPlayer, defender.position, true)
    }
    else {
        atkValue = attacker.atk
        gameState[defendingPlayer][defender.position].currentHp = Math.max(0, defender.currentHp - attacker.atk)
        if (isEffectActiveOnCard(KEY_EFFECTS.RAGE, defender))
            performEffectForCardIfExists(defender, defendingPlayer, defender.position, KEY_EFFECTS.RAGE)
    }
    createLogEntry(type, {
        log: `${attackingPlayer}_${attacker.position}(${abbreviateName(attacker.name)})_ATK ${attacker.atk}_${defender.position}(${abbreviateName(defender.name)})`,
        actingPlayer: attackingPlayer,
        sourceCardPosition: attacker.position,
        sourceCardName: attacker.name,
        attackValue: atkValue,
        targetCardPosition: defender.position,
        targetCardName: defender.name
    });

    if (type === ACTION_TYPES.ATTACK) { gameState[attackingPlayer][attacker.position].state = CARD_STATE.FATIGUED }
}

/**
 * 
 */
function performTurn() {
    // Get the current player's cards and determine the opposing player
    const currentPlayerCards = gameState[gameState.currentPlayer];
    const opposingPlayer = getOpposingPlayer(gameState.currentPlayer);
    const opposingPlayerCards = gameState[opposingPlayer];

    // Find the first active card for the current player and the first non-fainted card for the opponent
    const attacker = findLeftmostActiveCard(currentPlayerCards);
    const defender = findLeftmostNonFaintedCard(opposingPlayerCards);

    // If either player has no valid cards, skip the turn
    if (!attacker || !defender) {
        gameState.currentPlayer = opposingPlayer
        createLogEntry(ACTION_TYPES.TURN_SKIPPED, { log: `${gameState.currentPlayer}_${ACTION_TYPES.TURN_SKIPPED}` })
        return
    }

    //Attack
    performAttack(attacker, defender, gameState.currentPlayer, opposingPlayer, ACTION_TYPES.ATTACK)
    //Counter Attack, skips if the attacker has ranged and ranged is active
    if (!isEffectActiveOnCard(KEY_EFFECTS.RANGED, attacker)) {
        performAttack(defender, attacker, opposingPlayer, gameState.currentPlayer, ACTION_TYPES.COUNTER_ATTACK)
    }
    //Faint Attacker
    handleFainted(attacker, gameState.currentPlayer, attacker.position)
    //Faint Defender
    handleFainted(defender, opposingPlayer, defender.position)

    //Heal attacker
    performEffectForCardIfExists(attacker, gameState.currentPlayer, attacker.position, KEY_EFFECTS.HEAL)
    createLogEntry(ACTION_TYPES.HP_UPDATE, {
        log: ACTION_TYPES.HP_UPDATE
    })

    //Flip turns in game state
    gameState.currentPlayer = opposingPlayer
}

/**
 * Performs a full round of the game
 */
function performRound() {
    createLogEntry(ACTION_TYPES.ROUND_START, {
        log: `ROUND_${gameState.round}_START`,
    });

    //The turn will continue as long as there are active cards and not game over
    while ((
        areAnyCardsInState(gameState[PLAYER_ONE], CARD_STATE.ACTIVE) ||
        areAnyCardsInState(gameState[PLAYER_TWO], CARD_STATE.ACTIVE)) &&
        !isGameOver()) {

        performTurn();
    }

    //Round end fatigue reset
    gameState[PLAYER_ONE] = resetFatigue(gameState[PLAYER_ONE]);
    gameState[PLAYER_TWO] = resetFatigue(gameState[PLAYER_TWO]);

    createLogEntry(ACTION_TYPES.ROUND_END, {
        log: `ROUND_${gameState.round}_END`,
    });

    performEffectsIfExistsAndActive(KEY_EFFECTS.GROW)

    gameState.round += 1
    //Refactor when starting player is randomized
    gameState.currentPlayer = PLAYER_ONE
}

/**
 * Runs the main game loop
 * Requires a roster (ie [cardData] array of cardData) and bag (ie {[id]:[effectData]} dictionary of effectDatas)
 */
function runGameLoop(initialCardData, bag) {
    gameLog = []; // Reset the game log
    actionId = 0; // Reset the action ID counter
    gameState = initializeGameState(initialCardData, bag);

    createLogEntry(ACTION_TYPES.GAME_START, {
        log: ACTION_TYPES.GAME_START,
    });

    performEffectsIfExistsAndActive(KEY_EFFECTS.EQUIP)
    createLogEntry(ACTION_TYPES.HP_UPDATE, {
        log: ACTION_TYPES.HP_UPDATE
    })



    while (!isGameOver()) {
        performRound();
    }

    createLogEntry(ACTION_TYPES.GAME_END, {
        log: ACTION_TYPES.GAME_END,
    });

    return { playerWin: !areAllCardsInState(gameState[PLAYER_ONE], CARD_STATE.FAINTED), gameLog };
}

/**
 * Creates a log entry and adds it to the global gameLog
 * This is the primary output of gameLogic and is required for the board to animate properly
 */
function createLogEntry(action, data) {
    const baseEntry = {
        id: actionId++,
        action,
        log: data.log,
        //Deep copy game state
        board_state: JSON.parse(JSON.stringify(gameState))
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
                action_details: {
                    triggeredCard: data.sourceCardName
                }
            }
            break;
        case ACTION_TYPES.HP_UPDATE:
        case ACTION_TYPES.ROUND_START:
        case ACTION_TYPES.ROUND_END:
        case ACTION_TYPES.GAME_END:
        case ACTION_TYPES.GAME_START:
            logEntry = {
                ...baseEntry,
            };
            break;
        default:
            logEntry = baseEntry;
    }

    gameLog.push(logEntry);
    return logEntry;
}

/**
 *  Performs all matching effects for all cards if it exists and is active
 *  Supported effects: GROW
 */
function performEffectsIfExistsAndActive(effectName) {
    [PLAYER_ONE, PLAYER_TWO].forEach(player => {
        gameState[player].forEach((card, index) => {
            if (card.effects && Array.isArray(card.effects)) {
                const matchingEffects = card.effects.filter(e => e.effect === effectName && e.active);
                matchingEffects.forEach(effect => {
                    if (hasValidEffectFunction(effectName) && effect.effectFunctionId) {
                        gameState[player][index] = EFFECTS_FUNCTIONS[effect.effectFunctionId](
                            gameState[player][index],
                            effect.rarityDetails
                        );
                    }
                });
            }
        });
    });
}

/**
 * Performs all effects for a single card in a position if it exists and is active
 * @param {Object} card - The card object
 * @param {string} player - The player (PLAYER_ONE or PLAYER_TWO)
 * @param {number} position - The position of the card in the player's hand
 * @param {string} effect - The effect to be applied (e.g., KEY_EFFECTS.GROW)
 */
function performEffectForCardIfExists(card, player, position, effectName) {
    if (card.effects && Array.isArray(card.effects)) {
        const matchingEffects = card.effects.filter(e => e.effect === effectName && e.active);
        matchingEffects.forEach(effect => {
            if (hasValidEffectFunction(effectName) && effect.effectFunctionId) {
                gameState[player][position] = EFFECTS_FUNCTIONS[effect.effectFunctionId](
                    gameState[player][position],
                    effect.rarityDetails
                )
            }
        });
    }
}

/**
 * Toggles one or all effects for a card
 * @param {*} KEY_EFFECT 
 * @param {*} player 
 * @param {*} position 
 * @param {*} active : whether it should target active or inactive effects
 * @param {*} flipAll : whether it should target the first match or all
 * @returns 
 */
function toggleCardEffect(KEY_EFFECT, player, position, activeState, flipAll = false) {
    // Find the card in gameState
    const card = gameState[player][position];

    // Check if the card exists and has effects
    if (!card || !Array.isArray(card.effects)) {
        console.warn(`Card not found or has no effects: Player ${player}, Position ${position}`);
        return;
    }

    // Find all effects that match KEY_EFFECT and the active state
    const matchingEffects = card.effects.filter(effect =>
        effect.effect === KEY_EFFECT && effect.active === activeState
    );

    if (matchingEffects.length === 0) {
        console.warn(`No matching effects found for ${KEY_EFFECT} with active state ${activeState}`);
        return;
    }

    // Flip the effects
    if (flipAll) {
        // Flip all matching effects
        matchingEffects.forEach(effect => {
            effect.active = !effect.activeState;
        });
    } else {
        // Flip only the first matching effect
        matchingEffects[0].active = !matchingEffects[0].active;
    }

    // Update the card in the gameState
    gameState[player][position] = { ...card, effects: [...card.effects] };

    console.log(`Flipped ${flipAll ? 'all' : 'one'} ${KEY_EFFECT} effect(s) for Player ${player}, Position ${position}`);
}

/**
 * Resets the fatigue of all non-fainted cards
 * Pure function
 * @param {Array} playerCards - The player's cards
 * @returns {Array} The updated player cards with fatigue reset
 */
function resetFatigue(playerCards) {
    return playerCards.map(card =>
        card.state === CARD_STATE.FATIGUED ? { ...card, state: CARD_STATE.ACTIVE } : card
    );
}

/**
 * Checks if the game has ended based on global gameState
 * @returns {boolean} True if the game has ended, false otherwise
 */
function isGameOver() {
    return areAllCardsInState(gameState[PLAYER_ONE], CARD_STATE.FAINTED) ||
        areAllCardsInState(gameState[PLAYER_TWO], CARD_STATE.FAINTED);
}

export {
    runGameLoop
};