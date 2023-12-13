import { type Path, loadFile } from "../utils";

async function ex1(path: Path, delimiter: string = "\n") {
  const lines = await loadFile(path, delimiter);

  const seeds: number[] = lines[0].replace("seeds: ", "").split(" ").map(Number);
  const seedPairs = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedPairs.push([seeds[i], seeds[i + 1]]);
  }

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
    if (line.includes("map:")) {
      actualCategory = line.replaceAll(" map:", "");
    } else if (!line.includes("seeds:")) {
      maps[actualCategory].push(line.split(" ").map(Number));
    }
  }

  for (let [key, map] of Object.entries(maps)) {
    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];
      for (const [dest, source, len] of map) {
        if (seed >= source && seed < source + len) {
          seeds[i] = seeds[i] - source + dest;
          break;
        }
      }
    }
  }

  return Math.min(...seeds);
}

async function ex2(path: Path, delimiter: string = "\n") {
  const lines = await loadFile(path, delimiter);

  let seeds: number[] = lines[0].replace("seeds: ", "").split(" ").map(Number);

  let seedPairs = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedPairs.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
  }

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
    if (line.includes("map:")) {
      actualCategory = line.replaceAll(" map:", "");
    } else if (!line.includes("seeds:")) {
      maps[actualCategory].push(line.split(" ").map(Number));
    }
  }

  for (let [key, map] of Object.entries(maps)) {
    const newSeeds = [];
    for (const [dest, source, length] of map) {
      const oldSeeds = [];
      for (const [start, end] of seedPairs) {
        if (start < source + length && end >= source) {
          newSeeds.push([Math.max(start, source) - source + dest, Math.min(end, source + length - 1) - source + dest]);
        }

        if (start < source) {
          oldSeeds.push([start, Math.min(end, source - 1)]);
        }

        if (end >= source + length) {
          oldSeeds.push([Math.max(start, source + length), end]);
        }
      }
      seedPairs = oldSeeds;
    }
    seedPairs.push(...newSeeds);
  }

  return Math.min(...seedPairs.flat());
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("5/test1"));
console.log("EX1 Input Result: ", await ex1("5/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("5/test2"));
console.log("EX2 Result: ", await ex2("5/input"));
console.log("-----------------------");
