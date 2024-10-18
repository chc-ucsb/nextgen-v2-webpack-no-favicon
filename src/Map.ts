import {
  BingMaps,
  ImageWMS,
  OSM,
  Stamen,
  TileArcGISRest,
  TileImage,
  TileWMS,
  Vector as VectorSource,
  VectorTile as VectorTileSource,
  XYZ,
} from 'ol/source';
import OLMap from 'ol/Map';
import View from 'ol/View';
import { Tile, Vector as VectorLayer, VectorTile } from 'ol/layer';
import MVT from 'ol/format/MVT';
import { unByKey } from 'ol/Observable';
import { ScaleLine, Zoom } from 'ol/control';
import { transform } from 'ol/proj';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import { Fill, Icon, Stroke, Style } from 'ol/style';
import proj4 from 'proj4';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import VectorTileLayer from 'ol/layer/VectorTile';
import ImageSource from 'ol/source/Image';
import ImageLayer from 'ol/layer/Image';
import { GeoJSON } from 'ol/format';
import { Geometry } from 'ol/geom';
import { objPropExists } from './helpers/object';
import { getRegionWithRegionID, logger } from './utils';
import { Dict, Dictionary, ExtentType, FeatureInfo, LayerConfig, LayerJSONConfig, RegionConfig } from './@types';
import crosshairIcon from '../assets/images/crosshair.png';
import { Transport } from './Network/Transport';
import { buildUrl, getBaseUrl, getUrlQueryString, objFromUrlQueryParams, objToUrlQueryParams, propExists } from './helpers/string';
import { addTimeToWMSParams } from './LayerHandler';

type CoordType = [number, number];

type SourceType = 'bing' | 'osm' | 'stamen' | 'image' | 'tile' | 'vectortile' | 'vectorlayer' | 'xyz' | 'arcgis';

export class MapWrapper {
  Map: ((options: any) => OLMap | MapWrapper) | any;
  controls: any = {};

  constructor() {
    this.Map = (options: any): OLMap => {
      const map: OLMap | any = new OLMap(options);

      // Assign the required functions directly to the OpenLayers Map object.
      map.tileLoadInitCallback = function (): void {
        // Overwrite this method in a tool to execute code when layer loading starts.
      };

      map.tileLoadCompleteCallback = function (): void {
        // Overwrite this method in a tool to execute code when all layers are loaded.
      };

      map.checkLayerLoadingComplete = function (): void {
        const layers = this.getLayers().getArray();
        let loadingComplete = true;

        layers.forEach((layer) => {
          const { loading, loaded } = layer.getSource() as Record<string, number>;
          loadingComplete = loading === loaded;
        });

        if (loadingComplete === true) {
          this.tileLoadCompleteCallback();
        }
      };

      return map;
    };
  }

  /**
   * Creates a new layer source with extra callbacks assigned.
   * @param {SourceType} type
   * @param options
   * @returns {TileImage | ImageSource}
   */
  getSource(type: SourceType, options: any): TileImage | ImageSource {
    let src;

    switch (type) {
      case 'bing':
        src = new BingMaps(options);
        break;
      case 'osm':
        src = new OSM(options);
        break;
      case 'stamen':
        src = new Stamen(options);
        break;
      case 'image':
        src = new ImageWMS(options);
        break;
      case 'vectortile':
        src = new VectorTileSource(options);
        break;
      case 'vectorlayer':
        src = new VectorSource(options);
        break;
      case 'xyz':
        src = new XYZ(options);
        break;
      case 'arcgis':
        src = new TileArcGISRest(options);
        break;
      case 'tile':
      default:
        src = new TileWMS(options);
    }

    src.resetTileLoadCount = this.resetTileLoadCount;
    src.tileLoadStartCallback = this.tileLoadStartCallback;
    src.tileLoadEndCallback = this.tileLoadErrorCallback;
    src.tileLoadErrorCallback = this.tileLoadErrorCallback;

    src.resetTileLoadCount();

    return src;
  }

  resetTileLoadCount = function (): void {
    this.loading = 0;
    this.loaded = 0;
  };

  tileLoadStartCallback = function (): void {
    if (this.loading === 0) {
      const map = this.get('map');
      map.tileLoadInitCallback();
    }
    this.loading += 1;
  };

  tileLoadErrorCallback = function (): void {
    if (this.get('tileLoadCanceled') === true) return;
    setTimeout(
      function (source) {
        source.loaded += 1;
        if (source.loaded === source.loading || source.loaded > source.loading) {
          const map = source.get('map');
          if (map) {
            map.checkLayerLoadingComplete();
          }
        }
      },
      100,
      this
    );
  };

  /**
   * Sort items in ascending order based on their zIndex.
   * @param a
   * @param b
   * @returns {number}
   */
  zIndexSortAscending(a: LayerConfig, b: LayerConfig): number {
    const keyA = a.zIndex;
    const keyB = b.zIndex;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  }

  /**
   * Get the index of a layer within a given OpenLayers Map object.
   * @param layerId
   * @param openLayersMapObject
   * @returns {number}
   */
  getOpenLayersLayerIndex(layerId: string, openLayersMapObject: OLMap): number {
    const olLayers = openLayersMapObject.getLayers().getArray();
    for (let i = 0, len = olLayers.length; i < len; i += 1) {
      const layer = olLayers[i];
      if (layer.get('mapperLayerIdentifier') === layerId) return i;
    }
    // return false;
    return null;
  }

