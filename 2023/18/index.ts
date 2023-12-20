import { type Path, loadFile } from "../utils";

type DIRECTION = [number, number];

const DIRECTIONS: Record<string, DIRECTION> = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
};

async function ex(path: Path, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean);

  let currentY = 0;
  let currentX = 0;
  const visited = new Set<string>();
  visited.add(`${currentY},${currentX}`);

  for (const line of rows) {
    const [direction, meters] = line.split(" ");
    const numberedMeters = Number(meters);

    const dir = DIRECTIONS[direction];

    for (let i = 0; i < numberedMeters; i++) {
      currentY += dir[0];
      currentX += dir[1];
      visited.add(`${currentY},${currentX}`);
    }
  }

  const queue = [[1, 1]];

  while (queue.length) {
    const [y, x] = queue.pop()!;

    const key = `${y},${x}`;

    if (!visited.has(key)) {
      visited.add(key);

      for (const direction in DIRECTIONS) {
        const dir = DIRECTIONS[direction];
        const next = [y + dir[0], x + dir[1]];
        if (!visited.has(`${next[0]},${next[1]}`)) {
          queue.push(next);
        }
      }
    }
  }

  return visited.size;
}

async function ex2(path: Path, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean);

  let currentY = 0;
  let currentX = 0;

  let area = 1;

  for (const line of rows) {
    const { direction, number } = parseLine(line);

    const dir = DIRECTIONS[direction];

    const lastY = currentY;
    const lastX = currentX;

    for (let i = 0; i < number; i++) {
      currentY += dir[0];
      currentX += dir[1];
    }

    area += (currentY * lastX - currentX * lastY + number) / 2;
  }

  return area;
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex("18/test1"));
console.log("EX1 Input Result: ", await ex("18/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("18/test2"));
console.log("EX2 Result: ", await ex2("18/input"));
console.log("-----------------------");

function parseLine(line: string) {
  const [value] = line.match(/[0-9a-f]{6}/)!;
  const direction = value[5];
  const number = parseInt(value.substring(0, 5), 16);

  return { number, direction: matchDirection(direction) };
}

function matchDirection(int: string) {
  switch (int) {
    case "0":
      return "R";
    case "1":
      return "D";
    case "2":
      return "L";
    case "3":
      return "U";
    default:
      return "R";
  }
}
