import { objPropExists } from './object';
import { getOrdinalDayOfYear } from './date';

// export const getPeriodConfigs = (config: PeriodConfig): Array<PeriodConfig> => {
//   const periodConfigs: Array<PeriodConfig> = [];
//   const { timeVariables } = config;
//   const { type } = config;
//
//   for (let i = timeVariables.length - 1; i >= 0; i -= 1) {
//     const timeVariable = timeVariables[i];
//     let start = config.start[timeVariable.type];
//     let end = config.end[timeVariable.type];
//     if (typeof start === 'undefined' || start.toString().trim() === '') start = null;
//     if (typeof end === 'undefined' || end.toString().trim() === '') end = null;
//     const seasonStart = null;
//     const seasonEnd = null;
//
//     // TODO: Delete? Not used in any periods.json files in any project.
//     // if (configs.hasOwnProperty('seasonStart') && configs.seasonStart.hasOwnProperty(timeVariable)) {
//     //   seasonStart = configs.seasonStart[timeVariable]
//     //   seasonEnd = configs.seasonEnd[timeVariable]
//     // }
//
//     let periodConfig;
//     switch (timeVariable.type) {
//       case 'year': {
//         if (start < 50) {
//           start += 2000;
//         } else if (start < 100) {
//           start += 1900;
//         }
//
//         if (end < 50) {
//           end += 2000;
//         } else if (end < 100) {
//           end += 1900;
//         }
//
//         let displayFormatter = YearDisplayFormatter;
//         if (seasonStart !== null && seasonEnd !== null) {
//           if (parseInt(seasonStart) > parseInt(seasonEnd)) {
//             displayFormatter = CrossYearDisplayFormatter;
//           }
//         }
//
//         const offset = start - 1;
//         periodConfig = {
//           title: 'Year',
//           start: 1,
//           end: end - offset,
//           offset,
//           periodsPerParent: TopPeriodsPerParent,
//           dateFormatter: YearDateFormatter,
//           labelFormatter: YearLabelFormatter,
//           displayFormatter,
//           type,
//         };
//         break;
//       }
//       case 'month': {
//         periodConfig = {
//           title: 'Month',
//           digitCount: timeVariable.digitCount,
//           start,
//           end,
//           periodsPerParent: 12,
//           displayFormatter: MonthDisplayFormatter,
//           dateFormatter: MonthDateFormatter,
//           type,
//         };
//
//         if (seasonStart !== null) {
//           periodConfig.seasonStart = parseInt(seasonStart);
//         }
//
//         if (seasonEnd !== null) {
//           periodConfig.seasonEnd = parseInt(seasonEnd);
//         }
//         break;
//       }
//       case 'period': {
//         periodConfig = {
//           title: config.fullName,
//           start,
//           end,
//           dateFormatter: PeriodPerMonthDateFormatter,
//           type,
//         };
//
//         if (objPropExists(config, 'firstOccurrence')) {
//           periodConfig.firstDay = config.firstOccurrence;
//           if (Number.isNaN(config.firstOccurrence)) {
//             periodConfig.getFirstDay = FirstWeekday;
//           } else {
//             periodConfig.getFirstDay = FirstDayOfYear;
//           }
//         }
//
//         if (objPropExists(timeVariable, 'itemsPerMonth')) {
//           periodConfig.periodsPerParent = timeVariable.itemsPerMonth;
//         } else if (objPropExists(timeVariable, 'daysPerPeriod')) {
//           periodConfig.daysPerPeriod = timeVariable.daysPerPeriod;
//           periodConfig.periodsPerParent = DaysPerMonth;
//         }
//
//         if (objPropExists(timeVariable, 'digitCount')) {
//           periodConfig.digitCount = timeVariable.digitCount;
//         }
//
//         if (seasonStart !== null && seasonEnd !== null) {
//           periodConfig.seasonStart = parseInt(seasonStart);
//           periodConfig.seasonEnd = parseInt(seasonEnd);
//         }
//
//         if (type === '7day') {
//           periodConfig.displayFormatter = SevenDayDisplayFormatter;
//         }
//         break;
//       }
//       default:
//         // periodConfig = custom.periodicity.getPeriodConfig(configs)
//         periodConfig = globalThis.App.Config.sources.periods;
//         break;
//     }
//
//     if (!periodConfig.name) {
//       periodConfig.name = timeVariable.type;
//     }
//     if (!periodConfig.labelVariable) {
//       periodConfig.labelVariable = timeVariable.type;
//     }
//     periodConfigs.push(periodConfig);
//   }
//
//   return periodConfigs;
// };