  /**
   * Get OL layers from JSON layer object
   *
   * @param jsonLayer - JSON layer object
   * @param openLayersMapObject - OL map object
   */
  getOpenLayersLayerFromJsonLayer(jsonLayer, openLayersMapObject: OLMap) {
    let newSource;

    // adding the tiled:true makes the requests use geoserver's gwc
    // see https://github.com/openlayers/ol3/issues/2143
    // if you need the server to send in a specific projection, you can do this
    const layerBrand = jsonLayer.brand ? jsonLayer.brand : null;

    if (jsonLayer.source?.vectorTile) {
      let srcUrl;
      if (jsonLayer.source.vectorTile.endsWith('.pbf')) {
        srcUrl = jsonLayer.source.vectorTile;
      } else {
        srcUrl = `${jsonLayer.source.vectorTile}${jsonLayer.name}/${jsonLayer.srs}/pbf/{z}/{x}/{-y}.pbf`;
      }
      newSource = this.getSource('vectortile', {
        format: new MVT({ idProperty: 'iso_a3' }),
        mapperLayerIdentifier: jsonLayer.id,
        url: srcUrl,
        attributions: null,
        crossOrigin: null, // https://help.openstreetmap.org/questions/38308/osm-tile-server-how-to-enable-cors
      });

      this.addEventsToLayerSource(newSource, openLayersMapObject);

      const vTile = new VectorTile({
        declutter: true,
        source: newSource,
        extent: jsonLayer.extent, // OL docs says that an undefined extent is the default E.G it doesn't use one, so if it isn't defined in layers.ts it will not use an extent.
        style: new Style({
          fill: new Fill({ color: 'rgba(0, 0, 0, 0)' }),
          stroke: new Stroke({
            color: '#000000',
            width: 1.25,
          }),
        }),
      });

      vTile.set('mapperLayerIdentifier', jsonLayer.id);
      vTile.set('name', jsonLayer.name);
      return vTile;
    }

    // new source definition
    if (layerBrand !== null) {
      // Bing maps - base layer
      if (layerBrand === 'bing') {
        const { key, imagerySet } = jsonLayer;
        newSource = this.getSource('bing', {
          key,
          imagerySet,
          mapperLayerIdentifier: jsonLayer.id,
          // use maxZoom 19 to see stretched tiles
          // instead of the BingMaps
          // "no photos at this zoom level" tiles
          // maxZoom: 19
        });
      }
      // OSM maps - base layer
      // if url is undefined, the base layer will be the standard OSM,
      // else the base layer will a OSM contributing map (e.g. Thunderforest Maps)
      if (layerBrand === 'osm') {
        newSource = this.getSource('osm', {
          mapperLayerIdentifier: jsonLayer.id,
          url: jsonLayer.source.url,
          attributions: null,
          crossOrigin: null, // https://help.openstreetmap.org/questions/38308/osm-tile-server-how-to-enable-cors
        });
      }

      if (layerBrand === 'stamen') {
        const layerConfig: Dict<any> = {
          layer: jsonLayer.layer,
          mapperLayerIdentifier: jsonLayer.id,
        };
        if (jsonLayer.source) layerConfig.key = jsonLayer.source.key;
        newSource = this.getSource('stamen', layerConfig);
      }

      if (layerBrand === 'image') {
        const sourceWMSURL = jsonLayer.source.wms;
        const sourceGWCURL = jsonLayer.source.gwc;
        const isVisible = jsonLayer.display;
        const params = this.getWMSParams(jsonLayer, openLayersMapObject);
        const options = {
          url: propExists(sourceGWCURL) ? sourceGWCURL : sourceWMSURL,
          params,
          tileLoadFunction: this.imagePostFunction,
          visibility: jsonLayer.loadOnly ? false : isVisible,
        };
        newSource = this.getSource('image', options);
      }

      if (layerBrand === 'arcgis') {
        const sourceArcGISURL = jsonLayer.source.arcgis;
        newSource = this.getSource('arcgis', {
          url: sourceArcGISURL,
        });
      }
    } else {
      const displayTitle = jsonLayer.title;
      const sourceWMSURL = jsonLayer.source.wms;
      const sourceGWCURL = jsonLayer.source.gwc;
      const sourceXYZURL = jsonLayer.source.xyz;
      const isVisible = jsonLayer.display;
      const { cqlFilter } = jsonLayer;

      if (sourceXYZURL) {
        newSource = this.getSource('xyz', {
          url: sourceXYZURL,
        });
      } else if (jsonLayer.source?.geojson) {
        // create url for features
        const url = buildUrl(jsonLayer.source.geojson, {
          service: 'WFS',
          request: 'GetFeature',
          version: '1.1.0',
          typeNames: jsonLayer.name,
          outputFormat: 'application/json',
        });

        newSource = this.getSource('vectorlayer', {
          format: new GeoJSON(),
          url,
        });

        // // Check if the WFS request is cached
        // if (this.wfsCache.has(jsonLayer.name)) {
        //   newSource = this.getSource('vectorlayer', {
        //     features: new GeoJSON().readFeatures(this.wfsCache.get(jsonLayer.name)),
        //   });
        // } else {
        //   // create url for features
        //   const url = buildUrl(jsonLayer.source.geojson, {
        //     service: 'WFS',
        //     request: 'GetFeature',
        //     version: '1.1.0',
        //     typeNames: jsonLayer.name,
        //     outputFormat: 'application/json',
        //   });
        //
        //   newSource = this.getSource('vectorlayer', {
        //     format: new GeoJSON(),
        //     loader() {
        //       const xhr = new XMLHttpRequest();
        //       xhr.open('GET', url);
        //       const onError = () => console.log('error');
        //       xhr.onerror = onError;
        //       xhr.onload = function () {
        //         if (xhr.status == 200) {
        //           debugger;
        //           newSource.addFeatures(newSource.getFormat().readFeatures(xhr.responseText));
        //         } else {
        //           onError();
        //         }
        //       };
        //       xhr.send();
        //     },
        //   });
        // }

        this.addEventsToLayerSource(newSource, openLayersMapObject);

        const vLayer = new VectorLayer({
          source: newSource,
          style: new Style({
            fill: new Fill({ color: 'rgba(0, 0, 0, 0)' }),
            stroke: new Stroke({
              color: '#000000',
              width: 1.25,
            }),
          }),
        });

        vLayer.set('mapperLayerIdentifier', jsonLayer.id);
        vLayer.set('name', jsonLayer.name);
        return vLayer;
      } else {
        const params = this.getWMSParams(jsonLayer, openLayersMapObject);
        const options: any = {
          url: propExists(sourceGWCURL) ? sourceGWCURL : sourceWMSURL,
          params,
          tileLoadFunction: this.imagePostFunction,
          visibility: jsonLayer.loadOnly ? false : isVisible,
        };

        if (jsonLayer.isAdded) {
          if (jsonLayer.srs) options.projection = jsonLayer.srs;
          if (jsonLayer.crs) options.projection = jsonLayer.crs;
        }

        newSource = this.getSource('tile', options);
      }
    }

    // TODO: Use Vector Layers for boundaries -- they can store feature info from the raster

    let newLayer;

    this.addEventsToLayerSource(newSource, openLayersMapObject);

    if (layerBrand && layerBrand === 'image') {
      newLayer = new ImageLayer({
        source: newSource,
      });
    } else {
      newLayer = new Tile({
        source: newSource,
        extent: jsonLayer.extent,
      });
    }

    // @ts-ignore
    newLayer.set('mapperLayerIdentifier', jsonLayer.id);
    // @ts-ignore
    newLayer.set('name', jsonLayer.name);

    // if (jsonLayer.loadOnly === true) {
    //   newLayer.setVisible(false);
    // }

    return newLayer;
  }

