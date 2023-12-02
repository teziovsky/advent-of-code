const file = Bun.file(import.meta.dir + "/input.txt");

export const input = await file.text();

const splitted = input.split("\n");

function ex1() {
  let result = 0;

  splitted.forEach((line) => {
    if (!line) return;
    console.log("line:", line);
  });

  console.log("EX1 result: ", result);
}

ex1();

console.log("\n");

function ex2() {
  let result = 0;

  splitted.forEach((line) => {
    if (!line) return;
    console.log("line:", line);
  });

  console.log("EX2 result: ", result);
}

ex2();
