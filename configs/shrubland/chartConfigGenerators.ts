import { ChartConfig } from './chartConfigInterface';

export function generateChartConfig(values): ChartConfig {
  const { url, layerId, title, boundaries, boundaryLabels, customColors } = values;
  return {
    source: {
      url: `${url}vector_dataset/{{vector_dataset}}/raster_dataset/${layerId}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/false`,
      type: 'json',
    },
    overlays: [
      {
        type: 'combined',
        forLayerId: `${layerId}_loadOnly`,
        title,
        timeseriesSourceLayerIds: [layerId],
      },
    ],
    boundaries,
    boundaryLabels,
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'year',
        dataRoot: `${layerId}.data`,
        yAxisRange: 'auto',
        customColors,
      },
    ],
  };
}
