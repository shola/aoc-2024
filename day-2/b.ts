import { runSolution } from '../utils.ts';

/**
--- Part Two ---

The engineers are surprised by the low number of safe reports until they realize they forgot to tell you about the Problem Dampener.

The Problem Dampener is a reactor-mounted module that lets the reactor safety systems tolerate a single bad level in what would otherwise be a safe report. It's like the bad level never happened!

Now, the same rules apply as before, except if removing a single level from an unsafe report would make it safe, the report instead counts as safe.

More of the above example's reports are now safe:

    7 6 4 2 1: Safe without removing any level.
    1 2 7 8 9: Unsafe regardless of which level is removed.
    9 7 6 2 1: Unsafe regardless of which level is removed.
    1 3 2 4 5: Safe by removing the second level, 3.
    8 6 4 4 1: Safe by removing the third level, 4.
    1 3 6 7 9: Safe without removing any level.

Thanks to the Problem Dampener, 4 reports are actually safe!

Update your analysis by handling situations where the Problem Dampener can remove a single level from unsafe reports. How many reports are now safe?
*/

/** provide your solution as the return of this function */
export async function day2b(data: string[]) {
  console.log(data);

  let numSafeReports = 0;

  const reports: number[][] = data.map((line: string) =>
    line.split(' ').map(Number)
  );

  /**
   * Convert each report into a list of consecutive diffs and mark as safe if:
   * - a valid report would be one where all values are negative, or all are positive
   * - 0 < diff <= 3 for all values
   * If either condition fails, remove each item in the report and try again
   */

  reports.forEach((report) => {
    // This if-else could be collapsed into a single if, but debugging would be harder
    if (hasValidDiffedReport(report)) {
      numSafeReports++;
    } else if (isValidReportWithSingleItemRemoved(report)) {
      numSafeReports++;
    }
  });

  return numSafeReports;
}

function convertReportToDiffLists(report: number[]) {
  const diffs = [];

  for (let i = 0; i < report.length - 1; i++) {
    diffs.push(report[i] - report[i + 1]);
  }

  return diffs;
}

function hasValidDiffedReport(report: number[]) {
  const diffs = convertReportToDiffLists(report);
  const allSameDirection =
    diffs.every((diff) => diff > 0) || diffs.every((diff) => diff < 0);
  const allInBounds = diffs.every(
    (diff) => Math.abs(diff) > 0 && Math.abs(diff) <= 3
  );

  return allSameDirection && allInBounds;
}

/**
 * Retry the diff checking while removing each item in the report.
 * It would be more efficient to find the first item that fails, and
 * check from there, but this algorithm handles each report as a whole
 * instead of stepping through each item.
 */
function isValidReportWithSingleItemRemoved(report: number[]) {
  for (let i = 0; i < report.length; i++) {
    const reportWithIRemoved = [...report.slice(0, i), ...report.slice(i + 1)];

    if (hasValidDiffedReport(reportWithIRemoved)) return true;
  }

  return false;
}

await runSolution(day2b);
