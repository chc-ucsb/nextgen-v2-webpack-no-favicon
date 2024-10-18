import { format as formatDate, parseISO } from 'date-fns';
import { Dictionary, LayerConfig } from '../@types';
import { logger } from '../utils';
import { getBlocksByName } from './extjs';
import { objPropExists } from './object';

/**
 * Generate a random alphanumeric string of an arbitrary length.
 * @param {number} len The length of the string to generate.
 * @param {number} bits The radix to be used when converting numbers into strings.
 * @returns {string}
 */
export const getRandomString = (len: number, bits = 36): string => {
  if (!len) throw new Error(`A length attribute is required.`);

  // http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
  let outStr = '';
  let newStr;
  while (outStr.length < len) {
    newStr = Math.random().toString(bits).slice(2);
    outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
  }
  return outStr.toUpperCase();
};

/**
 * Transform a given string into a numerical hash.
 * @param {string} string
 * @returns {number}
 */
export const hashCode = (string = ''): number => {
  let hash = 0;
  if (!string.length || typeof string !== 'string') return hash;
  for (let i = 0; i < string.length; i += 1) {
    const char = string.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + char;
    // Convert to 32 bit integer
    // eslint-disable-next-line no-bitwise
    hash &= hash;
  }
  return hash;
};

/**
 * Convert a base64/URLEncoded data component to raw binary data held in a string
 * @param {string} dataUri
 * @param {string} mime
 * @returns {Blob}
 */
export const dataUriToBlob = (dataUri: string, mime: string): Blob => {
  // Convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataUri.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataUri.split(',')[1]);
  } else {
    byteString = unescape(dataUri.split(',')[1]);
  }

  // Write the bytes to a typed array
  const blobParts = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i += 1) {
    blobParts[i] = byteString.charCodeAt(i);
  }

  return new Blob([blobParts], { type: mime });
};

/**
 * Determine if a given input is typeof 'string'.
 * @param input
 * @returns {boolean}
 */
export const isString = (input: any): boolean => typeof input === 'string';

/**
 * Determine if a given string is empty.
 * @param input
 * @returns {boolean}
 */
export const isEmptyString = (input: string): boolean => input === '';

/**
 * Determine if a URI component is encoded or not.
 * @param {string} str
 * @returns {boolean}
 */
export const isURIComponentEncoded = (str: string): boolean => decodeURIComponent(str) !== str;

/**
 * Get the query parameters from a URL.
 * @param {string} url
 * @returns {string}
 */
export const getUrlQueryString = (url: string): string => {
  if (typeof url !== 'string') {
    throw new Error('Non-string passed to getUrlQueryString()');
  }
  return url.slice(url.indexOf('?') + 1);
};

/**
 * Transform an object into URL query parameters.
 * Any keys with undefined values will still be added to the query string
 * but will not have any value.
 * Performs the inverse of {@link objFromUrlQueryParams}
 * @param {Record<string, string>} obj
 * @returns {string}
 */
export const objToUrlQueryParams = (obj: Record<string, unknown>): string => {
  /**
   * Get the encoded version of a given string.
   * Determines if the given string is already encoded.
   * If it is, there's no change and the string is returned.
   * If it's not, the result of encodeURIComponent(string) is returned.
   * @param {string} str
   * @returns {string}
   */
  const encode = (str: string): string => (isURIComponentEncoded(str) ? str : encodeURIComponent(str));

  return (
    Object.entries(obj)
      // Turn each key-value pair into `key=value`
      .map(([key, val]) => `${key}=${encode(String(val))}`)
      .join('&')
  );
};

/**
 * Parse URL query parameters from a string into an object.
 * Performs the inverse of {@link objToUrlQueryParams}
 * @param {string} string
 * @returns {Record<string, string>}
 */
