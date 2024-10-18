import { parseISO, setDate, setYear, isEqual, getYear, isDate, isAfter } from 'date-fns';
import { Dictionary, PeriodConfig, PeriodType } from '../@types';
import { objPropExists } from '../helpers/object';
import { calculateStandardDeviation } from '../helpers/math';
import { logger } from '../utils';
import { getNumberOfPeriodsPerYear } from '../helpers/periodicity';
import { singleDigitToDouble, isValidPeriodName, isStaticSeasonName } from '../helpers/string';

export class DataHandler {
  originalData: Dictionary = {};
  data: any = null;
  periodMultiplier: number;
  currentYear: number;
  processData: Function;
  normalizer: Function;
  boundaryId: string;

  constructor(data: any, options, periodMultiplier = 1, normalizer?: Function) {
    this.periodMultiplier = periodMultiplier;

    this.convertScientificNotations();

    this.normalizer = normalizer;

    this.boundaryId = options.boundaryId;

    this.originalData = data;
    const topLvlProps = this.getTopLvlPropsDesc();
    for (const prop of Object.keys(topLvlProps)) {
      if (!isNaN(parseInt(topLvlProps[prop]))) {
        this.currentYear = topLvlProps[prop];
        break;
      }
    }

    this.setDataHandlerMethods();
  }

  addData(data: any): void {
    this.convertScientificNotations();

    Object.assign(this.originalData, data);
    const topLvlProps = this.getTopLvlPropsDesc();
    for (const prop of Object.keys(topLvlProps)) {
      if (!isNaN(parseInt(topLvlProps[prop]))) {
        this.currentYear = topLvlProps[prop];
        break;
      }
    }

    this.setDataHandlerMethods();
  }

  length(): number {
    return this.getSortedObjPropsAsc(this.data).length;
  }

  /**
   * The x values in the timeseries data has to be processed into a be
   * parsed by AmCharts. How it's parsed varies depending on the periodicity so
   * add the appropriate method to the data handler so we don't need to check
   * the periodicity everywhere it's called.
   */
  setDataHandlerMethods(): void {
    this.processData = (options): DataHandler => {
      const { startMonth } = options;
      const crossYear = startMonth > 1;
      const dataProvider = this.getDataVar();
      let year = new Date().getFullYear();

      for (const prop of Object.keys(dataProvider)) {
        if (Array.isArray(dataProvider[prop])) {
          for (let i = 0, len = dataProvider[prop].length; i < len; i += 1) {
            const data = dataProvider[prop][i];

            // Determine which granule to use (start_granule or end_granule) based on the project's time configuration.
            const granuleReference = `granule_${globalThis.App.Config.time.granuleReference}`;

            // Determines which date will display on the chart.
            const granule = data[granuleReference];

            // Parse the granule if the value is a string instead of a Date object.
            let date = isDate(granule) ? granule : parseISO(granule);

            if (options.period === 'year') {
              year = date.getFullYear();
            }

            // Account for leap years.
            // If `ignoreLeapYear` is true and the date is Feb 29, change it to Feb 28.
            if (date.getMonth() === 1 && date.getDate() === 29 && globalThis.App.Config.time.ignoreLeapYear) {
              date = setDate(date, 28);
              data[granuleReference] = date;
            }

            // If this is a cross-year and the month is >= the start month, we subtract 1 year from the date.
            // This is because AmCharts will display data sequentially based on the x-value's Date object.
            date = crossYear && date.getMonth() + 1 >= startMonth ? setYear(date, year - 1) : setYear(date, year);

            // Set the x-value to the parsed granule date.
            data.x = date;
          }
        } else {
          for (const timeProp of Object.keys(dataProvider[prop])) {
            const data = dataProvider[prop][timeProp];

            // Determine which granule to use (start_granule or end_granule) based on the project's time configuration.
            const granuleReference = `granule_${globalThis.App.Config.time.granuleReference}`;

            // eVIIRS NDVI uses the granule_end for displaying
            // if (options.chartContainer.getAttributes().overlayId.includes('eviirs')) {
            //   granuleReference = `granule_end`;
            // }

            // Determines which date will display on the chart.
            const granule = data[granuleReference];

            // Parse the granule if the value is a string instead of a Date object.
            let date = isDate(granule) ? granule : parseISO(granule);

            if (options.period === 'year') {
              year = date.getFullYear();
            }

            // Account for leap years.
            // If `ignoreLeapYear` is true and the date is Feb 29, change it to Feb 28.
            if (date.getMonth() === 1 && date.getDate() === 29 && globalThis.App.Config.time.ignoreLeapYear) {
              date = setDate(date, 28);
              data[granuleReference] = date;
            }

            // Set the x-value to the parsed granule date.
            data.x = date;
          }
        }
      }

      this.data = dataProvider;
      return this;
    };
  }

