import { MultiPolygon, Polygon } from 'ol/geom';
import { Fill, Stroke, Style } from 'ol/style';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { getRandomString } from '../../../helpers/string';
import { Transport } from '../../../Network/Transport';

export const cSubStateTool = {
  options: {
    requiredBlocks: [
      'cMapWindow',
      'cMapPanel',
      'cStateTool',
      'cSelectRegionTool',
      'cSelectBBOXTool',
      'cQueryParamsDisplay',
      'cResetQuery',
      'cSelectRegionMenuRadioGroup',
      'cRegionTool',
      'cRegionSelectorMenu',
      'cSelectRegionToolRadioGroup',
    ],
    events: ['select'],
  },
  createExtendedTool: function (owningBlock) {
    const extendedTool = {
      owningBlock: owningBlock,
      lastBoundaryId: null,
      lastSelectedStateId: null,
      vector: new VectorLayer({
        source: new VectorSource(),
      }),
      vectorAdded: false,
      layer: null,
      selectedLayerId: null,
      presetSelection: null,
      selectedCoords: null,
      selectedProjection: null,
      cqlFilterId: null,
      getChildBoundaryId: function () {
        const boundaryToggleTool = this.owningBlock.getReferencedBlock('cBoundaryToggleTool');
        if (boundaryToggleTool.component.pressed === true) {
          return boundaryToggleTool.extendedTool.boundaryId;
        }

        const relatedBlueprints = boundaryToggleTool.blueprint.relatedBlockBlueprints;
        let i = 0;
        const len = relatedBlueprints.length;
        for (; i < len; i += 1) {
          const blueprint = relatedBlueprints[i];
          if (blueprint.block !== null && blueprint.block.component.pressed === true) {
            return blueprint.block.extendedTool.boundaryId;
          }
        }

        return null;
      },
      setStore: async function (selectedId) {
        if (this.owningBlock.rendered !== true || this.layer === null) return;
        const statesBlock = this.owningBlock.getReferencedBlock('cStateTool');
        const stateId = statesBlock.extendedTool.stateValue === null ? statesBlock.component.getValue() : statesBlock.extendedTool.stateValue;
        const layerMapping = this.owningBlock.blockConfig.layers;
        let parentLayerMapping;
        let childLayerMapping;
        const childLayerId = this.layer.id;

        if (stateId === null || childLayerId === null) {
          this.component.setValue(null);
          this.component.getStore().removeAll();
          return;
        }

        for (var i = 0, len = layerMapping.length; i < len; i += 1) {
          const mapping = layerMapping[i];
          if (mapping.id === childLayerId) {
            childLayerMapping = mapping;
          } else if (mapping.type === 'parentBoundary') {
            parentLayerMapping = mapping;
          }
        }

        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const parentBoundary = globalThis.App.Layers.query(layersConfig.boundaries, {
          id: parentLayerMapping.id,
        })[0];
        const childBoundary = globalThis.App.Layers.query(layersConfig.boundaries, {
          id: childLayerMapping.id,
        })[0];

        if (stateId === this.lastSelectedStateId && childBoundary.id === this.lastBoundaryId) {
          return;
        }

        this.component.setValue(null);
        this.component.getStore().removeAll();

        this.lastSelectedStateId = stateId;
        this.lastBoundaryId = childBoundary.id;

        if (childBoundary !== null) {
          let url = parentBoundary.source.wfs;
          const parentIdProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(parentLayerMapping.featureInfo, ['id'], 'propertyName')[0];

          let params =
            'service=WFS&request=GetFeature&version=1.1.0&srsName=' +
            parentBoundary.srs +
            '&typeNames=' +
            parentBoundary.name +
            '&outputFormat=application/json&cql_filter=where ' +
            parentIdProperty +
            " = '" +
            stateId +
            "'";

          const childBoundaryRes = await Transport.post(params).to(url, {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded',
            },
          });
          const childBoundaryFeatureInfo = await childBoundaryRes.json();
          if (childBoundaryFeatureInfo.features.length === 0) return;

          const mappedLayer = globalThis.App.Layers.getLayerConfig(parentBoundary.id, this.owningBlock.blockConfig.layers);
          let idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(mappedLayer.featureInfo, ['id'], 'propertyName');

          const feature = globalThis.App.OpenLayers.combineFeaturesByProperties(childBoundaryFeatureInfo.features, idProperty)[0];
          url = childBoundary.source.wfs;
          const coordProjection = parentBoundary.srs;
          const cqlFilterGeom = globalThis.App.OpenLayers.getCqlGeometry(feature.geometry.coordinates, coordProjection, childBoundary.srs);
          const cqlFilter = 'INTERSECTS(' + feature.geometry_name + ',' + feature.geometry.type + cqlFilterGeom + ')';

          let layerMapping = globalThis.App.Layers.getLayerConfig(childBoundary.id, this.owningBlock.blockConfig.layers);
          let featureMapping = layerMapping.featureInfo;
          const propertyNames = [];

          for (let i = 0, len = featureMapping.length; i < len; i += 1) {
            propertyNames.push(featureMapping[i].propertyName);
          }

          const featureParam = '&propertyName=' + propertyNames.join(',');

          params =
            'service=WFS&request=GetFeature&version=1.1.0&srsName=' +
            childBoundary.srs +
            '&typeNames=' +
            childBoundary.name +
            '&outputFormat=application/json' +
            featureParam +
            '&cql_filter=' +
            cqlFilter;

          const res = await Transport.post(params).to(url, {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded',
            },
          });
          const featureInfo = await res.json();
          layerMapping = globalThis.App.Layers.getLayerConfig(childBoundary.id, this.owningBlock.blockConfig.layers);
          featureMapping = layerMapping.featureInfo;

          const displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(featureMapping, ['display'])[0];
          idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(featureMapping, ['id'], 'propertyName')[0];
          const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, [idProperty]);
          const data = [];
          const fields = ['name', 'value'];

          let i = 0;
          const len = features.length;
          for (; i < len; i += 1) {
            const feature = features[i];
            const obj = {
              name: feature.properties[displayProperty.propertyName],
              value: globalThis.App.Layers.getFeatureId(featureMapping, feature),
            };
            data.push(obj);
          }

          data.sort(function (a, b) {
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            return 0;
          });

          this.component.emptyText = 'Select ' + displayProperty.displayName;
          this.component.applyEmptyText();

          const store = Ext.create('Ext.data.Store', {
            fields: fields,
            data: data,
          });
          this.component.bindStore(store);
          this.component.setValue(selectedId);

          // asyncAjax({
          //   method: 'POST',
          //   url: url,
          //   body: params,
          //   callbackObj: {
          //     extendedTool: this,
          //     boundary: childBoundary,
          //     parentBoundary: parentBoundary,
          //     selectedId: selectedId,
          //   },
          //   callback: function(response, callbackObj) {
          //     const extendedTool = callbackObj.extendedTool;
          //     const boundary = callbackObj.boundary;
          //     const featureInfo = JSON.parse(response.responseText);
          //     if (featureInfo.features.length === 0) return;
          //
          //     const mappedLayer = globalThis.App.Layers.getLayerConfig(callbackObj.parentBoundary.id, extendedTool.owningBlock.blockConfig.layers);
          //     const idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(mappedLayer.featureInfo, ['id'], 'propertyName');
          //
          //     const feature = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperty)[0];
          //     const url = boundary.source.wfs;
          //     const coordProjection = callbackObj.parentBoundary.srs;
          //     const cqlFilterGeom = globalThis.App.OpenLayers.getCqlGeometry(feature.geometry.coordinates, coordProjection, boundary.srs);
          //     const cqlFilter = 'INTERSECTS(' + feature.geometry_name + ',' + feature.geometry.type + cqlFilterGeom + ')';
          //
          //     const layerMapping = globalThis.App.Layers.getLayerConfig(boundary.id, extendedTool.owningBlock.blockConfig.layers);
          //     const featureMapping = layerMapping.featureInfo;
          //     const propertyNames = [];
          //
          //     for (var i = 0, len = featureMapping.length; i < len; i += 1) {
          //       propertyNames.push(featureMapping[i].propertyName);
          //     }
          //
          //     const featureParam = '&propertyName=' + propertyNames.join(',');
          //
          //     const params =
          //       'service=WFS&request=GetFeature&version=1.1.0&srsName=' + boundary.srs + '&typeNames=' + boundary.name + '&outputFormat=application/json' + featureParam + '&cql_filter=' + cqlFilter;
          //
          //     const res = await Transport.post(params).to(url, {
          //       headers: {
          //         'Content-type': 'application/x-www-form-urlencoded'
          //       }
          //     })
          //     const featureInfo = await res.json()
          //
          //     asyncAjax({
          //       method: 'POST',
          //       url: url,
          //       body: params,
          //       callbackObj: {
          //         extendedTool: extendedTool,
          //         boundaryId: boundary.id,
          //         selectedId: callbackObj.selectedId,
          //       },
          //       callback: function(response, callbackObj) {
          //         const featureInfo = JSON.parse(response.responseText);
          //         const extendedTool = callbackObj.extendedTool;
          //         const boundaryId = callbackObj.boundaryId;
          //         const layerMapping = globalThis.App.Layers.getLayerConfig(boundaryId, extendedTool.owningBlock.blockConfig.layers);
          //         const featureMapping = layerMapping.featureInfo;
          //
          //         const displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(featureMapping, ['display'])[0];
          //         const idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(featureMapping, ['id'], 'propertyName')[0];
          //         const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, [idProperty]);
          //         const data = [];
          //         const fields = ['name', 'value'];
          //
          //         let i = 0;
          //         const len = features.length;
          //         for (; i < len; i += 1) {
          //           const feature = features[i];
          //           const obj = {
          //             name: feature.properties[displayProperty.propertyName],
          //             value: globalThis.App.Layers.getFeatureId(featureMapping, feature),
          //           };
          //           data.push(obj);
          //         }
          //
          //         data.sort(function(a, b) {
          //           if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          //           if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          //           return 0;
          //         });
          //
          //         extendedTool.component.emptyText = 'Select ' + displayProperty.displayName;
          //         extendedTool.component.applyEmptyText();
          //
          //         const store = Ext.create('Ext.data.Store', {
          //           fields: fields,
          //           data: data,
          //         });
          //         extendedTool.component.bindStore(store);
          //         extendedTool.component.setValue(callbackObj.selectedId);
          //       },
          //     });
          //   },
          // });
        }
      },
      setPolygonSelected: async function () {
        if (this.vectorAdded === true) {
          // Remove existing features from vector.
          this.vector.getSource().clear();
        } else {
          // Vector hasn't been added to the map yet so add it here.
          const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
          var map = mapPanelBlock.component.map;

          map.addLayer(this.vector);
          this.vectorAdded = true;
        }

        if (this.layer === null) return;

        const cqlFilter = [];

        // Create cql filter based on the configured feature id property and selected feature id.
        const layerMapping = globalThis.App.Layers.getLayerConfig(this.layer.id, this.owningBlock.blockConfig.layers);
        const featureMapping = layerMapping.featureInfo;
        const idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(featureMapping, ['id'], 'propertyName')[0];
        cqlFilter.push(idProperty + " = '" + this.component.getValue() + "'");

        const url = this.layer.source.wfs;
        const params =
          'service=WFS&request=GetFeature&version=1.1.0&srsName=' +
          this.layer.srs +
          '&typeNames=' +
          this.layer.name +
          '&outputFormat=application/json&cql_filter=' +
          cqlFilter.join(' AND ');

        const res = await Transport.post(params).to(url, {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
        });
        const featureInfo = await res.json();
        const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
        map = mapPanelBlock.component.map;
        const boundary = this.layer;
        const projection = boundary.srs;
        const mapProjection = map.getView().getProjection().getCode();
        let feature;
        let coords;
        let displayText = '';

        if (featureInfo.features.length > 1) {
          // For multipolygons, combine all polygons into single feature.
          feature = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperty)[0];
        } else {
          feature = featureInfo.features[0];
        }

        const displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['display'])[0];
        const displayValue = globalThis.App.Layers.getFeatureInfoValue(feature, displayProperty.propertyName);
        displayText = displayProperty.displayName + ': ' + displayValue;

        const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
        if (cqlFilterDisplayBlock !== null) {
          cqlFilterDisplayBlock.extendedTool.setFilter('subState', displayText);
        }

        // Convert feature coordinates into map projection.
        coords = globalThis.App.OpenLayers.convertCoordProj(feature.geometry.coordinates, projection, mapProjection);
        extendedTool.selectedCoords = coords;
        extendedTool.selectedProjection = mapProjection;
        const type = feature.geometry.type;
        const geomName = feature.geometry_name;

        let olGeom;
        if (type === 'MultiPolygon') {
          olGeom = new MultiPolygon(coords);
        } else {
          olGeom = new Polygon(coords);
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

        extendedTool.vector.getSource().addFeature(olFeature);

        // Ensure the vector layer shows in front of other layers.
        map.removeLayer(extendedTool.vector);
        map.addLayer(extendedTool.vector);

        map.getView().fit(olGeom, map.getSize());

        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const mappedOverlays = globalThis.App.Layers.filterByTypes(extendedTool.owningBlock.blockConfig.layers, ['overlay']);

        // Set cql filter on all configured overlays.
        let i = 0;
        const len = mappedOverlays.length;
        for (; i < len; i += 1) {
          const mappedOverlay = mappedOverlays[i];
          const overlays = globalThis.App.Layers.query(layersConfig.overlays, {
            type: 'layer',
            mask: false,
            id: mappedOverlay.id,
          });

          if (overlays.length === 0) continue;
          const overlay = overlays[0];

          if (!overlay.hasOwnProperty('cqlFilter')) {
            overlay.cqlFilter = {};
          }
          if (!overlay.cqlFilter.hasOwnProperty(extendedTool.cqlFilterId)) {
            overlay.cqlFilter[extendedTool.cqlFilterId] = null;
          }

          const cqlGeomString = globalThis.App.OpenLayers.getCqlGeometry(feature.geometry.coordinates, projection, overlay.srs);
          const cqlFilter = 'INTERSECTS(' + overlay.geometryName + ',' + type + cqlGeomString + ')';
          overlay.cqlFilter[extendedTool.cqlFilterId] = cqlFilter;
          globalThis.App.OpenLayers.forceLayerUpdateById(overlay.id, map);
        }

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
        //     extendedTool: extendedTool,
        //     boundary: this.layer,
        //   },
        //   callback: function(response, callbackObj) {
        //     const featureInfo = JSON.parse(response.responseText);
        //     const extendedTool = callbackObj.extendedTool;
        //     const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
        //     const map = mapPanelBlock.component.map;
        //     const boundary = callbackObj.boundary;
        //     const projection = boundary.srs;
        //     const mapProjection = map
        //       .getView()
        //       .getProjection()
        //       .getCode();
        //     var idProperty;
        //     let feature;
        //     let coords;
        //     let displayText = '';
        //
        //     const layerMapping = globalThis.App.Layers.getLayerConfig(boundary.id, extendedTool.owningBlock.blockConfig.layers);
        //     var idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName')[0];
        //
        //     if (featureInfo.features.length > 1) {
        //       // For multipolygons, combine all polygons into single feature.
        //       feature = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperty)[0];
        //     } else {
        //       feature = featureInfo.features[0];
        //     }
        //
        //     const displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['display'])[0];
        //     const displayValue = globalThis.App.Layers.getFeatureInfoValue(feature, displayProperty.propertyName);
        //     displayText = displayProperty.displayName + ': ' + displayValue;
        //
        //     const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
        //     if (cqlFilterDisplayBlock !== null) {
        //       cqlFilterDisplayBlock.extendedTool.setFilter('subState', displayText);
        //     }
        //
        //     // Convert feature coordinates into map projection.
        //     coords = globalThis.App.OpenLayers.convertCoordProj(feature.geometry.coordinates, projection, mapProjection);
        //     extendedTool.selectedCoords = coords;
        //     extendedTool.selectedProjection = mapProjection;
        //     const type = feature.geometry.type;
        //     const geomName = feature.geometry_name;
        //
        //     let olGeom;
        //     if (type === 'MultiPolygon') {
        //       olGeom = new MultiPolygon(coords);
        //     } else {
        //       olGeom = new Polygon(coords);
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
        //
        //     extendedTool.vector.getSource().addFeature(olFeature);
        //
        //     // Ensure the vector layer shows in front of other layers.
        //     map.removeLayer(extendedTool.vector);
        //     map.addLayer(extendedTool.vector);
        //
        //     map.getView().fit(olGeom, map.getSize());
        //
        //     const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        //     const mappedOverlays = globalThis.App.Layers.filterByTypes(extendedTool.owningBlock.blockConfig.layers, ['overlay']);
        //
        //     // Set cql filter on all configured overlays.
        //     let i = 0;
        //     const len = mappedOverlays.length;
        //     for (; i < len; i += 1) {
        //       const mappedOverlay = mappedOverlays[i];
        //       const overlays = globalThis.App.Layers.query(layersConfig.overlays, {
        //         type: 'layer',
        //         mask: false,
        //         id: mappedOverlay.id,
        //       });
        //
        //       if (overlays.length === 0) continue;
        //       const overlay = overlays[0];
        //
        //       if (!overlay.hasOwnProperty('cqlFilter')) {
        //         overlay.cqlFilter = {};
        //       }
        //       if (!overlay.cqlFilter.hasOwnProperty(extendedTool.cqlFilterId)) {
        //         overlay.cqlFilter[extendedTool.cqlFilterId] = null;
        //       }
        //
        //       const cqlGeomString = globalThis.App.OpenLayers.getCqlGeometry(feature.geometry.coordinates, projection, overlay.srs);
        //       const cqlFilter = 'INTERSECTS(' + overlay.geometryName + ',' + type + cqlGeomString + ')';
        //       overlay.cqlFilter[extendedTool.cqlFilterId] = cqlFilter;
        //       globalThis.App.OpenLayers.forceLayerUpdateById(overlay.id, map);
        //     }
        //
        //     extendedTool.owningBlock.fire('select', extendedTool);
        //
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

          // Empty the options in the combobox.
          extendedTool.component.clearValue();
          extendedTool.component.bindStore(
            Ext.create('Ext.data.Store', {
              fields: ['name', 'value'],
              data: [],
            })
          );
          extendedTool.component.emptyText = '';
          extendedTool.component.applyEmptyText();

          if (extendedTool.vectorAdded === true) {
            const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            const map = mapPanelBlock.component.map;
            map.removeLayer(extendedTool.vector);
            extendedTool.vector.getSource().clear();
            extendedTool.vectorAdded = false;
          }

          const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('subState', null);
          }
        },
        extendedTool
      );
    }

    // Register callback for when reset button is clicked.
    const resetQueryBlock = owningBlock.getReferencedBlock('cResetQuery');
    if (resetQueryBlock !== null) {
      resetQueryBlock.on(
        'click',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          if (extendedTool.owningBlock.rendered === false) return;
          const layerMapping = extendedTool.owningBlock.blockConfig.layers;

          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

          // Remove any cql filters on layers added by this tool.
          let j = 0;
          const length = layerMapping.length;
          for (; j < length; j += 1) {
            const mappedLayer = layerMapping[j];

            const layers = globalThis.App.Layers.query(
              layersConfig,
              {
                id: mappedLayer.id,
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
          }

          // Remove displayed filter.
          const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('subState', null);
          }

          // Empty the options in the combobox.
          extendedTool.component.clearValue();
          extendedTool.component.bindStore(
            Ext.create('Ext.data.Store', {
              fields: ['name', 'value'],
              data: [],
            })
          );
          extendedTool.component.emptyText = '';
          extendedTool.component.applyEmptyText();

          // Remove vector from the map.
          if (extendedTool.vectorAdded === true) {
            const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            const map = mapPanelBlock.component.map;
            map.removeLayer(extendedTool.vector);
            extendedTool.vector.getSource().clear();
            extendedTool.vectorAdded = false;
          }

          extendedTool.component.hide();
        },
        extendedTool
      );
    }

    // Register callback to the select bbox tool.
    const selectBboxBlock = owningBlock.getReferencedBlock('cSelectBBOXTool');
    if (selectBboxBlock !== null) {
      selectBboxBlock.on(
        'aoiSelected',
        function (callbackObj, postingObj) {
          const extendedTool = callbackObj;
          // Hide the combobox.
          if (extendedTool.owningBlock.rendered === true) extendedTool.component.hide();
          extendedTool.lastSelectedStateId = null;

          // Remove displayed filter.
          const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('subState', null);
          }

          // Remove vector from the map.
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

    // Register callback to the layer radio group tool.
    const radioGroupBlock = owningBlock.getReferencedBlock('cSelectRegionMenuRadioGroup');
    if (radioGroupBlock !== null) {
      radioGroupBlock.on(
        'select',
        function (callbackObj, postingObj) {
          const extendedTool = callbackObj;
          const radioGroupTool = postingObj;
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layerId = radioGroupTool.selectedValue;

          const layers = globalThis.App.Layers.query(
            layersConfig,
            {
              type: 'layer',
              mask: false,
              id: layerId,
            },
            ['overlays', 'boundaries']
          );

          if (layerId === null || layers.length === 0) {
            // Hide the combobox.
            //if (extendedTool.owningBlock.rendered === true) extendedTool.component.hide();
            extendedTool.layer = null;

            // Remove displayed filter.
            const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
            if (cqlFilterDisplayBlock !== null) {
              cqlFilterDisplayBlock.extendedTool.setFilter('subState', null);
            }

            // Remove vector from the map.
            const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            const map = mapPanelBlock.component.map;
            map.removeLayer(extendedTool.vector);
            extendedTool.vector.getSource().clear();
            extendedTool.vectorAdded = false;

            // Empty the options in the combobox.
            extendedTool.component.clearValue();
            extendedTool.component.bindStore(
              Ext.create('Ext.data.Store', {
                fields: ['name', 'value'],
                data: [],
              })
            );
            extendedTool.component.emptyText = '';
            extendedTool.component.applyEmptyText();
          } else {
            const layer = layers[0];
            extendedTool.layer = layer;
            extendedTool.component.show();
            extendedTool.setStore();
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

    // Simple ComboBox using the data store
    const simpleCombo = Ext.create('Ext.form.field.ComboBox', {
      extendedTool: extendedTool,
      fieldLabel: '',
      autoRender: true,
      editable: false,
      width: 225,
      labelWidth: 50,
      hidden: true,
      style: {
        marginTop: '10px',
        marginLeft: '35px',
        marginRight: '35px',
      },
      store: Ext.create('Ext.data.Store', {
        fields: ['name', 'value'],
        data: [],
      }),
      queryMode: 'local',
      typeAhead: true,
      valueField: 'value',
      displayField: 'name',
      listeners: {
        expand: function (combo) {
          const val = combo.getValue();

          if (val !== null) {
            const rec = combo.findRecordByValue(combo.getValue()),
              node = combo.picker.getNode(rec);

            combo.picker.getTargetEl().setScrollTop(node.offsetTop);
          }
        },
        select: function (combo, records) {
          this.extendedTool.setPolygonSelected(this.getValue());
        },
        afterrender: function (combo, records) {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    });

    // Reset items in combobox when new state is selected.
    const statesComboBlock = extendedTool.owningBlock.getReferencedBlock('cStateTool');
    if (statesComboBlock !== null) {
      statesComboBlock.on(
        'select',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          extendedTool.setStore();

          if (extendedTool.component.isHidden()) {
            const menuRadioGroupBlock = extendedTool.owningBlock.getReferencedBlock('cSelectRegionMenuRadioGroup');
            const values = menuRadioGroupBlock.component.getValue();
            let value = null;
            for (let prop in values) {
              value = values[prop];
            }

            if (value !== null) {
              extendedTool.component.show();
            }
          }

          // Remove displayed filter.
          const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('subState', null);
          }
        },
        extendedTool
      );
    }

    // Combobox will not be rendered until the menu is shown. In this case, if aoi was selected from another tool, load
    // that selection.
    const selectOnMapTool = extendedTool.owningBlock.getReferencedBlock('cRegionSelectorMenu');
    if (selectOnMapTool !== null) {
      selectOnMapTool.on(
        'menushow',
        async function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          const statesBlock = extendedTool.owningBlock.getReferencedBlock('cStateTool');
          // Check if states block exists, is rendered, and has a state selected.
          if (
            statesBlock !== null &&
            statesBlock.rendered === true &&
            (statesBlock.extendedTool.stateValue !== null || statesBlock.component.getValue() !== null)
          ) {
            const menuRadioGroupBlock = extendedTool.owningBlock.getReferencedBlock('cSelectRegionMenuRadioGroup');
            if (menuRadioGroupBlock !== null) {
              const values = menuRadioGroupBlock.component.getValue();
              let value = null;
              for (let prop in values) {
                value = values[prop];
                break;
              }

              if (value !== null) {
                const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
                const layers = globalThis.App.Layers.query(
                  layersConfig,
                  {
                    type: 'layer',
                    id: value,
                  },
                  ['overlays', 'boundaries']
                );

                if (layers.length > 0) {
                  const layer = layers[0];
                  extendedTool.layer = layer;
                  extendedTool.component.show();

                  if (extendedTool.selectedLayerId !== null) {
                    if (extendedTool.selectedLayerId !== value) {
                      extendedTool.selectedLayerId = null;
                      extendedTool.setStore();
                      return;
                    }
                    extendedTool.selectedLayerId = null;
                  }

                  let idValue = null;

                  const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
                  const selectRegionTool = extendedTool.owningBlock.getReferencedBlock('cSelectRegionTool');
                  if (mapPanelBlock !== null && selectRegionTool !== null && selectRegionTool.extendedTool.hasOwnProperty('lastClickCoord')) {
                    const map = mapPanelBlock.component.map;
                    // const featureInfo = globalThis.App.OpenLayers.getFeatureInfoForLayerWithXYCoordAndMap(layer, selectRegionTool.extendedTool.lastClickCoord, map);
                    const featureInfo = await globalThis.App.OpenLayers.getLayerFeatureInfoViaXYCoord(
                      layer,
                      selectRegionTool.extendedTool.lastClickCoord,
                      map
                    );
                    if (featureInfo.features.length > 0) {
                      const feature = featureInfo.features[0];
                      const layerMapping = globalThis.App.Layers.getLayerConfig(layer.id, extendedTool.owningBlock.blockConfig.layers);
                      const idProperty = globalThis.App.Layers.filterByTypes(layerMapping.featureInfo, ['id'], 'propertyName')[0];
                      idValue = globalThis.App.Layers.getFeatureInfoValue(feature, idProperty);
                    }
                  }
                  extendedTool.setStore(idValue);
                }
              }
            }
          }
        },
        extendedTool
      );
    }

    var selectRegionTool = extendedTool.owningBlock.getReferencedBlock('cSelectRegionTool');
    if (selectRegionTool !== null) {
      selectRegionTool.on(
        'aoiSelected',
        async function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          const selectRegionTool = postingObj;
          const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
          const map = mapPanelBlock.component.map;
          if (extendedTool.vectorAdded === true) {
            map.removeLayer(extendedTool.vector);
            extendedTool.vector.getSource().clear();
            extendedTool.vectorAdded = false;
          }

          const menuRadioGroupBlock = extendedTool.owningBlock.getReferencedBlock('cSelectRegionToolRadioGroup');
          if (menuRadioGroupBlock !== null && menuRadioGroupBlock.rendered === true) {
            const values = menuRadioGroupBlock.component.getValue();
            var value = null;
            for (let prop in values) {
              value = values[prop];
              break;
            }
          }

          if (value !== null && extendedTool.owningBlock.rendered === false) {
            var layerMapping = globalThis.App.Layers.getLayerConfig(value, extendedTool.owningBlock.blockConfig.layers);
            extendedTool.selectedLayerId = value;
          }

          if (extendedTool.layer !== null && extendedTool.owningBlock.rendered === true) {
            const featureInfo = await globalThis.App.OpenLayers.getLayerFeatureInfoViaXYCoord(
              extendedTool.layer,
              selectRegionTool.lastClickCoord,
              map
            );
            if (featureInfo.features.length > 0) {
              const feature = featureInfo.features[0];
              var layerMapping = globalThis.App.Layers.getLayerConfig(extendedTool.layer.id, extendedTool.owningBlock.blockConfig.layers);
              const idProperty = globalThis.App.Layers.filterByTypes(layerMapping.featureInfo, ['id'], 'propertyName')[0];
              const idValue = globalThis.App.Layers.getFeatureInfoValue(feature, idProperty);
              extendedTool.component.setValue(idValue);
            }
          }
        },
        extendedTool
      );
    }

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED,
      extendedTool.owningBlock.itemDefinition.layerConfigUpdated,
      extendedTool
    );

    return simpleCombo;
  },
  layerConfigUpdated: function (postingObj, callbackObj, eventObj) {
    const extendedTool = callbackObj;
    extendedTool.setStore();
  },
};
