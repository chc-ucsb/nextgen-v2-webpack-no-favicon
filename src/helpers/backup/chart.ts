import ValueAxis from 'amcharts/ValueAxis';
import AmCoordinateChart from 'amcharts/AmCoordinateChart';
import { addMonths, isDate, parseISO } from 'date-fns';
import { getNumberOfPeriodsPerYear, getPeriodOfYearFromMonth } from './periodicity';
import { Dictionary } from '../@types';
import { truncateString } from './string';
import { clamp } from './math';
import { numMonthToString } from './date';
import { isEmpty } from './validation';

export const sortSeasons = (a: any, b: any): number => {
  if (!Number.isNaN(parseInt(a)) && Number.isNaN(parseInt(b))) return 1;
  if (Number.isNaN(parseInt(a)) && !Number.isNaN(parseInt(b))) return -1;
  if (Number.isNaN(a) && Number.isNaN(b)) return parseInt(b) - parseInt(a);
  if (!Number.isNaN(parseInt(a)) && !Number.isNaN(parseInt(b))) return b - a;
  return 0;
};

/**
 * Sort Seasons. Used in conjunction with Array#sort
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export const sortPrelimSeasons = (a: any, b: any): number => {
  if (b.toString().toLowerCase().indexOf('prelim') !== -1 && parseInt(a.toString().slice(0, 4)) < parseInt(b.toString().slice(0, 4))) {
    return 1;
  }
  return sortSeasons(a, b);
  // if (!Number.isNaN(parseInt(a)) && Number.isNaN(parseInt(b))) return 1
  // if (Number.isNaN(parseInt(a)) && !Number.isNaN(parseInt(b))) return -1
  // if (Number.isNaN(a) && Number.isNaN(b)) return parseInt(b) - parseInt(a)
  // if (!Number.isNaN(parseInt(a)) && !Number.isNaN(parseInt(b))) return b - a
  // return 0
};

export const sortInterannualSeasons = (a: any, b: any): number => {
  if (!Number.isNaN(a) && Number.isNaN(b)) return 1;
  if (Number.isNaN(a) && !Number.isNaN(b)) return -1;
  if (!Number.isNaN(a) && !Number.isNaN(b)) return b - a;
  return 0;
};

/**
 * For the new means, parse the mean name to get a more readable name for display.
 */
export const getSeasonDisplayName = (season: string): string => {
  if (!season.includes('mean') && !season.includes('median')) {
    return season;
  }
  const _season = season.toString();
  const split = _season.split('_');
  let prefix = split[split.length - 1];
  prefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  const yearSplit = split[0].split('-');
  const displayName = `${prefix} (${yearSplit[yearSplit.length - 2]}-${yearSplit[yearSplit.length - 1]})`;
  return displayName;
};

export const getLegendData = (seasons, colors, markerType): Dictionary => {
  const legendData = [];
  seasons.sort(sortSeasons);
  for (let i = 0, len = seasons.length; i < len; i += 1) {
    const season = seasons[i].toString();
    const color = colors[season];
    legendData.push({
      title: getSeasonDisplayName(season),
      color,
      markerSize: 30,
      markerType,
    });
  }
  return legendData;
};

export const getGefsLegendData = (seasons, colors, markerType): Dictionary => {
  const legendData = [];
  seasons.sort(sortSeasons);
  for (let i = 0, len = seasons.length; i < len; i += 1) {
    const season = seasons[i].toString();
    let color = colors[season];

    if (season.indexOf('Prelim') !== -1) {
      color = '#7F7F7F';
    } else if (season.indexOf('GEFS') !== -1) {
      color = '#f7b32b';
    }

    const obj = {
      title: getSeasonDisplayName(season),
      color,
      markerSize: 30,
      markerType,
    };

    legendData.push(obj);
  }
  return legendData;
};

