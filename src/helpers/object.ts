/**
 * Shorthand for `Object.prototype.hasOwnProperty.call(<object>, <prop>)`
 * @param {object} obj
 * @param {string} prop
 * @returns {boolean}
 */
export const objPropExists = (obj: object = {}, prop: string): boolean => {
  if (typeof obj !== 'object' && !Array.isArray(obj)) {
    throw new Error('Non-object passed to objPropExists()');
  }
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

// export const extend = (object: any, objectsToExtend: any) => {
//   for (let i = 0, len = objectsToExtend.length; i < len; i += 1) {
//     const objectToExtend = objectsToExtend[i];
//     const extendedPrototype = Object.create(objectToExtend.prototype);
//     for (const prop in extendedPrototype) {
//       if (!objPropExists(object, prop)) {
//         object.prototype[prop] = extendedPrototype[prop];
//       }
//     }
//   }
//   // Object.prototype.constuctor = object
//   object.prototype.constructor = object;
// };

/**
 * Deeply clone an object.
 * @param {T} item
 * @returns {T}
 */
export const deepClone = <T>(item: T): T => {
  return JSON.parse(JSON.stringify(item));
};

/**
 * Retrieve a property from an object. Returns null if the property doesn't exist on the object.
 * @param obj
 * @param {string} propName
 * @returns {any}
 */
export const getPropFromObject = <T>(obj: any, propName: string): propName is keyof T => (objPropExists(obj, propName) ? obj[propName] : null);

/**
 * Dereference an object property path from a dot-notated string.
 * @param {T} obj
 * @param {string} path
 * @returns {keyof T}
 */
export const convertPathToObjReference = <T>(obj: T, path: string | number = ''): any => {
  if (typeof path !== 'string') return path;
  return path.split('.').reduce((o, i) => o[i] ?? {}, obj);
};

/**
 * Have a child object inherit properties from a parent.
 * @param child
 * @param parent
 * @returns {T}
 */
export const inherits = (child: any, parent: any): any => {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
  return child;
};

/**
 * Determine if an object has a particular key set within its prototype.
 * @param {O} obj
 * @param {keyof any} key
 * @returns {key is keyof O}
 */
export const hasKey = <O>(obj: O, key: keyof any): key is keyof O => {
  return key in obj;
};

/**
 * Print a formatted object to the console.
 * @param {object} obj
 * @returns {string}
 */
export const prettyPrintObject = (obj: object): string => {
  return JSON.stringify(obj, null, 4);
};

/**
 * Format an object's properties to UPPERCASE.
 * @param {object} obj
 * @returns {object}
 */
export const convertPropsToUppercase = (obj: object): object => {
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    throw new Error('Non-object passed to convertPropsToUppercase()');
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [key.toUpperCase(), value];
    })
  );
};

/**
 * Format an object's properties to LOWERCASE.
 * @param {object} obj
 * @returns {object}
 */
export const convertPropsToLowercase = (obj: object): object => {
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    throw new Error('Non-object passed to convertPropsToUppercase()');
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [key.toLowerCase(), value];
    })
  );
};
