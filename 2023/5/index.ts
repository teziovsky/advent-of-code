import { type Path, loadFile } from "../utils";

async function ex1(path: Path) {
  const lines = await loadFile(path);

  const seeds: number[] = [];
  const maps: Record<string, number[][]> = {
    "seed-to-soil": [],
    "soil-to-fertilizer": [],
    "fertilizer-to-water": [],
    "water-to-light": [],
    "light-to-temperature": [],
    "temperature-to-humidity": [],
    "humidity-to-location": [],
  };

  let actualCategory = "";

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    if (lines[i].includes("seeds:")) {
      seeds.push(...lines[i].replaceAll("seeds: ", "").split(" ").map(Number));
    } else if (lines[i].includes("map:")) {
      actualCategory = parseCategory(lines[i]);
      maps[actualCategory] = [];
    } else {
      maps[actualCategory].push(lines[i].split(" ").map(Number));
    }
  }

  const results: {
    seed: number;
    soil: number;
    fertilizer: number;
    water: number;
    light: number;
    temperature: number;
    humidity: number;
    location: number;
  }[] = [];

  seeds.forEach((seed, index) => {
    results.push({ seed, soil: 0, fertilizer: 0, water: 0, light: 0, temperature: 0, humidity: 0, location: 0 });

    Object.entries(maps).forEach(([category, map]) => {
      const [source, destination] = category.split("-to-");

      let value = results[index][source];

      map.forEach((row) => {
        const [destStart, sourceStart, rangeLength] = row;

        if (sourceStart <= value && value <= sourceStart + rangeLength) {
          for (let i = 0; i < rangeLength; i++) {
            const sourceEl = sourceStart + i;
            const destEl = destStart + i;

            if (results[index][source] === sourceEl) {
              value = destEl;
              break;
            }
          }
        }
      });

      if (value) {
        results[index][destination] = value;
      }
    });
  });

  return Math.min(...results.map((result) => result.location));
}

async function ex2(path: Path) {
  const lines = await loadFile(path);

  const seeds: number[] = [];
  const maps: Record<string, number[][]> = {
    "seed-to-soil": [],
    "soil-to-fertilizer": [],
    "fertilizer-to-water": [],
    "water-to-light": [],
    "light-to-temperature": [],
    "temperature-to-humidity": [],
    "humidity-to-location": [],
  };

  let actualCategory = "";

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    if (lines[i].includes("seeds:")) {
      const groups = lines[i].match(/\d+ \d+/g);
      groups?.forEach((group) => {
        const [seed, quantity] = group.split(" ").map(Number);
        for (let i = 0; i < quantity; i++) {
          seeds.push(seed + i);
        }
      });
    } else if (lines[i].includes("map:")) {
      actualCategory = parseCategory(lines[i]);
      maps[actualCategory] = [];
    } else {
      maps[actualCategory].push(lines[i].split(" ").map(Number));
    }
  }

  console.log("seeds:", seeds);
  console.log("maps:", maps);

  const results: {
    seed: number;
    soil: number;
    fertilizer: number;
    water: number;
    light: number;
    temperature: number;
    humidity: number;
    location: number;
  }[] = [];

  seeds.forEach((seed, index) => {
    console.log(`seed-${index}:`, seed);
    results.push({ seed, soil: 0, fertilizer: 0, water: 0, light: 0, temperature: 0, humidity: 0, location: 0 });

    Object.entries(maps).forEach(([category, map]) => {
      const [source, destination] = category.split("-to-");

      let value = results[index][source];

      map.forEach((row) => {
        const [destStart, sourceStart, rangeLength] = row;

        if (sourceStart <= value && value <= sourceStart + rangeLength) {
          for (let i = 0; i < rangeLength; i++) {
            const sourceEl = sourceStart + i;
            const destEl = destStart + i;

            if (results[index][source] === sourceEl) {
              value = destEl;
              break;
            }
          }
        }
      });

      if (value) {
        results[index][destination] = value;
      }
    });
  });

  return Math.min(...results.map((result) => result.location));
}

console.log("-----------------------");
// console.log("EX1 Test Result: ", await ex1("5/test1"));
// console.log("EX1 Input Result: ", await ex1("5/input"));
console.log("-----------------------");
// console.log("EX2 Test Result: ", await ex2("5/test2"));
console.log("EX2 Result: ", await ex2("5/input"));
console.log("-----------------------");

function parseCategory(str: string) {
  return str.replaceAll(" map:", "");
}
