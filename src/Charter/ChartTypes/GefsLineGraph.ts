import { ChartTypeInterface, Colors } from './index';
import { getGefsLegendData, sortSeasons, getChartCursorLabel } from '../../helpers/chart';
import { Dictionary } from '../../@types';
import { objPropExists } from '../../helpers/object';

export class GefsLineGraph implements ChartTypeInterface {
  getLegendData(seasons: Array<string>, colors: Colors): Dictionary {
    return getGefsLegendData(seasons, colors, 'square');
  }

  buildGraphs(yNames: Array<string>, colors: Colors, period: string, startMonth: number, gefsSeason: string): Array<any> {
    const graphs: Array<any> = [];

    yNames.sort(sortSeasons);

    for (let i = 0, len = yNames.length; i < len; i += 1) {
      const yName = `${yNames[i]}`;
      const graph = new globalThis.AmCharts.AmGraph();

      // Set a different balloonFunction for Prelim and GEFS bullets than non-Prelim/GEFS bullets
      if ((yName.indexOf('Prelim') !== -1 || yName.indexOf('GEFS') !== -1) && parseInt(yName.split(' ')[0]) === parseInt(gefsSeason)) {
        graph.balloonFunction = function (graphDataItem, graph): string {
          const { data } = graph;
          if (!Array.isArray(data)) return '';

          for (let j = 0, { length } = data; j < length; j += 1) {
            const context = data[j].dataContext;
            if (objPropExists(context, graph.title)) {
              // Balloon doesn't display if Prelim is the first data
              if (j === 0 && context.x === graphDataItem.dataContext.x) break;

              if (context.x === graphDataItem.dataContext.x) {
                return '';
              }
              break;
            }
          }
          return getChartCursorLabel(graphDataItem, period, startMonth);
        };
      } else {
        graph.balloonFunction = function (graphDataItem, graph): string {
          return getChartCursorLabel(graphDataItem, period, startMonth);
        };
      }

      graph.title = yName;
      graph.lineAlpha = 1;
      graph.type = 'line';
      graph.lineThickness = 3;
      graph.lineColor = colors[`${yName}`];
      graph.bullet = 'circle';
      graph.bulletSize = 5;
      graph.valueField = `${yName}`;

      // Commented this out because if there is only 1 month of data on the chart (aside from the mean) the bullets don't appear
      // graph.bulletColor = 'transparent';
      if (yName.indexOf('Prelim') !== -1) {
        graph.lineColor = '#7F7F7F';
      } else if (yName.indexOf('GEFS') !== -1) {
        graph.lineColor = '#f7b32b';
      }

      graphs.push(graph);
    }

    return graphs;
  }
}
