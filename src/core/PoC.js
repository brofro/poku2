import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, useSensor, MouseSensor, TouchSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const TetrisPieces = {
    L: [[0, 0], [0, 1], [0, 2], [1, 2]],
    T: [[0, 1], [1, 0], [1, 1], [1, 2]],
    I: [[0, 0], [0, 1], [0, 2], [0, 3]],
    O: [[0, 0], [0, 1], [1, 0], [1, 1]],
};

const Colors = {
    L: '#FFA500',
    T: '#800080',
    I: '#00CED1',
    O: '#FFD700',
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    pieces: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: '20px',
    },
    piece: {
        width: '120px',
        height: '120px',
        margin: '10px 0',
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 80px)',
        gridGap: '1px',
        backgroundColor: '#ccc',
        padding: '1px',
    },
    cell: {
        width: '80px',
        height: '80px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
    },
};

function rotatePiece(piece) {
    const maxY = Math.max(...piece.map(([_, y]) => y));
    return piece.map(([x, y]) => [maxY - y, x]);
}

function TetrisPiece({ shape, color, piece, onRotate }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: shape,
    });

    const style = {
        ...styles.piece,
        transform: CSS.Translate.toString(transform),
    };

    const handleClick = (e) => {
        e.stopPropagation();
        onRotate(shape);
    };


    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={handleClick}>
            {piece.map(([x, y], index) => (
                <div
                    key={index}
                    style={{
                        backgroundColor: color,
                        border: '1px solid rgba(0,0,0,0.3)',
                        gridColumn: `${y + 1} / span 1`,
                        gridRow: `${x + 1} / span 1`,
                    }}
                />
            ))}
        </div>
    );
}

function GridCell({ id, color, previewColor }) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    const style = {
        ...styles.cell,
        backgroundColor: previewColor || color || 'white',
    };

    return <div ref={setNodeRef} style={style} />;
}

function TetrisStyleScreen() {
    const [pieces, setPieces] = useState(TetrisPieces);
    const [grid, setGrid] = useState(Array(16).fill(null));
    const [draggedPiece, setDraggedPiece] = useState(null);
    const [previewCells, setPreviewCells] = useState(Array(16).fill(null));

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        }
    })

    const touchSensor = useSensor(TouchSensor, {
        // Press delay of 250ms, with tolerance of 5px of movement
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor)

    const rotatePieceHandler = (shape) => {
        setPieces(prev => ({
            ...prev,
            [shape]: rotatePiece(prev[shape])
        }));
    };

    const isValidPlacement = (shape, cellIndex) => {
        const gridX = cellIndex % 4;
        const gridY = Math.floor(cellIndex / 4);

        return pieces[shape].every(([x, y]) => {
            const newX = gridX + y;
            const newY = gridY + x;
            return newX < 4 && newY < 4 && grid[newY * 4 + newX] === null;
        });
    };

    const updatePreview = (shape, cellIndex) => {
        const newPreview = Array(16).fill(null);
        const gridX = cellIndex % 4;
        const gridY = Math.floor(cellIndex / 4);
        const isValid = isValidPlacement(shape, cellIndex);
        const previewColor = isValid ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';

        pieces[shape].forEach(([x, y]) => {
            const newX = gridX + y;
            const newY = gridY + x;
            if (newX < 4 && newY < 4) {
                newPreview[newY * 4 + newX] = previewColor;
            }
        });

        setPreviewCells(newPreview);
    };

    const handleDragStart = (event) => {
        setDraggedPiece(event.active.id);
    };

    const handleDragMove = (event) => {
        if (event.over) {
            updatePreview(event.active.id, parseInt(event.over.id));
        } else {
            setPreviewCells(Array(16).fill(null));
        }
    };

    const handleDragEnd = (event) => {
        const { over, active } = event;
        setDraggedPiece(null);
        setPreviewCells(Array(16).fill(null));

        if (over) {
            const shape = active.id;
            const cellIndex = parseInt(over.id);

            if (isValidPlacement(shape, cellIndex)) {
                const newGrid = [...grid];
                const gridX = cellIndex % 4;
                const gridY = Math.floor(cellIndex / 4);

                pieces[shape].forEach(([x, y]) => {
                    const newX = gridX + y;
                    const newY = gridY + x;
                    newGrid[newY * 4 + newX] = Colors[shape];
                });
                setGrid(newGrid);
            }
        }
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd} sensors={sensors}>
            <div style={styles.container}>
                <div style={styles.pieces}>
                    {Object.entries(pieces).map(([shape, piece]) => (
                        <TetrisPiece
                            key={shape}
                            shape={shape}
                            color={Colors[shape]}
                            piece={piece}
                            onRotate={rotatePieceHandler}
                        />
                    ))}
                </div>
                <div style={styles.grid}>
                    {grid.map((color, index) => (
                        <GridCell
                            key={index}
                            id={index.toString()}
                            color={color}
                            previewColor={previewCells[index]}
                        />
                    ))}
                </div>
            </div>
        </DndContext>
    );
}

export default TetrisStyleScreen;