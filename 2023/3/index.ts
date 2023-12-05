import { type Path, loadFile } from "../utils";

async function ex1(path: Path) {
  const rows = await loadFile(path);

  let result = 0;

  rows.forEach((row, i) => {
    const numbers = row.match(/\d+/g);
    if (!numbers) return;

    let beginFrom = 0;

    numbers.forEach((number) => {
      const startIndex = row.indexOf(number, beginFrom);
      const endIndex = startIndex + number.length - 1;
      beginFrom = endIndex + 1;

      const left = row[startIndex - 1];
      const leftHasSymbol = left && left !== ".";

      const right = row[endIndex + 1];
      const rightHasSymbol = right && right !== ".";

      const top = rows[i - 1];
      let topHasSymbol = false;

      if (top) {
        for (let i = startIndex - 1; i <= endIndex + 1; i++) {
          if (top[i] && top[i] !== ".") {
            topHasSymbol = true;
          }
        }
      }

      const bottom = rows[i + 1];
      let bottomHasSymbol = false;

      if (bottom) {
        for (let i = startIndex - 1; i <= endIndex + 1; i++) {
          if (bottom[i] && bottom[i] !== ".") {
            bottomHasSymbol = true;
          }
        }
      }

      const valid = leftHasSymbol || rightHasSymbol || topHasSymbol || bottomHasSymbol;

      if (valid) {
        result += parseInt(number);
      }
    });
  });

  return result;
}

async function ex2(path: Path) {
  const rows = await loadFile(path);

  let result = 0;

  rows.forEach((row, i) => {
    const stars = row.match(/\*/g);
    if (!stars) return;

    const numbers = row.match(/\d+/g);
    const numbersTop = rows[i - 1].match(/\d+/g);
    const numbersBottom = rows[i + 1].match(/\d+/g);
    const numbersValid = (numbers?.length ?? 0) + (numbersTop?.length ?? 0) + (numbersBottom?.length ?? 0) > 1;

    let beginFrom = 0;

    stars.forEach((star) => {
      const index = row.indexOf(star, beginFrom);
      beginFrom = index + 1;

      const nums: number[] = [];

      if (numbersValid) {
        if (numbersTop) {
          let topBeginFrom = 0;

          numbersTop.forEach((number) => {
            const startIndex = rows[i - 1].indexOf(number, topBeginFrom);
            const endIndex = startIndex + number.length - 1;

            topBeginFrom = endIndex + 1;

            if (index >= startIndex - 1 && index <= endIndex + 1) {
              nums.push(parseInt(number));
            }
          });
        }

        if (numbersBottom) {
          let bottomBeginFrom = 0;

          numbersBottom.forEach((number) => {
            const startIndex = rows[i + 1].indexOf(number, bottomBeginFrom);
            const endIndex = startIndex + number.length - 1;
            bottomBeginFrom = endIndex + 1;

            if (index >= startIndex - 1 && index <= endIndex + 1) {
              nums.push(parseInt(number));
            }
          });
        }

        if (numbers) {
          let numbersBeginFrom = 0;
          numbers.forEach((number) => {
            const startIndex = row.indexOf(number, numbersBeginFrom);
            const endIndex = startIndex + number.length - 1;
            numbersBeginFrom = endIndex + 1;

            if (index >= startIndex - 1 && index <= endIndex + 1) {
              nums.push(parseInt(number));
            }
          });
        }
      }

      if (nums.length === 2) {
        result += nums[0] * nums[1];
      }
    });
  });

  return result;
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("3/test1"));
console.log("EX1 Input Result: ", await ex1("3/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("3/test2"));
console.log("EX2 Result: ", await ex2("3/input"));
console.log("-----------------------");
