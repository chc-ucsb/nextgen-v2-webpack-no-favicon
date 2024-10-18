import { Block } from '../Architect';
import { LayerHandler } from '../LayerHandler';
import { EventHandler } from '../EventCenter';
import { Charter } from '../Charter/Charter';
import { MapWrapper } from '../Map';
import { Granule } from '../Granules';

export interface AppStore {
  Tools: any;
  Config: Dictionary;
  Viewport: Viewport;
  Layers: LayerHandler;
  Charter: Charter;
  EventHandler: EventHandler;
  OpenLayers: MapWrapper;
  Analytics: {
    reportActivity: (file: string, eventCategory: string, eventAction: string) => void;
  };
  RemoteResource: any;
  urlParameters: Dictionary;
}
export interface ViewportConfig {
  layout: string;
  id: string;
  deferredRender: boolean;
  items: Array<Block>;
}
export interface Viewport {
  addItems: (config: ViewportConfig) => void;
}

export interface AjaxOptions {
  url: string;
  method: string;
  cache?: boolean;
  body?: string | Blob | Document | ArrayBuffer | ArrayBufferView | FormData | URLSearchParams | ReadableStream<Uint8Array>;
  timeout?: number;
  callbackObj?: Dictionary;
  callback?: (request: XMLHttpRequest, callbackObj: Dictionary) => unknown;
  errorCallback?: (request: XMLHttpRequest, callbackObj: Dictionary) => unknown;
}

export type Dictionary = Record<string, any>;

/**
 * Create a Dictionary with the values of a specified type.
 * @example
 * const a: Dict<number> = { 'foo': 2 } // valid
 * const b: Dict<number> = { 'foo': 'bar' } // invalid. Expects values to be of type `number`.
 */
export type Dict<T> = Record<string, T>;

/**
 * Periods
 */
export type PeriodicityEventName = 'selectionChange' | 'optionsChange';
export type PeriodicityEvent = {
  callbackObj: any;
  callbackFunction: Function;
};
export type PeriodType = 'day' | 'week' | 'firedanger_week' | '14day' | 'pentad' | 'dekad' | 'month' | '2month' | '3month';
export type Abbr1Month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export type Abbr2Month = [
  'Jan-Feb',
  'Feb-Mar',
  'Mar-Apr',
  'Apr-May',
  'May-Jun',
  'Jun-Jul',
  'Jul-Aug',
  'Aug-Sep',
  'Sep-Oct',
  'Oct-Nov',
  'Nov-Dec',
  'Dec-Jan'
];
export type Abbr3Month = [
  'Jan-Feb-Mar',
  'Feb-Mar-Apr',
  'Mar-Apr-May',
  'Apr-May-Jun',
  'May-Jun-Jul',
  'Jun-Jul-Aug',
  'Jul-Aug-Sep',
  'Aug-Sep-Oct',
  'Sep-Oct-Nov',
  'Oct-Nov-Dec',
  'Nov-Dec-Jan',
  'Dec-Jan-Feb'
];
export type AbbrShort1Month = Abbr1Month;
export type AbbrShort2Month = ['JF', 'FM', 'MA', 'AM', 'MJ', 'JJ', 'JA', 'AS', 'SO', 'ON', 'ND', 'DJ'];
export type AbbrShort3Month = ['JFM', 'FMA', 'MAM', 'AMJ', 'MJJ', 'JJA', 'JAS', 'ASO', 'SON', 'OND', 'NDJ', 'DJF'];
export type TimeVariable = {
  type: string;
  daysPerPeriod?: number;
  digitCount?: number;
  itemsPerMonth?: number;
};

export interface PeriodConfig {
  title?: string;
  alias: string;
  label: string;
  xLabel: string;
  timeVariables: Array<TimeVariable>;
  firstOccurrence?: number;
  shortName?: string;
  fullName: string;
  months: Abbr1Month | Abbr2Month | Abbr3Month;
  shortMonths: AbbrShort1Month | AbbrShort2Month | AbbrShort3Month;
  style: string;
  type: PeriodType;
  // start: TimeseriesTime|number|null
  start: TimeseriesTime;
  // end: TimeseriesTime|number|null
  end: TimeseriesTime;

