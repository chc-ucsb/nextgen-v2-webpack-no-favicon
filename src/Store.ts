import proj4 from 'proj4';
import { parseISO } from 'date-fns';
import { Dictionary, AppStore, LayerConfig } from './@types';
import { reportActivity } from './Analytics';
import { Charter } from './Charter/Charter';
import { Blueprint } from './Architect';
import { EventHandler } from './EventCenter';
import { MapWrapper } from './Map';
import { SkinTools } from './SkinTools';
import { Chart } from './Charter/Chart';
import { ApplicationSettings } from './Config';
import { objPropExists } from './helpers/object';
import { logger } from './utils';
import { LayerHandler } from './LayerHandler';
import { addCurrentYearToYearsList } from './helpers/chart';
import { Granule } from './Granules';

const getWindowUrlParameters = (location: Location): Dictionary => {
  if (location.search !== '') {
    const parameters = location.search.slice(1).split('&');
    const kvps: Dictionary = {};
    for (let i = 0, len = parameters.length; i < len; i += 1) {
      const parameter = parameters[i];
      if (parameter.indexOf('=') !== -1) {
        const kvp = parameter.split('=');
        if (kvp[0] !== '' || kvp[1] !== '') {
          kvps[kvp[0]] = kvp[1];
        }
      }
    }
    return kvps;
  }
  return [];
};

