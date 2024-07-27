import { CARD_STATE, KEY_EFFECTS, PLAYER_ONE, PLAYER_TWO, getImageUrl } from "./constants"
import rangedicon from "../components/ranged.svg"
import divineShieldIcon from "../components/divineshield.svg"
import deathrattleIcon from "../components/deathrattle.svg"

let bagId = 0

export const EFFECTS = {
    [KEY_EFFECTS.RANGED]: {
        icon: rangedicon,
        active: true
    },
    [KEY_EFFECTS.DIVINE_SHIELD]: {
        icon: divineShieldIcon,
        active: true
    },
    [`${KEY_EFFECTS.DEATHRATTLE}0`]: {
        icon: deathrattleIcon,
        active: true,
        deathrattle() {
            return {
                id: 446,
                name: "Munchlax",
                atk: 1,
                hp: 1,
                currentHp: 1,
                img: getImageUrl(446),
                state: CARD_STATE.FATIGUED,
                effects: {}
            }
        },
        //deathrattle text is also the indicator for the icon
        deathrattleText: "Summon a 1/1 Munchlax"
    }
}

function deepCopy(obj, hash = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (hash.has(obj)) return hash.get(obj);

    let copy = Array.isArray(obj) ? [] : {};
    hash.set(obj, copy);

    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], hash);
    });

    return copy;
}


function selectEffects(keys) {
    return keys.reduce((selectedEffects, key) => {
        if (key in EFFECTS) {

            selectedEffects[bagId] = { id: bagId, [key]: deepCopy(EFFECTS[key]) }
            bagId++
        }
        return selectedEffects;
    }, {});
}

export const initialBagData = {
    [PLAYER_ONE]: [selectEffects([KEY_EFFECTS.DIVINE_SHIELD, KEY_EFFECTS.RANGED]), selectEffects([])],
    [PLAYER_TWO]: [selectEffects([`${KEY_EFFECTS.DEATHRATTLE}0`]), selectEffects([KEY_EFFECTS.RANGED, KEY_EFFECTS.DIVINE_SHIELD])]
}

export const initialShopData = selectEffects([KEY_EFFECTS.DIVINE_SHIELD, KEY_EFFECTS.RANGED])