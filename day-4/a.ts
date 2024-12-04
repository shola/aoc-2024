import { runSolution } from '../utils.ts';

/**
--- Day 4: Ceres Search ---

"Looks like the Chief's not here. Next!" One of The Historians pulls out a device and pushes the only button on it. After a brief flash, you recognize the interior of the Ceres monitoring station!

As the search for the Chief continues, a small Elf who lives on the station tugs on your shirt; she'd like to know if you could help her with her word search (your puzzle input). She only has to find one word: XMAS.

This word search allows words to be horizontal, vertical, diagonal, written backwards, or even overlapping other words. It's a little unusual, though, as you don't merely need to find one instance of XMAS - you need to find all of them. Here are a few ways XMAS might appear, where irrelevant characters have been replaced with .:

..X...
.SAMX.
.A..A.
XMAS.S
.X....

The actual word search will be full of letters instead. For example:

MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX

In this word search, XMAS occurs a total of 18 times; here's the same word search again, but where letters not involved in any XMAS have been replaced with .:

....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX

Take a look at the little Elf's word search. How many times does XMAS appear?

 */
/** provide your solution as the return of this function */
export async function day4a(data: string[]) {

  const crosswordBoard = data.map((line) => line.split(''));
  let xmasCount = 0;

  // Check for 'XMAS' or 'SAMX' down, right, diagonalDownRight,
  // diagonalDownLeft. No need to check up or left because they
  // will already be checked by previous iterations.
  for (let r = 0; r < crosswordBoard.length; r++) {
    for (let c = 0; c < crosswordBoard[r].length; c++) {
      if (checkDown(crosswordBoard, r, c)) xmasCount++;
      if (checkRight(crosswordBoard, r, c)) xmasCount++;
      if (checkDiagonalDownRight(crosswordBoard, r, c)) xmasCount++;
      if (checkDiagonalDownLeft(crosswordBoard, r, c)) xmasCount++;
    }
  }

  return xmasCount;
}

function checkDown(crosswordBoard, r, c): boolean {
  // out of bounds
  if (r + 4 > crosswordBoard.length) return false;

  const word = [
    crosswordBoard[r][c],
    crosswordBoard[r + 1][c],
    crosswordBoard[r + 2][c],
    crosswordBoard[r + 3][c],
  ].join('');
  return word === 'XMAS' || word === 'SAMX';
}

function checkRight(crosswordBoard, r, c): boolean {
  // out of bounds
  if (c + 4 > crosswordBoard[r].length) return false;

  const word = [
    crosswordBoard[r][c],
    crosswordBoard[r][c + 1],
    crosswordBoard[r][c + 2],
    crosswordBoard[r][c + 3],
  ].join('');
  return word === 'XMAS' || word === 'SAMX';
}

function checkDiagonalDownRight(crosswordBoard, r, c): boolean {
  // out of bounds
  if (r + 4 > crosswordBoard.length || c + 4 > crosswordBoard[r].length) return false;

  const word = [
    crosswordBoard[r][c],
    crosswordBoard[r + 1][c + 1],
    crosswordBoard[r + 2][c + 2],
    crosswordBoard[r + 3][c + 3],
  ].join('');
  return word === 'XMAS' || word === 'SAMX';
}

function checkDiagonalDownLeft(crosswordBoard, r, c): boolean {
  // out of bounds
  if (r + 4 > crosswordBoard.length || c - 3 < 0) return false;

  const word = [
    crosswordBoard[r][c],
    crosswordBoard[r + 1][c - 1],
    crosswordBoard[r + 2][c - 2],
    crosswordBoard[r + 3][c - 3],
  ].join('');
  return word === 'XMAS' || word === 'SAMX';
}

await runSolution(day4a);
