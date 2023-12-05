import { type Path, loadFile } from "../utils";

async function ex1(path: Path) {
  const lines = await loadFile(path);

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
      actualCategory = parseCategory(line);
    } else if (!line.includes("seeds:")) {
      maps[actualCategory].push(line.split(" ").map(Number));
    }
  }

  let location = Infinity;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (line.includes("seeds:")) {
      const seeds = line.replace("seeds: ", "").split(" ").map(Number);

      for (const seed of seeds) {
        const resultEntry = {
          seed: seed,
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
            const resultSource = resultEntry[source];
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
              resultEntry[destination] = value;
            }
          }
        }

        location = Math.min(location, resultEntry.location);
      }
    }
  }

  return location;
}

async function ex2(path: Path) {
  const lines = await loadFile(path);

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
      actualCategory = parseCategory(line);
    } else if (!line.includes("seeds:")) {
      maps[actualCategory].push(line.split(" ").map(Number));
    }
  }

  let location = Infinity;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (line.includes("seeds:")) {
      const groups = line.match(/\d+ \d+/g);
      if (groups) {
        const groupsArr = groups.map((group) => group.split(" ").map(Number)).sort((a, b) => a[0] - b[0]);
        for (const group of groupsArr) {
          const [seed, quantity] = group;

          for (let j = 0; j < quantity; j++) {
            const currentSeed = seed + j;

            const resultEntry = {
              seed: currentSeed,
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
                const resultSource = resultEntry[source];
                let value = resultSource;

                for (let i = 0; i < map.length; i++) {
                  const [destStart, sourceStart, rangeLength] = map[i];

                  if (sourceStart <= resultSource && resultSource <= sourceStart + rangeLength) {
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
                  resultEntry[destination] = value;
                }
              }
            }

            location = Math.min(location, resultEntry.location);
          }
        }
      }
    }
  }

  return location;
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
