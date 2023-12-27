import { type Path, loadFile } from "../../utils";

type DIRECTION = [number, number];

const DIRECTIONS: Record<string, DIRECTION> = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
};

async function ex1(path: Path, delimiter = "\n") {
  const map = (await loadFile(path, delimiter)).filter(Boolean).map((row) => row.split(""));

  return countPlots(map, 64);
}

async function ex2(path: Path, delimiter = "\n") {
  const map = (await loadFile(path, delimiter)).filter(Boolean).map((row) => row.split(""));

  const size = map[0].length;
  const target = 26_501_365;
  const remaining = target % size;

  /**
   * https://www.reddit.com/r/adventofcode/comments/18nevo3/comment/keb6a53/?context=3
   * Lagrange's Interpolation formula for ax^2 + bx + c with x=[0,1,2] and y=[y0,y1,y2] we have
   *   f(x) = (x^2-3x+2) * y0/2 - (x^2-2x)*y1 + (x^2-x) * y2/2
   * so the coefficients are:
   * a = y0/2 - y1 + y2/2
   * b = -3*y0/2 + 2*y1 - y2/2
   * c = y0
   */

  const values = [
    countPlots(map, remaining, true),
    countPlots(map, remaining + size, true),
    countPlots(map, remaining + size * 2, true),
  ];

  const { a, b, c } = simplifyLagrange(values);

  const d = Math.floor(target / size);

  return a * d * d + b * d + c;
}

function safeModulo(coord: number, size: number) {
  return coord < 0 ? (size - (Math.abs(coord) % size)) % size : coord % size;
}

function countPlots(map: string[][], steps: number, repeatMap = false) {
  const size = map[0].length;

  const startingY = map.findIndex((row) => row.includes("S"));
  const startingX = map[startingY].findIndex((col) => col === "S");

  const gardenPlots = new Set<string>([`${startingY},${startingX}`]);

  for (let i = 0; i < steps; i++) {
    const entries = [...gardenPlots];

    for (const entry of entries) {
      const [y, x] = entry.split(",").map(Number);

      for (const direction in DIRECTIONS) {
        const dir = DIRECTIONS[direction];
        const next = [y + dir[0], x + dir[1]];
        const tmp = [safeModulo(next[0], size), safeModulo(next[1], size)];
        const nextCol = repeatMap ? map[tmp[0]]?.[tmp[1]] : map[next[0]]?.[next[1]];

        if (nextCol === "#") continue;
        else if (nextCol === "." || nextCol === "S") gardenPlots.add(`${next[0]},${next[1]}`);
      }

      gardenPlots.delete(entry);
    }
  }

  return gardenPlots.size;
}

function simplifyLagrange(values: number[]) {
  return {
    a: values[0] / 2 - values[1] + values[2] / 2,
    b: -3 * (values[0] / 2) + 2 * values[1] - values[2] / 2,
    c: values[0],
  };
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("2023/21/test1"));
console.log("EX1 Input Result: ", await ex1("2023/21/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("2023/21/test2"));
console.log("EX2 Result: ", await ex2("2023/21/input"));
console.log("-----------------------");
