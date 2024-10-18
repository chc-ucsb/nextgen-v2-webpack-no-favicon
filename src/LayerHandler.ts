import { WMSCapabilities } from 'ol/format';
import { logger } from './utils';
import { isUndefined } from './helpers/validation';
import { FeatureInfo, FeatureInfoConfig, LayerConfig, LayerJSONConfig } from './@types';
import { Store } from './Store';
import { EventTypes } from './EventCenter';
import {
  buildLabel,
  buildLayerGranuleName,
  buildChildLayerGranuleName,
  buildUrl,
  getBaseUrl,
  getRandomString,
  hashCode,
  objFromUrlQueryParams,
} from './helpers/string';
import { convertPropsToLowercase, deepClone, objPropExists } from './helpers/object';
import { Transport } from './Network/Transport';
import { Granule } from './Granules';
import { Layer } from './Layer';
import { cloneLayerConfigGranules } from './helpers/granule';

/**
 * Get all the layers that are within the same folder as a given layerId.
 * @param {Array<LayerConfig>} items
 * @param {string} layerId
 * @returns {Array<LayerConfig>}
 */
const getLayerSiblings = (items: Array<LayerConfig>, layerId: string): Array<LayerConfig> => {
  let siblings = [];

  const fn = (_items) => {
    for (const item of _items) {
      if (item.type === 'folder') {
        if (item.folder.findIndex((subItem) => subItem.id === layerId) > -1) {
          siblings = item.folder;
        }

        fn(item.folder);
      }
    }
  };
  fn(items);
  return siblings;
};

/**
 * Handle failed layers by first determining if the failed layer is a display layer.
 * If it is, we determine the next layer that should be set to display by default, which is the next layer in the folder.
 * Finally, we remove the layer from the layersConfig so tools like cDatasetExplorerTool don't reference failed layers
 * when building their DOM.
 */
const handleFailedLayers = (): void => {
  globalThis.App.Layers._failedLayerIds.map((failedLayerId) => {
    for (const lNode of Object.keys(globalThis.App.Config.sources.layers)) {
      // Get all the layers that are in the same folder.
      const allLayerSiblings = getLayerSiblings(globalThis.App.Layers.layersConfig[lNode], failedLayerId);
      if (allLayerSiblings) {
        // Get all layers where `display` is true and `id` matches failedLayerId
        const removedDisplayedLayers = allLayerSiblings.filter((layer) => layer.id === failedLayerId && layer.display === true);

        // If the removedDisplayedLayers array is not empty
        if (removedDisplayedLayers.length) {
          // Get all sibling layers except for the one with the failedLayerId
          const siblingLayers = allLayerSiblings.filter((layer) => layer.id !== failedLayerId);

          // Take the first sibling layer
          const [firstSiblingLayer] = siblingLayers;

          // Set the display property to true.
          if (firstSiblingLayer) firstSiblingLayer.display = true;
        }

        // Remove layer from config.
        globalThis.App.Layers.layersConfig[lNode] = globalThis.App.Layers.removeLayerById(globalThis.App.Layers.layersConfig[lNode], failedLayerId);
      }
    }
  });
};

/**
 * Returns an object containing properties related to time.
 * @param {object} layer
 * @returns {object}
 */
export const getTimePropsFromLayer = (layer: LayerConfig): { folderType: string; periodType: string; periodNum: number; year: number } => {
  const layerName = layer.name;
  // Split apart the layer name
  const splitPeriod = layerName.split('_');

  // Grab the period string from the layer name
  const periodMeta = splitPeriod[2];

  // Grab the folder type from the layer name (data, anomaly, z-score, etc)
  const folderType = splitPeriod[splitPeriod.length - 1];
  const typeDateSeparatorIndex = periodMeta.indexOf('-', 2);

  // Split apart the period string and get the period and year
  const splitDate = periodMeta.slice(typeDateSeparatorIndex + 1).split('-');
  const periodNum = Number(splitDate[0]);
  const year = Number(splitDate[1]);

  return {
    folderType,
    periodType: layer.timeseries.type,
    periodNum,
    year,
  };
};

/**
 * Get the top-most layer.
 * @param {Array<LayerConfig>} layers
 * @returns {LayerConfig}
 */
export const getTopLayer = (layers: Array<LayerConfig>): LayerConfig => {
  return layers.find((layer) => layer.display === true && layer.mask === false && layer.loadOnly === false);
};

/**
 * Get the title of the top-most layer.
 * @param {Array<LayerConfig>} layers
 * @returns {string}
 */
export const getTopLayerTitle = (layers: Array<LayerConfig>): string => {
  const layer = getTopLayer(layers);
  const unit = typeof layer.unit !== 'undefined' && layer.unit !== '' ? ` (${layer.unit})` : '';
  return `${layer.title}${unit}`;
};

/**
 * When making a TimeSeries request, check if the layer JSON contains a 'wmstName' property.
 * If it does, then a `TIME` parameter will be added to the WMS params.
 * @param {LayerConfig} jsonLayer
 * @param paramsObj
 * @returns {any}
 */
export const addTimeToWMSParams = (jsonLayer: LayerConfig, paramsObj: any): any => {
  const obj = deepClone(paramsObj);
  if (objPropExists(jsonLayer, 'wmstName')) {
    if (objPropExists(jsonLayer, 'parentGranuleName')) {
      // Set the WMST Name as the layer name
      obj.LAYERS = decodeURIComponent(encodeURIComponent(jsonLayer.wmstName));

      // Translate the period to a timestamp and add the TIME variable to the query parameter object
      let g = globalThis.App.Layers._granules.get(jsonLayer.parentGranuleName);
      if (g === undefined) g = globalThis.App.Layers._originalGranules.get(jsonLayer.parentGranuleName);
      obj.TIME = `${g.activeInterval.start}`;
    } else {
      // Set the WMST Name as the layer name
      obj.LAYERS = decodeURIComponent(encodeURIComponent(jsonLayer.wmstName));

      // Translate the period to a timestamp and add the TIME variable to the query parameter object
      let g = globalThis.App.Layers._granules.get(jsonLayer.id);
      if (g === undefined) g = globalThis.App.Layers._originalGranules.get(jsonLayer.id);
      obj.TIME = `${g.activeInterval.start}`;
    }
  } else {
    logger.error('ERROR! No wmstName property on JSON Layer. Using non-WMST layer name instead...');
  }

  return obj;
};

/**
 * Tracks and handles manipulation of all layers
 */
export class LayerHandler {
  /**
   * A reference to the app store. Can be used instead of `globalThis.App`
   */
  store: Store;

  /**
   * The current instance ID.
   */
  configInstanceId: string;
  layerIdentifiers: Array<Partial<LayerConfig>>;

  /**
   * Config instances mapped to their configInstanceId.
   */
  layersConfigInstances: Map<string, LayerJSONConfig>;
  layersConfig: LayerJSONConfig;

  /**
   * The number of timeseries requests completed.
   */
  timeseriesRequestsCompleted: number;

  /**
   * The total number of layers that have timeseries data.
   */
  totalTimeseriesCount: number;

  /**
   * An array of layer IDs that failed to be loaded.
   */
  _failedLayerIds: Array<string>;

  _failedExternalResources: Record<string, string>;

  _layers: Array<Layer> = [];

  /**
   * A map of granule instances that have IDs that share the same configInstanceId as layersConfigInstances
   */
  granuleInstances: Map<string, Map<string, Granule>>;

