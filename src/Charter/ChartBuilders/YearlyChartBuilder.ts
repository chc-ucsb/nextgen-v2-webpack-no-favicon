import AmSerialChart from 'amcharts/AmSerialChart';
import { ChartBuilderInterface, ChartTypeInterface } from '../ChartTypes';
import { DataHandler } from '../DataHandler';
import { isEmpty } from '../../helpers/validation';
import { allDataValuesAreNull, getMinPeriod, setNoData, setYAxesMinMax } from '../../helpers/chart';

export class YearlyChartBuilder implements ChartBuilderInterface {
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
    // const chartData = dataHandler.processData(options).formatMultipleYAxis().getArray();
    const data = dataHandler.processData(options);
    const lines = Object.keys(data.data);
    const formatted = data.formatMultipleYAxis();
    const final = formatted.getArray();

    // chartData = dataHandler.postProcessData(chartData, options.period);

    this.chart.dataProvider = final;
    this.chart.legend.switchable = true;
    this.chart.graphs = this.chartType.buildGraphs(lines, options.colors, options.period, options.startMonth, options.layer);
    this.chart.categoryAxis.minPeriod = getMinPeriod(options.period);
    this.chart.categoryAxis.title = 'Years';

    // @ts-ignore
    this.chart.categoryAxis.period = options.period;
    // @ts-ignore
    this.chart.categoryAxis.startMonth = options.startMonth;

    this.chart.validateData();
  }
}
