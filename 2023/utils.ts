export type FileNames = "input" | `test${number}`;

export type Path = `${number}/${FileNames}`;

export async function loadFile(path: Path, delimiter: string) {
  const file = Bun.file(`${path}.txt`);
  const input = await file.text();
  return input.split(delimiter);
}
