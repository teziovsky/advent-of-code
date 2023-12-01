import { input } from "./text.ts";

function main() {
  const result = input.split("\n").reduce((sum, line) => {
    const numbers = line.match(/\d/g);

    if (!numbers) return sum;

    const number = parseInt(`${numbers.at(0)}${numbers.at(-1)}`);
    return isNaN(number) ? sum : sum + number;
  }, 0);

  console.log("result:", result);
}

main();