const getRemoteResource = (): Dictionary => {
  return {
    updateLayersConfig(): void {
      const layerNodes = globalThis.App.Config.sources.layers;
      for (const lNode of Object.keys(layerNodes)) {
        globalThis.App.Config.sources.layers[lNode] = this.updateLayerAttributes(layerNodes[lNode]); // Update config here
      }
    },

    updateLayerAttributes(layers: Array<LayerConfig>): Array<LayerConfig> {
      for (let layer of layers) {
        if (layer.type === 'folder') {
          layer = this.updateLayerAttributes(layer.folder);
        } else if (layer.type === 'layer') {
          // Check if RemoteResource has data for the layer ID.
          // Data won't be present if the config url failed during fetch.
          // If there's no time series data, then we delete the timeseries property from the layer.
          if (!globalThis.App.RemoteResource[layer.id]) delete layer.timeseries;

          if (layer.timeseries !== undefined) {
            const remoteResource = globalThis.App.RemoteResource[layer.id];
            const resource = Object.keys(remoteResource)
              .map((key) => {
                if (Object.keys(remoteResource[key]).includes(layer.additionalAttributes.rasterDataset)) {
                  return remoteResource[key][layer.additionalAttributes.rasterDataset];
                }
              })
              .find((el) => el !== undefined);

            // eslint-disable-next-line no-continue
            if (!resource) continue;
            // eslint-disable-next-line no-continue
            if (resource.start.granule_start === null) continue;
            if (objPropExists(resource, 'children')) {
              if (resource.children[resource.children.length - 1].end.granule_start !== null) {
                resource.end = {
                  granule_start: resource.children[resource.children.length - 1].end.granule_start,
                  granule_end: resource.children[resource.children.length - 1].end.granule_end,
                };
              }
            }
            const config = {
              start: parseISO(resource.start.granule_start),
              end: parseISO(resource.end.granule_end),
              periodType: resource.period,
              continuous: resource.continuous,
              offset: undefined,
              children: [],
            };

            if (objPropExists(resource, 'children')) {
              config.children = resource.children;
            }
            if (objPropExists(layer, 'datepickerperiodoffset')) {
              config.offset = parseInt(layer.datepickerperiodoffset);
            }

            // Create Granule for layer
            const granule = new Granule(config, globalThis.App.Config.time);
            if (config.children.length > 0 && config.children[config.children.length - 1].end.granule_start !== null) {
              granule.makeChildLabel(config.children);
            }

            globalThis.App.Layers._granules.set(layer.id, granule);
            globalThis.App.Layers._originalGranules.set(layer.id, granule);
          }
        }
      }
      return layers;
    },

    /**
     * Gets chart attributes from feature info.
     */
    getChartAttributes(chartItem, overlay, boundary, coords): Dictionary {
      const { chartYAxisLabel, chartStartMonthFeatureProperty } = overlay.additionalAttributes;
      let startMonth;

      // Some datasets require that their charts start when the water season starts and some require that their charts start when the grow season starts.
      // These two values aren't always the same.
      let _chartStartMonthFeatureProperty = chartStartMonthFeatureProperty;

      // Assume WS_START (Water Season Start) if not specified on the layer.
      if (!chartStartMonthFeatureProperty) _chartStartMonthFeatureProperty = 'WS_START';

      if (chartItem.startMonth !== null) {
        startMonth = chartItem.startMonth;
      } else if (objPropExists(boundary.featureInfo, _chartStartMonthFeatureProperty)) {
        // Taken from layers.ts
        startMonth = boundary.featureInfo[_chartStartMonthFeatureProperty].value;
      } else {
        startMonth = null;
      }

      const allSeasons = [];
      const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
      for (let i = 0, len = chartItem.timeseriesSourceLayerIds.length; i < len; i += 1) {
        let id = chartItem.timeseriesSourceLayerIds[i];

        // Support for overriding the timeseriesSourceLayerId if the 'impersonate' property is set.
        if (chartItem.overlay.impersonate) id = chartItem.overlay.impersonate;

        const layers = globalThis.App.Layers.query(layersConfig.overlays, { id });
        if (layers.length > 0) {
          const layer = layers[0];
          // Get the actual season names as they will be shown in the chart.
          const seasons = globalThis.App.Layers.getSeasonsList(layer, startMonth);
          for (let j = 0, { length } = seasons; j < length; j += 1) {
            const season = seasons[j];
            if (allSeasons.indexOf(season) === -1) {
              allSeasons.push(season);
            }
          }
        }
      }

      const attributeObj = {
        seasons: allSeasons,
        startMonth,
        layerName: '',
      };

      // Even though the variable is called layerName, what it actually stores is the polygon name.
      if (boundary.featureInfo.POLY_NAME) {
        if (boundary.featureInfo.POLY_NAME.value) {
          attributeObj.layerName = decodeURIComponent(boundary.featureInfo.POLY_NAME.value);
        } else {
          logger.log('POLY_NAME value missing');
        }
      } else if (boundary.featureInfo.Zone_ID) {
        if (boundary.featureInfo.Zone_ID.value) {
          attributeObj.layerName = overlay.title;
        } else {
          logger.log('Zone_ID value missing');
        }
      } else if (boundary.featureInfo.POLY_ID) {
        if (boundary.featureInfo.POLY_ID.value) {
          // AttributeObj.layerName = overlay.title;
          attributeObj.layerName = decodeURIComponent(boundary.featureInfo.POLY_ID.value);
        } else {
          logger.log('POLY_ID value missing');
        }
      } else {
        logger.log('POLY_NAME/Zone_ID/POLY_ID missing');
      }

      return attributeObj;
    },

    /**
     *  Location of all getter functions for url parameters used when calling buildUrlParams
     *
     *  The buildUrlParams function will take each variable parameter and replace it with
     *  the return of the appropriate function below. For example, the parameter {{fewsId}} will convert the parameter
     *  to a function name of 'getFewsId', call the function by name, and replace {{fewsId}} with the return value.
     */
    urlParamGetters: {
      getWcsLayerName(obj): string {
        if (objPropExists(obj.layer, 'wmstName')) return obj.layer.wmstName;
        return obj.layer.name;
      },
      getWcsExtentLowerLeftX(obj): number {
        return obj.layer.layerExtent[0];
      },
      getWcsExtentLowerLeftY(obj): number {
        return obj.layer.layerExtent[1];
      },
      getWcsExtentUpperRightX(obj): number {
        return obj.layer.layerExtent[2];
      },
      getWcsExtentUpperRightY(obj): number {
        return obj.layer.layerExtent[3];
      },
      getWcsRasterPixelHeight(obj): number {
        return obj.layer.pixelHeight;
      },
      getWcsRasterPixelWidth(obj): number {
        return obj.layer.pixelWidth;
      },
      getWcsLowerLeftX(obj): number {
        return obj.currentExtent[0] < obj.region.bbox[0] ? obj.region.bbox[0] : obj.currentExtent[0];
      },
      getWcsLowerLeftY(obj): number {
        return obj.currentExtent[1] < obj.region.bbox[1] ? obj.region.bbox[1] : obj.currentExtent[1];
      },
      getWcsUpperRightX(obj): number {
        return obj.currentExtent[2] > obj.region.bbox[2] ? obj.region.bbox[2] : obj.currentExtent[2];
      },
      getWcsUpperRightY(obj): number {
        return obj.currentExtent[3] > obj.region.bbox[3] ? obj.region.bbox[3] : obj.currentExtent[3];
      },
      getWcsUrl(obj): string {
        let url = obj.layer.source.wcs;
        if (objPropExists(obj.layer, 'cqlFilter')) {
          const cqlFilter = [];
          for (const prop of Object.keys(obj.layer.cqlFilter)) {
            cqlFilter.push(obj.layer.cqlFilter[prop]);
          }
          url += `?FILTER=${cqlFilter.join(' AND ')}`;
        }
        return encodeURIComponent(url);
      },
      getResolution(obj): number {
        return obj.layer.resolution;
      },
      getPixelHeight(obj): number {
        return obj.layer.pixelHeight;
      },
      getPixelWidth(obj): number {
        return obj.layer.pixelWidth;
      },

      getWcsInputSrs2(obj): string {
        return obj.layer.srs;
      },
      getWcsInputSrs(obj): string {
        return obj.region.srs;
      },
      getWcsOutputSrs(obj): string {
        let returnVal = obj.layer.srs;
        if (typeof obj.layer.wcsOutputSRS !== 'undefined') {
          returnVal = obj.layer.wcsOutputSRS;
        }
        return returnVal;
      },
      getLayerId(obj): string {
        return obj.layer.id;
      },
      // TODO: Should these function names be updated to match new G5 properties, or keep the current, more descriptive names?
      getFewsId(obj): string {
        return encodeURIComponent(obj.boundary.featureInfo.POLY_NAME.value);
      },
      getFewsCode(obj): string {
        return encodeURIComponent(obj.boundary.featureInfo.POLY_ID.value);
      },
      getZoneId(obj): string {
        return encodeURIComponent(obj.boundary.featureInfo.Zone_ID.value);
      },
      getPeriodicity(obj): string {
        const { alias } = globalThis.App.Config.sources.periods[obj.overlay.timeseries.type];
        const hasHyphen = alias.indexOf('-') > -1;

        if (hasHyphen) {
          const num = alias.slice(0, 1);
          const periodicity = alias.slice(2).toLowerCase();

          if (num > 1) {
            return `${num}${periodicity}`;
          }
          return periodicity;
        }

        return alias.toLowerCase();
      },
      getStatistic(obj): string {
        return obj.overlay.additionalAttributes.statistic;
      },
      getSeasons(obj): string {
        const seasons = addCurrentYearToYearsList(globalThis.App.Layers.getSeasonsList(obj.overlay, 1));
        let output = seasons.join('%2C');
        if (output.endsWith('%2C')) output = output.slice(0, -3);
        return output;
      },
      getSnowSeasons(obj): Array<string> {
        const seasons = globalThis.App.Layers.getSeasonsList(obj.overlay, 1);
        return seasons.join('%2C');
      },
      getRasterDataset(obj): string {
        // Create an array containing the current layer
        let rasterDataset: Array<string> = [obj.overlay.additionalAttributes.rasterDataset];

        // Check if the current layer has a granule
        const granule: Granule = globalThis.App.Layers._granules.get(obj.overlay.id);
        if (granule) {
          // Get all the intervals that contain a layerName property (child datasets)
          const granuleIntervals = granule.intervals.filter((interval) => interval.layerName);
          // Extract the layerNames from the intervals
          const layerNames = granuleIntervals.map((interval) => interval.layerName);
          // Remove any duplicate layer names
          const uniqueLayerNames = Array.from(new Set(layerNames));
          // Append the layer names to the raster collection.
          rasterDataset = rasterDataset.concat(uniqueLayerNames);
        }

        // Create a string by joining the entries together with a colon.
        // If only 1 entry (no child datasets) then there will be no colon in the output.
        return rasterDataset.join(':');
      },
      getVectorDataset(obj): string {
        return obj.boundaryName;
      },
      getUrl(parsedUrl): string {
        return parsedUrl.baseURL;
      },
      getService(parsedUrl): string {
        return parsedUrl.service;
      },
      getRequest(parsedUrl): any {
        return parsedUrl.request;
      },
      getLat(obj): number {
        const layerProjection = obj.boundary.srs;
        const mapProjection = obj.projection;
        let { coords } = obj;
        coords = proj4(mapProjection, layerProjection, coords);

        /*
         * Depending on the projection, coordinates are lat-lon or lon-lat.
         * see examples
         * https://igskmncnvs191.cr.usgs.gov:8443/geoserver/wcs?service=WCS&version=2.0.1&request=describecoverage&coverageid=qdvdemodis:qdvdemodis_qdhydrounits_1-sevenday-39-2018_mm_data
         * https://igskmncnvs191.cr.usgs.gov:8443/geoserver/wcs?service=WCS&version=2.0.1&request=describecoverage&coverageid=fewschirps:fewschirps_fewsafrica_1-pentad-48-2018_mm_data
         * look at GridFunction axisOrder
         * its flipped for 3857 and 4326 layers
         *
         * 4326 order: lon (y), lat (x)
         * 3785 order: lat (x), lon (y)
         */

        // let whichCoord = -1;
        //
        // if (layerProjection === 'EPSG:3857') {
        //   whichCoord = coords[1];
        // } else if (layerProjection === 'EPSG:4326') {
        //   whichCoord = coords[0];
        // }
        // if (whichCoord === -1) {
        //   console.error('Projection order not defined.');
        // }
        //
        // return whichCoord;
        return coords[1];
      },
      getLon(obj): number {
        const layerProjection = obj.boundary.srs;
        const mapProjection = obj.projection;
        let { coords } = obj;
        coords = proj4(mapProjection, layerProjection, coords); // (lat, lon)

        /*
         * Depending on the projection, coordinates are lat-lon or lon-lat.
         * see examples
         * https://igskmncnvs191.cr.usgs.gov:8443/geoserver/wcs?service=WCS&version=2.0.1&request=describecoverage&coverageid=qdvdemodis:qdvdemodis_qdhydrounits_1-sevenday-39-2018_mm_data
         * https://igskmncnvs191.cr.usgs.gov:8443/geoserver/wcs?service=WCS&version=2.0.1&request=describecoverage&coverageid=fewschirps:fewschirps_fewsafrica_1-pentad-48-2018_mm_data
         * look at GridFunction axisOrder
         * its flipped for 3857 and 4326 layers
         *
         * 4326 order: lon (y), lat (x)
         * 3785 order: lat (x), lon (y)
         */

        // let whichCoord = -1;
        //
        // if (layerProjection === 'EPSG:3857') {
        //   whichCoord = coords[0];
        // } else if (layerProjection === 'EPSG:4326') {
        //   whichCoord = coords[1];
        // }
        // if (whichCoord === -1) {
        //   console.error('Projection order not defined.');
        // }

        // return whichCoord;
        return coords[0];
      },
    },

    getChartItem(chartId): Chart {
      for (const mc of Object.keys(globalThis.App.Config.sources.charts)) {
        if (globalThis.App.Config.sources.charts[mc].id === chartId) {
          return globalThis.App.Config.sources.charts[mc];
        }
      }
    },
  };
};

export class Store implements AppStore {
  Config: Dictionary;
  Viewport: { addItems(viewPortItems: any): void };
  Tools: Dictionary;
  Charter: Charter;
  EventHandler: EventHandler;
  Analytics: { reportActivity: (file: string, eventCategory: string, eventAction: string) => void };
  Layers: LayerHandler;
  OpenLayers: MapWrapper;
  RemoteResource: Dictionary;
  urlParameters: Dictionary;
  _blueprints: Array<Blueprint>;

  constructor(settings: ApplicationSettings) {
    this.Config = settings;
    this.Viewport = {
      addItems(viewPortItems): void {
        Ext.create('Ext.Viewport', {
          layout: 'fit',
          items: viewPortItems,
        });
      },
    };
    this.OpenLayers = new MapWrapper();
    this.Tools = SkinTools;
    this.EventHandler = new EventHandler();
    this.Analytics = {
      reportActivity,
    };
    this.RemoteResource = getRemoteResource();
    this.urlParameters = getWindowUrlParameters(globalThis.location);

    this.Layers = new LayerHandler(this);
  }
}
