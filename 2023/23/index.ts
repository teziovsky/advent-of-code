import { type Path, loadFile } from "../../utils";

const DIRECTIONS: Record<string, [number, number]> = {
  "^": [-1, 0],
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
};

async function ex1(path: Path, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean).map((row) => row.split(""));

  let result = 0;
  const initialPosition: number[] = [0, 1];

  const queue = [[initialPosition.join()]];

  while (queue.length) {
    const coords = queue.shift()!;
    const [y, x] = coords.at(-1)!.split(",").map(Number);
    const char = rows[y][x];

    for (const dir in DIRECTIONS) {
      if (char in DIRECTIONS && char !== dir) continue;

      const [directionY, directionX] = DIRECTIONS[dir];
      const nextY = y + directionY;
      const nextX = x + directionX;
      const nextPosition = [nextY, nextX].join();
      if (coords.includes(nextPosition)) continue;

      if ([".", "^", ">", "v", "<"].includes(rows[nextY]?.[nextX])) {
        queue.push(coords.concat(nextPosition));
      }
    }

    if (y === rows.length - 1) {
      result = Math.max(result, coords.length - 1);
    }
  }

  return result;
}

type Distances = Record<string, Record<string, number>>;

async function ex2(path: Path, delimiter = "\n") {
  const rows = await createGraph(path, delimiter);

  const initialPosition = [0, 1].join();
  const finalPosition = [rows.length - 1, rows[0].length - 2].join();
  const positions = [initialPosition, finalPosition];

  const distances = calculateDistances(positions, rows);

  return findLongestPath(finalPosition, distances, initialPosition);
}

async function createGraph(path: Path, delimiter: string) {
  return (await loadFile(path, delimiter))
    .filter(Boolean)
    .map((row) => row.split("").map((char) => (["^", ">", "v", "<"].includes(char) ? "." : char)));
}

function calculateDistances(positions: string[], rows: string[][]) {
  const distances: Distances = {};

  for (const position of positions) {
    distances[position] = {};

    const [y, x] = position.split(",").map(Number);

    function move(stepsCount: number, lastDirection: string | null, y: number, x: number): void {
      if (rows[y]?.[x] !== ".") return;

      const edgesCount = Object.values(DIRECTIONS).filter(
        ([directionY, directionX]) => rows[y + directionY]?.[x + directionX] === "."
      ).length;

      if (stepsCount && (edgesCount > 2 || !y || y === rows.length - 1)) {
        const nextPosition = [y, x].join();

        if (!positions.includes(nextPosition)) {
          positions.push(nextPosition);
        }

        distances[position][nextPosition] = stepsCount;
        return;
      }

      if (lastDirection !== "v" && y) move(stepsCount + 1, "^", y - 1, x);
      if (lastDirection !== "^" && y !== rows.length - 1) move(stepsCount + 1, "v", y + 1, x);
      if (lastDirection !== ">") move(stepsCount + 1, "<", y, x - 1);
      if (lastDirection !== "<") move(stepsCount + 1, ">", y, x + 1);
    }

    move(0, null, y, x);
  }
  return distances;
}

function findLongestPath(finalPosition: string, distances: Distances, initialPosition: string) {
  let result = 0;

  function dfs(steps: number, currentPosition: string, visitedPositions: string[]) {
    if (currentPosition === finalPosition) {
      result = Math.max(result, steps);
      return;
    }

    visitedPositions.push(currentPosition);

    for (const nextPosition in distances[currentPosition]) {
      if (visitedPositions.includes(nextPosition)) continue;
      dfs(steps + distances[currentPosition][nextPosition], nextPosition, [...visitedPositions]);
    }
  }

  dfs(0, initialPosition, []);

  return result;
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("2023/23/test1"));
console.log("EX1 Input Result: ", await ex1("2023/23/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("2023/23/test2"));
console.log("EX2 Result: ", await ex2("2023/23/input"));
console.log("-----------------------");
