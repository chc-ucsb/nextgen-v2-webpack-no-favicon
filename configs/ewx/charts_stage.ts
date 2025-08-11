export const charts = [

  // CHIRPS Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps_global_dekad_mean'],
    },
    overlays: ['chirpsAfricaDataDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsAfricaAnomalyDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsAfricaZscoreDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps_global_1_monthly_mean'],
    },
    overlays: ['chirpsAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps_global_2_monthly_data'],
    },
    overlays: ['chirpsAfricaData2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsAfricaAnomaly2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsAfricaZscore2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps_global_3_monthly_mean'],
    },
    overlays: ['chirpsAfricaData3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsAfricaAnomaly3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsAfricaZscore3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRPS Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps_global_dekad_mean'],
    },
    overlays: ['chirpsCamcarDataDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsCamcarAnomalyDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsCamcarZscoreDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps_global_1_monthly_mean'],
    },
    overlays: ['chirpsCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps_global_2_monthly_mean'],
    },
    overlays: ['chirpsCamcarData2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsCamcarAnomaly2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsCamcarZscore2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps_global_3_monthly_mean'],
    },
    overlays: ['chirpsCamcarData3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsCamcarAnomaly3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsCamcarZscore3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRPS-GEFS Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpsgefsAfricaData05Day'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_gefs_global_05day_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_gefs_global_05day_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_gefs_global_05day_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsgefsAfricaAnomaly05Day'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_gefs_global_05day_anomaly.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_gefs_global_05day_anomaly.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_gefs_global_05day_anomaly.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsgefsAfricaZscore05Day'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_gefs_global_05day_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_gefs_global_05day_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_gefs_global_05day_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpsgefsAfricaData10Day'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'cchirps_gefs_global_10day_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'cchirps_gefs_global_10day_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'cchirps_gefs_global_10day_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsgefsAfricaAnomaly10Day'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'cchirps_gefs_global_10day_anomaly.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'cchirps_gefs_global_10day_anomaly.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'cchirps_gefs_global_10day_anomaly.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsgefsAfricaZscore10Day'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'cchirps_gefs_global_10day_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'cchirps_gefs_global_10day_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'cchirps_gefs_global_10day_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpsgefsAfricaData15Day'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_gefs_global_15day_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_gefs_global_15day_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_gefs_global_15day_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsgefsAfricaAnomaly15Day'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_gefs_global_15day_anomaly.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_gefs_global_15day_anomaly.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_gefs_global_15day_anomaly.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsgefsAfricaZscore15Day'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_gefs_global_15day_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_gefs_global_15day_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_gefs_global_15day_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },


  // CHIRPS-GEFS Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpsgefsCamcarData05Day'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_gefs_global_05day_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_gefs_global_05day_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_gefs_global_05day_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsgefsCamcarAnomaly05Day'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_gefs_global_05day_anomaly.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_gefs_global_05day_anomaly.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_gefs_global_05day_anomaly.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsgefsCamcarZscore05Day'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_gefs_global_05day_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_gefs_global_05day_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_gefs_global_05day_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpsgefsCamcarData10Day'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'cchirps_gefs_global_10day_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'cchirps_gefs_global_10day_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'cchirps_gefs_global_10day_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsgefsCamcarAnomaly10Day'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'cchirps_gefs_global_10day_anomaly.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'cchirps_gefs_global_10day_anomaly.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'cchirps_gefs_global_10day_anomaly.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsgefsCamcarZscore10Day'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'cchirps_gefs_global_10day_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'cchirps_gefs_global_10day_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'cchirps_gefs_global_10day_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpsgefsCamcarData15Day'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_gefs_global_15day_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_gefs_global_15day_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_gefs_global_15day_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsgefsCamcarAnomaly15Day'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_gefs_global_15day_anomaly.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_gefs_global_15day_anomaly.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_gefs_global_15day_anomaly.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsgefsCamcarZscore15Day'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_gefs_global_15day_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_gefs_global_15day_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_gefs_global_15day_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRP v2 Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpAfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpAfricaAnomalyPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpAfricaZscorePentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpAfricaDataDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpAfricaAnomalyDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpAfricaZscoreDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpAfricaData2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpAfricaAnomaly2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpAfricaZscore2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpAfricaData3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpAfricaAnomaly3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpAfricaZscore3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // RFE2
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['rfe2_africa_dekad_mean'],
    },
    overlays: ['rfe2AfricaDataDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'rfe2_africa_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'rfe2_africa_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'rfe2_africa_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['rfe2AfricaAnomalyDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'rfe2_africa_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'rfe2_africa_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'rfe2_africa_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['rfe2AfricaZscoreDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'rfe2_africa_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'rfe2_africa_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'rfe2_africa_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['rfe2_africa_1_monthly_mean'],
    },
    overlays: ['rfe2AfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'rfe2_africa_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'rfe2_africa_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'rfe2_africa_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['rfe2AfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'rfe2_africa_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'rfe2_africa_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'rfe2_africa_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['rfe2AfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'rfe2_africa_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'rfe2_africa_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'rfe2_africa_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['rfe2_africa_2_monthly_mean'],
    },
    overlays: ['rfe2AfricaData2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'rfe2_africa_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'rfe2_africa_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'rfe2_africa_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['rfe2AfricaAnomaly2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'rfe2_africa_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'rfe2_africa_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'rfe2_africa_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['rfe2AfricaZscore2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'rfe2_africa_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'rfe2_africa_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'rfe2_africa_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['rfe2_africa_3_monthly'],
    },
    overlays: ['rfe2AfricaData3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'rfe2_africa_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'rfe2_africa_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'rfe2_africa_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['rfe2AfricaAnomaly3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'rfe2_africa_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'rfe2_africa_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'rfe2_africa_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['rfe2AfricaZscore3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'rfe2_africa_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'rfe2_africa_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'rfe2_africa_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // LST Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lst006_global_dekad_mean'],
    },
    overlays: ['lst006AfricaDataDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006AfricaAnomalyDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006AfricaZscoreDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lst006_global_1_monthly_mean'],
    },
    overlays: ['lst006AfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006AfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006AfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lst006_global_2_monthly_mean'],
    },
    overlays: ['lst006AfricaData2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006AfricaAnomaly2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006AfricaZscore2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lst006_global_3_monthly_mean'],
    },
    overlays: ['lst006AfricaData3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006AfricaAnomaly3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006AfricaZscore3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // LST Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lst006_global_dekad_mean'],
    },
    overlays: ['lst006CamcarDataDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006CamcarAnomalyDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006CamcarZscoreDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lst006_global_1_monthly_mean'],
    },
    overlays: ['lst006CamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006CamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006CamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lst006_global_2_monthly_mean'],
    },
    overlays: ['lst006CamcarData2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006CamcarAnomaly2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006CamcarZscore2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lst006_global_3_monthly_mean'],
    },
    overlays: ['lst006CamcarData3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006CamcarAnomaly3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006CamcarZscore3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },


  // Tamsat 3.1 Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['tamsat3p1_africa_dekad_mean'],
    },
    overlays: ['tamsat3p1AfricaDataDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'tamsat3p1_africa_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'tamsat3p1_africa_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'tamsat3p1_africa_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['tamsat3p1AfricaAnomalyDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'tamsat3p1_africa_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'tamsat3p1_africa_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'tamsat3p1_africa_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['tamsat3p1AfricaZscoreDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'tamsat3p1_africa_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'tamsat3p1_africa_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'tamsat3p1_africa_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['tamsat3p1_africa_1_monthly_mean'],
    },
    overlays: ['tamsat3p1AfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'tamsat3p1_africa_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'tamsat3p1_africa_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'tamsat3p1_africa_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['tamsat3p1AfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'tamsat3p1_africa_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'tamsat3p1_africa_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'tamsat3p1_africa_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['tamsat3p1AfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'tamsat3p1_africa_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'tamsat3p1_africa_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'tamsat3p1_africa_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // ARC2 Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['arc2_africa_dekad_mean'],
    },
    overlays: ['arc2AfricaDataDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'arc2_africa_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'arc2_africa_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'arc2_africa_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['arc2AfricaAnomalyDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'arc2_africa_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'arc2_africa_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'arc2_africa_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['arc2AfricaZscoreDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'arc2_africa_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'arc2_africa_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'arc2_africa_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['arc2_africa_1_monthly_mean'],
    },
    overlays: ['arc2AfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'arc2_africa_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'arc2_africa_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'arc2_africa_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['arc2AfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'arc2_africa_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'arc2_africa_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'arc2_africa_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['arc2AfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'arc2_africa_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'arc2_africa_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'arc2_africa_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // Persiann-CCS Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['persiann-ccs_global_1_monthly_mean'],
    },
    overlays: ['persiann-ccsAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'persiann-ccs_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'persiann-ccs_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'persiann-ccs_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['persiann-ccsAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'persiann-ccs_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'persiann-ccs_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'persiann-ccs_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['persiann-ccsAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'persiann-ccs_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'persiann-ccs_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'persiann-ccs_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // Hobbins RefET Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['hobbins_refet_global_dekad_mean'],
    },
    overlays: ['hobbinsrefetAfricaDataDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['hobbinsrefetAfricaAnomalyDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['hobbinsrefetAfricaZscoreDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['hobbins_refet_global_1_monthly_mean'],
    },
    overlays: ['hobbinsrefetAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['hobbinsrefetAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['hobbinsrefetAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRP v3.0 Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_pentad_mean'],
    },
    overlays: ['chirpv3p0AfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0AfricaAnomalyPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_dekad_mean'],
    },
    overlays: ['chirpv3p0AfricaDataDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0AfricaAnomalyDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_1_monthly_mean'],
    },
    overlays: ['chirpv3p0AfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0AfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_2_monthly_mean'],
    },
    overlays: ['chirpv3p0AfricaData2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0AfricaAnomaly2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_3_monthly_mean'],
    },
    overlays: ['chirpv3p0AfricaData3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0AfricaAnomaly3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0fillmapAfricaData1Monthly'],
    boundaries: ['africaAdmin1'],
    boundaryLabels: ['Admin1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0fillmap_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0fillmap_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0fillmap_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0fillmapAfricaDataAnnual'],
    boundaries: ['africaAdmin1'],
    boundaryLabels: ['Admin1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0fillmap_global_year_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0fillmap_global_year_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0fillmap_global_year_data.data',
        yAxisRange: 'auto',
      },
    ],
  },


  // CHIRPS v3.0 Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_pentad_mean'],
    },
    overlays: ['chirpsv3AfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpsv3AfricaAnomPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_dekad_mean'],
    },
    overlays: ['chirpsv3AfricaDataDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpsv3AfricaAnomDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_1_monthly_mean'],
    },
    overlays: ['chirpsv3AfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpsv3AfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_2_monthly_mean'],
    },
    overlays: ['chirpsv3AfricaData2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpsv3AfricaAnomaly2Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_3_monthly_mean'],
    },
    overlays: ['chirpsv3AfricaData3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpsv3AfricaAnomaly3Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsv3stndensityAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0','TanaRiverBasinAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3stndensity_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3stndensity_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3stndensity_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTSmax Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtsmax_global_1_monthly_mean'],
    },
    overlays: ['chirtsmaxAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsmaxAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsmaxAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTSvpd Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtsvpd_global_pentad_mean'],
    },
    overlays: ['chirtsvpdAfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsvpdAfricaAnomalyPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsvpdAfricaZscorePentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtsvpd_global_1_monthly_mean'],
    },
    overlays: ['chirtsvpdAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsvpdAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsvpdAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTSwbgt Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtswbgt_global_pentad_mean'],
    },
    overlays: ['chirtswbgtAfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtswbgt_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsmax_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtswbgtAfricaAnomalyPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtswbgt_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtswbgt_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtswbgtAfricaZscorePentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtswbgt_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtswbgt_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtswbgt_global_1_monthly_mean'],
    },
    overlays: ['chirtswbgtAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtswbgt_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtswbgt_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtswbgtAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtswbgt_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtswbgt_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtswbgtAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtswbgt_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtswbgt_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTShi Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtshi_global_pentad_mean'],
    },
    overlays: ['chirtshiAfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtshi_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsmax_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtshiAfricaAnomalyPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtshi_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtshi_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtshiAfricaZscorePentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtshi_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtshi_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtshi_global_1_monthly_mean'],
    },
    overlays: ['chirtshiAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtshi_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtshi_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtshiAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtshi_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtshi_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtshiAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtshi_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtshi_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },


  // CHIRTmax Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtmax_global_1_montly_mean'],
    },
    overlays: ['chirtmaxAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtmaxAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtmaxAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTS-ERA5 Tmax Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5tmax_global_pentad_mean'],
    },
    overlays: ['chirtsera5maxAfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5maxAfricaAnomalyPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5maxAfricaZscorePentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5tmax_global_1_monthly_mean'],
    },
    overlays: ['chirtsera5maxAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5maxAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5maxAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTS-ERA5 Tmin Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5tmin_global_pentad_mean'],
    },
    overlays: ['chirtsra5minAfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5minAfricaAnomalyPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5minAfricaZscorePentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5tmin_global_1_monthly_mean'],
    },
    overlays: ['chirtsra5minAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5minAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5minAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // VPD ERA5 Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['era5_vpd_global_pentad_mean'],
    },
    overlays: ['era5vpdAfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['era5vpdAfricaAnomalyPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['era5vpdAfricaZscorePentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['era5_vpd_global_1_monthly_mean'],
    },
    overlays: ['era5vpdAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['era5vpdAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['era5vpdAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTS-ERA5 HI Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5hi_global_pentad_mean'],
    },
    overlays: ['chirtsera5hiAfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5hiAfricaAnomalyPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5hiAfricaZscorePentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5hi_global_1_monthly_mean'],
    },
    overlays: ['chirtsera5hiAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5hiAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5hiAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // GPCC Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['gpcc_global_1_monthly_mean'],
    },
    overlays: ['gpccAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'gpcc_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'gpcc_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'gpcc_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['gpccAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'gpcc_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'gpcc_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'gpcc_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['gpccAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'gpcc_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'gpcc_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'gpcc_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // WBGT Beta Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['wbgt_global_pentad_mean'],
    },
    overlays: ['wbgtAfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['wbgtAfricaAnomPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['wbgtAfricaZscorePentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['wbgt_global_dekad_mean'],
    },
    overlays: ['wbgtAfricaDataDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['wbgtAfricaAnomDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['wbgtAfricaZscoreDekadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['wbgt_global_1_monthly_mean'],
    },
    overlays: ['wbgtAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['wbgtAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['wbgtAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards','LakeVictoriaAdmin0'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards','Lake Victoria Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Africa

  // FLDAS Precip Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprecipitationAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprecipitationAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS AIR TEMP Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasairtempAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasairtempAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Evaporation Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasevaporationAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasevaporationAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Snow Water Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldassnowwatereqAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldassnowwatereqAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Runoff Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasrunoffAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasrunoffAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Soil Moisture 10cm Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldassoilm10AfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldassoilm10AfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Soil Moisture 100cm Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldassoilm100AfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldassoilm100AfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Precip Prelim Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimprecipitationAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimprecipitationAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Air Temp Prelim Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimairtempAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimairtempAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Evaportation Prelim Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimevaporationAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimevaporationAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Snow Water Prelim Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimsnowwatereqAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimsnowwatereqAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Runoff Prelim Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimrunoffAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimrunoffAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Soil Moisture 10mm Prelim Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimsoilm10AfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimsoilm10AfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Soil Moisture 100mm Prelim Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimsoilm100AfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimsoilm100AfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIMES-Beta Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chimes-beta_global_pentad_mean'],
    },
    overlays: ['chimesbetaAfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimesbetaAfricaAnomalyPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimesbetaAfricaZscorePentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chimes-beta_global_1_monthly_mean'],
    },
    overlays: ['chimesbetaAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimesbetaAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimesbetaAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIME v07 Beta Africa
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chime-v07-beta_global_pentad_mean'],
    },
    overlays: ['chimev07betaAfricaDataPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimev07betaAfricaAnomalyPentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimev07betaAfricaZscorePentadal'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chime-v07-beta_global_1_monthly_mean'],
    },
    overlays: ['chimev07betaAfricaData1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimev07betaAfricaAnomaly1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimev07betaAfricaZscore1Monthly'],
    boundaries: ['africaAdmin1','africaAdmin2','africaCropzones','kenyaWards'],
    boundaryLabels: ['Admin1','Admin2','Crop Zones','Kenya Wards'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRP v2 Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpCamcarDataPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpCamcarAnomalyPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpCamcarZscorePentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpCamcarDataDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpCamcarAnomalyDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpCamcarZscoreDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpCamcarData2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpCamcarAnomaly2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpCamcarZscore2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpCamcarData3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpCamcarAnomaly3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpCamcarZscore3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // Persiann-CCS Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['persiann-ccs_global_1_monthly_mean'],
    },
    overlays: ['persiann-ccsCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'persiann-ccs_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'persiann-ccs_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'persiann-ccs_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['persiann-ccsCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'persiann-ccs_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'persiann-ccs_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'persiann-ccs_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['persiann-ccsCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'persiann-ccs_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'persiann-ccs_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'persiann-ccs_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // Hobbins RefET Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['hobbins_refet_global_dekad_mean'],
    },
    overlays: ['hobbinsrefetCamcarDataDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['hobbinsrefetCamcarAnomalyDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['hobbinsrefetCamcarZscoreDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['hobbins_refet_global_1_monthly_mean'],
    },
    overlays: ['hobbinsrefetCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['hobbinsrefetCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['hobbinsrefetCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

   // CHIRPv 3.0 Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_pentad_mean'],
    },
    overlays: ['chirpv3p0CamcarDataPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0CamcarAnomalyPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_dekad_mean'],
    },
    overlays: ['chirpv3p0CamcarDataDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0CamcarAnomalyDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_1_monthly_mean'],
    },
    overlays: ['chirpv3p0CamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0CamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_2_monthly_mean'],
    },
    overlays: ['chirpv3p0CamcarData2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0CamcarAnomaly2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_3_monthly_mean'],
    },
    overlays: ['chirpv3p0CamcarData3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0CamcarAnomaly3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRPS v3.0 Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_pentad_mean'],
    },
    overlays: ['chirpsv3CamcarDataPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_dekad_mean'],
    },
    overlays: ['chirpsv3CamcarDataDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsv3CamcarAnomalyDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_1_monthly_mean'],
    },
    overlays: ['chirpsv3CamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsv3CamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_2_monthly_mean'],
    },
    overlays: ['chirpsv3CamcarData2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsv3CamcarAnomaly2Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_3_monthly_mean'],
    },
    overlays: ['chirpsv3CamcarData3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsv3CamcarAnomaly3Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTSmax Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtsmax_global_1_monthly_mean'],
    },
    overlays: ['chirtsmaxCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsmaxCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsmaxCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTmax Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtmax_global_1_monthly_mean'],
    },
    overlays: ['chirtmaxCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtmaxCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtmaxCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTSvpd Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtsvpd_global_pentad_mean'],
    },
    overlays: ['chirtsvpdGlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsvpdGlobalAnomalyPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsvpdGlobalZscorePentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtsvpd_global_1_monthly_mean'],
    },
    overlays: ['chirtsvpdGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsvpdGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsvpdGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTSwbgt Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtswbgt_global_pentad_mean'],
    },
    overlays: ['chirtswbgtCamcarDataPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtswbgt_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtswbgt_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtswbgt_global_1_monthly_mean'],
    },
    overlays: ['chirtswbgtCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtswbgt_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtswbgt_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtswbgtCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtswbgt_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtswbgt_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTShi Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtshi_global_pentad_mean'],
    },
    overlays: ['chirtshiCamcarDataPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtshi_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtshi_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtshi_global_1_monthly_mean'],
    },
    overlays: ['chirtshiCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtshi_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtshi_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtshiCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtshi_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtshi_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTS-ERA5 Tmax Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5tmax_global_pentad_mean'],
    },
    overlays: ['chirtsera5maxCamcarDataPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5maxCamcarAnomalyPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5maxCamcarZscorePentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5tmax_global_1_monthly_mean'],
    },
    overlays: ['chirtsera5maxCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5maxCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5maxCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTS-ERA5 Tmin Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-ear5tmin_global_pentad_mean'],
    },
    overlays: ['chirtsra5minCamcarDataPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5minCamcarAnomalyPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5minCamcarZscorePentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5tmin_global_1_monthly_mean'],
    },
    overlays: ['chirtsra5minCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5minCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5minCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // WBGT Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['wbgt_global_pentad_mean'],
    },
    overlays: ['wbgtCamcarDataPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['wbgt_global_dekad_mean'],
    },
    overlays: ['wbgtCamcarDataDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['wbgtCamcarAnomalyDekadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['wbgt_global_1_monthly_mean'],
    },
    overlays: ['wbgtCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['wbgtCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

    // VPD ERA5 Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['era5_vpd_global_pentad_mean'],
    },
    overlays: ['era5vpdCamcarDataPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['era5vpdCamcarAnomalyPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['era5vpdCamcarZscorePentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['era5_vpd_global_1_monthly_mean'],
    },
    overlays: ['era5vpdCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['era5vpdCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['era5vpdCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTS-ERA5 HI Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5hi_global_pentad_mean'],
    },
    overlays: ['chirtsera5hiCamcarDataPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5hiCamcarAnomalyPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5hiCamcarZscorePentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5hi_global_1_monthly_mean'],
    },
    overlays: ['chirtsera5hiCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5hiCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5hiCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // GPCC Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['gpcc_global_1_monthly_mean'],
    },
    overlays: ['gpccCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'gpcc_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'gpcc_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'gpcc_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['gpccCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'gpcc_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'gpcc_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'gpcc_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['gpccCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'gpcc_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'gpcc_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'gpcc_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Central America

  // FLDAS Precip Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprecipitationCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprecipitationCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS AIR TEMP Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasairtempCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasairtempCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Evaporation Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasevaporationCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasevaporationCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Snow Water Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldassnowwatereqCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldassnowwatereqCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Runoff Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasrunoffCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasrunoffCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Soil Moisture 10cm Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldassoilm10CamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldassoilm10CamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Soil Moisture 100cm Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldassoilm100CamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldassoilm100CamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Precip Prelim Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimprecipitationCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimprecipitationCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Air Temp Prelim Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimairtempCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimairtempCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Evaportation Prelim Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimevaporationCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimevaporationCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Snow Water Prelim Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimsnowwatereqCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimsnowwatereqCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Runoff Prelim Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimrunoffCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimrunoffCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Soil Moisture 10mm Prelim Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimsoilm10CamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimsoilm10CamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Soil Moisture 100mm Prelim Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimsoilm100CamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimsoilm100CamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  //  CHIMES-Beta Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chimes-beta_global_pentad_mean'],
    },
    overlays: ['chimesbetaCamcarDataPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimesbetaCamcarAnomalyPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimesbetaCamcarZscorePentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chimes-beta_global_1_monthly_mean'],
    },
    overlays: ['chimesbetaCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimesbetaCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimesbetaCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  //  CHIME v07 Beta Central America
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chime-v07-beta_global_pentad_mean'],
    },
    overlays: ['chimev07betaCamcarDataPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimev07betaCamcarAnomalyPentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimev07betaCamcarZscorePentadal'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chime-v07-beta_global_1_monthly_mean'],
    },
    overlays: ['chimev07betaCamcarData1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimev07betaCamcarAnomaly1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimev07betaCamcarZscore1Monthly'],
    boundaries: ['camcarAdmin0','camcarAdmin1','camcarAdmin2'],
    boundaryLabels: ['Countries','Admin 1','Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRPS Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps_global_dekad_mean'],
    },
    overlays: ['chirpsGlobalDataDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsGlobalAnomalyDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsGlobalZscoreDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps_global_1_monthly_mean'],
    },
    overlays: ['chirpsGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps_global_2_monthly_mean'],
    },
    overlays: ['chirpsGlobalData2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsGlobalAnomaly2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsGlobalZscore2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps_global_3_monthly_mean'],
    },
    overlays: ['chirpsGlobalData3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsGlobalAnomaly3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsGlobalZscore3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirps_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirps_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRP v2 Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpGlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpGlobalAnomalyPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpGlobalZscorePentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpGlobalDataDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpGlobalAnomalyDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpGlobalZscoreDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpGlobalData2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpGlobalAnomaly2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpGlobalZscore2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['chirpGlobalData3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpGlobalAnomaly3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpGlobalZscore3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirp_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirp_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirp_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // LST Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lst006_global_dekad_mean'],
    },
    overlays: ['lst006GlobalDataDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006GlobalAnomalyDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006GlobalZscoreDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lst006_global_1_monthly_mean'],
    },
    overlays: ['lst006GlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006GlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006GlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lst006_global_2_monthly_mean'],
    },
    overlays: ['lst006GlobalData2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006GlobalAnomaly2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006GlobalZscore2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_2_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lst006_global_3_monthly_mean'],
    },
    overlays: ['lst006GlobalData3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006GlobalAnomaly3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['lst006GlobalZscore3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'lst006_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lst006_global_3_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },


  // Persiann-CCS Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['persiann-ccs_global_1_montly_mean'],
    },
    overlays: ['persiann-ccsGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'persiann-ccs_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'persiann-ccs_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'persiann-ccs_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['persiann-ccsGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'persiann-ccs_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'persiann-ccs_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'persiann-ccs_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['persiann-ccsGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'persiann-ccs_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'persiann-ccs_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'persiann-ccs_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // Hobbins RefET Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['hobbins_refet_global_dekad_mean'],
    },
    overlays: ['hobbinsrefetGlobalDataDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['hobbinsrefetGlobalAnomalyDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['hobbinsrefetGlobalZscoreDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_dekad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['hobbins_refet_global_1_monthly_mean'],
    },
    overlays: ['hobbinsrefetGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['hobbinsrefetGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['hobbinsrefetGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'hobbins_refet_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'hobbins_refet_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'hobbins_refet_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRPv3.0 Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_pentad_mean'],
    },
    overlays: ['chirpv3p0GlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0GlobalAnomalyPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_dekad_mean'],
    },
    overlays: ['chirpv3p0GlobalDataDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0GlobalAnomalyDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_1_monthly_mean'],
    },
    overlays: ['chirpv3p0GlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0GlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_2_monthly_mean'],
    },
    overlays: ['chirpv3p0GlobalData2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0GlobalAnomaly2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpv3p0_global_3_monthly_mean'],
    },
    overlays: ['chirpv3p0GlobalData3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpv3p0GlobalAnomaly3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpv3p0_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpv3p0_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpv3p0_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRPS v3.0 Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_pentad_mean'],
    },
    overlays: ['chirpsv3GlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_dekad_mean'],
    },
    overlays: ['chirpsv3GlobalDataDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsv3GlobalAnomalyDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_1_monthly_mean'],
    },
    overlays: ['chirpsv3GlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsv3GlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_2_monthly_mean'],
    },
    overlays: ['chirpsv3GlobalData2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_2_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsv3GlobalAnomaly2Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_2_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirpsv3_global_3_monthly_mean'],
    },
    overlays: ['chirpsv3GlobalData3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_3_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirpsv3GlobalAnomaly3Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1','gbLakeVictoriaAdmin0','gbTanaRiverBasinAdmin0'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1','Lake Victoria Basin','Tana River Basin'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirpsv3_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirpsv3_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirpsv3_global_3_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTSmax Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtsmax_global_1_montly_mean'],
    },
    overlays: ['chirtsmaxGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsmaxGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsmaxGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTmax Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtmax_global_1_montly_mean'],
    },
    overlays: ['chirtmaxGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtmaxGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtmaxGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTSvpd Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtsvpd_global_pentad_mean'],
    },
    overlays: ['chirtsvpdGlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsvpdGlobalAnomalyPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsvpdGlobalZscorePentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtsvpd_global_1_monthly_mean'],
    },
    overlays: ['chirtsvpdGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsvpdGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsvpdGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtsvpd_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtsvpd_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTSwbgt Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtswbgt_global_pentad_mean'],
    },
    overlays: ['chirtswbgtGlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtswbgt_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtswbgt_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtswbgt_global_1_monthly_mean'],
    },
    overlays: ['chirtswbgtGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtswbgt_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtswbgt_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtswbgtGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtswbgt_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtswbgt_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTShi Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtshi_global_pentad_mean'],
    },
    overlays: ['chirtshiGlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtshi_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtshi_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirtshi_global_1_monthly_mean'],
    },
    overlays: ['chirtshiGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtshi_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtshi_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtshiGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirtshi_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirtshi_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTS-ERA5 Tmax Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5tmax_global_pentad_mean'],
    },
    overlays: ['chirtsera5maxGlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5maxGlobalAnomalyPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5maxGlobalZscorePentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5tmax_global_1_monthly_mean'],
    },
    overlays: ['chirtsera5maxGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5maxGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5maxGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmax_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTS-ERA5 Tmin Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5tmin_global_pentad_mean'],
    },
    overlays: ['chirtsera5minGlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5minGlobalAnomalyPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5minGlobalZscorePentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5tmin_global_1_monthly_mean'],
    },
    overlays: ['chirtsera5minGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5minGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5minGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5tmin_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

    // WBGT Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['wbgt_global_pentad_mean'],
    },
    overlays: ['wbgtGlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['wbgt_global_dekad_mean'],
    },
    overlays: ['wbgtGlobalDataDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['wbgtGlobalAnomalyDekadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_dekad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['wbgt_global_1_monthly_mean'],
    },
    overlays: ['wbgtGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['wbgtGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'wbgt_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'wbgt_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

    // VPD ERA5 Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['era5_vpd_global_pentad_mean'],
    },
    overlays: ['era5vpdGlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['era5vpdGlobalAnomalyPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['era5vpdGlobalZscorePentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['era5_vpd_global_1_monthly_mean'],
    },
    overlays: ['era5vpdGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['era5vpdGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['era5vpdGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'era5_vpd_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'era5_vpd_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRTS-ERA5 HI Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5hi_global_pentad_mean'],
    },
    overlays: ['chirtsera5hiGlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5hiGlobalAnomalyPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5hiGlobalZscorePentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirts-era5hi_global_1_monthly_mean'],
    },
    overlays: ['chirtsera5hiGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5hiGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chirtsera5hiGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chirts-era5hi_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chirts-era5hi_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // GPCC Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['gpcc_global_1_montly_mean'],
    },
    overlays: ['gpccGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'gpcc_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'gpcc_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'gpcc_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['gpccGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'gpcc_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'gpcc_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'gpcc_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['gpccGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'gpcc_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'gpcc_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'gpcc_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Global

  // FLDAS Precip Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprecipitationGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprecipitationGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS AIR TEMP Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasairtempGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasairtempGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Evaporation Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasevaporationGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasevaporationGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Snow Water Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldassnowwatereqGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldassnowwatereqGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Runoff Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasrunoffGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasrunoffGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Soil Moisture 10cm Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldassoilm10GlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldassoilm10GlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Soil Moisture 100cm Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldassoilm100GlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldassoilm100GlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Precip Prelim Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimprecipitationGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimprecipitationGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_precipitation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Air Temp Prelim Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimairtempGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimairtempGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_air_temperature_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Evaportation Prelim Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimevaporationGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimevaporationGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_evaporation_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Snow Water Prelim Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimsnowwatereqGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimsnowwatereqGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_snow_water_equivalent_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Runoff Prelim Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimrunoffGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimrunoffGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_runoff_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Soil Moisture 10mm Prelim Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimsoilm10GlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimsoilm10GlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_soil_moisture_10mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS Soil Moisture 100mm Prelim Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: [],
    },
    overlays: ['fldasprelimsoilm100GlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['fldasprelimsoilm100GlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'fldas_prelim_soil_moisture_100mm_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIMES-Beta Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chimes-beta_global_pentad_mean'],
    },
    overlays: ['chimesbetaGlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimesbetaGlobalAnomalyPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimesbetaGlobalZscorePentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chimes-beta_global_1_monthly_mean'],
    },
    overlays: ['chimesbetaGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimesbetaGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimesbetaGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chimes-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chimes-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chimes-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIME v07 Beta Global
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chime-v07-beta_global_pentad_mean'],
    },
    overlays: ['chimev07betaGlobalDataPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimev07betaGlobalAnomalyPentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_pentad_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimev07betaGlobalZscorePentadal'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_pentad_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chime-v07-beta_global_1_monthly_mean'],
    },
    overlays: ['chimev07betaGlobalData1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_1_monthly_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimev07betaGlobalAnomaly1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_1_monthly_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://chc-ewx3.chc.ucsb.edu/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
    },
    overlays: ['chimev07betaGlobalZscore1Monthly'],
    boundaries: ['gbafricaAdmin1','gbafricaAdmin2','gbafricaCropzones','gbcamcarAdmin0','gbcamcarAdmin1','gbcamcarAdmin2','afghanAdmin1','afghanAdmin2','colombiaAdmin1','colombiaAdmin2','usAdmin1','usAdmin2','venezuelaAdmin1','venezuelaAdmin2','yemenAdmin1'],
    boundaryLabels: ['Africa Admin 1','Africa Admin 2','African Crop Zones', 'Central America and Caribbean Countries','Central America and Caribbean Admin 1','Central America and Caribbean Admin 2','Afghanistan Admin 1','Afghanistan Admin 2','Colombia Admin 1','Colombia Admin 2','United States of America Admin 1','United States of America Admin 2','Venezuela Admin 1','Venezuela Admin 2','Yemen Admin 1'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'chime-v07-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'chime-v07-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chime-v07-beta_global_1_monthly_zscore.data',
        yAxisRange: 'auto',
      },
    ],
  },

]