  seasonStart?: TimeseriesTime;
  seasonEnd?: TimeseriesTime;
  digitCount?: number;
  // offset?: number
  periodsPerParent: Dictionary;
  // dateFormatter: any
  // labelFormatter: ILabelFormatter
  // displayFormatter: IDisplayFormatter
}

export type ExtentType = [number, number, number, number];

/**
 * Regions
 */
export type RegionID = 'af' | 'gb' | 'ea-af' | 'camcar' | 'casia' | 'me' | 'lac';
export type RegionConfig = {
  id: RegionID;
  name: string;
  title: string;
  srs: string;
  iconPath: string;
  bbox: ExtentType;
  comments: string;
};

/**
 * Versions
 */
export type VersionID = 'LF_105' | 'LF_140' | 'LF_200' | 'LF190_Limited';
export type VersionConfig = {
  id: VersionID;
  name: string;
  title: string;
  srs: string;
  bbox: ExtentType;
  comments: string;
};

/**
 * Layers
 */
export type LayerType = 'folder' | 'layer';
export type LayerSourceType = 'wms' | 'wcs' | 'wfs' | 'cdi' | 'gwc' | 'url'; /* baseLayer */
export type LayerSource = Record<LayerSourceType, string>;
export interface FeatureInfoConfig {
  [key: string]: any;
  displayName: string;
  propertyName: string;
  type: string;
}
export interface FeatureInfo {
  [key: string]: any;
  displayName: string;
  displayValue: null | string;
  value: null | string;
  mapValues: Array<Dictionary>;
  significantDigits?: number;
}

export interface LegendConfig {
  title: string;
  style: string;
  customImageURL: null | string;
}

export interface AdditionalAttributes {
  format: string;
  statistic?: string;
  rasterDataset?: string;
  chartYAxisLabel?: string;
}

export interface Timeseries {
  type: PeriodType;
  source: string;
  start: TimeseriesTime;
  end: TimeseriesTime;
  layerIds?: Array<string>;
  others?: Array<string> | Array<number>;
}

/**
 * Base interface for LayerConfig/LayerFolder.
 */
export interface LayerBase {
  type: LayerType;
  title?: string;
  description?: string;
}

/**
 * Configuration object for a single layer
 */
export interface LayerConfig extends LayerBase {
  [key: string]: any;
  regionId?: string;
  versionId?: string;
  expanded?: boolean;
  folder?: Array<LayerConfig>;

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
  cqlFilter?: Record<string, string>;

  granule: Granule;
}

/**
 * The shape of the layers.json file.
 */
export interface LayerJSONConfig extends LayerConfig {
  overlays?: Array<LayerConfig>;
  boundaries?: Array<LayerConfig>;
  baseLayers?: Array<LayerConfig>;
  hidden?: Array<LayerConfig>;
  instanceId?: string;
  [key: string]: any;
}

export type TimeseriesTime = {
  period?: string | number;
  month?: string | number;
  year?: string | number;
};
// export interface LayerFolder extends LayerBase {
//   regionId?: string
//   expanded?: boolean
//   folder: Array<LayerFolder|LayerConfig>
// }

// // Base interface for Block and Blueprint
// export interface IBase {
//   blockConfig: BlockConfig
//   // parent: Blueprint
//   type: string
//   events: {
//     [key: string]: Array<any>
//   }
//   itemDefinition: any
//   groupOwner: Blueprint|null
//   id: string

//   toolbarItems: Array<Blueprint>
//   menuItems: Array<Blueprint>
//   childItems: Array<Blueprint>
//   rendered: boolean
//   delayRender: boolean
// }

// // Interface for Block
// export interface IBlock extends IBase {
//   parent: Block|null
//   blueprint: Blueprint
//   extendedTool: any
//   blockReferences: Array<Block>
// }

