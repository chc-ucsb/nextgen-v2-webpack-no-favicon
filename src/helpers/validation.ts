/**
 * Determine if an input is defined.
 * @param input
 * @returns {boolean}
 */
export const isUndefined = (input: any): boolean => typeof input === 'undefined';

/**
 * Returns true if a given input is null or undefined.
 * @param input
 * @returns {boolean}
 */
export const isNil = (input: any): boolean => input === null || typeof input === 'undefined';

/**
 * Determine if a given input is empty.
 * Returns true for: [], '', {}, NaN, null, undefined
 * Returns false for: ['a'], 'foo', {a: 'foo'}, 1
 * @param input
 * @returns {boolean}
 */
export const isEmpty = (input: any): boolean => {
  // Check for null and undefined
  // if (input === null || typeof input === 'undefined') throw new Error(`Non-object parameter passed to isEmpty().`);
  if (isNil(input)) return true;
  // Checks for empty string
  if (typeof input === 'string') return Array.from(input).length === 0;
  // Checks for empty array
  if (Array.isArray(input)) return input.length === 0;
  // Checks for NaN
  if (typeof input === 'number') return Number.isNaN(input);
  // Checks for empty object
  if (typeof input === 'object') return Object.keys(input).length === 0;
};

/**
 * Determine if a string is a URL.
 * @param {string} input
 * @returns {boolean}
 */
export const isUrl = (input: string): boolean => {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(input);
};
