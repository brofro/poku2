const getShape = (matrix) => {
  let arr = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === 1) arr.push([i, j]);
    }
  }
  return arr;
};
const rotate = (matrix) => {
  const len = matrix.length - 1;
  const res = matrix.map((row, i) => row.map((_, j) => matrix[len - j][i]));
  return res;
};

export const getRotations = (matrix) =>
  [1, 2, 3]
    .reduce(
      (acc, v) => {
        // console.log(v, acc);
        return [...acc, rotate(acc[acc.length - 1])];
      },
      [matrix]
    )
    .map((m) => getShape(m));

export const updateMatrix = (matrix, changeArr, value = null) => {
  let m = matrix;
  changeArr.forEach(([x, y]) => {
    m = flipSquare(m, x, y, value);
  });
  return m;
};

export const flipSquare = (matrix, x, y, value = null) => {
  return matrix.map((row, i) =>
    row.map((n, j) => {
      if (x === i && y === j) {
        if (value) return value;
        else return n === 0 ? 1 : 0;
      } else return n;
    })
  );
};

export const canFit = (toXY, shape, matrix) => {
  const arr = [];
  const from = shape[0]
  for (let i = 0; i < shape.length; i++) {
    //transform current xy to be relative to a single box
    let x = from[0] - shape[i][0];
    let y = from[1] - shape[i][1];

    //transform target xy to be relative to a single box
    let x2 = toXY[0] - x;
    let y2 = toXY[1] - y;

    if (matrix?.[x2]?.[y2] !== 0) return false;
    arr.push([x2, y2]);
  }
  return arr;
};


export const canPlace = (current, target, shape, bag) => {
  const arr = [];
  for (let i = 0; i < shape.length; i++) {
    //transform current xy to be relative to a single box
    let x = current[0] - shape[i][0];
    let y = current[1] - shape[i][1];

    //transform target xy to be relative to a single box
    let x2 = target[0] - x;
    let y2 = target[1] - y;

    if (bag?.[x2]?.[y2] !== 0) return false;
    arr.push([x2, y2]);
  }
  return arr;
};