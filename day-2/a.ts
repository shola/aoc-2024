import { runSolution } from '../utils.ts';

/**
--- Day 2: Red-Nosed Reports ---

Fortunately, the first location The Historians want to search isn't a long walk from the Chief Historian's office.

While the Red-Nosed Reindeer nuclear fusion/fission plant appears to contain no sign of the Chief Historian, the engineers there run up to you as soon as they see you. Apparently, they still talk about the time Rudolph was saved through molecular synthesis from a single electron.

They're quick to add that - since you're already here - they'd really appreciate your help analyzing some unusual data from the Red-Nosed reactor. You turn to check if The Historians are waiting for you, but they seem to have already divided into groups that are currently searching every corner of the facility. You offer to help with the unusual data.

The unusual data (your puzzle input) consists of many reports, one report per line. Each report is a list of numbers called levels that are separated by spaces. For example:

7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9

This example data contains six reports each containing five levels.

The engineers are trying to figure out which reports are safe. The Red-Nosed reactor safety systems can only tolerate levels that are either gradually increasing or gradually decreasing. So, a report only counts as safe if both of the following are true:

    The levels are either all increasing or all decreasing.
    Any two adjacent levels differ by at least one and at most three.

In the example above, the reports can be found safe or unsafe by checking those rules:

    7 6 4 2 1: Safe because the levels are all decreasing by 1 or 2.
    1 2 7 8 9: Unsafe because 2 7 is an increase of 5.
    9 7 6 2 1: Unsafe because 6 2 is a decrease of 4.
    1 3 2 4 5: Unsafe because 1 3 is increasing but 3 2 is decreasing.
    8 6 4 4 1: Unsafe because 4 4 is neither an increase or a decrease.
    1 3 6 7 9: Safe because the levels are all increasing by 1, 2, or 3.

So, in this example, 2 reports are safe.

Analyze the unusual data from the engineers. How many reports are safe?

 */

/**
 * This puzzle can be thought of as a filter operation on the lines of input.
 * The filter function will return true if:
 * - successive numbers are either increasing or decreasing
 * - successive numbers differ by at least 1 and at most 3
 */
export async function day2a(data: string[]): Promise<number> {
  console.log(data);
  let numSafeReports = 0;

  const reports: number[][] = data.map((line: string) =>
    line.split(' ').map(Number)
  );

  reports.forEach((report) => {
    // NOTE: this does not differentiate between consecutive descending or equal values
    const isAscending = report[0] < report[1];

    // since each iteration checks `i` against `i+1`, exit before the last element
    for (let i = 0; i < report.length - 1; i++) {
      const [a, b] = [report[i], report[i + 1]];
      const diff = Math.abs(a - b);

      // Check for invalid diff and exit early. This handles the consecutive equal values
      // case with `diff === 0`, and must be checked before the direction.
      if (diff === 0 || diff > 3 || a < b !== isAscending) return;
    }

    numSafeReports++;
  });

  return numSafeReports;
}

await runSolution(day2a);
