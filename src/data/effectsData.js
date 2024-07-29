import { CARD_STATE, KEY_EFFECTS, PLAYER_ONE, PLAYER_TWO, getImageUrl } from "./constants"
import { CARD_DEFINITIONS } from "./cardData"
import rangedicon from "../components/ranged.svg"
import divineShieldIcon from "../components/divineshield.svg"
import deathrattleIcon from "../components/deathrattle.svg"
import growIcon from "../components/grow.svg"

let bagId = 0

//This is needed because boardgame.io G state has to be a JSON serializable object
export const EFFECTS_FUNCTIONS = {
    [KEY_EFFECTS.GROW]: (card) => {
        return { ...card, atk: card.atk + 1, hp: card.hp + 1, currentHp: card.currentHp + 1 }
    },
    [`${KEY_EFFECTS.DEATHRATTLE}0`]: (card) => {
        return {
            ...CARD_DEFINITIONS[129],
            position: card.position,
            currentHp: 1,
            state: CARD_STATE.FATIGUED,
            effects: {}
        }
    }

}

//Shop -> storage -> bag data is pulled directly from this so it must be JSON serializble
export const EFFECTS = {
    [KEY_EFFECTS.GROW]: {
        icon: growIcon,
        active: true,
        cost: 3,
        text: "Gains +1/+1 at the end of every round",
        effectFunctionId: KEY_EFFECTS.GROW
    },
    [KEY_EFFECTS.RANGED]: {
        icon: rangedicon,
        active: true,
        cost: 10,
        text: "Cannot be counter-attacked"
    },
    [KEY_EFFECTS.DIVINE_SHIELD]: {
        icon: divineShieldIcon,
        active: true,
        cost: 2,
        text: "Negates first instance of attack damage"
    },
    [`${KEY_EFFECTS.DEATHRATTLE}0`]: {
        icon: deathrattleIcon,
        active: true,
        cost: 1,
        text: "Deathrattle: Summon a 1/1 Magikarp",
        effectFunctionId: `${KEY_EFFECTS.DEATHRATTLE}0`,
    }
}

export function deepCopy(obj, hash = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (hash.has(obj)) return hash.get(obj);

    let copy = Array.isArray(obj) ? [] : {};
    hash.set(obj, copy);

    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], hash);
    });

    return copy;
}

//Turns keys into a bag with id:effect
//Could probably be an array instead?
export function selectEffects(keys = []) {
    return keys.reduce((selectedEffects, key) => {
        if (key in EFFECTS) {
            //Not sure if bubbling up cost here is problematic, we need to access cost from moves
            selectedEffects[bagId] = { id: bagId, [key]: deepCopy(EFFECTS[key]), cost: EFFECTS[key].cost }
            bagId++
        }
        return selectedEffects;
    }, {});
}

export function hasValidEffectFunction(effectKey) {
    // Check if the effect exists
    if (!EFFECTS.hasOwnProperty(effectKey)) {
        return false;
    }

    const effect = EFFECTS[effectKey];

    // Check if the effect has an effectFunctionId
    if (!effect.hasOwnProperty('effectFunctionId')) {
        return false;
    }

    const functionId = effect.effectFunctionId;

    // Check if the functionId corresponds to a function in EFFECTS_FUNCTIONS
    return typeof EFFECTS_FUNCTIONS[functionId] === 'function';
}

export const initialBagData = {
    [PLAYER_ONE]: [selectEffects([KEY_EFFECTS.DIVINE_SHIELD, KEY_EFFECTS.RANGED]), selectEffects([])],
    [PLAYER_TWO]: [selectEffects([]), selectEffects([KEY_EFFECTS.RANGED, KEY_EFFECTS.DIVINE_SHIELD])]
}

export const initialShopData = selectEffects([KEY_EFFECTS.DIVINE_SHIELD, KEY_EFFECTS.RANGED, KEY_EFFECTS.GROW, `${KEY_EFFECTS.DEATHRATTLE}0`])