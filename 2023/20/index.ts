import { type Path, loadFile, LeastCommonMultiple } from "../../utils";

interface Basic {
  name: string;
  destinations: string[];
  turnedOn?: undefined;
  inputs?: undefined;
}

interface FlipFlop {
  name: string;
  destinations: string[];
  turnedOn: boolean;
  inputs?: undefined;
}

interface Conjunction {
  name: string;
  destinations: string[];
  inputs: Map<string, boolean>;
  turnedOn?: undefined;
}

type Module = Basic | FlipFlop | Conjunction;

interface Pulse {
  from: string;
  turnedOn: boolean;
  to: string;
}

async function ex(path: Path, isPart1: boolean, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean);

  let modules = getModules(rows);

  if (isPart1) {
    let [lowCount, highCount] = [0, 0];

    for (let i = 0; i < 1000; i++) {
      const [lowPresses, highPresses] = pressButton(modules);
      lowCount += lowPresses;
      highCount += highPresses;
    }

    return lowCount * highCount;
  } else {
    const buttonsPresses = getButtonsPresses(modules);

    return findFewestPresses(modules, buttonsPresses);
  }
}

function getButtonsPresses(modules: Module[]) {
  const destModule = modules.find((mod) => mod.destinations.includes("rx"))!.inputs;

  return [...destModule?.keys()!].reduce((prev, key) => ({ ...prev, [key]: 0 }), {});
}

function isBasic(module: Module): module is Basic {
  return !("inputs" in module) && !("turnedOn" in module);
}

function isConjunction(module: Module): module is Conjunction {
  return "inputs" in module;
}

function isFlipFlop(module: Module): module is FlipFlop {
  return "turnedOn" in module;
}

function getModules(rows: string[]) {
  const modules = rows.map((row) => {
    const [label, destinationsString] = row.split(" -> ");
    const destinations = destinationsString.split(", ");

    if (label === "broadcaster") {
      return { name: label, destinations };
    } else if (label[0] === "%") {
      return { name: label.slice(1), destinations, turnedOn: false };
    } else {
      return { name: label.slice(1), destinations, inputs: new Map<string, boolean>() };
    }
  });

  for (const module of modules) {
    if (isConjunction(module)) {
      for (const mod of modules) {
        if (mod.destinations.includes(module.name)) {
          module.inputs.set(mod.name, false);
        }
      }
    }
  }

  return modules;
}

function getInputs(modules: Module[], inputModuleName: string, isHigh: boolean) {
  const inputModule = modules.find((mod) => mod.name === inputModuleName);

  if (!inputModule || (isFlipFlop(inputModule) && isHigh)) {
    return [];
  }

  let outputIsHigh = isHigh;

  if (isConjunction(inputModule)) {
    outputIsHigh = !Array.from(inputModule.inputs.values()).every(Boolean);
  } else if (isFlipFlop(inputModule) && !isHigh) {
    inputModule.turnedOn = !inputModule.turnedOn;
    outputIsHigh = inputModule.turnedOn;
  }

  return inputModule.destinations.map((destination) => ({
    destination,
    isHigh: outputIsHigh,
    source: inputModule.name,
  }));
}

function pressButton(modules: Module[]) {
  const inputs = [...getInputs(modules, "broadcaster", false)];
  let [lowPresses, highPresses] = [1, 0];

  while (inputs.length !== 0) {
    const input = inputs.shift()!;

    input.isHigh ? highPresses++ : lowPresses++;

    modules.forEach((mod) => {
      if (isConjunction(mod) && mod.inputs.has(input.source)) {
        mod.inputs.set(input.source, input.isHigh);
      }
    });

    inputs.push(...getInputs(modules, input.destination, input.isHigh));
  }

  return [lowPresses, highPresses];
}

function parseModulePulse(module: Module, pulse: Pulse) {
  if (isBasic(module)) {
    return module.destinations.map((destination) => ({
      from: module.name,
      turnedOn: pulse.turnedOn,
      to: destination,
    }));
  }

  if (isFlipFlop(module) && !pulse.turnedOn) {
    module.turnedOn = !module.turnedOn;
    return module.destinations.map((destination) => ({
      from: module.name,
      turnedOn: module.turnedOn,
      to: destination,
    }));
  }

  if (isConjunction(module)) {
    module.inputs.set(pulse.from, pulse.turnedOn);
    const turnedOn = !Array.from(module.inputs.values()).every(Boolean);
    return module.destinations.map((destination) => ({
      from: module.name,
      turnedOn,
      to: destination,
    }));
  }

  return [];
}

function findFewestPresses(modules: Module[], buttonsPresses: Record<string, number>) {
  const queue: Pulse[] = [];
  let buttonPresses = 0;

  while (true) {
    buttonPresses++;
    queue.push({ from: "button", turnedOn: false, to: "broadcaster" });

    while (queue.length) {
      const pulse = queue.shift()!;

      if (!pulse.turnedOn && buttonsPresses[pulse.to] === 0) {
        buttonsPresses[pulse.to] = buttonPresses;

        if (!Object.values(buttonsPresses).includes(0)) {
          return LeastCommonMultiple(...Object.values(buttonsPresses));
        }
      }

      const module = modules.find((mod) => mod.name === pulse.to)!;

      if (module) {
        queue.push(...parseModulePulse(module, pulse));
      }
    }
  }
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex("20/test1", true));
console.log("EX1 Input Result: ", await ex("20/input", true));
console.log("-----------------------");
console.log("EX2 Result: ", await ex("20/input", false));
console.log("-----------------------");