  /**
   * Function that sends a POST request to retrieve an image source.
   * @param image
   * @param src
   */
  imagePostFunction(image, src: string): void {
    const img = image.getImage();
    const url = getBaseUrl(src);
    let params = getUrlQueryString(src);
    const paramsObj = objFromUrlQueryParams(params);

    if (objPropExists(paramsObj, 'jsonLayerId')) {
      const layerConfigs = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
      const jsonLayers = globalThis.App.Layers.query(
        layerConfigs,
        {
          type: 'layer',
          id: paramsObj.jsonLayerId,
        },
        ['overlays', 'boundaries', 'baselayers', 'additional', 'hidden']
      );

      const jsonLayer = jsonLayers[0];

      if (objPropExists(jsonLayer, 'cqlFilter')) {
        const cql = [];
        for (const prop in jsonLayer.cqlFilter) {
          if (jsonLayer.cqlFilter[prop] !== null) cql.push(jsonLayer.cqlFilter[prop]);
        }
        paramsObj.CQL_FILTER = cql.join(' AND ');
      }

      // Update params with object changes
      params = objToUrlQueryParams(paramsObj);
    }

    if (params.length > 2000 && typeof window.btoa === 'function') {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('abort', function (event) {
        logger.log(event);
      });
      xhr.addEventListener('error', function (event) {
        logger.log(event);
      });
      xhr.open('POST', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function (e) {
        if (this.status === 200) {
          let uInt8Array = new Uint8Array(this.response);
          let i = uInt8Array.length;
          const binaryString = new Array(i);
          while (i) {
            i -= 1;
            binaryString[i] = String.fromCharCode(uInt8Array[i]);
          }
          const data = binaryString.join('');
          const type = this.getResponseHeader('content-type');
          if (type.indexOf('image') === 0) {
            img.src = `data:${type};base64,${window.btoa(data)}`;
          }
          uInt8Array = null;
        }
      };
      // SET THE PROPER HEADERS AND FINALLY SEND THE PARAMETERS
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send(params);
    } else {
      img.src = buildUrl(url, paramsObj);
    }
  }

  /**
   * Update the user-provided params for a given layer ID.
   * @param id
   * @param map
   */
  forceLayerUpdateById(id: string, map): void {
    const olIndex = this.getOpenLayersLayerIndex(id, map);
    if (olIndex) {
      const source = map.getLayers().item(olIndex).getSource();
      const params = source.getParams();
      params.t = new Date().getMilliseconds();
      source.updateParams(params);
    }
  }

  /**
   * Get an object of WMS parameters for requesting a WMS layer.
   * @param jsonLayer
   * @param openLayersMapObject
   * @param projection
   * @returns {{mapperWMSURL: string, jsonLayerId: *, TILED: boolean, SRS: *, LAYERS: *}}
   */
  getWMSParams(jsonLayer, openLayersMapObject: OLMap, projection?: string): Record<string, string | boolean> {
    // If a projection parameter was not provided, default to the map projection.
    if (typeof projection === 'undefined') {
      projection = openLayersMapObject.getView().getProjection().getCode();
    }

    const { srs, isWMST, bbox, version } = jsonLayer;
    const sourceName = jsonLayer.name || jsonLayer.wmstName;
    const hasTransparency = jsonLayer.transparency;
    const layerStyle = jsonLayer.style;

    let params: Record<string, string | boolean> = {
      LAYERS: sourceName,
      TILED: true,
      SRS: projection,
      jsonLayerId: jsonLayer.id,
      STYLES: layerStyle ?? '',
    };

    if (propExists(bbox) && propExists(srs)) {
      if (srs === projection) {
        params.BBOX = typeof bbox === 'string' ? bbox : bbox.join(',');
      } else {
        const [minx, miny, maxx, maxy] = typeof bbox === 'string' ? bbox.split(',') : bbox;
        const minxy = [minx, miny];
        const maxxy = [maxx, maxy];
        const coordMinXY = transform(minxy, projection, srs);
        const coordMaxXY = transform(maxxy, projection, srs);
        params.BBOX = [...coordMinXY, ...coordMaxXY].join(',');
      }
    }

    if (propExists(version)) params.VERSION = version;

    if (propExists(isWMST) && isWMST) {
      params = addTimeToWMSParams(jsonLayer, params);
    }

    return params;
  }

  /**
   * Update the layers with any changed properties.
   * @param layersConfig
   * @param map
   */
  updateMapLayerOpacitiesAndDisplayedLayersFromLayersConfig(layersConfig: LayerJSONConfig, map, childLayer?): void {
    let turnedOnOverlays: Array<LayerConfig> = [];
    // Filtering function for `query` to look for displayed layers
    const filterOnLayers = (layer: LayerConfig): boolean => {
      return layer.type === 'layer' && (layer.display === true || layer.mask === true);
    };

    // Filtering function for `query` to look for layers that have been turned off.
    const filterOffLayers = (layer: LayerConfig): boolean => {
      return layer.type === 'layer' && layer.loadOnly === false && layer.display === false && layer.mask === false;
    };

    // push childLayer to turnedOnOverlays if there is a child layer
    if (childLayer) turnedOnOverlays.push(childLayer);
    // otherwise proceed to query layers that have display property set to true
    else turnedOnOverlays = globalThis.App.Layers.query(layersConfig, filterOnLayers, ['additional', 'overlays', 'hidden']);

    const turnedOnHiddenLayers = globalThis.App.Layers.query(layersConfig, filterOnLayers, ['hidden']);
    const turnedOnBaseLayers: Array<LayerConfig> = globalThis.App.Layers.query(layersConfig, filterOnLayers, ['baselayers']);
    const turnedOnBoundaries: Array<LayerConfig> = globalThis.App.Layers.query(layersConfig, filterOnLayers, ['boundaries']);

    /**
     * NOTE: The order in which the layers are added to the map is important!
     * They are added to the map in a BOTTOM-UP order.
     * Therefore, the array of turned on layers will begin with the bottom of the layer stack and end with the top.
     * * * * * * * * * *
     * Boundaries (Land Use, Admin 1, Admin 0) - Top of layer stack
     * Additional                              ↑
     * Overlays                                ↑
     * Base Layers (in original order) --------- Bottom of layer stack
     *
     * We reverse the overlays because we would like the 'additional' layers to be on top of the raster (CHIRPS, RFE, etc)
     * We reverse the boundaries so that Crops or Land Use polygons don't become placed above boundary line, resulting in partially hiding a region's borders.
     * We want to be able to always see the outline of the countries.
     */
    const turnedOnLayers: Array<LayerConfig> = turnedOnBaseLayers
      .concat(turnedOnOverlays.reverse().concat(turnedOnHiddenLayers))
      .concat(turnedOnBoundaries.reverse());

    // Array of layers that have their `display` property set to `false`
    const turnedOffLayers: Array<LayerConfig> = globalThis.App.Layers.query(layersConfig, filterOffLayers, [
      'overlays',
      'boundaries',
      'baselayers',
      'additional',
      'hidden',
    ]);
    // Gather a list of layers to be removed from the map.
    const idsToRemove = [];
    map.getLayers().forEach(function (layer, index) {
      // Get the ID of the layer
      const layerId = layer.get('mapperLayerIdentifier');

      // if there is a childLayer, then remove all previous layers from the map
      if (childLayer) {
        idsToRemove.push(layerId);
      } else {
        for (const turnedOffLayer of turnedOffLayers) {
          if (turnedOffLayer.id === layerId) {
            idsToRemove.push(layerId);
          }
        }
      }
      // Check if the layer on the map shares an ID with a layer that's been turned off.
    });

    // Remove any layers from the map that have been turned off.
    for (const layerId of idsToRemove) {
      // Get the index of the layer
      const olIndex = this.getOpenLayersLayerIndex(layerId, map);
      if (olIndex !== null) {
        map.getLayers().removeAt(olIndex);
      }
    }

    // Add each item from the turnedOnLayers array to the map (bottom to top)
    for (let i = 0, len = turnedOnLayers.length; i < len; i += 1) {
      const layer = turnedOnLayers[i];

      // We get an array of all the map layers in every iteration because
      // with every layer added to the map, the index of where we want to insert it will change
      const olLayers = map.getLayers().getArray();
      const olLayerIndex = this.getOpenLayersLayerIndex(layer.id, map);

      // If the layer is currently not in the map, add it in the order it appears in the `turnedOnLayers` array.
      if (olLayerIndex === null) {
        // Create a new layer
        const newLayer = this.getOpenLayersLayerFromJsonLayer(layer, map);

        if (i >= olLayers.length) {
          // Add layer to top of the stack.
          map.addLayer(newLayer);
        } else {
          // Insert layer at specific position.
          map.getLayers().insertAt(i, newLayer);
        }
      }

      // Layer exists in the map.
      else {
        const olLayer = olLayers[i];
        // If the layer order has changed by comparing the index of the layer on the map to the index of the layer in the `turnedOnLayers` array.
        if (olLayerIndex !== i) {
          this.removeEventsFromLayerSource(map.getLayers().item(olLayerIndex).getSource());
          map.getLayers().removeAt(olLayerIndex);
          map.getLayers().insertAt(i, this.getOpenLayersLayerFromJsonLayer(layer, map));
        }

        // Check if the layer's source on the map has a `getParams` function
        else if (typeof olLayer.getSource().getParams === 'function' && olLayer.getSource().getParams()) {
          // Check to see if the layer parameters have been updated.
          let paramsHaveChanged = false;

          // Get the parameters stored on the layer on the map
          const oldParams = olLayer.getSource().getParams();

          // Get the parameters from the layer config
          const params = this.getWMSParams(layer, map);

          // Loop through each property in the oldParams
          for (const prop in oldParams) {
            // Check if the new params from the layer config does not contain the property from the oldParams OR
            // if the new params does contain the same property, check if the value has been changed.
            if (!objPropExists(params, prop) || params[prop] !== oldParams[prop]) {
              paramsHaveChanged = true;
              break;
            }
          }

          // Final check for updated parameters
          // In case the new params have a property the old params does not.
          if (paramsHaveChanged === false) {
            // Loop through each property in the new params from the layer config
            for (const prop in params) {
              // Check if the new params contain a property that's missing from the oldParams.
              if (!objPropExists(oldParams, prop)) {
                paramsHaveChanged = true;
                break;
              }
            }
          }

          // If the layer parameters have changed, we:
          // 1. Remove all load events from the layer source
          // 2. Remove the layer from the map.
          // 3. Create a new map layer with the updated parameters.
          // 4. Re-insert the layer at the same index.
          if (paramsHaveChanged === true) {
            olLayer.getSource().set('tileLoadCanceled', true);
            this.removeEventsFromLayerSource(olLayer.getSource());
            map.getLayers().removeAt(olLayerIndex);
            map.getLayers().insertAt(olLayerIndex, this.getOpenLayersLayerFromJsonLayer(layer, map));
          }
        }
      }

      // Assign an `opacity` property to the layer if the layer's `transparency` property is true.
      if (layer.transparency === true) {
        if (!layer.opacity && layer.opacity !== 0) {
          layer.opacity = 1;
        }

        // Change opacity of the layer on the map to the new value.
        map.getLayers().item(i).setOpacity(layer.opacity);
      }
    }

    // Remove any layers that were removed from the layers json.
    const layers = map.getLayers().array_;
    for (let i = 0; i < layers.length; i += 1) {
      const layer = layers[i];
      const layerId = layer.get('mapperLayerIdentifier');
      const layerJson = globalThis.App.Layers.query(
        layersConfig,
        {
          id: layerId,
        },
        ['overlays', 'boundaries', 'baselayers', 'additional', 'hidden']
      );

      if (layerJson.length === 0) {
        map.removeLayer(layer);
        i -= 1;
      }
    }

    // Determine if we turned on any overlays
    // if we didn't, and there's no layers to remove we know it's loaded with 0 active layers
    // we need to set the extent to the current region in this case.
    if (idsToRemove.length === 0 && turnedOnOverlays.length === 0 && turnedOnBoundaries.length === 0 && turnedOnHiddenLayers.length === 0) {
      // Check if the regionSelector tool is in the project
      const regionSelectorTool = Ext.getCmp('cRegionTool');

      if (regionSelectorTool) {
        const regionVal = regionSelectorTool.getValue();
        const region = getRegionWithRegionID(regionVal);

        globalThis.App.OpenLayers.setCurrentMapWindowExtentFromExtentThatIsAlreadyInCorrectProjection(region.bbox, map);
      }
    }
  }

  /**
   * Remove all load events from a layer source.
   * @param source
   */
  removeEventsFromLayerSource(source): void {
    const tileLoadStartEventKey = source.get('tileLoadStartEventKey');
    const tileLoadEndEventKey = source.get('tileLoadEndEventKey');
    const tileLoadErrorEventKey = source.get('tileLoadErrorEventKey');

    if (tileLoadStartEventKey) {
      unByKey(tileLoadStartEventKey);
    }
    if (tileLoadEndEventKey) {
      unByKey(tileLoadEndEventKey);
    }
    if (tileLoadErrorEventKey) {
      unByKey(tileLoadErrorEventKey);
    }

    const map = source.get('map');
    if (map) {
      source.unset('map');
    }
  }

  /**
   * Add all load events to a layer source.
   * @param source
   * @param map
   */
  addEventsToLayerSource(source, map): void {
    source.set('tileLoadStartEventKey', source.on('tileloadstart', this.tileLoadStartCallback, source));
    source.set('tileLoadEndEventKey', source.on('tileloadend', map.tileLoadCompleteCallback, source));
    source.set('tileLoadErrorEventKey', source.on('tileloaderror', this.tileLoadErrorCallback, source));
    source.set('map', map);
  }

  /**
   * Change the extent of a map object.
   * @param openLayersMapObject
   * @param sourceBBOX
   * @param sourceEPSGCode
   */
  setExtentForMap(openLayersMapObject: OLMap, sourceBBOX: ExtentType, sourceEPSGCode: string): void {
    const mapProjectionEPSGCode = openLayersMapObject.getView().getProjection().getCode();

    // load the bbox
    // do a transform to correct srs aka srs that the map uses
    // then set

    const minx = sourceBBOX[0];
    const miny = sourceBBOX[1];
    const maxx = sourceBBOX[2];
    const maxy = sourceBBOX[3];

    const minxy = [minx, miny];
    const maxxy = [maxx, maxy];

    const coordMinXY = transform(minxy, mapProjectionEPSGCode, sourceEPSGCode);
    const coordMaxXY = transform(maxxy, mapProjectionEPSGCode, sourceEPSGCode);

    const reprojectedBBOX: ExtentType = [coordMinXY[0], coordMinXY[1], coordMaxXY[0], coordMaxXY[1]];

    // http://stackoverflow.com/questions/23682286/zoomtoextent-openlayers-3
    openLayersMapObject.getView().fit(reprojectedBBOX, {
      size: openLayersMapObject.getSize(),
    });
  }

  /**
   * Get the current extent of the Map window.
   * @param openlayersMap
   * @returns {*}
   */
  getCurrentMapWindowExtent(openlayersMap: OLMap): ExtentType {
    return openlayersMap.getView().calculateExtent(openlayersMap.getSize()) as ExtentType;
  }

  setCurrentMapWindowExtentFromExtentThatIsAlreadyInCorrectProjection(extent: ExtentType, openlayersMap: OLMap): void {
    const mapProjectionEPSGCode = openlayersMap.getView().getProjection().getCode();
    this.setExtentForMap(openlayersMap, extent, mapProjectionEPSGCode);
  }

  /**
   * Add an OpenLayers Scale Line control to the Map object.
   * @param openLayersMapObject - Open Layers Map Object
   */
  addScaleLine(openLayersMapObject: OLMap): void {
    const scaleline = new ScaleLine();
    openLayersMapObject.addControl(scaleline);
  }

  /**
   * Add an OpenLayers Zoom control to the Map object.
   * @param openLayersMapObject
   * @param zoomIn
   * @param zoomOut
   */
  customizeZoomTips(openLayersMapObject: OLMap, zoomIn: string, zoomOut: string): void {
    const zoomControl = new Zoom({
      zoomInTipLabel: zoomIn,
      zoomOutTipLabel: zoomOut,
    });
    openLayersMapObject.addControl(zoomControl);
  }

  setExtentEncompassingSpecifiedRegionsForMap(openLayersMapObject: OLMap, regionsToUse: Array<RegionConfig>): ExtentType {
    const mapProjectionEPSGCode: string = openLayersMapObject.getView().getProjection().getCode();

    // load the bbox
    // do a transform to correct srs aka srs that the map uses
    // then set

    let realMinX = Number.POSITIVE_INFINITY;
    let realMinY = Number.POSITIVE_INFINITY;
    let realMaxX = Number.NEGATIVE_INFINITY;
    let realMaxY = Number.NEGATIVE_INFINITY;

    for (const regionIndex of Object.keys(regionsToUse)) {
      const aRegion = regionsToUse[regionIndex];
      const sourceBBOX = aRegion.bbox;
      const sourceEPSGCode = aRegion.srs;

      const minx = sourceBBOX[0];
      const miny = sourceBBOX[1];
      const maxx = sourceBBOX[2];
      const maxy = sourceBBOX[3];

      const minxy = [minx, miny];
      const maxxy = [maxx, maxy];

      const coordMinXY = transform(minxy, mapProjectionEPSGCode, sourceEPSGCode);
      const coordMaxXY = transform(maxxy, mapProjectionEPSGCode, sourceEPSGCode);

      if (coordMinXY[0] < realMinX) realMinX = coordMinXY[0];
      if (coordMinXY[1] < realMinY) realMinY = coordMinXY[1];
      if (coordMaxXY[0] > realMaxX) realMaxX = coordMaxXY[0];
      if (coordMaxXY[1] > realMaxY) realMaxY = coordMaxXY[1];
    }

    const encompassingBBOX: ExtentType = [realMinX, realMinY, realMaxX, realMaxY];

    // http://stackoverflow.com/questions/23682286/zoomtoextent-openlayers-3
    openLayersMapObject.getView().fit(encompassingBBOX, {
      size: openLayersMapObject.getSize(),
    });

    return encompassingBBOX;
  }

  getExtentToUseForLayerConfig(layersConfig: LayerJSONConfig, openLayersMapObject: OLMap): ExtentType {
    const windowJsonLayers = globalThis.App.Layers.query(
      layersConfig,
      {
        type: 'layer',
        display: true,
      },
      ['overlays', 'boundaries', 'hidden']
    );

    const regionsToUse = [];

    for (const overlayIndex of Object.keys(windowJsonLayers)) {
      const aJsonLayer = windowJsonLayers[overlayIndex];
      const firstRegionID = aJsonLayer.regionIds[0];
      const firstRegion = globalThis.App.getRegionWithRegionID(firstRegionID);
      regionsToUse.push(firstRegion);
    }

    const mapProjectionEPSGCode = openLayersMapObject.getView().getProjection().getCode();

    // load the bbox
    // do a transform to correct srs aka srs that the map uses
    // then set

    let realMinX = Number.POSITIVE_INFINITY;
    let realMinY = Number.POSITIVE_INFINITY;
    let realMaxX = Number.NEGATIVE_INFINITY;
    let realMaxY = Number.NEGATIVE_INFINITY;

    for (const regionIndex of Object.keys(regionsToUse)) {
      const aRegion = regionsToUse[regionIndex];
      const sourceBBOX = aRegion.bbox;
      const sourceEPSGCode = aRegion.srs;

      const minx = sourceBBOX[0];
      const miny = sourceBBOX[1];
      const maxx = sourceBBOX[2];
      const maxy = sourceBBOX[3];

      const minxy = [minx, miny];
      const maxxy = [maxx, maxy];

      const coordMinXY = transform(minxy, mapProjectionEPSGCode, sourceEPSGCode);
      const coordMaxXY = transform(maxxy, mapProjectionEPSGCode, sourceEPSGCode);
      if (coordMinXY[0] < realMinX) realMinX = coordMinXY[0];
      if (coordMinXY[1] < realMinY) realMinY = coordMinXY[1];
      if (coordMaxXY[0] > realMaxX) realMaxX = coordMaxXY[0];
      if (coordMaxXY[1] > realMaxY) realMaxY = coordMaxXY[1];
    }

    return [realMinX, realMinY, realMaxX, realMaxY];
  }

  /**
   * Get the source URL for the top-level overlay on a Map object.
   * @param {LayerJSONConfig} layersConfig
   * @param {Map} openLayersMapObject
   * @param {string} imageMime
   * @param {number} width
   * @param {number} height
   * @param {string} style
   * @returns {string}
   */
  getDownloadURLofTopOverlay(
    layersConfig: LayerJSONConfig,
    openLayersMapObject: OLMap,
    imageMime: string,
    width: number,
    height: number,
    style: string
  ): string {
    if (typeof style === 'undefined') style = '';
    let topLayer;
    let layerId;
    const layerConfig = layersConfig;
    const openlayersMap = openLayersMapObject;

    topLayer = globalThis.App.Layers.getTopLayer(layerConfig.overlays);
    if (!topLayer) {
      topLayer = globalThis.App.Layers.getTopLayer(layerConfig.hidden);
    }
    const wmsURL = topLayer.source.wms;
    const layersParam = topLayer?.isWMST ? topLayer.wmstName : topLayer.name;
    const bboxParam = openlayersMap.getView().calculateExtent(openlayersMap.getSize()).join(',');
    const mapProjectionEPSGCode = openlayersMap.getView().getProjection().getCode();

    const params: Dictionary = {
      SERVICE: 'WMS',
      VERSION: '1.3.0',
      REQUEST: 'GetMap',
      FORMAT: imageMime,
      TRANSPARENT: true,
      LAYERS: layersParam,
      TILED: true,
      SRS: mapProjectionEPSGCode,
      WIDTH: width,
      HEIGHT: height,
      CRS: mapProjectionEPSGCode,
      STYLES: topLayer.style ?? '',
      BBOX: bboxParam,
    };

    if (topLayer?.timeseries) {
      if (topLayer?.parentGranuleName) layerId = topLayer.parentGranuleName;
      else layerId = topLayer.id;
      const granule = globalThis.App.Layers._granules.get(layerId);
      params.TIME = granule?.activeInterval.start;
    }

    return buildUrl(wmsURL, params);
  }

  /**
   * Generate a URL for downloading the current Map view.
   * @param {LayerJSONConfig} layersConfig
   * @param {Map} openLayersMapObject
   * @param {string} imageMime
   * @param {number} width
   * @param {number} height
   * @param {string} style
   * @returns {string}
   */
  getDownloadURLOfMapImage(
    layersConfig: LayerJSONConfig,
    openLayersMapObject: OLMap,
    imageMime: string,
    width: number,
    height: number,
    style = ''
  ): string {
    const layerConfig = layersConfig;
    const openlayersMap = openLayersMapObject;

    const windowJsonBoundaries = globalThis.App.Layers.query(layerConfig.boundaries, {
      type: 'layer',
      display: true,
    });
    const windowJsonOverlays = globalThis.App.Layers.query(layerConfig.overlays, {
      type: 'layer',
      display: true,
    });

    const wmsURL = windowJsonOverlays[0].source.wms;

    let layersParam = '';
    let stylesParam = '';

    if (windowJsonOverlays.length > 0) {
      const layer = windowJsonOverlays[windowJsonOverlays.length - 1];
      layersParam += `${layer?.isWMST ? layer.wmstName : layer.name},`;
      stylesParam += `${layer.style},`;
    }

    for (const layerIndex of Object.keys(windowJsonBoundaries)) {
      const layer = windowJsonBoundaries[layerIndex];
      const layerName = layer.name;
      layersParam += `${layerName},`;
      const stylesName = layer.style;
      stylesParam += `${stylesName},`;
    }

    layersParam = layersParam.substring(0, layersParam.length - 1);
    stylesParam = stylesParam.substring(0, stylesParam.length - 1);

    const bboxParam = openlayersMap.getView().calculateExtent(openlayersMap.getSize()).join(',');

    const mapProjectionEPSGCode = openlayersMap.getView().getProjection().getCode();

    const params: Dictionary = {
      SERVICE: 'WMS',
      VERSION: '1.3.0',
      REQUEST: 'GetMap',
      FORMAT: imageMime,
      TRANSPARENT: true,
      LAYERS: layersParam,
      TILED: true,
      SRS: mapProjectionEPSGCode,
      WIDTH: width,
      HEIGHT: height,
      CRS: mapProjectionEPSGCode,
      STYLES: stylesParam,
      BBOX: bboxParam,
    };

    if (windowJsonOverlays[0]?.timeseries) {
      const granule = globalThis.App.Layers._granules.get(windowJsonOverlays[0].id);
      params.TIME = granule?.activeInterval.start;
    }

    return buildUrl(wmsURL, params);
  }

  getDownloadURLOfJSONLayerObject(
    jsonLayerObject: LayerConfig,
    openLayersMapObject: OLMap,
    imageMime: string,
    width: number,
    height: number
  ): string {
    let layerId;
    const openlayersMap = openLayersMapObject;
    const wmsURL = jsonLayerObject.source.wms;

    const layersParam = jsonLayerObject?.isWMST ? jsonLayerObject.wmstName : jsonLayerObject.name;
    const stylesParam = jsonLayerObject.style ?? '';
    const bboxParam = openLayersMapObject.getView().calculateExtent(openLayersMapObject.getSize()).join(',');
    const mapProjectionEPSGCode = openlayersMap.getView().getProjection().getCode();

    const params: Dictionary = {
      SERVICE: 'WMS',
      VERSION: '1.3.0',
      REQUEST: 'GetMap',
      FORMAT: imageMime,
      TRANSPARENT: true,
      LAYERS: layersParam,
      TILED: true,
      SRS: mapProjectionEPSGCode,
      WIDTH: width,
      HEIGHT: height,
      CRS: mapProjectionEPSGCode,
      STYLES: stylesParam,
      BBOX: bboxParam,
    };

    if (jsonLayerObject?.timeseries) {
      if (jsonLayerObject?.parentGranuleName) layerId = jsonLayerObject.parentGranuleName;
      else layerId = jsonLayerObject.id;
      const granule = globalThis.App.Layers._granules.get(layerId);
      params.TIME = granule?.activeInterval.start;
    }

    return buildUrl(wmsURL, params);
  }

  setExtentForMapFromDragBoxMouseDownAndMouseUpCoordinates(mouseUpCoords: CoordType, mouseDownCoords: CoordType, openLayersMapObject: OLMap): void {
    const x1 = mouseUpCoords[0];
    const y1 = mouseUpCoords[1];

    const x2 = mouseDownCoords[0];
    const y2 = mouseDownCoords[1];

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    // they could have dragged the box 4 different ways
    // so find the minx,y and the max,y to make a bbox to set extent to

    if (x1 < minX) minX = x1;
    if (x2 < minX) minX = x2;
    if (y1 < minY) minY = y1;
    if (y2 < minY) minY = y2;

    if (x1 > maxX) maxX = x1;
    if (x2 > maxX) maxX = x2;
    if (y1 > maxY) maxY = y1;
    if (y2 > maxY) maxY = y2;

    const BBOX: ExtentType = [minX, minY, maxX, maxY];

    // http://stackoverflow.com/questions/23682286/zoomtoextent-openlayers-3
    openLayersMapObject.getView().fit(BBOX, {
      size: openLayersMapObject.getSize(),
    });
  }

  getFeatureInfoUrl(coordinate: CoordType, map: OLMap, jsonLayer: LayerConfig): string {
    const mapProjectionEPSGCode = map.getView().getProjection().getCode();
    const correspondingLayerEPSGCode = jsonLayer.srs ?? jsonLayer.crs;

    // Geoserver layers feature info requests can be configured to accept coordinates
    // in a different projection than the layers default projection. But to ensure compatibility
    // with all projections, we convert the coordinates into the layer's default projection.
    let viewResolution;
    if (mapProjectionEPSGCode !== correspondingLayerEPSGCode) {
      coordinate = proj4(mapProjectionEPSGCode, correspondingLayerEPSGCode, coordinate);
      viewResolution = this.getMapResolutionInProjection(map, correspondingLayerEPSGCode);
    } else {
      viewResolution = map.getView().getResolution();
    }

    //---------------------------------------------------------------------

    // so getfeatureinfo does not work through the gwc
    // we need to use the wms url for that
    // so we make a copy of the source that is set to use gwc
    // change its url to wms
    // then use that

    const newParams = this.getWMSParams(jsonLayer, map, correspondingLayerEPSGCode);

    const wmsTempSource = new TileWMS({
      url: jsonLayer.source.wms,
      params: newParams,
      tileLoadFunction: this.imagePostFunction,
    });

    let infoFormat = null;
    if (objPropExists(jsonLayer, 'infoFormat')) {
      infoFormat = jsonLayer.infoFormat;
    } else {
      infoFormat = 'application/json';
      logger.debug(`infoFormat not defined for layer ${jsonLayer.name} defaulting to application/json`);
    }

    const featureInfoParams: Record<string, string> = {
      INFO_FORMAT: infoFormat,
    };

    if (objPropExists(jsonLayer, 'cqlFilter')) {
      const cqlFilter = [];
      for (const prop in jsonLayer.cqlFilter) {
        if (jsonLayer.cqlFilter[prop] !== null && jsonLayer.cqlFilter[prop].length < 500) {
          cqlFilter.push(jsonLayer.cqlFilter[prop]);
        }
      }
      if (cqlFilter.length > 0) {
        featureInfoParams.CQL_FILTER = cqlFilter.join(' AND ');
      }
    } else {
      const featureInfo = [];
      for (const key in jsonLayer.featureInfo) {
        if (key !== 'GRAY_INDEX' && key !== 'PALETTE_INDEX') featureInfo.push(key);
      }
      if (featureInfo.length > 0) {
        featureInfoParams.propertyName = featureInfo.join(',');
      }
    }

    return wmsTempSource.getFeatureInfoUrl(coordinate, viewResolution, correspondingLayerEPSGCode, featureInfoParams);
  }

  async getLayersFeatureInfo(
    coord: CoordType,
    map: OLMap,
    layersConfig: LayerJSONConfig,
    callbackInstance: object,
    callbackMethod: string | Function
  ) {
    let returnedCount = 0;
    let totalRequests = 0;

    const layers = globalThis.App.Layers.query(
      layersConfig,
      function (layer) {
        if (layer.type === 'layer' && layer.mask === false && (layer.display === true || layer.loadOnly === true)) {
          return true;
        }
        return false;
      },
      ['overlays', 'boundaries', 'additional', 'hidden']
    );

    // we dont have ol layer groups, so this will always be one real layer per ol layer
    for (const layer of layers) {
      // TODO: Determine if layer is a vector, if it is skip the WFS request and use the vector features
      const layerFeatureInfoURL = this.getFeatureInfoUrl(coord, map, layer);
      totalRequests += 1;

      /**
       * Here, we're creating a Promise for a GET request. Since we don't want to await the result of the request,
       * we append it with a callback function to be executed after the request is resolved.
       * We aren't using `await` because it makes the UI components refresh over and over and over and over again until all queued
       * requests have been resolved.
       */
      Transport.get(layerFeatureInfoURL, {
        callbackObj: layer,
        callback: async (res, cbObj) => {
          const someJsonRawText = await res.text();
          returnedCount += 1;

          if (!someJsonRawText.startsWith('<?xml') && someJsonRawText.indexOf('LayerNotQueryable') === -1) {
            const featureInfoObj = JSON.parse(someJsonRawText);
            if (featureInfoObj.features.length > 0) {
              const feature = featureInfoObj.features[0];
              for (const featureKey of Object.keys(cbObj?.featureInfo || {})) {
                if (objPropExists(feature.properties, featureKey)) {
                  cbObj.featureInfo[featureKey].value = feature.properties[featureKey];
                  const { mapValues } = cbObj.featureInfo[featureKey];
                  if (mapValues && mapValues.length > 0) {
                    for (let i = 0, len = mapValues.length; i < len; i += 1) {
                      if (objPropExists(mapValues[i], feature.properties[featureKey])) {
                        cbObj.featureInfo[featureKey].displayValue = mapValues[i][feature.properties[featureKey]];
                      }
                    }
                  } else {
                    cbObj.featureInfo[featureKey].displayValue = feature.properties[featureKey];
                  }
                }
              }
            } else {
              for (const featureKey of Object.keys(cbObj.featureInfo)) {
                cbObj.featureInfo[featureKey].value = null;
                cbObj.featureInfo[featureKey].displayValue = null;
              }
            }
          }

          if (returnedCount === totalRequests) {
            globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_FEATUREINFO_UPDATED, null, null);

            if (typeof callbackMethod === 'string') {
              callbackInstance[callbackMethod]();
            } else {
              callbackMethod();
            }
          }
        },
      });
    }
  }

