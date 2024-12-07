import { runSolution } from '../utils.ts';

/**
--- Part Two ---

While the Elves get to work printing the correctly-ordered updates, you have a little time to fix the rest of them.

For each of the incorrectly-ordered updates, use the page ordering rules to put the page numbers in the right order. For the above example, here are the three incorrectly-ordered updates and their correct orderings:

    75,97,47,61,53 becomes 97,75,47,61,53.
    61,13,29 becomes 61,29,13.
    97,13,75,29,47 becomes 97,75,47,29,13.

After taking only the incorrectly-ordered updates and ordering them correctly, their middle page numbers are 47, 29, and 47. Adding these together produces 123.

Find the updates which are not in the correct order. What do you get if you add up the middle page numbers after correctly ordering just those updates?

*/
function printUpdatesListLengthHist(updates: number[][]) {
  const lengths = new Map<number, number>();

  updates.forEach((update) => {
    const len = update.length;
    const priorCount = lengths.get(len) ?? 0;
    lengths.set(len, priorCount + 1);
  });

  console.log('Updates length histogram');

  // sorted in descending order by count
  const sortedLengths = [...lengths.entries()].sort((a, b) => b[1] - a[1]);
  sortedLengths.forEach(([len, count]) =>
    console.log(`count:${count} len:${len}`, '*'.repeat(len))
  );
}

function printSortedRules(rules) {
  const sortedRules = [...rules.entries()].sort((a, b) => a[0] - b[0]); // descending
  sortedRules.forEach(([key, val]) =>
    console.log(key, ':', [...val].join(','))
  );
}

/** provide your solution as the return of this function */
export async function day5b(data: string[]) {
  const rules = new Map<number, Set<number>>();
  const updates = <number[][]>[];
  let currentInputLabel: 'rule' | 'update' = 'rule';

  for (const line of data) {
    if (line === '') {
      // Hitting an empty line indicates that the rest of the text input are updates
      currentInputLabel = 'update';
      continue;
    }

    if (currentInputLabel === 'rule') {
      const [left, right] = line.split('|');
      const blacklist = rules.get(+right) ?? new Set<number>();

      rules.set(+right, blacklist.add(+left));
    } else {
      // split updates string into a number[]
      updates.push(line.split(',').map(Number));
    }
  }
  printUpdatesListLengthHist(updates);
  printSortedRules(rules);

  const invalidUpdates = updates.filter((update) => {
    for (let i = 0; i < update.length; i++) {
      const currNum = update[i];
      const blacklist: Set<number> | undefined = rules.get(currNum);
      const rest = update.slice(i + 1);
      const violationAtCurrIdx = blacklist && blacklist.intersection(new Set(rest)).size;

      if (violationAtCurrIdx) return true;
    }

    return false;
  });

  const revalidatedUpdates = invalidUpdates.map((invalidUpdate) => {
    return fixInvalidUpdate(invalidUpdate, rules);
  });

  // TODO: verify/assert that each revalidatedUpdate is correct

  return revalidatedUpdates.reduce(
    (sum, update) => update[Math.floor(update.length / 2)] + sum,
    0
  );
}

function fixInvalidUpdate(
  invalidUpdate: number[],
  rules: Map<number, Set<number>>
) {
  // `invalidUpdate` can be thought of as a queue of values that need to be verified.
  for (let i = 0; i < invalidUpdate.length; i++) {
    const currNum = invalidUpdate[i];
    const blacklist: Set<number> | undefined = rules.get(currNum);
    const rest: number[] = invalidUpdate.slice(i + 1);
    const violationAtCurrIdx = blacklist && blacklist.intersection(new Set(rest)).size;

    if (violationAtCurrIdx) {
      // Move the currNum to the back, and slide rest to the left
      // Side-effects should normally be avoided, but works fine in this case because 
      // everything "before" the current item in the iteration is correct.
      const head = invalidUpdate.slice(0, i);
      invalidUpdate = [...head, ...rest, currNum];

      // Since a different value has been slid into the current index, repeat this iteration
      i--;
    }
  }

  return invalidUpdate;
}

await runSolution(day5b);
