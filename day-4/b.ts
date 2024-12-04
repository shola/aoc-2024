import { runSolution } from '../utils.ts';
/**
--- Part Two ---

The Elf looks quizzically at you. Did you misunderstand the assignment?

Looking for the instructions, you flip over the word search to find that this isn't actually an XMAS puzzle; it's an X-MAS puzzle in which you're supposed to find two MAS in the shape of an X. One way to achieve that is like this:

M.S
.A.
M.S

Irrelevant characters have again been replaced with . in the above diagram. Within the X, each MAS can be written forwards or backwards.

Here's the same example from before, but this time all of the X-MASes have been kept instead:

.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........

In this example, an X-MAS appears 9 times.

Flip the word search from the instructions back over to the word search side and try again. How many times does an X-MAS appear?

 */
/** provide your solution as the return of this function */
export async function day4b(data: string[]) {
  const crosswordBoard = data.map((line) => line.split(''));
  let xmasCount = 0;

  for (let r = 0; r < crosswordBoard.length - 2; r++) {
    for (let c = 0; c < crosswordBoard[r].length - 2; c++) {
      if (checkX(crosswordBoard, r, c)) xmasCount++;
    }
  }

  return xmasCount;
}

function checkX(crosswordBoard, r, c): boolean {
  // out of bounds
  if (r + 3 > crosswordBoard.length || c + 3 > crosswordBoard[r].length)
    return false;

  const downRight = [
    crosswordBoard[r + 0][c],
    crosswordBoard[r + 1][c + 1],
    crosswordBoard[r + 2][c + 2],
  ].join('');
  const upRight = [
    crosswordBoard[r + 2][c],
    crosswordBoard[r + 1][c + 1],
    crosswordBoard[r + 0][c + 2],
  ].join('');

  return (
    (downRight === 'MAS' || downRight === 'SAM') &&
    (upRight === 'MAS' || upRight === 'SAM')
  );
}

await runSolution(day4b);
