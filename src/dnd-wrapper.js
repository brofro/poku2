import React from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { isMobile } from 'react-device-detect';

//the item type, using the same type for everything means all dragBoxes can go into all dropBoxes
const ANY_ITEM = "ANY_ITEM";

export const COLORS = {
    yellow: "#ffd54f",
    green: "#66bb6a",
    red: "#e53935",
    purple: "#9575cd",
    blue: "#29b6f6"
};

export const SHAPES = {
    L: [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1]
    ],
    T: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 1],
        [2, 1]
    ],
    THREE: [
        [0, 0],
        [1, 0],
        [2, 0]
    ],
    BOX: [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1]
    ]
};

export function DragdropWrapper({ className, children }) {
    return (
        <div className={className}>
            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend} options={{ enableMouseEvents: true }}>
                {children}
            </DndProvider>
        </div>
    );
}

export function DropBox({
    itemType = ANY_ITEM,
    dependencyArr = [],
    _canDrop,
    _afterDrop,
    isOverStyle,
    canDropStyle,
    className,
    style,
    children,
    ...props
}) {
    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: itemType,
            canDrop: _canDrop,
            drop: _afterDrop,
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop()
            })
        }),
        [canDropStyle, ...dependencyArr]
    );

    const dropStyle = {
        ...(canDrop && { ...canDropStyle }),
        ...(isOver && { ...isOverStyle })
    };

    return (
        <div
            ref={drop}
            className={className}
            style={{ ...style, ...dropStyle }}
            {...props}
        >
            {children}
        </div>
    );
}

export function DragBox({
    itemType = ANY_ITEM,
    dependencyArr = [],
    dragData,
    _canDrag,
    _onEnd,
    isDraggingStyle,
    className,
    style,
    children,
    ...props
}) {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: itemType,
            item: dragData,
            end: _onEnd,
            canDrag: _canDrag,
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging()
            })
        }),
        dependencyArr
    );
    const dragStyle = {
        ...(isDragging && { ...isDraggingStyle })
    };
    return (
        <div
            ref={drag}
            className={className}
            style={{ ...dragStyle, ...style }}
            {...props}
        >
            {children}
        </div>
    );
}
