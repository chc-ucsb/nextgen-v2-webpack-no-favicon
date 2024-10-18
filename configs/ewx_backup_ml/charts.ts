export const charts = [
  /**
   * Africa
   */
  // CHIRPS
  {
    source: {
      url:
        'https://chc-ewx2.chc.ucsb.edu:443/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['EWX_rfe2_africa_1_monthly_data'],
    boundaries: ['cropzones'],
    boundaryLabels: ['Crop Zones'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'EWX_rfe2_africa_1_monthly_data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'EWX_rfe2_africa_1_monthly_data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'EWX_rfe2_africa_1_monthly_data',
        yAxisRange: 'auto',
      },
    ],
  },
];
