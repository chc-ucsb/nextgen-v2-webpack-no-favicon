import { generateChartConfig } from './chartConfigGenerators';

const url = 'https://stagegeoengine.cr.usgs.gov/api/rest/timeseries/version/5.0/';

const customColors = {
  'Bare Ground': '#a9a9a9', // dark gray
  Litter: '#FFFF00', // yellow
  'Annual Herbaceous': '#A865C9', // light purple
  'Perennial Herbaceous': '#800080', // purple
  'Total Herbaceous': '#301934', // dark purple
  'Non-Sagebrush Shrub': '#90EE90', // light green
  Sagebrush: '#00FF00', // green
  'Total Shrub': '#006400', // dark green
};

const boundaries = [
  'shapefile_USFS_BLM_Allotments_wm',
  'shapefile_BLM_USFS_Pastures',
  'shapefile_HUC_level_6',
  'shapefile_HUC_level_8',
  'shapefile_HUC_level_10',
  'shapefile_BLM_Priority_Habitat_Area',
  'shapefile_BLM_herd_managment_area',
];
const boundaryLabels = [
  'USFS BLM Allotments',
  'BLM USFS Pastures',
  'HUC Level 6',
  'HUC Level 8',
  'HUC Level 10',
  'BLM Priority Habitat Area',
  'BLM Herd Managment Area',
];
export const charts = [
  generateChartConfig({
    url,
    layerId: 'anhb_westernconus_year_data',
    title: 'Annual Herbaceous',
    boundaries,
    boundaryLabels,
    customColors,
  }),
  generateChartConfig({
    url,
    layerId: 'shrub_westernconus_year_data',
    title: 'Total Shrub',
    boundaries,
    boundaryLabels,
    customColors,
  }),
  generateChartConfig({
    url,
    layerId: 'litter_westernconus_year_data',
    title: 'Litter',
    boundaries,
    boundaryLabels,
    customColors,
  }),
  generateChartConfig({
    url,
    layerId: 'sage_westernconus_year_data',
    title: 'Sagebrush',
    boundaries,
    boundaryLabels,
    customColors,
  }),
  generateChartConfig({
    url,
    layerId: 'bare_westernconus_year_data',
    title: 'Bare Ground',
    boundaries,
    boundaryLabels,
    customColors,
  }),
  generateChartConfig({
    url,
    layerId: 'herb_westernconus_year_data',
    title: 'Total Herbaceous',
    boundaries,
    boundaryLabels,
    customColors,
  }),
  generateChartConfig({
    url,
    layerId: 'non-sagebrush-shrub_westernconus_year_data',
    title: 'Non-Sagebrush Shrub',
    boundaries,
    boundaryLabels,
    customColors,
  }),
  generateChartConfig({
    url,
    layerId: 'per-herb_westernconus_year_data',
    title: 'Perennial Herbaceous',
    boundaries,
    boundaryLabels,
    customColors,
  }),
];
