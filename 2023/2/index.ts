const file = Bun.file(import.meta.dir + "/input.txt");

export const input = await file.text();

function ex1() {
  console.log("input:", input);
}

ex1();

function ex2() {
  console.log("input:", input);
}

ex2();
