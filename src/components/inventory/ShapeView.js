import React from "react";
import { getRotations } from "./helper";

export const ITEM_SIZE = 3;

export default function ShapeView({
  shapes = getRotations([
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0]
  ]),
  shapeIndex = 0,
  _rotate = () => {},
  boxSize = "5px",
  color = "#29b6f6",
  handleColor = "blue"
}) {
  const getColor = (index1, index2, shape) => {
    //drag handle is different color than rest
    if (shape[0][0] === index1 && shape[0][1] === index2) return handleColor;
    else if (shape.find(([x, y]) => x === index1 && y === index2)) return color;
    else return null;
  };
  return (
    <div onClick={_rotate}>
      {shapes.map((m, index) => (
        <div
          style={{
            margin: "1%",
            display: shapeIndex === index ? null : "none"
          }}
          key={index}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[...Array(ITEM_SIZE)].map((_, index1) => (
              <div
                style={{ display: "flex", flexDirection: "row" }}
                key={index1}
              >
                {[...Array(ITEM_SIZE)].map((_, index2) => {
                  return (
                    <div
                      style={{
                        backgroundColor: getColor(index1, index2, m),
                        width: boxSize,
                        height: boxSize
                      }}
                      key={index2}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};