  async updateLayerConfigWithFeatureInfoForCoord(coord: CoordType, openLayersMapObject: OLMap, useLayerConfig: LayerJSONConfig) {
    // update owning mapwindow layerconfig
    // with getFeatureInfo
    // return it to mapwindow
    // mapwindow posts event with updated layerconfig

    const featureInfoDictByLayerID = await this.getAllLayerFeatureInfoForXYCoordWithMap(coord, openLayersMapObject, useLayerConfig);

    const jsonOverlays = useLayerConfig.overlays;
    const jsonBoundaries = useLayerConfig.boundaries;
    const jsonAdditional = useLayerConfig.additional;

    const newJsonOverlays = jsonOverlays ? this.applyFeatureInfoToFolderAndLayerArray(jsonOverlays, featureInfoDictByLayerID) : null;

    const newJsonBoundaries = jsonBoundaries ? this.applyFeatureInfoToFolderAndLayerArray(jsonBoundaries, featureInfoDictByLayerID) : null;

    let newJsonAdditional;
    if (jsonAdditional) newJsonAdditional = this.applyFeatureInfoToFolderAndLayerArray(jsonAdditional, featureInfoDictByLayerID);

    const updatedLayersConfig = useLayerConfig;

    updatedLayersConfig.boundaries = newJsonBoundaries;
    updatedLayersConfig.overlays = newJsonOverlays;
    if (jsonAdditional) updatedLayersConfig.additional = newJsonAdditional;

    return updatedLayersConfig;
  }

