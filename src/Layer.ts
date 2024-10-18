import { AdditionalAttributes, FeatureInfo, LayerConfig, LayerSource, LayerType, LegendConfig, RegionID, VersionID, Timeseries } from './@types';
import { Granule } from './Granules';

export class Layer implements LayerConfig {
  versionId?: string;
  regionId?: string;
  expanded?: boolean;
  folder?: Array<LayerConfig>;
  granule: Granule;
  id?: string;
  name: string;
  version?: string; // glc
  isWMST?: boolean;
  wmstName?: string;
  currentGranuleName?: string;
  source: LayerSource;
  infoFormat?: string; // geosur
  loadOnly: boolean;
  display: boolean;
  mask: boolean;
  zIndex: number;
  transparency: boolean;
  filter?: string; // glc
  regionIds?: Array<RegionID>; // glc
  versionIds?: Array<VersionID>;
  chartIds?: Array<string>; // geosur, mtbs
  srs: string;
  geometryName?: string; // cdi, mtbs
  resolution?: string;
  featureInfo?: FeatureInfo;
  style?: string;
  legend?: LegendConfig;
  unit?: string;
  opacity?: number;
  additionalAttributes?: AdditionalAttributes;
  timeseries?: Timeseries;
  others?: Record<string, any>;
  loaded?: boolean;
  brand?: string;
  comments?: string;
  isAdded?: boolean;
  type: LayerType;

  constructor(config: LayerConfig) {
    this.type = config.type;
    this.regionId = config.regionId;
    this.versionId = config.versionId;
    this.expanded = config.expanded;
    this.folder = config.folder;
    this.id = config.id;
    this.name = config.name;
    this.version = config.version;
    this.isWMST = config.isWMST;
    this.currentGranuleName = config.currentGranuleName;
    this.source = config.source;
    this.infoFormat = config.infoFormat;
    this.loadOnly = config.loadOnly;
    this.display = config.display;
    this.mask = config.mask;
    this.zIndex = config.zIndex;
    this.transparency = config.transparency;
    this.filter = config.filter;
    this.regionIds = config.regionIds;
    this.versionIds = config.versionIds;
    this.chartIds = config.chartIds;
    this.srs = config.srs;
    this.geometryName = config.geometryName;
    this.resolution = config.resolution;
    this.featureInfo = config.featureInfo;
    this.style = config.style;
    this.legend = config.legend;
    this.unit = config.unit;
    this.opacity = config.opacity;
    this.additionalAttributes = config.additionalAttributes;
    this.timeseries = config.timeseries;
    this.others = config.others;
    this.loaded = config.loaded;
    this.brand = config.brand;
    this.comments = config.comments;
    this.isAdded = config.isAdded;
  }

  setFolderToggle(expanded: boolean): Layer {
    this.expanded = expanded;
    return this;
  }

  setDisplay(bool: boolean): Layer {
    this.display = bool;
    return this;
  }

  setOpacity(value: number): Layer {
    this.opacity = value;
    return this;
  }

  isTransparent(): boolean {
    return this.transparency;
  }

  // getTimeseriesSourceList(): Timeseries {
  //   return this.timeseries
  // }
}