  postProcessData(data: Array<any>, period: PeriodType): Array<any> {
    if (period === 'week' || period === 'firedanger_week' || period === 'day') {
      // Insert first and last date of the year so the chart always shows the full year.
      data.unshift({ x: new Date(1970, 0, 1).getTime() });
      data.push({ x: new Date(1970, 12, 0).getTime() });
    }
    return data;
  }

  /**
   * Called at the end of a chain to return the manipulated data in object format
   * @returns {any}
   */
  getData() {
    const returnData = this.getDataCopy();
    this.data = null;
    return returnData;
  }

  /**
   * Retrieves a copy of the raw data manipulated to this point without destroying the manipulated data.
   * This allows you to continue the chain.
   */
  getDataCopy() {
    const data = this.getDataVar();
    return JSON.parse(JSON.stringify(data));
  }

  // Called at the beginning of each function so we don't alter the original data. If this.data is null, create a copy of this.originalData.
  getDataVar(): Dictionary {
    if (this.data === null) this.data = JSON.parse(JSON.stringify(this.originalData)); // This used to have an isEmpty check. The problem is that if you click to remove all values in the cYearContainer it then loads ALL years rather than the chart failing.
    return this.data;
  }

  /**
   * Called at the end of a chain to return the manipulated data in array format
   * @returns {any[]}
   */
  getArray() {
    const array = this.getArrayCopy();
    this.data = null;
    return array;
  }

  getYearArray() {
    const data = this.getDataVar();
    const array = [];
    const properties = this.getSortedObjPropsAsc(data);

    for (let i = 0, len = properties.length; i < len; i += 1) {
      for (const value of data[properties[i]]) {
        array.push(value);
      }
    }

    this.data = null;
    return array;
  }

  /**
   * Retrieves a copy of the data manipulated in array format to this point without destroying the manipulated data.
   * This allows you to continue the chain.
   */
  getArrayCopy() {
    const data = this.getDataVar();
    const array = [];
    const properties = this.getSortedObjPropsAsc(data);

    for (let i = 0, len = properties.length; i < len; i += 1) {
      array.push(data[properties[i]]);
    }

    return array;
  }

  removeStaticProperties(): DataHandler {
    const data = this.getDataVar();
    const newData = {};
    for (const season in data) {
      if (!/[a-zA-Z]/.test(season)) {
        newData[season] = data[season];
      }
    }

    this.data = newData;
    return this;
  }

  /**
   * Returns the last period in the dataset.
   * You can optionally pass in a string of a 'groupLabel' to filter by.
   * @param {string} fromGroup
   */
  getLatestPeriod(fromGroup?: string): PeriodConfig | null {
    let latestSeason: string | number = 0;
    const data = this.data === null ? this.originalData : this.data;
    for (const season in data) {
      if (!isNaN(parseInt(season)) && parseInt(season) > latestSeason && data[season].length > 0) {
        latestSeason = season;
      }
    }

    if (latestSeason !== 0) {
      let p;
      if (fromGroup) {
        p = data[latestSeason.toString()].filter((x) => objPropExists(x, 'groupLabel') && x.groupLabel === fromGroup);
      } else {
        p = data[latestSeason.toString()].filter((x) => !objPropExists(x, 'groupLabel'));
      }

      return p[p.length - 1];
    }
    return null;
  }

