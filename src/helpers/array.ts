import { objPropExists } from './object';

type QueryFilter = Record<string, string | boolean | number>;

/**
 * Filter an array of objects by an arbitrary amount of properties
 * @param {Array<T>} objArray
 * @param {QueryFilter | (layer: LayerConfig) => boolean} query
 * @returns {Array<T>}
 */
export const query = <T>(objArray: Array<T>, queryParams: QueryFilter | ((layer) => boolean)): Array<T> => {
  if (queryParams instanceof Function) {
    return objArray.filter((o) => queryParams(o));
  }

  const params = Object.entries(queryParams);
  const [key, value] = params.shift();

  const found = objArray.filter((o) => o[key] === value);
  if (found.length) {
    if (!params.length) return found;
    return query(found, Object.fromEntries(params));
  }
};

/**
 * Return the first element of an array.
 * @param {Array<T>} arr
 * @returns {T}
 */
export const first = <T>(arr: Array<T> = []): T => {
  if (!Array.isArray(arr)) throw new Error('first() requires an array as a parameter.');
  return arr[0] ?? undefined;
};

/**
 * Compare the contents of two arrays for equality. Order does not matter.
 * https://stackoverflow.com/a/19746771
 * @param {Array<T>} array1
 * @param {Array<T>} array2
 * @returns {boolean}
 */
export const isArrayEqual = <T>(array1: Array<T>, array2: Array<T>): boolean => {
  return (
    array1.length === array2.length &&
    array1.sort().every(function (value, index) {
      return value === array2.sort()[index];
    })
  );
};

/**
 * Return the last element of an array.
 * @param {Array<T>} arr
 * @returns {T}
 */
export const last = <T>(arr: Array<T> = []): T => {
  if (!Array.isArray(arr)) throw new Error('last() requires an array as a parameter.');
  return arr[arr.length - 1] ?? undefined;
};

/**
 * Sort an array of objects by a given key.
 * https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
 * @param {Array<object>} arr
 * @param {string} key
 * @param {"asc" | "desc"} order
 * @returns {Array<object>}
 */
export const sortObjects = (arr: Array<object>, key: string, order: 'asc' | 'desc' = 'asc') => {
  const innerSort = (a: object, b: object): number => {
    if (!objPropExists(a, key) || !objPropExists(b, key)) {
      // property doesn't exist on either object
      return 0;
    }

    // Use toUpperCase() to ignore character casing
    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }

    // If descending order, return the inverse of the comparison value
    if (order === 'desc') comparison *= -1;

    return comparison;
  };

  return arr.sort(innerSort);
};
