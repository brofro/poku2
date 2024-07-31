import React from "react";
import { updateMatrix } from "./helper.js"

export default function BagView({
    size = "40px",
    bagItems = {},
    bagId,
    _back,
    _remove,
}) {
    const BAG_SIZE = 8;
    const [bag, setBag] = React.useState(
        [...Array(BAG_SIZE)].map(() => Array(BAG_SIZE).fill(0))
    );
    const [item, setItem] = React.useState()
    const [adj, setAdj] = React.useState([])

    const upgrade = () => {
        const adj = ([x, y]) => [
            [x, y + 1],
            [x, y - 1],
            [x + 1, y],
            [x - 1, y],
            [x + 1, y + 1],
            [x + 1, y - 1],
            [x - 1, y + 1],
            [x - 1, y - 1],
        ]
        const adjSet = item.bagPosition.reduce((acc, xy) => {
            const a = adj(xy)
            const aa = Object.fromEntries(a.map(([x, y]) => ([[`${x}${y}`], [x, y]])))
            return { ...acc, ...aa }
        }, {})
        let arr = Object.values(adjSet)
        arr = arr.filter(([x, y]) => x >= 0 && x < BAG_SIZE && y >= 0 && y < BAG_SIZE && !item.bagPosition.find(([x1, y1]) => x1 === x && y1 === y))

        const random = () => arr[Math.floor(Math.random() * arr.length)]
        const ret = [random(), random()]
        setAdj(ret)
    }

    const onBoxClick = (x, y) => {
        setAdj([])
        const box = bag[x][y]
        if (box === item) return setItem(null);
        else if (box !== 0) return setItem(box);
        return setItem(null)
    }

    //populate items
    React.useEffect(() => {
        if (Object.keys(bagItems).length === 0) return;
        let m = bag;
        Object.entries(bagItems).forEach(([key, value]) => {
            m = updateMatrix(m, value.bagPosition, value);
        });
        setBag(m);
    }, [bagItems]);

    const getColor = (index1, index2) => {
        if (item?.bagPosition.find(([x, y]) => x === index1 && y === index2)) return "#FF00FF"
        if (bag[index1][index2]) return bagId === 0 ? "#29b6f6" : "#ffd54f"
        if (adj.find(([x, y]) => x === index1 && y === index2)) return "#FF00FF"
        return null;
    };

    return (
        <div
            style={{
                height: "90vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                userSelect: "none",
            }}
        >
            <button onClick={_back}>edit bag</button>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {bag.map(
                    (row, index1) => (
                        <div key={index1} style={{ display: "flex", flexDirection: "row" }}>
                            {row.map((_, index2) => (
                                <img
                                    src={bag[index1][index2]?.icon || null}
                                    onClick={() => onBoxClick(index1, index2)}
                                    style={{
                                        backgroundColor: getColor(index1, index2),
                                        border: "1px solid",
                                        width: size,
                                        height: size
                                    }}
                                    index1={index1}
                                    index2={index2}
                                    key={index2}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>
            <div>
                <div style={{ display: "flex", width: "100px" }}>
                    {item && <img src={item?.icon} height={size} width={size} />}
                    {item ? item.effect : "click item"}
                </div>
                {item && <button onClick={() => {
                    _remove(item)
                    _back()
                }}>remove item</button>}
                {item && <button onClick={upgrade} style={{ height: "60px", width: "60px", borderRadius: "50%", backgroundColor: "#FF00FF" }}>upgrade</button>}
            </div>
        </div>
    );
}