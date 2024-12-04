import chalk from 'chalk';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function runSolution(solution: (data: string[]) => any) {
  const data = await readData();
  const answer = await solution(data);
  console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
}

type ExerciseVariant = 'a' | 'b';
function isExerciseVariant(str: string): str is ExerciseVariant {
  return str === 'a' || str === 'b';
}

function getCLITokens(): [number, ExerciseVariant, string?] {
  // drop the node executable path since it's not used
  const [, fullPath, altDataSet] = process.argv as [string, string, string];

  // `puzzle` will be in the form ['day-1', 'b']
  const puzzle = fullPath.split('/').slice(-2);
  if (!isExerciseVariant(puzzle[1])) {
    throw new Error("Only 'a' and 'b' are allowed exercise variants");
  }

  // since the `+` precedence is lower than array access, the string gets
  // cast to number after the numerical string has been split.
  const [day, part] = [+puzzle[0].split('-')[1], puzzle[1]];

  return [day, part, altDataSet];
}

export async function readData(): Promise<string[]> {
  const fileName = createInputFileName(...getCLITokens());
  const data = (await readFile(fileName)).toString().split('\n');

  // special case where the last line is an empty string
  if (data.at(-1) === '') data.pop();
  
  return data;
}

/**
 * Creates a standardized input filename so that exercises can be run in shorthand (see README.md)
 * @param {string?} dataSet slug for alternative file input (in file `day-1/a.data.sample.txt`,
 *    the slug is `sample`)
 * @returns {string} filenames of the form `day-1/a.data.sample.txt`, where `sample` is optional
 */
function createInputFileName(
  day: number,
  part: ExerciseVariant,
  altDataSet?: string
) {
  return join(
    `day-${day}`,
    `${part}.data${altDataSet ? `.${altDataSet}` : ''}.txt`
  );
}
