import React from "react";
import { canFit, updateMatrix, flipSquare } from "./helper";
import { DropBox, COLORS } from "../dnd-wrapper";

const BAG_SIZE = 8;

export default function BagGrid({
    size = "10px",
    _addItem = () => { },
    bagItems,
}) {
    const [bag, setBag] = React.useState(
        [...Array(BAG_SIZE)].map(() => Array(BAG_SIZE).fill(0))
    );

    //populate items
    React.useEffect(() => {
        if (Object.keys(bagItems).length === 0) return
    
        let m = bag
        Object.entries(bagItems).forEach(([key, value]) => {
            m = updateMatrix(m, value.bagPosition, key);
            setBag(m);
          });
    }, [bagItems])

    const GridDrop = ({ index1, index2 }) => {
        const p = {}
        p.canDropStyle = { backgroundColor: COLORS.green };
        p.isOverStyle = { opacity: "50%" };
        p.itemType = "storage";
        p._canDrop = ({ shape }) => canFit([index1, index2], shape, bag)
        p._afterDrop = (obj) => {
            const bagPosition = canFit([index1, index2], obj.shape, bag)
            const bagItem = { bagPosition, ...obj.data }
            _addItem(bagItem) //update state
        }
        p.style = {
            backgroundColor: getColor(index1, index2),
            border: "1px solid",
            width: size,
            height: size,
        }
        return <DropBox {...p}>{bag[index1][index2] || null}</DropBox>
    }

    const getColor = (index1, index2) => {
        if (bag[index1][index2]) return COLORS.blue
        return null
    }

    return <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
            {bag.map((row, index1) => <div key={index1} style={{ display: "flex", flexDirection: "row" }}>
                {row.map((_, index2) => <GridDrop
                    index1={index1}
                    index2={index2}
                    key={index2}
                />)}
            </div>//row
            )}
        </div>
        <div>{Object.keys(bagItems).join(",")}</div>
    </div>
}