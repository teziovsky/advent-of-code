import { type Path, loadFile } from "../../utils";

async function loadGrid(path: Path, delimiter = "\n") {
  return (await loadFile(path, delimiter)).filter(Boolean).map((row) => row.split("").filter(Boolean));
}

async function ex1(path: Path, delimiter = "\n") {
  const grid = await loadGrid(path, delimiter);

  return getEnergizedTiles({
    grid,
    directionX: 1,
    directionY: 0,
    positionX: 0,
    positionY: 0,
  });
}

async function ex2(path: Path, delimiter = "\n") {
  const grid = await loadGrid(path, delimiter);

  const directions = [
    { directionX: 0, directionY: 1 },
    { directionX: 0, directionY: -1 },
    { directionX: 1, directionY: 0 },
    { directionX: -1, directionY: 0 },
  ];

  return directions.reduce((maxResult, { directionX, directionY }) => {
    const horizontalResults = grid.reduce((maxHorizontalResult, row, positionY) => {
      const horizontalResult = Math.max(
        getEnergizedTiles({ grid, directionX, directionY, positionX: 0, positionY }),
        getEnergizedTiles({ grid, directionX: -directionX, directionY, positionX: grid[0].length - 1, positionY })
      );
      return Math.max(maxHorizontalResult, horizontalResult);
    }, 0);

    const verticalResults = grid[0].reduce((maxVerticalResult, _, positionX) => {
      const verticalResult = Math.max(
        getEnergizedTiles({ grid, directionX, directionY, positionX, positionY: 0 }),
        getEnergizedTiles({ grid, directionX, directionY: -directionY, positionX, positionY: grid.length - 1 })
      );
      return Math.max(maxVerticalResult, verticalResult);
    }, 0);

    return Math.max(maxResult, horizontalResults, verticalResults);
  }, 0);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("16/test1"));
console.log("EX1 Input Result: ", await ex1("16/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("16/test2"));
console.log("EX2 Result: ", await ex2("16/input"));
console.log("-----------------------");

interface GetBeams {
  directionX: number;
  directionY: number;
  char: string;
}

function getBeams({ directionX, directionY, char }: GetBeams) {
  switch (char) {
    case "|":
      return directionX !== 0
        ? [
            [0, -1],
            [0, 1],
          ]
        : [[directionX, directionY]];
    case "-":
      return directionY !== 0
        ? [
            [-1, 0],
            [1, 0],
          ]
        : [[directionX, directionY]];
    case "/":
      return [[-directionY, -directionX]];
    case "\\":
      return [[directionY, directionX]];
    default:
      return [[directionX, directionY]];
  }
}

interface GetEnergizedTiles {
  grid: string[][];
  directionX: number;
  directionY: number;
  positionX: number;
  positionY: number;
}

function getEnergizedTiles({ grid, directionX, directionY, positionX, positionY }: GetEnergizedTiles) {
  const energizedTiles = new Set<string>();
  const seen = new Set<string>();

  const queue = [{ directionX, directionY, positionX, positionY }];

  while (queue.length > 0) {
    const current = queue.pop();
    if (!current) continue;

    const { directionX, directionY, positionX, positionY } = current;

    const key = `${directionX}-${directionY}-${positionX}-${positionY}`;

    if (seen.has(key)) continue;

    energizedTiles.add(`${positionX}-${positionY}`);
    seen.add(key);

    const newBeams = getBeams({ directionX, directionY, char: grid[positionY][positionX] });

    for (const [newDx, newDy] of newBeams) {
      const newX = positionX + newDx;
      const newY = positionY + newDy;
      const newTile = grid?.[newY]?.[newX];

      if (newTile) {
        queue.push({ directionX: newDx, directionY: newDy, positionX: newX, positionY: newY });
      }
    }
  }

  return energizedTiles.size;
}
