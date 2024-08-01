import cardData151 from './151cardData.json'

export const CARD_DEFINITIONS = cardData151
const baseFormIds = [1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 84, 86, 88, 90, 92, 95, 96, 98, 100, 102, 104, 106, 107, 108, 109, 111, 113, 114, 115, 116, 118, 120, 122, 123, 124, 125, 126, 127, 128, 129, 131, 132, 133, 137, 138, 140, 142, 143, 144, 145, 146, 147, 150, 151]
const gymLeaders = [
    [74, 95],
    [120, 121],
    [100, 26],
    [71, 45],
    [110, 89],
    [65, 49],
    [59, 78],
    [112, 34],
    //Elite 4
    [131, 91],
    [68, 107],
    [94, 24],
    [149, 142],
    //M2, Mew
    [150, 151],
]

export function getGymLeader(level) {
    console.log(level, gymLeaders[level])
    return [
        JSON.parse(JSON.stringify(CARD_DEFINITIONS[gymLeaders[level][0]])),
        JSON.parse(JSON.stringify(CARD_DEFINITIONS[gymLeaders[level][1]]))
    ]
}

//Gets a new random team of numCards
export function getNewTeam(numCards) {
    return Array.from({ length: numCards }, () => {
        const randomId = Math.floor(Math.random() * 151) + 1;
        return JSON.parse(JSON.stringify(CARD_DEFINITIONS[randomId]));
    });
}