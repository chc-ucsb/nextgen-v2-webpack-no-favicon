import AmSerialChart from 'amcharts/AmSerialChart';
import { ChartBuilderInterface, ChartTypeInterface, GefsLineGraph } from '../ChartTypes';
import { DataHandler } from '../DataHandler';
import { Dictionary } from '../../@types';
import { objPropExists } from '../../helpers/object';
import { isEmpty } from '../../helpers/validation';
import { allDataValuesAreNull, getMinPeriod, setNoData, setYAxesMinMax } from '../../helpers/chart';
import { isArrayEqual } from '../../helpers/array';
import { isStaticSeasonName, isValidPeriodName } from '../../helpers/string';

export class PrelimChartBuilder implements ChartBuilderInterface {
  chart: AmSerialChart;
  chartType: ChartTypeInterface;

  constructor(chart: AmSerialChart, chartType: ChartTypeInterface) {
    this.chart = chart;
    this.chartType = chartType;
  }

  buildChart(dataHandler: DataHandler, options: Dictionary): void {
    let latestSeason;
    let latestPeriod;

    setYAxesMinMax(this.chart, options);

    if (isEmpty(dataHandler?.originalData) || allDataValuesAreNull(dataHandler?.originalData)) {
      setNoData(this.chart);
      return;
    }

    dataHandler.convertCrossYears(parseInt(options.startMonth), options.period);

    // Fetch the seasons /after/ the cross years have been calculated so none are missing.
    latestSeason = 0;
    const seasons = Object.keys(dataHandler.getDataVar());
    seasons.forEach((season) => {
      if (typeof parseInt(season) === 'number' && parseInt(season) > latestSeason) {
        latestSeason = parseInt(season);
      }
    });

    // Check if any extra seasons need chart colors generated.
    const needsColor = seasons.filter(function (season) {
      return !objPropExists(options.colors, season);
    });
    if (needsColor.length) {
      needsColor.map(function (season) {
        options.colors[season] = globalThis.App.Charter.getRandomChartColor();
      });
    }

    dataHandler.truncateData(options.years, options.truncateStartPeriod);

    latestPeriod = dataHandler.getLatestPeriod('Prelim');

    /*
     * For cumulative, we need to add the cumulative value of the latest season in
     * the final data to the beginning of the prelim data before cumulating it.
     * Note that if the final data has data through the full season and
     * the prelim data starts at the first period of the next season,
     * then we can't add the cumulative final to the prelim.
     */
    if (options.cumulative) {
      dataHandler.cumulate();

      /*
       * Since the value of the latest period changes after cumulating, we need to get it again here.
       */
      latestPeriod = dataHandler.getLatestPeriod('Prelim');
    }

    const parsedData = dataHandler.normalizer(dataHandler.getDataVar());
    const finalData = parsedData.final;
    const prelimData = parsedData.prelim;

    // Check to be sure that there is final data selected.
    if (latestPeriod !== null) {
      for (const season in prelimData) {
        if (objPropExists(finalData, season)) {
          if (this.chartType instanceof GefsLineGraph) {
            const connectDay = finalData[season];
            prelimData[season].unshift({
              granule_start: connectDay[connectDay.length - 1].granule_start,
              granule_end: connectDay[connectDay.length - 1].granule_end,
              value: connectDay[connectDay.length - 1].value,
            });
          }
        }
      }
    }

    Object.keys(prelimData).map((season) => {
      finalData[`${season} Prelim`] = prelimData[season];
    });

    const properties = Object.keys(finalData);
    dataHandler.data = finalData;

    let chartData = dataHandler
      // TODO: Remove when 2000-2020 data is finalized.
      .removeProperty('mean_2000-2020')
      .processData(options)
      .formatMultipleYAxis()
      .getArray();

    chartData = dataHandler.postProcessData(chartData, options.period);

    if (this.chart.legend) this.chart.legend.data = this.chartType.getLegendData(properties, options.colors);

    this.chart.dataProvider = chartData;
    this.chart.graphs = this.chartType.buildGraphs(properties, options.colors, options.period, options.startMonth, latestSeason);
    this.chart.categoryAxis.minPeriod = getMinPeriod(options.period);
    this.chart.categoryAxis.title = globalThis.App.Config.sources.periods[options.period].xLabel;

    // @ts-ignore
    this.chart.categoryAxis.period = options.period;
    // @ts-ignore
    this.chart.categoryAxis.startMonth = options.startMonth;

    this.chart.validateData();
  }
}
