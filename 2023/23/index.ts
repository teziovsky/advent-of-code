import { type Path, loadFile } from "../../utils";

type DIRECTION = [number, number];

const DIRECTIONS: Record<string, DIRECTION> = {
  "^": [-1, 0],
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
};

async function ex1(path: Path, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean).map((row) => row.split(""));

  const startingPoint = [0, 1];

  return rows.reduce((maxLength) => {
    const queue = [[startingPoint.join()]];

    while (queue.length) {
      const path = queue.shift()!;
      const [y, x] = path.at(-1)!.split(",").map(Number);
      const char = rows[y][x];

      for (const dir in DIRECTIONS) {
        if (char in DIRECTIONS && char !== dir) continue;

        const [directionY, directionX] = DIRECTIONS[dir];
        const nextY = y + directionY;
        const nextX = x + directionX;
        const nextNode = [nextY, nextX].join();
        if (path.includes(nextNode)) continue;
        switch (rows[nextY]?.[nextX]) {
          case ".":
          case "^":
          case ">":
          case "v":
          case "<":
            queue.push(path.concat(nextNode));
        }
      }

      if (y === rows.length - 1) {
        maxLength = Math.max(maxLength, path.length - 1);
      }
    }

    return maxLength;
  }, 0);
}

async function ex2(path: Path, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean).map((row) => {
    return row
      .split("")
      .filter(Boolean)
      .map((char) => {
        switch (char) {
          case "^":
          case ">":
          case "v":
          case "<":
            return ".";
        }
        return char;
      });
  });

  const start = [0, 1].join();
  const end = [rows.length - 1, rows[0].length - 2].join();
  const nodes = [start, end];
  const distances = [];
  for (const node of nodes) {
    distances[node] = {};
    const [r, c] = node.split(",").map(Number);

    function move(nSteps, prevDir, r, c) {
      if (rows[r]?.[c] !== ".") return;

      const nEdges = Object.values(dirs).filter(([dr, dc]) => rows[r + dr]?.[c + dc] === ".").length;
      if (nSteps && (nEdges > 2 || !r || r === rows.length - 1)) {
        const nextNode = [r, c].join();
        if (!nodes.includes(nextNode)) {
          nodes.push(nextNode);
        }
        distances[node][nextNode] = nSteps;
        return;
      }

      if (prevDir !== "v" && r) move(nSteps + 1, "^", r - 1, c);
      if (prevDir !== "^" && r !== rows.length - 1) move(nSteps + 1, "v", r + 1, c);
      if (prevDir !== ">") move(nSteps + 1, "<", r, c - 1);
      if (prevDir !== "<") move(nSteps + 1, ">", r, c + 1);
    }

    move(0, null, r, c);
  }

  let maxSteps = 0;
  function move(steps, node, path) {
    if (node === end) {
      maxSteps = Math.max(maxSteps, steps);
      return;
    }
    path.push(node);
    for (const nextNode in distances[node]) {
      if (path.includes(nextNode)) continue;
      move(steps + distances[node][nextNode], nextNode, [...path]);
    }
  }

  move(0, start, []);
  console.log(maxSteps);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("23/test1"));
console.log("EX1 Input Result: ", await ex1("23/input"));
console.log("-----------------------");
// console.log("EX2 Test Result: ", await ex2("23/test2"));
// console.log("EX2 Result: ", await ex2("23/input"));
console.log("-----------------------");
