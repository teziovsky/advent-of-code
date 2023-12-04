import { type FileNames, loadFile } from "../utils";

async function ex1(fileName: FileNames) {
  const rows = await loadFile(fileName);

  return rows.reduce((sum, row) => {
    const numbers = row.match(/\d/g);

    if (!numbers) return sum;

    const number = parseInt(`${numbers.at(0)}${numbers.at(-1)}`);
    return isNaN(number) ? sum : sum + number;
  }, 0);
}

async function ex2(fileName: FileNames) {
  const rows = await loadFile(fileName);

  const numberWordsMap = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };

  return rows.reduce((sum, row) => {
    const fromLeft = row.match(/\d|one|two|three|four|five|six|seven|eight|nine/g);

    if (!fromLeft) return sum;

    const fromLeftFirst = fromLeft[0];

    const first = isNaN(Number(fromLeftFirst))
      ? numberWordsMap[fromLeftFirst as keyof typeof numberWordsMap]
      : parseInt(fromLeftFirst);

    const reversedrow = row.split("").reverse().join("");

    const fromRight = reversedrow.match(/\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/g);

    if (!fromRight) return sum;

    const fromRightFirst = fromRight[0].split("").reverse().join("");

    const last = isNaN(Number(fromRightFirst))
      ? numberWordsMap[fromRightFirst as keyof typeof numberWordsMap]
      : parseInt(fromRightFirst);

    const number = parseInt(`${first}${last}`);
    return isNaN(number) ? sum : sum + number;
  }, 0);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("test1"));
console.log("EX1 Input Result: ", await ex1("input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("test2"));
console.log("EX2 Result: ", await ex2("input"));
console.log("-----------------------");
