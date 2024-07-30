import jstat from 'jstat'
import { ITEM_RARITY } from './constants'

//Samples a chi-square distribution to get a rarity based on item shop level
//
export function getItemRarity(shopLevel = 5) {
    // Add 0.5 to ensure minimum value is 1, and round immediately
    // Could add max value here
    const roundedValue = Math.round(jstat.chisquare.sample(shopLevel) + 0.5);

    let rarity;
    if (roundedValue <= 3) {
        rarity = ITEM_RARITY.COMMON;
    } else if (roundedValue <= 5) {
        rarity = ITEM_RARITY.UNCOMMON;
    } else if (roundedValue <= 7) {
        rarity = ITEM_RARITY.RARE;
    } else if (roundedValue <= 9) {
        rarity = ITEM_RARITY.EPIC;
    } else {
        rarity = ITEM_RARITY.LEGENDARY;
    }

    return {
        rarityValue: roundedValue,
        rarity: rarity
    };
}