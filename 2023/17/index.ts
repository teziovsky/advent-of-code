import { type Path, loadFile } from "../utils";

type DIRECTION = [number, number];

const DIRECTIONS: Record<string, DIRECTION> = {
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  LEFT: [0, -1],
};

async function ex(path: Path, minMove: number, maxMove: number, delimiter = "\n") {
  const grid = (await loadFile(path, delimiter))
    .filter(Boolean)
    .map((row) => row.split("").filter(Boolean).map(Number));

  const rowLength = grid[0].length - 1;
  const colLength = grid.length - 1;

  const seen = new Set<string>();

  const queue: [number, number, DIRECTION, number, number][] = [
    [1, 0, DIRECTIONS.DOWN, 0, 1],
    [0, 1, DIRECTIONS.RIGHT, 0, 1],
  ];

  while (queue.length) {
    const [blockColumn, blockRow, direction, heat, move] = queue.shift()!;

    const key = `${blockColumn}-${blockRow}-${direction[0]}-${direction[1]}-${move}`;

    const block = grid[blockColumn]?.[blockRow];

    if (!block || seen.has(key)) {
      continue;
    }

    seen.add(key);

    if (blockColumn === colLength && blockRow === rowLength && move >= minMove) {
      return heat + block;
    }

    const nextDirections = getNextDirections(move, minMove, maxMove, direction);

    for (const nextDirection of nextDirections) {
      const [nextBlockColumn, nextBlockRow] = nextDirection;
      const nextColumn = blockColumn + nextBlockColumn;
      const nextRow = blockRow + nextBlockRow;
      const nextHeat = heat + block;
      const nextMove = 1 + (direction === nextDirection ? move : 0);

      queue.push([nextColumn, nextRow, nextDirection, nextHeat, nextMove]);
    }

    queue.sort((a, b) => a[3] - b[3]);
  }
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex("17/test1", 0, 3));
console.log("EX1 Input Result: ", await ex("17/input", 0, 3));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex("17/test2", 4, 10));
console.log("EX2 Result: ", await ex("17/input", 4, 10));
console.log("-----------------------");

function getNextDirections(move: number, minMove: number, maxMove: number, direction: DIRECTION) {
  const nextDirections = [];

  if (move >= minMove && (direction === DIRECTIONS.UP || direction === DIRECTIONS.DOWN)) {
    nextDirections.push(DIRECTIONS.LEFT);
    nextDirections.push(DIRECTIONS.RIGHT);
  }

  if (move >= minMove && (direction === DIRECTIONS.LEFT || direction === DIRECTIONS.RIGHT)) {
    nextDirections.push(DIRECTIONS.UP);
    nextDirections.push(DIRECTIONS.DOWN);
  }

  if (move < maxMove) {
    nextDirections.push(direction);
  }

  return nextDirections;
}
