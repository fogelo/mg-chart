
// Функция для вычисления среднего арифметического
export function calcMean(arr: number[]) {
  return arr.reduce((sum, x) => sum + x, 0) / arr.length;
}

// Функция для вычисления стандартного отклонения
export function calcStd(arr: number[], μ: number) {
  const variance = arr.map((x) => (x - μ) ** 2).reduce((sum, v) => sum + v, 0) /
    (arr.length - 1);
  return Math.sqrt(variance);
}

/**
 * Находит непрерывные интервалы, в которых |score| > threshold.
 * @param scores — массив z-оценок
 * @param threshold — порог аномалии (по умолчанию 1)
 */
export const getAnomalyIntervals = (
  scores: number[],
  threshold = 1
): [number, number][] => {
  const flags = scores.map((s) => Math.abs(s) > threshold);

  return flags.reduce<[number, number][]>((intervals, isAnom, i) => {
    if (isAnom && (i === 0 || !flags[i - 1])) {
      // начало нового интервала
      intervals.push([i, Math.min(i + 1, scores.length - 1)]);
    } else if (isAnom) {
      // продолжаем предыдущий интервал
      const last = intervals[intervals.length - 1];
      last[1] = Math.min(i, scores.length - 1);
    }
    return intervals;
  }, []);
};

