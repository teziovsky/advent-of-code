const file = Bun.file("./input.txt");

export const input = await file.text();