export const getNumberOfDaysPerMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

export const dayOfWeekToNum = (dayOfWeek: string): number => {
  const dayMapping: { [key: string]: number } = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  if (!objPropExists(dayMapping, dayOfWeek.toLowerCase())) {
    throw new Error('Invalid value supplied for dayOfWeek.');
  }
  return dayMapping[dayOfWeek.toLowerCase()];
};

export const oneDay = {
  getMonthOfDay(endDay: number, year: number): number {
    return new Date(year, 0, endDay).getMonth() + 1;
  },
  getDayOfMonth(endDay: number, month: number, year: number): number {
    return new Date(year, 0, endDay).getDate();
  },
  getDayOfYearFromMonth(month: number, year: number): number {
    month += 1;
    let dayCount = 0;
    let monthCount = 1;
    while (monthCount < month) {
      const date = new Date(1971, monthCount, 0);
      const daysInMonth = date.getDate();
      dayCount += daysInMonth;
      monthCount += 1;
    }
    return dayCount;
  },
  getDaysInYear(): number {
    return 365;
  },
};

export const dekad = {
  getMonthOfDekad(dekad: number): number {
    let month = 1;

    if (dekad > 0) {
      month = Math.ceil(dekad / 3);
    }

    return month;
  },

  getDayOfDekad(periodValue: number, month: number, year: number): number {
    let day;
    if (periodValue % 3 === 0) {
      const d = new Date(year, month, 0);
      day = parseInt(d.getDate().toString());
      // day = parseInt(d.getDate())
    } else {
      const tempmonth = (month - 1) * 3;
      day = (periodValue - tempmonth) * 10;
    }

    return day;
  },

  getMonthlyPeriodOfDekad(value: number): number {
    while (value > 3) {
      value -= 3;
    }
    return value;
  },
};

export const pentad = {
  getMonthOfPentad(pentad: number): number {
    let month = 1;

    if (pentad > 0) {
      month = Math.ceil(pentad / 6);
    }
    return month;
  },

  getDayOfPentad(periodValue: number, month: number, year: number): number {
    let day;
    let tempmonth;

    if (periodValue % 6 === 0) {
      const d = new Date(year, month, 0);
      day = parseInt(d.getDate().toString());
      // day = parseInt(d.getDate())
    } else {
      tempmonth = (month - 1) * 6;
      day = (periodValue - tempmonth) * 5;
    }
    return day;
  },

  getMonthlyPeriodOfPentad(value: number): number {
    while (value > 6) {
      value -= 6;
    }
    return value;
  },
};