export const getAnnualLegendData = (seasons, colors, markerType): Dictionary => {
  const legendData = [];
  seasons.sort(sortInterannualSeasons);
  for (let i = 0, len = seasons.length; i < len; i += 1) {
    const season = seasons[i].toString();
    const color = colors[season];
    legendData.push({
      title: getSeasonDisplayName(season),
      color,
      markerSize: 30,
      markerType,
    });
  }
  return legendData;
};

/**
 * Determine if every data value is null.
 *
 * Occurs when (mainly FEWS Net Mapping Units) polygons are too small for G5 to process so G5 instead returns NULL data for every value.
 * @param {Record<string, Array<{granule_start: string, granule_end: string, value: number}>>} data
 * @returns {boolean}
 */
export const allDataValuesAreNull = (data: Record<string, Array<{ granule_start: string; granule_end: string; value: number }>>): boolean => {
  return isEmpty(
    Object.values(data)
      .flat()
      .filter((datum) => datum.value !== null)
  );
};

/**
 * If no data is returned from the timeseries request, show a message to the user.
 */
export const setNoData = (chart): void => {
  chart.allLabels = [
    {
      text: 'No Data at Selected Coordinates',
      size: 30,
      align: 'center',
      x: 10,
      bold: true,
      color: '#CCC',
      y: 50,
    },
  ];
  chart.validateData();
};

/**
 * Get the AmCharts date format for the smallest period to be interpreted by parseDates.
 */
export const getMinPeriod = (period: string): 'MM' | 'DD' | 'yyyy' => {
  switch (period) {
    case 'month':
      return 'MM';
    case '2month':
      return 'MM';
    case '3month':
      return 'MM';
    case 'year':
      return 'yyyy';
    default:
      return 'DD';
  }
};

export const processAnnualData = (dataProvider) => {
  const dataCopy = { ...dataProvider };

  Object.keys(dataCopy).map((prop) => {
    for (let i = 0, len = dataCopy[prop].length; i < len; i += 1) {
      const data = dataCopy[prop][i];
      data.x = data.name;
      data.value = data.y;
    }
  });

  return dataCopy;
};

/**
 * Interannual charts are a special case when dealing with cross years.
 * Converting cross years also changes the x value for each period
 * but interannual charts need the original x value.
 */
export const handleCrossYears = (dataProvider, period: string, startMonth: number): Dictionary => {
  if (startMonth === 1) return;
  const result: Dictionary = {};

  Object.keys(dataProvider).map((prop) => {
    const periodsPerYear = getNumberOfPeriodsPerYear(period);
    const splitPeriod = periodsPerYear - getPeriodOfYearFromMonth(period, startMonth, parseInt(prop));
    result[prop] = [];
    for (let i = 0, len = dataProvider[prop].length; i < len; i += 1) {
      const data = dataProvider[prop][i];
      // const x = parseInt(data.x);
      const x = getPeriodOfYearFromMonth(period, data.x.getMonth(), parseInt(prop));

      if (x <= splitPeriod) {
        data.x = x + (periodsPerYear - splitPeriod);
      } else {
        data.x = x - (periodsPerYear - (periodsPerYear - splitPeriod));
      }

      result[prop].push(data);
    }
  });

  return result;
};

export const getMonth = (months: Array<number>, startMonth: number): Array<number> => {
  if (startMonth > 1) {
    // Subtract 1 because startMonth references months starting with 1 (Jan = 1, Feb = 2, etc),
    // but the month array is 0-indexed
    const firstHalf = months.slice(0, startMonth - 1);
    const secondHalf = months.slice(startMonth - 1);
    return secondHalf.concat(firstHalf);
  }

  return months;
};

export const formatYearCategory = (valueText: string, date: Date, categoryAxis: any, period: string): string => {
  return String(date.getFullYear());
};

