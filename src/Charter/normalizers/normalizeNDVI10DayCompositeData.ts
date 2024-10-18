import { getYear, parseISO } from 'date-fns';
import { ChartVal } from './IChartVal';
import { isValidPeriodName } from '../../helpers/string';
import { normalizeG5Data } from './normalizeG5Data';

export function normalizeNDVI10DayCompositeData(years: Record<string, Array<ChartVal>>): Record<string, Array<ChartVal>> {
  // General NDVI data conversion
  years = normalizeG5Data(years);

  const yearsArray = Object.keys(years);

  Object.keys(years).map((year, yearIndex) => {
    const periods = years[year];

    // Do a check on the period name so we don't move around mean data.
    if (isValidPeriodName(year)) {
      // Check if last period granule_end is not the same year as `year`
      const lastPeriod = periods[periods.length - 1];
      const lastPeriodStartYear = getYear(parseISO(lastPeriod.granule_start));
      const lastPeriodEndYear = getYear(parseISO(lastPeriod.granule_end));

      // If the years do not match, move the period into the first entry of the NEXT periods array
      if (lastPeriodEndYear !== lastPeriodStartYear) {
        const nextYear = years[yearsArray[yearIndex + 1]];

        // move the period into the 0 index of next year
        nextYear.unshift(lastPeriod);

        // Remove the moved period from the current year
        periods.pop();

        // Update the array in the years object
        years[year] = periods;
      }
    }
  });
  return years;
}
