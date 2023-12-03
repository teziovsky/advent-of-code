const file = Bun.file(import.meta.dir + "/input.txt");

const input = await file.text();

const rows = input.split("\n");

function ex1() {
  const result = rows.reduce((sum, row) => {
    const numbers = row.match(/\d/g);

    if (!numbers) return sum;

    const number = parseInt(`${numbers.at(0)}${numbers.at(-1)}`);
    return isNaN(number) ? sum : sum + number;
  }, 0);

  console.log("EX1 Result: ", result);
}

function ex2() {
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

  const result = rows.reduce((sum, row) => {
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

  console.log("EX2 Result: ", result);
}

console.log("-----------------------");
ex1();
console.log("-----------------------");
ex2();
console.log("-----------------------");
