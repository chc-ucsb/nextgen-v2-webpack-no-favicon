import AmCoordinateChart from 'amcharts/AmCoordinateChart';
import { ChartBuilderInterface, ChartTypeInterface } from '../ChartTypes';
import { setYAxesMinMax } from '../../helpers/chart';

export class DefaultChartBuilder implements ChartBuilderInterface {
  chart: AmCoordinateChart;
  chartType: ChartTypeInterface;

  constructor(chart: AmCoordinateChart, chartType: ChartTypeInterface) {
    this.chart = chart;
    this.chartType = chartType;
  }

  buildChart(dataHandler, options): void {
    setYAxesMinMax(this.chart, options);

    if (dataHandler?.normalizer) {
      dataHandler.normalizer(dataHandler?.originalData);
    }

    this.chart.dataProvider = dataHandler;
    this.chart.graphs = this.chartType.buildGraphs(options.years, options.colors);
    this.chart.validateData();
  }
}
