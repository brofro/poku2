import { v4 as uuidv4 } from 'uuid'
import { getItemRarity, distributeRarityValue } from "./itemFramework"
import { shapes } from "../shopComponents/inventory/allShapes"
import { EFFECTS, EFFECTS_FUNCTIONS } from "./effectsData";
import { ITEM_RARITY, KEY_EFFECTS } from './constants';

const id = require('uuid-readable')

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
export function selectEffects(keys = [], presetRarity = ITEM_RARITY.NONE, presetRarityValue = 0) {
    return EFFECTS
        .filter(effect => keys.includes(effect.effect))
        .map(effect => {
            const effectCopy = deepCopy(effect);
            const uuid = uuidv4()
            effectCopy.uuid = uuid
            effectCopy.id = id.short(uuid)
            effectCopy.shape = shapes[effectCopy.shapeId]

            //Generate rarity, skip if there is a pre-determined rarity
            if (!effectCopy.staticRarity) {
                let rarity, rarityValue;
                if (presetRarity === ITEM_RARITY.NONE) {
                    const generated = getItemRarity()
                    rarity = generated.rarity
                    rarityValue = generated.rarityValue
                } else {
                    rarity = presetRarity
                    rarityValue = presetRarityValue
                }
                effectCopy.rarityDetails = {
                    rarity: rarity,
                    rarityValue: rarityValue,
                    ...distributeRarityValue(rarityValue)
                }
            }

            //Handle tool tip text, can probably be a pure function abstracted
            effectCopy.text += ` [${effectCopy.staticRarity ? effectCopy.staticRarity : effectCopy.rarityDetails.rarity}] `
            if (effectCopy.effect === KEY_EFFECTS.GROW)
                effectCopy.text += `+${effectCopy.rarityDetails.rarityValue}/+${effectCopy.rarityDetails.rarityValue}`
            if (effectCopy.effect === KEY_EFFECTS.EQUIP)
                effectCopy.text += `+${effectCopy.rarityDetails.atk}/+${effectCopy.rarityDetails.hp}`
            if (effectCopy.effect === KEY_EFFECTS.HEAL)
                effectCopy.text += `HEAL ${effectCopy.rarityDetails.rarityValue}`
            if (effectCopy.effect === KEY_EFFECTS.RAGE)
                effectCopy.text += `+${effectCopy.rarityDetails.rarityValue} ATK`

            return effectCopy;
        });
}

//Checks if the effect can trigger an effect function
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

//Generates a single item (object)
export function generateItem(shopLevel = 1) {
    // Get a random rarity
    const { rarity, rarityValue } = getItemRarity(shopLevel);

    // Filter effects that either have no staticRarity or have a statiRarity that matches the generated rarity
    const eligibleEffects = EFFECTS.filter(effect =>
        !effect.staticRarity || effect.staticRarity === rarity
    );

    // If no eligible effects, return null or handle the error as appropriate
    if (eligibleEffects.length === 0) {
        console.warn('No eligible effects found for rarity:', rarity);
        return null;
    }

    // Randomly select one effect from the eligible effects
    let randomIndex = Math.floor(Math.random() * eligibleEffects.length);
    const chosenEffect = eligibleEffects[randomIndex];

    // Call selectEffects with the chosen effect and the generated rarity
    const processedEffect = selectEffects([chosenEffect.effect], rarity, rarityValue);
    randomIndex = Math.floor(Math.random() * processedEffect.length)

    return processedEffect[randomIndex]; // Return a random processed effect
}

//Generates n items returns n sized array of items (object)
export function generateMultipleItems(numItems = 1) {
    // Handle invalid input
    if (!Number.isInteger(numItems) || numItems <= 0) {
        console.warn('Invalid input: n must be a positive integer');
        return [];
    }

    const effects = [];

    for (let i = 0; i < numItems; i++) {
        const effect = generateItem();
        if (effect !== null) {
            effects.push(effect);
        } else {
            console.warn(`Failed to generate effect at index ${i}`);
        }
    }

    // Log a warning if fewer than n effects were generated
    if (effects.length < numItems) {
        console.warn(`Only ${effects.length} effects generated out of ${numItems} requested`);
    }

    return effects;
}