/**
 * The difference between EWX and EWX_Lite chart configs:
 * - EWX_Lite doesn't need CHIRPS Prelim.
 * - EWX_Lite doesn't need monthly products, only pentad and dekad. (With the exception of CHIRPS).
 * - EWX_Lite doesn't need anom or z-score products.
 * Note: Cumulative chart types are only for CHIRPS/RFE2 data and anom datasets
 */
export const charts = [
  /**
   * Africa
   */
  // CHIRPS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_pentad_mean'],
      normalizer: 'normalizeGefsData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'africaChirpsPentadalData',
        timeseriesSourceLayerIds: ['africaChirpsPentadalData'],
      },
      {
        type: 'gefs',
        forLayerId: 'africaChirpsPentadalPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'africaChirpsPentadalData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['africaChirpsPentadalPrelimData'],
      },
    ],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'africaChirpsMonthData',
        timeseriesSourceLayerIds: ['africaChirpsMonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'africaChirpsMonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'africaChirpsMonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['africaChirpsMonthPrelimData'],
      },
    ],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_2month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'africaChirps2MonthData',
        timeseriesSourceLayerIds: ['africaChirps2MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'africaChirps2MonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'africaChirps2MonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['africaChirps2MonthPrelimData'],
      },
    ],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_3month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'africaChirps3MonthData',
        timeseriesSourceLayerIds: ['africaChirps3MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'africaChirps3MonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'africaChirps3MonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['africaChirps3MonthPrelimData'],
      },
    ],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // RFE
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['rfe2-2000-2018_africa_dekad_mean'],
    },
    overlays: ['africaRfeDekadalData'],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
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

  // LST_C6
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lstc6-2002-2018_global_dekad_mean'],
    },
    overlays: ['africaLstC6DekadalData'],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'lstc6_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lstc6_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // NDVI_C6
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['emodisndvic6v2-2003-2017_africa_dekad_median'],
      normalizer: 'normalizeG5Data',
    },
    overlays: ['africaNdvic6DekadalData'],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'emodisndvic6v2_africa_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'emodisndvic6v2_africa_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // EVIIRS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['eviirsndvi-2012-2021_africa_pentad_mean'],
      normalizer: 'normalizeNDVI10DayCompositeData',
    },
    overlays: ['eviirsndvi_africa_pentad_data'],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'eviirsndvi_africa_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'eviirsndvi_africa_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // ETA
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['etav5-2003-2017_global_dekad_median'],
    },
    overlays: ['africaEtaDekadalData'],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['fldas-runoff-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'africaFldasMonthData',
        timeseriesSourceLayerIds: ['africaFldasMonthData'],
      },
      {
        type: 'single',
        forLayerId: 'africaPrelimFldasMonthData',
        impersonate: 'africaFldasMonthData',
        timeseriesSourceLayerIds: ['africaPrelimFldasMonthData'],
      },
    ],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['fldas-runoff-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'africaFldasMonthData',
        timeseriesSourceLayerIds: ['africaFldasMonthData'],
      },
      {
        type: 'single',
        forLayerId: 'africaPrelimFldasMonthData',
        impersonate: 'africaFldasMonthData',
        timeseriesSourceLayerIds: ['africaPrelimFldasMonthData'],
      },
    ],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // Soil Moisture
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['soilmoisture-0-10cm-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'africaSoilMoisture10cmMonthlyData',
        timeseriesSourceLayerIds: ['africaSoilMoisture10cmMonthlyData'],
      },
      {
        type: 'single',
        forLayerId: 'africaSoilMoisturePrelim10cmMonthlyData',
        impersonate: 'africaSoilMoisture10cmMonthlyData',
        timeseriesSourceLayerIds: ['africaSoilMoisturePrelim10cmMonthlyData'],
      },
    ],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'soilmoisture-0-10cm_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'soilmoisture-0-10cm_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['soilmoisture-0-100cm-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'africaSoilMoisture100cmMonthlyData',
        timeseriesSourceLayerIds: ['africaSoilMoisture100cmMonthlyData'],
      },
      {
        type: 'single',
        forLayerId: 'africaSoilMoisturePrelim100cmMonthlyData',
        impersonate: 'africaSoilMoisture100cmMonthlyData',
        timeseriesSourceLayerIds: ['africaSoilMoisturePrelim100cmMonthlyData'],
      },
    ],
    boundaries: ['africaAdmin1', 'africaAdmin2', 'africaCropzones', 'africaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'soilmoisture-0-100cm_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'soilmoisture-0-100cm_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  /**
   * Central America & Caribbean
   */
  // CHIRPS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_pentad_mean'],
      normalizer: 'normalizeGefsData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'camcarChirpsPentadalData',
        timeseriesSourceLayerIds: ['camcarChirpsPentadalData'],
      },
      {
        type: 'gefs',
        forLayerId: 'camcarChirpsPentadalPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'camcarChirpsPentadalData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['camcarChirpsPentadalPrelimData'],
      },
    ],
    boundaries: ['camcarAdmin1', 'camcarAdmin2', 'camcarCropzonesLoadOnly', 'camcarFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'camcarChirpsMonthData',
        timeseriesSourceLayerIds: ['camcarChirpsMonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'camcarChirpsMonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'camcarChirpsMonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['camcarChirpsMonthPrelimData'],
      },
    ],
    boundaries: ['camcarAdmin1', 'camcarAdmin2', 'camcarCropzonesLoadOnly', 'camcarFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_2month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'camcarChirps2MonthData',
        timeseriesSourceLayerIds: ['camcarChirps2MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'camcarChirps2MonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'camcarChirps2MonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['camcarChirps2MonthPrelimData'],
      },
    ],
    boundaries: ['camcarAdmin1', 'camcarAdmin2', 'camcarCropzonesLoadOnly', 'camcarFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_3month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'camcarChirps3MonthData',
        timeseriesSourceLayerIds: ['camcarChirps3MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'camcarChirps3MonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'camcarChirps3MonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['camcarChirps3MonthPrelimData'],
      },
    ],
    boundaries: ['camcarAdmin1', 'camcarAdmin2', 'camcarCropzonesLoadOnly', 'camcarFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // LST_C6
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lstc6-2002-2018_global_dekad_mean'],
    },
    overlays: ['camcarLstC6DekadalData'],
    boundaries: ['camcarAdmin1', 'camcarAdmin2', 'camcarCropzonesLoadOnly', 'camcarFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'lstc6_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lstc6_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // NDVI_C6
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['emodisndvic6v2-2003-2017_camcar_dekad_median'],
      normalizer: 'normalizeG5Data',
    },
    overlays: ['camcarNdvic6DekadalData'],
    boundaries: ['camcarAdmin1', 'camcarAdmin2', 'camcarCropzonesLoadOnly', 'camcarFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'emodisndvic6v2_camcar_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'emodisndvic6v2_camcar_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // EVIIRS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['eviirsndvi-2012-2021_camcar_pentad_mean'],
      normalizer: 'normalizeNDVI10DayCompositeData',
    },
    overlays: ['eviirsndvi_camcar_pentad_data'],
    boundaries: ['camcarAdmin1', 'camcarAdmin2', 'camcarCropzonesLoadOnly', 'camcarFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'eviirsndvi_camcar_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'eviirsndvi_camcar_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // ETA
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['etav5-2003-2017_global_dekad_median'],
    },
    overlays: ['camcarEtaDekadalData'],
    boundaries: ['camcarAdmin1', 'camcarAdmin2', 'camcarCropzonesLoadOnly', 'camcarFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['fldas-runoff-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'camcarFldasMonthData',
        timeseriesSourceLayerIds: ['camcarFldasMonthData'],
      },
      {
        type: 'single',
        forLayerId: 'camcarPrelimFldasMonthData',
        impersonate: 'camcarFldasMonthData',
        timeseriesSourceLayerIds: ['camcarPrelimFldasMonthData'],
      },
    ],
    boundaries: ['camcarAdmin1', 'camcarAdmin2', 'camcarCropzones', 'camcarFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['fldas-runoff-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'camcarFldasMonthData',
        timeseriesSourceLayerIds: ['camcarFldasMonthData'],
      },
      {
        type: 'single',
        forLayerId: 'camcarPrelimFldasMonthData',
        impersonate: 'camcarFldasMonthData',
        timeseriesSourceLayerIds: ['camcarPrelimFldasMonthData'],
      },
    ],
    boundaries: ['camcarAdmin1', 'camcarAdmin2', 'camcarCropzones', 'camcarFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // Soil Moisture
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['soilmoisture-0-10cm-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'camcarSoilMoisture10cmMonthlyData',
        timeseriesSourceLayerIds: ['camcarSoilMoisture10cmMonthlyData'],
      },
      {
        type: 'single',
        forLayerId: 'camcarSoilMoisturePrelim10cmMonthlyData',
        impersonate: 'camcarSoilMoisture10cmMonthlyData',
        timeseriesSourceLayerIds: ['camcarSoilMoisturePrelim10cmMonthlyData'],
      },
    ],
    boundaries: ['camcarAdmin1', 'camcarAdmin2', 'camcarCropzonesLoadOnly', 'camcarFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'soilmoisture-0-10cm_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'soilmoisture-0-10cm_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['soilmoisture-0-100cm-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'camcarSoilMoisture100cmMonthlyData',
        timeseriesSourceLayerIds: ['camcarSoilMoisture100cmMonthlyData'],
      },
      {
        type: 'single',
        forLayerId: 'camcarSoilMoisturePrelim100cmMonthlyData',
        impersonate: 'camcarSoilMoisture100cmMonthlyData',
        timeseriesSourceLayerIds: ['camcarSoilMoisturePrelim100cmMonthlyData'],
      },
    ],
    boundaries: ['camcarAdmin1', 'camcarAdmin2', 'camcarCropzonesLoadOnly', 'camcarFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'soilmoisture-0-100cm_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'soilmoisture-0-100cm_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  /**
   * Central Asia
   */
  // CHIRPS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_pentad_mean'],
      normalizer: 'normalizeGefsData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'casiaChirpsPentadalData',
        timeseriesSourceLayerIds: ['casiaChirpsPentadalData'],
      },
      {
        type: 'gefs',
        forLayerId: 'casiaChirpsPentadalPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'casiaChirpsPentadalData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['casiaChirpsPentadalPrelimData'],
      },
    ],
    boundaries: ['casiaAdmin1', 'casiaAdmin2', 'casiaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'casiaChirpsMonthData',
        timeseriesSourceLayerIds: ['casiaChirpsMonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'casiaChirpsMonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'casiaChirpsMonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['casiaChirpsMonthPrelimData'],
      },
    ],
    boundaries: ['casiaAdmin1', 'casiaAdmin2', 'casiaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_2month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'casiaChirps2MonthData',
        timeseriesSourceLayerIds: ['casiaChirps2MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'casiaChirps2MonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'casiaChirps2MonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['casiaChirps2MonthPrelimData'],
      },
    ],
    boundaries: ['casiaAdmin1', 'casiaAdmin2', 'casiaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_3month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'casiaChirps3MonthData',
        timeseriesSourceLayerIds: ['casiaChirps3MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'casiaChirps3MonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'casiaChirps3MonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['casiaChirps3MonthPrelimData'],
      },
    ],
    boundaries: ['casiaAdmin1', 'casiaAdmin2', 'casiaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // CHIRPS charts for Afghan Basins
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_pentad_mean'],
      normalizer: 'normalizeGefsData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'casiaChirpsPentadalData',
        timeseriesSourceLayerIds: ['casiaChirpsPentadalData'],
      },
      {
        type: 'gefs',
        forLayerId: 'casiaChirpsPentadalPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'casiaChirpsPentadalData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['casiaChirpsPentadalPrelimData'],
      },
    ],
    boundaries: ['afghanBasins'],
    boundaryLabels: ['Basins'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'casiaChirpsMonthData',
        timeseriesSourceLayerIds: ['casiaChirpsMonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'casiaChirpsMonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'casiaChirpsMonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['casiaChirpsMonthPrelimData'],
      },
    ],
    boundaries: ['afghanBasins'],
    boundaryLabels: ['Basins'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_2month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'casiaChirps2MonthData',
        timeseriesSourceLayerIds: ['casiaChirps2MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'casiaChirps2MonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'casiaChirps2MonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['casiaChirps2MonthPrelimData'],
      },
    ],
    boundaries: ['afghanBasins'],
    boundaryLabels: ['Basins'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_3month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'casiaChirps3MonthData',
        timeseriesSourceLayerIds: ['casiaChirps3MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'casiaChirps3MonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'casiaChirps3MonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['casiaChirps3MonthPrelimData'],
      },
    ],
    boundaries: ['afghanBasins'],
    boundaryLabels: ['Basins'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // LST_C6
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lstc6-2002-2018_global_dekad_mean'],
    },
    overlays: ['casiaLstC6DekadalData'],
    boundaries: ['casiaAdmin1', 'casiaAdmin2', 'casiaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'lstc6_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lstc6_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // NDVI_C6
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['emodisndvic6v2-2003-2017_asia_dekad_median'],
      normalizer: 'normalizeG5Data',
    },
    overlays: ['casiaNdvic6DekadalData'],
    boundaries: ['casiaAdmin1', 'casiaAdmin2', 'casiaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'emodisndvic6v2_asia_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'emodisndvic6v2_asia_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['emodisndvic6v2-2003-2017_asia_dekad_median'],
      normalizer: 'normalizeG5Data',
    },
    overlays: ['casiaNdvic6DekadalData'],
    boundaries: ['casiaAfghanIr'],
    geoengineBoundaryNames: ['fews_shapefile_afghan_ir1000:shapefile_afghan_ir1000'],
    boundaryLabels: ['Afghanistan Irrigated'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'emodisndvic6v2_asia_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'interannual',
        dataRoot: 'emodisndvic6v2_asia_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['emodisndvic6v2-2003-2017_asia_dekad_median'],
      normalizer: 'normalizeG5Data',
    },
    overlays: ['casiaNdvic6DekadalData'],
    boundaries: ['casiaAfghanRf'],
    geoengineBoundaryNames: ['fews_shapefile_afghan_rf1000:shapefile_afghan_rf1000'],
    boundaryLabels: ['Afghanistan Rainfed'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'emodisndvic6v2_asia_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'emodisndvic6v2_asia_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['emodisndvic6v2-2003-2017_asia_dekad_median'],
      normalizer: 'normalizeG5Data',
    },
    overlays: ['casiaNdvic6DekadalData'],
    boundaries: ['casiaAfghanRg'],
    geoengineBoundaryNames: ['fews_shapefile_afghan_rg1000:shapefile_afghan_rg1000'],
    boundaryLabels: ['Afghanistan Rangeland'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'emodisndvic6v2_asia_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'interannual',
        dataRoot: 'emodisndvic6v2_asia_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // EVIIRS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['eviirsndvi-2012-2021_asia_pentad_mean'],
      normalizer: 'normalizeNDVI10DayCompositeData',
    },
    overlays: ['eviirsndvi_asia_pentad_data'],
    boundaries: ['casiaAdmin1', 'casiaAdmin2', 'casiaCropzones', 'casiaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'eviirsndvi_asia_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'eviirsndvi_asia_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['eviirsndvi-2012-2021_asia_pentad_mean'],
      normalizer: 'normalizeNDVI10DayCompositeData',
    },
    overlays: ['eviirsndvi_asia_pentad_data'],
    boundaries: ['casiaAfghanIr'],
    geoengineBoundaryNames: ['fews_shapefile_afghan_ir1000:shapefile_afghan_ir1000'],
    boundaryLabels: ['Afghanistan Irrigated'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'eviirsndvi_asia_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'interannual',
        dataRoot: 'eviirsndvi_asia_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['eviirsndvi-2012-2021_asia_pentad_mean'],
      normalizer: 'normalizeNDVI10DayCompositeData',
    },
    overlays: ['eviirsndvi_asia_pentad_data'],
    boundaries: ['casiaAfghanRf'],
    geoengineBoundaryNames: ['fews_shapefile_afghan_rf1000:shapefile_afghan_rf1000'],
    boundaryLabels: ['Afghanistan Rainfed'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'eviirsndvi_asia_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'eviirsndvi_asia_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['eviirsndvi-2012-2021_asia_pentad_mean'],
      normalizer: 'normalizeNDVI10DayCompositeData',
    },
    overlays: ['eviirsndvi_asia_pentad_data'],
    boundaries: ['casiaAfghanRg'],
    geoengineBoundaryNames: ['fews_shapefile_afghan_rg1000:shapefile_afghan_rg1000'],
    boundaryLabels: ['Afghanistan Rangeland'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'eviirsndvi_asia_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'interannual',
        dataRoot: 'eviirsndvi_asia_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // SWE
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/sum/mean-median/false',
      type: 'json',
      normalizer: 'normalizeSnowData',
    },
    overlays: ['afghanbasinsSWEDailyData'],
    boundaries: ['afghanBasins', 'casiaAfghanDam'],
    boundaryLabels: ['Basins', 'Dams'],
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'minmax',
        dataRoot: 'swe_asia_day_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/sum/mean-median/false',
      type: 'json',
      normalizer: 'normalizeSnowData',
    },
    overlays: ['afghanbasinsSWEDailyData'],
    boundaries: ['casiaPakistanBasins'],
    boundaryLabels: ['Pakistan Basins'],
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'minmax',
        dataRoot: 'swe_asia_day_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/sum/mean-median/false',
      type: 'json',
      normalizer: 'normalizeSnowData',
    },
    overlays: ['afghanbasinsSWEDailyData'],
    boundaries: ['casiaTajikistanBasins'],
    boundaryLabels: ['Tajikistan Basins'],
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'minmax',
        dataRoot: 'swe_asia_day_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/sum/mean-median/false',
      type: 'json',
      normalizer: 'normalizeSnowData',
    },
    overlays: ['afghanbasinsSWEDailyAnomaly'],
    boundaries: ['afghanBasins', 'casiaAfghanDam'],
    boundaryLabels: ['Basins', 'Dams'],
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'minmax_anomaly',
        dataRoot: 'swe_asia_day_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/sum/mean-median/false',
      type: 'json',
      normalizer: 'normalizeSnowData',
    },
    overlays: ['afghanbasinsSWEDailyAnomaly'],
    boundaries: ['casiaPakistanBasins'],
    boundaryLabels: ['Pakistan Basins'],
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'minmax_anomaly',
        dataRoot: 'swe_asia_day_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/sum/mean-median/false',
      type: 'json',
      normalizer: 'normalizeSnowData',
    },
    overlays: ['afghanbasinsSWEDailyAnomaly'],
    boundaries: ['casiaTajikistanBasins'],
    boundaryLabels: ['Tajikistan Basins'],
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'minmax_anomaly',
        dataRoot: 'swe_asia_day_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // ETA
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['etav5-2003-2017_global_dekad_median'],
    },
    overlays: ['casiaEtaDekadalData'],
    boundaries: ['casiaAdmin1', 'casiaAdmin2', 'casiaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['fldas-runoff-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'casiaFldasMonthData',
        timeseriesSourceLayerIds: ['casiaFldasMonthData'],
      },
      {
        type: 'single',
        forLayerId: 'casiaPrelimFldasMonthData',
        impersonate: 'casiaFldasMonthData',
        timeseriesSourceLayerIds: ['casiaPrelimFldasMonthData'],
      },
    ],
    boundaries: ['casiaAdmin1', 'casiaAdmin2', 'casiaCropzones', 'casiaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['fldas-runoff-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'casiaFldasMonthData',
        timeseriesSourceLayerIds: ['casiaFldasMonthData'],
      },
      {
        type: 'single',
        forLayerId: 'casiaPrelimFldasMonthData',
        impersonate: 'casiaFldasMonthData',
        timeseriesSourceLayerIds: ['casiaPrelimFldasMonthData'],
      },
    ],
    boundaries: ['casiaAdmin1', 'casiaAdmin2', 'casiaCropzones', 'casiaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // Soil Moisture
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['soilmoisture-0-10cm-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'casiaSoilMoisture10cmMonthlyData',
        timeseriesSourceLayerIds: ['casiaSoilMoisture10cmMonthlyData'],
      },
      {
        type: 'single',
        forLayerId: 'casiaSoilMoisturePrelim10cmMonthlyData',
        impersonate: 'casiaSoilMoisture10cmMonthlyData',
        timeseriesSourceLayerIds: ['casiaSoilMoisturePrelim10cmMonthlyData'],
      },
    ],
    boundaries: ['casiaAdmin1', 'casiaAdmin2', 'casiaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'soilmoisture-0-10cm_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'soilmoisture-0-10cm_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['soilmoisture-0-100cm-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'casiaSoilMoisture100cmMonthlyData',
        timeseriesSourceLayerIds: ['casiaSoilMoisture100cmMonthlyData'],
      },
      {
        type: 'single',
        forLayerId: 'casiaSoilMoisturePrelim100cmMonthlyData',
        impersonate: 'casiaSoilMoisture100cmMonthlyData',
        timeseriesSourceLayerIds: ['casiaSoilMoisturePrelim100cmMonthlyData'],
      },
    ],
    boundaries: ['casiaAdmin1', 'casiaAdmin2', 'casiaFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'soilmoisture-0-100cm_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'soilmoisture-0-100cm_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  /**
   * Middle East
   */
  // CHIRPS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_pentad_mean'],
      normalizer: 'normalizeGefsData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'meChirpsPentadalData',
        timeseriesSourceLayerIds: ['meChirpsPentadalData'],
      },
      {
        type: 'gefs',
        forLayerId: 'meChirpsPentadalPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'meChirpsPentadalData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['meChirpsPentadalPrelimData'],
      },
    ],
    boundaries: ['meAdmin1', 'yemenCropzones', 'meFNMU'],
    boundaryLabels: ['Admin 1', 'Yemen Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'meChirpsMonthData',
        timeseriesSourceLayerIds: ['meChirpsMonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'meChirpsMonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'meChirpsMonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['meChirpsMonthPrelimData'],
      },
    ],
    boundaries: ['meAdmin1', 'yemenCropzones', 'meFNMU'],
    boundaryLabels: ['Admin 1', 'Yemen Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_2month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'meChirps2MonthData',
        timeseriesSourceLayerIds: ['meChirps2MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'meChirps2MonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'meChirps2MonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['meChirps2MonthPrelimData'],
      },
    ],
    boundaries: ['meAdmin1', 'yemenCropzones', 'meFNMU'],
    boundaryLabels: ['Admin 1', 'Yemen Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_3month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'meChirps3MonthData',
        timeseriesSourceLayerIds: ['meChirps3MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'meChirps3MonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'meChirps3MonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['meChirps3MonthPrelimData'],
      },
    ],
    boundaries: ['meAdmin1', 'yemenCropzones', 'meFNMU'],
    boundaryLabels: ['Admin 1', 'Yemen Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // LST_C6
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lstc6-2002-2018_global_dekad_mean'],
    },
    overlays: ['meLstC6DekadalData'],
    boundaries: ['meAdmin1', 'yemenCropzones', 'yemenAdmin2', 'meFNMU'],
    boundaryLabels: ['Admin 1', 'Yemen Crop Zones', 'Yemen Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'lstc6_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lstc6_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // NDVI_C6
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['emodisndvic6v2-2003-2017_asia_dekad_median'],
      normalizer: 'normalizeG5Data',
    },
    overlays: ['meNdvic6DekadalData'],
    boundaries: ['meAdmin1', 'yemenCropzones', 'yemenAdmin2', 'meFNMU'],
    boundaryLabels: ['Admin 1', 'Yemen Crop Zones', 'Yemen Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'emodisndvic6v2_asia_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'emodisndvic6v2_asia_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // EVIIRS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['eviirsndvi-2012-2021_centralindopacific_pentad_mean'],
      normalizer: 'normalizeNDVI10DayCompositeData',
    },
    overlays: ['eviirsndvi_centralindopacific_pentad_data'],
    boundaries: ['cipAdmin1', 'cipAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'eviirsndvi_centralindopacific_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'eviirsndvi_centralindopacific_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // SWE
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/sum/mean-median/false',
      type: 'json',
      normalizer: 'normalizeSnowData',
    },
    overlays: ['meSWEDailyData'],
    boundaries: ['meIraqBasins'],
    boundaryLabels: ['Iraq Basins'],
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'minmax',
        dataRoot: 'swe_asia_day_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/sum/mean-median/false',
      type: 'json',
      normalizer: 'normalizeSnowData',
    },
    overlays: ['meSWEDailyData'],
    boundaries: ['meIraqGaugeBasinsKadaheyeh', 'meIraqGaugeBasinsKeban', 'meIraqGaugeBasinsMosul'],
    boundaryLabels: ['Kadaheyeh Gauge Basin', 'Keban Gauge Basin', 'Mosul Gauge Basin'],
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'minmax',
        dataRoot: 'swe_asia_day_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/sum/mean-median/false',
      type: 'json',
      normalizer: 'normalizeSnowData',
    },
    overlays: ['meSWEDailyAnomaly'],
    boundaries: ['meIraqBasins'],
    boundaryLabels: ['Iraq Basins'],
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'minmax_anomaly',
        dataRoot: 'swe_asia_day_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/sum/mean-median/false',
      type: 'json',
      normalizer: 'normalizeSnowData',
    },
    overlays: ['meSWEDailyAnomaly'],
    boundaries: ['meIraqGaugeBasinsKadaheyeh', 'meIraqGaugeBasinsKeban', 'meIraqGaugeBasinsMosul'],
    boundaryLabels: ['Kadaheyeh Gauge Basin', 'Keban Gauge Basin', 'Mosul Gauge Basin'],
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'minmax_anomaly',
        dataRoot: 'swe_asia_day_anom.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // ETA
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['etav5-2003-2017_global_dekad_median'],
    },
    overlays: ['meEtaDekadalData'],
    boundaries: ['meAdmin1', 'meAdmin2', 'yemenCropzones', 'yemenAdmin2', 'meFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['fldas-runoff-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'meFldasMonthData',
        timeseriesSourceLayerIds: ['meFldasMonthData'],
      },
      {
        type: 'single',
        forLayerId: 'mePrelimFldasMonthData',
        impersonate: 'meFldasMonthData',
        timeseriesSourceLayerIds: ['mePrelimFldasMonthData'],
      },
    ],
    boundaries: ['meAdmin1', 'meAdmin2', 'meCropzones', 'meFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['fldas-runoff-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'meFldasMonthData',
        timeseriesSourceLayerIds: ['meFldasMonthData'],
      },
      {
        type: 'single',
        forLayerId: 'mePrelimFldasMonthData',
        impersonate: 'meFldasMonthData',
        timeseriesSourceLayerIds: ['mePrelimFldasMonthData'],
      },
    ],
    boundaries: ['meAdmin1', 'meAdmin2', 'meCropzones', 'meFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // Soil Moisture
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['soilmoisture-0-10cm-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'meSoilMoisture10cmMonthlyData',
        timeseriesSourceLayerIds: ['meSoilMoisture10cmMonthlyData'],
      },
      {
        type: 'single',
        forLayerId: 'meSoilMoisturePrelim10cmMonthlyData',
        impersonate: 'meSoilMoisture10cmMonthlyData',
        timeseriesSourceLayerIds: ['meSoilMoisturePrelim10cmMonthlyData'],
      },
    ],
    boundaries: ['meAdmin1', 'meAdmin2', 'yemenCropzones', 'yemenAdmin2', 'meFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Yemen Crop Zones', 'Yemen Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'soilmoisture-0-10cm_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'soilmoisture-0-10cm_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['soilmoisture-0-100cm-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'meSoilMoisture100cmMonthlyData',
        timeseriesSourceLayerIds: ['meSoilMoisture100cmMonthlyData'],
      },
      {
        type: 'single',
        forLayerId: 'meSoilMoisturePrelim100cmMonthlyData',
        impersonate: 'meSoilMoisture100cmMonthlyData',
        timeseriesSourceLayerIds: ['meSoilMoisturePrelim100cmMonthlyData'],
      },
    ],
    boundaries: ['meAdmin1', 'meAdmin2', 'yemenCropzones', 'yemenAdmin2', 'meFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Yemen Crop Zones', 'Yemen Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'soilmoisture-0-100cm_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'soilmoisture-0-100cm_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  /*
   * South America
   */
  // CHIRPS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_pentad_mean'],
      normalizer: 'normalizeGefsData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'saChirpsPentadalData',
        timeseriesSourceLayerIds: ['saChirpsPentadalData'],
      },
      {
        type: 'gefs',
        forLayerId: 'saChirpsPentadalPrelimData',
        impersonate: 'saChirpsPentadalData',
        timeseriesSourceLayerIds: ['saChirpsPentadalPrelimData'],
      },
    ],
    boundaries: ['saAdmin1', 'saAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'saChirpsMonthData',
        timeseriesSourceLayerIds: ['saChirpsMonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'saChirpsMonthPrelimData',
        impersonate: 'saChirpsMonthData',
        timeseriesSourceLayerIds: ['saChirpsMonthPrelimData'],
      },
    ],
    boundaries: ['saAdmin1', 'saAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_2month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'saChirps2MonthData',
        timeseriesSourceLayerIds: ['saChirps2MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'saChirps2MonthPrelimData',
        impersonate: 'saChirps2MonthData',
        timeseriesSourceLayerIds: ['saChirps2MonthPrelimData'],
      },
    ],
    boundaries: ['saAdmin1', 'saAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_3month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'saChirps3MonthData',
        timeseriesSourceLayerIds: ['saChirps3MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'saChirps3MonthPrelimData',
        impersonate: 'saChirps3MonthData',
        timeseriesSourceLayerIds: ['saChirps3MonthPrelimData'],
      },
    ],
    boundaries: ['saAdmin1', 'saAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // LST_C6
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lstc6-2002-2018_global_dekad_mean'],
    },
    overlays: ['saLstC6DekadalData'],
    boundaries: ['saAdmin1', 'saAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'lstc6_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lstc6_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // NDVI_C6
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['emodisndvic6v2-2003-2017_southamerica_dekad_median'],
      normalizer: 'normalizeG5Data',
    },
    overlays: ['saNdvic6DekadalData'],
    boundaries: ['saAdmin1', 'saAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'emodisndvic6v2_southamerica_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'emodisndvic6v2_southamerica_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // EVIIRS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['eviirsndvi-2012-2021_asia_pentad_mean'],
      normalizer: 'normalizeNDVI10DayCompositeData',
    },
    overlays: ['eviirsndvi_asia_pentad_data'],
    boundaries: ['meAdmin1', 'yemenCropzones', 'yemenAdmin2', 'meFNMU'],
    boundaryLabels: ['Admin 1', 'Yemen Crop Zones', 'Yemen Admin 2', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'eviirsndvi_asia_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'eviirsndvi_asia_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // ETA
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['etav5-2003-2017_global_dekad_median'],
    },
    overlays: ['saEtaDekadalData'],
    boundaries: ['saAdmin1', 'saAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['fldas-runoff-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'saFldasMonthData',
        timeseriesSourceLayerIds: ['saFldasMonthData'],
      },
      {
        type: 'single',
        forLayerId: 'saPrelimFldasMonthData',
        impersonate: 'saFldasMonthData',
        timeseriesSourceLayerIds: ['saPrelimFldasMonthData'],
      },
    ],
    boundaries: ['saAdmin1', 'saAdmin2', 'saCropzones', 'saFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // Soil Moisture
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['soilmoisture-0-10cm-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'saSoilMoisture10cmMonthlyData',
        timeseriesSourceLayerIds: ['saSoilMoisture10cmMonthlyData'],
      },
      {
        type: 'single',
        forLayerId: 'saSoilMoisturePrelim10cmMonthlyData',
        impersonate: 'saSoilMoisture10cmMonthlyData',
        timeseriesSourceLayerIds: ['saSoilMoisturePrelim10cmMonthlyData'],
      },
    ],
    boundaries: ['saAdmin1', 'saAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'soilmoisture-0-10cm_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'soilmoisture-0-10cm_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['soilmoisture-0-100cm-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'saSoilMoisture100cmMonthlyData',
        timeseriesSourceLayerIds: ['saSoilMoisture100cmMonthlyData'],
      },
      {
        type: 'single',
        forLayerId: 'saSoilMoisturePrelim100cmMonthlyData',
        impersonate: 'saSoilMoisture100cmMonthlyData',
        timeseriesSourceLayerIds: ['saSoilMoisturePrelim100cmMonthlyData'],
      },
    ],
    boundaries: ['saAdmin1', 'saAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'soilmoisture-0-100cm_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'soilmoisture-0-100cm_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  /**
   * Central Indo-Pacific
   */
  // CHIRPS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_pentad_mean'],
      normalizer: 'normalizeGefsData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'cipChirpsPentadalData',
        timeseriesSourceLayerIds: ['cipChirpsPentadalData'],
      },
      {
        type: 'gefs',
        forLayerId: 'cipChirpsPentadalPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'cipChirpsPentadalData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['cipChirpsPentadalPrelimData'],
      },
    ],
    boundaries: ['cipAdmin1', 'cipAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative_gefs',
        dataRoot: 'chirps_global_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'cipChirpsMonthData',
        timeseriesSourceLayerIds: ['cipChirpsMonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'cipChirpsMonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'cipChirpsMonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['cipChirpsMonthPrelimData'],
      },
    ],
    boundaries: ['cipAdmin1', 'cipAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_2month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'cipChirps2MonthData',
        timeseriesSourceLayerIds: ['cipChirps2MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'cipChirps2MonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'cipChirps2MonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['cipChirps2MonthPrelimData'],
      },
    ],
    boundaries: ['cipAdmin1', 'cipAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_2month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['chirps-2000-2018_global_3month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'gefs',
        forLayerId: 'cipChirps3MonthData',
        timeseriesSourceLayerIds: ['cipChirps3MonthData'],
      },
      {
        type: 'gefs',
        forLayerId: 'cipChirps3MonthPrelimData',
        // When building the configuration for the chart for this layer, impersonate this layer.
        impersonate: 'cipChirps3MonthData',
        // Determines the 'seasons' -- the years for both layers are combined.
        timeseriesSourceLayerIds: ['cipChirps3MonthPrelimData'],
      },
    ],
    boundaries: ['cipAdmin1', 'cipAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'chirps_global_3month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // LST_C6
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['lstc6-2002-2018_global_dekad_mean'],
    },
    overlays: ['cipLstC6DekadalData'],
    boundaries: ['cipAdmin1', 'cipAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'lstc6_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'lstc6_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // NDVI_C6
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['emodisndvic6v2-2003-2017_centralindopacific_dekad_median'],
      normalizer: 'normalizeG5Data',
    },
    overlays: ['cipNdvic6DekadalData'],
    boundaries: ['cipAdmin1', 'cipAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'emodisndvic6v2_centralindopacific_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'emodisndvic6v2_centralindopacific_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // EVIIRS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['eviirsndvi-2012-2021_southamerica_pentad_mean'],
      normalizer: 'normalizeNDVI10DayCompositeData',
    },
    overlays: ['eviirsndvi_southamerica_pentad_data'],
    boundaries: ['saAdmin1', 'saAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual',
        dataRoot: 'eviirsndvi_southamerica_pentad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'eviirsndvi_southamerica_pentad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // ETA
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['etav5-2003-2017_global_dekad_median'],
    },
    overlays: ['cipEtaDekadalData'],
    boundaries: ['cipAdmin1', 'cipAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['bar', 'line'],
        dataType: 'annual',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_cumulative',
        dataRoot: 'etav5_global_dekad_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // FLDAS
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['fldas-runoff-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'cipFldasMonthData',
        timeseriesSourceLayerIds: ['cipFldasMonthData'],
      },
      {
        type: 'single',
        forLayerId: 'cipPrelimFldasMonthData',
        impersonate: 'cipFldasMonthData',
        timeseriesSourceLayerIds: ['cipPrelimFldasMonthData'],
      },
    ],
    boundaries: ['cipAdmin1', 'cipAdmin2', 'cipCropzones', 'cipFNMU'],
    boundaryLabels: ['Admin 1', 'Admin 2', 'Crop Zones', 'FNMU'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'fldas-runoff_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },

  // Soil Moisture
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['soilmoisture-0-10cm-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'cipSoilMoisture10cmMonthlyData',
        timeseriesSourceLayerIds: ['cipSoilMoisture10cmMonthlyData'],
      },
      {
        type: 'single',
        forLayerId: 'cipSoilMoisturePrelim10cmMonthlyData',
        impersonate: 'cipSoilMoisture10cmMonthlyData',
        timeseriesSourceLayerIds: ['cipSoilMoisturePrelim10cmMonthlyData'],
      },
    ],
    boundaries: ['cipAdmin1', 'cipAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'soilmoisture-0-10cm_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'soilmoisture-0-10cm_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
  {
    source: {
      url:
        'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/true',
      type: 'json',
      staticSeasonNames: ['soilmoisture-0-100cm-1982-2011_global_month_mean'],
      normalizer: 'normalizeSoilMoistureData',
    },
    overlays: [
      {
        type: 'single',
        forLayerId: 'cipSoilMoisture100cmMonthlyData',
        timeseriesSourceLayerIds: ['cipSoilMoisture100cmMonthlyData'],
      },
      {
        type: 'single',
        forLayerId: 'cipSoilMoisturePrelim100cmMonthlyData',
        impersonate: 'cipSoilMoisture100cmMonthlyData',
        timeseriesSourceLayerIds: ['cipSoilMoisturePrelim100cmMonthlyData'],
      },
    ],
    boundaries: ['cipAdmin1', 'cipAdmin2'],
    boundaryLabels: ['Admin 1', 'Admin 2'],
    chartTypes: [
      {
        graphTypes: ['line', 'bar'],
        dataType: 'annual_prelim',
        dataRoot: 'soilmoisture-0-100cm_global_month_data.data',
        yAxisRange: 'auto',
      },
      {
        graphTypes: ['bar', 'line'],
        dataType: 'interannual_prelim',
        dataRoot: 'soilmoisture-0-100cm_global_month_data.data',
        yAxisRange: 'auto',
      },
    ],
  },
];
