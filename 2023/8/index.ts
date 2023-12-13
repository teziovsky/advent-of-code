import { type Path, loadFile } from "../utils";

async function ex1(path: Path, delimiter: string = "\n") {
  const [instructionStr, nodesStr] = (await loadFile(path, delimiter)).filter(Boolean);
  const instructions = instructionStr.split("").map((char) => Number(char === "R"));

  const nodesMap = nodesStr
    .split("\n")
    .filter(Boolean)
    .reduce<Record<string, string[]>>((obj, node) => {
      const formattedNode = node.replaceAll(/[\(\),]/g, "");
      const [B, directions] = formattedNode.split(" = ");
      const [L, R] = directions.split(" ");

      return { ...obj, [B]: [L, R] };
    }, {});

  let currentNode = "AAA";
  let steps = 0;

  while (currentNode !== "ZZZ") {
    currentNode = nodesMap[currentNode][instructions[steps % instructions.length]];
    steps++;
  }

  return steps;
}

async function ex2(path: Path, delimiter: string = "\n") {
  const [instructionStr, nodesStr] = (await loadFile(path, delimiter)).filter(Boolean);
  const instructions = instructionStr.split("").map((char) => Number(char === "R"));

  const nodesMap = nodesStr
    .split("\n")
    .filter(Boolean)
    .reduce<Record<string, string[]>>((obj, node) => {
      const formattedNode = node.replaceAll(/[\(\),]/g, "");
      const [B, directions] = formattedNode.split(" = ");
      const [L, R] = directions.split(" ");

      return { ...obj, [B]: [L, R] };
    }, {});

  let currentNodes = Object.keys(nodesMap).filter((key) => key.endsWith("A"));
  let steps = 0;
  const nodesSteps: (number | null)[] = currentNodes.map(() => null);

  while (!nodesSteps.every(Boolean)) {
    for (let i = 0; i < currentNodes.length; i++) {
      if (nodesSteps[i]) continue;

      const nodeKey = currentNodes[i];

      if (nodeKey.endsWith("Z")) {
        nodesSteps[i] = steps;
      }

      currentNodes[i] = nodesMap[nodeKey][instructions[steps % instructions.length]];
    }

    steps++;
  }

  return LeastCommonMultiple(...(nodesSteps.filter(Boolean) as number[]));
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("8/test1", "\n\n"));
console.log("EX1 Test2 Result: ", await ex1("8/test2", "\n\n"));
console.log("EX1 Input Result: ", await ex1("8/input", "\n\n"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("8/test3", "\n\n"));
console.log("EX2 Result: ", await ex2("8/input", "\n\n"));
console.log("-----------------------");

function GreatestCommonDivisor(...nums: number[]): number {
  return nums.reduce((acc, n) => (!n ? acc : GreatestCommonDivisor(n, acc % n)));
}

function LeastCommonMultiple(...nums: number[]) {
  return nums.reduce((acc, n) => (acc * n) / GreatestCommonDivisor(acc, n));
}
