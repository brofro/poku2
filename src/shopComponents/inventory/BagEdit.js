import React from "react";
import ShapeView from "./ShapeView.js"
import { canPlace, updateMatrix, findAll } from "./helper.js"

export default function BagEdit({ _storageToBag, _back, bag, storage, bagId }) {
    const [id, setId] = React.useState(null);
    const [shapeIndex, setShapeIndex] = React.useState(0);

    const rotate = () =>
        shapeIndex < 3 ? setShapeIndex(shapeIndex + 1) : setShapeIndex(0);

    return (
        <div
            style={{
                height: "90vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <button onClick={_back}>back</button>
            <BagMatrix
                bagId={bagId}
                _update={(newBagItem) => {
                    _storageToBag(newBagItem)
                    setId(null);
                }}
                bagItems={bag}
                obj={storage[id]}
                shapeIndex={shapeIndex}
            />
            <div style={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                height: "100%",
                marginTop: "20px"
            }}>
                {Object.values(storage).map((obj, index) => {
                    return (
                        <div
                            style={{
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                alignItems: "center",
                            }}
                            key={index}
                        >
                            <img
                                onClick={() => setId(index === id ? null : index)}
                                src={obj.icon}
                                height={30}
                                width={30}
                                style={{ transform: id === index ? "scale(1.5)" : null }}
                            />
                            <ShapeView
                                boxSize="10px"
                                shapes={obj.shape}
                                shapeIndex={shapeIndex}
                                _rotate={rotate}
                                style={{
                                    width: "100%",
                                    flex: 1,
                                    marginTop: "20px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    display: index === id ? "flex" : "none"
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


function BagMatrix({
    size = "40px",
    bagItems = {},
    bagId,
    obj,
    shapeIndex = 0,
    _update = () => { },
}) {
    const BAG_SIZE = 8;

    const [bag, setBag] = React.useState(
        [...Array(BAG_SIZE)].map(() => Array(BAG_SIZE).fill(0))
    );
    const [v, setV] = React.useState();

    const canOccupy = (index1, index2) =>
        v?.find(([x, y]) => x === index1 && y === index2);

    //store new item, need insertionPoint, shape, and object data
    const add = (x, y) => {
        const can = canOccupy(x, y);
        if (!can) return console.log("wrong square idiot");
        const occupied = canPlace(bag, obj.shape[shapeIndex], [x, y]);
        const newBagItem = { ...obj, bagPosition: occupied };
        _update(newBagItem);
    };

    //show where item handle can fit
    React.useEffect(() => {
        if (obj == null) return setV(null);

        let s = obj.shape[shapeIndex];
        const v = findAll(bag, s);
        setV(v);
    }, [obj, shapeIndex]);

    //populate items
    React.useEffect(() => {
        if (Object.keys(bagItems).length === 0) return;
        let m = bag;
        Object.entries(bagItems).forEach(([key, value]) => {
            m = updateMatrix(m, value.bagPosition, value.icon);
        });
        setBag(m);
    }, [bagItems]);

    const getColor = (index1, index2) => {
        if (bag[index1][index2]) return bagId === 0 ? "#29b6f6" : "#ffd54f"
        if (canOccupy(index1, index2)) return "#66bb6a";
        return null;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {bag.map(
                (row, index1) => (
                    <div key={index1} style={{ display: "flex", flexDirection: "row" }}>
                        {row.map((_, index2) => (
                            <img
                                src={bag[index1][index2] || null}
                                onClick={() => add(index1, index2)}
                                style={{
                                    backgroundColor: getColor(index1, index2),
                                    border: "1px solid",
                                    width: size,
                                    height: size
                                }}
                                index1={index1}
                                index2={index2}
                                key={index2}
                            >
                            </img>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}