import { type Path, loadFile } from "../utils";

async function ex1(path: Path) {
  const rows = (await loadFile(path)).filter(Boolean);

  return rows.reduce((acc, row) => {
    if (!row) return acc;
    return acc;
  }, 0);
}

async function ex2(path: Path) {
  const rows = (await loadFile(path)).filter(Boolean);

  return rows.reduce((acc, row) => {
    if (!row) return acc;
    return acc;
  }, 0);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("0/test1"));
console.log("EX1 Input Result: ", await ex1("0/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("0/test2"));
console.log("EX2 Result: ", await ex2("0/input"));
console.log("-----------------------");
