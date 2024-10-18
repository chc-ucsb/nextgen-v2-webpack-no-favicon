import AmSerialChart from 'amcharts/AmSerialChart';
import { ChartBuilderInterface, ChartTypeInterface } from '../ChartTypes';
import { DataHandler } from '../DataHandler';
import { Dictionary } from '../../@types';
import { isEmpty } from '../../helpers/validation';
import { allDataValuesAreNull, getMinPeriod, setNoData, setYAxesMinMax } from '../../helpers/chart';

export class MinMaxChartBuilder implements ChartBuilderInterface {
  chart: AmSerialChart;
  chartType: ChartTypeInterface;

  constructor(chart: AmSerialChart, chartType: ChartTypeInterface) {
    this.chart = chart;
    this.chartType = chartType;
  }

  buildChart(dataHandler: DataHandler, options: Dictionary): void {
    setYAxesMinMax(this.chart, options);

    if (isEmpty(dataHandler?.originalData) || allDataValuesAreNull(dataHandler?.originalData)) {
      setNoData(this.chart);
      return;
    }

    if (dataHandler?.normalizer) {
      dataHandler.data = dataHandler.normalizer(dataHandler.getData());
    }

    dataHandler.convertCrossYears(parseInt(options.startMonth), options.period);
    if (options.cumulative === true) {
      dataHandler.cumulate();
    }

    const chartData = dataHandler
      .getStatistics()
      .truncateData(options.years.concat(['min', 'max', 'average']), options.truncateStartPeriod)
      .processData(options)
      .formatMultipleYAxis()
      .getArray();

    // chartData = dataHandler.postProcessData(chartData, options.period);

    if (this.chart.legend) {
      this.chart.legend.useGraphSettings = true;
      this.chart.legend.markerSize = 10;
    }

    this.chart.dataProvider = chartData;
    this.chart.graphs = this.chartType.buildGraphs(options.years, options.colors, options.period, options.startMonth);
    this.chart.categoryAxis.minPeriod = getMinPeriod(options.period);
    this.chart.categoryAxis.title = globalThis.App.Config.sources.periods[options.period].xLabel;

    // @ts-ignore
    this.chart.categoryAxis.period = options.period;
    // @ts-ignore
    this.chart.categoryAxis.startMonth = options.startMonth;
    this.chart.validateData();
  }
}
