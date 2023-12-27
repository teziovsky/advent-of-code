import { type Path, loadFile, sum } from "../../utils";

async function ex(path: Path, copies: number, delimiter: string = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean).map((row) => row.split(" "));

  const arrangements: number[] = [];

  for (let i = 0; i < rows.length; i++) {
    const characters = Array(copies).fill(rows[i][0]).join("?");
    const numbers = Array(copies).fill(rows[i][1]).join(",").split(",").map(Number);

    const cache: Record<string, number> = {};

    const result = getCombinations(characters, numbers, cache);

    arrangements.push(result);
  }

  return sum(arrangements);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex("12/test1", 1));
console.log("EX1 Input Result: ", await ex("12/input", 1));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex("12/test2", 5));
console.log("EX2 Result: ", await ex("12/input", 5));
console.log("-----------------------");

function getCombinations(str: string, numbers: number[], cache: Record<string, number>) {
  if (!str) {
    return numbers.length === 0 ? 1 : 0;
  }

  if (!numbers.length) {
    return str.includes("#") ? 0 : 1;
  }

  const key: string = `${str}-${numbers.join("-")}`;

  if (key in cache) {
    return cache[key];
  }

  let result: number = 0;

  const firstChar = str[0];
  const firstNumber = numbers[0];

  if (firstChar === "." || firstChar === "?") {
    result += getCombinations(str.slice(1), numbers, cache);
  }

  if (firstChar === "#" || firstChar === "?") {
    if (
      firstNumber <= str.length &&
      !str.slice(0, firstNumber).includes(".") &&
      (firstNumber === str.length || str[firstNumber] !== "#")
    ) {
      result += getCombinations(str.slice(firstNumber + 1), numbers.slice(1), cache);
    }
  }

  cache[key] = result;
  return result;
}
