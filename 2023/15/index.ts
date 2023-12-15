import { type Path, loadFile } from "../utils";

async function ex1(path: Path, delimiter = "\n") {
  const steps = (await loadFile(path, delimiter)).filter(Boolean).map((el) => el.replace("\n", ""));

  return steps.reduce((acc, step) => (acc += HASHMAP(step)), 0);
}

async function ex2(path: Path, delimiter = "\n") {
  const steps = (await loadFile(path, delimiter)).filter(Boolean).map((el) => el.replace("\n", ""));

  const boxes: Record<string, number>[] = Array.from({ length: 256 }, () => ({}));

  for (const step of steps) {
    const [label, focalLength] = step.split(/[-=]/);
    const operation = step.match(/[-=]/)?.[0] || "";

    const boxNumber = HASHMAP(label);

    if (operation === "=") {
      boxes[boxNumber][label] = Number(focalLength);
    } else if (operation === "-") {
      delete boxes[boxNumber][label];
    }
  }

  return boxes.reduce((acc, box, boxIndex) => {
    const sumOfFocal = Object.entries(box).reduce(
      (acc, [_, focalLength], focalLengthIndex) => acc + (boxIndex + 1) * (focalLengthIndex + 1) * focalLength,
      0
    );

    return acc + sumOfFocal;
  }, 0);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("15/test1", ","));
console.log("EX1 Input Result: ", await ex1("15/input", ","));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("15/test2", ","));
console.log("EX2 Result: ", await ex2("15/input", ","));
console.log("-----------------------");

function HASHMAP(step: string) {
  let value = 0;

  for (const char of step) {
    value += char.charCodeAt(0);
    value *= 17;
    value %= 256;
  }

  return value;
}
