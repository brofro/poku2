import { PLAYER_ONE, PLAYER_TWO, getImageUrl } from "./constants"

export const EFFECTS = {
    0: {
        ranged: true
    },
    1: {
        divineShield: true
    },
    2: {
        deathrattle() {
            return {
                id: 446,
                name: "Munchlax",
                atk: 1,
                hp: 1,
                currentHp: 1,
                img: getImageUrl(446),
            }
        },
        //deathrattle text is also the indicator for the icon
        deathrattleText: "Summon a 1/1 Munchlax"
    }
}

export const initialBagData = {
    [PLAYER_ONE]: [EFFECTS[1], {}],
    [PLAYER_TWO]: [EFFECTS[2], { ...EFFECTS[0], ...EFFECTS[1] }]
}