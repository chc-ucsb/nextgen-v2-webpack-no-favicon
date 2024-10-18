import { getRandomString } from '../../../helpers/string';
import { transform } from 'ol/proj';

export const cIdentifyTool = {
  options: {
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
  },
  createExtendedTool: function (owningBlock) {
    const toolUniqueID = getRandomString(32, 36);

    const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');

    const extendedTool = {
      owningBlock: owningBlock,
      toggleGroupId: mapWindowBlock.extendedTool.toggleGroupId,
      //extTool : extIdentifyTool,
      //after this gets given away to the toolbar it is copied
      //and can no longer be referenced from this object
      //directly
      //you have to use Ext.getCmp(this.extIdentifyToolID);
      //to access it
      //dont forget that

      extToolID: toolUniqueID,
      identifyToolMapClickListenerCallbackFunction: async function (eventObject, mapWindow) {
        //tools act upon the mapwindow
        //so this identify tool should
        //get the mapclick event and then modify the
        //featureinfo then post the featureInfoAvailable event

        const event = eventObject;
        const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
        const mapperWindow = mapWindowBlock.extendedTool;
        const mapPanelBlock = owningBlock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;

        const isPressed = this.component.pressed;
        if (isPressed) {
          const layersConfigId = mapperWindow.layersConfigId;
          const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
          let layer;

          if ((layer = globalThis.App.OpenLayers.getCrosshairLayer(map))) {
            map.removeLayer(layer);
          }

          const crossHairLayer = globalThis.App.OpenLayers.drawCrossHair(event.coordinate);
          map.addLayer(crossHairLayer);

          const transformedCoordinate = transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
          if (transformedCoordinate[0] < -180) {
            Ext.Msg.show({
              msg:
                'If you select a point that crosses the -180 longitude and you want to get elevation for this point, you will need to select the ak_220 Elevation data set then pan the map to the East over Asia to get the elevation value for the Aleutian islands. <br></br> Also note, if you are over the Aleutian islands from the East and you cross the 180 longitude, you will need to Zoom to Extent to view elevation.',
              buttons: Ext.Msg.CANCEL,
            });
          }
          globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_FEATUREINFO_FETCHING, mapperWindow, this);

          const newLayerConfig = await globalThis.App.OpenLayers.updateLayerConfigWithFeatureInfoForCoord(
            event.coordinate,
            mapPanelBlock.component.map,
            layersConfig
          );

          globalThis.App.Layers.setLayersConfigInstanceToId(layersConfigId, newLayerConfig);

          globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_FEATUREINFO_UPDATED, mapperWindow, this);

          globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_REQUEST_TOOLS_DRAWER_OPEN, mapperWindow, this);
        }
      },
    };

    mapWindowBlock.on(
      'click',
      function (callbackObj, postingObj, event) {
        const extendedTool = callbackObj;
        const mapperWindow = postingObj;

        extendedTool.identifyToolMapClickListenerCallbackFunction(event, mapperWindow);
      },
      extendedTool
    );

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const extIdentifyTool = {
      extendedTool: extendedTool,
      cls: 'x-btn-left',
      iconCls: 'fa ' + 'fa-info-circle',
      tooltip: block.tooltip,
      tooltipType: 'title',
      enableToggle: true,
      toggleGroup: extendedTool.toggleGroupId,
      id: extendedTool.extToolID,
      pressed: block.pressed,
      listeners: {
        toggle: function () {
          const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
          const map = mapPanelBlock.component.map;

          // Remove crosshair layer on toggle
          const crosshairLayer = globalThis.App.OpenLayers.getCrosshairLayer(map);
          if (crosshairLayer) {
            map.removeLayer(crosshairLayer);
          }

          if (!this.priorToggle && this.pressed) {
            this.priorToggle = true;
          } else if (this.priorToggle && !this.pressed) {
            this.priorToggle = false;
          }
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    return extIdentifyTool;
  },
};
