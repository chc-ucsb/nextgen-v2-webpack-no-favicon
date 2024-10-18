/**
 * Get the amount of periods a given period type has in a month.
 * @param {string} periodType
 * @returns {number}
 */
import { differenceInDays, getDaysInMonth, getMonth, getWeeksInMonth, isLastDayOfMonth, parseISO } from 'date-fns';
import { LayerConfig } from '../@types';
import { Granule } from '../Granules';
import { first, last } from './array';
import { getOrdinalDayOfYear } from './date';

export const getDayOfYear = (date: Date): number => {
  return getOrdinalDayOfYear(date);
  // const now = new Date(date);
  // const start = new Date(now.getFullYear(), 0, 0);
  // const diff = now.getTime() - start.getTime() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  // const oneDay = 1000 * 60 * 60 * 24;
  // return Math.floor(diff / oneDay);
};

/**
 * Get the number of periods in per month for a given granule's periodType.
 * If `periodType` is 'day', the number of periods per month is calculated based
 * on the selectedMonthIndex. If the selectedMonthIndex is February (1), 28 is returned ONLY IF
 * `ignoreLeapYear` is `true`.
 * @param {Granule} granule
 * @returns {number}
 */
export const getPeriodsPerMonth = (granule: Granule): number => {
  const { periodType } = granule;
  switch (periodType.toLowerCase()) {
    case 'dekad':
      return 3;
    case 'pentad_10daycomposite':
    case 'pentad':
      return 6;
    case 'day': {
      const month = granule.selectableMonths[granule.selectedMonthIndex].value - 1;
      // If the month is February and ignoreLeapYear is true, always return 28 days in the month.
      if (month === 1 && granule.options.ignoreLeapYear) return 28;

      // Otherwise, return the number of days in the selected month and year.
      const tmpDate = new Date();
      tmpDate.setFullYear(granule.selectableYears[granule.selectedYearIndex].text, month);
      return getDaysInMonth(tmpDate);
    }
    case 'week':
    case 'firedanger_week': {
      // If activeInterval is not set, use the `start` and `end` properties of the Granule.
      if (!granule.activeInterval) {
        return getWeeksInMonth(granule[granule.options.granuleReference], {
          weekStartsOn: granule.options.weekStartsOn,
        });
      }

      const intervalsInMonthYear = granule.getIntervalsWithinSelectedMonthYear();

      // Check if the last interval goes across months.
      // If the months aren't matching, then we know that there's more than 1 interval in the selected month/year.
      // So we return how many intervals are in the selected month/year.
      const { start: lastIntervalStart, end: lastIntervalEnd } = last(intervalsInMonthYear);
      const { start: firstIntervalStart } = first(intervalsInMonthYear);
      // const startMonth = getMonth(parseISO(lastIntervalStart));
      // const endMonth = getMonth(parseISO(lastIntervalEnd));

      const daysInMonth = getDaysInMonth(parseISO(lastIntervalStart));
      const dayDiff = differenceInDays(parseISO(lastIntervalEnd), parseISO(firstIntervalStart));
      if (daysInMonth > dayDiff) return Math.round(daysInMonth / 7);
      if (dayDiff > daysInMonth) return Math.round(dayDiff / 7);
      break;
      // if (startMonth !== endMonth) {
      //   if (endMonth < startMonth) {
      //     return (
      //       getWeeksInMonth(parseISO(lastIntervalStart), {
      //         weekStartsOn: granule.options.weekStartsOn,
      //       }) - 1
      //     );
      //   }
      //   return intervalsInMonthYear.length;
      // }
      //
      // // If the months are matching, the intervals most likely do not fill the whole month,
      // // so we use getWeeksInMonth
      // return (
      //   getWeeksInMonth(new Date(granule.activeInterval[granule.options.granuleReference]), {
      //     weekStartsOn: granule.options.weekStartsOn,
      //   }) - 2
      // );
    }
    default:
      return 1;
  }
};

/**
 * Make a clone of the granules set for a layer config
 * @param {LayerConfig} layers
 * @param {Map<any, any>} granules
 * @returns {Map<string, Granule>}
 */
export const cloneLayerConfigGranules = (layers: LayerConfig, granules = new Map()): Map<string, Granule> => {
  if (layers) {
    layers.map((layer) => {
      if (layer.type === 'folder') {
        return cloneLayerConfigGranules(layer.folder, granules);
      }
      if (layer.type === 'layer') {
        if (layer.timeseries !== undefined) {
          const granule = globalThis.App.Layers._granules.get(layer.id);
          if (granule) granules.set(layer.id, granule.clone());
        }
      }
    });
  }
  return granules;
};

/**
 * Get the duration of a given period type.
 * @param {string} periodType
 * @returns {number}
 */
export const getDurationForPeriodType = (periodType: string): number => {
  switch (periodType.toLowerCase()) {
    case 'pentad':
      return 5;
    case 'dekad':
    case 'pentad_10daycomposite':
      return 10;
    case 'firedanger_week':
    case 'week':
      return 7;
    case 'year':
      return 1;
    default:
      return null;
  }
};