  async getAllLayerFeatureInfoForXYCoordWithMap(
    coord: CoordType,
    openLayersMapObject: OLMap,
    useLayerConfig: LayerJSONConfig
  ): Promise<Record<string, FeatureInfo>> {
    const JSONLayersConfigObject = JSON.parse(JSON.stringify(useLayerConfig));
    const jsonOverlays = JSONLayersConfigObject;
    const jsonOverlayLayers = globalThis.App.Layers.query(
      jsonOverlays,
      {
        type: 'layer',
      },
      ['overlays', 'additional']
    );

    const jsonBoundaries = JSONLayersConfigObject.boundaries;
    const jsonBoundaryLayers = globalThis.App.Layers.query(jsonBoundaries, {
      type: 'layer',
    });

    const jsonLayersToGetFeatureInfoFor = [];

    for (const jsonLayerIndex of Object.keys(jsonOverlayLayers)) {
      // meron said:
      // Raster
      // Display:true YesInfo
      // Display:false NoInfo
      // LoadOnly:true noDisplay/YesInfo
      // LoadOnly:false yesInfo
      // Vector
      // Display:true yesInfo
      // Display:false YesInfo
      // loadOnly:true noDisplay/YesInfo
      // loadOnly:false yesInfo
      // So  for raster:
      // loadOnly && display = throw exception
      // !loadOnly && display = show+!info
      // !loadOnly && !display = !show+!info
      // loadOnly && !display = !show+info
      // then for vector info always show info
      // then later on 9/29 he said:
      // Meron:  can you make sure that the list contain only the displayed once
      // ones
      // ignore loadonly

      const jsonLayer = jsonOverlayLayers[jsonLayerIndex];

      if (objPropExists(jsonLayer, 'featureInfo') && (jsonLayer.display === true || jsonLayer.loadOnly === true)) {
        jsonLayersToGetFeatureInfoFor.push(jsonLayer);
      }

      if (jsonLayer.loadOnly && jsonLayer.display) {
        console.error('loadOnly and display are both true for a layer');
      }
    }

    for (const jsonLayerIndex of Object.keys(jsonBoundaryLayers)) {
      const jsonLayer = jsonBoundaryLayers[jsonLayerIndex];
      if (objPropExists(jsonLayer, 'featureInfo') && (jsonLayer.display === true || jsonLayer.loadOnly === true)) {
        jsonLayersToGetFeatureInfoFor.push(jsonLayer);
      }
    }

    const featureInfoDictByLayerID = {};

    for (const index of Object.keys(jsonLayersToGetFeatureInfoFor)) {
      const jsonLayer = jsonLayersToGetFeatureInfoFor[index];
      const jsonLayerIdentifier = jsonLayer.id;
      const featureInfoForLayer = await this.getLayerFeatureInfoViaXYCoord(jsonLayer, coord, openLayersMapObject);

      if (
        featureInfoForLayer !== null
        // && featureInfoForLayer.emptyFeatures!=true
      ) {
        featureInfoDictByLayerID[jsonLayerIdentifier] = featureInfoForLayer;
      }
    }

    return featureInfoDictByLayerID;
  }

