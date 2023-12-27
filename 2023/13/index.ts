import { type Path, loadFile } from "../../utils";

async function ex(path: Path, maxDifferencesCount: number, delimiter = "\n\n") {
  const segments = (await loadFile(path, delimiter)).filter(Boolean).map((segment) =>
    segment
      .split("\n")
      .filter(Boolean)
      .map((row) => row.split(""))
  );

  let result = 0;

  for (const segment of segments) {
    const rotatedSegment = rotateSegment(segment);

    const segmentMirrors = checkMirror(segment, maxDifferencesCount);
    const rotatedSegmentMirrors = checkMirror(rotatedSegment, maxDifferencesCount);

    result += segmentMirrors * 100;
    result += rotatedSegmentMirrors;
  }

  return result;
}

function rotateSegment(segment: string[][]) {
  return segment[0].map((_, rowIndex) => segment.map((_, colIndex) => segment[colIndex][rowIndex]));
}

function countDifferences(row: string[], nextRow: string[]) {
  let differencesCount = 0;

  for (let index = 0; index < row.length; index++) {
    if (row?.[index] !== nextRow?.[index]) {
      differencesCount++;
    }
  }

  return differencesCount;
}

function checkMirror(segment: string[][], maxDifferencesCount: number) {
  for (let rowIndex = 0; rowIndex < segment.length; rowIndex++) {
    let allDifferencesCount = countDifferences(segment[rowIndex], segment[rowIndex + 1]);

    if (allDifferencesCount <= maxDifferencesCount) {
      for (let prevIndex = rowIndex - 1; prevIndex >= 0; prevIndex--) {
        const prevRow = segment[prevIndex];
        const prevMirrorRow = segment[rowIndex + 1 + (rowIndex - prevIndex)];

        if (!prevRow || !prevMirrorRow) {
          break;
        }

        const prevDifferencesCount = countDifferences(prevRow, prevMirrorRow);
        allDifferencesCount += prevDifferencesCount;
      }

      if (allDifferencesCount === maxDifferencesCount) {
        return rowIndex + 1;
      }
    }
  }

  return 0;
}

console.log("-----------------------");
console.log("EX1 Test Result: ", await ex("13/test1", 0));
console.log("EX1 Input Result: ", await ex("13/input", 0));
console.log("-----------------------");
console.log("EX2 Test Result: ", await ex("13/test2", 1));
console.log("EX2 Result: ", await ex("13/input", 1));
console.log("-----------------------");
