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
    const line = lines[i];
    if (!line) continue;
    if (line.includes("seeds:")) {
      seeds.push(...line.replaceAll("seeds: ", "").split(" ").map(Number));
    } else if (line.includes("map:")) {
      actualCategory = parseCategory(line);
    } else {
      maps[actualCategory].push(line.split(" ").map(Number));
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

  for (let index = 0; index < seeds.length; index++) {
    results.push({
      seed: seeds[index],
      soil: 0,
      fertilizer: 0,
      water: 0,
      light: 0,
      temperature: 0,
      humidity: 0,
      location: 0,
    });

    for (const category in maps) {
      if (Object.prototype.hasOwnProperty.call(maps, category)) {
        const map = maps[category];
        const [source, destination] = category.split("-to-");
        const resultSource = results[index][source];
        let value = resultSource;

        for (let i = 0; i < map.length; i++) {
          const [destStart, sourceStart, rangeLength] = map[i];

          if (sourceStart <= value && value <= sourceStart + rangeLength) {
            for (let j = 0; j < rangeLength; j++) {
              const sourceEl = sourceStart + j;
              const destEl = destStart + j;

              if (resultSource === sourceEl) {
                value = destEl;
                break;
              }
            }
          }
        }

        if (value) {
          results[index][destination] = value;
        }
      }
    }
  }

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
    const line = lines[i];
    if (!line) continue;
    if (line.includes("seeds:")) {
      const groups = line.match(/\d+ \d+/g);
      if (groups) {
        for (const group of groups) {
          const [seed, quantity] = group.split(" ").map(Number);
          for (let i = 0; i < quantity; i++) {
            seeds.push(seed + i);
          }
        }
      }
    } else if (line.includes("map:")) {
      actualCategory = parseCategory(line);
    } else {
      maps[actualCategory].push(line.split(" ").map(Number));
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
  }[] = new Array(seeds.length);

  for (let index = 0; index < seeds.length; index++) {
    results[index] = {
      seed: seeds[index],
      soil: 0,
      fertilizer: 0,
      water: 0,
      light: 0,
      temperature: 0,
      humidity: 0,
      location: 0,
    };

    for (const category in maps) {
      if (Object.prototype.hasOwnProperty.call(maps, category)) {
        const map = maps[category];
        const [source, destination] = category.split("-to-");
        const resultSource = results[index][source];
        let value = resultSource;

        for (let i = 0; i < map.length; i++) {
          const [destStart, sourceStart, rangeLength] = map[i];

          if (sourceStart <= value && value <= sourceStart + rangeLength) {
            for (let j = 0; j < rangeLength; j++) {
              const sourceEl = sourceStart + j;
              const destEl = destStart + j;

              if (resultSource === sourceEl) {
                value = destEl;
                break;
              }
            }
          }
        }

        if (value) {
          results[index][destination] = value;
        }
      }
    }
  }

  return Math.min(...results.map((result) => result.location));
}

// console.log("-----------------------");
// console.log("EX1 Test Result: ", await ex1("5/test1"));
// console.log("EX1 Input Result: ", await ex1("5/input"));
console.log("-----------------------");
// console.log("EX2 Test Result: ", await ex2("5/test2"));
console.log("EX2 Result: ", await ex2("5/input"));
console.log("-----------------------");

function parseCategory(str: string) {
  return str.replaceAll(" map:", "");
}