  async getLayerFeatureInfoViaXYCoord(jsonLayer: LayerConfig, coords: CoordType, map) {
    let featureInfo: Dictionary = {
      features: [],
      emptyFeatures: true,
    };

    const layer = map
      .getLayers()
      .getArray()
      .find((layer) => layer.values_.name === jsonLayer.name);

    if (layer) {
      if (layer.getSource()?.key_?.includes('pbf')) {
        // OL uses the coordinates to get the pixel from the browser (not the OL map) and then retrieve features at that point. Then filter out non-polygon layers (like the crosshair).
        const features = map
          .getFeaturesAtPixel(map.getPixelFromCoordinate(coords), {
            // Without this filter all vector feature info will be returned for each layer
            // The filter is just a function that receives a 'layer-candidate' and returns a boolean
            layerFilter: (candidate): boolean => candidate === layer,
          })
          .filter((feature) => feature.properties_);

        if (features.length) {
          featureInfo.features = features[0].getProperties();
          featureInfo.emptyFeatures = false;
        }

        return featureInfo;
      }
      // Check if the layer is a vector
      // TODO: Test if this can also be applied to Topo instead of the 'pbf' check above.
      if (layer.getSource()?.getFeatures) {
        const features = map
          .getFeaturesAtPixel(map.getPixelFromCoordinate(coords), {
            layerFilter: (candidate) => candidate === layer,
          })
          .map((feature) => {
            return {
              properties: feature.getProperties(),
            };
          });

        if (features.length) {
          featureInfo.features = features;
          featureInfo.emptyFeatures = false;
        }

        return featureInfo;
      }
      const params = layer.getSource().getParams();
      const layerName = params.LAYERS;
      const url = this.getFeatureInfoUrl(coords, map, jsonLayer);

      const res = await Transport.get(url);
      const unparsedJSON = await res.text();

      if (!unparsedJSON.includes('LayerNotQueryable') && !unparsedJSON.includes('ServiceException')) {
        featureInfo = JSON.parse(unparsedJSON);

        if (jsonLayer.isAdded && featureInfo.features.length) {
          featureInfo.features = featureInfo.features[0].properties;
        }

        featureInfo.name = layerName;
        featureInfo.title = jsonLayer.title;
        featureInfo.timeseries = false;
        featureInfo.emptyFeatures = true;

        if (objPropExists(jsonLayer, 'timeseries')) {
          featureInfo.timeseries = jsonLayer.timeseries;
        }

        if (featureInfo.features.length) {
          featureInfo.emptyFeatures = false;
        }
      }
    }
    if (jsonLayer.panelQuery) {
      const params = {
        LAYERS: jsonLayer.name,
        SRS: jsonLayer.srs,
        TILED: true,
        jsonLayerId: jsonLayer.id,
        mapperWMSURL: jsonLayer.source.wms,
      };
      const layerName = params.LAYERS;
      const url = this.getFeatureInfoUrl(coords, map, jsonLayer);

      const res = await Transport.get(url);
      const unparsedJSON = await res.text();

      if (!unparsedJSON.includes('LayerNotQueryable') && !unparsedJSON.includes('ServiceException')) {
        featureInfo = JSON.parse(unparsedJSON);

        featureInfo.name = layerName;
        featureInfo.title = jsonLayer.title;
        featureInfo.timeseries = false;
        featureInfo.emptyFeatures = true;

        if (objPropExists(jsonLayer, 'timeseries')) {
          featureInfo.timeseries = jsonLayer.timeseries;
        }

        if (featureInfo.features.length) {
          featureInfo.emptyFeatures = false;
        }
      }
    }

    return featureInfo;
  }

