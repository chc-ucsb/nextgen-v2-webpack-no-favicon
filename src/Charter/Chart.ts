import * as AmCharts from 'amcharts3';
import { ChartBuilderInterface, ChartTypeInterface } from './ChartTypes';
import { Dictionary } from '../@types';
import { objPropExists } from '../helpers/object';

/**
 * This class wraps a single chart. It takes an instance of a chart builder and a chart type.
 * Optionally, it can also accept a series of exporters for downloading the data and can register events.
 */
export class Chart {
  id: string;
  options: Dictionary = {};
  divId: string;
  chart: AmCharts.AmChart;
  exporters: Dictionary = {};
  chartType: ChartTypeInterface;
  chartBuilder: ChartBuilderInterface;
  config: Dictionary = {};
  defaultOptions = {
    type: 'serial',
    theme: 'none',
    pathToImages: '/amcharts3/images',
    columnWidth: 1,
    categoryField: 'x',
    categoryAxis: {
      parseDates: true,
      markPeriodChange: false,
      gridPosition: 'start',
      autoGridCount: false,
      gridCount: 12,
    },
    valueAxes: [
      {
        fontSize: 8,
        id: 'ValueAxis-1',
        position: 'left',
        axisAlpha: 0,
      },
    ],
    export: {
      enabled: true,
      menu: [],
      dataDateFormat: 'MM-DD',
    },
    chartScrollbar: {
      autoGridCount: true,
      scrollbarHeight: 15,
    },
    legend: {
      useGraphSettings: true,
      switchable: false,
      labelText: '[[title]]',
      position: 'bottom',
      equalWidths: true,
    },
  };

  constructor(config: Dictionary) {
    this.config = config;
    if (typeof this.config.options === 'undefined') {
      this.config.options = this.defaultOptions;
    }

    this.id = this.config.id;
    this.options = this.config.options;
    this.divId = this.config.name;

    // We currently do not show values in the legend but if we did, this would round the values.
    if (objPropExists(this.options, 'legend')) {
      this.options.legend.valueFunction = function (graphDataItem, text): string {
        if (text.trim() === '') return '';
        let multiplier = '1';
        for (let i = 0, len = this.configZ.decimalDigits; i < len; i += 1) {
          multiplier += '0';
        }

        const value = parseFloat(text);
        return `${Math.round(value * parseInt(multiplier)) / parseInt(multiplier)}`;
      };
    }

    // Make the chart builder
    this.chartType = this.getNewChartType(this.config.custom.chartType);
    this.chart = globalThis.AmCharts.makeChart(this.config.name, this.options);
    this.chartBuilder = this.getNewChartBuilder(this.config.custom.chartBuilder, this.chartType);

    // Set events
    for (const event of Object.keys(this.config.events)) {
      this.chart[event] = config.events[event];
    }

    // Set exporters
    this.setChartExporters();
  }

  /**
   * Factory method to provide a chart builder.
   * @param {string} chartBuilderName
   * @param {ChartTypeInterface} chartType
   * @returns {ChartBuilderInterface}
   */
  getNewChartBuilder(chartBuilderName: string, chartType: ChartTypeInterface): ChartBuilderInterface {
    let chartBuilder;
    const coreChartBuilders = globalThis.App.Charter.ChartBuilders;
    const customChartBuilders = globalThis.App.Config.chartBuilders;

    /*
     * If a name is passed, first check to see if Charter has that chart builder.
     * If not, assume it's a custom builder in the user-defined Config object.
     * If it's not found in the Config object, throw an error.
     * If no name is passed, use the default chart builder.
     */
    if (typeof chartBuilderName !== 'undefined') {
      if (typeof coreChartBuilders[chartBuilderName] !== 'undefined') {
        chartBuilder = coreChartBuilders[chartBuilderName];
      } else if (objPropExists(customChartBuilders, chartBuilderName)) {
        chartBuilder = customChartBuilders[chartBuilderName];
      } else {
        throw new Error(`Error! Requested chart builder '${chartBuilderName}' does not exist in the application context.`);
      }
    } else {
      chartBuilder = coreChartBuilders.DefaultChartBuilder;
    }
    return new chartBuilder(this.chart, chartType);
  }

  /**
   * Factory method to provide a chart type.
   * @param {string} chartTypeName
   * @returns {ChartTypeInterface}
   */
  getNewChartType(chartTypeName: string): ChartTypeInterface {
    let chartType;
    const coreChartTypes = globalThis.App.Charter.ChartTypes;
    const customChartTypes = globalThis.App.Config.chartTypes;

    /*
     * If a name is passed, first check to see if Charter has that chart type.
     * If not, assume it's a custom type in the user-defined Config object.
     * If it's not found in the Config object, throw an error.
     * If no name is passed, use the default chart type.
     */
    if (typeof chartTypeName !== 'undefined') {
      if (typeof coreChartTypes[chartTypeName] !== 'undefined') {
        chartType = coreChartTypes[chartTypeName];
      } else if (objPropExists(customChartTypes, chartTypeName)) {
        chartType = customChartTypes[chartTypeName];
      } else {
        throw new Error(`Error! Requested chart type '${chartTypeName}' does not exist in the application context.`);
      }
    } else {
      chartType = coreChartTypes.StaticChartType;
    }
    return new chartType();
  }

  setChartBuilder(chartBuilder: ChartBuilderInterface): void {
    this.chartBuilder = chartBuilder;
  }

  setChartType(chartType: ChartTypeInterface): void {
    this.chartBuilder.chartType = chartType;
  }

  setChartExporters(): void {
    for (const formatName of Object.keys(this.config.custom.exporters)) {
      const exporterName = this.config.custom.exporters[formatName];
      const coreExporters = globalThis.App.Charter.Exporters[formatName];
      const customExporters = globalThis.App.Config.chartExporters;

      /*
       * First check if Charter has that chart exporter.
       * If not, assume it's a custom exporter in the user-defined Config object.
       * If it's not found in the Config object, throw an error.
       */
      if (objPropExists(coreExporters, exporterName)) {
        this.exporters[formatName] = coreExporters[exporterName];
      } else if (objPropExists(customExporters, exporterName)) {
        this.exporters[formatName] = customExporters[exporterName];
      } else {
        throw new Error(`Error! Requested chart exporter '${exporterName}' does not exist in the application context.`);
      }
    }
  }
}