export const formatMonthCategory = (valueText: string, date: Date, categoryAxis: any, period: string): string => {
  let day = '';
  if (period !== 'MM') {
    day = ` ${`00${date.getDate()}`.slice(-2)}`; // for zero padding
  }

  if (categoryAxis.period === '2month') {
    const m1 = date;
    const m2 = addMonths(date, 1);
    return `${numMonthToString(m1.getMonth(), 'first')}${numMonthToString(m2.getMonth(), 'first')}`;
  }
  if (categoryAxis.period === '3month') {
    const m1 = date;
    const m2 = addMonths(date, 1);
    const m3 = addMonths(date, 2);
    return `${numMonthToString(m1.getMonth(), 'first')}${numMonthToString(m2.getMonth(), 'first')}${numMonthToString(m3.getMonth(), 'first')}`;
  }
  return numMonthToString(date.getMonth(), 'abbrev') + day;
};

/**
 * This is used whenever you want a chart to have a static y axis.
 * https://docs.amcharts.com/3/javascriptcharts/ValueAxis#minimum
 */
export const setYAxesMinMax = (chart: AmCoordinateChart, options: any): void => {
  if (typeof options.yAxisRange !== 'undefined' && options.yAxisRange !== 'auto') {
    const { valueAxes } = chart;

    valueAxes.forEach((valueAxis: ValueAxis) => {
      if (typeof options.yAxisRange.min !== 'undefined') {
        valueAxis.minimum = options.yAxisRange.min;
      }
      if (typeof options.yAxisRange.max !== 'undefined') {
        valueAxis.maximum = options.yAxisRange.max;
      }

      // https://www.amcharts.com/kbase/user-defined-minmax-values-of-value-axis/
      valueAxis.autoGridCount = false;
      valueAxis.gridCount = 50;
    });
  }
};

/**
 * With AmCharts' parseDates, for displaying the correct date for cross years,
 * we need to convert the date back to the correct date.
 */

export const convertCrossYearDate = (date: Date, startMonth: number): Date => {
  const START_MONTH = clamp(startMonth, 1, 12);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Adjust months based on the startMonth
  const CONVERTED_MONTHS = months.slice(START_MONTH - 1).concat(months.slice(0, START_MONTH - 1));

  const convertedMonthName = CONVERTED_MONTHS[date.getMonth()];
  let convertedMonthIndex = months.findIndex((m) => m === convertedMonthName);

  if (date.getMonth() === 1 && date.getDate() >= 29) {
    const offset = date.getDate() - 28;
    date.setMonth(date.getMonth() + 1);
    date.setDate(offset);
    convertedMonthIndex = months.findIndex((m) => m === CONVERTED_MONTHS[date.getMonth()]);
  }

  return new Date(date.getFullYear(), convertedMonthIndex, date.getDate());
};

/**
 * Return the balloonFunction for the chart based on the period type.
 * @param startMonth
 * @param period
 */
export const getCategoryBalloonFunction = (startMonth: number, period: string): ((date: Date) => string) => {
  switch (period) {
    case 'month':
      return (date: Date): string => {
        const m1 = date;
        const output = `${numMonthToString(m1.getMonth(), 'abbrev')}`;
        return `${output}`;
      };

    case '2month':
      return (date: Date): string => {
        const m1 = date;
        const m2 = addMonths(date, 1);
        const output = `${numMonthToString(m1.getMonth(), 'abbrev')}-${numMonthToString(m2.getMonth(), 'abbrev')}`;
        return `${output}`;
      };

    case '3month':
      return (date: Date): string => {
        const m1 = date;
        const m2 = addMonths(date, 1);
        const m3 = addMonths(date, 2);
        const output = `${numMonthToString(m1.getMonth(), 'abbrev')}-${numMonthToString(m2.getMonth(), 'abbrev')}-${numMonthToString(
          m3.getMonth(),
          'abbrev'
        )}`;
        return `${output}`;
      };

    case 'year':
      return (date: Date): string => {
        return `${date.getFullYear()}`;
      };

    default:
      return (date: Date): string => {
        return `${numMonthToString(date.getMonth(), 'abbrev')} ${date.getDate()}`;
      };
  }
};