  getStatistics(): DataHandler {
    const data = this.getDataVar();
    const min = [];
    const max = [];
    const totals = [];
    const average = [];
    let compare;

    for (const prop of Object.keys(data)) {
      if (!compare) compare = data[prop];
      if (data[prop].length > compare.length) compare = data[prop];
    }
    const currentYear = getYear(new Date());
    for (const prop of compare) {
      const date = setYear(parseISO(prop.granule_end), currentYear);

      min.push({
        granule_end: date,
        granule_start: date,
        y: null,
        value: null,
      });
      max.push({
        granule_end: date,
        granule_start: date,
        y: 0,
        value: 0,
      });
      totals.push({
        granule_end: date,
        granule_start: date,
        y: 0,
        value: 0,
        count: 0,
      });
    }

    for (const prop of Object.keys(data)) {
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        // const x = setYear(parseISO(data[prop][i].granule_end), currentYear);
        const { y } = data[prop][i];
        for (let xIndex = 0, { length } = min; xIndex < length; xIndex += 1) {
          if (
            min[xIndex].granule_end.getFullYear() === currentYear && // check year
            min[xIndex].granule_end.getMonth() === parseInt(data[prop][i].granule_end.substring(5, 7)) - 1 && // check month
            min[xIndex].granule_end.getDate() === parseInt(data[prop][i].granule_end.slice(-2)) // check day
          ) {
            if (min[xIndex].y === null || y < min[xIndex].y) {
              min[xIndex].y = y;
              min[xIndex].value = y;
            }
            if (y > max[xIndex].y) {
              max[xIndex].y = y;
              max[xIndex].value = y;
            }
            totals[xIndex].y += y;
            totals[xIndex].value = totals[xIndex].y;
            totals[xIndex].count += 1;
            break;
          }
        }
      }
    }
    for (let i = 0, len = totals.length; i < len; i += 1) {
      average.push({
        granule_end: totals[i].granule_end,
        granule_start: totals[i].granule_start,
        y: totals[i].y / totals[i].count,
        value: totals[i].y / totals[i].count,
      });
    }
    this.data.min = min;
    this.data.max = max;
    this.data.average = average;
    return this;
  }

  convertCrossYears(startMonth: number, periodType: PeriodType): DataHandler {
    if (startMonth === 1) return this;
    const data = this.getDataVar();
    const newData = {};

    // eslint-disable-next-line guard-for-in
    for (const [year, dataArray] of Object.entries(data)) {
      let _dataArray = dataArray;
      if (!parseInt(year)) {
        const regex = new RegExp(singleDigitToDouble(startMonth), 'g');
        const sliceIndex = dataArray.findIndex((o) => regex.test(o.granule_start));
        _dataArray = dataArray.slice(sliceIndex).concat(dataArray.slice(0, sliceIndex));
      }

      for (const datum of _dataArray) {
        const date = periodType === '2month' || periodType === '3month' || periodType === '4month' || periodType ==='5month' || periodType === '6month' ? parseISO(datum.granule_start) : parseISO(datum.granule_end);
        let yearRange;
        if (!parseInt(year)) {
          yearRange = year;
        } else if (date.getMonth() + 1 >= startMonth) {
          // go in current year + 1
          yearRange = `${date.getFullYear()}-${date.getFullYear() + 1}`;
        } else {
          // last year - current year
          yearRange = `${date.getFullYear() - 1}-${date.getFullYear()}`;
        }
        if (!objPropExists(newData, yearRange)) {
          newData[yearRange] = [];
        }

        const obj = {
          x: date,
          y: datum.value,
        };

        for (const p in datum) {
          if (p !== 'x' && p !== 'y') {
            obj[p] = datum[p];
          }
        }

        newData[yearRange].push(obj);
      }
    }

    // Check if each cross-year starts with the same startMonth and remove the ones that don't.
    for (const [year, dataArray] of Object.entries(newData)) {
      // check if the first entry in the dataArray begins with the startMonth.
      // If it does not, then remove the cross year from the object.
      const month = dataArray[0].x.getMonth() + 1;
      if (month !== startMonth) delete newData[year];
    }

    this.data = newData;
    return this;
  }

  // getAverage(isEnd) {
  //   let data = this.getDataVar()
  //   let average = 0
  //   let count = 0

  //   for (let prop in data) {
  //     for (let i = 0, len = data[prop].length; i < len; i += 1) {
  //       average += data[prop][i].y
  //       count += 1
  //     }
  //   }

  //   // if (isEnd) delete this.data;
  //   return average / count
  // }

  getTotal(): number {
    const data = this.getDataVar();
    let total = 0;

    for (const prop of Object.keys(data)) {
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        total += data[prop][i].y;
      }
    }

    // if (isEnd) delete this.data;
    return total;
  }

  /**
   * Appends new top level properties to this data handler if the property does not already exist.
   */
  append(newData): void {
    const data = this.getDataVar();
    const properties = this.getSortedObjPropsAsc(newData);

    for (let i = 0, len = properties.length; i < len; i += 1) {
      if (data[properties[i]]) {
        logger.info(
          `property ${properties[i]} already exists in this data handler. If you wish to overwrite, use overwrite(${properties[i]}) instead.`
        );
      } else {
        data[properties[i]] = newData[properties[i]];
      }
    }
  }

  /**
   * Overwrites top level properties if it exists, otherwise, appends it.
   */
  overwrite(newData): void {
    const data = this.getDataVar();
    const properties = this.getSortedObjPropsAsc(newData);

    for (let i = 0, len = properties.length; i < len; i += 1) {
      data[properties[i]] = newData[properties[i]];
    }
  }

  mergeDatasets(datasets): DataHandler {
    const results = {};
    for (let i = 0, len = datasets.length; i < len; i += 1) {
      for (const prop of Object.keys(datasets[i])) {
        results[prop] = datasets[i][prop];
      }
    }

    this.data = results;
    return this;
  }

  /**
   * Merges another set of data into this data as another y value.
   */
  merge(datasets): DataHandler {
    const result = {};

    for (const data of Object.keys(datasets)) {
      for (const prop of Object.keys(datasets[data])) {
        result[data] = datasets[data][prop];
      }
    }

    this.data = result;
    return this;
  }

  /**
   * Merges AmCharts formatted data into a single set of data.
   */
  mergeChartData(data): Dictionary {
    const result = [];
    for (const prop of Object.keys(data)) {
      let index = 0;
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        if (!result[index]) result[index] = {};
        for (const y of Object.keys(data[prop][i])) {
          result[index][y] = data[prop][i][y];
        }
        index += 1;
      }
    }

    return result;
  }

  splitProperty(property: string, splitXValue: number, newPropName: string): DataHandler {
    const data = this.getDataVar();
    const result = {};

    for (const prop of Object.keys(data)) {
      // Loop through top level properties
      result[prop] = [];
      if (prop === property) {
        // Property is to be split
        result[newPropName] = [];
        for (let i = 0, len = data[prop].length; i < len; i += 1) {
          // Loop through property to split
          const obj = {};
          for (const value of Object.keys(data[prop][i])) {
            // Retrieve properties of object in array (x, y)
            obj[value] = data[prop][i][value];
          }

          if (i >= splitXValue) {
            // New property gets data
            result[newPropName].push(obj);
          } else {
            // Old property keeps data
            result[prop].push(obj);
          }
        }
      } else {
        // Property is to remain the same
        result[prop] = data[prop];
      }
    }

    this.data = result;
    return this;
  }

  /**
   * Changes the y property name to the specified name.
   * Useful for specifying specific value fields in an AmGraph
   */
  setYName(name: string): DataHandler {
    const data = this.getDataVar();
    const result = {};

    for (const prop of Object.keys(data)) {
      result[prop] = [];
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        result[prop][i] = {};
        result[prop][i].x = data[prop][i].x;
        result[prop][i][name] = data[prop][i].y;
      }
    }

    this.data = result;
    return this;
  }

  /**
   * Gets the current period of the current year when working with time series data.
   */
  getCurrentPeriod(): number {
    return this.originalData[this.currentYear].length - 1;
  }

  /**
   * Removes a top level property and all nested values.
   */
  removeProperty(propName: string): DataHandler {
    const data = this.getDataVar();
    const result = {};

    for (const prop of Object.keys(data)) {
      if (prop !== propName) result[prop] = data[prop];
    }

    this.data = result;
    return this;
  }

  /**
   * Discards all top level properties except the specified property.
   */
  getSingleProperty(propName: string): DataHandler {
    const data = this.getDataVar();
    const result = {};

    result[propName] = data[propName];

    this.data = result;
    return this;
  }

  /**
   * Take a series of objects with xy data (e.g. [x:1, y:5], [x:1, y:10]) and convert it into [x:1, y1:5, y2:10]
   */
  formatMultipleYAxis(): DataHandler {
    const data = this.getDataVar();
    const result = {};

    for (const prop of Object.keys(data)) {
      if (Array.isArray(data[prop])) {
        for (let i = 0, { length } = data[prop]; i < length; i += 1) {
          const index = data[prop][i].x;
          if (!result[index]) {
            result[index] = {
              x: index,
            };
          }

          result[index][prop] = data[prop][i].value;
        }
      } else {
        for (const timeProp of Object.keys(data[prop])) {
          const index = data[prop][timeProp].x;
          if (!result[index]) {
            result[index] = {
              x: index,
            };
          }

          result[index][prop] = data[prop][timeProp].value;
        }
      }
    }

    this.data = Object.values(result).sort((a: Record<string, any>, b: Record<string, any>) => a.x - b.x);
    return this;
  }

  /**
   * Formats the data by the top level properties
   */
  formatByTopLvlProperty(): DataHandler {
    const data = this.getDataVar();
    const properties = this.getSortedObjPropsAsc(data);
    const yearsTotals = [];
    let x = 0;

    for (let property = 0, len = properties.length; property < len; property += 1) {
      const prop = properties[property];
      const obj: Dictionary = {};
      x += 1;
      obj.x = x;

      for (let i = 0, { length } = data[prop]; i < length; i += 1) {
        if (!obj.y) obj.y = 0;
        obj.y += data[prop][i].y;
      }

      yearsTotals.push(obj);
    }

    this.data = { totals: yearsTotals };
    return this;
  }

  /**
   * Rounds all the chart data y values.
   *
   * @param int decimalPlaces (default: 2) The number of decimal places to round.
   */
  roundChartData(decimalPlaces = 2): DataHandler {
    const data = this.getDataVar();
    for (const prop of Object.keys(data)) {
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        for (const y of Object.keys(data[prop][i])) {
          if (y !== 'x') data[prop][i][y] = this.fixedDecimal(data[prop][i][y], decimalPlaces);
        }
      }
    }

    return this;
  }

  fixedDecimal(decimalNumber: number, decimalPlaces: number): number {
    const leftdecimalpart = decimalNumber.toString().split('.')[0];
    let rightdecimalpart = decimalNumber.toString().split('.')[1];
    let rightdecimalpartlength = 0;
    if (rightdecimalpart !== undefined) {
      rightdecimalpartlength = rightdecimalpart.length;
    }
    //  else {
    //   rightdecimalpartlength = 0
    // }

    if (rightdecimalpartlength > decimalPlaces) {
      const lengthdifference = rightdecimalpartlength - decimalPlaces;
      rightdecimalpart = rightdecimalpart.slice(0, -lengthdifference);
    }

    decimalNumber = parseFloat(`${leftdecimalpart}.${rightdecimalpart}`);

    return decimalNumber;
  }

  /**
   * Truncates the data up to a specific x value.
   *
   * @param period
   */
  truncateToPeriod(period: number): DataHandler {
    const data = this.getDataVar();
    const result = {};

    for (const prop of Object.keys(data)) {
      result[prop] = [];
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        if (data[prop][i].x <= period) {
          result[prop].push(data[prop][i]);
        }
      }
    }

    this.data = result;
    return this;
  }

  filterByPeriod(options): DataHandler {
    const data = this.getDataVar();
    const result = {};

    const pdPerYr = getNumberOfPeriodsPerYear(options.period);

    // dataArr is the first array in the ORIGINAL DATA dataset that has ALL the periods within a given year.
    // We use the originalData instead of the altered `data` because the periods in the cYearsCombo
    // don't change their value for cross-years.
    // In other words, Jan-1 will always have the value of 1 and therefore the index
    // used to grab the correct date suffix requires that the data arrays be unchanged.
    const [_, dataArr] = Object.entries(this.originalData).find(([period, dataArr]) => {
      return isValidPeriodName(period) && dataArr.length === pdPerYr;
    });

    // Using the dataArr in conjunction with options.years to build
    // an array of date suffixes that match the selected periods
    const dateStrings = options.years.map((y) => {
      return dataArr[y - 1]?.granule_end.slice(5);
    });

    if (options.period === 'month' || options.period === '2month' || options.period === '3month'  || options.period === '4month' || options.period === '5month' || options.period === '6month') {
      if (dateStrings.includes('02-28')) dateStrings.push('02-29'); // If dateStrings starts on a non leap year, which is typical, it will use 02-28. We add 02-29 to handle leap years.
    }

    // Strip the data object of any keys for static season names and non-valid period names.
    const filteredData = Object.entries(data)
      // Remove anything after spaces from the period name IE '2020-2021 GEFS' to '2020-2021'
      .map(([key, dataArr]) => {
        return [key.split(' ')[0], dataArr];
      })

      // Remove all values that are static season names.
      .filter(([period, _]) => !isStaticSeasonName(period))

      // Reduce the array of key/value pairs into a new data object.
      .reduce((acc, curr) => {
        const [period, dataArr] = curr;
        if (!acc[period]) acc[period] = dataArr;
        // If a period already exists (IE 2020-2021 GEFS and 2020-2021 Prelim are now both 2020-2021)
        // just concat the data to the existing array.
        else acc[period] = [...acc[period], ...dataArr];
        return acc;
      }, {});

    // Search within each item's data array for an item whose granule_end property
    // contains the converted options.years date suffixes
    for (const date of Object.keys(filteredData)) {
      result[date] = [];
      dateStrings.forEach((ds: string) => {
        const d = filteredData[date].find((f) => f.granule_end.endsWith(ds));
        if (d) result[date].push(d);
      });
    }

    // for (const prop of Object.keys(this.originalData)) {
    //   result[prop] = [];
    //   if ((isValidPeriodName(prop) && data[prop].length === pdPerYr) || prop === date.getFullYear().toString()) {
    //     options.years.forEach((element: number) => {
    //       const idx = element - 1;
    //       if (data[prop][idx]) result[prop].push(data[prop][idx]);
    //     });
    //   }
    // }

    this.data = result;
    return this;
  }

  /**
   * Adds a strait line to the data.
   *
   * @param object value An object with a single property. The name of the property and the value will be injected as y values.
   */
  addLine(value: any): DataHandler {
    const data = this.getDataVar();
    let lineName = '';
    let lineValue = 0;

    for (const prop of Object.keys(value)) {
      lineName = prop;
      lineValue = value[prop];
    }

    for (const prop of Object.keys(data)) {
      if (Array.isArray(data[prop])) {
        for (let i = 0, len = data[prop].length; i < len; i += 1) {
          data[prop][i][lineName] = lineValue;
        }
      } else if (typeof data[prop] === 'object') {
        data[prop][lineName] = lineValue;
      }
    }

    return this;
  }

  /**
   * Gets the total of all y values for each top level property.
   */
  formatAsTotals(): DataHandler {
    const data = this.getDataVar();
    const result = {};
    const properties = this.getSortedObjPropsAsc(data);

    for (let j = 0, len = properties.length; j < len; j += 1) {
      const prop = properties[j];
      let total = 0;
      for (let i = 0, { length } = data[prop]; i < length; i += 1) {
        total += data[prop][i].y;
      }
      result[prop] = [{ x: j, y: total }];
    }

    this.data = result;
    return this;
  }

  /**
   * Gets the total of the y values for a specific top level property and transforms it into a strait line.
   * Useful for displaying the average across a bar graph.
   *
   * @param string property
   */
  transformPropertyToLine(property: string): DataHandler {
    const data = this.getDataVar();
    const result = {};
    let mean = 0;

    if (isNaN(data[property])) {
      let count = 0;
      for (let i = 0, len = data[property].length; i < len; i += 1) {
        count += 1;
        mean += data[property][i].y;
      }
      mean /= count;
    } else {
      mean = data[property];
    }

    for (const prop of Object.keys(data)) {
      if (prop !== property) {
        result[prop] = [];

        for (let i = 0, len = data[prop].length; i < len; i += 1) {
          result[prop][i] = data[prop][i];
          result[prop][i][property] = mean;
        }
      }
    }

    this.data = result;
    return this;
  }

  /**
   * Retrieves the average of the totals for all top level properties and injects it as a new top level property.
   */
  getAverageYValues(): DataHandler {
    const data = this.getDataVar();
    const averages = [];
    let count = 0;
    let total = 0;
    let average = 0;

    for (const prop of Object.keys(data)) {
      count += 1;
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        for (const y of Object.keys(data[prop][i])) {
          if (y !== 'x') total += data[prop][i][y];
        }
      }
    }

    average = total / count;
    let x = 0;

    for (const k of Object.keys(data)) {
      x += 1;
      averages.push({ x, y: average });
    }

    this.data = { averages };
    return this;
  }

  getAverage(name: string): DataHandler {
    const data = this.getDataVar();
    const averages = [];
    const count = [];

    for (const prop of Object.keys(data)) {
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        if (!count[i]) count[i] = 0;
        count[i] += 1;
        if (!averages[i]) averages[i] = { x: data[prop][i].x, y: 0 };
        averages[i].y += parseInt(data[prop][i].y);
      }
    }

    for (let i = 0, len = averages.length; i < len; i += 1) {
      averages[i].y /= count[i];
    }

    this.data[name] = averages;
    return this;
  }

  /**
   * Gets the total of the values for the data and transforms it into a strait line.
   * Useful for displaying the average across a bar graph.
   *
   * @param string property
   */
  transformToLine(): DataHandler {
    const data = this.getDataVar();
    let mean = 0;
    let total = 0;
    let count = 0;

    for (const prop of Object.keys(data)) {
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        for (const y of Object.keys(data[prop][i])) {
          if (y !== 'x') {
            count += 1;
            total += data[prop][i][y];
          }
        }
      }
    }

    mean = total / count;

    for (const prop of Object.keys(data)) {
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        for (const y of Object.keys(data[prop][i])) {
          if (y !== 'x') data[prop][i][y] = mean;
        }
      }
    }

    return this;
  }

  /**
   * Truncates the data.
   *
   * @param properties A comma separated string or an array of the top level properties to keep.
   * @param startDate The date to truncate by. All items before our start date are removed.
   */
  truncateData(properties: string | Array<string>, startDate: Date = null): DataHandler {
    const data = this.getDataVar();
    const result = {};
    let propArray: Array<string> | string = [];

    if (properties[0]) {
      propArray = properties;
    } else if (typeof properties === 'string') {
      propArray = properties.split(',');
    } else {
      propArray = [];
    }

    for (let i = 0, len = propArray.length; i < len; i += 1) {
      const prop = propArray[i];
      if (data[prop]) result[prop] = data[prop];
    }

    if (startDate) {
      Object.keys(result).forEach((year) => {
        let index: number;
        for (let i = 0; i < result[year].length; i += 1) {
          // This for loop is to retrieve the index of the startDate within our array
          const datum = parseISO(result[year][i][`granule_${globalThis.App.Config.time.granuleReference}`]);
          if (datum.getMonth() === startDate.getMonth() && datum.getDate() === startDate.getDate()) index = i;
        }

        result[year] = result[year].slice(index); // Remove all data prior to startDate via index

        // If the index is undefined, that means that the year (most likely the latest) does not yet have data surpassing the startDate.
        // In this case, we should completely remove the data from being displayed.
        if (index === undefined) {
          delete result[year];
        }
      });
    }

    this.data = result;
    return this;
  }

  /**
   * Transforms the data into cumulative data.
   *
   * Each y value becomes the sum of itself plus all previous y values for each top level property.
   */
  cumulate(): DataHandler {
    const data = this.getDataVar();
    const results = {};

    for (const prop of Object.keys(data)) {
      results[prop] = [];
      let total = 0;

      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        total += data[prop][i].value;
        const obj = {
          value: total,
          y: total,
          x: data[prop][i].x,
        };

        for (const k of Object.keys(data[prop][i])) {
          if (k !== 'value' && k !== 'x' && k !== 'y') {
            obj[k] = data[prop][i][k];
          }
        }
        results[prop].push(obj);
      }
    }

    this.data = results;
    return this;
  }

  joinProperties(): DataHandler {
    const data = this.getDataVar();
    const result = { data: [] };
    let x = 1;

    for (const prop of Object.keys(data)) {
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        const obj = {
          y: data[prop][i].y,
          x,
          name: prop,
        };
        result.data.push(obj);
        x += 1;
      }
    }

    this.data = result;
    return this;
  }

  formatByXValues(options): DataHandler {
    const data = this.getDataVar();
    const result = {};
    let granule = null;
    let yearName = null;
    for (const prop of Object.keys(data)) {
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        if (!granule || granule.slice(-5) !== data[prop][i].granule_end.slice(-5)) granule = data[prop][i].granule_end.slice(-5);

        // Respect the app's ignoreLeapYear configuration
        if (granule === '02-29' && globalThis.App.Config.time.ignoreLeapYear) granule = '02-28';
        yearName = prop;

        if (!result[granule]) result[granule] = [];
        result[granule].push({
          y: data[prop][i].value,
          granule_end: data[prop][i].granule_end,
          name: yearName,
        });
      }
    }

    this.data = result;
    return this;
  }

  /**
   * Calculates +1 standard deviation and -1 standard deviation for each x value and sets them as top level properties.
   */
  getStandardDeviation(): DataHandler {
    const data = this.getDataVar();
    const yValues = {};
    const values = [];
    let totalY = 0;
    for (const prop of Object.keys(data)) {
      for (let i = 0, len = data[prop].length; i < len; i += 1) {
        if (!yValues[data[prop][i].x]) {
          yValues[data[prop][i].x] = {
            total: 0,
            count: 0,
            values: [],
          };
        }

        values.push(data[prop][i].y);
        totalY += data[prop][i].y;
        yValues[data[prop][i].x].values.push(data[prop][i].y);
        yValues[data[prop][i].x].total += data[prop][i].y;
        yValues[data[prop][i].x].count += 1;
      }
    }

    let totalVariance = 0;

    for (let o = 0, len = values.length; o < len; o += 1) {
      totalVariance += values[o] * values[o];
    }

    if (globalThis.App.Config.sources.charts.standarddeviation !== 'false') {
      for (const prop of Object.keys(yValues)) {
        data.plus1SD.push({
          y: this.fixedDecimal(Math.round(yValues[prop].total / yValues[prop].count + calculateStandardDeviation(values)), 2),
          // y: Math.round((yValues[prop].total / yValues[prop].count) + calculateStandardDeviation(values), 2),
          x: prop,
        });
        data.minus1SD.push({
          // y: Math.round((yValues[prop].total / yValues[prop].count) - calculateStandardDeviation(values), 2),
          y: this.fixedDecimal(Math.round(yValues[prop].total / yValues[prop].count - calculateStandardDeviation(values)), 2),
          x: prop,
        });

        data.plus1SD.push({
          y: this.fixedDecimal(yValues[prop].total / yValues[prop].count + calculateStandardDeviation(values), 2),
          x: prop,
        });
        data.minus1SD.push({
          y: this.fixedDecimal(yValues[prop].total / yValues[prop].count - calculateStandardDeviation(values), 2),
          x: prop,
        });
      }
    }

    return this;
  }

  /**
   * Gets an objects properies and sorts them in descending order.
   *
   * @param obj
   * @param sortFunction
   */
  getSortedObjPropsDesc(obj: Dictionary): Dictionary {
    const properties = [];
    const stringProperties = [];
    let isNumeric = true;

    // If the property looks like '2013-2014', then parseInt(prop) will return everything before the dash
    // so that isNaN() will return false. isNaN() will return true without parseInt so we can sort as a string.
    // However, if property looks like '2013', sorting as a string wont work but isNaN will return false. Then we can sort as a number.
    for (const prop in obj) {
      if (isNaN(parseInt(prop))) {
        // If property is a string, such as 'stm', parseInt(prop) returns NaN.
        stringProperties.push(prop);
      } else {
        if (isNaN(Number(prop))) isNumeric = false;
        // if (isNaN(prop)) isNumeric = false
        properties.push(prop);
      }
    }

    if (isNumeric) {
      properties.sort(function (a, b) {
        return b - a;
      });
    } else {
      properties.sort(function (a, b) {
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
      });
    }

    stringProperties.sort(function (a, b) {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    });

    return properties.concat(stringProperties);
  }

  convertScientificNotations(): void {
    if (this.data) {
      for (const year of Object.keys(this.data)) {
        const yearData = this.data[year];
        for (const d of Object.keys(yearData)) {
          yearData[d].value = parseFloat(this.convertNotation(yearData[d].value));
        }
      }
    }
  }

  convertNotation(sciNumber: number): string {
    const data = String(sciNumber).split(/[eE]/);
    if (data.length === 1) return data[0];

    let zeros = '';
    const sign = sciNumber < 0 ? '-' : '';
    const str = data[0].replace('.', '');
    let mag = Number(data[1]) + 1;

    if (mag < 0) {
      zeros = `${sign}0.`;
      mag += 1;
      while (mag) zeros += '0';
      return zeros + str.replace(/^-/, '');
    }

    mag -= str.length;
    mag -= 1;
    while (mag) zeros += '0';

    return str + zeros;
  }

  /**
   * Gets this data's top level properties in descending order.
   */
  getTopLvlPropsDesc(): Dictionary {
    return this.getSortedObjPropsDesc(this.originalData);
  }

  /**
   * Gets an objects properies and sorts them in ascending order.
   * @param {Dictionary} obj
   * @returns {Dictionary}
   */
  getSortedObjPropsAsc(obj: Dictionary): Dictionary {
    const properties = [];
    const stringProperties = [];
    let isNumeric = true;

    // If the property looks like '2013-2014', then parseInt(prop) will return everything before the dash
    // so that isNaN() will return false. isNaN() will return true without parseInt so we can sort as a string.
    // However, if property looks like '2013', sorting as a string wont work but isNaN will return false. Then we can sort as a number.
    for (const prop of Object.keys(obj)) {
      if (isNaN(parseInt(prop))) {
        stringProperties.push(prop);
      } else {
        if (isNaN((prop as unknown) as number)) isNumeric = false;
        properties.push(prop);
      }
    }

    if (isNumeric) {
      properties.sort(function (a, b) {
        return a - b;
      });
    } else {
      properties.sort();
    }

    stringProperties.sort();

    return properties.concat(stringProperties);
  }

  /**
   * Gets this data's top level properties in ascending order.
   */
  getTopLvlPropsAsc(): Dictionary {
    return this.getSortedObjPropsAsc(this.originalData);
  }
}
