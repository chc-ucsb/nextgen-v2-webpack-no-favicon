export const charts = [
  {
    source: {
      url:
        'https://edcintl.cr.usgs.gov/geoengine5/rest/timeseries/version/5.0/vector_dataset/quickdri_shapefile_HydrologicUnits:shapefile_HydrologicUnits/raster_dataset/vegdri_conus_week_data/periodicity/firedanger_week/statistic/data/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/false',
      type: 'json',
    },
    overlays: ['qdvdemodis_id'],
    boundaries: ['qdhydrounits_id'],
    boundaryLabels: ['Hydrologic Units'],
    geoengineBoundaryNames: ['quickdri_shapefile_HydrologicUnits:shapefile_HydrologicUnits'],
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'annual',
        dataRoot: 'vegdri_conus_week_data.data',
        yAxisRange: { min: 0, max: 250 },
      },
    ],
  },
  {
    source: {
      url:
        'https://edcintl.cr.usgs.gov/geoengine5/rest/timeseries/version/5.0/vector_dataset/quickdri_shapefile_HydrologicUnits:shapefile_HydrologicUnits/raster_dataset/quickdri_conus_week_data/periodicity/firedanger_week/statistic/data/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/false',
      type: 'json',
    },
    overlays: ['qdraster_id'],
    boundaries: ['qdhydrounits_id'],
    boundaryLabels: ['Hydrologic Units'],
    geoengineBoundaryNames: ['quickdri_shapefile_HydrologicUnits:shapefile_HydrologicUnits'],
    chartTypes: [
      {
        graphTypes: ['line'],
        dataType: 'annual',
        dataRoot: 'quickdri_conus_week_data.data',
        yAxisRange: { min: -300, max: 300 },
      },
    ],
  },
];
