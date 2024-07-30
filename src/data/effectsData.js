import { CARD_STATE, ITEM_RARITY, KEY_EFFECTS, PLAYER_ONE, PLAYER_TWO } from "./constants"
import { CARD_DEFINITIONS } from "./cardData"
import rangedicon from "../icons/ranged.svg"
import divineShieldIcon from "../icons/divineshield.svg"
import deathrattleIcon from "../icons/deathrattle.svg"
import growIcon from "../icons/grow.svg"


//This is needed because boardgame.io G state has to be a JSON serializable object
export const EFFECTS_FUNCTIONS = {
    [KEY_EFFECTS.GROW]: (card, rarity, rarityValue) => {
        return { ...card, atk: card.atk + rarityValue, hp: card.hp + rarityValue, currentHp: card.currentHp + rarityValue }
    },
    [`${KEY_EFFECTS.DEATHRATTLE}0`]: (card, rarity, rarityValue) => {
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
        text: `Gains stats at the end of every round`,
        effectFunctionId: KEY_EFFECTS.GROW,
    },
    {
        effect: KEY_EFFECTS.RANGED,
        icon: rangedicon,
        shapeId: "T",
        active: true,
        cost: 10,
        text: "Cannot be counter-attacked",
        staticRarity: ITEM_RARITY.EPIC
    },
    {
        effect: KEY_EFFECTS.DIVINE_SHIELD,
        icon: divineShieldIcon,
        shapeId: "T2",
        active: true,
        cost: 2,
        text: "Negates first instance of attack damage",
        staticRarity: ITEM_RARITY.UNCOMMON
    },
    {
        effect: KEY_EFFECTS.DEATHRATTLE,
        icon: deathrattleIcon,
        shapeId: "COR",
        active: true,
        cost: 1,
        text: "Deathrattle: Summon a 1/1 Magikarp",
        staticRarity: ITEM_RARITY.COMMON,
        effectFunctionId: `${KEY_EFFECTS.DEATHRATTLE}0`,
    }
]