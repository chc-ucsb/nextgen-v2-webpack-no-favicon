import { ChartTypeInterface, Colors } from './index';
import { getChartCursorLabel, sortSeasons } from '../../helpers/chart';

// The Min Max Anomaly graph does not display an average
export class MinMaxAnomalyLineGraph implements ChartTypeInterface {
  buildGraphs(yNames: Array<string>, colors: Colors, period: string, startMonth: number): Array<any> {
    const graphs: Array<any> = [];

    yNames.sort(sortSeasons);

    let i = 0;
    const len = yNames.length;
    for (; i < len; i += 1) {
      const yName = `${yNames[i]}`;
      const graph = new globalThis.AmCharts.AmGraph();
      graph.balloonFunction = function (graphDataItem) {
        return getChartCursorLabel(graphDataItem, period, startMonth);
      };
      graph.title = yName;
      graph.lineAlpha = 1;
      graph.type = 'line';
      graph.lineThickness = 2;
      graph.lineColor = colors[`${yName}`];
      graph.valueField = `${yName}`;

      /**
       * A note about this `graph.connect` option:
       * This was used to enable the display of gaps in the data when that data is missing.
       * The G5 team has said that they will insert null values for missing data, making this unnecessary.
       * Setting this to true will close those gaps.
       * Setting this to false will display those gaps.
       *
       * This was changed from false to true because EWX was displaying a gap in the chart where Feb 29 is.
       */
      graph.connect = true;

      graphs.push(graph);
    }

    const minGraph = new globalThis.AmCharts.AmGraph();
    minGraph.balloonFunction = function (graphDataItem) {
      return getChartCursorLabel(graphDataItem, period, startMonth);
    };
    minGraph.title = 'Min';
    minGraph.lineAlpha = 0.5;
    minGraph.type = 'line';
    minGraph.lineThickness = 1;
    minGraph.lineColor = '#808080';
    minGraph.valueField = 'min';

    graphs.push(minGraph);

    const maxGraph = new globalThis.AmCharts.AmGraph();
    maxGraph.balloonFunction = function (graphDataItem) {
      return getChartCursorLabel(graphDataItem, period, startMonth);
    };
    maxGraph.title = 'Max';
    maxGraph.lineAlpha = 0.5;
    maxGraph.type = 'line';
    maxGraph.lineThickness = 1;
    maxGraph.lineColor = '#808080';
    maxGraph.valueField = 'max';
    maxGraph.fillAlphas = 0.5;
    maxGraph.fillToGraph = minGraph;

    graphs.push(maxGraph);

    return graphs;
  }
}