// // Interface for Blueprint
// export interface IBlueprint extends IBase {
//   parent: Blueprint|null
//   uniqueId: string
//   requiredBlockBlueprints: Array<Blueprint>
//   relatedBlockBlueprints: Array<Blueprint>
//   groupBlockBlueprints: Array<Blueprint>
//   block: Block
//   copyId: string
// }

export interface IConfig {
  region: string;
  version: string;
  xtype: string;
  floating: boolean;
  ghost: boolean;
  constrain: boolean;
  x: number;
  y: number;
  show: Function;
  doLayout: Function;
}

export interface IBlock {
  block: string;
  x: number;
  y: number;
}

export interface IDateDefinitions {
  [key: string]: (date: Date) => number | string;
  [Symbol.iterator]?: () => Generator<any>;
}

export interface WMSParams {
  LAYERS: string;
  TILED: boolean;
  mapperWMSURL: string;
  SRS: string;
  jsonLayerId: string;
  BBOX?: ExtentType | string;
  STYLES?: string;
  VERSION?: string;
}

// export interface ShowByDefault {
//   amountSelected: number;
//   others:         string[];
// }

// export interface BlockConfig {
//   init?: Function
//   block:        string;
//   name?:        string;
//   id:          string;
//   import?:      string;
//   label?:       string;
//   add?:         boolean;
//   type?:        string;
//   format?:      string;
//   text?:        string;
//   tooltip?:     string;
//   width?:       number | string;
//   height?:      number | string;
//   cssClass?:    string;
//   bodyStyle?:   string;
//   // style?:       string;
//   collapsible?: boolean;
//   content?:     string;
//   link?:        string;
//   // toolbar?:     BlockConfig;
//   toolbar?:     ToolbarConfig;
//   items:       BlockConfig[];
//   title?:       string;
//   blocks?:      BlockConfig[];
//   collapsed?:   boolean;
//   legendPosition?: string;
//   dockedState?: string;
//   showByDefault?: ShowByDefault;
//   saveSelection?: boolean;
//   pressed?:     boolean;
//   pickerType?:  string;
//   // position?:    string;
//   // overflowMenu?:boolean;
//   icon?:        string;
//   url?:         string;
//   showOnFirstLoad?: boolean;
//   popupTitle?:  string;
//   popupHeight?: number;
//   popupWidth?:  number;
//   popupBody?:   string;
//   destroyIfEmpty?: boolean;
//   options?: {
//     events?: Array<string>
//     delayRender?: boolean
//     requiredBlocks?: Array<string>
//     groupBy?: string
//     block?: any
//   }
//   createExtendedTool?: Function
// }

// export interface ToolbarConfig {
//   add: boolean
//   overflowMenu: boolean
//   style: Dictionary
//   position: "top"|"bottom"|"left"|"right"
//   items: Array<BlockConfig>
// }

// export interface PeriodConfig {
//   title?: string
//   alias?: string
//   label?: string
//   xLabel?: string
//   timeVariables?: Array<TimeVariable>
//   firstOccurance?: number
//   shortName?: string
//   fullName?: string
//   months?: Abbr1Month|Abbr2Month|Abbr3Month
//   shortMonths?: AbbrShort1Month|AbbrShort2Month|AbbrShort3Month
//   style?: string
//   type?: PeriodType

//   name?: string
//   start?: number
//   // start: TimeseriesTime
//   end?: number
//   // end: TimeseriesTime

//   // seasonStart?: TimeseriesTime
//   seasonStart?: number
//   // seasonEnd?: TimeseriesTime
//   seasonEnd?: number
//   digitCount?: number
//   offset?: number

//   daysPerPeriod?: number
//   periodsPerParent: typeof PeriodsPerParent|typeof number
//   dateFormatter: typeof DateFormatter
//   labelFormatter: typeof LabelFormatter
//   displayFormatter: typeof DisplayFormatter

//   labelVariable?: null|string
//   secondLabelVariable?: null | string
//   firstDay?: null | number
//   getFirstDay?: typeof PeriodsPerParent
// }
