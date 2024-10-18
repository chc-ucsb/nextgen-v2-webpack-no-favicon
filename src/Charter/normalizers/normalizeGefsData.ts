import { objPropExists } from '../../helpers/object';
import { ChartVal } from './IChartVal';

interface ParsedGefs {
  final: Map<string, ChartVal>;
  prelim: Map<string, ChartVal>;
  gefs: Map<string, ChartVal>;
}

export function normalizeGefsData(years: Array<ChartVal>): ParsedGefs {
  const final = new Map();
  const prelim = new Map();
  const gefs = new Map();
  Object.keys(years).map((year) => {
    const tmpFinal = [];
    const tmpPrelim = [];
    const tmpGefs = [];
    years[year].map(function (period) {
      if (!objPropExists(period, 'groupLabel')) tmpFinal.push(period);
      else if (period.groupLabel === 'Prelim') tmpPrelim.push(period);
      else if (period.groupLabel === 'GEFS') tmpGefs.push(period);
      else console.error(`Error! Unknown groupLabel in GEFS response - ${period.groupLabel}`);
    });

    if (tmpFinal.length) final.set(year, tmpFinal);
    if (tmpPrelim.length) prelim.set(year, tmpPrelim);
    if (tmpGefs.length) gefs.set(year, tmpGefs);
  });

  return {
    final: Object.fromEntries(final),
    prelim: Object.fromEntries(prelim),
    gefs: Object.fromEntries(gefs),
  };
}
