const file = Bun.file(import.meta.dir + "/input.txt");

const input = await file.text();

const rows = input.split("\n");

function ex1() {
  const maxReds = 12;
  const maxGreens = 13;
  const maxBlues = 14;

  let result = 0;

  rows.forEach((row) => {
    if (!row) return;
    const gameNumber = parseInt(row.split(" ")[1]?.replace(":", ""));

    const subsets = row.replace(/Game \d+: /, "").split("; ");

    let redsPossible: boolean[] = [];
    let greensPossible: boolean[] = [];
    let bluesPossible: boolean[] = [];

    subsets.forEach((subset) => {
      const red = subset.split(", ").filter((x) => x.includes("red"))?.[0];

      if (red) {
        const redNumber = parseInt(red.replace(" red", ""));

        redsPossible.push(redNumber <= maxReds);
      }

      const green = subset.split(", ").filter((x) => x.includes("green"))?.[0];

      if (green) {
        const greenNumber = parseInt(green.replace(" green", ""));

        greensPossible.push(greenNumber <= maxGreens);
      }

      const blue = subset.split(", ").filter((x) => x.includes("blue"))?.[0];

      if (blue) {
        const blueNumber = parseInt(blue.replace(" blue", ""));

        bluesPossible.push(blueNumber <= maxBlues);
      }
    });

    if (redsPossible.every(Boolean) && greensPossible.every(Boolean) && bluesPossible.every(Boolean)) {
      result += gameNumber;
    }
  });

  console.log("EX1 result: ", result);
}

function extractNumber(subset: string, color: string) {
  return parseInt(
    subset
      .split(", ")
      .filter((x) => x.includes(`${color}`))?.[0]
      ?.replace(` ${color}`, "")
  );
}

function ex2() {
  let result = 0;

  rows.forEach((row) => {
    if (!row) return;
    const subsets = row.replace(/Game \d+: /, "").split("; ");

    let redsValues: number[] = [];
    let greensValues: number[] = [];
    let bluesValues: number[] = [];

    subsets.forEach((subset) => {
      const red = extractNumber(subset, "red");

      if (red) {
        redsValues.push(red);
      }

      const green = extractNumber(subset, "green");

      if (green) {
        greensValues.push(green);
      }

      const blue = extractNumber(subset, "blue");

      if (blue) {
        bluesValues.push(blue);
      }
    });

    const red = redsValues.sort((a, b) => a - b).at(-1) ?? 1;
    const green = greensValues.sort((a, b) => a - b).at(-1) ?? 1;
    const blue = bluesValues.sort((a, b) => a - b).at(-1) ?? 1;

    const power = red * green * blue;

    result += power;
  });

  console.log("EX1 result: ", result);
}

console.log("-----------------------");
ex1();
console.log("-----------------------");
ex2();
console.log("-----------------------");
