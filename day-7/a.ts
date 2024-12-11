import { runSolution } from '../utils.ts';

/** provide your solution as the return of this function */
export async function day7a(data: string[]) {
  console.log(data);

  let sum = 0;

  data.forEach(line => {
    const [rawAnswer, rawList] = line.split(': ');
    const answer = +rawAnswer;
    const list = rawList.split(' ').map(Number);

    if (solver(list, answer)) sum += answer;
  });

  return sum;
}

// DFS trying addition first
function solver(list: number[], answer: number, intermediate?: number) {
  if (list.length === 0) return intermediate === answer;

  const head = list[0];
  const rest = list.slice(1);

  const added = intermediate ? intermediate + head : head;
  const multiplied = intermediate ? intermediate * head : head;

  return solver(rest, answer, added) || solver(rest, answer, multiplied);
}

await runSolution(day7a);
