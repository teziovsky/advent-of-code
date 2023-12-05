import { type Path, loadFile } from "../utils";

async function ex1(path: Path) {
  const rows = await loadFile(path);

  return rows.reduce((acc, row) => {
    if (!row) return acc;
    const [_, cardNumbers] = row.split(": ");

    const [winningNumbers, myNumbers] = cardNumbers.split(" | ");

    const winningNumbersArr = (winningNumbers.match(/\d+/g) || []).map(Number).sort((a, b) => a - b);

    const myNumbersArr = (myNumbers.match(/\d+/g) || []).map(Number).sort((a, b) => a - b);

    const myWiningNumbers = myNumbersArr.filter((num) => winningNumbersArr.includes(num));

    const myPoints = myWiningNumbers.reduce((acc, num, index) => (index === 0 ? acc + 1 : acc * 2), 0);

    return acc + myPoints;
  }, 0);
}

async function ex2(path: Path) {
  const rows = await loadFile(path);

  const cards: Record<string, { points: number; copies: number }> = {};
  let result = 0;

  for (let i = 1; i < rows.length; i++) {
    cards[i] = {
      points: 0,
      copies: 0,
    };
  }

  rows.forEach((row, rowIndex) => {
    if (!row) return;
    const [_, cardNumbers] = row.split(": ");

    const [winningNumbers, myNumbers] = cardNumbers.split(" | ");

    const winningNumbersArr = (winningNumbers.match(/\d+/g) || []).map(Number).sort((a, b) => a - b);

    const myNumbersArr = (myNumbers.match(/\d+/g) || []).map(Number).sort((a, b) => a - b);

    const myWiningNumbers = myNumbersArr.filter((num) => winningNumbersArr.includes(num));

    for (let i = 0; i <= myWiningNumbers.length; i++) {
      const currentRowCopies = cards[rowIndex + 1]?.copies || 0;
      const wonCardNumber = rowIndex + 1 + i;

      if (i === 0) {
        cards[wonCardNumber].points += 1;
      } else {
        for (let j = 0; j < currentRowCopies + 1; j++) {
          cards[wonCardNumber].copies += 1;
        }
      }
    }
  });

  for (const [key, { points, copies }] of Object.entries(cards)) {
    result += points + copies;
  }

  return result;
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("4/test1"));
console.log("EX1 Input Result: ", await ex1("4/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("4/test2"));
console.log("EX2 Input Result: ", await ex2("4/input"));
console.log("-----------------------");
