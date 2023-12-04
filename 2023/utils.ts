export type FileNames = "input" | "test1" | "test2";

export async function loadFile(fileName: string) {
  const file = Bun.file(`${fileName}.txt`);
  const input = await file.text();
  return input.split("\n");
}
