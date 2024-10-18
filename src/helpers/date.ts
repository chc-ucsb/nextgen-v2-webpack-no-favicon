import { getDayOfYear, isAfter, isLeapYear } from 'date-fns';
import { isEmptyString, singleDigitToDouble } from './string';

/**
 * Returns the day of the year.
 * @see {@link https://stackoverflow.com/a/40975730}
 * @see {@link https://en.wikipedia.org/wiki/Ordinal_date}
 * @param {Date} date
 * @param {boolean} ignoreLeapYear
 * @param {string} periodType
 * @returns {number}
 */
export const getOrdinalDayOfYear = (date: Date, ignoreLeapYear: boolean = globalThis.App.Config.time.ignoreLeapYear, periodType?: string): number => {
  if (!(date instanceof Date)) {
    throw new Error(`${typeof date} is not a Date object.`);
  }

  /**
   * Flag for determining if we ignore the `ignoreLeapYear` flag.
   * Returns `true` if periodType is a weekly type.
   * @default false
   * @type {boolean}
   */
  const overrideIgnoreLeapYear: boolean = ['week', 'firedanger_week', 'day'].includes(periodType.toLowerCase());

  /**
   * Value is 1 (true) if **all** of the following are true, otherwise the value is 0 (false):
   * - The passed `date` falls within a leap year.
   * - The passed date is after Feb 28.
   * - The `ignoreLeapYear` flag is true.
   * - The `overrideIgnoreLeapYear` flag is set to false.
   *
   * When determining the day of the year during a leap year while also ignoring Feb 29, any dates occurring after Feb 28 will have to
   * have their values subtracted by 1 to account for this. Days prior to Feb 29th are the same regardless of it being a leap year.
   */
  const offset: boolean = isLeapYear(date) && isAfter(date, new Date(date.getFullYear(), 1, 28)) && ignoreLeapYear && !overrideIgnoreLeapYear;
  return getDayOfYear(date) - Number(offset);
};

/**
 * Converts an ordinal day of the year to a Date object.
 * @param {number} day
 * @param {number} year
 * @returns {Date}
 */
export const ordinalDayToDate = (day: number | string, year?: number): Date => {
  let _year = year;
  let _day: number;
  if (typeof day === 'string') {
    if (isEmptyString(day)) {
      throw new Error(`Day parameter is an empty string.`);
    }
    _day = parseInt(day);
  } else _day = day;
  if (Number.isNaN(_day) || !_day) throw new Error(`Day parameter is not a valid string or number.`);
  if (!year) _year = new Date().getFullYear();
  return new Date(new Date(_year, 0, 1).setDate(_day));
};

/**
 * Transform period data into a date string.
 * @param {number} period - The month or period number.
 * @param {number} year - The 4-digit year.
 * @param {string} periodType - The type of period to convert from.
 * @returns {string}
 */
export const periodToDate = (period: number, year: number, periodType: string): string => {
  let day = 1;
  let month = 1;
  let periodOfMonth = 1;

  if (periodType === '1-day') {
    const date = new Date(year, 0, period);
    month = date.getMonth() + 1;
    day = date.getDate();
  } else if (periodType === '1-pentad') {
    /**
     * Calculate the month by dividing the period by how many total periods there
     * are in a given month and rounding up.
     */
    month = Math.ceil(period / 6);

    /**
     * Calculate which period of the month the given period is in.
     * Note: A `periodOfMonth` of 0 is *always* the last period of the month
     */
    periodOfMonth = period % 6;

    /**
     * Match the `periodOfMonth` with the `day` value from the Periodicity lookup tables.
     * https://my.usgs.gov/confluence/display/ErosGeoengine5/GeoEngine5+Database+Documentation
     */
    if (periodOfMonth === 1) day = 1;
    if (periodOfMonth === 2) day = 6;
    if (periodOfMonth === 3) day = 11;
    if (periodOfMonth === 4) day = 16;
    if (periodOfMonth === 5) day = 21;
    if (periodOfMonth === 0) day = 26;
  } else if (periodType === '1-sevenday') {
    month = Math.ceil(period / 7);
    periodOfMonth = period % 7;
    day = periodOfMonth * 7;
  } else if (periodType === '1-dekad') {
    month = Math.ceil(period / 3);
    periodOfMonth = period % 3;

    if (periodOfMonth === 1) day = 1;
    if (periodOfMonth === 2) day = 11;
    if (periodOfMonth === 0) day = 21;
  } else if (periodType === '1-month' || periodType === '2-month' || periodType === '3-month') {
    month = period;
  }

  return `${year}-${singleDigitToDouble(month)}-${singleDigitToDouble(day)}`;
};

/**
 * Get the month name for a zero-indexed month.
 * @example
 * numMonthToString(7, 'first') // A
 * numMonthToString(7, 'abbrev') // Aug
 * numMonthToString(7) // August
 *
 * @param {number} month
 * @param {"first" | "abbrev"} shortenTo
 * @returns {string}
 */
export const numMonthToString = (month: number, shortenTo?: 'first' | 'abbrev'): string => {
  const MONTHS = {
    0: ['January', 'Jan'],
    1: ['February', 'Feb'],
    2: ['March', 'Mar'],
    3: ['April', 'Apr'],
    4: ['May', 'May'],
    5: ['June', 'Jun'],
    6: ['July', 'Jul'],
    7: ['August', 'Aug'],
    8: ['September', 'Sep'],
    9: ['October', 'Oct'],
    10: ['November', 'Nov'],
    11: ['December', 'Dec'],
  };

  const [monthString, monthAbbrev]: [string, string] = MONTHS[month];
  if (shortenTo && shortenTo === 'first') return monthString[0];
  if (shortenTo && shortenTo === 'abbrev') return monthAbbrev;
  return monthString;
};

/**
 * Convert a month string to its numerical equivalent.
 * The returned month is **NOT** zero-indexed. (Jan = 1, Feb = 2, etc).
 * @param {string} str
 * @returns {number}
 */
export const monthStrToNum = (str: string): number => {
  const MONTHS = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };
  return MONTHS[str] ?? null;
};
