import { runSolution } from '../utils.ts';

/** provide your solution as the return of this function */
interface Guard {
  row: number;
  col: number;
  marker: '^' | '>' | '<' | 'v';
}
type Obstacles = '#' | '0';
type Open = '.';
type Direction = '+' | '-' | '|';
type Cell = Guard['marker'] | Obstacles | Open | Direction;
interface Game {
  grid: Cell[][];
  cellsVisited?: number;
}

export async function day6b(data: string[]) {
  let numCycles = 0;
  let guard: Guard | null = null;
  const gm: Game = {
    grid: data.map((line: string, rowNum: number) => {
      const cellsList = line.split('').map((item) => item as Cell);
      const g = guardFound(line, rowNum);
      if (g) guard = g;

      return cellsList;
    }),
  };

  // play the game once for every open square
  gm.grid.forEach((line, rowNum) => {
    line.forEach((cell, colNum) => {
      if (cell !== '.') return;

      const visited: Record<string, Guard['marker'][]> = {};
      const guardCopy = structuredClone(guard);
      const gmCopy = {
        grid: gm.grid.map((line) => line.slice()),
      };
      // Put an obstacle in current empty space and check for cycle
      gmCopy.grid[rowNum][colNum] = '0';

      while (!isGameOver(gmCopy, guardCopy) && !cycleFound(guardCopy, visited))
        moveGuard(gmCopy, guardCopy, visited);

      if (cycleFound(guardCopy, visited)) {
        console.log(`cycle number ${++numCycles}`);
        printGameState(gmCopy);
      }
    });
  });

  return numCycles;
}

function cycleFound(gd: Guard, visited: Record<string, Guard['marker'][]>) {
  // return true if the guard has a position and marker that match visited's first item
  const key = [gd.row, gd.col].join(',');
  if (visited[key]) {
    const firstVisitedMarker = visited[key][0];
    return gd.marker === firstVisitedMarker;
  }

  return false;
}

function getDirectionalMarker(gd: Guard, cell?: Cell) {
  // No changes to make for these first 2 cases
  if (cell === '^' || cell === 'v' || cell === '<' || cell === '>') return cell;
  if (cell === '+') return cell;

  if (gd.marker === '^' || gd.marker === 'v') {
    return cell === '-' ? '+' : '|';
  }
  if (gd.marker === '<' || gd.marker === '>') {
    return cell === '|' ? '+' : '-';
  }
}
function printGameState(gm: Game) {
  gm.grid.forEach((row) => console.log(row.join('')));
}

function updateVisited(gd: Guard, visited: Record<string, Guard['marker'][]>) {
  const key = [gd.row, gd.col].join(',');
  const previousVisits = visited[key] ?? [];
  visited[key] = [...previousVisits, gd.marker];
}

function moveGuard(
  gm: Game,
  gd: Guard,
  visited: Record<string, Guard['marker'][]>
) {
  const oldRow = gd.row;
  const oldCol = gd.col;
  let nextRow = oldRow;
  let nextCol = oldCol;
  if (gd.marker === '^') nextRow = oldRow - 1;
  if (gd.marker === 'v') nextRow = oldRow + 1;
  if (gd.marker === '<') nextCol = oldCol - 1;
  if (gd.marker === '>') nextCol = oldCol + 1;

  const newCell = gm.grid[nextRow][nextCol];
  switch (newCell) {
    // These are all valid moves
    case '.':
    case '-':
    case '|':
    case '+':
    case '^':
    case 'v':
    case '<':
    case '>':
      // always update visited with old guard position
      updateVisited(gd, visited);

      // update guard position
      gd.row = nextRow;
      gd.col = nextCol;

      // update the game board's marker
      gm.grid[nextRow][nextCol] = getDirectionalMarker(gd, newCell);

      break;
    case '#':
    case '0':
      // always update visited with old guard position
      updateVisited(gd, visited);

      // Rotation implies horizontal and vertical movement, so set a '+'
      gm.grid[oldRow][oldCol] = '+';

      // rotate guard, update visited, and recurse
      rotateGuard90Deg(gd);

      moveGuard(gm, gd, visited);
      break;
    default:
      throw new Error(
        `Invalid newCell value: ${newCell} at [${nextRow}, ${nextCol}]`
      );
  }
}

function rotateGuard90Deg(gd: Guard) {
  switch (gd.marker) {
    case '^':
      gd.marker = '>';
      break;
    case 'v':
      gd.marker = '<';
      break;
    case '<':
      gd.marker = '^';
      break;
    case '>':
      gd.marker = 'v';
      break;
    default:
      throw new Error(`Invalid marker value: ${gd.marker}`);
  }
}

function isGameOver(gm: Game, gd: Guard) {
  if (gd.row === 0 || gd.row === gm.grid.length - 1) return true;
  if (gd.col === 0 || gd.col === gm.grid[0].length - 1) return true;

  return false;
}

function guardFound(line: string, rowNum: number): Guard | null {
  const guardRegexp = /[\^><v]/;
  const res = guardRegexp.exec(line);

  return res === null
    ? null
    : {
        row: rowNum,
        col: res.index,
        marker: <Guard['marker']>res[0],
      };
}

await runSolution(day6b);
