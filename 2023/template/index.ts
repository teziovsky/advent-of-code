import { type FileNames, loadFile } from "../utils";

async function ex1(fileName: FileNames) {
  const rows = await loadFile(fileName);

  return rows.reduce((acc, row) => {
    if (!row) return acc;
    return acc;
  }, 0);
}

async function ex2(fileName: FileNames) {
  const rows = await loadFile(fileName);

  return rows.reduce((acc, row) => {
    if (!row) return acc;
    return acc;
  }, 0);
}

console.log("EX1 Test Result: ", await ex1("test1"));
console.log("EX1 Input Result: ", await ex1("input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("test2"));
console.log("EX2 Result: ", await ex2("input"));
console.log("-----------------------");
