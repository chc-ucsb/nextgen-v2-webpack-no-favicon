import AmSerialChart from 'amcharts/AmSerialChart';
import { ChartBuilderInterface, ChartTypeInterface } from '../ChartTypes';
import { DataHandler } from '../DataHandler';
import { isEmpty } from '../../helpers/validation';
import { allDataValuesAreNull, getMinPeriod, setNoData, setYAxesMinMax } from '../../helpers/chart';

export class ChartBuilder implements ChartBuilderInterface {
  chart: AmSerialChart;
  chartType: ChartTypeInterface;

  constructor(chart: AmSerialChart, chartType: ChartTypeInterface) {
    this.chart = chart;
    this.chartType = chartType;
  }

  buildChart(dataHandler: DataHandler, options): void {
    if (dataHandler?.normalizer) {
      dataHandler.normalizer(dataHandler.getDataVar());
    }

    setYAxesMinMax(this.chart, options);

    if (isEmpty(dataHandler?.originalData) || allDataValuesAreNull(dataHandler?.originalData)) {
      setNoData(this.chart);
      return;
    }

    if (!options.startMonth) options.startMonth = 1;

    dataHandler.convertCrossYears(parseInt(options.startMonth), options.period).truncateData(options.years, options.truncateStartPeriod);
    if (options.cumulative === true) {
      dataHandler.cumulate();
    }
    const chartData = dataHandler.processData(options).formatMultipleYAxis().getArray();

    // chartData = dataHandler.postProcessData(chartData, options.period);

    if (this.chart.legend) this.chart.legend.data = this.chartType.getLegendData(options.years, options.colors);

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
