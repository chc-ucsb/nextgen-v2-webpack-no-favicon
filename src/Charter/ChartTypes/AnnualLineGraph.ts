import { parseISO } from 'date-fns';
import { ChartTypeInterface, Colors } from './index';
import { getAnnualLegendData, sortInterannualSeasons, getChartCursorLabel } from '../../helpers/chart';
import { getPeriodLabel } from '../../helpers/periodicity';
import { Dictionary } from '../../@types';

export class AnnualLineGraph implements ChartTypeInterface {
  getLegendData(seasons: Array<string>, colors: Colors): Dictionary {
    return getAnnualLegendData(seasons, colors, 'line');
  }

  buildGraphs(
    yNames: Array<string>,
    colors: Colors,
    period: string,
    startMonth?: number,
    gefsSeason?: any,
    years?: Array<number | string>
  ): Array<any> {
    const graphs: Array<any> = [];

    const _yNames = yNames.slice();
    if (!years) years = _yNames.slice();

    // To make sure the years are in ascending order, and because sorting strings behaves differently than sorting numbers,
    // we covert the years array to numbers.
    // After converting the years array to numbers, the array is then sorted in ascending order.
    // This sort function has been tested on FF, IE11, and Chrome.
    years = years
      .map((year) => {
        if (typeof year === 'string') return parseInt(year);
        if (typeof year === 'number') return year;
      })
      .sort((a, b) => a - b);

    for (let i = 0, len = years.length; i < len; i += 1) {
      const yName = String(years[i]);
      const graph = new globalThis.AmCharts.AmGraph();

      graph.title = getPeriodLabel(period, parseInt(yName));
      graph.valueField = _yNames[i];

      graph.balloonFunction = function (graphDataItem): string {
        return getChartCursorLabel(graphDataItem, period, startMonth);
      };
      graph.fillAlphas = 0;
      graph.type = 'line';
      graph.lineColor = colors[yName];
      graph.bullet = 'circle';
      graph.bulletSize = 5;

      graphs.push(graph);
    }

    return graphs;
  }
}
