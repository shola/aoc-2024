import { runSolution } from '../utils.ts';

/**
--- Part Two ---

As you scan through the corrupted memory, you notice that some of the conditional statements are also still intact. If you handle some of the uncorrupted conditional statements in the program, you might be able to get an even more accurate result.

There are two new instructions you'll need to handle:

    The do() instruction enables future mul instructions.
    The don't() instruction disables future mul instructions.

Only the most recent do() or don't() instruction applies. At the beginning of the program, mul instructions are enabled.

For example:

xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))

This corrupted memory is similar to the example from before, but this time the mul(5,5) and mul(11,8) instructions are disabled because there is a don't() instruction before them. The other mul instructions function normally, including the one at the end that gets re-enabled by a do() instruction.

This time, the sum of the results is 48 (2*4 + 8*5).

Handle the new instructions; what do you get if you add up all of the results of just the enabled multiplications?

 */

/** provide your solution as the return of this function */
export async function day3b(data: string[]) {
  // This is the closest I could get to creating a regexp that used look-behinds to select only the enabled mul's
  // const re = /((?:(?<!don't\(\).*))|(?:(?<=do\(\).*(?<!don't\(\)))))(mul\((?<x>\d+)[,](?<y>\d+)\))/g; // 48

  // Simply find all the do's, don't's and mul's
  const re = /(don't\(\))|(do\(\))|(mul\((?<x>\d+)[,](?<y>\d+)\))/g;
  /** 
   * Need to do an outer flatMap so the processing chain continues to be 1D, so reduce works.
   * The result of matchAll is a RegExpExecArray of length 1, with an inner array of all matches.
   * Each match looks like the following:
   * [
      'mul(876,459)',
      '876',
      '459',
      index: 774,
      input: "",
      groups: [Object: null prototype] { x: '876', y: '459' }
    ]
    */

  let multiplicationEnabled = true;
  const res = data
    .flatMap((line) => [...line.matchAll(re)])
    .map((op) => {
      const isMultOp = op[0].startsWith('mul');
      if (isMultOp && multiplicationEnabled) {
        return +op.groups.x * +op.groups.y;
      }

      multiplicationEnabled = op[0].startsWith('do()');

      return 0;
    })
    .reduce((sum, curr) => sum + curr, 0);

  return res;
}

await runSolution(day3b);
