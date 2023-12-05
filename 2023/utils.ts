export type FileNames = "input" | "test1" | "test2";

export type Path = `${number}/${FileNames}`;

export async function loadFile(path: Path, delimiter: string = "\n") {
  const file = Bun.file(`${path}.txt`);
  const input = await file.text();
  return input.split(delimiter);
}
