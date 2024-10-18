import { ChartTypeInterface, Colors } from './index';
import { getLegendData, sortSeasons, getChartCursorLabel } from '../../helpers/chart';
import { Dictionary } from '../../@types';

export class YearlyLineGraph implements ChartTypeInterface {
  getLegendData(seasons: Array<string>, colors: Colors): Dictionary {
    return getLegendData(seasons, colors, 'line');
  }

  buildGraphs(yNames: Array<string>, colors: Colors, period: string, startMonth: number, layer: string): Array<any> {
    const graphs: Array<any> = [];

    for (let i = 0, len = yNames.length; i < len; i += 1) {
      const yName = `${yNames[i]}`;
      const graph = new globalThis.AmCharts.AmGraph();
      graph.balloonFunction = function (graphDataItem): string {
        return getChartCursorLabel(graphDataItem, period, startMonth);
      };
      graph.title = yName;
      graph.lineAlpha = 1;
      graph.type = 'line';
      graph.lineThickness = 1;
      graph.lineColor = colors[`${yName}`];
      graph.bullet = 'circle';
      graph.bulletSize = 5;
      graph.valueField = `${yName}`;
      graph.gridThickness = 0;

      graphs.push(graph);
    }

    // const yName = layer;
    // const graph = new globalThis.AmCharts.AmGraph();
    // graph.balloonFunction = function (graphDataItem): string {
    //   return getChartCursorLabel(graphDataItem, period, startMonth);
    // };
    // graph.title = yName;
    // graph.lineAlpha = 0.5;
    // graph.type = 'line';
    // graph.lineThickness = 1;
    // graph.lineColor = '#000000';
    // graph.bullet = 'circle';
    // graph.bulletSize = 5;
    // graph.valueField = 'value';

    // graphs.push(graph);

    return graphs;
  }
}
