import { ChartTypeInterface, Colors } from './index';
import { Dictionary } from '../../@types';
import { getChartCursorLabel, sortSeasons, getLegendData } from '../../helpers/chart';

export class BarGraph implements ChartTypeInterface {
  getLegendData(seasons: Array<string>, colors: Colors): Dictionary {
    return getLegendData(seasons, colors, 'square');
  }

  buildGraphs(yNames: Array<string>, colors: Colors, period: string, startMonth: number): Array<any> {
    const graphs: Array<any> = [];

    yNames.sort(sortSeasons);

    for (let i = 0, len = yNames.length; i < len; i += 1) {
      const yName = `${yNames[i]}`;
      const graph = new globalThis.AmCharts.AmGraph();
      graph.balloonFunction = function (graphDataItem): string {
        return getChartCursorLabel(graphDataItem, period, startMonth);
      };
      graph.title = yName;
      graph.fillAlphas = 0.8;
      graph.columnWidth = 0.8;
      graph.lineThickness = 3;
      graph.type = 'column';
      if (yNames.length < 4) {
        graph.fixedColumnWidth = 4;
      } else if (yNames.length < 6) {
        graph.fixedColumnWidth = 3;
      } else {
        graph.fixedColumnWidth = 2;
      }
      graph.lineColor = colors[yName];
      graph.valueField = `${yName}`;

      graphs.push(graph);
    }

    return graphs;
  }
}
