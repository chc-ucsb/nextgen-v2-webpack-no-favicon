import { ChartTypeInterface, Colors } from './index';
import { getGefsLegendData, sortSeasons, getChartCursorLabel } from '../../helpers/chart';
import { Dictionary } from '../../@types';

export class GefsBarGraph implements ChartTypeInterface {
  getLegendData(seasons: Array<string>, colors: Colors): Dictionary {
    return getGefsLegendData(seasons, colors, 'square');
  }

  buildGraphs(yNames: Array<string>, colors: Colors, period: string, startMonth: number, gefsSeason: string): Array<any> {
    const graphs: Array<any> = [];

    yNames.sort(sortSeasons);

    for (let i = 0, len = yNames.length; i < len; i += 1) {
      const yName = `${yNames[i]}`;
      const graph = new globalThis.AmCharts.AmGraph();
      graph.balloonFunction = function (graphDataItem, graph): string {
        return getChartCursorLabel(graphDataItem, period, startMonth);
      };
      graph.title = yName;
      graph.lineThickness = 3;
      graph.fillAlphas = 0.8;
      graph.fixedColumnWidth = 3;
      graph.type = 'column';
      graph.lineColor = colors[`${yName}`];
      graph.valueField = `${yName}`;
      graph.columnWidth = 0.8;
      if (yName.indexOf('Prelim') !== -1) {
        graph.lineColor = '#7F7F7F';
        graph.columnWidth = 0.2;
      } else if (yName.indexOf('GEFS') !== -1) {
        graph.lineColor = '#f7b32b';
        graph.columnWidth = 0.2;
      }

      graphs.push(graph);
    }

    return graphs;
  }
}
