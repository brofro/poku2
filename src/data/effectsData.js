import { CARD_STATE, ITEM_RARITY, KEY_EFFECTS } from "./constants"
import { CARD_DEFINITIONS } from "./cardData"
import rangedicon from "../icons/ranged.svg"
import divineShieldIcon from "../icons/divineshield.svg"
import deathrattleIcon from "../icons/deathrattle.svg"
import deathrattleIcon1 from "../icons/deathrattle1.svg"
import growIcon from "../icons/grow.svg"
import equipIcon from "../icons/equip.svg"
import healIcon from "../icons/heal.svg"
import rageIcon from "../icons/rage.svg"
import doubleAttackIcon from "../icons/doubleattack.svg"


//This is needed because boardgame.io G state has to be a JSON serializable object
//All functions must change the playing game state so they must return a new version of the card
export const EFFECTS_FUNCTIONS = {
    [KEY_EFFECTS.GROW]: (card, { rarityValue }) => {
        if (card.state === CARD_STATE.FAINTED) return { ...card }
        return { ...card, atk: card.atk + rarityValue, hp: card.hp + rarityValue, currentHp: card.currentHp + rarityValue }
    },
    [KEY_EFFECTS.EQUIP]: (card, { atk, hp }) => {
        return { ...card, atk: card.atk + atk, hp: card.hp + hp, currentHp: card.currentHp + hp }
    },
    [KEY_EFFECTS.HEAL]: (card, { rarityValue }) => {
        return { ...card, currentHp: Math.min(card.hp, card.currentHp + rarityValue) }
    },
    [KEY_EFFECTS.RAGE]: (card, { rarityValue }) => {
        return { ...card, atk: card.atk + rarityValue }
    },
    [`${KEY_EFFECTS.DEATHRATTLE}0`]: (card) => {
        return {
            ...CARD_DEFINITIONS[129],
            position: card.position,
            currentHp: 1,
            state: CARD_STATE.FATIGUED,
            effects: []
        }
    },
    [`${KEY_EFFECTS.DEATHRATTLE}1`]: (card) => {
        return {
            ...card,
            position: card.position,
            currentHp: 1,
            state: CARD_STATE.FATIGUED,
            effects: card.effects
        }
    }

}

/**
 * Effects tied to the items in the game
 * required: effect, icon, shapeId, active (ie: can be turned off), cost, text
 * effectFunctionId: maps back to EFFECTS_FUNCTIONS to trigger effect specific subroutine, right now it operates on properties of effect.rarityDetails
 * staticRarity: doesn't generate a new rarity but can still be picked by rarity picker
 */
export const EFFECTS = [
    {
        effect: KEY_EFFECTS.GROW,
        icon: growIcon,
        shapeId: "L",
        active: true,
        cost: 3,
        text: `Grow: Gains stats at the end of every round`,
        effectFunctionId: KEY_EFFECTS.GROW,
    },
    {
        effect: KEY_EFFECTS.EQUIP,
        icon: equipIcon,
        shapeId: "L",
        active: true,
        cost: 2,
        text: `Equip: Gains stats at the start of the game`,
        effectFunctionId: KEY_EFFECTS.EQUIP
    },
    {
        effect: KEY_EFFECTS.HEAL,
        icon: healIcon,
        shapeId: "L",
        active: true,
        cost: 2,
        text: "Heal: Heals HP after turn",
        effectFunctionId: KEY_EFFECTS.HEAL
    },
    {
        effect: KEY_EFFECTS.RAGE,
        icon: rageIcon,
        shapeId: "T",
        active: true,
        cost: 1,
        text: "Rage: Gains attack after taking damage",
        effectFunctionId: KEY_EFFECTS.RAGE
    },
    {
        effect: KEY_EFFECTS.RANGED,
        icon: rangedicon,
        shapeId: "T",
        active: true,
        cost: 10,
        text: "Ranged: Cannot be counter-attacked",
        staticRarity: ITEM_RARITY.EPIC
    },
    {
        effect: KEY_EFFECTS.DIVINE_SHIELD,
        icon: divineShieldIcon,
        shapeId: "T2",
        active: true,
        cost: 2,
        text: "Divine Shield: Negates first instance of attack damage (stacks)",
        staticRarity: ITEM_RARITY.UNCOMMON
    },
    {
        effect: KEY_EFFECTS.DOUBLE_ATTACK,
        icon: doubleAttackIcon,
        shapeId: "COR",
        active: true,
        cost: 10,
        text: "Double Attack: If not fainted, attacks a second time (triggers once, stacks)",
        staticRarity: ITEM_RARITY.UNCOMMON
    },
    {
        effect: KEY_EFFECTS.DEATHRATTLE,
        icon: deathrattleIcon,
        shapeId: "COR",
        active: true,
        cost: 1,
        text: "Deathrattle: Summon a 1/1 Magikarp with no items",
        staticRarity: ITEM_RARITY.COMMON,
        effectFunctionId: `${KEY_EFFECTS.DEATHRATTLE}0`,
    },
    {
        effect: KEY_EFFECTS.DEATHRATTLE,
        icon: deathrattleIcon1,
        shapeId: "COR",
        active: true,
        cost: 5,
        text: "Deathrattle: Revive with 1 HP",
        staticRarity: ITEM_RARITY.COMMON,
        effectFunctionId: `${KEY_EFFECTS.DEATHRATTLE}1`,
    }
]