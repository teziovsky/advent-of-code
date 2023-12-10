import { type Path, loadFile } from "../utils";

async function ex1(path: Path) {
  const lines = (await loadFile(path)).filter(Boolean);

  let startPosition = [0, 0];

  const grid = lines.map((line, y) =>
    line.split("").map((char, x) => {
      if (char === "S") {
        startPosition = [y, x];
      }
      return char;
    })
  );

  let direction = [0, 0];

  const DIRECTIONS: Record<string, [number, number]> = {
    UP: [-1, 0],
    RIGHT: [0, 1],
    DOWN: [1, 0],
    LEFT: [0, -1],
  };

  if (["|", "7", "F"].includes(grid[startPosition[0] - 1][startPosition[1]])) {
    direction = DIRECTIONS.UP;
  }

  if (["-", "J", "7"].includes(grid[startPosition[0]][startPosition[1] + 1])) {
    direction = DIRECTIONS.RIGHT;
  }

  const paths = [startPosition];

  let [y, x] = startPosition;

  do {
    switch (grid[y][x]) {
      case "L":
        direction = direction === DIRECTIONS.DOWN ? DIRECTIONS.RIGHT : DIRECTIONS.UP;
        break;
      case "J":
        direction = direction === DIRECTIONS.DOWN ? DIRECTIONS.LEFT : DIRECTIONS.UP;
        break;
      case "7":
        direction = direction === DIRECTIONS.UP ? DIRECTIONS.LEFT : DIRECTIONS.DOWN;
        break;
      case "F":
        direction = direction === DIRECTIONS.UP ? DIRECTIONS.RIGHT : DIRECTIONS.DOWN;
        break;
    }

    const [directionY, directionX] = direction;

    y += directionY;
    x += directionX;

    paths.push([y, x]);
  } while (grid[y][x] !== "S");

  return {
    distance: Math.floor(paths.length / 2),
    grid,
    paths,
  };
}

async function ex2(grid: string[][], paths: number[][]) {
  const [minY, minX, maxY, maxX] = paths.reduce(
    ([minY, minX, maxY, maxX], [i, j]) => [Math.min(minY, i), Math.min(minX, j), Math.max(maxY, i), Math.max(maxX, j)],
    [Infinity, Infinity, -Infinity, -Infinity]
  );

  const gridTable = grid.map((row) => row.map(() => 0));

  for (const [i, j] of paths) {
    gridTable[i][j] = 1;
  }

  let result = 0;

  for (let i = minY; i <= maxY; i++) {
    let intersectionCount = 0;
    let currentDirection = null;

    for (let j = minX; j <= maxX; j++) {
      const currentCell = gridTable[i][j];

      if (currentCell) {
        const curr = grid[i][j];
        if (curr === "|") {
          intersectionCount++;
        } else if (curr !== "-" && currentDirection) {
          const isLeftTurn = currentDirection === "L" && curr === "7";
          const isRightTurn = currentDirection === "F" && curr === "J";

          if (isLeftTurn || isRightTurn) {
            intersectionCount++;
          }

          currentDirection = null;
        } else if (curr !== "-") {
          currentDirection = curr;
        }
      } else if (intersectionCount % 2) {
        result++;
      }
    }
  }

  return result;
}

const { distance: testDistance } = await ex1("10/test1");
const { distance: test2Distance } = await ex1("10/test2");
const { grid: testGrid, paths: testPaths } = await ex1("10/test3");
const { distance, grid, paths } = await ex1("10/input");

console.log("-----------------------");
console.log("EX1 Test Result: ", testDistance);
console.log("EX1 Test2 Result: ", test2Distance);
console.log("EX1 Input Result: ", distance);
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2(testGrid, testPaths));
console.log("EX2 Result: ", await ex2(grid, paths));
console.log("-----------------------");
