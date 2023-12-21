import { type Path, loadFile } from "../../utils";

type DIRECTION = [number, number];

const DIRECTIONS: Record<string, DIRECTION> = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
};

async function ex1(path: Path, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean).map((row) => row.split(""));

  const startingY = rows.findIndex((row) => row.includes("S"));
  const startingX = rows[startingY].findIndex((col) => col === "S");

  const map = new Set<string>();
  map.add(`${startingY},${startingX}`);

  for (let i = 0; i < 64; i++) {
    const entries = [...map];

    for (const entry of entries) {
      const [y, x] = entry.split(",").map(Number);

      for (const direction in DIRECTIONS) {
        const dir = DIRECTIONS[direction];
        const next = [y + dir[0], x + dir[1]];
        const nextCol = rows[next[0]]?.[next[1]];

        if (nextCol === "#") continue;
        else if (nextCol === "." || nextCol === "S") map.add(`${next[0]},${next[1]}`);
      }

      map.delete(entry);
    }
  }

  return map.size;
}

async function ex2(path: Path, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean).map((row) => row.split(""));

  const rowsLength = rows.length;
  const colsLength = rows[0].length;

  const startingY = rows.findIndex((row) => row.includes("S"));
  const startingX = rows[startingY].findIndex((col) => col === "S");

  const map = new Set<string>();
  map.add(`${startingY},${startingX}`);

  const target = 50;

  for (let i = 0; i < target; i++) {
    const entries = [...map];

    for (const entry of entries) {
      const [y, x] = entry.split(",").map(Number);

      for (const direction in DIRECTIONS) {
        const dir = DIRECTIONS[direction];
        const next = [y + dir[0], x + dir[1]];
        const nextCol = rows[next[0]]?.[next[1]];

        if (nextCol === "#") continue;
        else if (nextCol === "." || nextCol === "S") map.add(`${next[0]},${next[1]}`);
      }

      map.delete(entry);
    }
  }

  return map.size;
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("21/test1"));
console.log("EX1 Input Result: ", await ex1("21/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("21/test2"));
// console.log("EX2 Result: ", await ex2("21/input"));
console.log("-----------------------");
