import { sum } from "lodash";
import { type Path, loadFile } from "../../utils";

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
        const operator = condition[1];
        const [field, value] = condition.split(operator);
        const numberedValue = Number(value);
        return {
          condition: (obj: Record<string, number>) => {
            if (operator === "<") return obj[field] < numberedValue;
            if (operator === ">") return obj[field] > numberedValue;
          },
          target,
        };
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
      const step = workflow.find((step) => step.condition?.(rating));
      if (step) {
        currentTarget = step.target;
      } else {
        currentTarget = "R";
      }
    }

    if (currentTarget === "A") {
      result += sum(Object.values(rating));
    }
  }

  return result;
}

async function ex2(path: Path, delimiter = "\n") {
  const [workflowsRows] = (await loadFile(path, delimiter)).filter(Boolean);

  const workflowsMap: Record<
    string,
    { condition?: { operator: string; field: string; value: number }; target: string }[]
  > = workflowsRows
    .split("\n")
    .filter(Boolean)
    .reduce((obj, row) => {
      const [name, rules] = row.split(/[{}]/g);
      const steps = rules.split(",").map((step) => {
        const [condition, target] = step.split(":");
        if (!target) return { target: condition };
        const operator = condition[1];
        const [field, value] = condition.split(operator);
        const numberedValue = Number(value);
        return { condition: { operator, field, value: numberedValue }, target };
      });

      return { ...obj, [name]: steps };
    }, {});

  let result = 0;

  const ranges: { condition: Record<string, { min: number; max: number }>; target: string }[] = [
    {
      condition: {
        x: { min: 1, max: 4000 },
        m: { min: 1, max: 4000 },
        a: { min: 1, max: 4000 },
        s: { min: 1, max: 4000 },
      },
      target: "in",
    },
  ];

  while (ranges.length) {
    const current = ranges.pop()!;

    if (current.target === "A") {
      const { x, m, a, s } = current.condition;
      result += (x.max - x.min + 1) * (m.max - m.min + 1) * (a.max - a.min + 1) * (s.max - s.min + 1);
    } else if (current.target !== "R") {
      const workflow = workflowsMap[current.target];

      for (const step of workflow) {
        if (step.condition) {
          const {
            condition: { operator, field, value },
            target,
          } = step;
          const clonedRange = structuredClone(current);
          Object.assign(clonedRange, { target: target });

          if (operator === "<" && current.condition[field].min < value - 1) {
            clonedRange.condition[field].max = value - 1;
            current.condition[field].min = value;
            ranges.push(clonedRange);
          } else if (operator === ">" && current.condition[field].max > value + 1) {
            clonedRange.condition[field].min = value + 1;
            current.condition[field].max = value;
            ranges.push(clonedRange);
          }
        } else {
          current.target = step.target;
          ranges.push(current);
        }
      }
    }
  }

  return result;
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("2023/19/test1", "\n\n"));
console.log("EX1 Input Result: ", await ex1("2023/19/input", "\n\n"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("2023/19/test2", "\n\n"));
console.log("EX2 Result: ", await ex2("2023/19/input", "\n\n"));
console.log("-----------------------");
