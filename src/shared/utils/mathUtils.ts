export const statsBy = <T>(
  array: T[],
  iteratee: (item: T) => number | null,
) => {
  const validNumbers = array
    .map(iteratee)
    .filter((num): num is number => num !== null);

  if (validNumbers.length === 0) {
    return null;
  }

  const sum = validNumbers.reduce((acc, num) => acc + num, 0);
  const mean = sum / validNumbers.length;

  const variance =
    validNumbers.reduce((acc, num) => {
      const diff = num - mean;
      return acc + diff * diff;
    }, 0) / validNumbers.length;

  const stdev = Math.sqrt(variance);

  return { mean, stdev, variance, sum };
};