  getFeatureInfoForLayerWithXYCoordAndMap(jsonLayer: LayerConfig, coord: CoordType, openLayersMapObject) {
    let featureInfo = null;

    let x;
    openLayersMapObject
      .getLayers()
      .getArray()
      .forEach(async function (layer, i, arr) {
        const source = layer.getSource();

        if (typeof source.getParams === 'function') {
          // we dont have ol layer groups, so this will always be one real layer per ol layer
          const params = source.getParams();
          const layerName = params.LAYERS;

          if (layerName === jsonLayer.name || layerName === jsonLayer.wmstName) {
            const layerFeatureInfoURL = this.getFeatureInfoUrl(coord, openLayersMapObject, jsonLayer);

            const res = await Transport.get(layerFeatureInfoURL);
            const someJsonRawText = await res.text();

            if (someJsonRawText.indexOf('LayerNotQueryable') === -1) {
              const jsonFeatureObject = JSON.parse(someJsonRawText);
              jsonFeatureObject.name = layerName;
              jsonFeatureObject.title = jsonLayer.title;
              if (objPropExists(jsonLayer, 'timeseries')) {
                jsonFeatureObject.timeseries = jsonLayer.timeseries;
              } else {
                jsonFeatureObject.timeseries = false;
              }

              if (jsonFeatureObject.features.length === 0) {
                jsonFeatureObject.emptyFeatures = true;
              } else {
                jsonFeatureObject.emptyFeatures = false;
              }
              featureInfo = jsonFeatureObject;
            }
          }
        }
      }, this);

    return featureInfo;
  }

  getFeatureInfoForLayerWithXYCoordAndMapUsingPromises(jsonLayer: LayerConfig, coords: CoordType, map, callback: Function) {
    let featureInfo = null;
    let x;

    map
      .getLayers()
      .getArray()
      .filter((layer) => layer.values_.name === jsonLayer.name)
      .forEach(async (layer) => {
        if (layer) {
          const params = layer.getSource().getParams();
          const layerName = params.LAYERS;
          const url = this.getFeatureInfoUrl(coords, map, jsonLayer);
          const unparsedJSON = await (await Transport.get(url)).text();

          if (!unparsedJSON.includes('LayerNotQueryable')) {
            featureInfo = JSON.parse(unparsedJSON);

            featureInfo.name = layerName;
            featureInfo.title = jsonLayer.title;
            featureInfo.timeseries = false;
            featureInfo.emptyFeatures = true;

            if (objPropExists(jsonLayer, 'timeseries')) {
              featureInfo.timeseries = jsonLayer.timeseries;
            }

            if (featureInfo.features.length) {
              featureInfo.emptyFeatures = false;
            }

            callback(featureInfo);
          }
        }
      });
    return featureInfo;
  }

  applyFeatureInfoToFolderAndLayerArray(jsonArray, featureInfoDictByLayerID: Record<string, FeatureInfo>) {
    // so you have to traverse the layersConfig.....
    // so use recursion here, make a function
    // applyFeatureInfoToFolderAndLayerArray
    //
    // if layer
    // return replacement with feature info applied
    // if folder
    // return replacement with feature info applied to layers

    const replacementArray = jsonArray;

    for (const index of Object.keys(jsonArray)) {
      const layerOrFolder = jsonArray[index];

      if (layerOrFolder.type === 'folder') {
        const replacementFolder = layerOrFolder;

        const replacementFolderContents = this.applyFeatureInfoToFolderAndLayerArray(replacementFolder.folder, featureInfoDictByLayerID);

        replacementFolder.folder = replacementFolderContents;

        jsonArray[index] = replacementFolder;
      } else {
        const replacementLayer = layerOrFolder;

        //------------------

        // this is the part where you

        // 0. check if the layer has featureInfo
        // 1. see if layerID exists in featureInfo keys
        // 2. parse the desired keys for layer
        // 3. get values for desired keys
        // 4. set layer feature info values for desired keys

        if (objPropExists(replacementLayer, 'featureInfo')) {
          if (Object.keys(replacementLayer.source).includes('vectorTile')) {
            if (featureInfoDictByLayerID[replacementLayer.id]) {
              replacementLayer.featureInfo = featureInfoDictByLayerID[replacementLayer.id].features
                ? featureInfoDictByLayerID[replacementLayer.id].features
                : null; // layer.featureInfo must be retained for use in cFeatureInfoPanel.updateFeatureInfoPanel() and cannot be undefined per line 1444
            }
          } else {
            let layerIsPresentInFeatureInfoArray = false;
            let featuresForLayerIdentifier = null;

            for (const aLayerID in featureInfoDictByLayerID) {
              if (aLayerID === replacementLayer.id) {
                layerIsPresentInFeatureInfoArray = true;
                featuresForLayerIdentifier = featureInfoDictByLayerID[aLayerID];
              }
            }

            if (layerIsPresentInFeatureInfoArray) {
              // To just take all feature info without declaring everything add a 'settings' property to the layer's featureInfo object and set 'applyAll' to 'true'.
              // Anything we don't want displayed in the Feature Info panel can be declared in the template.ts file.

              if (replacementLayer?.featureInfoSettings?.applyAll) {
                // The idea here is to generate the necessary config options for the layer based on what's in the feature info

                // Support layers with multiple featureInfo properties -- set the featureInfo to an array to be parsed in the feature info panel

                let output;
                if (featureInfoDictByLayerID[replacementLayer.id].features.length > 1) {
                  // we have multiple layer feature info
                  output = [];
                  Object.entries(featureInfoDictByLayerID[replacementLayer.id].features).forEach(([key, value]) => {
                    const tmp = {};

                    if (!Array.isArray(value)) {
                      // @ts-ignore
                      if (typeof value.properties === 'object') {
                        // @ts-ignore
                        Object.entries(value.properties).forEach(([propKey, propValue]) => {
                          tmp[propKey] = {
                            displayName: propKey,
                            displayValue: propValue,
                            value: propValue,
                            mapValues: [],
                          };
                        });
                      } else {
                        tmp[key] = {
                          displayName: key,
                          displayValue: value,
                          value,
                          mapValues: [],
                        };
                      }
                    }

                    output.push(tmp);
                  });
                } else {
                  output = {};
                  Object.entries(featureInfoDictByLayerID[replacementLayer.id].features).forEach(([key, value]) => {
                    if (!Array.isArray(value)) {
                      // @ts-ignore
                      if (typeof value.properties === 'object') {
                        // @ts-ignore
                        Object.entries(value.properties).forEach(([propKey, propValue]) => {
                          output[propKey] = {
                            displayName: propKey,
                            displayValue: propValue,
                            value: propValue,
                            mapValues: [],
                          };
                        });
                      } else {
                        output[key] = {
                          displayName: key,
                          displayValue: value,
                          value,
                          mapValues: [],
                        };
                      }
                    }
                  });
                }

                replacementLayer.featureInfo = output;
              }

              if (replacementLayer.isAdded) {
                const output: Record<string, object> = {};
                Object.entries(featureInfoDictByLayerID[replacementLayer.id].features).forEach(([key, value]) => {
                  if (!Array.isArray(value)) {
                    output[key] = {
                      displayName: key,
                      displayValue: value,
                      value,
                      mapValues: [],
                    };
                  }
                });

                replacementLayer.featureInfo = output;
              } else if (!Array.isArray(replacementLayer.featureInfo)) {
                for (const featureKey in replacementLayer.featureInfo) {
                  if (featuresForLayerIdentifier.features.length > 0) {
                    const featureLength = featuresForLayerIdentifier.features.length;
                    if (featuresForLayerIdentifier.features[featureLength - 1].properties_) {
                      featuresForLayerIdentifier.features[featureLength - 1].properties =
                        featuresForLayerIdentifier.features[featureLength - 1].properties_;
                    }
                    const replacementValue = featuresForLayerIdentifier.features[featureLength - 1].properties[featureKey];

                    if (replacementValue === null) {
                      let choosableKeys = '';

                      for (const choosableKey of Object.keys(featuresForLayerIdentifier.features[featureLength - 1].properties)) {
                        choosableKeys += `${choosableKey} `;
                      }
                    }

                    //-------------------------------

                    let replacementMappedValue = null;

                    for (const mappingIndex of Object.keys(replacementLayer.featureInfo[featureKey].mapValues)) {
                      const mapValueObject = replacementLayer.featureInfo[featureKey].mapValues[mappingIndex];

                      const keyName = Object.keys(mapValueObject)[0]; // theres only one key per item

                      const keyValue = mapValueObject[keyName];

                      // cast to strings, because the mapping key+values are specified using strings
                      if (keyName === `${replacementValue}`) {
                        replacementMappedValue = keyValue;
                      }
                    }

                    if (replacementLayer.featureInfo[featureKey].mapValues.length === 0) {
                      replacementMappedValue = replacementValue;
                    }

                    //-------------------------------

                    replacementLayer.featureInfo[featureKey].value = replacementValue;
                    replacementLayer.featureInfo[featureKey].displayValue = replacementMappedValue;
                    replacementLayer.areFeaturesEmpty = false;
                  } else {
                    replacementLayer.featureInfo[featureKey].value = null;
                    replacementLayer.featureInfo[featureKey].displayValue = null;
                    replacementLayer.areFeaturesEmpty = true;
                  }
                }
              } else {
                for (let i = 0; i < replacementLayer.featureInfo.length; i += 1) {
                  for (const featureKey in replacementLayer.featureInfo[i]) {
                    if (featuresForLayerIdentifier.features.length > 0) {
                      const featureLength = featuresForLayerIdentifier.features.length;
                      if (featuresForLayerIdentifier.features[featureLength - 1].properties_) {
                        featuresForLayerIdentifier.features[featureLength - 1].properties =
                          featuresForLayerIdentifier.features[featureLength - 1].properties_;
                      }

                      const replacementValue = featuresForLayerIdentifier.features?.[i]?.properties[featureKey];

                      if (replacementValue === null) {
                        let choosableKeys = '';

                        for (const choosableKey of Object.keys(featuresForLayerIdentifier.features?.[i]?.properties)) {
                          choosableKeys += `${choosableKey} `;
                        }
                      }

                      //-------------------------------

                      let replacementMappedValue = null;

                      for (const mappingIndex of Object.keys(replacementLayer.featureInfo[i][featureKey].mapValues)) {
                        const mapValueObject = replacementLayer.featureInfo[i][featureKey].mapValues[mappingIndex];

                        const keyName = Object.keys(mapValueObject)[0]; // theres only one key per item

                        const keyValue = mapValueObject[keyName];

                        // cast to strings, because the mapping key+values are specified using strings
                        if (keyName === `${replacementValue}`) {
                          replacementMappedValue = keyValue;
                        }
                      }

                      if (replacementLayer.featureInfo[i][featureKey].mapValues.length === 0) {
                        replacementMappedValue = replacementValue;
                      }

                      //-------------------------------

                      replacementLayer.featureInfo[i][featureKey].value = replacementValue;
                      replacementLayer.featureInfo[i][featureKey].displayValue = replacementMappedValue;
                      replacementLayer.areFeaturesEmpty = false;
                    } else {
                      replacementLayer.featureInfo[i][featureKey].value = null;
                      replacementLayer.featureInfo[i][featureKey].displayValue = null;
                      replacementLayer.areFeaturesEmpty = true;
                    }
                  }
                }
              }
            }
          }
        }
        jsonArray[index] = replacementLayer;
      }
    }

    return replacementArray;
  }

