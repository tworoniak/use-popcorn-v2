// export const average = (arr: number[]) =>
//   arr.reduce((acc, cur) => acc + cur / arr.length, 0);

export function average(arr: number[]) {
  if (arr.length === 0) return 0;
  return arr.reduce((acc, cur) => acc + cur / arr.length, 0);
}
