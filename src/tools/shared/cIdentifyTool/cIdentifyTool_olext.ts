import Toggle from 'ol-ext/control/Toggle';

export const cIdentifyTool_olext = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const getIdentifyToggleButton = ({ map }) => {
      const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');

      mapWindowBlock.on('click', async function (callbackObj, postingObj, event) {
        if (map.extendedTool.component.activeDataQueryComponent === 'identify') {
          const mapWindow = postingObj;

          const layerConfigId = mapWindow.layersConfigId;
          const layersConfig = globalThis.App.Layers.getLayersConfigById(layerConfigId);

          const layer = globalThis.App.OpenLayers.getCrosshairLayer(map);
          if (layer) map.removeLayer(layer);

          const crossHairLayer = globalThis.App.OpenLayers.drawCrossHair(event.coordinate);
          map.addLayer(crossHairLayer);

          globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_FEATUREINFO_FETCHING, mapWindow, this);

          const newLayerConfig = await globalThis.App.OpenLayers.updateLayerConfigWithFeatureInfoForCoord(event.coordinate, map, layersConfig);

          globalThis.App.Layers.setLayersConfigInstanceToId(layerConfigId, newLayerConfig);

          globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_FEATUREINFO_UPDATED, mapWindow, this);

          globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_REQUEST_TOOLS_DRAWER_OPEN, mapWindow, this);
        }
      });

      const identifyButton = new Toggle({
        html: '<i class="ms ms-identify"></i>',
        className: 'select',
        title: 'Identify',
        active: false,
        onToggle: (isToggled: boolean) => {
          if (isToggled) map.extendedTool.component.activeDataQueryComponent = 'identify';
          else {
            map.extendedTool.component.activeDataQueryComponent = '';
            const layer = globalThis.App.OpenLayers.getCrosshairLayer(map);
            if (layer) map.removeLayer(layer);
          }
        },
      });

      identifyButton.on('change:active', function (event) {
        if (event.active) {
          if (extendedTool.enabled === true) extendedTool.addMapEvent();
        } else {
          map.extendedTool.component.activeDataQueryComponent = '';
          const layer = globalThis.App.OpenLayers.getCrosshairLayer(map);
          if (layer) map.removeLayer(layer);
        }

        const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
        mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
      });

      return identifyButton;

      // return new Toggle({
      //   html: '<i class="ms ms-identify"></i>',
      //   className: 'select',
      //   title: 'Identify',
      //   active: false,
      //   onToggle: (isToggled: boolean) => {
      //     if (isToggled) map.extendedTool.component.activeDataQueryComponent = 'identify';
      //     else {
      //       map.extendedTool.component.activeDataQueryComponent = '';
      //       const layer = globalThis.App.OpenLayers.getCrosshairLayer(map);
      //       if (layer) map.removeLayer(layer);
      //     }
      //   },
      // });
    };

    globalThis.App.OpenLayers.controls['identify'] = getIdentifyToggleButton;

    return;
  },
};
