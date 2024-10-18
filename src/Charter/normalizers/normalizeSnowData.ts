import { ChartVal } from './IChartVal';

export function normalizeSnowData(years: Record<string, Array<ChartVal>>): Record<string, Array<ChartVal>> {
  let normalizedY: number;
  Object.keys(years).map((year) => {
    years[year].forEach((period) => {
      normalizedY = period.value * 0.001;
      period.y = normalizedY;
      period.value = normalizedY;
    });
  });
  return years;
}
