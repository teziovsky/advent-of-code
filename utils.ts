export type FileNames = "input" | `test${number}`;

export type Path = `${number}/${number}/${FileNames}`;

export async function loadFile(path: Path, delimiter: string) {
  const file = Bun.file(`${import.meta.dir}/${path}.txt`);
  const input = await file.text();
  return input.split(delimiter);
}

export function GreatestCommonDivisor(...nums: number[]): number {
  return nums.reduce((acc, n) => (!n ? acc : GreatestCommonDivisor(n, acc % n)));
}

export function LeastCommonMultiple(...nums: number[]) {
  return nums.reduce((acc, n) => (acc * n) / GreatestCommonDivisor(acc, n));
}
