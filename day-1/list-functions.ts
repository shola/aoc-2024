export function getLocationLists(data: string[]) {
  const leftLocations = [];
  const rightLocations = [];

  data.forEach((row) => {
    const [l, r] = row.split(/\s+/).map((item) => parseInt(item));

    leftLocations.push(l);
    rightLocations.push(r);
  });

  return [leftLocations, rightLocations];
}

export function getLocationDistList(left: number[], right: number[]) {
  if (left.length !== right.length) {
    throw new Error('left and right lists must have the same number of items!');
  }

  return left.map((item, idx) => {
    return Math.abs(item - right[idx]);
  });
}

export function sumList(diffs: number[]) {
  return diffs.reduce((sum, curr) => {
    return sum + curr;
  }, 0);
}