  /**
   * A map of the granules that coincide with the active layersConfig instance. This is updated
   * with a different granule instance on window focus from the cMapWindow tool.
   * Due to how layers are cloned (json stringify -> json parse), functions on classes
   * don't stay on the prototype. So we need a separate store for looking up the
   * necessary granules.
   */
  _granules: Map<string, Granule>;

  /**
   * The granules created on application load.
   */
  _originalGranules: Map<string, Granule>;

  constructor(store: Store) {
    this.store = store;
    this.layersConfig = store.Config.sources.layers;
    this.layerIdentifiers = [];
    this.layersConfigInstances = new Map();
    this.granuleInstances = new Map();
    this._granules = new Map();
    this._originalGranules = new Map();
    this._failedLayerIds = [];
    this._failedExternalResources = {};
  }

  /**
   * Query the URLs defined in RemoteResources
   */
  async loadLayerConfiguration(): Promise<void> {
    const layerNodes = this.layersConfig;

    /**
     * Load remote resources
     */
    // Check the URL parameters for 'resource'
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('resource')) {
      const parser = new WMSCapabilities();
      const url = String(window.location);
      const params = objFromUrlQueryParams(url);

      // Parent folder names. If a `title` parameter is not in the URL, default to 'Remote Resources'.
      let _titles = ['Remote Resources'];
      if (params.title) {
        // Change plus signs '+' to spaces prior to decoding - https://stackoverflow.com/a/24417399
        _titles = params.title.split(',').map((title) => decodeURIComponent(title.replace(/\+/g, '%20')));
      }

      const _resources = params.resource
        // Support for multiple remote resources by separating them with a comma
        .split(',')
        .map((resource, idx) => {
          // GeoPortal prepends resource urls with the OGC service. (wms:http....)
          // URLs are sent in decoded, so we have to parse out just the url.
          // This will work for urls that do and don't have the OGC service prepended.
          const haystack = decodeURIComponent(resource);
          const needle = 'http';
          const needleStart = haystack.indexOf(needle);
          let url = haystack.slice(needleStart);

          // Validate the resource URL.
          const _urlParams = convertPropsToLowercase(objFromUrlQueryParams(url)) as Record<string, string>;

          // If no version is specified in the URL, assume supported version 1.3.0
          if (!_urlParams.version) {
            _urlParams.version = '1.3.0';
            url = buildUrl(url, {
              VERSION: '1.3.0',
            });
          }
          if (_urlParams.version !== '1.3.0') {
            globalThis.App.Layers._failedExternalResources[url] =
              globalThis.App.Config.sources.template?.externalServices?.errorMessages?.unsupportedVersion ??
              'Unsupported GetCapabilities version. Only version 1.3.0 is supported.';
            return;
          }

          // Because the URLs are from remote servers and might be HTTP-only
          // and because the viewer is loaded from a secure site (HTTPS),
          // we have to abide by CORS and use a PHP proxy to bypass this restriction.
          const proxyUrl = globalThis.App.Config.proxies.Generic;
          const _url = buildUrl(proxyUrl, {
            csurl: url,
          });

          let folderTitle;

          // Fetch the GetCapabilities document and return a resolved Promise containing the parsed folder title and layers
          return Transport.get(_url).then(async (res) => {
            // Parse XML to JSON
            const xmlText = await res.text();
            const json = parser.read(xmlText);
            let layers: Array<Record<string, any>> = [];
            folderTitle = folderTitle || json.Capability.Layer.Title || 'Layers';

            if (json.Capability.Layer.Layer.length) {
              layers = json.Capability.Layer.Layer.map((layer) => {
                const meta: Record<string, any> = {};
                let bboxName = '';

                if (layer.Name) meta.Name = layer.Name;
                if (layer.Title) meta.Title = layer.Title;

                if (layer.BoundingBox) bboxName = 'BoundingBox';
                else if (layer.LatLonBoundingBox) bboxName = 'LatLonBoundingBox';

                if (bboxName !== '') {
                  meta.BoundingBox = layer[bboxName];
                }

                if (layer.Style) {
                  meta.Style = {};
                  const style = layer.Style[0];
                  if (style.Name) meta.Style.Name = style.Name;
                  if (style.LegendURL) {
                    meta.Style.LegendURL = {};
                    const legendUrl = style.LegendURL[0];
                    if (legendUrl.Format) meta.Style.LegendURL.Format = legendUrl.Format;
                    if (legendUrl.OnlineResource) meta.Style.LegendURL.OnlineResource = legendUrl.OnlineResource;
                  }
                }

                // Determine the INFO_FORMAT for getFeatureInfo requests
                // If the GetFeatureInfo Format array contains 'application/geojson', use that. The service will throw errors if 'application/json' is used.
                // If it doesn't contain 'application/geojson', then default to 'application/json'.
                if (json.Capability.Request?.GetFeatureInfo?.Format.length) {
                  meta.InfoFormat = 'application/json';
                  if (json.Capability.Request?.GetFeatureInfo?.Format.includes('application/geojson')) meta.InfoFormat = 'application/geojson';
                }

                return meta;
              });
            }

            return [url, folderTitle, layers] as [string, string, Array<Record<string, any>>];
          });
        })
        // Remove undefined entries (occurs when a URL is invalid)
        .filter((r) => r);

      if (_resources.length) {
        await Promise.all(_resources)
          .then((data) => {
            const folders = {};
            data.forEach(([url, folderTitle, dataArr]) => {
              const baseUrl = getBaseUrl(url);
              const proxyUrl = globalThis.App.Config.proxies.Generic;
              const layerUrl = buildUrl(proxyUrl, {
                csurl: baseUrl,
              });

              folders[folderTitle] = dataArr.map((layer) => {
                const layerData: Record<string, string | Array<number>> = {
                  title: typeof layer.Title !== 'undefined' && layer.Title !== '' ? layer.Title : layer.Name,
                  name: layer.Name,
                  legendName: layer?.Style?.Name ?? '',
                  legendURL: layer?.Style?.LegendURL?.OnlineResource ?? null,
                  style: layer?.Style?.Name ?? '',
                  infoFormat: layer.InfoFormat,
                };

                // Append BBOX data to the data object.
                if (layer.BoundingBox) {
                  let boundingBox = layer.BoundingBox[0];
                  if (layer.BoundingBox.length > 1) {
                    // Here we use the first boundingBox value
                    boundingBox = layer.BoundingBox[1];
                  }

                  if (boundingBox.crs) layerData.crs = boundingBox.crs;
                  if (boundingBox.srs) layerData.srs = boundingBox.srs;
                  layerData.bbox = boundingBox.extent;
                }

                const newLayer: any = {
                  // This property is so that we can identify the added layer with the cRemoveWMSLayerForm component.
                  isAdded: true,
                  type: 'layer',
                  title: layerData.title,
                  name: layerData.name,
                  opacity: 1,
                  display: false,
                  mask: false,
                  loadOnly: false,
                  zIndex: 0,
                  style: layerData.style,
                  infoFormat: layerData.infoFormat,
                  source: {
                    wms: `${layerUrl}?`,
                  },
                  srs: layerData.crs,
                  featureInfo: {},
                  legend: {
                    style: layerData.style,
                    customImageURL: layerData.legendURL,
                    title: layerData.title,
                  },
                  transparency: true,
                  id: `layer-${Math.abs(hashCode(layerData.name + String(Math.random() * 10000) + Math.floor(Math.random() * 10 ** 5 + 1)))}`,
                };

                if (layerData.srs) newLayer.srs = layerData.srs;
                if (layerData.crs) newLayer.crs = layerData.crs;

                globalThis.App.Layers.storeLayerIdentifiers(newLayer);

                return newLayer;
              });
            });

            // EWX_Lite and GeoSUR add extra layers under an 'Additional Layers' folder.
            // If addNewFolder === true, this is what will happen. This does not appear on EWX viewer.
            // The inverse is also true, if addToFolder === false for EWX_Lite, the layers will load but will not be visible in the TOC.
            if (globalThis.App.Config.sources.template?.externalServices?.addNewFolder) {
              const subfolders = Object.keys(folders).map((folder, idx) => {
                return {
                  type: 'folder',
                  title: folder,
                  name: 'additional',
                  id: `layer-${Math.abs(hashCode(String(Math.random() * 10000 + Math.floor(Math.random() * 10 ** 5 + 1))))}`,
                  expanded: true,
                  folder: folders[folder],
                };
              }) as Array<LayerConfig>;

              _titles.map((title, idx) => {
                // @ts-ignore
                layerNodes.overlays.push({
                  type: 'folder',
                  title,
                  name: 'additional',
                  id: `layer-${Math.abs(hashCode(String(Math.random() * 10000 + Math.floor(Math.random() * 10 ** 5 + 1))))}`,
                  expanded: true,
                  folder: [subfolders[idx]],
                });
              });
            } else {
              let parentFolder = globalThis.App.Layers.query(layerNodes.overlays, function (folder) {
                if (folder.type !== 'folder') return false;
                const layers = folder.folder;
                for (let i = 0, len = layers.length; i < len; i += 1) {
                  const layer = layers[i];
                  if (layer.type === 'layer') return true;
                }
                return false;
              });

              if (parentFolder.length > 0) {
                parentFolder = parentFolder[0];
                parentFolder.folder = parentFolder.folder.concat(Object.values(folders).flat());
              }
            }
          })
          .catch((err) => {
            Ext.MessageBox.show({
              title: globalThis.App.Config.sources.template?.externalServices?.errorTitle ?? 'Service Error',
              msg:
                globalThis.App.Config.sources.template?.externalServices?.errorMessages?.loadFailed ??
                'Failed to load external services. Please try again later.',
              buttons: Ext.MessageBox.OK,
              autoScroll: true,
            });
          });
      }
    }

