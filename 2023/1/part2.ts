import { input } from "./text.ts";

function main() {
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

  const result = input.split("\n").reduce((sum, line) => {
    const fromLeft = line.match(/\d|one|two|three|four|five|six|seven|eight|nine/g);

    if (!fromLeft) return sum;

    const fromLeftFirst = fromLeft[0];

    const first = isNaN(fromLeftFirst) ? numberWordsMap[fromLeftFirst] : parseInt(fromLeftFirst);

    const reversedLine = line.split("").reverse().join("");

    const fromRight = reversedLine.match(/\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/g);

    if (!fromRight) return sum;

    const fromRightFirst = fromRight[0].split("").reverse().join("");

    const last = isNaN(fromRightFirst) ? numberWordsMap[fromRightFirst] : parseInt(fromRightFirst);

    const number = parseInt(`${first}${last}`);
    return isNaN(number) ? sum : sum + number;
  }, 0);

  console.log("result:", result);
}

main();
