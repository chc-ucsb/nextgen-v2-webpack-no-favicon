/**
 * This object wraps one or more charts and provides convenient methods for building or updating charts.
 */
import { Chart } from './Chart';
import { DataHandler } from './DataHandler';
import { Dictionary } from '../@types';
import { setNoData } from '../helpers/chart';

export class ChartHandler {
  charts: Array<Chart>;

  constructor(chartData) {
    this.charts = chartData.map((data) => new Chart(data));
  }

  /**
   * Finds and returns a single chart.
   * @param {string} id The ID of the chart to return.
   * @returns {Chart}
   */
  getChartById(id: string): Chart {
    return this.charts.find((c) => c.id === id);
  }

  /**
   * Call the exporter to download the data for the specified format.
   * @param {string} id The ID of the chart to export.
   * @param {string} format The extension of the file to be downloaded. (eg. CSV/PNG
   * @param {Dictionary} options
   */
  exportChart(id: string, format: string, options: Dictionary): void {
    const chart = this.getChartById(id);
    if (chart === null) return;
    chart.exporters[format](chart.chart, options);
  }

  /**
   * Resizes a chart.
   * If a chart is hidden when it is built, AmCharts doesn't know how to size it properly.
   * Call this on a chart after it is shown. (popups do this automatically)
   * @param {string} id The ID of the chart to refresh.
   */
  refresh(id?: string): void {
    if (typeof id !== 'undefined') {
      const chartWrapper = this.getChartById(id);
      const { chart } = chartWrapper;
      chart.validateData();
      // chart.validateSize()
      chart.invalidateSize();
    } else {
      for (let i = 0, len = this.charts.length; i < len; i += 1) {
        this.charts[i].chart.validateData();
        this.charts[i].chart.invalidateSize();
      }
    }
  }

  /**
   * Builds a single chart by name.
   * @param {string} id The name of the chart given when instantiating the chart handler.
   * @param {Array<DataHandler>} data An array of DataHandler objects for creating the chart data.
   * @param {Dictionary} options An object of extra parameters required by the chart builders.
   */
  buildChart(id: string, data: Array<DataHandler>, options: Dictionary): void {
    const chart = this.getChartById(id);
    if (chart !== null) chart.chartBuilder.buildChart(data, options);
  }

  /**
   * Builds all charts associated with this chart handler.
   * @param {Array<DataHandler>} data An array of DataHandler objects for creating the chart data.
   * @param {Dictionary} options An object of extra parameters required by the chart builders.
   */
  buildCharts(data: Array<DataHandler>, options: Dictionary): void {
    for (let i = 0, len = this.charts.length; i < len; i += 1) {
      this.charts[i].chartBuilder.buildChart(data, options);
    }
  }

  /**
   * Sets the title of a chart.
   * @param {string} id The ID of the chart.
   * @param {string} title Text to set as the title.
   */
  setTitle(id: string, title: string): void {
    const chartWrapper = this.getChartById(id);
    const { chart } = chartWrapper;
    chart.titles = [];
    chart.addTitle(title);
    chart.validateNow();
  }

  /**
   * This allows resizing the chart without rebuilding it from scratch.
   */
  setChartSize(width: number, height: number): void {
    for (let i = 0, len = this.charts.length; i < len; i += 1) {
      const chart = this.charts[i];
      const chartDiv = document.getElementById(chart.divId);
      chartDiv.style.width = `${width}px`;
      chartDiv.style.height = `${height - 15}px`;
      chart.chart.invalidateSize();
    }
  }

  buildEmptyChart(): void {
    setNoData(this.charts[0].chart);
  }
}
