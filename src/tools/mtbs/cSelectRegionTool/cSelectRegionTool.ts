import Feature from 'ol/Feature';
import { MultiPolygon, Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import { Fill, Stroke, Style } from 'ol/style';
import { unByKey } from 'ol/Observable';
import { getRandomString } from '../../../helpers/string';
import { Transport } from '../../../Network/Transport';

/**
 * loadAllFeatures - the purpose is to load all features for a vector later on load rather than on hover.
 * When set to false the feature data is removed from the vector layer when not hovering.
 * When set to true, rather than _removing_ the feature data from the vector layer, the style is simply reset.
 */

export const cSelectRegionTool = {
  options: {
    events: ['aoiSelected'],
    requiredBlocks: ['cMapWindow', 'cMapPanel', 'cQueryParamsDisplay', 'cResetQuery', 'cSelectRegionToolRadioGroup', 'cRegionTool'],
  },
  async layersConfigChanged(layersConfig, callbackObj, postingObj) {
    const extendedTool = callbackObj;
    const layer = extendedTool.currentBoundary;

    // Check the current state of the wfs request.
    const requestStatus = extendedTool.wfsRequestStatus;
    if (extendedTool.lastRequest !== null) {
      if (requestStatus.start === true) {
        // If a request for another boundary has been started but not yet returned, cancel the request.
        if (requestStatus.returned === false) {
          extendedTool.lastRequest.requestCanceled = true;
        } else {
          // If a request for another boundary is currently building out features for that boundary, stop building the
          // features.
          if (extendedTool.intervalId !== null) {
            window.clearInterval(extendedTool.intervalId);
          }
          requestStatus.returned = false;
          requestStatus.complete = false;
        }
      }
    } else {
      requestStatus.start = true;
      requestStatus.returned = false;
      requestStatus.complete = false;
    }

    // Reset all information about the previous boundary.
    // extendedTool.currentBoundary = layer;
    extendedTool.vector.getSource().clear();
    extendedTool.featureInfo = {};
    extendedTool.selectedFeatureId = null;
    extendedTool.hoveredFeatureId = null;

    // Prevent loading all features if loadAllFeatures is configured as false for the selected boundary.
    const layerMapping = extendedTool.owningBlock.blockConfig.layers;
    const mappedLayer = globalThis.App.Layers.getLayerConfig(extendedTool.currentBoundary.id, layerMapping);
    if (mappedLayer.loadAllFeatures === false) {
      requestStatus.start = false;
      requestStatus.returned = false;
      requestStatus.complete = false;
      extendedTool.loadAllFeatures = false;
      return;
    }
    extendedTool.loadAllFeatures = true;

    if (extendedTool.component && extendedTool.component.pressed === true) {
      extendedTool.removeMapEvent();
      extendedTool.addMapEvent();
    }

    const url = layer.source.wfs;

    const params = `service=WFS&request=GetFeature&version=1.1.0&srsName=${layer.srs}&typeNames=${layer.name}&outputFormat=application/json`;

    const response = await Transport.post(params).to(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    extendedTool.lastRequest = response;

    if (!response.ok) return;
    if (layer !== extendedTool.currentBoundary) return;
    extendedTool.wfsRequestStatus.returned = true;
    const featureInfo = await response.json();
    const projection = layer.srs;
    const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
    const { map } = mapPanelBlock.component;
    const mapProjection = map.getView().getProjection().getCode();
    const displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(mappedLayer.featureInfo, ['display'], 'propertyName')[0];
    const idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(mappedLayer.featureInfo, ['id'], 'propertyName')[0];
    const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, [idProperty], 'area', 'perimeter');
    extendedTool.featureInfo = {};
    const vectorLayer = extendedTool.vector;
    const vectorSource = vectorLayer.getSource();
    vectorSource.clear(true);

    for (const feature of features) {
      let geometry;
      let { coordinates } = feature.geometry;
      const { type } = feature.geometry;

      if (projection !== mapProjection) {
        coordinates = globalThis.App.OpenLayers.convertCoordProj(coordinates, projection, mapProjection);
      }
      if (type === 'MultiPolygon') {
        geometry = new MultiPolygon(coordinates);
      } else if (type === 'Polygon') {
        geometry = new Polygon(coordinates);
      }
      const olFeature = new Feature(geometry);
      const displayValue = globalThis.App.Layers.getFeatureInfoValue(feature, displayProperty);
      const idValue = globalThis.App.Layers.getFeatureInfoValue(feature, idProperty);

      olFeature.setId(idValue);
      extendedTool.featureInfo[idValue] = {
        geometryName: feature.geometry_name,
        geometryType: feature.geometry.type,
        id: idValue,
        name: displayValue,
        properties: JSON.parse(JSON.stringify(feature.properties)),
      };

      if (idValue === extendedTool.hoveredFeatureId) {
        olFeature.setStyle(extendedTool.getHoveredStyle());
      } else if (idValue === extendedTool.selectedFeatureId) {
        olFeature.setStyle(extendedTool.getSelectedStyle());
      } else {
        olFeature.setStyle(extendedTool.getStyle());
      }

      vectorSource.addFeature(olFeature);
    }
    extendedTool.wfsRequestStatus.complete = true;

    // extendedTool.lastRequest = asyncAjax({
    //   type: 'POST',
    //   url: url,
    //   params: params,
    //   callbackObj: {
    //     extendedTool: extendedTool,
    //     boundary: layer,
    //   },
    //   callback: function(response, callbackObj) {
    //     // @ts-ignore
    //     if (response.requestCanceled === true) {
    //       return;
    //     }
    //     const extendedTool = callbackObj.extendedTool;
    //     extendedTool.wfsRequestStatus.returned = true;
    //     const featureInfo = JSON.parse(response.responseText);
    //     const projection = callbackObj.boundary.srs;
    //
    //     const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
    //     const map = mapPanelBlock.component.map;
    //     const mapProjection = map
    //       .getView()
    //       .getProjection()
    //       .getCode();
    //     var layerMapping = extendedTool.owningBlock.blockConfig.layers;
    //     const mappedLayer = globalThis.App.Layers.getLayerConfig(callbackObj.boundary.id, layerMapping);
    //     const displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(mappedLayer.featureInfo, ['display'], 'propertyName')[0];
    //     const idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(mappedLayer.featureInfo, ['id'], 'propertyName')[0];
    //     const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, [idProperty], 'area', 'perimeter');
    //
    //     extendedTool.featureInfo = {};
    //     const vectorLayer = extendedTool.vector;
    //     const vectorSource = vectorLayer.getSource();
    //     vectorSource.clear(true);
    //
    //     let i = 0;
    //     const len = features.length;
    //     for (; i < len; i += 1) {
    //       const feature = features[i];
    //
    //       let coordinates = feature.geometry.coordinates;
    //
    //       const type = feature.geometry.type;
    //       let geometry;
    //
    //       if (projection !== mapProjection) {
    //         coordinates = globalThis.App.OpenLayers.convertCoordProj(coordinates, projection, mapProjection);
    //       }
    //       if (type === 'MultiPolygon') {
    //         geometry = new MultiPolygon(coordinates);
    //       } else if (type === 'Polygon') {
    //         geometry = new Polygon(coordinates);
    //       }
    //       const olFeature = new Feature(geometry);
    //
    //       const boundary = extendedTool.currentBoundary;
    //       var layerMapping = extendedTool.owningBlock.blockConfig.layers;
    //       const displayValue = globalThis.App.Layers.getFeatureInfoValue(feature, displayProperty);
    //       const idValue = globalThis.App.Layers.getFeatureInfoValue(feature, idProperty);
    //
    //       olFeature.setId(idValue);
    //       extendedTool.featureInfo[idValue] = {
    //         geometryName: feature.geometry_name,
    //         geometryType: feature.geometry.type,
    //         id: idValue,
    //         name: displayValue,
    //         properties: JSON.parse(JSON.stringify(feature.properties)),
    //       };
    //
    //       if (idValue === extendedTool.hoveredFeatureId) {
    //         olFeature.setStyle(extendedTool.getHoveredStyle());
    //       } else if (idValue === extendedTool.selectedFeatureId) {
    //         olFeature.setStyle(extendedTool.getSelectedStyle());
    //       } else {
    //         olFeature.setStyle(extendedTool.getStyle());
    //       }
    //
    //       vectorSource.addFeature(olFeature);
    //     }
    //
    //     extendedTool.wfsRequestStatus.complete = true;
    //   },
    // });
  },
  layersConfigUpdated(layersConfig, callbackObj, postingObj) {
    // This needs to happen if the layer that is being used is no longer selected
    const extendedTool = callbackObj;
    const layer = extendedTool.currentBoundary;
    if (layer) {
      let configInstance = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

      let boundary = configInstance['boundaries'][0]['folder'].find((x) => x.id === layer.id);
      if (boundary.display === false) {
        const radioGroupBlock = extendedTool.owningBlock.getReferencedBlock('cSelectRegionToolRadioGroup');
        radioGroupBlock.childItems[0].component.forEach((element) => {
          element.setValue(false);
          element.extendedTool.selectedValue = null;
        });

        extendedTool.currentBoundary = null;
        extendedTool.pressed = false;
        extendedTool.component.removeCls('selected-menu-btn');
        extendedTool.removeMapEvent();
        extendedTool.addMapEvent();
      }
    }
  },
  createExtendedTool(owningBlock) {
    const owningMapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const owningMapWindow = owningMapWindowBlock.extendedTool;

    let toggleGroupId = null;
    if (owningMapWindow !== null) {
      toggleGroupId = owningMapWindow.toggleGroupId;
    }

    // Create the div to store the overlay.
    const overlayId = `overlay-${getRandomString(32, 36)}`;
    const overlayDiv = document.createElement('div');
    overlayDiv.id = overlayId;
    overlayDiv.className = 'map-text-overlay';
    document.body.appendChild(overlayDiv);

    const extendedTool = {
      owningBlock,
      pressed: false,
      // Used to decide when and how to cancel new wfs requests.
      wfsRequestStatus: {
        sent: false, // If true, the wfs request has been sent.
        returned: false, // If true, the request has been returned.
        complete: false, // If true, all features are finished being added to the vector layer.
      },
      // Stores a reference to the last xmlHTTPRequest object.
      lastRequest: null,
      mapEventsAdded: false,
      toggleGroupId,
      vector: new VectorLayer({
        source: new VectorSource(),
      }),
      // Stores the overlay to show feature info on hover.
      overlay: new Overlay({
        element: document.getElementById(overlayId),
        positioning: OverlayPositioning.BOTTOM_LEFT,
      }),
      overlayId,
      vectors: {},
      toolUniqueID: getRandomString(32, 36),
      // Stores the event id keys for the map pointermove and click event listeners
      // so they can be turned off without removing any other listeners that might be added.
      pointermoveEventKey: null,
      clickEventKey: null,
      // Stores the id of the last feature that is hovered over or selected.
      hoveredFeatureId: null,
      selectedFeatureId: null,
      // Stores extra properties about each feature from a featureInfo request.
      featureInfo: {},
      // Stores a reference to the boundary layer that the vector is currently storing features for.
      currentBoundary: null,
      // Used when building out features for the wfs request.
      featureInfoIndex: 0,
      featureInfoLength: 0,
      intervalId: null,
      isHighlighting: false,
      isSelecting: false,
      loadAllFeatures: false,
      selectedCoords: null,
      selectedProjection: null,
      async setCqlFilter() {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const { map } = mapPanelBlock.component;
        const cqlFilterDisplayBlock = this.owningBlock.getReferencedBlock('cQueryParamsDisplay');
        const boundary = this.currentBoundary;
        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const layerMapping: Array<any> = this.owningBlock.blockConfig.layers;
        const overlays = [];
        let parentLayerMapping = null;
        let childLayerMapping = null;
        const mapProjection = map.getView().getProjection().getCode();

        for (var i = 0, len = layerMapping.length; i < len; i += 1) {
          const layerMap = layerMapping[i];

          if (layerMap.id === boundary.id) {
            if (parentLayerMapping === null && layerMap.type === 'child') {
              childLayerMapping = {
                layerConfigs: boundary,
                layerMap,
              };
              // Continue looping so both child and parent layers can be found.
              continue;
            } else if (layerMap.type === 'parent') {
              parentLayerMapping = {
                layerConfigs: boundary,
                layerMap,
              };
              // If the parent layer is the currently selected boundary, no child layer can be selected so break out
              // of loop. break;
            }
          }

          const layer = globalThis.App.Layers.query(
            layersConfig,
            {
              type: 'layer',
              mask: false,
              id: layerMap.id,
            },
            ['overlays', 'boundaries']
          );

          if (layer.length > 0) {
            if (layerMap.type === 'parent') {
              parentLayerMapping = {
                layerConfigs: layer[0],
                layerMap,
              };
            } else if (layerMap.type === 'overlay') {
              overlays.push(layer[0]);
            }
          }
        }

        if (cqlFilterDisplayBlock !== null) {
          const parentFeatureInfo = await globalThis.App.OpenLayers.getLayerFeatureInfoViaXYCoord(
            parentLayerMapping.layerConfigs,
            this.lastClickCoord,
            map
          );
          var displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(
            parentLayerMapping.layerMap.featureInfo,
            ['display'],
            'propertyName'
          );
          var displayValue = globalThis.App.Layers.getFeatureInfoValue(parentFeatureInfo.features, displayProperty[0]);
          cqlFilterDisplayBlock.extendedTool.setFilter('state', `State: ${displayValue}`);
        }

        if (childLayerMapping !== null) {
          if (cqlFilterDisplayBlock !== null) {
            let displayText = '';
            var displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(childLayerMapping.layerMap.featureInfo, ['display'])[0];
            var displayValue = globalThis.App.Layers.getFeatureInfoValue(this.featureInfo[this.selectedFeatureId], displayProperty.propertyName);
            const { displayName } = displayProperty;
            displayText = `${displayProperty.displayName}: ${displayValue}`;
            cqlFilterDisplayBlock.extendedTool.setFilter('subState', displayText);
          }
        } else if (cqlFilterDisplayBlock !== null) {
          cqlFilterDisplayBlock.extendedTool.setFilter('subState', null);
        }

        for (var i = 0, len = overlays.length; i < len; i += 1) {
          const overlay = overlays[i];
          let cqlFilter = null;
          if (!overlay.hasOwnProperty('cqlFilter')) {
            overlay.cqlFilter = {};
          }

          if (this.selectedFeatureId !== null) {
            const featureProperties = this.featureInfo[this.selectedFeatureId];
            const coords = this.vector.getSource().getFeatureById(this.selectedFeatureId)?.getGeometry()?.getCoordinates();
            if (!coords) continue;
            const geomString = globalThis.App.OpenLayers.getCqlGeometry(JSON.parse(JSON.stringify(coords)), mapProjection, overlay.srs);
            cqlFilter = `INTERSECTS(${overlay.geometryName},${featureProperties.geometryType.toUpperCase()}${geomString})`;
          }

          overlay.cqlFilter[this.cqlFilterId] = cqlFilter;
          globalThis.App.OpenLayers.forceLayerUpdateById(overlay.id, map);
        }
        if (this.selectedFeatureId !== null) {
          this.selectedCoords = this.vector.getSource().getFeatureById(this.selectedFeatureId)?.getGeometry()?.getCoordinates();
          if (!this.selectedCoords) return;
          this.selectedProjection = mapProjection;

          this.owningBlock.fire('aoiSelected', this, this.selectedCoords);
          if (overlays.length > 0) {
            globalThis.App.EventHandler.postEvent(
              globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED,
              layersConfig,
              globalThis.App.Layers.layersConfig
            );
          }

          map.removeLayer(this.vector);
          map.addLayer(this.vector);
        }
      },
      getSelectedStyle() {
        return new Style({
          stroke: new Stroke({
            color: 'rgba(0,0,255,1)',
            width: 4,
          }),
          fill: new Fill({
            color: 'rgba(0,0,0,0)',
          }),
        });
      },
      getHoveredStyle() {
        return new Style({
          stroke: new Stroke({
            color: 'rgba(255,154,0,0.5)',
            width: 1,
          }),
          fill: new Fill({
            color: 'rgba(255,154,0,0.5)',
          }),
        });
      },
      getStyle(color) {
        if (typeof color === 'undefined') {
          color = 'rgba(0,0,0,0)';
        }

        const fill = new Fill({
          color,
        });

        const style = new Style({
          stroke: new Stroke({
            color,
            width: 2,
          }),
          fill,
        });

        return style;
      },
      resetFeatureStyle(id: string) {
        const feature = this.vector.getSource().getFeatureById(id);
        feature.setStyle(this.getStyle());
      },
      async getFeatureInfo(coord) {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const { map } = mapPanelBlock.component;

        const featureInfo = await globalThis.App.OpenLayers.getLayerFeatureInfoViaXYCoord(this.currentBoundary, coord, map);
        if (featureInfo.emptyFeatures === true) return null;

        return featureInfo;
      },
      getOLGeometry(coords, type, coordProjection) {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const { map } = mapPanelBlock.component;
        const mapProjection = map.getView().getProjection().getCode();

        if (coordProjection !== mapProjection) {
          coords = globalThis.App.OpenLayers.convertCoordProj(coords, coordProjection, mapProjection);
        }
        if (type === 'MultiPolygon') {
          return new MultiPolygon(coords);
        }
        if (type === 'Polygon') {
          return new Polygon(coords);
        }
        return null;
      },
      getOLFeature(feature, projection) {
        const { coordinates } = feature.geometry;

        const geometry = this.getOLGeometry(coordinates, feature.geometry.type, projection);
        const olFeature = new Feature(geometry);

        const boundary = this.currentBoundary;
        const layerMapping = this.owningBlock.blockConfig.layers;
        const mappedLayer = globalThis.App.Layers.getLayerConfig(boundary.id, layerMapping);

        const displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(mappedLayer.featureInfo, ['display'], 'propertyName')[0];
        const idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(mappedLayer.featureInfo, ['id'], 'propertyName')[0];
        const displayValue = globalThis.App.Layers.getFeatureInfoValue(feature, displayProperty);
        const idValue = globalThis.App.Layers.getFeatureInfoValue(feature, idProperty);

        olFeature.setId(idValue);
        this.featureInfo[idValue] = {
          geometryName: feature.geometry_name,
          geometryType: feature.geometry.type,
          id: idValue,
          name: displayValue,
          properties: JSON.parse(JSON.stringify(feature.properties)),
        };

        return olFeature;
      },
      setPopup(coords, featureId) {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const { map } = mapPanelBlock.component;

        const featureInfo = this.featureInfo[featureId];
        document.getElementById(this.overlayId).innerHTML = featureInfo.name;
        this.overlay.setPosition(coords);
      },
      handlePointermove(event) {
        const coord = event.coordinate;
        if (this.currentBoundary === null || this.isSelecting === true) return;
        if (this.isHighlighting) return;
        this.isHighlighting = true;

        // Reset all the features except the hoveredFeature AND selectedFeature (to keep the outline of the feature)
        let allFeatures: Array<Feature> = Object.values(this.vector.values_.source.idIndex_);
        allFeatures.forEach((feature: Feature) => {
          const id = feature.getId();
          if (this.hoveredFeatureId !== id && this.selectedFeatureId !== id) this.resetFeatureStyle(feature.getId());
        });

        // Get the features at the coordinate in the vector layer
        const olFeatures = this.vector.getSource().getFeaturesAtCoordinate(coord);

        // If the vector has features at that coordinate
        if (olFeatures.length > 0) {
          const olFeature = olFeatures[0];
          const olFeatureId = olFeature.getId();

          // Set the popup
          this.setPopup(coord, olFeatureId);

          // Ensure we are not hovering over the already highlighted polygon.
          if (olFeatureId !== this.hoveredFeatureId) {
            if (this.hoveredFeatureId !== null) {
              if (this.loadAllFeatures === true) {
                this.resetFeatureStyle(this.hoveredFeatureId);
              } else {
                const existingFeature = this.vector.getSource().getFeatureById(this.hoveredFeatureId);
                if (existingFeature !== null) {
                  this.vector.getSource().removeFeature(existingFeature);
                }
              }
            }

            if (olFeatureId !== this.selectedFeatureId) {
              // Ensure we are not trying to highlight the selected feature.
              this.hoveredFeatureId = olFeatureId;
              olFeature.setStyle(this.getHoveredStyle());
            } else {
              this.hoveredFeatureId = null;
            }
          }
        } else if (this.wfsRequestStatus.complete === false) {
          if (this.hoveredFeatureId !== null) {
            if (this.loadAllFeatures === true) {
              this.resetFeatureStyle(this.hoveredFeatureId);
            } else {
              const olFeature = this.vector.getSource().getFeatureById(this.hoveredFeatureId);
              if (olFeature !== null) {
                this.vector.getSource().removeFeature(olFeature);
              }
            }
          }
          const layer = extendedTool.currentBoundary;

          return this.getFeatureInfo(coord).then((featureInfo) => {
            if (featureInfo !== null) {
              const style = this.getHoveredStyle();
              const projection = layer.srs;
              const olFeature = this.getOLFeature(featureInfo.features[0], projection);
              const olFeatureId = olFeature.getId();
              this.setPopup(coord, olFeatureId);
              if (this.selectedFeatureId === olFeatureId) {
                this.hoveredFeatureId = null;
                this.isHighlighting = false;
                return;
              }
              this.hoveredFeatureId = olFeatureId;
              const existingFeature = this.vector.getSource().getFeatureById(olFeatureId);
              if (existingFeature !== null) {
                existingFeature.setStyle(style);
              } else {
                olFeature.setStyle(style);
                this.vector.getSource().addFeature(olFeature);
              }
            } else {
              this.hoveredFeatureId = null;
            }

            allFeatures = Object.values(this.vector.values_.source.idIndex_);
            allFeatures.forEach((feature: Feature) => {
              const id = feature.getId();
              if (this.hoveredFeatureId !== id && this.selectedFeatureId !== id) this.resetFeatureStyle(feature.getId());
            });

            this.isHighlighting = false;
          });
        } else if (this.hoveredFeatureId !== null) {
          var olFeature = this.vector.getSource().getFeatureById(this.hoveredFeatureId);
          if (olFeature !== null) {
            if (this.loadAllFeatures === true) {
              olFeature.setStyle(this.getStyle());
            } else {
              this.vector.getSource().removeFeature(olFeature);
            }
          }
          this.hoveredFeatureId = null;
        }

        // The hoveredFeature may have changed, so reset all the features except the hoveredFeature AND selectedFeature (to keep the outline of the feature) again
        allFeatures = Object.values(this.vector.values_.source.idIndex_);
        allFeatures.forEach((feature: Feature) => {
          const id = feature.getId();
          if (this.hoveredFeatureId !== id && this.selectedFeatureId !== id) this.resetFeatureStyle(feature.getId());
        });
        this.isHighlighting = false;
      },
      handleClick(event) {
        if (this.currentBoundary === null) return;
        if (this.isHighlighting === true) {
          // If its in the middle of highlighting a feature, wait for the highlight to finish.
          if (this.intervalId !== null) clearInterval(this.intervalId);
          this.intervalId = setInterval(
            function (extendedTool, event) {
              if (extendedTool.isHighlighting === false) {
                clearInterval(extendedTool.intervalId);
                extendedTool.handleClick(event);
              }
            },
            10,
            this,
            event
          );
          return;
        }
        this.isSelecting = true;
        this.lastClickCoord = event.coordinate;
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const { map } = mapPanelBlock.component;

        if (this.hoveredFeatureId !== null) {
          if (this.loadAllFeatures === true) {
            this.resetFeatureStyle(this.hoveredFeatureId);
          } else {
            var olFeature = this.vector.getSource().getFeatureById(this.hoveredFeatureId);
            if (olFeature) {
              this.vector.getSource().removeFeature(olFeature);
            }
          }
          this.hoveredFeatureId = null;
        }

        const olFeatures = this.vector.getSource().getFeaturesAtCoordinate(event.coordinate);
        if (olFeatures.length > 0) {
          var olFeature = olFeatures[0];
          /* If the feature boundary we're selecting is the same as previous
           * just set the style so the table doesn't get reload */
          if (this.selectedFeatureId !== olFeature.getId()) {
            if (this.selectedFeatureId !== null) {
              if (this.loadAllFeatures === true) {
                this.resetFeatureStyle(this.selectedFeatureId);
              } else {
                var selectedFeature = this.vector.getSource().getFeatureById(this.selectedFeatureId);
                if (selectedFeature) {
                  this.vector.getSource().removeFeature(selectedFeature);
                }
              }
            }
            this.selectedFeatureId = olFeature.getId();
            olFeature.setStyle(this.getSelectedStyle());
            this.setCqlFilter();
            map.getView().fit(olFeature.getGeometry(), map.getSize());
          }
        } else {
          if (this.selectedFeatureId !== null) {
            if (this.loadAllFeatures === true) {
              this.resetFeatureStyle(this.selectedFeatureId);
            } else {
              var selectedFeature = this.vector.getSource().getFeatureById(this.selectedFeatureId);
              if (selectedFeature) {
                this.vector.getSource().removeFeature(selectedFeature);
              }
            }
            this.selectedFeatureId = null;
          }
          const layer = this.currentBoundary;

          this.getFeatureInfo(event.coordinate).then((featureInfo) => {
            if (featureInfo !== null) {
              const projection = layer.srs;
              var olFeature = this.getOLFeature(featureInfo.features[0], projection);
              this.selectedFeatureId = olFeature.getId();
              const style = this.getSelectedStyle();
              olFeature.setStyle(style);
              this.vector.getSource().addFeature(olFeature);
              this.setCqlFilter();
              map.getView().fit(olFeature.getGeometry(), map.getSize());
            }
          });
        }
        this.isSelecting = false;
      },
      addMapEvent() {
        if (this.mapEventsAdded === true) return;
        this.mapEventsAdded = true;
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const { map } = mapPanelBlock.component;

        map.addLayer(this.vector);
        map.addOverlay(this.overlay);

        this.pointermoveEventKey = map.on(
          'pointermove',
          function (event) {
            extendedTool.handlePointermove(event);
          },
          this
        );

        this.clickEventKey = map.on(
          'click',
          function (event) {
            extendedTool.handleClick(event);
          },
          this
        );
      },
      removeMapEvent() {
        if (this.mapEventsAdded === false) return;
        this.mapEventsAdded = false;
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const { map } = mapPanelBlock.component;
        const source = this.vector.getSource();
        if (this.selectedFeatureId !== null) {
          const selectedFeature = source.getFeatureById(this.selectedFeatureId);
          if (selectedFeature) {
            selectedFeature.setStyle(this.getStyle());
          }
        }
        if (this.hoveredFeatureId !== null) {
          const hoveredFeature = source.getFeatureById(this.hoveredFeatureId);
          if (hoveredFeature) {
            hoveredFeature.setStyle(this.getStyle());
          }
        }
        this.selectedFeatureId = null;
        this.hoveredFeatureId = null;

        this.overlay.getElement().innerHTML = '';
        this.overlay.setPosition([-92783496, 0]);

        unByKey(this.pointermoveEventKey);
        unByKey(this.clickEventKey);
        map.removeLayer(this.vector);
        map.removeOverlay(this.overlay);
      },
      setSelected(boundary) {
        if (this.pressed === true) {
          if (boundary === false) {
            this.currentBoundary = null;
          } else {
            this.currentBoundary = boundary;
            this.vector.getSource().clear();
            this.featureInfo = {};
            this.selectedFeatureId = null;
            this.hoveredFeatureId = null;
            const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
            const { map } = mapPanelBlock.component;
            map.removeLayer(this.vector);
            map.addLayer(this.vector);
          }
        } else if (boundary !== false) {
          this.currentBoundary = boundary;
        }
      },
      toggle(state) {
        if (state === true) {
          if (this.pressed === false) {
            const siblings = this.owningBlock.parent.childItems;
            let i = 0;
            const len = siblings.length;
            for (; i < len; i += 1) {
              const sibling = siblings[i];
              if (sibling.id === this.owningBlock.id) continue;
              if (sibling.extendedTool.hasOwnProperty('toggle')) {
                sibling.extendedTool.toggle(false);
              } else if (sibling.component.enableToggle === true && sibling.component.pressed === true) {
                sibling.component.toggle(false);
              }
            }

            this.pressed = true;
            this.addMapEvent();
            this.component.addCls('selected-menu-btn');
          }
        } else {
          this.pressed = false;
          this.component.removeCls('selected-menu-btn');
          this.removeMapEvent();
        }
      },
    };

    const regionBlock = owningBlock.getReferencedBlock('cRegionTool');
    if (regionBlock !== null) {
      regionBlock.on(
        'regionSelected',
        function (callbackObj, postingObj) {
          const extendedTool = callbackObj;

          const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('state', null);
            cqlFilterDisplayBlock.extendedTool.setFilter('subState', null);
          }

          extendedTool.toggle(false);
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
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const overlays = globalThis.App.Layers.query(layersConfig.overlays, {
            type: 'layer',
            mask: false,
          });

          let i = 0;
          const len = overlays.length;
          for (; i < len; i += 1) {
            const overlay = overlays[i];
            if (overlay.hasOwnProperty('cqlFilter') && overlay.cqlFilter.hasOwnProperty(extendedTool.cqlFilterId)) {
              overlay.cqlFilter[extendedTool.cqlFilterId] = null;
            }
          }

          const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('state', null);
            cqlFilterDisplayBlock.extendedTool.setFilter('subState', null);
          }

          extendedTool.toggle(false);
        },
        extendedTool
      );
    }

    const radioGroupBlock = owningBlock.getReferencedBlock('cSelectRegionToolRadioGroup');
    if (radioGroupBlock !== null) {
      radioGroupBlock.on(
        'select',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          const radioGroupTool = postingObj;
          const value = radioGroupTool.selectedValue;
          if (value !== null) {
            const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
            const layers = globalThis.App.Layers.query(
              layersConfig,
              {
                type: 'layer',
                mask: false,
                id: value,
              },
              ['overlays', 'boundaries']
            );

            if (layers.length > 0) {
              extendedTool.setSelected(layers[0]);
            }

            //extendedTool.owningBlock.itemDefinition.layersConfigChanged(layersConfig, extendedTool);
          }
        },
        extendedTool
      );
    }

    return extendedTool;
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const owningMapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
    if (!owningMapWindowBlock.hasOwnProperty('featureCqlFilterId')) {
      owningMapWindowBlock.featureCqlFilterId = getRandomString(32, 36);
    }
    extendedTool.cqlFilterId = owningMapWindowBlock.featureCqlFilterId;

    const extTool = {
      xtype: 'button',
      extendedTool,
      cls: 'x-btn-left',
      iconCls: 'fa fa-aoi-map-select',
      tooltip: block.tooltip,
      tooltipType: 'title',
      width: block.width,
      height: block.height,
      id: extendedTool.toolUniqueID,
      listeners: {
        afterrender() {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;

          globalThis.App.EventHandler.registerCallbackForEvent(
            globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
            this.extendedTool.owningBlock.itemDefinition.layersConfigUpdated,
            this.extendedTool
          );
        },
      },
      menu: Ext.create('Ext.menu.Menu', {
        extendedTool,
        items: [
          {
            xtype: 'panel',
            style: 'padding: 0; margin: 0;',
            bodyStyle: 'padding: 0; margin: 0;',
            items: menu,
          },
        ],
        listeners: {
          hide() {
            // refocus the mapwindow
            const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            const mapperWindow = mapWindowBlock.extendedTool;

            globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED, mapperWindow, mapperWindow);
          },
          show() {
            this.extendedTool.toggle(true);
            const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
          },
        },
      }),
    };

    return extTool;
  },
};
