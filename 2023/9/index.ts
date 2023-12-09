import { type Path, loadFile } from "../utils";

async function ex1(path: Path) {
  const histories = (await loadFile(path)).filter(Boolean).map((row) => row.split(" ").map(Number));
  let result = 0;

  for (const history of histories) {
    let curr: number[] = Array.from(history);
    const steps = [curr];

    while (curr.some(Boolean)) {
      let newCurr = [];

      for (let i = 0; i < curr.length - 1; i++) {
        newCurr.push(curr[i + 1] - curr[i]);
      }

      curr = newCurr;
      steps.push(newCurr);
    }

    steps.reverse();
    let value = 0;

    for (let i = 1; i < steps.length; i++) {
      value += steps[i].at(-1);
    }

    result += value;
  }

  return result;
}

async function ex2(path: Path) {
  const histories = (await loadFile(path)).filter(Boolean).map((row) => row.split(" ").map(Number));
  let result = 0;

  for (const history of histories) {
    let curr: number[] = Array.from(history);
    const steps = [curr];

    while (curr.some(Boolean)) {
      const newCurr = [];

      for (let i = 0; i < curr.length - 1; i++) {
        newCurr.push(curr[i + 1] - curr[i]);
      }

      curr = newCurr;
      steps.push(newCurr);
    }

    steps.reverse();
    let value = 0;

    for (let i = 1; i < steps.length; i++) {
      value = steps[i][0] - value;
    }

    result += value;
  }

  return result;
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("9/test1"));
console.log("EX1 Input Result: ", await ex1("9/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("9/test2"));
console.log("EX2 Result: ", await ex2("9/input"));
console.log("-----------------------");
