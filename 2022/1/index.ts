import { type Path, loadFile } from "../../utils";
import { sum } from "lodash";

async function ex1(path: Path, delimiter: string = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean).map((row) =>
    row
      .split("\n")
      .filter(Boolean)
      .map((el) => parseInt(el))
  );

  const calories = rows.map(sum, 0);

  return Math.max(...calories);
}

async function ex2(path: Path, delimiter: string = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean).map((row) =>
    row
      .split("\n")
      .filter(Boolean)
      .map((el) => parseInt(el))
  );

  const calories = rows
    .map(sum, 0)
    .sort((a, b) => b - a)
    .slice(0, 3);

  return sum(calories);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("2022/1/test1", "\n\n"));
console.log("EX1 Input Result: ", await ex1("2022/1/input", "\n\n"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("2022/1/test2", "\n\n"));
console.log("EX2 Result: ", await ex2("2022/1/input", "\n\n"));
console.log("-----------------------");
