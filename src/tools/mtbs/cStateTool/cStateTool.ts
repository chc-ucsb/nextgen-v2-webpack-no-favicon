/* The StateTool is a combobox that is populated using a wfs
   call to get the state names from a states layer */
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { MultiPolygon, Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import { Fill, Stroke, Style } from 'ol/style';
import { getRandomString } from '../../../helpers/string';
import { Transport } from '../../../Network/Transport';
import { objPropExists } from '../../../helpers/object';

export const cStateTool = {
  options: {
    requiredBlocks: [
      'cMapWindow',
      'cMapPanel',
      'cSelectRegionTool',
      'cSelectBBOXTool',
      'cSubStateTool',
      'cQueryParamsDisplay',
      'cResetQuery',
      'cRegionTool',
    ],
    events: ['select'],
  },
  layerConfigUpdated: function (postingObj, callbackObj, eventObj) {
    const extendedTool = callbackObj;
    if (extendedTool.vectorAdded === true) {
      const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
      const map = mapPanelBlock.component.map;
      map.removeLayer(extendedTool.vector);
      map.addLayer(extendedTool.vector);
    }
  },
  // Callback function that is called when area selector tool is used
  // Set the value of the state combobox if its valid
  aoiSelectedCallback: async function (callbackObj, postingObj) {
    const extendedTool = callbackObj;
    const aoiTool = postingObj;
    let stateValue = null;
    const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
    const map = mapPanelBlock.component.map;

    extendedTool.vector.getSource().clear();
    if (extendedTool.vectorAdded === true) {
      extendedTool.vectorAdded = false;
      map.removeLayer(extendedTool.vector);
    }

    /* Callback function that sets the state value on the tool if valid */
    const setValueCallback = function (value) {
      if (extendedTool.owningBlock.rendered === true) {
        extendedTool.component.setValue(value);
        extendedTool.stateValue = null;
      } else {
        extendedTool.stateValue = value;
      }

      if (stateValue === null) {
        //Set the state on the Query Params Display block to null
        const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
        if (cqlFilterDisplayBlock !== null) {
          cqlFilterDisplayBlock.extendedTool.setFilter('state', null);
        }
      }
    };
    /* Only set the value if the selectRegionTool was used since selectBBOXtool doesn't have a state */
    if (typeof aoiTool.lastClickCoord !== 'undefined' && typeof aoiTool.selectedFeatureId !== 'undefined') {
      /* Callback function that gets the stateValue of the features */
      const featureInfoCallback = function (returnFeatures) {
        if (returnFeatures.features.length > 0) {
          const layerMapping = extendedTool.owningBlock.blockConfig.layers[0];
          const idProperty = globalThis.App.Layers.getFeatureIdProperty(layerMapping.featureInfo);
          stateValue = returnFeatures.features[0].properties[idProperty];
        }
        setValueCallback(stateValue);
      };

      // Retrieve feature info from states layer using the aoi tool's last clicked coordinates.
      const statesBoundary = extendedTool.getStatesLayer();

      const res = await globalThis.App.OpenLayers.getLayerFeatureInfoViaXYCoord(statesBoundary, aoiTool.lastClickCoord, map);
      featureInfoCallback(res);
      // globalThis.App.OpenLayers.getFeatureInfoForLayerWithXYCoordAndMapUsingPromises(statesBoundary, aoiTool.lastClickCoord, map, featureInfoCallback);
      // featureInfoCallback(globalThis.App.OpenLayers.getFeatureInfoForLayerWithXYCoordAndMap(statesBoundary,
      // aoiTool.lastClickCoord, map));
    } else {
      setValueCallback(stateValue);
    }
  },
  createExtendedTool: function (owningBlock) {
    const owningMapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const owningMapWindow = owningMapWindowBlock.extendedTool;

    const extendedTool = {
      owningBlock: owningBlock,
      selectedStateId: null,
      stateValue: null,
      vector: new VectorLayer({
        source: new VectorSource(),
      }),
      vectorAdded: false,
      selectedCoords: null,
      selectedProjection: null,
      /* getStatesLayer will get the states layer to be used to query for the state names
       * and also the geoms once a state is selected */
      getStatesLayer() {
        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const layerMapping = this.owningBlock.blockConfig.layers[0];
        const layer = globalThis.App.Layers.query(
          layersConfig,
          {
            id: layerMapping.id,
          },
          ['overlays', 'boundaries']
        )[0];

        return layer;
      },
      /* getStatesStore will query the states layer for the state name
       * and state_fips and put it into a data store for loading the combobbox */
      async getStatesStore() {
        const layer = this.getStatesLayer();
        const layerMapping = this.owningBlock.blockConfig.layers[0];
        const featureInfoMapping = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['display', 'id']);
        const properties = [];

        for (var i = 0; i < featureInfoMapping.length; i += 1) {
          properties.push(featureInfoMapping[i].propertyName);
        }

        const propertyNameParam = '&propertyName=' + properties.join(',');
        const url = layer.source.wfs;
        const params =
          'service=WFS&request=GetFeature&version=1.1.0&srsName=' +
          layer.srs +
          '&typeNames=' +
          layer.name +
          '&outputFormat=application/json' +
          propertyNameParam;
        //var url =
        // 'http://igskmncnvs191.cr.usgs.gov:8080/geoserver/mtbs/wfs?service=WFS&request=GetFeature&version=1.1.0&srsName='+layer.srs+'&typeNames='+layer.name+'&outputFormat=json'+propertyNameParam+cqlFilterParam;

        // const res = await Transport.post(params).to(url, {
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //   },
        // });
        const res = await Transport.get(url + params);
        const stateCollection = await res.json();
        const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['id'], 'propertyName');
        const displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['display'], 'propertyName')[0];
        const fields = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['display', 'id'], 'propertyName');

        const features = globalThis.App.OpenLayers.combineFeaturesByProperties(stateCollection.features, idProperties);
        const states = [];
        let v = 0;
        const len = features.length;
        for (; v < len; v += 1) {
          const feature = features[v];
          const obj = {};
          let i = 0;
          const length = featureInfoMapping.length;
          for (; i < length; i += 1) {
            const featureInfoMap = featureInfoMapping[i];
            const value = globalThis.App.Layers.getFeatureInfoValue(feature, featureInfoMap.propertyName);
            obj[featureInfoMap.propertyName] = value;
          }
          states.push(obj);
        }
        //Sort the list alphabetically
        states.sort(function (a, b) {
          if (a[displayProperty].toLowerCase() < b[displayProperty].toLowerCase()) {
            return -1;
          }
          if (a[displayProperty].toLowerCase() > b[displayProperty].toLowerCase()) {
            return 1;
          }
          return 0;
        });
        // The data store holding the states
        const store = Ext.create('Ext.data.Store', {
          fields: fields,
          data: states,
        });
        /* Bind the store to the combobox */
        this.component.bindStore(store);

        if (objPropExists(this, 'stateValue') && extendedTool.stateValue !== null) {
          this.component.setValue(extendedTool.stateValue);
        }

        // asyncAjax({
        //   method: 'POST',
        //   url: url,
        //   body: params,
        //   callbackObj: this,
        //   callback: function(response, extendedTool) {
        //     //This returns the json of the state_fips, state for each record
        //     const stateCollection = JSON.parse(response.responseText);
        //     const layerMapping = extendedTool.owningBlock.blockConfig.layers[0];
        //     const featureInfoMapping = layerMapping.featureInfo;
        //     const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['id'], 'propertyName');
        //     const displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['display'], 'propertyName')[0];
        //     const fields = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['display', 'id'], 'propertyName');
        //
        //     const features = globalThis.App.OpenLayers.combineFeaturesByProperties(stateCollection.features, idProperties);
        //     const states = [];
        //     //var lookup = {};
        //     //Some states can have more than one geometry due to islands, etc so
        //     //make the list distinct
        //     let v = 0;
        //     const len = features.length;
        //     for (; v < len; v += 1) {
        //       const feature = features[v];
        //       const obj = {};
        //       let i = 0;
        //       const length = featureInfoMapping.length;
        //       for (; i < length; i += 1) {
        //         const featureInfoMap = featureInfoMapping[i];
        //         const value = globalThis.App.Layers.getFeatureInfoValue(feature, featureInfoMap.propertyName);
        //         obj[featureInfoMap.propertyName] = value;
        //       }
        //       states.push(obj);
        //     }
        //     //Sort the list alphabetically
        //     states.sort(function(a, b) {
        //       if (a[displayProperty].toLowerCase() < b[displayProperty].toLowerCase()) {
        //         return -1;
        //       }
        //       if (a[displayProperty].toLowerCase() > b[displayProperty].toLowerCase()) {
        //         return 1;
        //       }
        //       return 0;
        //     });
        //     // The data store holding the states
        //     const store = Ext.create('Ext.data.Store', {
        //       fields: fields,
        //       data: states,
        //     });
        //     /* Bind the store to the combobox */
        //     extendedTool.component.bindStore(store);
        //
        //     if (extendedTool.hasOwnProperty('stateValue') && extendedTool.stateValue !== null) {
        //       extendedTool.component.setValue(extendedTool.stateValue);
        //     }
        //   },
        // });
      },
      /* Using our coordinates get an open layers object */
      getOLGeometry: function (coords, type, coordProjection) {
        const mapPanelBlock = this.owningblock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        const mapProjection = map.getView().getProjection().getCode();

        if (coordProjection !== mapProjection) {
          coords = globalThis.App.OpenLayers.convertCoordProj(coords, coordProjection, mapProjection);
        }
        if (type === 'MultiPolygon') {
          return new MultiPolygon(coords);
        } else if (type === 'Polygon') {
          return new Polygon(coords);
        }
        return null;
      },
      /* Get the states geometry */
      getStateGeometry: async function () {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;

        if (this.vectorAdded === true) {
          this.vector.getSource().clear();
        } else {
          map.addLayer(this.vector);
          this.vectorAdded = true;
        }
        const stateId = extendedTool.selectedStateId;
        const layerMapping = this.owningBlock.blockConfig.layers[0];
        const idProperty = globalThis.App.Layers.getFeatureIdProperty(layerMapping.featureInfo);
        const cqlIdQuery = idProperty + " = '" + stateId + "'";
        const cqlFilterParam = '&CQL_FILTER=' + cqlIdQuery;
        const layer = this.getStatesLayer();
        const url = layer.source.wfs;
        const params =
          'service=WFS&request=GetFeature&version=1.1.0&srsName=' +
          layer.srs +
          '&typeNames=' +
          layer.name +
          '&outputFormat=application/json' +
          cqlFilterParam;

        const res = await Transport.get(url + params);
        const mapProjection = map.getView().getProjection().getCode();
        const featureCollection = await res.json();
        const statesLayerCRS = layer.srs;
        const features = featureCollection.features;
        const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName');
        const displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['display'], 'propertyName')[0];
        const mappedOverlays = globalThis.App.Layers.filterByTypes(this.owningBlock.blockConfig.layers, ['overlay']);
        let feature;

        if (features.length > 0) {
          feature = globalThis.App.OpenLayers.combineFeaturesByProperties(features, idProperties)[0];
        } else {
          feature = features[0];
        }
        if (mapProjection !== statesLayerCRS) {
          this.selectedCoords = globalThis.App.OpenLayers.convertCoordProj(
            JSON.parse(JSON.stringify(feature.geometry.coordinates)),
            statesLayerCRS,
            mapProjection
          );
        } else {
          this.selectedCoords = feature.geometry.coordinates;
        }
        this.selectedProjection = mapProjection;

        const cqlFilterDisplayBlock = this.owningBlock.getReferencedBlock('cQueryParamsDisplay');
        if (cqlFilterDisplayBlock !== null) {
          cqlFilterDisplayBlock.extendedTool.setFilter('state', 'State: ' + feature.properties[displayProperty]);
        }

        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const id = this.cqlFilterId;

        for (let mappedOverlay of mappedOverlays) {
          const overlayers = globalThis.App.Layers.query(
            layersConfig,
            {
              type: 'layer',
              mask: false,
              id: mappedOverlay.id,
            },
            ['overlays', 'boundaries']
          );
          if (overlayers.length === 0) return;

          const overlayer = overlayers[0];
          if (!objPropExists(overlayer, 'cqlFilter')) {
            overlayer.cqlFilter = {};
          }
          if (!objPropExists(overlayer.cqlFilter, id)) {
            overlayer.cqlFilter[id] = '';
          }

          const statesLayerCRS = layer.srs;
          const geomString = globalThis.App.OpenLayers.getCqlGeometry(feature.geometry.coordinates, statesLayerCRS, overlayer.srs);
          overlayer.cqlFilter[id] = `INTERSECTS(${overlayer.geometryName}, MULTIPOLYGON${geomString})`;

          /* Update the map with the fires based on the cql filter */
          globalThis.App.OpenLayers.forceLayerUpdateById(overlayer.id, map);
        }

        /* Zoom in on the map to the state selected */
        const coordinates = globalThis.App.OpenLayers.convertCoordProj(feature.geometry.coordinates, statesLayerCRS, mapProjection);
        const type = feature.geometry.type;
        let olGeom;
        if (type === 'MultiPolygon') {
          olGeom = new MultiPolygon(coordinates);
        } else {
          olGeom = new Polygon(coordinates);
        }

        const olFeature = new Feature(olGeom);
        olFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: 'rgba(0,0,255,1)',
              width: 4,
            }),
            fill: new Fill({
              color: 'rgba(0,0,0,0)',
            }),
          })
        );
        this.vector.getSource().addFeature(olFeature);

        map.getView().fit(olGeom);
        map.removeLayer(extendedTool.vector);
        map.addLayer(extendedTool.vector);

        /* Update the Fire statistics panel */
        extendedTool.owningBlock.fire('select', extendedTool);
        globalThis.App.EventHandler.postEvent(
          globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED,
          layersConfig,
          globalThis.App.Layers.layersConfig
        );

        // asyncAjax({
        //   method: 'POST',
        //   url: url,
        //   body: params,
        //   callbackObj: {
        //     layer: layer,
        //     extendedTool: this,
        //   },
        //   callback: function(response, callbackObj) {
        //     const layer = callbackObj.layer;
        //     const extendedTool = callbackObj.extendedTool;
        //     const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
        //     const map = mapPanelBlock.component.map;
        //     const mapProjection = map
        //       .getView()
        //       .getProjection()
        //       .getCode();
        //     const featureCollection = JSON.parse(response.responseText);
        //     var statesLayerCRS = layer.srs;
        //     const features = featureCollection.features;
        //     const layerMapping = globalThis.App.Layers.getLayerConfig(layer.id, extendedTool.owningBlock.blockConfig.layers);
        //     const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName');
        //     const displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['display'], 'propertyName')[0];
        //
        //     const mappedOverlays = globalThis.App.Layers.filterByTypes(extendedTool.owningBlock.blockConfig.layers, ['overlay']);
        //     //var polygons = [];
        //
        //     /*for (var i = 0, len = features.length; i < len; i+=1) {
        //      var feature = features[i];
        //      var coordinates = feature.geometry.coordinates;
        //      polygons = polygons.concat(coordinates);
        //      }*/
        //     if (features.length > 1) {
        //       var feature = globalThis.App.OpenLayers.combineFeaturesByProperties(features, idProperties)[0];
        //     } else {
        //       var feature = features[0];
        //     }
        //     if (mapProjection !== statesLayerCRS) {
        //       extendedTool.selectedCoords = globalThis.App.OpenLayers.convertCoordProj(JSON.parse(JSON.stringify(feature.geometry.coordinates)), statesLayerCRS, mapProjection);
        //     } else {
        //       extendedTool.selectedCoords = feature.geometry.coordinates;
        //     }
        //     extendedTool.selectedProjection = mapProjection;
        //     // var vector = new ol.layer.Vector({
        //     //     source: new ol.source.Vector()
        //     // });
        //
        //     const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
        //     if (cqlFilterDisplayBlock !== null) {
        //       cqlFilterDisplayBlock.extendedTool.setFilter('state', 'State: ' + feature.properties[displayProperty]);
        //     }
        //
        //     const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        //
        //     const id = callbackObj.extendedTool.cqlFilterId;
        //
        //     let i = 0;
        //     const len = mappedOverlays.length;
        //     for (; i < len; i += 1) {
        //       const mappedOverlay = mappedOverlays[i];
        //
        //       const overlayers = globalThis.App.Layers.query(
        //         layersConfig,
        //         {
        //           type: 'layer',
        //           mask: false,
        //           id: mappedOverlay.id,
        //         },
        //         ['overlays', 'boundaries']
        //       );
        //
        //       if (overlayers.length === 0) continue;
        //       const overlayer = overlayers[0];
        //
        //       if (!overlayer.hasOwnProperty('cqlFilter')) {
        //         overlayer.cqlFilter = {};
        //       }
        //       if (!overlayer.cqlFilter.hasOwnProperty(id)) {
        //         overlayer.cqlFilter[id] = '';
        //       }
        //
        //       var statesLayerCRS = layer.srs;
        //       const geomString = globalThis.App.OpenLayers.getCqlGeometry(feature.geometry.coordinates, statesLayerCRS, overlayer.srs);
        //       const cqlFilter = 'INTERSECTS(' + overlayer.geometryName + ', MULTIPOLYGON' + geomString + ')';
        //       overlayer.cqlFilter[id] = cqlFilter;
        //
        //       /* Update the map with the fires based on the cql filter */
        //       globalThis.App.OpenLayers.forceLayerUpdateById(overlayer.id, map);
        //     }
        //
        //     /* Zoom in on the map to the state selected */
        //     const coordinates = globalThis.App.OpenLayers.convertCoordProj(feature.geometry.coordinates, statesLayerCRS, mapProjection);
        //     const type = feature.geometry.type;
        //     let olGeom;
        //     if (type === 'MultiPolygon') {
        //       olGeom = new MultiPolygon(coordinates);
        //     } else {
        //       olGeom = new Polygon(coordinates);
        //     }
        //
        //     const olFeature = new Feature(olGeom);
        //     olFeature.setStyle(
        //       new Style({
        //         stroke: new Stroke({
        //           color: 'rgba(0,0,255,1)',
        //           width: 4,
        //         }),
        //         fill: new Fill({
        //           color: 'rgba(0,0,0,0)',
        //         }),
        //       })
        //     );
        //     extendedTool.vector.getSource().addFeature(olFeature);
        //
        //     map.getView().fit(olGeom);
        //     // map.getView().fit(olGeom, {
        //     //   size: map.getSize()
        //     // });
        //     // const extent = olGeom.getExtent()
        //     //   map.getView().fit(olGeom);
        //
        //     map.removeLayer(extendedTool.vector);
        //     map.addLayer(extendedTool.vector);
        //     /* Update the Fire statistics panel */
        //     extendedTool.owningBlock.fire('select', extendedTool);
        //     globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED, layersConfig, globalThis.App.Layers.layersConfig);
        //   },
        // });
      },
    };

    const regionBlock = owningBlock.getReferencedBlock('cRegionTool');
    if (regionBlock !== null) {
      regionBlock.on(
        'regionSelected',
        function (callbackObj, postingObj) {
          const extendedTool = callbackObj;
          if (extendedTool.owningBlock.rendered === false) return;

          extendedTool.component.setValue(null);
          extendedTool.stateValue = null;

          if (extendedTool.vectorAdded === true) {
            const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            const map = mapPanelBlock.component.map;
            map.removeLayer(extendedTool.vector);
            extendedTool.vector.getSource().clear();
            extendedTool.vectorAdded = false;
          }

          const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('state', null);
          }
        },
        extendedTool
      );
    }

    const resetQueryBlock = owningBlock.getReferencedBlock('cResetQuery');
    if (resetQueryBlock !== null) {
      resetQueryBlock.on(
        'click',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          if (extendedTool.owningBlock.rendered === false) return;
          const layerMapping = extendedTool.owningBlock.blockConfig.layers[0];

          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layers = globalThis.App.Layers.query(
            layersConfig,
            {
              id: layerMapping.id,
            },
            ['overlays', 'boundaries']
          );

          let i = 0;
          const len = layers.length;
          for (; i < len; i += 1) {
            const layer = layers[i];
            if (layer.hasOwnProperty('cqlFilter') && layer.cqlFilter.hasOwnProperty(extendedTool.cqlFilterId)) {
              layer.cqlFilter[extendedTool.cqlFilterId] = null;
            }
          }

          const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('state', null);
          }

          extendedTool.component.setValue(null);
          extendedTool.stateValue = null;

          if (extendedTool.vectorAdded === true) {
            const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            const map = mapPanelBlock.component.map;
            map.removeLayer(extendedTool.vector);
            extendedTool.vector.getSource().clear();
            extendedTool.vectorAdded = false;
          }
        },
        extendedTool
      );
    }

    /* Set up the listener for select region tool so the state gets set to the selected state */
    const selectRegionToolBlock = owningBlock.getReferencedBlock('cSelectRegionTool');
    if (selectRegionToolBlock !== null) {
      selectRegionToolBlock.on('aoiSelected', owningBlock.itemDefinition.aoiSelectedCallback, extendedTool);
    }

    /* Set up the listener for the bbox tool so the state gets set to null */
    const selectBBOXToolBlock = owningBlock.getReferencedBlock('cSelectBBOXTool');
    if (selectBBOXToolBlock !== null) {
      selectBBOXToolBlock.on('aoiSelected', owningBlock.itemDefinition.aoiSelectedCallback, extendedTool);
    }

    const subStateBlock = owningBlock.getReferencedBlock('cSubStateTool');
    if (subStateBlock !== null) {
      subStateBlock.on(
        'select',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          if (extendedTool.vectorAdded === true) {
            const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            const map = mapPanelBlock.component.map;
            map.removeLayer(extendedTool.vector);
            extendedTool.vector.getSource().clear();
            extendedTool.vectorAdded = false;
          }
        },
        extendedTool
      );
    }

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
      extendedTool.owningBlock.itemDefinition.layerConfigUpdated,
      extendedTool
    );

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const owningMapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
    if (!owningMapWindowBlock.hasOwnProperty('featureCqlFilterId')) {
      owningMapWindowBlock.featureCqlFilterId = getRandomString(32, 36);
    }
    extendedTool.cqlFilterId = owningMapWindowBlock.featureCqlFilterId;

    const layerMapping = extendedTool.owningBlock.blockConfig.layers[0];
    const featureInfoMapping = layerMapping.featureInfo;
    const valueField = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['id'], 'propertyName')[0];
    const displayField = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['display'], 'propertyName')[0];

    // Simple ComboBox using the data store
    const simpleCombo = Ext.create('Ext.form.field.ComboBox', {
      extendedTool: extendedTool,
      fieldLabel: 'State',
      autoRender: true,
      editable: false,
      region: 'north',
      width: 225,
      labelWidth: 50,
      style: {
        marginTop: '10px',
        marginLeft: '35px',
        marginRight: '35px',
      },
      queryMode: 'local',
      typeAhead: true,
      valueField: valueField,
      displayField: displayField,
      listeners: {
        expand: function (combo) {
          const val = combo.getValue();

          if (val !== null) {
            const rec = combo.findRecordByValue(combo.getValue()),
              node = combo.picker.getNode(rec);

            combo.picker.getTargetEl().setScrollTop(node.offsetTop);
          }
        },
        /* When a new state is selected, it should get the geometry of that state from the
         states layer and display the fires for that specific state.
         It will also then need to populate the counties or watershed combobox
         based on which ever one is selected */
        select: function (t, options) {
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layers = globalThis.App.Layers.query(layersConfig.overlays, {
            type: 'layer',
            display: true,
            mask: false,
          });

          this.extendedTool.selectedStateId = t.value;
          this.extendedTool.getStateGeometry();
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.getStatesStore();
        },
      },
    });
    return simpleCombo;
  },
};