export const sevenDay = {
  getDayOfSevenDay(periodValue: number, yearValue: number): number {
    let day = 1;

    let days = 0;

    const startDate = this.getDateForFirstOccurrenceOfDay(this.getfirstOccurrenceDay(), 1, yearValue);

    const noOfDaysUpToDay = (periodValue - 1) * 7 + startDate;

    for (let m = 1; m <= 12; m += 1) {
      const noOfDays = getNumberOfDaysPerMonth(m, yearValue);
      days += noOfDays;
      if (noOfDaysUpToDay <= days) {
        day = noOfDaysUpToDay - (days - noOfDays);
        break;
      }
    }

    return day;
  },

  getMonthOfSevenDay(period: number, year: number, month = 1): number {
    let _month;

    const startDate = this.getDateForFirstOccurrenceOfDay(this.getFirstOccurrenceDay(), month, year);
    const sevenDayOfYear = startDate + 7 * (period - 1);

    let days = 0;
    for (let m = 1; m <= 12; m += 1) {
      days += getNumberOfDaysPerMonth(m, year);
      if (days > sevenDayOfYear) {
        _month = m;
        break;
      }
    }

    return _month;
  },

  getNumberOfSevenDaysPerYear(year: number): number {
    const startDate = this.getDateForFirstOccurrenceOfDay(this.getFirstOccurrenceDay(), 1, year);

    let numberOfSevenDaysPerYear = 0;
    for (let d = startDate - 1; d <= oneDay.getDaysInYear(); d += 7) {
      // for (let d = startDate - 1; d <= getNumberOfDaysPerYear(year); d += 7) {
      numberOfSevenDaysPerYear += 1;
    }

    return numberOfSevenDaysPerYear;
  },

  getSevenDayOfYearFromMonth(month: number, year: number): number {
    month -= 1; // Convert month to 0 based like javascript dates.
    if (month < 0) month = 0;

    const day = this.getDateForFirstOccurrenceOfDay(this.getFirstOccurrenceDay(), 1, year);
    let weekCount = 0;
    const date = new Date(year, 0, day);
    while (date.getMonth() < month) {
      date.setDate(date.getDate() + 7);
      weekCount += 1;
    }
    return weekCount + 1;
  },

  getFirstOccurrenceDay(): string {
    return globalThis.App.Config.sources.periods.week.firstOccurrence.day.toLowerCase();
  },

  getDateForFirstOccurrenceOfDay(dayOfWeek: string, month: number, year: number): number {
    const date = new Date(year, month, 1);
    const dayMapping: { [key: string]: number } = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    if (!objPropExists(dayMapping, dayOfWeek)) {
      console.error('invalid value for firstOccurrence.day');
    }
    const day = dayMapping[dayOfWeek];
    // dayOfWeek = dayMapping[dayOfWeek]
    while (date.getDay() !== day) {
      date.setDate(date.getDate() + 1);
    }
    return date.getDate();
  },
};

export const calculateItemsPerYear = (period: string): number => {
  let itemsPerYear = 0;

  if (period === 'week' || period === 'firedanger_week') {
    itemsPerYear = sevenDay.getNumberOfSevenDaysPerYear(globalThis.App.Layers.timeseries.selected.year);
    // } else if (period === '14-day') {
    //   itemsPerYear = fourteenDay.getNumberOfFourteenDaysPerYear()
  }

  return itemsPerYear;
};

export const getNumberOfPeriodsPerYear = (period: string): number => {
  switch (period) {
    case 'day':
      return oneDay.getDaysInYear();
    case 'week':
    case 'firedanger_week':
      return calculateItemsPerYear(period);
    case '14day':
      return calculateItemsPerYear(period);
    case 'dekad':
      return 36;
    case 'pentad':
      return 72;
    case 'month':
      return 12;
    case '2month':
      return 12;
    case '3month':
      return 12;
    default:
      return 12;
  }
};

/**
 * Get an array containing a range of numbers that spans the number of periods
 * per year for a given periodicity. The range starts at 1 (not zero-indexed).
 *
 * @param {string} period
 * @returns {Array<number>}
 */
export const getPeriodsPerYear = (period: string): Array<number> => {
  const numPeriods = getNumberOfPeriodsPerYear(period);
  return Array.from(Array(numPeriods).keys()).map((val) => val + 1);
};

export const getChartDayOfPeriod = (period: string, periodValue: number, monthValue: number, yearValue: number): string => {
  let day = 1;
  let output: string;

  if (period.toLowerCase() === 'day') {
    day = oneDay.getDayOfMonth(periodValue, monthValue, yearValue);
  } else if (period.toLowerCase() === 'pentad') {
    day = pentad.getDayOfPentad(periodValue, monthValue, yearValue);
  } else if (period.toLowerCase() === 'dekad') {
    day = dekad.getDayOfDekad(periodValue, monthValue, yearValue);
  } else if (period.toLowerCase() === 'week' || period.toLowerCase() === 'firedanger_week') {
    day = sevenDay.getDayOfSevenDay(periodValue, yearValue);
    // } else if (period.toLowerCase() === '14-day') {
    //   day = fourteenDay.getDayOfFourteenDay(periodValue, monthValue, yearValue)
  } else if (period.toLowerCase() === 'month') {
    day = 1;
  } else if (period.toLowerCase() === '2month') {
    day = 1;
  } else if (period.toLowerCase() === '3month') {
    day = 1;
  }
  output = day.toString();
  if (output.length === 1) {
    output = `0${day}`;
  }

  return output;
};

