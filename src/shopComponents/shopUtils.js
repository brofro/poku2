//Currently, card cost is calculated on the fly
export function calculateCardCost(card) {
    return (card.atk + card.hp) * 2 + card.spd
}

export function affordable(data, gold) {
    const cost = data.cost ? data.cost : calculateCardCost(data)
    return cost <= gold
}