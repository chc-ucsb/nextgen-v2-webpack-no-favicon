import AmSerialChart from 'amcharts/AmSerialChart';
import { ChartBuilderInterface, ChartTypeInterface } from '../ChartTypes';
import { DataHandler } from '../DataHandler';
import { Dictionary } from '../../@types';
import { isEmpty } from '../../helpers/validation';
import { allDataValuesAreNull, handleCrossYears, processAnnualData, setNoData, setYAxesMinMax } from '../../helpers/chart';

export class AnnualChartBuilder implements ChartBuilderInterface {
  chart: AmSerialChart;
  chartType: ChartTypeInterface;

  constructor(chart: AmSerialChart, chartType: ChartTypeInterface) {
    this.chart = chart;
    this.chartType = chartType;
  }

  buildChart(dataHandler: DataHandler, options: Dictionary): void {
    setYAxesMinMax(this.chart, options);

    if (Array.isArray(dataHandler)) {
      dataHandler = dataHandler[0];
    }

    if (isEmpty(dataHandler?.originalData) || allDataValuesAreNull(dataHandler?.originalData)) {
      setNoData(this.chart);
      return;
    }

    dataHandler.convertCrossYears(parseInt(options.startMonth), options.period);

    // Normalize the data if a normalizer is set for the chart.
    if (dataHandler?.normalizer) {
      dataHandler.data = dataHandler.normalizer(dataHandler.getData());
    }

    // Mean datasets should not be included for interannual charts.
    for (const a in dataHandler.data) {
      if (a) {
        for (const b in dataHandler.data[a]) {
          if (b.includes('mean') || b.includes('median')) {
            delete dataHandler.data[a][b];
          }
        }
      }
    }

    dataHandler.removeStaticProperties().filterByPeriod(options).formatByXValues(options);

    dataHandler.data = processAnnualData(dataHandler.data);
    const properties = Object.keys(dataHandler.data);
    const formattedData = dataHandler.formatMultipleYAxis().getArray();

    if (this.chart.legend) {
      this.chart.legend.useGraphSettings = true;
      this.chart.legend.markerSize = 10;
    }

    this.chart.dataProvider = formattedData;
    this.chart.graphs = this.chartType.buildGraphs(properties, options.colors, options.period, options.startMonth, null, options.years);
    // const configurl_legend = globalThis.App.Charter.configZ.legend === 'true' ? true : false
    this.chart.categoryAxis.title = globalThis.App.Config.sources.periods[options.period].xLabel;

    // @ts-ignore
    this.chart.categoryAxis.period = options.period;
    // @ts-ignore
    this.chart.categoryAxis.startMonth = options.startMonth;

    this.chart.validateData();
  }
}
