import { type Path, loadFile } from "../utils";

async function ex1(path: Path, delimiter = "\n") {
  const [workflowsRows, ratingsRows] = (await loadFile(path, delimiter)).filter(Boolean);

  const workflowsMap: Record<string, { condition: Function; target: string }[]> = workflowsRows
    .split("\n")
    .filter(Boolean)
    .reduce((obj, row) => {
      const [name, rules] = row.split(/[{}]/g);
      const steps = rules.split(",").map((step) => {
        const [condition, target] = step.split(":");
        if (!target) return { condition: () => true, target: condition };
        if (condition[1] === "<") {
          const [field, value] = condition.split("<");
          const numberedValue = Number(value);
          return { condition: (obj: Record<string, number>) => obj[field] < numberedValue, target };
        } else if (condition[1] === ">") {
          const [field, value] = condition.split(">");
          const numberedValue = Number(value);
          return { condition: (obj: Record<string, number>) => obj[field] > numberedValue, target };
        }
      });

      return { ...obj, [name]: steps };
    }, {});

  let result = 0;

  const ratings: Record<string, number>[] = ratingsRows
    .split("\n")
    .filter(Boolean)
    .map((row) => {
      return row
        .match(/(\w)(=)(\d+)/g)
        ?.filter(Boolean)
        .reduce((obj, rating) => {
          const [key, value] = rating.split("=");
          return { ...obj, [key]: Number(value) };
        }, {})!;
    });

  for (const rating of ratings) {
    let currentTarget = "in";

    while (currentTarget !== "A" && currentTarget !== "R") {
      const workflow = workflowsMap[currentTarget];
      let index = 0;
      while (true) {
        const step = workflow[index];
        const result = step.condition(rating);
        if (result) {
          currentTarget = step.target;
          break;
        } else {
          index++;
        }
      }
    }

    if (currentTarget === "A") {
      result += Object.values(rating).reduce((acc, value) => acc + value, 0);
    }
  }

  return result;
}

async function ex2(path: Path, delimiter = "\n") {
  const [workflowsRows] = (await loadFile(path, delimiter)).filter(Boolean);

  const workflowsMap: Record<
    string,
    { condition: { operator: string; field: string; value: number }; target: string }[]
  > = workflowsRows
    .split("\n")
    .filter(Boolean)
    .reduce((obj, row) => {
      const [name, rules] = row.split(/[{}]/g);
      const steps = rules.split(",").map((step) => {
        const [condition, target] = step.split(":");
        if (!target) return { target: condition };
        if (condition[1] === "<") {
          const [field, value] = condition.split("<");
          const numberedValue = Number(value);
          return { condition: { operator: "<", field, value: numberedValue }, target };
        } else if (condition[1] === ">") {
          const [field, value] = condition.split(">");
          const numberedValue = Number(value);
          return { condition: { operator: ">", field, value: numberedValue }, target };
        }
      });

      return { ...obj, [name]: steps };
    }, {});

  let result = 0;

  for (const rules of Object.values(workflowsMap)) {
    const ranges: Record<string, number[]> = {
      x: Array(4000).fill(1),
      m: Array(4000).fill(1),
      a: Array(4000).fill(1),
      s: Array(4000).fill(1),
    };
  }

  return result;
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("19/test1", "\n\n"));
console.log("EX1 Input Result: ", await ex1("19/input", "\n\n"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("19/test2", "\n\n"));
// console.log("EX2 Result: ", await ex2("19/input", "\n\n"));
console.log("-----------------------");
