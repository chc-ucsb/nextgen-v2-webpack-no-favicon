import {
  addDays,
  addMonths,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfMonth,
  formatISO,
  getMonth,
  getYear,
  isLeapYear,
  isWithinInterval,
  lastDayOfMonth,
  lastDayOfYear,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { TimeConfig } from '../Config';
import { monthStrToNum, numMonthToString } from '../helpers/date';
import { EventHandler } from '../EventCenter';
import { singleDigitToDouble } from '../helpers/string';
import { getDurationForPeriodType, getPeriodsPerMonth } from '../helpers/granule';
import { sortObjects } from '../helpers/array';

type GranuleConfig = {
  start: Date;
  end: Date;
  periodType: string;
  continuous?: boolean;
  // intervals to offset the activeInterval by
  offset?: number;
  children?: Array<ChildGranuleConfig>;
};

type ChildGranuleConfig = {
  start: {
    granule_start: string;
    granule_end: string;
  };
  end: {
    granule_start: string;
    granule_end: string;
  };
  layerName: string;
  label: string;
  groupName: string;
  order: number;
};

type SelectableMonth = {
  value: number;
  text: string;
};

type SelectableYear = {
  value: number;
  text: number;
};

/**
 * Creates an interval object.
 * @param {Date} start
 * @param {Date} end
 * @returns {Record<string, string>}
 */
const makeInterval = (start: Date, end: Date): Record<string, string> => {
  return {
    start: formatISO(start, { representation: 'date' }),
    end: formatISO(end, { representation: 'date' }),
  };
};

/**
 * Manages timeseries granules and datepicker selection.
 * Given granule, the available months/years/intervals are then extrapolated.
 * See {@link GranuleConfig} and {@link TimeConfig} for available options.
 */
export class Granule {
  /**
   * Internal property to track the amount of periods created for the month.
   */
  private _periodCount: number;

  /**
   * The start date of the granule.
   */
  start: Date;

  /**
   * The end date of the granule.
   */
  end: Date;

  /**
   * The periodicity type of the granule.
   */
  periodType: string;

  /**
   * Don't limit the size of periods to the remaining days left in the month.
   */
  continuous: boolean;

  /**
   * Layer name associated to the granule children
   */
  layerName: string;

  /**
   * Label associated to the granule children
   */
  label: string;

  /**
   * An array of interval objects.
   */
  intervals: Array<Record<string, string>>;

  /**
   * The interval that is currently active.
   */
  activeInterval: Record<string, string>;

  /**
   * Options for configuring `startOfWeek` and `ignoreLeapYear`
   */
  options: TimeConfig;

  /**
   * An event handler for datepicker interactions.
   */
  events: EventHandler;

  /**
   * The index of the active interval within `intervals`
   */
  selectedIntervalIndex: number;

  /**
   * The currently selected month within the datepicker. Used for filtering.
   */
  selectedMonthIndex: number;

  /**
   * The currently selected year within the datepicker. Used for filtering.
   */
  selectedYearIndex: number;

  /**
   * An array of months that are selectable in the datepicker.
   */
  selectableMonths: Array<SelectableMonth>;

  /**
   * An array of the years that are selectable in the datepicker.
   */
  selectableYears: Array<SelectableYear>;

  /**
   * The index of the selected selectable interval.
   */
  selectedSelectableIntervalIndex: number;

  /**
   * The currently selected month
   */
  selectedMonth: SelectableMonth;

  /**
   * Flag that is set within the constructor. Affects getIntervalsWithinSelectedMonthYear()
   */
  initializing: boolean;

  constructor(config?: GranuleConfig, options: TimeConfig = globalThis.App.Config.time) {
    this.options = options;
    this.events = new EventHandler();
    if (!config) return;

    this.initializing = true;
    this.start = config.start;
    this.end = config.end;
    this.periodType = config.periodType;
    this.continuous = config.continuous;

    // Generate the intervals.
    this._populateIntervals();

    // Set the active interval.
    this.activeInterval = this.intervals[this.intervals.length - 1];
    if (!this.activeInterval) {
      this.activeInterval = {
        start: this.start.toString(),
        end: this.end.toString(),
      };
    }

    // Set the defaults to be used in the datepicker.
    this.selectableYears = this.getYearsOfIntervals();
    this.selectedIntervalIndex = this.getSelectedIntervalIndex();
    this.selectableMonths = this.getSelectableMonths();
    this.selectedMonth = this.selectableMonths[this.selectableMonths.length - 1];
    this.selectedMonthIndex = this.selectableMonths.indexOf(this.selectedMonth);
    this.selectedYearIndex = this.selectableYears.findIndex((y) => y.text === parseInt(this.activeInterval.start.slice(0, 4)));

    this.setSelectedSelectableIntervalIndex();

    if (config?.offset) {
      let index = this.selectedIntervalIndex - config.offset;
      // Guard against negative index. If the offset is negative, set it to 0.
      if (index < 0) index = 0;
      this.setSelectedIntervalIndex(index);
    }

    this.initializing = false;
  }

  /**
   * Populate the `intervals` array with every interval that falls within the `start` and `end` dates.
   */
  private _populateIntervals(): void {
    let tmpStart;
    let tmpEnd;

    this.intervals = [];
    if (!this.continuous) this._periodCount = 0;
    if (!tmpStart) tmpStart = this.start;
    if (!tmpEnd) tmpEnd = this._getNextGranuleEnd(tmpStart);

    while (this._intervalIsWithinBounds(tmpEnd)) {
      this.intervals.push(makeInterval(tmpStart, tmpEnd));
      this._incrementPeriodCount();
      this._resetPeriodCount();

      // Setup the dates for the next granule
      tmpStart = this._getNextGranuleStart(tmpEnd, tmpStart);
      tmpEnd = this._getNextGranuleEnd(tmpStart);
    }
  }

  /**
   * Increments the period counter by 1.
   */
  private _incrementPeriodCount(): void {
    if (this.periodType === 'pentad' || this.periodType === 'pentad_10daycomposite' || this.periodType === 'dekad') {
      this._periodCount += 1;
    }
  }

  /**
   * Sets the period counter back to 0.
   */
  private _resetPeriodCount(): void {
    if (this.periodType === 'pentad' || this.periodType === 'pentad_10daycomposite' || this.periodType === 'dekad') {
      if (this._periodCount === getPeriodsPerMonth(this)) {
        this._periodCount = 0;
      }
    }
  }

  /**
   * Calculate the start date for the following granule when given the end date.
   * @param {Date} interval
   * @param {Date} prevStart
   * @returns {Date}
   */
  private _getNextGranuleStart(interval: Date, prevStart?: Date): Date {
    if (this.periodType === '2month') {
      // For 2month periods, the start of the following granule is the beginning of the month
      // following the start date (JAN-FEB, FEB-MAR, MAR-APR, etc)
      return startOfMonth(interval);
    }
    if (this.periodType === '3month') {
      // For 3month periods, the start of the following granule is the beginning of the month
      // following the start date (JAN-FEB-MAR, FEB-MAR-APR, MAR-APR-MAY, etc)
      return startOfMonth(subMonths(interval, 1));
    }

    if (this.periodType === 'pentad_10daycomposite') {
      // We always want the second interval in a month to be the first day of the month
      if (this._periodCount === 1) {
        const tmpDate = addDays(interval, 5);
        tmpDate.setDate(1);
        return tmpDate;
      }

      return addDays(prevStart, 5);
    }

    // Increment the start date by 1 day.
    let d = addDays(interval, 1);
    if (
      isLeapYear(d) &&
      getMonth(d) === 1 &&
      isWithinInterval(new Date(getYear(d), 1, 29), {
        start: interval,
        end: d,
      }) &&
      !this.continuous &&
      this.options.ignoreLeapYear
    ) {
      d = addDays(interval, 2);
    }

    return d;
  }

  /**
   * If `ignoreLeapYear` === true, change any 2-29 date to 2-28.
   * @param {Date} d
   * @param {Date} interval
   * @returns {Date}
   */
  private _leapYearCheck(d: Date, interval: Date): Date {
    if (
      isLeapYear(d) &&
      getMonth(d) === 1 &&
      isWithinInterval(new Date(getYear(d), 1, 29), {
        start: interval,
        end: d,
      }) &&
      !this.continuous &&
      this.options.ignoreLeapYear
    ) {
      d = new Date(getYear(d), 1, 28);
    }
    return d;
  }

  /**
   * Calculate the end date for a given granule when given the start date.
   * @param {Date} interval
   * @returns {Date}
   */
  private _getNextGranuleEnd(interval: Date): Date {
    // TODO: Remove 'firedanger_week' when G5 config changes it to 'week'
    if (
      this.periodType === 'pentad' ||
      this.periodType === 'dekad' ||
      this.periodType === 'firedanger_week' ||
      this.periodType === 'week' ||
      this.periodType === 'pentad_10daycomposite'
    ) {
      if (this.continuous) {
        return addDays(interval, getDurationForPeriodType(this.periodType) - 1);
      }

      if (this.periodType === 'pentad_10daycomposite') {
        // last period needs to go to end of month
        if (this._periodCount === getPeriodsPerMonth(this) - 1) {
          return endOfMonth(interval);
        }

        if (this._periodCount === 0) {
          const tmpDate = addMonths(interval, 1);
          tmpDate.setDate(5);

          return tmpDate;
        }

        return addDays(interval, getDurationForPeriodType(this.periodType) - 1);
      }

      // If NOT continuous
      // We subtract 1 from getPeriodsPerMonth because the _periodCount is incremented AFTER this is calculated
      // Ex. _periodCount for Pentad is 5 while calculating the FINAL _getNextGranuleEnd, causing the last period to be only 1 day long
      if (this._periodCount < getPeriodsPerMonth(this) - 1) {
        // Temporarily add the days to the interval
        const tmpDate = addDays(interval, getDurationForPeriodType(this.periodType) - 1);

        // Check if the months are different. If they are, we know that adding the days crosses month boundaries
        // So we return the end of the month instead
        if (getMonth(interval) !== getMonth(tmpDate)) {
          return this._leapYearCheck(endOfMonth(interval), interval);
        }

        // If the months are the same, return the temporary date.
        return tmpDate;
      }
      return this._leapYearCheck(endOfMonth(interval), interval);
    }

    if (this.periodType === 'day') {
      return interval;
    }

    if (this.periodType === 'month') {
      return this._leapYearCheck(endOfMonth(interval), interval);
    }

    if (this.periodType === '2month') {
      return this._leapYearCheck(lastDayOfMonth(addMonths(interval, 1)), interval);
    }

    if (this.periodType === '3month') {
      return this._leapYearCheck(lastDayOfMonth(addMonths(interval, 2)), interval);
    }

    if (this.periodType === 'year') {
      return lastDayOfYear(addDays(interval, 1));
    }
  }

  /**
   * Check if a date is within the start and end bounds of the Granule.
   * @returns {boolean}
   */
  private _intervalIsWithinBounds(interval: Date): boolean {
    // Set the time to 0:0:0 because _getNextGranuleEnd sets the time to 23:59:59,
    // causing isWithinInterval to return false.
    // This is because parseISO sets the time to 0:0:0 by default. Since `this.start`
    // and `this.end` are assigned using parseISO, both of their times would be 0:0:0.
    // So isWithinInterval would return false for the same date from _getNextGranuleEnd as `this.end`
    // because this.end is 0:0:0 and being compared to 23:59:59, which is after.
    const _interval = new Date(interval.getFullYear(), interval.getMonth(), interval.getDate(), 0, 0, 0);
    return isWithinInterval(_interval, {
      start: this.start,
      // Make sure to include the entire end day.
      end: new Date(this.end.getFullYear(), this.end.getMonth(), this.end.getDate(), 23, 59, 59),
    });
  }

  /**
   * Clone the properties of this Granule into a new Granule.
   * Gets called on window creation.
   * @returns {Granule}
   */
  clone(): Granule {
    // Rather than regenerating the same intervals and overriding them,
    // An empty Granule object is created and the properties are then copied
    // to it.
    const newGranule = new Granule();
    newGranule._periodCount = this._periodCount;
    newGranule.start = this.start;
    newGranule.end = this.end;
    newGranule.periodType = this.periodType;
    newGranule.continuous = this.continuous;
    newGranule.selectableMonths = this.selectableMonths;
    newGranule.selectedMonthIndex = this.selectedMonthIndex;
    newGranule.selectedMonth = this.selectedMonth;
    newGranule.intervals = this.intervals;
    newGranule.activeInterval = this.activeInterval;
    newGranule.selectableYears = this.selectableYears;
    newGranule.selectedYearIndex = this.selectedYearIndex;
    newGranule.selectedIntervalIndex = this.selectedIntervalIndex;
    newGranule.selectedSelectableIntervalIndex = this.selectedSelectableIntervalIndex;
    newGranule.initializing = this.initializing;
    return newGranule;
  }

  makeChildLabel(children: any): Granule {
    // need to find the intervals that fall between the start and end dates on each child from this.intervals
    // then if we do find it, we need to add a label property to it corresponding to the layer name.
    children.forEach((child) => {
      // get the index of the first interval for a child
      let childIndex = this.intervals.findIndex((i) => i.start === child.start.granule_start);
      // get the index of the last interval for a child.
      const lastIntervalsInChild = this.intervals.findIndex((i) => i.end === child.end.granule_end);

      this.intervals[childIndex].layerName = child.layerName;
      this.intervals[childIndex].label = child.label;
      // this loop is for children which have multiple intervals. We want to make sure that we label each interval
      // that is associated with each child layer.
      while (childIndex <= lastIntervalsInChild) {
        this.intervals[childIndex].layerName = child.layerName;
        this.intervals[childIndex].label = child.label;
        childIndex += 1;
      }
    });
    const intervalIndex = this.intervals.findIndex((i) => i.label !== undefined) - 1;
    this.setSelectedIntervalIndex(intervalIndex);
    return this;
  }

  /**
   * Get the active interval.
   * If the active interval is not set, an interval created from the start and end dates will be returned.
   * @returns {Record<string, string>}
   */
  getActiveInterval(): Record<string, string> {
    if (!this.activeInterval) {
      return {
        start: this.start.toString(),
        end: this.end.toString(),
      };
    }
    return this.activeInterval;
  }

  /**
   * Switch the current active interval to the next available interval.
   * If the last interval is already selected, there is no change.
   * @returns {Granule}
   */
  next(): Granule {
    const currentIndex = this.intervals.indexOf(this.activeInterval);
    const intervalIndex = this.intervals.findIndex((i) => i.label !== undefined) - 1;
    const nextInterval = this.intervals[currentIndex + 1];
    if (nextInterval) {
      this.activeInterval = nextInterval;
      this.setSelectedIntervalIndex(currentIndex + 1);
      this.events.postEvent('selectionChange', this, undefined);
    }
    return this;
  }

  /**
   * Switch the currently active interval to the previously available interval.
   * If the first interval is already selected, there is no change.
   * @returns {Granule}
   */
  prev(): Granule {
    const currentIndex = this.intervals.indexOf(this.activeInterval);
    const intervalIndex = this.intervals.findIndex((i) => i.label !== undefined) - 1;

    // ensure that we are still on the intervals that are form the child layers.
    // else we can move to the final data and the set the flag to false.
    const prevInterval = this.intervals[currentIndex - 1];
    if (prevInterval) {
      this.activeInterval = prevInterval;
      this.setSelectedIntervalIndex(currentIndex - 1);
      this.events.postEvent('selectionChange', this, undefined);
    }
    return this;
  }

  /**
   * Get the index of the currently selected interval.
   * @returns {number}
   */
  getSelectedIntervalIndex(): number {
    return this.intervals.findIndex((interval) => interval.start === this.activeInterval.start && interval.end === this.activeInterval.end);
  }

  /**
   * Set the selected interval index
   * @param {number} index
   * @returns {Granule}
   */
  setSelectedIntervalIndex(index: number): Granule {
    this.selectedIntervalIndex = index;
    this.activeInterval = this.getIntervalByIndex(index);
    this.selectedYearIndex = this.selectableYears.findIndex((y) => y.text === this.getYearOfInterval(this.activeInterval));
    this.selectableMonths = this.getSelectableMonths();

    if (this.periodType === 'pentad_10daycomposite') {
      this.selectedMonthIndex = this.selectableMonths.findIndex((y) => y.value === parseInt(this.activeInterval.end.slice(5, 7)));
    } else {
      this.selectedMonthIndex = this.selectableMonths.findIndex((y) => y.value === parseInt(this.activeInterval.start.slice(5, 7)));
    }

    this.selectedMonth = this.selectableMonths[this.selectedMonthIndex];
    this.setSelectedSelectableIntervalIndex();
    this.updateActiveInterval();

    this.events.postEvent('optionsChange', undefined, undefined);
    return this;
  }

  /**
   * Returns the interval at the specified index.
   * @param {number} index
   * @returns {Record<string, string>}
   */
  getIntervalByIndex(index: number): Record<string, string> {
    return this.intervals[index];
  }

  /**
   * Returns all the intervals within a given year.
   * @param {number} year
   * @returns {Array<Record<string, string>>}
   */
  getIntervalsInYear(year: number): Array<Record<string, string>> {
    // Since the years are in ISO format, they are YYYY-MM-DD, so they start with the year.

    if (this.periodType === 'pentad_10daycomposite') {
      return this.intervals.filter((i) => i.end.startsWith(String(year)));
    }

    return this.intervals.filter((i) => i.start.startsWith(String(year)));
  }

  /**
   * Returns an array of the years that the granule spans.
   * @returns {Array<SelectableYear>}
   */
  getYearsOfIntervals(): Array<SelectableYear> {
    return eachYearOfInterval({
      start: this.start,
      end: parseISO(this.intervals[this.intervals.length - 1].start),
    }).map((d, index) => {
      return {
        text: d.getFullYear(),
        value: index + 1,
      };
    });
  }

  /**
   * Given a year, return an array of months that are in the granule list.
   * Not every year has Jan-Dec.
   * @param {number} year
   * @returns {Array<SelectableMonth>}
   */
  getMonthsInIntervalInYear(year: number): Array<SelectableMonth> {
    if (!this.selectableYears) this.selectableYears = [{ text: this.start.getFullYear(), value: 1 }];
    if (!year) year = this.selectableYears.find((y) => y.value === this.selectedYearIndex).value;
    const intervalsInYear = this.getIntervalsInYear(year);

    if (!intervalsInYear.length) return [];

    let intervalStart = parseISO(intervalsInYear[0].start);

    if (this.periodType === 'pentad_10daycomposite') {
      intervalStart = parseISO(intervalsInYear[0].end);
    }

    let intervalEnd = parseISO(intervalsInYear[intervalsInYear.length - 1].end);

    if (this.continuous) {
      const lastInterval = intervalsInYear[intervalsInYear.length - 1];
      const lastIntervalStartMonth = parseISO(lastInterval.start).getMonth();
      const lastIntervalEndMonth = parseISO(lastInterval.end).getMonth();
      if (lastIntervalEndMonth !== lastIntervalStartMonth) {
        if (intervalsInYear.length === 1) {
          intervalEnd = intervalStart;
        } else {
          intervalsInYear.pop();
          intervalEnd = parseISO(intervalsInYear[intervalsInYear.length - 1].end);
        }
      }
    }

    return eachMonthOfInterval({
      start: intervalStart,
      end: intervalEnd,
    }).map((m) => {
      return {
        text: numMonthToString(m.getMonth(), 'abbrev'),
        value: m.getMonth() + 1,
      };
    });
  }

  /**
   * Get the year of an interval.
   * @param {Record<string, string>} interval
   * @returns {number}
   */
  getYearOfInterval(interval: Record<string, string>): number {
    if (this.periodType === 'pentad_10daycomposite') {
      return getYear(parseISO(interval.end));
    }

    return getYear(parseISO(interval.start));
  }

  /**
   * Get the year of the active interval.
   * @returns {number}
   */
  getYearOfActiveInterval(): number {
    return this.getYearOfInterval(this.getActiveInterval());
  }

  /**
   * Change the index of the selected month.
   * @param {number} index
   * @param {boolean} suppressEvents
   */
  setSelectedMonthIndex(index: number, suppressEvents = false): void {
    this.selectedMonthIndex = index;

    if (index > this.selectableMonths.length - 1) {
      this.selectedMonthIndex = this.getSelectableMonths().length - 1;
    }

    this.selectedMonth = this.selectableMonths[this.selectedMonthIndex];
    this.updateActiveInterval();

    if (!suppressEvents) {
      this.events.postEvent('optionsChange', undefined, this);
    }
  }

  /**
   * Change the index of the selected year.
   * @param {number} index
   * @param {boolean} suppressEvents
   */
  setSelectedYearIndex(index: number, suppressEvents = false): void {
    this.selectedYearIndex = index;
    this.selectableMonths = this.getSelectableMonths();

    // Attempt to set the same selected month if the new selectableMonths array contains the same selectedMonth value.
    if (!this.selectableMonths.find((m) => m.value === this.selectedMonth.value)) {
      // If the previous month is not available, select the last month in the array
      this.selectedMonthIndex = this.selectableMonths.length - 1;
      this.selectedMonth = this.selectableMonths[this.selectedMonthIndex];
    } else {
      this.selectedMonthIndex = this.selectableMonths.findIndex((m) => m.value === this.selectedMonth.value);
      this.selectedMonth = this.selectableMonths[this.selectedMonthIndex];
    }

    this.updateActiveInterval();

    if (!suppressEvents) {
      this.events.postEvent('optionsChange', undefined, undefined);
      this.events.postEvent('selectionChange', this, undefined);
    }
  }

  /**
   * Calculate the selectable months based on the active interval.
   * @returns {Array<string>}
   */
  getSelectableMonths(): Array<SelectableMonth> {
    let months: Array<SelectableMonth>;
    // selectedYearIndex is undefined on init
    if (typeof this.selectedYearIndex === 'number') {
      months = this.getMonthsInIntervalInYear(this.selectableYears[this.selectedYearIndex].text);
    } else {
      months = this.getMonthsInIntervalInYear(this.getYearOfActiveInterval());
    }

    // If the period type is 'year', we only return the first month. so that 12 months aren't in the datepicker.
    if (this.periodType === 'year') {
      const beginning = months[0].text;
      const end = months[months.length - 1].text;
      const text = `${beginning}-${end}`;
      const month = months.slice(0, 1);
      month[0].text = text;
      return month;
    }

    // Build month names for 2-month
    if (this.periodType === '2month') {
      const m = [];
      let monthCount = months.length - 1;

      // Check for months that loop back around after December (Dec-Jan)
      if (months[months.length - 1].value < months[0].value) {
        // +1 to the findIndex because slice extracts up to but not including the end index.
        monthCount = months.slice(0, months.findIndex((month) => month.value === 12) + 1).length;
      }

      for (let i = 0; i < monthCount; i += 1) {
        m.push({
          text: `${months[i].text}-${months[i + 1].text}`,
          value: monthStrToNum(months[i].text),
        });
      }
      return m;
    }

    // Build month names for 3-month
    if (this.periodType === '3month') {
      const m = [];
      let monthCount = months.length;

      // Check for months that go loop back around after December (Nov-Dec-Jan, Dec-Jan-Feb)
      if (months[months.length - 1].value < months[0].value) {
        // +1 to the findIndex because slice extracts up to but not including the end index.
        monthCount = months.slice(0, months.findIndex((month) => month.value === 12) + 1).length;
      } else if (monthCount === 12) {
        // Prevent the creation of excess periods
        monthCount = 10;
      }

      let j = 0;
      for (let i = 0; i < monthCount; i += 1) {
        const m1 = months[i].text;
        const m2 = ((): string => {
          if (months[i + 1]?.text) return months[i + 1].text;
          if (monthCount === 12) {
            j = 0;
            const txt = months[j].text;
            j += 1;
            return txt;
          }
        })();
        const m3 = ((): string => {
          if (months[i + 2]?.text) return months[i + 2].text;
          if (monthCount === 12) {
            const txt = months[j].text;
            j += 1;
            return txt;
          }
        })();
        if (m2 && m3) {
          m.push({
            text: `${m1}-${m2}-${m3}`,
            value: monthStrToNum(m1),
          });
        }
      }
      return m;
    }
    return months;
  }

  /**
   * Get the periods that start with the year of the active interval and the selected month
   * @returns {Record<string, string>[]}
   */
  getIntervalsWithinSelectedMonthYear(): Array<Record<string, string>> {
    let intervals;

    if (this.periodType === 'pentad_10daycomposite') {
      intervals = this.intervals.filter((i) => {
        return i.end.startsWith(`${this.selectableYears[this.selectedYearIndex].text}-${singleDigitToDouble(this.selectedMonth.value)}`);
      });
    } else {
      intervals = this.intervals.filter((i) => {
        return i.start.startsWith(`${this.selectableYears[this.selectedYearIndex].text}-${singleDigitToDouble(this.selectedMonth.value)}`);
      });
    }

    if (!intervals.length) {
      if (this.initializing) {
        intervals = this.intervals.filter((i) => {
          return i.start === this.activeInterval.start && i.end === this.activeInterval.end;
        });
      } else if (!this.selectedYearIndex) {
        intervals = this.intervals.filter((i) => {
          return i.start === this.activeInterval.start && i.end === this.activeInterval.end;
        });
      } else {
        const tmpArr = this.getIntervalsInYear(this.selectableYears[this.selectedYearIndex].text);
        intervals = tmpArr.slice(tmpArr.length - this._periodCount);
      }
    }

    return intervals;
  }

  /**
   * Within the array of selectable intervals within the selected month/year,
   * this is the index of the selected interval (the active interval).
   * @returns {Granule}
   */
  setSelectedSelectableIntervalIndex(): Granule {
    const intervals = this.getIntervalsWithinSelectedMonthYear();
    const intervalIndex = intervals.findIndex((i) => i.start === this.activeInterval.start && i.end === this.activeInterval.end);

    if (intervalIndex === -1) {
      // Going from January
      if (this.selectedMonthIndex === 0) {
        if (intervals.length !== 1 && this.selectedSelectableIntervalIndex === intervals.length - 1) {
          // Going forward a month (January -> February)
          this.selectedMonthIndex += 1;
        } else if (this.selectedSelectableIntervalIndex === 0) {
          // Going from January -> December
          this.selectedYearIndex -= 1;
          this.selectableMonths = this.getSelectableMonths();
          this.selectedMonthIndex = this.selectableMonths.indexOf(this.selectableMonths[this.selectableMonths.length - 1]);
        }
      } else if (this.selectedMonthIndex === 11) {
        // Going from December -> January
        this.selectedYearIndex += 1;
        this.selectableMonths = this.getSelectableMonths();
        this.selectedMonthIndex = 0;
      } else {
        const idx = parseInt(this.activeInterval.start.slice(5, 7)) - 1;
        if (!this.selectableMonths.find((m) => m.value === idx)) {
          this.selectedMonthIndex = this.selectableMonths.length - 1;
        } else {
          this.selectedMonthIndex = this.selectableMonths.findIndex((m) => m.value === idx);
        }
      }

      this.selectedMonth = this.selectableMonths[this.selectedMonthIndex];
      return this.setSelectedSelectableIntervalIndex();
    }
    this.selectedSelectableIntervalIndex = intervalIndex;

    return this;
  }

  /**
   * Update the active interval based on the selectedMonthIndex and selectedYearIndex.
   * Typically called after updating one of those two properties.
   */
  updateActiveInterval(): void {
    const intervals = this.getIntervalsWithinSelectedMonthYear();

    // Attempt to keep the same selectedSelectableIntervalIndex, but default to the last in the array if unavailable.
    this.activeInterval = intervals[this.selectedSelectableIntervalIndex] ?? intervals[intervals.length - 1];
    this.selectedIntervalIndex = this.intervals.indexOf(this.activeInterval);
    this.setSelectedSelectableIntervalIndex();
  }
}
