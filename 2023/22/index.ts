import { type Path, loadFile } from "../../utils";

async function ex(path: Path, isEx2 = false, delimiter = "\n") {
  const rows = (await loadFile(path, delimiter)).filter(Boolean);

  const [bricks, max] = parseBricks(rows);

  const map = initializeMap(bricks, max);

  fallBricks(bricks, map);

  const [ex1, ex2] = calculateResults(bricks, map);

  return isEx2 ? ex2 : ex1;
}

function parseBricks(rows: string[]): [number[][][], number[]] {
  const max = [0, 0, 0];

  const bricks = rows.map((row) => {
    const coords = row.split("~").map((coord) => coord.split(",").map(Number));
    max[0] = Math.max(max[0], coords[1][0]);
    max[1] = Math.max(max[1], coords[1][1]);
    max[2] = Math.max(max[2], coords[1][2]);

    return coords;
  });

  return [bricks, max];
}

function initializeMap(bricks: number[][][], max: number[]): number[][][] {
  const map: number[][][] = [];

  for (let z = 0; z <= max[2]; z++) {
    const layer: number[][] = [];

    for (let y = 0; y <= max[1]; y++) {
      const row: number[] = Array(max[0] + 1).fill(+!!z - 1);
      layer.push(row);
    }

    map.push(layer);
  }

  for (let i = 0; i < bricks.length; i++) {
    const [[x1, y1, z1], [x2, y2, z2]] = bricks[i];

    for (let z = z1; z <= z2; z++) {
      for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
          map[z][y][x] = i + 1;
        }
      }
    }
  }

  return map;
}

function fallBricks(bricks: number[][][], map: number[][][]) {
  const fallingBricks = new Set<number>();
  let isFalling = true;

  while (isFalling) {
    isFalling = false;

    for (let i = 0; i < bricks.length; i++) {
      const [[x1, y1, z1], [x2, y2, z2]] = bricks[i];
      let isSupported = false;

      for (let z = z1; z <= z2; z++) {
        for (let y = y1; y <= y2; y++) {
          for (let x = x1; x <= x2; x++) {
            const below = map[z - 1][y][x];
            if (below && below !== i + 1) {
              isSupported = true;
              break;
            }
          }

          if (isSupported) {
            break;
          }
        }

        if (isSupported) {
          break;
        }
      }

      if (!isSupported) {
        isFalling = true;
        fallingBricks.add(i);

        for (let z = z1; z <= z2; z++) {
          for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
              map[z][y][x] = 0;
              map[z - 1][y][x] = i + 1;
            }
          }
        }

        bricks[i] = [
          [x1, y1, z1 - 1],
          [x2, y2, z2 - 1],
        ];
      }
    }
  }

  return fallingBricks.size;
}

function calculateResults(bricks: number[][][], map: number[][][]) {
  const [ex1, ex2] = bricks.reduce(
    ([ex1, ex2], brick) => {
      const clonedBricks = structuredClone(bricks);

      const [[x1, y1, z1], [x2, y2, z2]] = brick;

      const clonedMap = structuredClone(map);

      for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
          for (let z = z1; z <= z2; z++) {
            clonedMap[z][y][x] = 0;
          }
        }
      }

      const count = fallBricks(clonedBricks, clonedMap);

      return [ex1 - Number(!!count), ex2 + count];
    },
    [bricks.length, 0]
  );

  return [ex1, ex2];
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex("22/test1"));
console.log("EX1 Input Result: ", await ex("22/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex("22/test2", true));
console.log("EX2 Result: ", await ex("22/input", true));
console.log("-----------------------");