export const objFromUrlQueryParams = (string: string): Record<string, string> => {
  const obj = {};
  getUrlQueryString(string)
    .split('&')
    .map(function (param) {
      // getUrlQueryString will return the whole URL if there are no query parameters.
      if (param === string || param === '') return;
      const [key, value] = param.split('=');
      obj[key] = value;
    });
  return obj;
};

/**
 * Remove the query parameters from a URL.
 * Returns the part of a URL just before the '?'. If the URL does not have a '?'
 * the whole string is returned.
 * @param {string} url
 * @returns {string}
 */
export const getBaseUrl = (url: string): string => {
  return url.slice(0, url.includes('?') ? url.indexOf('?') : undefined);
};

/**
 * Creates a GET URL from a url and a parameter object.
 * @param {string} baseUrl
 * @param {Record<string, string>} parameters
 * @returns {string}
 */
export const buildUrl = (baseUrl: string, parameters: Record<string, unknown>): string => {
  let cleanedUrlBase = getBaseUrl(baseUrl);

  // Append passed parameters to any parameters already set on the URL.
  const _parameters = Object.assign(objFromUrlQueryParams(baseUrl), parameters);

  if (!cleanedUrlBase.endsWith('?')) cleanedUrlBase += '?';

  return `${cleanedUrlBase}${objToUrlQueryParams(_parameters)}`;
};

/**
 * Parses a url with GET parameters into a user-friendly object
 * so you can access the parameter values.
 * @param {string} url
 * @returns {Dictionary}
 */
export const parseGETURL = (url: string): Dictionary => {
  return {
    baseUrl: getBaseUrl(url),
    ...objFromUrlQueryParams(getUrlQueryString(url)),
  };
};

export const parseXML = (xml: string): Document => {
  return new DOMParser().parseFromString(xml, 'text/xml');
  /*
   * If (window.DOMParser) {
   *   return new window.DOMParser().parseFromString(xml, 'text/xml')
   * }
   */

  /*
   * // Compatibility with IE5, IE6
   * if (typeof window.ActiveXObject !== 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
   *   const xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM')
   *   xmlDoc.async = 'false'
   *   xmlDoc.loadXML(xml)
   *   return xmlDoc
   * }
   * return null
   */
};

/**
 * Transform a number into a string prefixed with zeroes.
 * @param {number} num
 * @param {number} size
 * @returns {string}
 */
export const formatNumber = (num: number, size: number): string => {
  // FIXME: while loop doesn't actually change the number after the first loop?
  let number = num.toString();
  while (number.toString().length < size) {
    number = `0${number.toString()}`;
  }

  return number;
};

/**
 * Truncate a string to a given length, ending in an ellipsis.
 * @param {string} text The string to truncate.
 * @param {number} startIndex Index of where to start slicing the string.
 * @param {number} lengthLimit Max length of the truncated string.
 * @returns {string}
 */
export const truncateString = (text: string, startIndex = 0, lengthLimit = 15): string => {
  const endIndex = lengthLimit - 1;
  if (text.length > lengthLimit) return `${text.slice(startIndex, endIndex)}...`;
  return text;
};

/**
 *  Replaces all variable parameters in a url.
 *
 *  This function will take each variable in a url such as '{{fewsId}}',
 *  converts the variable name to a function name like 'getFewsId', calls the
 *  function by name (defined in globalThis.App.RemoteResource.urlParamGetters) passing
 *  in the boundary and layer, then replaces the variable '{{fewsId}}' with the return value of getFewsId.
 */
