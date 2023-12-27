import { type Path, loadFile } from "../../utils";

async function ex(path: Path, cycles: number, delimiter = "\n") {
  let rows = (await loadFile(path, delimiter)).filter(Boolean).map((row) => row.split(""));

  const scores = [];

  for (let i = 0; i < cycles * 4; i++) {
    moveRocks(rows);

    rows = rotateGrid(rows);

    if ((i + 1) % 4 === 0) {
      const score = countScore(rows);
      scores.push(score);
    }
  }

  if (cycles) {
    return scores.at(-1);
  } else {
    moveRocks(rows);
    return countScore(rows);
  }
}

function moveRocks(rows: string[][]) {
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    for (let colIndex = 0; colIndex < rows[rowIndex].length; colIndex++) {
      if (rows[rowIndex][colIndex] === "O" && rows?.[rowIndex - 1]?.[colIndex] === ".") {
        let rowIndexCopy = rowIndex;

        while (rows[rowIndexCopy][colIndex] === "O" && rows?.[rowIndexCopy - 1]?.[colIndex] === ".") {
          rows[rowIndexCopy - 1][colIndex] = "O";
          rows[rowIndexCopy][colIndex] = ".";
          rowIndexCopy--;
        }
      }
    }
  }
}

function countScore(rows: string[][]) {
  let result = 0;

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    for (let colIndex = 0; colIndex < rows[rowIndex].length; colIndex++) {
      if (rows[rowIndex][colIndex] === "O") {
        result += rows.length - rowIndex;
      }
    }
  }

  return result;
}

function rotateGrid(grid: string[][]) {
  return grid[0].map((_, rowIndex) => grid.map((_, colIndex) => grid[grid.length - 1 - colIndex][rowIndex]));
}

let CYCLES_COUNT = 0;
console.log("-----------------------");
console.log("EX1 Test Result: ", await ex("2023/14/test1", CYCLES_COUNT));
console.log("EX1 Input Result: ", await ex("2023/14/input", CYCLES_COUNT));
console.log("-----------------------");

CYCLES_COUNT = 1_000;
console.log("EX2 Test Result: ", await ex("2023/14/test2", CYCLES_COUNT));
console.log("EX2 Result: ", await ex("2023/14/input", CYCLES_COUNT));
console.log("-----------------------");
