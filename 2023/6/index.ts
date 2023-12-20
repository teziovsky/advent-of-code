import { type Path, loadFile } from "../../utils";

async function ex1(path: Path, delimiter: string = "\n") {
  const rows = await loadFile(path, delimiter);

  const times = rows[0].match(/\d+/g)?.map(Number) ?? [];
  const records = rows[1].match(/\d+/g)?.map(Number) ?? [];

  const results = new Array(times.length).fill(0);

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const record = records[i];

    for (let j = 0; j <= time; j++) {
      const diff = time - j;
      if (j * diff > record) {
        results[i] += 1;
      }
    }
  }

  return results.reduce((acc, cur) => {
    if (acc === 0) return cur;
    return acc * cur;
  }, 0);
}

async function ex2(path: Path, delimiter: string = "\n") {
  const rows = await loadFile(path, delimiter);

  const times = rows[0].match(/\d+/g)?.map(Number) ?? [];
  const time = parseInt(times.join(""));

  const records = rows[1].match(/\d+/g)?.map(Number) ?? [];
  const record = parseInt(records.join(""));

  let result = 0;

  for (let j = 0; j <= time; j++) {
    const diff = time - j;
    if (j * diff > record) {
      result += 1;
    }
  }

  return result;
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("6/test1"));
console.log("EX1 Input Result: ", await ex1("6/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("6/test2"));
console.log("EX2 Result: ", await ex2("6/input"));
console.log("-----------------------");
