import { type Path, loadFile } from "../utils";

async function ex(path: Path, copies: number) {
  console.time(`EX - ${path} - ${copies} copies time`);
  const rows = (await loadFile(path)).filter(Boolean).map((row) => row.split(" "));

  const arrangements: number[] = [];

  for (let i = 0; i < rows.length; i++) {
    const characters = Array(copies).fill(rows[i][0]).join("?");
    const numbers = Array(copies).fill(rows[i][1]).join(",").split(",").map(Number);

    let regexStr = "^\\.*";

    for (let i = 0; i < numbers.length; i++) {
      regexStr += "#".repeat(numbers[i]);
      if (i < numbers.length - 1) regexStr += "\\.+";
    }

    regexStr += "\\.*$";

    const regex = new RegExp(regexStr, "gm");

    const combinations = getCombinations(characters, regex);

    arrangements.push(combinations.length);
  }
  console.timeEnd(`EX - ${path} - ${copies} copies time`);
  return arrangements.reduce((acc, curr) => acc + curr, 0);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex("12/test1", 1));
console.log("EX1 Input Result: ", await ex("12/input", 1));
console.log("-----------------------");
// console.log("EX2 Test Result: ", await ex("12/test2", 5));
// console.log("EX2 Result: ", await ex("12/input", 5));
console.log("-----------------------");

function getCombinations(str: string, regex: RegExp, memo: Record<string, string[]> = {}) {
  if (str.indexOf("?") === -1) {
    return str.match(regex) ? [str] : [];
  }

  if (memo[str]) return memo[str];

  let combinations: string[] = [];
  const index = str.indexOf("?");

  // Replace '?' with '#'
  const str1 = str.slice(0, index) + "#" + str.slice(index + 1);
  combinations = combinations.concat(getCombinations(str1, regex, memo));

  // Replace '?' with '.'
  const str2 = str.slice(0, index) + "." + str.slice(index + 1);
  combinations = combinations.concat(getCombinations(str2, regex, memo));

  memo[str] = combinations;

  return combinations;
}