export const buildUrlParams = (url: string, obj1?: {}, obj2?: {}): string => {
  const { urlParamGetters } = globalThis.App.RemoteResource;
  let originalUrl = url;

  while (url.includes('{{')) {
    const param = url.substring(url.indexOf('{{') + 2, url.indexOf('}}'));
    url = url.substring(0, url.indexOf('{{')) + url.substring(url.indexOf('}}') + 2);

    let functionName = `get${param.slice(0, 1).toUpperCase()}${param.slice(1)}`;
    while (functionName.includes('_')) {
      const index = functionName.indexOf('_');
      functionName = functionName.substring(0, index) + functionName.substr(index + 1, 1).toUpperCase() + functionName.substring(index + 2);
    }

    if (typeof urlParamGetters[functionName] === 'undefined') {
      logger.error(`URL parameter getter ${functionName} does not exist.`);
      originalUrl = originalUrl.replace(`{{${param}}}`, 'undefined');
    } else {
      originalUrl = originalUrl.replace(`{{${param}}}`, urlParamGetters[functionName](obj1, obj2));
    }
  }

  return originalUrl;
};

/**
 * Determine if a given JSON object is valid or not.
 * @param {string} input
 * @returns {boolean}
 */
export const isJSONValid = (input: string): boolean => {
  try {
    JSON.parse(input);
  } catch (e) {
    logger.error('String is not a valid JSON.', input);
    logger.debug(e);
    return false;
  }
  return true;
};

export const XMLtoJSON = (data: any): any => {
  let obj: any = {};
  let xml = data;
  if (typeof xml === 'string') {
    xml = parseXML(xml);
  }

  if (xml.nodeType === 1) {
    /*
     * Element
     * do attributes
     */
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let j = 0; j < xml.attributes.length; j += 1) {
        const attribute = xml.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    // Text
    obj = xml.nodeValue;
    if (obj.replace(/\s/g, '') === '') return '';
  }

  // Do children
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i += 1) {
      const item = xml.childNodes.item(i);
      const { nodeName } = item;
      if (typeof obj[nodeName] === 'undefined') {
        const temp = XMLtoJSON(item);
        if (temp !== '') obj[nodeName] = temp;
      } else {
        const temp = XMLtoJSON(item);
        if (temp !== '') {
          if (typeof obj[nodeName].push === 'undefined') {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(temp);
        }
      }
    }
  }
  return obj;
};

/**
 * Determine if a given string is not undefined, empty, or null.
 * @param {string} property
 * @returns {boolean}
 */
export const propExists = (property: string): boolean => {
  return typeof property !== 'undefined' && property !== '' && property !== null;
};

/**
 * Adds a leading zero to a single-digit number.
 * If the number is greater than 1 digit, return unchanged number.
 * @param {number} num
 * @returns {string}
 */
export const singleDigitToDouble = (num: number): string => {
  return String(num).length === 1 ? `0${num}` : num.toString();
};

/**
 * Convert a WMS-Time string to a granule name.
 * @param {string} wmstTime
 * @param {string} folderType
 * @returns {string}
 */
export const wmstTimeToGranuleName = (wmstTime: string, folderType: string): string => {
  // FIXME: Granule Name should be in format `folderType_startDate_endDate`
  const time = wmstTime.split('-').join('');
  return `${folderType}_${time}_${time}`;
};

/**
 * Build the granule name for a given layer.
 * @param {LayerConfig} layer
 * @returns {string}
 */
export const buildLayerGranuleName = (layer: LayerConfig): string => {
  // Get the layer ID of either the parent (in the case of a virtual dataset) or of the layer itself.
  const layerId = layer?.parentGranuleName || layer.id;
  const g = globalThis.App.Layers._granules.get(layerId);
  const splitName = layer?.wmstName.split('_') ?? layer.name.split('_');
  const folderType = splitName[splitName.length - 1];
  return `${folderType}_${g.activeInterval.start}_${g.activeInterval.end}`;
};

/**
 * Build the granule name for a given child layer and return it
 * @param {LayerConfig} layer
 * @param {any} activeInterval
 * @returns {string}
 */
export const buildChildLayerGranuleName = (layer: LayerConfig, activeInterval): string => {
  const g = activeInterval;
  const splitName = layer?.wmstName.split('_') ?? layer.name.split('_');
  const folderType = splitName[splitName.length - 1];
  return `${folderType}_${g.start}_${g.end}`;
};

