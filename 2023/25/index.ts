import { type Path, loadFile } from "../../utils";

async function ex1(path: Path, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean);

  return rows.reduce((acc, row) => {
    if (!row) return acc;
    return acc;
  }, 0);
}

async function ex2(path: Path, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean);

  return rows.reduce((acc, row) => {
    if (!row) return acc;
    return acc;
  }, 0);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("25/test1"));
// console.log("EX1 Input Result: ", await ex1("25/input"));
console.log("-----------------------");
// console.log("EX2 Test Result: ", await ex2("25/test2"));
// console.log("EX2 Result: ", await ex2("25/input"));
console.log("-----------------------");
