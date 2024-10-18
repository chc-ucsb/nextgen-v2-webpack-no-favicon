import { objPropExists } from '../../helpers/object';
import { ChartVal } from './IChartVal';

interface ParsedSoilMoisture {
  final: Map<string, ChartVal>;
  prelim: Map<string, ChartVal>;
}

export function normalizeSoilMoistureData(years: Array<ChartVal>): ParsedSoilMoisture {
  const final = new Map();
  const prelim = new Map();
  Object.keys(years).map((year) => {
    const tmpFinal = [];
    const tmpPrelim = [];

    years[year].map(function (period) {
      if (!objPropExists(period, 'groupLabel')) tmpFinal.push(period);
      else if (period.groupLabel === 'Prelim') tmpPrelim.push(period);
      else console.error(`Error! Unknown groupLabel in Soil Moisture response - ${period.groupLabel}`);
    });

    if (tmpFinal.length) final.set(year, tmpFinal);
    if (tmpPrelim.length) prelim.set(year, tmpPrelim);
  });

  return {
    final: Object.fromEntries(final),
    prelim: Object.fromEntries(prelim),
  };
}
