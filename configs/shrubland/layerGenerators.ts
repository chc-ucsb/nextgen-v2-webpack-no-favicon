import { GenericFolderLayer, LayerValuesGenerator, RCMAPTimeSeries, RCMAPTimeSeriesTrends, Boundaries } from './layerInterface';

export function generateRCMAPFolderLayer(values: LayerValuesGenerator): GenericFolderLayer {
  const {
    id = null,
    title,
    description,
    wmstName,
    source,
    currentGranuleName,
    wcsOutputSRS,
    display = false,
    loadOnly = false,
    legend,
    featureInfo,
    additionalAttributes,
    timeseries,
    downloadCat = null,
  } = values;

  let { isWMST = false, name = '' } = values;
  if (wmstName && !isWMST) {
    isWMST = true;
  }
  if (id && name === '') {
    name = `mrlc_display:${id}`;
  }

  if (legend && !legend.title) {
    legend.title = title;
  }

  if (timeseries) {
    // TODO: log error if no id
    timeseries.start.period = timeseries.start.period.replace('{{rasterDataset}}', id);
    timeseries.start.year = timeseries.start.year.replace('{{rasterDataset}}', id);
    timeseries.end.period = timeseries.end.period.replace('{{rasterDataset}}', id);
    timeseries.end.year = timeseries.end.year.replace('{{rasterDataset}}', id);
  }

  if (additionalAttributes) {
    // TODO: log error if no id
    additionalAttributes.rasterDataset = id;
  }

  return {
    type: 'folder',
    title,
    expanded: true,
    description,
    loadOnly,
    regionId: 'us',
    folder: [
      {
        type: 'layer',
        id,
        name,
        description,
        isWMST,
        wmstName,
        currentGranuleName,
        title: '',
        source,
        resolution: '0.05',
        pixelWidth: '3400',
        pixelHeight: '2000',
        loadOnly,
        display,
        active: display,
        mask: false,
        zIndex: 1,
        transparency: true,
        srs: 'EPSG:3857',
        wcsOutputSRS,
        featureInfo,
        style: '',
        legend,
        additionalAttributes,
        timeseries,
        downloadCat,
      },
    ],
  };
}

export function generateBoundary(values): Boundaries {
  const { id, title, name, source, loadOnly = false, includeManager = false } = values;
  let featureInfo = {};
  if (includeManager) {
    featureInfo = {
      POLY_NAME: {
        displayName: 'POLY_NAME',
        displayValue: null,
        value: null,
        mapValues: [],
      },
      Manager: {
        displayName: 'Manager',
        displayValue: null,
        value: null,
        mapValues: [],
      },
    };
  } else {
    featureInfo = {
      POLY_NAME: {
        displayName: 'POLY_NAME',
        displayValue: null,
        value: null,
        mapValues: [],
      },
    };
  }
  return {
    type: 'layer',
    id,
    name,
    title,
    source,
    featureInfo,
    loadOnly,
    display: false,
    mask: false,
    srs: 'EPSG:3857',
  };
}
