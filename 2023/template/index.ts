const file = Bun.file(import.meta.dir + "/input.txt");

export const input = await file.text();

const rows = input.split("\n");

function ex1() {
  let result = 0;

  rows.forEach((row) => {
    if (!row) return;
    console.log("row:", row);
  });

  console.log("EX1 result: ", result);
}

function ex2() {
  let result = 0;

  rows.forEach((row) => {
    if (!row) return;
    console.log("row:", row);
  });

  console.log("EX2 result: ", result);
}

console.log("-----------------------");
ex1();
// console.log("-----------------------");
// ex2();
// console.log("-----------------------");