    Object.keys(layerNodes).map((lNode) => this.setLayerIds(layerNodes[lNode]));

    const sources = this.getTimeseriesSourceList(layerNodes.overlays);

    if (sources.length === 0) return;

    if (layerNodes.hidden) {
      const hiddenSource = this.getTimeseriesSourceList(layerNodes.hidden);
      hiddenSource.forEach((x) => {
        x.layerIds.forEach((y) => {
          sources[0].layerIds.push(y);
        });
      });
    }

    this.timeseriesRequestsCompleted = 0;
    this.totalTimeseriesCount = sources.length;

    for (const source of sources) {
      const { layerIds } = source;
      const res = await Transport.get(source.source, {
        callbackObj: source.layerIds,
        errCallback: () => {
          for (const layerId of layerIds) {
            globalThis.App.Layers._failedLayerIds.push(layerId);
            const title = globalThis.App.Layers.getLayerTitleById(globalThis.App.Config.sources.layers, layerId);
            logger.error(`Layer ${layerId} (${title}) failed to load and is being removed.`);
          }

          globalThis.App.Layers.timeseriesRequestsCompleted += 1;
          if (globalThis.App.Layers.timeseriesRequestsCompleted === globalThis.App.Layers.totalTimeseriesCount) {
            handleFailedLayers();

            globalThis.App.RemoteResource.updateLayersConfig();
            Object.keys(globalThis.App.Layers.layersConfig).map((lNode) => {
              globalThis.App.Layers.updateLayerConfiguration(globalThis.App.Layers.layersConfig[lNode]); // Update config here.
            });
          }
        },
      });

      // Have to check if `res` is undefined.
      // If the get request failed, `res` would be undefined.
      if (res) {
        const data = await res.json();

        for (const layerId of layerIds) {
          this.store.RemoteResource[layerId] = data;
        }

        this.timeseriesRequestsCompleted += 1;
        if (this.timeseriesRequestsCompleted === this.totalTimeseriesCount) {
          handleFailedLayers();

          this.store.RemoteResource.updateLayersConfig();
          Object.keys(this.layersConfig).map((lNode) => {
            this.updateLayerConfiguration(this.layersConfig[lNode]); // Update config here.
          });
        }
      }
    }
  }

  getCurrentLayersConfig(): LayerJSONConfig {
    return this.getLayersConfigById(this.getConfigInstanceId());
  }

  /**
   * Create and initialize a new instance of the LayersConfig object.
   * The config is cloned into a new object instead of referenced
   * because each new map window keeps track of its own layers and the
   * LayersConfig object tracks active/inactive layers for refreshing
   * the TOC
   */
  createNewInstanceOfLayersConfig(): LayerJSONConfig {
    const id = getRandomString(32, 36);
    let newLayersConfig: LayerJSONConfig;

    if (this.currentInstanceHasId()) {
      const oldLayersConfig = this.getLayersConfigById(this.getConfigInstanceId());
      newLayersConfig = deepClone(oldLayersConfig);
    } else {
      newLayersConfig = deepClone(this.layersConfig);
    }

    this.setConfigInstanceId(id);
    this.setLayersConfigInstanceToId(id, newLayersConfig);

    Object.keys(newLayersConfig).map((prop) => {
      const clonedGranules = cloneLayerConfigGranules(newLayersConfig[prop]);
      if (clonedGranules.size) this.granuleInstances.set(id, clonedGranules);
    });

    this.store.EventHandler.postEvent(EventTypes.EVENT_TOC_LAYER_CONFIGURATION_CREATED, id, newLayersConfig);

    return newLayersConfig;
  }

  getLayerFolderStructure(layersConfig: LayerJSONConfig, layerIds: Array<string>): Array<LayerConfig> {
    let layers: any;
    if (Object.prototype.toString.call(layersConfig) === '[object Object]') {
      layers = {};
      Object.keys(layersConfig).map((prop) => {
        const folder = this.getLayerFolderStructure(layersConfig[prop], layerIds);
        if (folder.length > 0) layers[prop] = folder;
      });
    } else if (Object.prototype.toString.call(layersConfig) === '[object Array]') {
      layers = [];
      for (let i = 0, len = layersConfig.length; i < len; i += 1) {
        const layerConfig = layersConfig[i];
        if (layerConfig.type === 'folder') {
          if (layerIds.indexOf(layerConfig.id) !== -1) {
            layers.push({
              type: layerConfig.type,
              id: layerConfig.id,
              title: layerConfig.title,
              folder: layerConfig.folder,
            });
          } else {
            const folder = this.getLayerFolderStructure(layerConfig.folder, layerIds);
            if (folder.length > 0) {
              layers.push({
                type: layerConfig.type,
                id: layerConfig.id,
                title: layerConfig.title,
                folder,
              });
            }
          }
        } else if (layerIds.indexOf(layerConfig.id) !== -1) {
          layers.push({
            type: layerConfig.type,
            id: layerConfig.id,
            title: layerConfig.title,
          });
        }
      }
    }

    return layers;
  }

  getLayerFolderStructure2(layersConfig: LayerConfig | any, layerId: Array<string>): any {
    if (Object.prototype.toString.call(layersConfig) === '[object Object]') {
      // for (const prop in layersConfig) {
      Object.keys(layersConfig).map((prop) => {
        const folder = this.getLayerFolderStructure(layersConfig[prop], layerId);
        if (folder.length > 0) return folder;
      });
    } else if (Object.prototype.toString.call(layersConfig) === '[object Array]') {
      for (let i = 0, len = layersConfig.length; i < len; i += 1) {
        const layerConfig = layersConfig[i];
        if (layerConfig.type === 'folder') {
          if (layerConfig.id === layerId) {
            return {
              type: layerConfig.type,
              id: layerConfig.id,
              title: layerConfig.title,
              children: layerConfig.children,
            };
          }
          const folder = this.getLayerFolderStructure(layerConfig.folder, layerId);
          if (folder.length > 0) {
            return {
              type: layerConfig.type,
              id: layerConfig.id,
              title: layerConfig.title,
              children: folder,
            };
          }
        } else if (layerConfig.id === layerId) {
          return {
            type: layerConfig.type,
            id: layerConfig.id,
            title: layerConfig.title,
          };
        }
      }
    }
  }

  /**
   * Remove a layer that has the given ID.
   * @param {Array<LayerConfig>} layers
   * @param layerId
   * @returns {number}
   */
  removeLayerById(layers: Array<LayerConfig>, layerId: string): Array<LayerConfig> {
    function recurse(_items): void {
      _items.forEach((item, idx) => {
        if (item.type === 'folder') {
          recurse(item.folder);
        } else if (item.type === 'layer') {
          if (item.id === layerId) _items.splice(idx, 1);
        }
      });
    }
    recurse(layers);
    return layers;
  }

  /**
   * Recursively loop through all LayerConfig elements and apply a UUID to it.
   * @param layers An array of LayerConfig objects
   */
  setLayerIds(layers: Array<LayerConfig>): void {
    layers.forEach((layer) => {
      if (layer.type === 'folder') {
        if (!Object.prototype.hasOwnProperty.call(layer, 'id') || layer.id === null || layer.id === '') {
          layer.id = `layer-${Math.abs(hashCode(layer.title + Math.random() * 10000 + Math.floor(Math.random() * 10 ** 5 + 1)))}`;
        }
        this.storeLayerIdentifiers(layer);
        this.setLayerIds(layer.folder);
      } else {
        if (typeof layer.timeseries === 'undefined') layer.loaded = true;
        if (!Object.prototype.hasOwnProperty.call(layer, 'id') || layer.id === null || layer.id === '') {
          layer.id = `layer-${Math.abs(hashCode(layer.name + Math.random() * 10000 + Math.floor(Math.random() * 10 ** 5 + 1)))}`;
        }

        this._layers.push(new Layer(layer));

        this.storeLayerIdentifiers(layer);
      }
    });
  }

  updateLayerConfiguration(layers: LayerConfig): LayerConfig {
    const layersObj = { ...layers };
    Object.keys(layersObj).map((o) => {
      const layer = layersObj[o];
      if (layer.type === 'folder') {
        this.updateLayerConfiguration(layer.folder);
      } else if (layer.type === 'layer') {
        if (layer.transparency !== undefined) {
          if (layer.transparency === true) {
            layer.opacity = 1;
          }
        }
      }
    });

    return layersObj;
  }

  // createPeriodicityWrappers(layers: LayerConfig): void {
  //   Object.keys(layers).map((o) => {
  //     let layer = layers[o];
  //     if (layer.type === 'folder') {
  //       layer = this.createPeriodicityWrappers(layer.folder);
  //     } else if (layer.type === 'layer') {
  //       if (layer.timeseries !== undefined) {
  //         // let periodConfig = JSON.parse(JSON.stringify(this.store.config.periods[layer.timeseries.type]))
  //         const periodConfig: PeriodConfig = deepClone(this.store.Config.sources.periods[layer.timeseries.type]);
  //
  //         periodConfig.type = layer.timeseries.type;
  //         // periodConfig.start = JSON.parse(JSON.stringify(layer.timeseries.start))
  //         periodConfig.start = deepClone(layer.timeseries.start);
  //         // periodConfig.end = JSON.parse(JSON.stringify(layer.timeseries.end))
  //         periodConfig.end = deepClone(layer.timeseries.end);
  //         this.store.Periodicity.createPeriodicityWrapper(periodConfig, layer.id);
  //         this.updateLayerName(layer);
  //       }
  //     }
  //   });
  //   // createPeriodicityWrappers(layers: Array<Layer>): void {
  //   //   layers.map(layer => {
  //   //     if (layer?.timeseries) {
  //   //       const periodConfig: PeriodConfig = deepClone(this.store.config.periods[layer.timeseries.type])
  //   //       periodConfig.type = layer.timeseries.type
  //   //       periodConfig.start = deepClone(layer.timeseries.start)
  //   //       periodConfig.end = deepClone(layer.timeseries.end)
  //   //       this.store.Periodicity.createPeriodicityWrapper(periodConfig, layer.id)
  //   //       this.updateLayerName(layer)
  //   //     }
  //   //   })
  //   // for (const o in layers) {
  //   //   Object.keys(layers).map(o => {
  //   //     let layer = layers[o]
  //   //     if (layer.type === 'folder') {
  //   //       layer = this.createPeriodicityWrappers(layer.folder)
  //   //     } else if (layer.type === 'layer') {
  //   //       if (layer.timeseries !== undefined) {
  //   //         // let periodConfig = JSON.parse(JSON.stringify(this.store.config.periods[layer.timeseries.type]))
  //   //         const periodConfig: PeriodConfig = deepClone(this.store.config.periods[layer.timeseries.type])
  //   //
  //   //         periodConfig.type = layer.timeseries.type
  //   //         // periodConfig.start = JSON.parse(JSON.stringify(layer.timeseries.start))
  //   //         periodConfig.start = deepClone(layer.timeseries.start)
  //   //         // periodConfig.end = JSON.parse(JSON.stringify(layer.timeseries.end))
  //   //         periodConfig.end = deepClone(layer.timeseries.end)
  //   //         this.store.Periodicity.createPeriodicityWrapper(periodConfig, layer.id)
  //   //         this.updateLayerName(layer)
  //   //       }
  //   //     }
  //   //   })
  //   // }
  // }

  /**
   * Get an array of all the unique timeseries URLs defined in the layers JSON.
   * @param {Array<LayerConfig>} layers
   * @param {Array<{source: string; layerIds: Array<string>}>} sources
   * @returns {Array<{source: string; layerIds: Array<string>}>}
   */
  getTimeseriesSourceList(
    layers: Array<LayerConfig>,
    sources: Array<{
      source: string;
      layerIds: Array<string>;
    }> = []
  ): Array<{
    source: string;
    layerIds: Array<string>;
  }> {
    layers.map((layer) => {
      if (layer.type === 'folder') {
        this.getTimeseriesSourceList(layer.folder, sources);
      } else if (layer.type === 'layer') {
        if (!isUndefined(layer.timeseries)) {
          let currentSource: {
            source: string;
            layerIds: Array<string>;
          };
          sources.map((layerSource) => {
            if (layerSource.source === layer.timeseries.source) {
              currentSource = layerSource;
            }
          });

          if (isUndefined(currentSource)) {
            sources.push({
              source: layer.timeseries.source,
              layerIds: [layer.id],
            });
          } else {
            currentSource?.layerIds.push(layer.id);
          }
        }
      }
    });

    return sources;
  }

  storeLayerIdentifiers(layer: LayerConfig): void {
    if (typeof layer.name === 'string' || typeof layer.title === 'string') {
      if (typeof layer.id === 'string' && layer.id !== '') {
        const itemName = layer.name ?? layer.title;
        const itemDescription = layer.description !== undefined ? unescape(layer.description) : '';

        this.layerIdentifiers.push({
          type: layer.type,
          id: layer.id,
          name: itemName,
          description: itemDescription,
        });
      } else {
        logger.error(`Layer id is not of a 'number' type: ${layer.id}`);
      }
    } else {
      logger.error(`Layer name is not of a 'String' type: ${layer.id}`);
    }
  }

  /**
   * Lookup and retrieve a layer name by its associated ID
   * @param id Layer identifier
   */
  getLayerNameByIdentifier(id: string): string {
    let layerName = '';
    this.layerIdentifiers.map((item) => {
      if (item.id === id) {
        layerName = item.name;
      }
    });

    return layerName;
  }

  /**
   * Returns a LayersConfig object with the associated ID.
   * If it is not found, `null` will be returned.
   * @param id A LayersConfig ID
   */
  getLayersConfigById(id: string): LayerJSONConfig {
    if (this.layersConfigInstances.has(id)) {
      return this.layersConfigInstances.get(id);
    }
    return null;
  }

  /**
   * Assign a LayersConfig object to a given ID.
   * @param id ID of the layers config object stored in `instancesOfLayersConfig`
   * @param layersConfig The config we want to assign to the given ID
   */
  setLayersConfigInstanceToId(id: string, layersConfig: LayerJSONConfig): void {
    this.layersConfigInstances.set(id, layersConfig);
  }

  /**
   * Return the instance ID for the current layers configuration.
   */
  getConfigInstanceId(): string {
    return this.configInstanceId;
  }

  /* Get the selected region */
  getSelectedRegion(): string {
    return this.store.Tools.cRegionTool.globalSelectedRegion;
  }

  /* Set the selected region */
  setSelectedRegion(value): void {
    this.store.Tools.cRegionTool.globalSelectedRegion = value;
  }

  /* Get the selected version */
  getSelectedVersion(): string {
    return this.store.Tools.cVersionSelectTool.globalSelectedVersion;
  }

  /* Set the selected version */
  setSelectedVersion(value): void {
    this.store.Tools.cVersionSelectTool.globalSelectedVersion = value;
  }

  /* Get the Version Region Config */
  getVersionRegionConfig(): string {
    return this.store.Tools.cVersionSelectTool.globalLayerConfig;
  }

  /* Set the Version Region Config */
  setVersionRegionConfig(value): void {
    this.store.Tools.cVersionSelectTool.globalLayerConfig = value;
  }

  /**
   * Check if the `configInstanceId` property is defined.
   */
  currentInstanceHasId(): boolean {
    return Boolean(this.getConfigInstanceId());
  }

  /**
   * Set the value of the `configInstanceId` property.
   * @param instanceId ID of the config instance.
   */
  setConfigInstanceId(instanceId: string): void {
    this.configInstanceId = instanceId;
  }

  /**
   * Return the layer description of a given identifier.
   * @param id A Layer ID
   */
  getLayerDescriptionByIdentifier(id: string): string {
    let layerDescription = '';
    this.layerIdentifiers.map((item) => {
      if (item.id === id) {
        if (item.description !== undefined) {
          layerDescription = unescape(item.description);
        }
      }
    });

    return layerDescription;
  }

  /**
   * Build the label and update the layer name.
   * @param layer
   */
  // updateLayerName(layer: LayerConfig): void {
  //   // const wrapper = this.store.Periodicity.getPeriodicityWrapperById(layer.id);
  //   const granule = globalThis.App.Layers._granules.get(layer.id);
  //
  //   // layer.name = this.getLayerNameByIdentifier(layer.id);
  //   // // layer.name = wrapper === null ? layer.name : wrapper.buildLabel(layer.name);
  //   // layer.name = granule === null ? layer.name : granule.buildLabel(layer.name);
  //
  //   // const { periodNum, year, periodType, folderType } = getTimePropsFromLayer(layer);
  //   // const wmstTime = periodToDate(periodNum, year, periodType);
  //   // layer.currentGranuleName = wmstTimeToGranuleName(wmstTime, folderType);
  //   layer.currentGranuleName = buildLayerGranuleName(layer);
  // }

  /**
   * Update the layer granule name. Fires an EVENT_TOC_LAYER_CONFIGURATION_UPDATED event.
   * @param {string} layerId
   */
  updateLayerAttributes(layerId: string): void {
    let layer: LayerConfig;
    const layersConfig = this.getLayersConfigById(this.getConfigInstanceId());
    Object.keys(layersConfig).map((lNode) => {
      layer = this.getLayerByID(layersConfig[lNode], layerId);
      if (layer?.id === layerId) {
        layer.currentGranuleName = buildLayerGranuleName(layer);
        this.store.EventHandler.postEvent(this.store.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED, layersConfig, this);
      }
    });
  }

  /**
   * Update the child layer granule name. Fires an EVENT_TOC_LAYER_CONFIGURATION_UPDATED event.
   * @param {string} layerId
   * @return {string}
   */
  updateChildLayerAttributes(layerId: string, activeInterval): string {
    let layer: LayerConfig;
    let granuleName;
    const layersConfig = this.getLayersConfigById(this.getConfigInstanceId());
    Object.keys(layersConfig).map((lNode) => {
      layer = this.getLayerByID(layersConfig[lNode], layerId);
      if (layer?.id === layerId) {
        granuleName = buildChildLayerGranuleName(layer, activeInterval);
        layer.currentGranuleName = granuleName;
        this.store.EventHandler.postEvent(this.store.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED, layersConfig, this);
      }
    });
    return granuleName;
  }

  /**
   * Return the LayerConfig associated with the current config instance.
   */
  // TODO: Unused??
  // getLayerAttributes(): LayerConfig {
  //   let layer
  //   const layersConfig = this.getLayersConfigById(this.getConfigInstanceId())
  //   for (const lNode in layersConfig) {
  //     if ((layer = this.getLayerByID(layersConfig[lNode], layer.id))) {
  //       // if ((layer = this.getLayerByID(layersConfig[lNode], this.id))) {
  //       return layer
  //     }
  //   }
  // }

  /**
   * Return the layer associated with a given ID.
   * @param layers An array of `LayerConfig` objects.
   * @param id The layer identifier to filter by.
   */
  getLayerByID(layers: Array<LayerConfig>, id: string): LayerConfig {
    let layer: LayerConfig = {
      granule: undefined,
      display: false,
      loadOnly: false,
      mask: false,
      name: '',
      source: undefined,
      srs: '',
      transparency: false,
      type: undefined,
      zIndex: 0,
    };

    // return this.layers.find(layer => layer.id === id)

    if (layers) {
      for (let eachLayer of layers) {
        if (eachLayer.type === 'folder') {
          eachLayer = this.getLayerByID(eachLayer.folder, id);
          if (eachLayer?.id === id) {
            layer = eachLayer;
            break;
          }
        } else if (eachLayer.type === 'layer') {
          if (eachLayer.id === id) {
            layer = eachLayer;
            break;
          }
        }
      }
    }

    return layer;
  }

  isLayerTransparent(id: string): boolean {
    let layer: LayerConfig;
    const jsonConfig: LayerJSONConfig = this.getLayersConfigById(this.getConfigInstanceId());

    Object.keys(jsonConfig).map((lNode) => {
      layer = this.getLayerByID(jsonConfig[lNode], id);
      if (layer?.id === id) {
        layer = jsonConfig[lNode];
      }
    });

    if (layer?.transparency !== undefined) {
      if (layer.transparency === true) {
        return true;
      }
    }

    return false;
  }

  /**
   * Set the `expanded` property of a layer to `true` or `false`.
   * @param layerId A `LayerConfig` identifier.
   * @param expanded The boolean value to set the `expanded` property to.
   */
  setFolderToggle(layerId: string, expanded: boolean): void {
    let layer: LayerConfig;
    const jsonConfig: LayerJSONConfig = this.getLayersConfigById(this.getConfigInstanceId());

    Object.keys(jsonConfig).map((lNode) => {
      layer = this.getLayerByID(jsonConfig[lNode], layerId);
      if (layer?.id === layerId) {
        layer.expanded = expanded;
      }
      // if (layer = this.getLayerByID(jsonConfig[lNode], layerId)) {
      //   break
      // }
    });
    // Object.keys(jsonConfig).map(lNode => {
    //   const l = this.getLayerByID(jsonConfig[lNode], layerId)
    //   if (l.id === layerId) {
    //     l.expanded = expanded
    //   }
    // })

    // layer.expanded = expanded
  }

  /**
   * Set the `display` property of a layer to `true` or `false`.
   * @param {string} layerId A `LayerConfig` identifier.
   * @param {boolean} checked The boolean value to set the `checked` property to.
   */
  setLayerDisplay(layerId: string, checked: boolean): void {
    let layer: LayerConfig;
    const jsonConfig = this.getLayersConfigById(this.getConfigInstanceId());
    Object.keys(jsonConfig).map((lNode) => {
      layer = this.getLayerByID(jsonConfig[lNode], layerId);
      if (layer?.id === layerId) {
        layer.display = checked;
      }
    });

    this.store.EventHandler.postEvent(this.store.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED, jsonConfig, this);
  }

  /**
   * Set the value of a layer's opacity property.
   * @param {string} layerId A `LayerConfig` identifier.
   * @param {number} newValue An opacity to set the layer to.
   */
  setLayerOpacity(layerId: string, newValue: number): void {
    let layer: LayerConfig;
    const jsonConfig: LayerJSONConfig = this.getLayersConfigById(this.getConfigInstanceId());

    Object.keys(jsonConfig).map((lNode) => {
      layer = this.getLayerByID(jsonConfig[lNode], layerId);
      if (layer?.opacity || layer?.opacity === 0) {
        layer.opacity = newValue;
      }
    });

    this.store.EventHandler.postEvent(this.store.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED, jsonConfig, this);
  }

  /**
   * Return the `opacity` value for a given layer ID.
   * @param layerId A `LayerConfig` identifier.
   */
  getLayerOpacity(layerId: string): number {
    let opacity: number;
    let layer: LayerConfig;
    const layerConfig = this.getLayersConfigById(this.getConfigInstanceId());
    for (const lNode of Object.keys(layerConfig)) {
      layer = this.getLayerByID(layerConfig[lNode], layerId);
      if (layer) {
        opacity = layer.opacity;
        break;
      }
    }

    return opacity;
  }

  /**
   * Checks if any layer in a given array contains a `featureInfo` property.
   * @param {Array<LayerConfig>} layers An array of `LayerConfig` objects.
   * @returns {boolean}
   */
  anyLayerHasFeatureInfo(layers: Array<LayerConfig>): boolean {
    for (const layer of layers) {
      if (layer.type === 'folder') {
        if (this.anyLayerHasFeatureInfo(layer.folder)) return true;
      } else if (layer.type === 'layer') {
        if (layer.display === true && objPropExists(layer, 'featureInfo')) return true;
      }
    }

    return false;
  }

  /**
   * Checks if any layer in a given array contains a `timeseries` property.
   * @param {Array<LayerConfig>} layers An array of `LayerConfig` objects.
   * @returns {boolean}
   */
  anyLayerHasTimeSeries(layers: Array<LayerConfig>): boolean {
    for (const layer of layers) {
      if (layer.type === 'folder') {
        if (this.anyLayerHasTimeSeries(layer.folder)) return true;
      } else if (layer.type === 'layer') {
        if (layer.display === true && Object.prototype.hasOwnProperty.call(layer, 'timeseries')) return true;
      }
    }

    return false;
  }

  // getTitle(options: {
  //   layers?: Array<LayerConfig>
  //   layerId?: string
  //   depth?: number
  // }) {
  //   for (const layer of options.layers) {
  //     if (layer.type === 'folder') {
  //       let childLayer = this.getTitle({
  //         layers: layer.folder,
  //         layerId: options.layerId,
  //         depth: options.depth + 1
  //       })
  //       if (childLayer !== false) {
  //         if (options.depth > 0) {
  //           return layer.title + ' ' + childLayer
  //         } else {
  //           return childLayer
  //         }
  //       }
  //     } else if (layer.type === 'layer') {
  //       if (layer.display === true && layer.mask !== true && layer.loadOnly !== true) {
  //         let unit = typeof layer.unit !== 'undefined' && layer.unit !== '' ? ' (' + layer.unit + ')' : ''
  //         if (typeof layer.timeseries !== 'undefined') {
  //           let periodicityWrapper: PeriodicityWrapper = context.store.Periodicity.getPeriodicityWrapperById(layer.id)
  //           return layer.title + ' ' + periodicityWrapper.buildDisplayLabel(periodicityWrapper.format) + unit
  //         } else {
  //           return layer.title + unit
  //         }
  //       }
  //     }
  //   }
  // }

  /**
   * Retrieve the title for a given layer ID.
   * @param {LayerJSONConfig} layers
   * @param {string} layerId
   * @returns {string}
   */
  getLayerTitleById(layers: LayerJSONConfig, layerId: string): string {
    const getTitle = (_layers: Array<LayerConfig>, _layerId: string, depth: number): string | boolean => {
      for (const layer of _layers) {
        if (layer.type === 'folder') {
          const childLayer = getTitle(layer.folder, _layerId, depth + 1);
          if (childLayer !== false) {
            if (depth > 0) {
              return `${layer.title} ${childLayer}`;
            }
            return childLayer;
          }
        } else if (layer.type === 'layer') {
          if (layer.id === _layerId) {
            return buildLabel(layer);
          }
        }
      }

      return false;
    };

    let title: string | boolean = 'No Layers Selected';

    Object.keys(layers).map((prop) => {
      if (layers[prop]) {
        const layerTitle = getTitle(layers[prop], layerId, 0);
        if (layerTitle !== false) {
          title = layerTitle;
        }
      }
    });

    return title;
  }

  /**
   * Retrieve the title of the layer at the topmost level of a tree structure.
   * @param {LayerJSONConfig} layers
   * @returns {string}
   */
  getTopLayerTitle(layers: Array<LayerConfig>): string {
    const getTitle = function (_layers: Array<LayerConfig>, context: LayerHandler): string | boolean {
      for (const layer of _layers) {
        if (layer.type === 'folder') {
          const childLayer = getTitle(layer.folder, context);
          if (childLayer !== false) {
            if (layer.title !== 'Dataset') {
              return `${layer.title} ${childLayer}`;
            }
            return childLayer;
          }
        } else if (layer.type === 'layer') {
          if (layer.display === true && layer.mask !== true && layer.loadOnly !== true) {
            return buildLabel(layer);
          }
        }
      }

      return false;
    };

    const title = getTitle(layers, this);
    if (title === false) return 'No Layers Selected';
    return `${title}`;
  }

  /**
   * Retrieve the layer at the topmost level of a tree structure.
   * @param {Array<LayerConfig>} layers
   * @returns {LayerConfig | boolean}
   */
  getTopLayer(layers: Array<LayerConfig>): LayerConfig | boolean {
    for (const layer of layers) {
      if (layer.type === 'folder') {
        const childLayer = this.getTopLayer(layer.folder);
        if (childLayer !== false) return childLayer;
      } else if (layer.type === 'layer') {
        if (layer.display === true && layer.mask === false && layer.loadOnly !== true) {
          return layer;
        }
      }
    }
    return false;
  }

  /**
   * Retrieve the display name for a layer.
   * @param layerWeWant
   * @param layers
   * @returns {string}
   */
  getDisplayNameForLayer(layerWeWant: LayerConfig, layers: Array<LayerConfig>): string {
    const getTitle = function (layerWeWant: LayerConfig, layers: Array<LayerConfig>, context: LayerHandler): string | boolean {
      for (const layer of layers) {
        if (layer.type === 'folder') {
          const childLayer = getTitle(layerWeWant, layer.folder, context);

          if (childLayer !== false) {
            if (layer.title !== 'Dataset') {
              if (layerWeWant.ignoreFolderTitle) return `${childLayer}`;
              return `${layer.title} ${childLayer}`;
            }
            return childLayer;
          }
        } else if (layer.type === 'layer') {
          if ((layer.display === true || layer.loadOnly === true) && layer.mask !== true && layer.id === layerWeWant.id) {
            return buildLabel(layer);
          }
        }
      }

      return false;
    };

    const title = getTitle(layerWeWant, layers, this);
    if (title === false) return 'No Layers Selected';
    return `${title}`;
  }

  /**
   * Recursively find layers in the given `keys` with parameters that match the passed `queryParams` object.
   * @param {LayerConfig} layersConfig
   * @param {Dictionary} queryParams
   * @param {Array<string>} keys
   * @returns {Array<LayerConfig>}
   */
  query(
    layersConfig: LayerConfig,
    queryParams: ((layer: LayerConfig) => boolean) | Record<string, any>,
    keys?: Array<'overlays' | 'boundaries' | 'baselayers' | 'additional' | 'hidden'>
  ): Array<LayerConfig> {
    const queryFunc = function (
      layers: Array<LayerConfig> | LayerConfig,
      queryParams: ((layer: LayerConfig) => boolean) | Record<string, string>,
      isFunction: boolean,
      layersReturn: Array<LayerConfig> = []
    ): Array<LayerConfig> {
      const checkParams = function (layer: LayerConfig, queryParams: Record<string, any>): boolean {
        for (const prop in queryParams) {
          if (typeof queryParams[prop] === 'function') {
            if (queryParams[prop](layer) === false) {
              return false;
            }
          } else if (!objPropExists(layer, prop)) {
            // Property doesn't exist
            if (queryParams[prop] !== '!*') return false;
          } else if (typeof queryParams[prop] === 'string') {
            // If value is an asterisk, that means to only check if property exists.
            // If value is preceded by !, that means not equal to.
            if (
              queryParams[prop] !== '*' &&
              ((queryParams[prop].substr(0, 1) === '!' && layer[prop] === queryParams[prop].substr(1)) || layer[prop] !== queryParams[prop])
            ) {
              return false;
            }
          } else if (typeof queryParams[prop] === 'boolean' || typeof queryParams[prop] === 'number') {
            // Check for values that don't match
            if (layer[prop] !== queryParams[prop]) {
              return false;
            }
          } else if (checkParams(layer[prop], queryParams[prop]) === false) {
            return false;
          }
        }
        return true;
      };

      for (let i = 0, len = layers?.length; i < len; i += 1) {
        const layer = layers[i];

        if (isFunction) {
          queryParams = queryParams as (layer: LayerConfig) => boolean;
          if (queryParams(layer) === true) {
            layersReturn.push(layer);
          } else if (layer.type === 'folder') {
            queryFunc(layer.folder, queryParams, isFunction, layersReturn);
          }
        } else if (checkParams(layer, queryParams) === true) {
          layersReturn.push(layer);
        } else if (layer.type === 'folder') {
          queryFunc(layer.folder, queryParams, isFunction, layersReturn);
        }
      }

      return layersReturn;
    };

    let layersReturn: Array<LayerConfig> = [];
    if (typeof layersConfig !== 'undefined') {
      const isFunction = queryParams instanceof Function;
      if (typeof keys === 'undefined') {
        if (Object.prototype.toString.call(layersConfig) === '[object Array]') {
          // Passed an array of folder or layers
          layersReturn = queryFunc(layersConfig, queryParams, isFunction);
        } else if (layersConfig?.type === 'folder') {
          // Passed a folder
          layersReturn = queryFunc(layersConfig.folder, queryParams, isFunction);
        }
      } else {
        for (let i = 0, len = keys.length; i < len; i += 1) {
          // Passed the full layers config
          if (objPropExists(layersConfig, keys[i]) === true) {
            layersReturn = layersReturn.concat(queryFunc(layersConfig[keys[i]], queryParams, isFunction));
          }
        }
      }
    }

    return layersReturn;
  }

  /**
   * Move a layer
   * @param {LayerConfig} layersConfig
   * @param {string} layerId
   * @param {string} targetId
   * @param {"append" | "after"} position
   */
  moveLayer(layersConfig: LayerConfig, layerId: string, targetId: string, position: 'append' | 'after'): void {
    const findLayerPosition = function (layersConfig: LayerConfig, layerId: string) {
      const getPosition = function (
        layers: Array<LayerConfig>,
        layerId: string,
        parentId: string,
        obj: {
          index: number;
          idx: boolean;
          parentId: string;
        } = {
          index: 0,
          idx: false,
          parentId: null,
        }
      ) {
        // if (typeof obj === 'undefined') {
        //   obj = {
        //     index: false,
        //     parentId: null
        //   }
        // }

        for (let i = 0, len = layers.length; i < len; i += 1) {
          const layer = layers[i];

          if (layer.id === layerId) {
            obj.index = i;
          } else if (layer.type === 'folder') {
            obj = getPosition(layer.folder, layerId, layer.id, obj);
          }

          if (obj.idx !== false) {
            if (obj.parentId === null) obj.parentId = parentId;
            return obj;
          }
        }

        return obj;
      };

      let layerPosition;

      if (Object.prototype.toString.call(layersConfig) === '[object Array]') {
        layerPosition = getPosition((layersConfig as unknown) as Array<LayerConfig>, layerId, layersConfig.id);
      } else if (Object.prototype.toString.call(layersConfig) === '[object Object]') {
        for (const prop of Object.keys(layersConfig)) {
          layerPosition = getPosition(layersConfig[prop], layerId, layersConfig[prop].id);
          if (layerPosition.parentId !== null) break;
        }
      }

      return layerPosition;
    };

    const layerPosition = findLayerPosition(layersConfig, layerId);
    const layerParent = this.query(layersConfig, { id: layerPosition.parentId }, ['overlays', 'additional', 'boundaries', 'baselayers'])[0];

    const layer = layerParent.folder.splice(layerPosition.index, 1)[0];
    const targetPosition = findLayerPosition(layersConfig, targetId);
    let { index } = targetPosition;

    if (position === 'append') {
      // const targetFolder = this.query(layersConfig, { id: targetPosition.id }, ['overlays', 'additional', 'boundaries', 'baselayers'])[0];
      const targetFolder = this.query(layersConfig, { id: targetPosition.index }, ['overlays', 'additional', 'boundaries', 'baselayers'])[0];
      targetFolder.folder.push(layer);
    } else {
      if (position === 'after') index += 1;
      const targetParent = this.query(layersConfig, { id: targetPosition.parentId }, ['overlays', 'additional', 'boundaries', 'baselayers'])[0];
      targetParent.folder.splice(index, 0, layer);
    }

    this.store.EventHandler.postEvent(this.store.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED, layersConfig, this);
  }

  /**
   * Clear all set feature info.
   * @param {LayerConfig} layersConfig
   */
  clearFeatureInfo(layersConfig: LayerConfig): void {
    const layers = this.query(
      layersConfig,
      {
        type: 'layer',
        featureInfo: '*',
      },
      ['overlays', 'boundaries']
    );

    for (let i = 0, len = layers.length; i < len; i += 1) {
      const layer = layers[i];
      const { featureInfo } = layer;
      Object.keys(featureInfo).map((prop) => {
        featureInfo[prop].value = null;
        featureInfo[prop].displayValue = null;
      });
    }

    this.store.EventHandler.postEvent(this.store.EventHandler.types.EVENT_LAYER_CONFIGURATION_FEATUREINFO_UPDATED, null, null);
  }

  /**
   * Returns an object containing properties related to time.
   * @param {object} layer
   * @returns {object}
   */
  getTimePropsFromLayer(layer: LayerConfig): { folderType: string; periodType: string; periodNum: number; year: number } {
    const layerName = layer.name;
    // Split apart the layer name
    const splitPeriod = layerName.split('_');

    // Grab the period string from the layer name
    const periodMeta = splitPeriod[2];

    // Grab the folder type from the layer name (data, anomaly, z-score, etc)
    const folderType = splitPeriod[splitPeriod.length - 1];
    const typeDateSeparatorIndex = periodMeta.indexOf('-', 2);

    // Split apart the period string and get the period and year
    const splitDate = periodMeta.slice(typeDateSeparatorIndex + 1).split('-');
    const periodNum = Number(splitDate[0]);
    const year = Number(splitDate[1]);

    return {
      folderType,
      periodType: layer.timeseries.type,
      periodNum,
      year,
    };
  }

  /**
   * Retrieve a list of seasons for a given layer.
   * @param {LayerConfig} layer
   * @param {number} seasonStart
   * @returns {Array<string>}
   */
  getSeasonsList(layer: LayerConfig, seasonStart: number): Array<string> {
    const seasons: Array<string> = [];
    let tempYear;
    const granule = globalThis.App.Layers._granules.get(layer.id);
    const endYear = granule.end.getFullYear();

    for (let startYear = granule.start.getFullYear(); startYear <= endYear; startYear += 1) {
      if (seasonStart > 1) {
        // eslint-disable-next-line no-continue
        if (startYear === granule.start.getFullYear() && granule.start.getMonth() + 1 >= seasonStart) continue;
        // eslint-disable-next-line no-continue
        if (startYear === granule.end.getFullYear() && granule.end.getMonth() + 1) continue;
        tempYear = startYear + 1;
        seasons.push(`${startYear}-${tempYear}`);
      } else {
        seasons.push(String(startYear));
      }
    }

    const otherYears = layer.timeseries.others || [];
    if (otherYears.length > 0) {
      let oy = 0;
      while (oy < otherYears.length) {
        seasons.push(String(otherYears[oy]));
        oy += 1;
      }
    }

    return seasons;
  }

  /**
   * Retrieve a specific `LayerConfig` from an array of `LayerConfig` objects.
   * @param {string} layerId
   * @param {Array<LayerConfig>} toolConfigs
   * @returns {LayerConfig}
   */
  getLayerConfig(layerId: string, toolConfigs: Array<LayerConfig>): LayerConfig {
    for (let i = 0, len = toolConfigs.length; i < len; i += 1) {
      const toolConfig = toolConfigs[i];
      if (toolConfig.id === layerId) {
        return toolConfig;
      }
    }
    return null;
  }

  // TODO: Move all the feature functions to a helper file and and update references.
  /**
   * Filter a feature's properies by a list of types.
   * @param {Array<FeatureInfoConfig>} featureInfoConfigs
   * @param {Array<string>} types
   * @param {string} propertyName
   * @returns {Array<FeatureInfoConfig>}
   */
  getFeaturePropertiesByTypes(featureInfoConfigs: Array<FeatureInfoConfig>, types: Array<string>, propertyName?: string): Array<FeatureInfoConfig> {
    const returnConfigs: Array<FeatureInfoConfig> = [];
    // Object.keys(featureInfoConfig).map(featureKey => {
    //   if (types.includes(featureKey)) {
    //     if (typeof propertyName !== 'undefined') {
    //       returnConfigs.push(featureInfoConfig[propertyName])
    //     } else {
    //       returnConfigs.push(featureInfoConfig)
    //     }
    //   }
    // })

    for (let i = 0, len = featureInfoConfigs.length; i < len; i += 1) {
      const config = featureInfoConfigs[i];
      if (types.indexOf(config.type) !== -1) {
        if (typeof propertyName !== 'undefined') {
          returnConfigs.push(config[propertyName]);
        } else {
          returnConfigs.push(config);
        }
      }
    }
    return returnConfigs;
  }

  filterByTypes(configs: Array<LayerConfig>, types: Array<string>, propertyName?: string): Array<LayerConfig> {
    const returnConfigs = [];
    for (let i = 0, len = configs.length; i < len; i += 1) {
      const config = configs[i];
      if (types.indexOf(config.type) !== -1) {
        if (typeof propertyName !== 'undefined') {
          returnConfigs.push(config[propertyName]);
        } else {
          returnConfigs.push(config);
        }
      }
    }
    return returnConfigs;
  }

  /**
   * Get the ID of a feature.
   * @param {Array<FeatureInfoConfig>} featureInfoConfigs
   * @param {FeatureInfo} featureInfo
   * @returns {string | Array<Dictionary> | number}
   */
  getFeatureId(featureInfoConfigs: Array<FeatureInfoConfig>, featureInfo: FeatureInfo) {
    const featureIdConfigs = this.getFeaturePropertiesByTypes(featureInfoConfigs, ['id']);
    return this.getFeatureInfoValue(featureInfo, featureIdConfigs[0].propertyName);
  }

  /**
   * Get the ID property of a feature.
   * @param {Array<FeatureInfoConfig>} featureInfoConfigs
   * @returns {string | null}
   */
  getFeatureIdProperty(featureInfoConfigs: Array<FeatureInfoConfig>) {
    for (let i = 0, len = featureInfoConfigs.length; i < len; i += 1) {
      const config = featureInfoConfigs[i];
      if (config.type === 'id') {
        return config.propertyName;
      }
    }
    return null;
  }

  getCqlFilterIdQuery(featureInfoConfigs: Array<FeatureInfoConfig>, featureInfo: FeatureInfo): string {
    const featureIdConfigs = this.getFeaturePropertiesByTypes(featureInfoConfigs, ['id']);
    const featureIdQuery = [];
    for (let i = 0, len = featureIdConfigs.length; i < len; i += 1) {
      const config = featureIdConfigs[i];
      const value = this.getFeatureInfoValue(featureInfo, config.propertyName);
      if (value !== null) featureIdQuery.push(`${config.propertyName} = '${value}'`);
    }
    return featureIdQuery.join(' AND ');
  }

  /**
   * Retrieve a value from a FeatureInfo object.
   * @param {Dictionary} featureInfo
   * @param {string} propertyName
   * @returns {Dictionary[keyof Dictionary]}
   */
  getFeatureInfoValue(featureInfo: FeatureInfo, propertyName: string): FeatureInfo[keyof FeatureInfo] {
    if (objPropExists(featureInfo, propertyName)) {
      return featureInfo[propertyName];
    }
    for (const prop of Object.keys(featureInfo)) {
      if (Object.prototype.toString.call(featureInfo[prop]) === '[object Object]') {
        const value = this.getFeatureInfoValue(featureInfo[prop], propertyName);
        if (value !== null) return value;
      }
    }
    return null;
  }
}
