import { runSolution } from '../utils.ts';

/** provide your solution as the return of this function */
interface Guard {
  row: number;
  col: number;
  marker: '^' | '>' | '<' | 'v';
}
type Obstacles = '#';
type Open = '.';
type Visited = 'X';
type Cell = Guard['marker'] | Visited | Obstacles | Open;
interface Game {
  grid: Cell[][];
  cellsVisited: number;
}

export async function day6a(data: string[]) {
  let guard: Guard | null = null;
  const gm: Game = {
    grid: data.map((line: string, rowNum: number) => {
      const cellsList = line.split('').map((item) => item as Cell);
      const g = guardFound(line, rowNum);
      if (g) {
        guard = g;
        cellsList[guard.col] = 'X';
      }

      return cellsList;
    }),
    cellsVisited: 1,
  };

  while (!isGameOver(gm, guard)) {
    // printGameState(gm);
    moveGuard(gm, guard);
  }

  printGameState(gm);

  return gm.cellsVisited;
}

function printGameState(gm: Game) {
  console.log(`Turn #${gm.cellsVisited}`);
  gm.grid.forEach((row) => console.log(row.join('')));
}

function moveGuard(gm: Game, gd: Guard) {
  let nextRow = gd.row;
  let nextCol = gd.col;
  if (gd.marker === '^') nextRow--;
  if (gd.marker === 'v') nextRow++;
  if (gd.marker === '<') nextCol--;
  if (gd.marker === '>') nextCol++;

  const newCell = gm.grid[nextRow][nextCol];
  switch (newCell) {
    case '.':
      // valid move
      gm.grid[nextRow][nextCol] = 'X';
      gm.cellsVisited++;

      gd.row = nextRow;
      gd.col = nextCol;
      break;
    case '#':
      // rotate guard and recurse
      rotateGuard90Deg(gd);
      moveGuard(gm, gd);
      break;
    case 'X':
      // valid move, but this cell has already been updated and counted
      gd.row = nextRow;
      gd.col = nextCol;
      break;
    default:
      throw new Error(`Invalid newCell value: ${newCell}`);
      break;
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
await runSolution(day6a);