/**
 * Build the displayed label for a given layer.
 * @param {LayerConfig} layer
 * @returns {string}
 */
export const buildLabel = (layer: LayerConfig): string => {
  const unit = typeof layer.unit !== 'undefined' && layer.unit !== '' ? ` (${layer.unit})` : '';
  const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

  if (typeof layer.timeseries !== 'undefined') {
    let g;
    if (layer?.parentGranuleName) g = globalThis.App.Layers._granules.get(layer?.parentGranuleName);
    else g = globalThis.App.Layers._granules.get(layer.id);

    if (g?.activeInterval?.layerName) {
      // get the layer for the child dataset
      const hiddenLayers = globalThis.App.Layers.query(
        layersConfig,
        (layer) => {
          return layer.additionalAttributes?.rasterDataset === g.activeInterval?.layerName;
        },
        ['hidden']
      );

      layer = hiddenLayers[0];
    }
    if (g) {
      const startDate = parseISO(g.activeInterval.start);
      const endDate = parseISO(g.activeInterval.end);

      // Default format example: Jun-23rd, 2020
      const format = layer?.additionalAttributes?.format ?? 'MMM do, yyyy';
      const formatStart = formatDate(startDate, format);
      const formatEnd = formatDate(endDate, format);

      // Only add the unit if a custom format hasn't been set on the layer.
      const suffix = layer?.additionalAttributes?.format ? '' : unit;

      if (formatStart === formatEnd) return `${layer.title} (${formatEnd})${suffix}`.trim();
      return `${layer.title} (${formatStart} - ${formatEnd})${suffix}`.trim();
    }
  }
  return `${layer.title}${unit}`.trim();
};

/**
 * Convert a string to a filename-ready format by stripping all special characters
 * and using an underscore as a delimiter between the strings.
 * @param {string} str
 * @returns {string}
 */
export const toFilename = (str: string): string => {
  /**
   * Note: Trenton B. requested that filenames not have parentheses or hyphens
   * because ArcMAP or ENVI has issues with files with those in the name.
   */
  return (
    str
      // Remove periods, commas, dashes, and parentheses.
      .replace(/(\.|,|-|[()])/g, '')
      // Remove ordinal suffix from numbers (st, nd, rd, th)
      .replace(/(\d+)(?:st|nd|rd|th)/g, '$1')
      // Split string by the spaces.
      .split(' ')
      // Filter out all remaining special characters.
      .filter((str) => str.match(/\w/g))
      // Join the array back into a string using an underscore as the delimiter.
      .join('_')
  );
};

/**
 * Check if a string is a valid period name.
 *
 * Passable values: '2018', '2018-2019'.
 * Invalid values: 'median_2000-2018', 'mean_2000-2017', anything with characters or an underscore.
 * @param string
 * @returns {boolean}
 */
export const isValidPeriodName = (string: string): boolean => {
  // Negative lookahead for multiple chars and optionally an underscore (fails if any of these exist)
  // Look for either 1 or 2 sets of 4 digits followed by an optional dash (-)
  return /^(?!\w+[_?])(\d{4}-?){1,2}$/.test(string);
};

/**
 * Check if a string is a valid static season name.
 *
 * Passable values: 'median_2000-2018', 'mean_2000-2017', anything with characters or an underscore.
 * Invalid values: '2018', '2018-2019'.
 * @param {string} string
 * @returns {boolean}
 */
export const isStaticSeasonName = (string: string): boolean => {
  // Look for multiple chars and optionally an underscore
  return /^\w+[_?]/.test(string);
};

/**
 * Convert a string to camel case.
 * toCamelCase("EquipmentClass name");
 * toCamelCase("Equipment className");
 * toCamelCase("equipment class name");
 * toCamelCase("Equipment Class Name");
 * all output "equipmentClassName"
 * https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 * @param {string} str
 * @returns {string}
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};
