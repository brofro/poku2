import { CARD_STATE, KEY_EFFECTS, PLAYER_ONE, PLAYER_TWO, getImageUrl } from "./constants"
import { CARD_DEFINITIONS } from "./cardData"
import rangedicon from "../icons/ranged.svg"
import divineShieldIcon from "../icons/divineshield.svg"
import deathrattleIcon from "../icons/deathrattle.svg"
import growIcon from "../icons/grow.svg"
import { shapes } from "../shopComponents/inventory/allShapes"

let bagId = 0
const id = require('uuid-readable')

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

export const EFFECTS = [
    {
        effect: KEY_EFFECTS.GROW,
        icon: growIcon,
        shapeId: "L",
        active: true,
        cost: 3,
        text: "Gains +1/+1 at the end of every round",
        effectFunctionId: KEY_EFFECTS.GROW
    },
    {
        effect: KEY_EFFECTS.RANGED,
        icon: rangedicon,
        shapeId: "T",
        active: true,
        cost: 10,
        text: "Cannot be counter-attacked"
    },
    {
        effect: KEY_EFFECTS.DIVINE_SHIELD,
        icon: divineShieldIcon,
        shapeId: "T2",
        active: true,
        cost: 2,
        text: "Negates first instance of attack damage"
    },
    {
        effect: KEY_EFFECTS.DEATHRATTLE,
        icon: deathrattleIcon,
        shapeId: "COR",
        active: true,
        cost: 1,
        text: "Deathrattle: Summon a 1/1 Magikarp",
        effectFunctionId: `${KEY_EFFECTS.DEATHRATTLE}0`,
    }
]

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

//Utility function to get a deep copied list of matching keys
//id is assigned to a deep copy here, cost, and all effect data are now on the same level
export function selectEffects(keys = []) {
    return EFFECTS
        .filter(effect => keys.includes(effect.effect))
        .map(effect => {
            const effectCopy = deepCopy(effect);
            effectCopy.id = id.generate()
            effectCopy.shape = shapes[effectCopy.shapeId]
            return effectCopy;
        });
}

export function hasValidEffectFunction(effectName) {
    const effect = EFFECTS.find(e => e.effect === effectName);

    // Check if the effect exists
    if (!effect) {
        return false;
    }

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

export const initialShopData = selectEffects([KEY_EFFECTS.DIVINE_SHIELD, KEY_EFFECTS.RANGED, KEY_EFFECTS.GROW, `${KEY_EFFECTS.DEATHRATTLE}`])