import { PLAYER_ONE, PLAYER_TWO, CARD_STATE, ACTION_TYPES, KEY_EFFECTS } from '../data/constants.js';
import { initialBagData, deepCopy, selectEffects } from '../data/effectsData.js';
import { getOpposingPlayer, findLeftmostActiveCard, findLeftmostNonFaintedCard, areAllCardsInState, areAnyCardsInState, abbreviateName } from './gameLogicUtils.js';

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
    const abilities = Object.assign({}, ...Object.values(deepCopy(selectEffects(cardData.abilities))))
    const bagEffects = Object.assign({}, ...Object.values(deepCopy(bagData)))
    return {
        ...cardData,
        effects: { ...abilities, ...bagEffects },
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
            initializeCard(card, initialBagData[PLAYER_TWO][index], index)),

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
        const deathrattleKeys = Object.keys(card.effects).filter(str => { return str.includes('deathrattle') })
        if (deathrattleKeys.length > 0 && !card.triggeredDeathrattle) {
            //only act on the first deathrattle for now, handle multi deathrattle later
            const deathrattleEffect = { ...card.effects[`${deathrattleKeys[0]}`] }
            if (!deathrattleEffect.active) { return }
            gameState[player][position] = { position: card.position, ...deathrattleEffect.deathrattle() }
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
    if (defender.effects.hasOwnProperty(KEY_EFFECTS.DIVINE_SHIELD) && defender.effects.divineShield.active) {
        gameState[defendingPlayer][defender.position].effects.divineShield.active = false
    }
    else {
        atkValue = attacker.atk
        gameState[defendingPlayer][defender.position].currentHp = Math.max(0, defender.currentHp - attacker.atk)
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
    if (!attacker.effects.hasOwnProperty(KEY_EFFECTS.RANGED) || (attacker.effects.hasOwnProperty(KEY_EFFECTS.RANGED) && !attacker.effects.ranged.active)) {
        performAttack(defender, attacker, opposingPlayer, gameState.currentPlayer, ACTION_TYPES.COUNTER_ATTACK)
    }
    //Faint Attacker
    handleFainted(attacker, gameState.currentPlayer, attacker.position)
    //Faint Defender
    handleFainted(defender, opposingPlayer, defender.position)

    //Flip turns in game state
    gameState.currentPlayer = opposingPlayer
}

/**
 * Performs a full round of the game
 */
function performRound() {

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

    while (!isGameOver()) {
        performRound();
    }

    createLogEntry(ACTION_TYPES.GAME_END, {
        log: ACTION_TYPES.GAME_END,
    });

    return gameLog;
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