import { type Path, loadFile } from "../../utils";

async function ex1(path: Path, delimiter: string = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean);

  const grid = rows.map((row) => row.split(""));

  duplicateRowColumn(grid);

  replaceHashToNumber(grid);

  const numbers = grid
    .map((row) => row.filter((char) => !char.includes(".")))
    .filter((el) => el.length)
    .flat()
    .map(Number);

  const pairs = getNumberPairs(numbers);

  let distances = [];

  for (let i = 0; i < pairs.length; i++) {
    const [a, b] = pairs[i];
    let [aY, aX] = [0, 0];
    let [bY, bX] = [0, 0];
    for (let j = 0; j < grid.length; j++) {
      const row = grid[j];
      if (row.includes(a.toString())) {
        aY = j;
        aX = row.indexOf(a.toString());
      }
      if (row.includes(b.toString())) {
        bY = j;
        bX = row.indexOf(b.toString());
      }
    }

    distances.push(Math.abs(aY - bY) + Math.abs(aX - bX));
  }

  return distances.reduce((acc, distance) => acc + distance, 0);
}

async function ex2(path: Path, delimiter: string = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean);

  const grid = rows.map((row) => row.split(""));

  const symbol = "@";

  duplicateRowColumn(grid, symbol);

  replaceHashToNumber(grid);

  const numbers = grid
    .map((row) => row.filter((char) => !char.includes(".") && !char.includes(symbol)))
    .filter((el) => el.length)
    .flat()
    .map(Number);

  const pairs = getNumberPairs(numbers);

  let distances = [];

  for (let i = 0; i < pairs.length; i++) {
    const [a, b] = pairs[i];
    let [aY, aX] = [0, 0];
    let [bY, bX] = [0, 0];

    for (let j = 0; j < grid.length; j++) {
      const row = grid[j];

      if (row.includes(a.toString())) {
        aY = j;
        aX = row.indexOf(a.toString());
      }
      if (row.includes(b.toString())) {
        bY = j;
        bX = row.indexOf(b.toString());
      }
    }

    let distance = 0;

    const distanceY = Math.abs(aY - bY);
    const distanceX = Math.abs(aX - bX);

    const DISTANCE_COUNT = 1_000_000 - 1;

    for (let j = 0; j < distanceY; j++) {
      if (aY > bY) {
        const char = grid[aY - j][aX];

        if (char === symbol) {
          distance += DISTANCE_COUNT;
        } else {
          distance += 1;
        }
      } else {
        const char = grid[aY + j][aX];

        if (char === symbol) {
          distance += DISTANCE_COUNT;
        } else {
          distance += 1;
        }
      }
    }

    for (let j = 0; j < distanceX; j++) {
      if (aX > bX) {
        const char = grid[aY][aX - j];

        if (char === symbol) {
          distance += DISTANCE_COUNT;
        } else {
          distance += 1;
        }
      } else {
        const char = grid[aY][aX + j];

        if (char === symbol) {
          distance += DISTANCE_COUNT;
        } else {
          distance += 1;
        }
      }
    }

    distances.push(distance);
  }

  return distances.reduce((acc, distance) => acc + distance, 0);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("11/test1"));
console.log("EX1 Input Result: ", await ex1("11/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("11/test2"));
console.log("EX2 Result: ", await ex2("11/input"));
console.log("-----------------------");

function duplicateRowColumn(grid: string[][], symbol = ".") {
  for (let i = 0; i < grid.length; i++) {
    if (!grid[i].includes("#")) {
      const duplicatedRow = Array(grid[0].length).fill(symbol);
      grid.splice(i, 0, duplicatedRow);
      i++;
    }
  }

  let columns = grid[0].length;

  for (let j = 0; j < columns; j++) {
    if (grid.every((row) => row[j] === "." || row[j] === symbol)) {
      for (let k = 0; k < grid.length; k++) {
        grid[k].splice(j, 0, symbol);
      }
      j++;
      columns++;
    }
  }
}

function replaceHashToNumber(grid: string[][]) {
  let number = 1;
  const columns = grid[0].length;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < columns; j++) {
      const char = grid[i][j];
      if (char === "#") {
        grid[i][j] = number.toString();
        number++;
      }
    }
  }
}

function getNumberPairs(numbers: number[]) {
  const pairs: [number, number][] = [];

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const pair = [numbers[i], numbers[j]].sort((a, b) => a - b) as [number, number];

      if (!pairs.some((existingPair) => existingPair[0] === pair[0] && existingPair[1] === pair[1])) {
        pairs.push(pair);
      }
    }
  }

  return pairs;
}
