import { unByKey } from 'ol/Observable';
import { MouseWheelZoom } from 'ol/interaction';
import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import { getRandomString } from '../../../helpers/string';
import { Transport } from '../../../Network/Transport';
import Toggle from 'ol-ext/control/Toggle';

export const cGraphTool = {
  options: {
    events: ['chartrequested', 'featureinfoupdated', 'mapclicked'],
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
  },
  layersConfigUpdated: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
    if (mapWindowBlock.id !== postingObject.owningBlock.id) return;
    extendedTool.setEnabled();
  },
  createExtendedTool: function (owningBlock) {
    const toolUniqueID = getRandomString(32, 36);

    const owningMapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const owningMapWindow = owningMapWindowBlock.extendedTool;
    const mapPanelBlock = owningBlock.getReferencedBlock('cMapPanel');

    // Create the div to store the overlay.
    const overlayId = 'overlay-' + getRandomString(32, 36);
    const overlayDiv = document.createElement('div');
    overlayDiv.id = overlayId;
    overlayDiv.className = 'map-text-overlay';
    document.body.appendChild(overlayDiv);

    const extendedGraphTool = {
      owningBlock: owningBlock,
      toggleGroupId: owningMapWindow.toggleGroupId,
      enabled: true,
      // Store on the extendedTool if the olExt property is true on the block template
      olExt: owningBlock.blockConfig?.olExt || false,
      //after this gets given away to the toolbar it is copied
      //and can no longer be referenced from this object
      //directly
      //you have to use Ext.getCmp(this.extIdentifyToolID);
      //to access it
      //dont forget that
      //relatedOLMap : relatedOLMap,

      extToolID: toolUniqueID,

      // Used to decide when and how to cancel new wfs requests.
      /*wfsRequestStatus: {
       sent: false,  // If true, the wfs request has been sent.
       returned: false,  // If true, the request has been returned.
       complete: false  // If true, all features are finished being added to the vector layer.
       },*/

      // Stores a reference to the last xmlHTTPRequest object.
      lastRequest: null,

      // Stores the overlay to show feature info on hover.
      overlay: new Overlay({
        element: document.getElementById(overlayId),
        positioning: OverlayPositioning.BOTTOM_LEFT,
        offset: [1, -1],
      }),
      overlayId: overlayId,
      pointermoveEventKey: null,
      currentLayer: null,
      mappedLayer: null,
      lastCoords: null,
      overlayAdded: false,
      addPopup: function (map) {
        if (this.overlayAdded === false) {
          this.overlayAdded = true;
          map.addOverlay(this.overlay);
        }
      },
      setPopup: function (coords, featureName) {
        document.getElementById(this.overlayId).innerHTML = featureName;
        this.overlay.setPosition(coords);
      },
      removePopup: function (map) {
        if (this.overlayAdded === true) {
          this.overlayAdded = false;
          map.removeOverlay(this.overlay);
        }
      },

      addMapEvent: function () {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        if (mapPanelBlock.rendered === false) {
          // If the map panel is NOT yet rendered, set an event listener for when it is rendered, and then run setPointerMove()
          mapPanelBlock.on(
            'rendercomponent',
            function (callbackObj, postingObj, eventObj) {
              const extendedTool = callbackObj;
              extendedTool.setPointermove();
            },
            this
          );
        } else {
          this.setPointermove();
        }
      },
      removeMapEvent: function () {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        unByKey(this.pointermoveEventKey);
        this.pointermoveEventKey = null;
        this.removePopup(map);
      },

      setPointermove: function () {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        if (this.pointermoveEventKey !== null) {
          unByKey(this.pointermoveEventKey);
        }
        const boundary = this.currentLayer;
        this.pointermoveEventKey = map.on(
          'pointermove',
          function (event) {
            const coords = event.coordinate;
            extendedGraphTool.lastCoords = coords;
            setTimeout(
              async function (extendedTool, coords) {
                if (extendedTool.olExt && extendedTool.olExtComponent.getActive()) map.extendedTool.component.activeDataQueryComponent = 'chart';

                if (extendedTool.olExt && map.extendedTool.component.activeDataQueryComponent !== 'chart') return;

                if (extendedTool.lastCoords[0] === coords[0] && extendedTool.lastCoords[1] === coords[1]) {
                  const featureInfoUrl = globalThis.App.OpenLayers.getFeatureInfoUrl(coords, map, boundary);
                  const splitUrl = featureInfoUrl.split('?');

                  if (
                    typeof extendedTool.lastRequest !== undefined &&
                    extendedTool.lastRequest !== null &&
                    extendedTool.lastRequest?.returned !== true
                  ) {
                    extendedTool.lastRequest.canceled = true;
                  }

                  const [url, body] = splitUrl;
                  const res = await Transport.post(body).to(url, {
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                  });
                  extendedTool.lastRequest = res;
                  if (res['canceled'] === true) return;
                  Object.assign(res, {
                    returned: true,
                  });
                  if (!res.ok) return;

                  const featureInfoRawText = await res.text();

                  // Check if the response is a GeoServer XML error
                  if (featureInfoRawText.startsWith('<?xml') && featureInfoRawText.indexOf('LayerNotQueryable') === -1) return;

                  const featureInfo = JSON.parse(featureInfoRawText);
                  const { features } = featureInfo;
                  if (features.length === 0) {
                    extendedTool.removePopup(map);
                    return;
                  }

                  extendedTool.addPopup(map);
                  const coordinates = coords;
                  const displayText = [];
                  const mappedFeatureInfo = extendedTool.mappedLayer.featureInfo;
                  if (mappedFeatureInfo.length > 0) {
                    let i = 0;
                    const len = mappedFeatureInfo.length;
                    for (; i < len; i += 1) {
                      if (features[0].properties.hasOwnProperty(mappedFeatureInfo[i].propertyName)) {
                        displayText.push(features[0].properties[mappedFeatureInfo[i].propertyName]);
                      }
                    }
                    extendedTool.setPopup(coordinates, displayText.join('<br>'));
                  }
                }
              },
              20,
              extendedGraphTool,
              coords
            );
          },
          this
        );
        this.addPopup(map);
      },

      setEnabled: function () {
        const mapWindowBlock = this.owningBlock.getReferencedBlock('cMapWindow');
        const mapperWindow = mapWindowBlock.extendedTool;
        if (mapperWindow === null) return;
        this.currentLayer = null;
        const mappedLayers = this.owningBlock.blockConfig.layers;
        const layersConfig = globalThis.App.Layers.getLayersConfigById(mapperWindow.layersConfigId);
        const chartsConfig = globalThis.App.Config.sources.charts;

        const overlays = globalThis.App.Layers.query(
          layersConfig,
          function (layer) {
            if (layer.type !== 'layer') return false;
            if ((layer.display === true || layer.loadOnly === true) && layer.mask === false) return true;
            return false;
          },
          ['overlays', 'hidden']
        );

        const boundaryFolderId = globalThis.App.Charter.getEnabledBoundaryFolder(layersConfig.boundaries);
        const boundaryFolder = globalThis.App.Layers.query(layersConfig.boundaries, { id: boundaryFolderId });
        const boundaries = globalThis.App.Layers.query(boundaryFolder, function (layer) {
          if (layer.type !== 'layer') return false;
          if ((layer.display === true || layer.loadOnly === true) && layer.mask === false) return true;
          return false;
        });

        // Loop through
        let enabled = false;
        let mappedLayer = null;
        const chartsLength = chartsConfig.length;
        const overlaysLength = overlays.length;
        const boundariesLength = boundaries.length;
        const mappedLayersLength = mappedLayers.length;
        // Loop through chart configuration in the data.json
        for (let i = 0; i < chartsLength; i += 1) {
          const chartConfig = chartsConfig[i];
          // Loop through overlays and boundaries in the data.json for an overlay/boundary pair
          // that is turned on and matches what is in the chart configs.
          // We only display popups for polygon names if a chart would be rendered if
          // the user clicks on that polygon with the current raster in the map.
          for (let j = 0; j < overlaysLength; j += 1) {
            const overlay = overlays[j];
            let configuredOverlayDisplayed = false;

            for (var k = 0, len = chartConfig.overlays.length; k < len; k += 1) {
              const configuredOverlay = chartConfig.overlays[k];
              if (overlay.id === configuredOverlay.forLayerId) {
                configuredOverlayDisplayed = true;
                break;
              }
            }
            if (configuredOverlayDisplayed === false) continue;

            for (var k = 0; k < boundariesLength; k += 1) {
              const boundary = boundaries[k];
              if (chartConfig.boundaries.indexOf(boundary.id) === -1) continue;
              // Loop through layer mapping in template.json to ensure boundary is configured to be used.
              for (let ii = 0; ii < mappedLayersLength; ii += 1) {
                if (mappedLayers[ii].id === boundary.id) {
                  mappedLayer = mappedLayers[ii];
                  this.currentLayer = boundary;
                  enabled = true;
                  break;
                }
              }
            }
          }
        }

        this.mappedLayer = mappedLayer;

        // Show/hide the button if there is no charts for the layer
        if (enabled === false) {
          // Hide the ExtJS button
          if (this.hasOwnProperty('component')) {
            this.component.hide();
            if (this.component.pressed === true) this.removeMapEvent();
          }
          // Hide the Ol-Ext button
          else if (this.hasOwnProperty('olExtComponent')) {
            this.olExtComponent.setVisible(false);
            if (this.olExtComponent.getActive()) this.removeMapEvent();
          }
        } else {
          // Show the ExtJS button
          if (this.hasOwnProperty('component')) {
            this.component.show();
            if (this.component.pressed === true) this.addMapEvent();
          }
          // Show the Ol-Ext button
          else if (this.hasOwnProperty('olExtComponent')) {
            this.olExtComponent.setVisible(true);
            if (this.olExtComponent.getActive()) this.addMapEvent();
          }
        }

        this.enabled = enabled;
      },

      featureInfoUpdated: function () {
        const mapWindowBlock = this.owningBlock.getReferencedBlock('cMapWindow');
        const mapperWindow = mapWindowBlock.extendedTool;
        const layersConfigId = mapperWindow.layersConfigId;
        const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
        globalThis.App.Layers.setLayersConfigInstanceToId(layersConfigId, layersConfig);
        globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_FEATUREINFO_UPDATED, mapperWindow, this);
        this.owningBlock.fire('featureinfoupdated', mapperWindow);
      },

      graphToolMapClickListenerCallbackFunction: function (callbackObject, postingObject, eventObject) {
        //tools act upon the mapwindow
        //so this identify tool should
        //get the mapclick event and then modify the
        //featureinfo then post the featureInfoAvailable event

        const graphTool = callbackObject;

        // Determine if the tool is using ol-ext or not
        // If we have an ol-ext component, check if it's active
        // Return so we don't have to
        if (graphTool?.olExtComponent) {
          if (graphTool.olExtComponent.getActive() === false || graphTool.enabled === false) return;
        } else if (!graphTool.hasOwnProperty('component')) return;

        graphTool.owningBlock.fire('mapclicked', graphTool);
        const event = eventObject;
        const mapPanelTool = postingObject;
        const mapWindowBlock = graphTool.owningBlock.getReferencedBlock('cMapWindow');
        const mapperWindow = mapWindowBlock.extendedTool;

        const map = mapPanelTool.component.map;

        // pressed is only available if this is an ExtJS component. It will not be present if this is an olExt component.
        const isPressed = Ext.getCmp(callbackObject.extToolID)?.pressed;

        // Determine if the ExtJS button or the Ol-Ext button is active
        if (isPressed || graphTool?.olExtComponent?.getActive()) {
          const layersConfigId = mapperWindow.layersConfigId;
          const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
          let layer = globalThis.App.OpenLayers.getCrosshairLayer(map);

          if (layer) {
            map.removeLayer(layer);
          }

          const crossHairLayer = globalThis.App.OpenLayers.drawCrossHair(event.coordinate);
          map.addLayer(crossHairLayer);

          globalThis.App.EventHandler.postEvent(
            globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_FEATUREINFO_FETCHING,
            mapperWindow,
            callbackObject
          );

          globalThis.App.OpenLayers.getLayersFeatureInfo(event.coordinate, map, layersConfig, graphTool, 'featureInfoUpdated');

          //graphTool.owningBlock.fire('chartrequested', mapperWindow);
        }
      },
    };

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_LAYER_CONFIGURATION_UPDATED,
      owningBlock.itemDefinition.layersConfigUpdated,
      extendedGraphTool
    );

    mapPanelBlock.on('click', extendedGraphTool.graphToolMapClickListenerCallbackFunction, extendedGraphTool);

    extendedGraphTool.setEnabled();

    return extendedGraphTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    if (block.olExt) {
      const getChartToggleButton = ({ map, options }) => {
        const btn = new Toggle({
          html: '<i class="ms ms-area-chart"></i>',
          className: 'select',
          title: 'Timeseries Graph',

          // IMPORTANT! - This property is used to automatically enable the graph tool when a map window is created.
          // If this is just set to 'true' then an error will occur when there are no charts associated with that map window.
          active: false,
          // autoActivate: false,
          onToggle: (isToggled: boolean) => {
            if (isToggled) {
              map.extendedTool.component.activeDataQueryComponent = 'chart';

              // map.getInteractions().clear();
              // const d = new MouseWheelZoom();
              // map.addInteraction(d);

              if (extendedTool.enabled === true) extendedTool.addMapEvent();
            } else {
              map.extendedTool.component.activeDataQueryComponent = '';

              extendedTool.removeMapEvent();
            }

            const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
          },
        });

        btn.on('change:active', function (event) {
          if (event.active) {
            if (extendedTool.enabled === true) extendedTool.addMapEvent();
          } else {
            map.extendedTool.component.activeDataQueryComponent = '';

            //const layer = globalThis.App.OpenLayers.getCrosshairLayer(map);
            //if (layer) map.removeLayer(layer);;

            let layer = globalThis.App.OpenLayers.getCrosshairLayer(map);

            if (layer) {
              map.removeLayer(layer);
            }

            extendedTool.removeMapEvent();
          }

          const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
          mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
        });

        extendedTool.olExtComponent = btn;

        btn.setActive(extendedTool.enabled);

        // We have to call setEnabled after assigning the olExtComponent because setEnabled runs before this is created and it
        // determines if the button is enabled or not and it doesn't act on the component until it's been created
        extendedTool.setEnabled();

        return btn;
      };

      globalThis.App.OpenLayers.controls['chart'] = getChartToggleButton;

      return;
    } else {
      const extGraphTool = {
        extendedTool: extendedTool,
        cls: 'x-btn-left',
        iconCls: block.iconClass ? block.iconClass : 'fa fa-area-chart',
        tooltip: block.tooltip,
        tooltipType: 'title',
        enableToggle: true,
        toggleGroup: extendedTool.toggleGroupId,
        id: extendedTool.extToolID,
        pressed: block.pressed,
        //disabled : !extendedTool.enabled,
        hidden: !extendedTool.enabled,
        listeners: {
          toggle: function (button, pressed) {
            const me = this;
            // @ts-ignore
            if (!(me.pressed || Ext.ButtonToggleManager.getPressed(me.toggleGroup))) {
              me.toggle(true, true);

              const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
              const map = mapPanelBlock.component.map;
              let layer = globalThis.App.OpenLayers.getCrosshairLayer(map);
              if (layer) {
                map.removeLayer(layer);
              }
            }

            if (me.pressed) {
              const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
              const map = mapPanelBlock.component.map;
              map.getInteractions().clear();
              const d = new MouseWheelZoom();
              map.addInteraction(d);
              if (me.extendedTool.enabled === true) me.extendedTool.addMapEvent();
            } else {
              me.extendedTool.removeMapEvent();
            }

            const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
          },
          afterrender: function () {
            this.extendedTool.component = this;
            this.extendedTool.owningBlock.component = this;
            this.extendedTool.owningBlock.rendered = true;
            if (this.pressed === true && this.extendedTool.enabled === true) this.extendedTool.addMapEvent();
          },
        },
      };

      return extGraphTool;
    }

    return;
    // const block = extendedTool.owningBlock.blockConfig;
    //
  },
};