/**
 * Truncate a given string longer than 15 chars and add an elipsis at the end.
 * @param tabTitle The string to truncate.
 */
export const getShortTitle = (tabTitle: string): string => {
  return truncateString(tabTitle);
};

/**
 * Creates the label that is displayed on the chart when the mouseover event is fired.
 * @param graphDataItem
 * @param {string} period
 * @param {number} startMonth
 * @returns {string}
 */
export const getChartCursorLabel = (graphDataItem: any, period: string, startMonth: number): string => {
  let multiplier = '1';
  for (let i = 0, len = globalThis.App.Charter.configZ.decimalDigits; i < len; i += 1) {
    multiplier += '0';
  }

  const season = getSeasonDisplayName(graphDataItem.graph.valueField);
  const makeSuffix = (overrideSeason?: string): string => {
    return `${overrideSeason ?? season} : ${Math.round(graphDataItem.values.value * parseInt(multiplier)) / parseInt(multiplier)}`;
  };

  if (graphDataItem.graph.legendTextReal) {
    let category;
    if (isDate(graphDataItem.category) && period === 'year') {
      const date = `${graphDataItem.category.getFullYear()}`;
      return `${date}, ${makeSuffix()}`;
    }
    if (isDate(graphDataItem.category)) {
      const date = `${numMonthToString(graphDataItem.category.getMonth(), 'abbrev')} ${graphDataItem.category.getDate()}`;
      return `${date}, ${makeSuffix()}`; // This runs for Min/Max charts
    }

    // This runs for interannual charts
    return `${graphDataItem.category} ${makeSuffix(graphDataItem.graph.legendTextReal)}`;
  }

  // Used in interannual charts
  if (!isDate(graphDataItem.category)) {
    return `${graphDataItem.category}, ${makeSuffix()}`;
  }

  if (period === 'month') {
    const date = `${numMonthToString(graphDataItem.category.getMonth(), 'abbrev')}`;
    return `${date}, ${makeSuffix()}`;
  }
  if (period === '2month') {
    const m1 = graphDataItem.category;
    const m2 = addMonths(graphDataItem.category, 1);
    const date = `${numMonthToString(m1.getMonth(), 'abbrev')}-${numMonthToString(m2.getMonth(), 'abbrev')}`;
    return `${date}, ${makeSuffix()}`;
  }
  if (period === '3month') {
    const m1 = graphDataItem.category;
    const m2 = addMonths(graphDataItem.category, 1);
    const m3 = addMonths(graphDataItem.category, 2);
    const date = `${numMonthToString(m1.getMonth(), 'abbrev')}-${numMonthToString(m2.getMonth(), 'abbrev')}-${numMonthToString(
      m3.getMonth(),
      'abbrev'
    )}`;
    return `${date}, ${makeSuffix()}`;
  }
  if (isDate(graphDataItem.category)) {
    const date = `${numMonthToString(graphDataItem.category.getMonth(), 'abbrev')} ${graphDataItem.category.getDate()}`;
    return `${date}, ${makeSuffix()}`;
  }
};

/**
 * Include the current year in a given array of numbers if it's not already there.
 * @param {Array<number>} seasons Array of years in number format.
 * @returns {Array<number>}
 */
export const addCurrentYearToYearsList = (seasons: Array<number | string>): Array<number | string> => {
  const currentYear = new Date().getFullYear();

  // Set the value to check to the current year (number)
  let toCheck: number | string = currentYear;

  // If the first entry of the array is a string, the whole seasons array is strings.
  // Set the value to check to the stringified version of the current year.
  if (typeof seasons[0] === 'string') {
    toCheck = String(currentYear);
  }

  // Check if the seasons array contains the `toCheck` value,
  // add it if it doesn't exist.
  if (!seasons.includes(toCheck)) {
    seasons.push(toCheck);
  }

  return seasons;
};
