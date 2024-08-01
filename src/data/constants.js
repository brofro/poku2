// src/constants.js

export const getImageUrl = (pokemonNumber) => {
    // Pad the number to 3 digits
    const paddedNumber = String(pokemonNumber).padStart(3, '0');

    // Construct and return the new URL
    return `https://www.pokencyclopedia.info/sprites/gen3/ani_emerald/ani_e_${paddedNumber}.gif`;
};

export const ATK_ICON = "https://i.imgur.com/X4Fo2c5.png";
export const HP_ICON = "https://i.imgur.com/MP4IoUo.png";

export const PLAYER_ONE = 'P1';
export const PLAYER_TWO = 'P2';

export const RESULT = {
    WIN: 'WIN',
    LOSE: 'LOSE',
    TIE: 'TIE'
}

export const CARD_STATE = {
    ACTIVE: 'ACTIVE',
    FATIGUED: 'FATIGUED',
    FAINTED: 'FAINTED'
};

export const ITEM_RARITY = {
    NONE: 'NO_RARITY',
    COMMON: 'COMMON',
    UNCOMMON: 'UNCOMMON',
    RARE: 'RARE',
    EPIC: 'EPIC',
    LEGENDARY: 'LEGENDARY'
}

export const ACTION_TYPES = {
    ATTACK: 'ATTACK',
    COUNTER_ATTACK: 'COUNTER_ATTACK',
    HP_UPDATE: 'HP_UPDATE',
    DEATHRATTLE: 'DEATHRATTLE',
    FAINTED: 'FAINTED',
    TURN_SKIPPED: 'TURN_SKIPPED',
    ROUND_START: 'ROUND_START',
    ROUND_END: 'ROUND_END',
    GAME_START: 'GAME_START',
    GAME_END: 'GAME_END'
};

export const KEY_EFFECTS = {
    RANGED: 'ranged',
    DIVINE_SHIELD: 'divineShield',
    DEATHRATTLE: 'deathrattle',
    GROW: 'grow',
    EQUIP: 'equip',
    HEAL: 'heal',
    RAGE: 'rage',
    DOUBLE_ATTACK: 'doubleAttack'
}

export const PLAY_SPEED = 750;