export const getChartMonthOfPeriod = (period: number, year: number, periodType: string): string => {
  let month;

  if (periodType.toLowerCase() === 'pentad') {
    month = pentad.getMonthOfPentad(period);
  } else if (periodType.toLowerCase() === 'dekad') {
    month = dekad.getMonthOfDekad(period);
  } else if (periodType.toLowerCase() === 'day') {
    month = oneDay.getMonthOfDay(period, year);
  } else if (periodType.toLowerCase() === 'week' || periodType.toLowerCase() === 'firedanger_week') {
    month = sevenDay.getMonthOfSevenDay(period, year);
    // } else if (periodType.toLowerCase() === '14-day') {
    //   month = fourteenDay.getMonthOfFourteenDay(period)
  } else if (periodType.toLowerCase() === 'month') {
    month = period;
  } else if (periodType.toLowerCase() === '2month') {
    month = period;
  } else if (periodType.toLowerCase() === '3month') {
    month = period;
  }
  month = month?.toString();
  if (month.length === 1) {
    month = `0${month}`;
  }

  return month;
};

export const getPeriodsPerMonth = (period: string): number => {
  switch (period.toLowerCase()) {
    case 'dekad':
      return 3;
    case 'pentad':
      return 6;
    default:
      return 1;
  }
};

export const getPeriodLabel = (period: string, value: number): string => {
  let month;
  let label = '';
  const periodConfigs = globalThis.App.Config.sources.periods[period];

  switch (period.toLowerCase()) {
    case 'dekad':
      month = dekad.getMonthOfDekad(value);
      label = `${periodConfigs.months[month - 1]}-${dekad.getMonthlyPeriodOfDekad(value)}`;
      break;
    case 'pentad':
      month = pentad.getMonthOfPentad(value);
      label = `${periodConfigs.months[month - 1]}-${pentad.getMonthlyPeriodOfPentad(value)}`;
      break;
    case 'month':
      label = periodConfigs.months[value - 1];
      break;
    case '2month':
      label = periodConfigs.months[value - 1];
      break;
    case '3month':
      label = periodConfigs.months[value - 1];
      break;
    case 'day':
      label = value.toString();
      break;
    case 'week':
    case 'firedanger_week':
      label = value.toString();
      break;
    case '14day':
      label = value.toString();
      break;
    default:
      label = value.toString();
      break;
  }

  return label;
};

export const getPeriodOfYearFromMonth = (period: string, month: number, year = 1971): number => {
  if (period === 'day') {
    const date = new Date(year, month - 1);
    return getOrdinalDayOfYear(date, globalThis.App.Config.time.ignoreLeapYear, period);
    // return oneDay.getDayOfYearFromMonth(month, year);
  }
  if (period === 'week' || period === 'firedanger_week') {
    return sevenDay.getSevenDayOfYearFromMonth(month, year);
  }
  if (period === 'dekad') {
    return (month - 1) * 3;
  }
  if (period === 'pentad') {
    return (month - 1) * 6;
  }
  return month - 1;
};

// export const fourteenDay = {
//   getNumberOfFourteenDaysPerMonth(year: number, month: number): number {
//     const numberOfDays = new Date(year, month, 0).getDate()
//     return numberOfDays
//   },
//
//   getDayOfFourteenDay(period: number, year: number, month: number = 1): number {},
//   getMonthOfFourteenDay(period: number, year: number, month: number = 1): number {
//     const startDate = this.getDateForFirstOccurrenceOfDay(this.getfirstOccurrenceDay(), month, year)
//     const sevenDayOfYear = startDate + 7 * (period - 1)
//
//     let days = 0
//     for (let m = 1; m <= 12; m++) {
//       days += getNumberOfDaysPerMonth(m, year)
//       if (days > sevenDayOfYear) {
//         month = m
//         break
//       }
//     }
//
//     return month
//   }
// }
