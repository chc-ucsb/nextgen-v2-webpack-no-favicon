import AmSerialChart from 'amcharts/AmSerialChart';
import { ChartBuilderInterface, ChartTypeInterface } from '../ChartTypes';
import { DataHandler } from '../DataHandler';
import { Dictionary } from '../../@types';
import { isEmpty } from '../../helpers/validation';
import { allDataValuesAreNull, processAnnualData, setNoData, setYAxesMinMax } from '../../helpers/chart';

export class AnnualGefsChartBuilder implements ChartBuilderInterface {
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

    const parsedData = dataHandler.normalizer(dataHandler.convertCrossYears(parseInt(options.startMonth), options.period).getData());

    // Mean datasets should not be included for interannual charts.
    for (const a in parsedData) {
      if (a) {
        for (const b in parsedData[a]) {
          if (b.includes('mean') || b.includes('median')) {
            delete parsedData[a][b];
          }
        }
      }
    }

    const data = parsedData.final;
    const prelimData = parsedData.prelim;
    const gefsData = parsedData.gefs;

    // Get latest season for prelim.
    let prelimSeason = '0';
    let prelimPeriod = '0';
    for (const season in prelimData) {
      if (!Number.isNaN(parseInt(season))) {
        if (parseInt(season) > parseInt(prelimSeason)) prelimSeason = season;
      }
    }

    // Get latest period in the latest season.
    for (const season in prelimData[prelimSeason]) {
      if (parseInt(prelimData[prelimSeason][season].x) > parseInt(prelimPeriod)) {
        prelimPeriod = prelimData[prelimSeason][season].x;
      }
    }

    // Get latest season for gefs.
    let gefsSeason = '0';
    let gefsPeriod = '0';
    for (const season in gefsData) {
      if (!Number.isNaN(parseInt(season))) {
        if (parseInt(season) > parseInt(gefsSeason)) gefsSeason = season;
      }
    }

    for (const season in gefsData[gefsSeason]) {
      // Get latest period in the latest season.
      if (parseInt(gefsData[gefsSeason][season].x) > parseInt(gefsPeriod)) {
        gefsPeriod = gefsData[gefsSeason][season].x;
      }
    }

    Object.keys(prelimData).map((season) => {
      data[`${season} Prelim`] = prelimData[season];
    });

    Object.keys(gefsData).map((season) => {
      data[`${season} GEFS`] = gefsData[season];
    });

    dataHandler.data = data;
    dataHandler.filterByPeriod(options);
    dataHandler.formatByXValues(options);
    dataHandler.data = processAnnualData(dataHandler.data);
    const properties = Object.keys(dataHandler.data);

    if (this.chart.legend) {
      this.chart.legend.useGraphSettings = true;
      this.chart.legend.markerSize = 10;
    }

    const formattedData = dataHandler.formatMultipleYAxis().getArray();
    this.chart.dataProvider = formattedData;
    this.chart.graphs = this.chartType.buildGraphs(properties, options.colors, options.period, parseInt(prelimSeason), gefsPeriod, options.years);
    // const configurl_legend = globalThis.App.Charter.configZ.legend === 'true' ? true : false
    this.chart.categoryAxis.title = globalThis.App.Config.sources.periods[options.period].xLabel;

    // @ts-ignore
    this.chart.categoryAxis.period = options.period;
    // @ts-ignore
    this.chart.categoryAxis.startMonth = options.startMonth;

    this.chart.validateData();
  }
}
