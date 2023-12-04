const file = Bun.file(import.meta.dir + "/input.txt");

export const input = await file.text();

const rows = input.split("\n");

function ex1() {
  let result = 0;

  rows.forEach((row) => {
    if (!row) return;
    const [cardNumber, cardNumbers] = row.split(": ");

    const [winningNumbers, myNumbers] = cardNumbers.split(" | ");

    const winningNumbersArr = (winningNumbers.match(/\d+/g) || []).map(Number).sort((a, b) => a - b);

    const myNumbersArr = (myNumbers.match(/\d+/g) || []).map(Number).sort((a, b) => a - b);

    const myWiningNumbers = myNumbersArr.filter((num) => winningNumbersArr.includes(num));

    const myPoints = myWiningNumbers.reduce((acc, num, index) => (index === 0 ? acc + 1 : acc * 2), 0);

    result += myPoints;
  });

  console.log("EX1 result: ", result);
}

function ex2() {
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
    const [cardNumber, cardNumbers] = row.split(": ");

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

  console.log("EX2 result: ", result);
}

console.log("-----------------------");
ex1();
console.log("-----------------------");
ex2();
console.log("-----------------------");
