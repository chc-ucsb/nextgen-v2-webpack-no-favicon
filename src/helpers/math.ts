/**
 * Calculate the average of an array of numbers.
 * @param data An array of numbers.
 */
export const calculateAverage = (data: Array<number>): number => {
  const sum = data.reduce((sum, value) => sum + value, 0);
  return sum / data.length;
};

/**
 * Calculate the standard deviation of an array of numbers.
 * @param values An array of numbers.
 */
export const calculateStandardDeviation = (values: Array<number>): number => {
  const avg = calculateAverage(values);
  const squareDiffs = values.map((val) => {
    const diff = val - avg;
    return diff * diff;
  });
  const avgSquareDiff = calculateAverage(squareDiffs);
  return Math.sqrt(avgSquareDiff);
};

/**
 * Round a number to a given amount of decimal places.
 * @param {number} value Number to round.
 * @param {number} significantDigits Number of decimal places to round to.
 * @returns {number}
 */
export const roundValue = (value: number, significantDigits: number): number => {
  if (value && significantDigits) {
    if (!Number.isNaN(value) && value.toString().indexOf('.') > -1) {
      return Math.round(value * 10 ** significantDigits) / 10 ** significantDigits;
    }
    return value;
  }
  return value;
};

/**
 * Clamp a number within a range.
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (num: number, min: number, max: number): number => {
  if (num < min) return min;
  if (num > max) return max;
  return num;
};
