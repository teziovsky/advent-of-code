import { type Path, loadFile, GreatestCommonDivisor } from "../../utils";
import { chunk, range, sum, zip } from "lodash";

type Line = [[x: number, y: number, z: number], [dx: number, dy: number, dz: number]];
type Coordinate = [number, number];
type Area = [Coordinate, Coordinate];

const testArea: Area = [
  [7, 7],
  [27, 27],
];

const realArea: Area = [
  [200000000000000, 200000000000000],
  [400000000000000, 400000000000000],
];

async function ex1(path: Path, delimiter = "\n") {
  const hailstones = (await loadFile(path, delimiter))
    .filter(Boolean)
    .map((row) => chunk(row.match(/-?\d+/g)!.map(Number), 3) as unknown as Line);

  const isTest = path.includes("test");
  const area = isTest ? testArea : realArea;

  const intersects = hailstones
    .flatMap((line, index) => hailstones.slice(index + 1).map((other) => intersect(line, other)))
    .filter((point) => inArea(point, area)).length;

  return intersects;
}

function intersect([[x1, y1], [dx1, dy1]]: Line, [[x2, y2], [dx2, dy2]]: Line) {
  const slope1 = dy1 / dx1;
  const slope2 = dy2 / dx2;
  const intercept1 = y1 - slope1 * x1;
  const intercept2 = y2 - slope2 * x2;

  const x = (intercept2 - intercept1) / (slope1 - slope2);
  const y = slope1 * x + intercept1;

  const t1 = (x - x1) / dx1;
  const t2 = (x - x2) / dx2;

  const neverMeets = slope1 === slope2 || t1 < 0 || t2 < 0;
  return neverMeets ? [Infinity, Infinity] : [x, y];
}

function inArea([x, y]: number[], [[x1, y1], [x2, y2]]: Area) {
  return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}

async function ex2(path: Path, delimiter = "\n") {
  const hailstones = await loadHailstones(path, delimiter);
  const [sumsOfPos, sumsOfDx] = calculateSums(hailstones);

  const res = range(-1000, 1000).map((answer) => {
    let basesAndMods = calculateBasesAndMods(sumsOfPos, sumsOfDx, answer);
    const bases = [];
    const mods = [];

    while (basesAndMods.length > 0) {
      const [base, mod] = basesAndMods.shift()!;
      bases.push(BigInt(base));
      mods.push(BigInt(mod));
      basesAndMods = basesAndMods.filter(([m]) => GreatestCommonDivisor(m, base) === 1);
    }

    const product = bases.reduce((acc, n) => acc * n, 1n);
    const inverses = bases.map((base) => product / base);
    const multiples = calculateMultiples(bases, inverses);
    const sums = calculateSumsOfMultiplesAndMods(multiples, mods);
    const remainder = sums % product;

    const isDone = checkIsDone(sumsOfPos, sumsOfDx, remainder, answer);

    return isDone ? remainder : 0;
  });

  return Number(res.find((v) => v));
}

async function loadHailstones(path: Path, delimiter: string) {
  return (await loadFile(path, delimiter))
    .filter(Boolean)
    .map((row) => chunk(row.match(/-?\d+/g)!.map(Number), 3) as unknown as Line);
}

function calculateSums(hailstones: Line[]) {
  return zip(...hailstones).map((v) => v.map(sum));
}

function calculateBasesAndMods(sumsOfPos: number[], sumsOfDx: number[], answer: number) {
  return zip(sumsOfPos, sumsOfDx)
    .map(([p, dx]) => [Math.abs(dx! - answer), p! % (dx! - answer)])
    .sort(([m1], [m2]) => m2 - m1);
}

function calculateMultiples(bases: bigint[], inverses: bigint[]) {
  return zip(bases, inverses).map(([base, inverse]) => inverse! * nextPrime(inverse!, base!));
}

function calculateSumsOfMultiplesAndMods(multiples: bigint[], mods: bigint[]) {
  return zip(multiples, mods).reduce((acc, [mul, mod]) => acc + mul! * mod!, 0n);
}

function checkIsDone(sumsOfPos: number[], sumsOfDx: number[], remainder: bigint, answer: number) {
  const positiveInt = (n: number) => n === Math.floor(n) && n > 0;

  return zip(sumsOfPos, sumsOfDx).every(([pos, dx]) => {
    return positiveInt((Number(remainder) - pos!) / (dx! - answer));
  });
}

function nextPrime(a: bigint, b: bigint, base = 1n, mod = 0n) {
  if (a <= 1n) return base;
  return nextPrime(b, a % b, mod, base - (a / b) * mod);
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex1("2023/24/test1"));
console.log("EX1 Input Result: ", await ex1("2023/24/input"));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex2("2023/24/test2"));
console.log("EX2 Result: ", await ex2("2023/24/input"));
console.log("-----------------------");

// Inspired by https://github.com/csaunders-ldt/advent2023/blob/main/day24/solve.ts