  /**
   * Draw the crosshair icon.
   * @param coordinate
   * @returns {ol.layer.Vector}
   */
  drawCrossHair(coordinate: CoordType): VectorLayer<VectorSource<Geometry>> {
    const iconFeature = new Feature({
      geometry: new Point([coordinate[0], coordinate[1]]),
      name: 'CrossHair',
      population: 4000,
      rainfall: 500,
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 24],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.PIXELS,
        opacity: 1,
        src: crosshairIcon,
      }),
    });

    iconFeature.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [iconFeature],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    vectorLayer.set('CustomLayerName', 'CrossHair');

    return vectorLayer;
  }

  /**
   * Get the layer that the crosshair icon is drawn to.
   * @param openLayersMapObject
   * @returns {boolean}
   */
  getCrosshairLayer(openLayersMapObject: OLMap): VectorTileLayer {
    let layer;
    const allLayers = openLayersMapObject.getLayers().getArray();

    for (const l of allLayers) {
      const layerName = l.get('CustomLayerName');
      if (layerName !== undefined) {
        layer = l;
        break;
      }
      layer = false;
    }

    return layer;
  }

  getCqlFilterString(layer: LayerConfig): string {
    if (objPropExists(layer, 'cqlFilter')) {
      const cql = [];
      const cqlFilterObj = layer.cqlFilter;
      for (const prop in cqlFilterObj) {
        if (cqlFilterObj[prop] !== null) cql.push(cqlFilterObj[prop]);
      }
      if (cql.length > 0) {
        return cql.join(' AND ');
      }
    }
    return null;
  }

  convertCoordProj(coords, startProj: string, endProj: string) {
    if (typeof coords[0] === 'number') {
      return proj4(startProj, endProj, coords);
    }
    const newCoords = [];
    for (let i = 0, len = coords.length; i < len; i += 1) {
      newCoords.push(this.convertCoordProj(coords[i], startProj, endProj));
    }
    return newCoords;
  }

  /**
   * Since we can't reproject a resolution, we instead take the map's center coordinate
   * and extent, reproject them, then create a new ol.View from them to get the resolution.
   */
  getMapResolutionInProjection(map, newProjection: string) {
    const view = map.getView();
    const mapProjection = view.getProjection().getCode();
    const center = view.getCenter();
    const zoom = view.getZoom();
    const extent = view.calculateExtent(map.getSize());
    const minxy = proj4(mapProjection, newProjection, [extent[0], extent[1]]);
    const maxxy = proj4(mapProjection, newProjection, [extent[2], extent[3]]);
    const newExtent: ExtentType = [minxy[0], minxy[1], maxxy[0], maxxy[1]];
    const tempView = new View({
      center: proj4(mapProjection, newProjection, center),
      extent: newExtent,
      zoom,
      projection: newProjection,
    });
    return tempView.getResolution();
  }

  /**
   * Takes a multidimensional array of coordinates and returns a string to use in a cql filter. Will convert coordinate projection if needed.
   *
   * @param coords - A multidimensional array of coordinates.
   * @param coordProj - The projection of the coordinates.
   * @param layerProj - The projection to convert to.
   */
  getCqlGeometry(coords: CoordType | Array<CoordType>, coordProj: string, layerProj: string): string {
    let geomString = '';
    if (typeof coords[0] === 'number') {
      if (coordProj !== layerProj) {
        const newCoords = proj4(coordProj, layerProj, coords as CoordType);
        geomString = `${newCoords[0]} ${newCoords[1]}`;
      } else {
        geomString = `${coords[0]} ${coords[1]}`;
      }
    } else {
      geomString = '(';
      const subGeoms = [];
      for (let i = 0, len = coords.length; i < len; i += 1) {
        const coord = coords[i];
        subGeoms.push(this.getCqlGeometry(coord as CoordType, coordProj, layerProj));
      }
      geomString += `${subGeoms.join(',')})`;
    }
    return geomString;
  }

  /**
   * Rounds a multidimensional array of coordinates.
   *
   * @param coords - a multidimensional array of coordinates.
   * @param decimalPlaces - The number of decimal places to round each coordinate.
   */
  roundCoordinates(coords, decimalPlaces: number) {
    if (typeof coords === 'number') {
      // If a number was passed during recursion, round and return it.
      // Create a multiplier to use in the rounding. e.g. 3 decimal places equals 1000 for multiplier.
      let multiplier = 1;
      for (let i = 0; i < decimalPlaces; i += 1) {
        multiplier *= 10;
      }
      return Math.round(coords * multiplier) / multiplier;
    }
    // Not a number then assumed to be array. Keep recursing.
    for (let i = 0, len = coords.length; i < len; i += 1) {
      coords[i] = this.roundCoordinates(coords[i], decimalPlaces);
    }
    return coords;
  }

  combineFeaturesByProperties(features, properties) {
    const newFeatures = [];
    const newFeaturesLookup = {};
    for (let i = 0, len = features.length; i < len; i += 1) {
      const feature = features[i];
      let combinedProperty = '';
      for (let j = 0, { length } = properties; j < length; j += 1) {
        const property = properties[j];
        if (objPropExists(feature.properties, property)) {
          combinedProperty += feature.properties[property];
        }
      }

      if (!objPropExists(newFeaturesLookup, combinedProperty)) {
        newFeaturesLookup[combinedProperty] = [];
      }
      newFeaturesLookup[combinedProperty].push(feature);
    }

    for (const prop of Object.keys(newFeaturesLookup)) {
      let obj: Record<string, Record<string, string>> = {};
      for (let i = 0, len = newFeaturesLookup[prop].length; i < len; i += 1) {
        const newFeature = newFeaturesLookup[prop][i];
        if (i === 0) {
          obj = newFeature;
        } else {
          if (newFeature.geometry !== null && obj.geometry !== null) {
            obj.geometry.coordinates = obj.geometry.coordinates.concat(newFeature.geometry.coordinates);
          }
          if (arguments.length > 2) {
            for (const argument of Object.keys(arguments)) {
              if (
                objPropExists(obj.properties, argument) &&
                objPropExists(newFeature.properties, argument) &&
                typeof obj.properties[argument] === 'number' &&
                typeof newFeature.properties[argument] === 'number'
              ) {
                obj.properties[argument] += newFeature.properties[argument];
              }
            }
          }
        }
      }
      newFeatures.push(obj);
    }
    return newFeatures;
  }
}
