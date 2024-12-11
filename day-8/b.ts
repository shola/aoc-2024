import { runSolution } from '../utils.ts';

type Pos = [number, number]; // [row, col]
/** provide your solution as the return of this function */
export async function day8b(data: string[]) {
  const maxRow = data.length - 1;
  const maxCol = data[0].length - 1;
  // create map of all same frequency locations
  const antennas = new Map<string, Pos[]>();

  data.forEach((line, rowNum) => {
    Array.from(line).forEach((cell, colNum) => {
      if (cell === '.') return;

      const prevAntennas = antennas.get(cell) ?? [];
      antennas.set(cell, [...prevAntennas, [rowNum, colNum]]);
    });
  });
  // console.log(antennas);

  // create pairs of all same-frequency location permutations
  const antennaPairs = new Map<string, [Pos, Pos][]>();
  antennas.forEach((locations, freq) =>
    antennaPairs.set(freq, twoItemPermutations(locations))
  );
  // console.log(antennaPairs)

  // create valid antiNodes for all pairs
  const antiNodes = new Map<string, Pos[]>();
  // each pair will create 2 antiNodes
  antennaPairs.forEach((pairs, freq) => {
    pairs.forEach(([[y1, x1], [y2, x2]]) => {
      if (!antiNodes.has(freq)) {
        antiNodes.set(freq, []);
      }
      const prevAntiNodes = antiNodes.get(freq);
      const newAntiNodes: Pos[] = [];
      // get slope
      const yd = y2 - y1;
      const xd = x2 - x1;
      // set initial locations as antiNodes
      let p1B: Pos = [y1, x1];
      let p2B: Pos = [y2, x2];

      while (positionInRange(p1B, maxRow, maxCol)) {
        if (
          noAntiNodeFrequencyInterference(p1B, freq, antiNodes)
        ) {
          newAntiNodes.push(p1B);
        }

        p1B = [p1B[0] - yd, p1B[1] - xd];
      }

      while (positionInRange(p2B, maxRow, maxCol)) {
        if (
          noAntiNodeFrequencyInterference(p2B, freq, antiNodes)
        ) {
          newAntiNodes.push(p2B);
        }

        p2B = [p2B[0] + yd, p2B[1] + xd];
      }
      
      // Add each new antiNode to the set for this frequency
      // newAntiNodes.forEach(aNode => prevAntiNodes.add(aNode))
      prevAntiNodes.push(...newAntiNodes);
    });
  });

  const dedupedAntiNodes = new Map<string, Set<string>>();
  let numAntiNodes = 0;
  antiNodes.forEach((locations, freq) => {
    dedupedAntiNodes.set(freq, new Set(locations.map((loc) => loc.join())));
    numAntiNodes += dedupedAntiNodes.get(freq).size;
  })
  console.log(numAntiNodes);

  return 0;
}

function noAntiNodeFrequencyInterference(
  p: Pos,
  freq: string,
  antiNodes: Map<string, Pos[]>
) {
  // search all other frequencies not 'freq'
  // return true if p does not show up in any of the others
  let shouldSkip = false;
  let interferenceFound = false;

  antiNodes.forEach((locations, currFreq) => {
    if (shouldSkip || freq === currFreq) return;

    if (locations.find((loc) => loc[0] === p[0] && loc[1] === p[1])) {
      shouldSkip = true;
      interferenceFound = true;
    }
  });

  return !interferenceFound;
}

function positionInRange(p: Pos, maxRow, maxCol) {
  return p[0] <= maxRow && p[0] >= 0 && p[1] <= maxCol && p[1] >= 0;
}

function twoItemPermutations<T>(list: T[]) {
  if (list.length < 2) return [];

  const head = list[0];
  const rest = list.slice(1);

  return [...rest.map((item) => [head, item]), ...twoItemPermutations(rest)];
}

await runSolution(day8b);
