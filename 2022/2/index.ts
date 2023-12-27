import { sum } from "lodash";
import { type Path, loadFile } from "../../utils";

const opponent: Record<string, string> = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

const beats: Record<string, string> = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

const scores: Record<string, number> = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

async function ex1(path: Path, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean).map((row) => row.split(" "));

  const player: Record<string, string> = {
    X: "rock",
    Y: "paper",
    Z: "scissors",
  };

  let results: number[] = [];

  for (let i = 0; i < rows.length; i++) {
    const [op, pl] = rows[i];
    const opShape = opponent[op];
    const plShape = player[pl];

    if (opShape === plShape) {
      results.push(scores[plShape] + 3);
    } else if (beats[opShape] === plShape) {
      results.push(scores[plShape] + 0);
    } else {
      results.push(scores[plShape] + 6);
    }
  }

  return sum(results);
}

async function ex2(path: Path, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean).map((row) => row.split(" "));

  const player: Record<string, string> = {
    X: "lose",
    Y: "draw",
    Z: "win",
  };

  let results: number[] = [];

  for (let i = 0; i < rows.length; i++) {
    const [op, pl] = rows[i];
    const opShape = opponent[op];
    const plShape = player[pl];

    if (plShape === "lose") {
      const shape = beats[opShape];
      results.push(scores[shape] + 0);
    } else if (plShape === "draw") {
      const shape = opShape;
      results.push(scores[shape] + 3);
    } else if (plShape === "win") {
      const shape = Object.entries(beats).find(([_, value]) => value === opShape)![0];
      results.push(scores[shape] + 6);
    }
  }

  return sum(results);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("2022/2/test1"));
console.log("EX1 Input Result: ", await ex1("2022/2/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("2022/2/test2"));
console.log("EX2 Result: ", await ex2("2022/2/input"));
console.log("-----------------------");
