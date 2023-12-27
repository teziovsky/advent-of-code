import { type Path, loadFile, sum } from "../../utils";

async function ex1(path: Path, delimiter = "\n") {
  const data = (await loadFile(path, delimiter)).filter(Boolean);
  const map = generateMap(data);

  const first = Object.keys(map);
  const second = findSecond(first, map);

  return first.length * second.length;
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
console.log("EX1 Input Result: ", await ex1("25/input"));
console.log("-----------------------");
// console.log("EX2 Test Result: ", await ex2("25/test2"));
// console.log("EX2 Result: ", await ex2("25/input"));
console.log("-----------------------");

function generateMap(data: string[]) {
  return data.reduce<Record<string, string[]>>((acc, row) => {
    const [key, ...values] = row.match(/\w+/g)!;
    values.forEach((v) => {
      acc[v] = [...(acc[v] ?? []), key];
      acc[key] = [...(acc[key] ?? []), v];
    });

    return acc;
  }, {});
}

function findSecond(first: string[], map: Record<string, string[]>) {
  const second: string[] = [];

  const wrongCount = (value: string) => second.filter((v) => map[value].includes(v)).length;

  while (first.reduce((count, key) => count + wrongCount(key), 0) !== 3) {
    second.push(first.sort((a, b) => wrongCount(a) - wrongCount(b)).pop()!);
  }

  return second;
}
