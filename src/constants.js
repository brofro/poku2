// src/constants.js
export const ATK_ICON = "https://i.imgur.com/X4Fo2c5.png";
export const HP_ICON = "https://i.imgur.com/MP4IoUo.png";

export const PLAYER_ONE = 'P1';
export const PLAYER_TWO = 'P2';

export const CARD_STATE = {
    ACTIVE: 'ACTIVE',
    FATIGUED: 'FATIGUED',
    FAINTED: 'FAINTED'
};

export const ACTION_TYPES = {
    ATTACK: 'ATTACK',
    COUNTER_ATTACK: 'COUNTER_ATTACK',
    HP_UPDATE: 'HP_UPDATE',
    FAINTED: 'FAINTED',
    TURN_SKIPPED: 'TURN_SKIPPED',
    ROUND_END: 'ROUND_END',
    GAME_START: 'GAME_START',
    GAME_END: 'GAME_END'
};

export const PLAY_SPEED = 1000;