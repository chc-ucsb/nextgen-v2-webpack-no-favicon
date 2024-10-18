import AmCoordinateChart from 'amcharts/AmCoordinateChart';
import { BarGraph } from './BarGraph';
import { LineGraph } from './LineGraph';
import { YearlyLineGraph } from './YearlyLineGraph';
import { AnnualBarGraph } from './AnnualBarGraph';
import { AnnualLineGraph } from './AnnualLineGraph';
import { GefsBarGraph } from './GefsBarGraph';
import { GefsLineGraph } from './GefsLineGraph';
import { MinMaxLineGraph } from './MinMaxLineGraph';
import { MinMaxAnomalyLineGraph } from './MinMaxAnomalyLineGraph';
import { DataHandler } from '../DataHandler';
import { Dictionary } from '../../@types';

export * from './BarGraph';
export * from './LineGraph';
export * from './AnnualBarGraph';
export * from './AnnualLineGraph';
export * from './GefsBarGraph';
export * from './GefsLineGraph';
export * from './MinMaxLineGraph';
export * from './YearlyLineGraph';

export const ChartTypes = {
  BarGraph,
  LineGraph,
  AnnualBarGraph,
  AnnualLineGraph,
  GefsBarGraph,
  GefsLineGraph,
  MinMaxLineGraph,
  MinMaxAnomalyLineGraph,
  YearlyLineGraph,
};

export type Colors = Record<string, string>;

export interface ChartTypeInterface {
  getLegendData?: (seasons: Array<string>, colors: Colors) => any;
  buildGraphs?: (
    yNames: Array<string>,
    colors: Colors,
    period?: string,
    startMonth?: number,
    gefsSeason?: string,
    years?: Array<number>
  ) => Array<any>;
}

export interface ChartBuilderInterface {
  chart: AmCoordinateChart;
  chartType: ChartTypeInterface;

  buildChart(data: DataHandler | Array<DataHandler>, options: Dictionary): void;
}

export type ConfigOverride = {
  amountSelected?: number;
  others?: Array<string>;
  startSelectionAt: 'latest' | 'earliest';
};
