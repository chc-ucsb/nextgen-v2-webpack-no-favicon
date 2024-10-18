// WARNING: Changes to this file do not always take effect when server is watching for changes to rebuild automatically

export interface Source {
  wms: string;
  wcs?: string;
  wfs?: string;
  gwc?: string;
}

interface InfoForFeature {
  displayName: string;
  displayValue: null;
  value: null;
  mapValues: [];
}

interface FeatureInfoPalette {
  PALETTE_INDEX: InfoForFeature;
  GRAY_INDEX?: never;
}

interface FeatureInfoGray {
  PALETTE_INDEX?: never;
  GRAY_INDEX: InfoForFeature;
}

export type FeatureInfo = FeatureInfoPalette | FeatureInfoGray;

export interface Legend {
  customImageURL: string;
  title?: string;
}

export interface AdditionalAttributes {
  format: string;
  statistic: string;
  rasterDataset: string;
}

export interface Timeseries {
  type: string;
  format: string;
  source: string;
  start: {
    period: string;
    month: string;
    year: string;
  };
  end: {
    period: string;
    month: string;
    year: string;
  };
}

export interface LayerValuesGenerator {
  type?: string;
  id?: string | null;
  name?: string;
  description?: string;
  isWMST?: boolean;
  wmstName?: string;
  currentGranuleName?: string;
  title?: string;
  source?: Source;
  resolution?: string;
  pixelWidth?: string;
  pixelHeight?: string;
  loadOnly?: boolean;
  display?: boolean;
  active?: boolean;
  mask?: boolean;
  zIndex?: number;
  transparency?: boolean;
  srs?: string;
  wcsOutputSRS?: string;
  featureInfo?: FeatureInfo;
  style?: string | null;
  legend?: Legend | null;
  additionalAttributes?: AdditionalAttributes | null;
  timeseries?: Timeseries | null;
  downloadCat?: string | null;
}

export interface GenericLayer {
  type: string;
  id: string | null;
  name: string;
  description: string;
  isWMST: boolean;
  wmstName?: string;
  currentGranuleName?: string;
  title: string;
  source: Source;
  resolution?: string;
  pixelWidth?: string;
  pixelHeight?: string;
  loadOnly: boolean;
  display: boolean;
  active?: boolean;
  mask: boolean;
  zIndex?: number;
  transparency?: boolean;
  srs: string;
  wcsOutputSRS?: string;
  featureInfo: FeatureInfo;
  style: string | null;
  legend: Legend | null;
  additionalAttributes: AdditionalAttributes | null;
  timeseries: Timeseries | null;
  downloadCat: string | null;
}

export interface GenericFolderLayer {
  type: string;
  title: string;
  expanded: boolean;
  description: string | null;
  loadOnly: boolean;
  regionId: string;
  folder: [GenericLayer];
}

export interface RCMAPTimeSeries {
  type: string;
  title: string;
  expanded: boolean;
  description: string;
  loadOnly: boolean;
  folder: [
    {
      type: string;
      id: string;
      name: string;
      isWMST: boolean;
      wmstName: string;
      currentGranuleName: string;
      title: string;
      source: {
        wms: string;
        wcs: string;
        gwc: string;
      };
      resolution: string;
      pixelWidth: string;
      pixelHeight: string;
      loadOnly: boolean;
      display: boolean;
      active: boolean;
      mask: boolean;
      zIndex: number;
      transparency: boolean;
      srs: string;
      wcsOutputSRS: string;
      featureInfo: object;
      style: string;
      legend: {
        customImageURL: string;
        title: string;
      };
      additionalAttributes: {
        format: string;
        statistic: string;
        rasterDataset: string;
      };
      timeseries: {
        type: string;
        format: string;
        source: string;
        start: {
          period: string;
          month: string;
          year: string;
        };
        end: {
          period: string;
          month: string;
          year: string;
        };
      };
    }
  ];
}

export interface RCMAPTimeSeriesTrends {
  type: string;
  title: string;
  expanded: boolean;
  folder: [
    {
      type: string;
      isWMST: boolean;
      name: string;
      title: string;
      source: {
        wms: string;
        wcs: string;
        wfs: string;
      };
      loadOnly: boolean;
      display: boolean;
      mask: boolean;
      transparency: boolean;
      srs: string;
      featureInfo: object;
      legend: {
        customImageURL: string;
        title: string;
      };
    }
  ];
}

export interface EcologicalPotential {
  type: string;
  title: string;
  expanded: boolean;
  loadOnly: boolean;
  folder: [
    {
      type: string;
      id: string;
      name: string;
      isWMST: boolean;
      title: string;
      source: {
        wms: string;
        wcs: string;
        gwc: string;
      };
      loadOnly: boolean;
      display: boolean;
      mask: boolean;
      srs: string;
      featureInfo: object;
      legend: {
        customImageURL: string;
        title: string;
      };
    }
  ];
}

export interface Boundaries {
  type: string;
  id: string;
  name: string;
  title: string;
  source: {
    wms: string;
    wfs: string;
  };
  featureInfo: object;
  loadOnly: boolean;
  display: boolean;
  mask: boolean;
  srs: string;
}
