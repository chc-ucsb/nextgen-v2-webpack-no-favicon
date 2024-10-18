import { getRegionWithRegionID } from '../../../utils';
import { getBlocksByName, getBlueprintsByName } from '../../../helpers/extjs';
import { sortObjects } from '../../../helpers/array';
import { LayerConfig } from 'src/@types';

export const cRegionTool = {
  firstLayersConfig: null,
  addInstanceToList(eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    const newInstanceId = eventObject;
    const newLayersConfig = postingObject;
    const layersConfigByRegionId = extendedTool.layersConfigInstances[extendedTool.lastInstanceId];
    const newLayersConfigByRegionId = {};

    for (const regionId in layersConfigByRegionId) {
      if (regionId === extendedTool.selectedRegionId) {
        newLayersConfigByRegionId[regionId] = newLayersConfig;
      } else {
        newLayersConfigByRegionId[regionId] = JSON.parse(JSON.stringify(layersConfigByRegionId[regionId]));
      }
    }

    extendedTool.layersConfigInstances[newInstanceId] = newLayersConfigByRegionId;
    extendedTool.lastInstanceId = newInstanceId;
  },
  init(blueprint) {
    const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
    const layersConfig = globalThis.App.Layers.getLayersConfigById(currentInstanceId);

    const { regions } = globalThis.App.Config.sources;
    let selectedRegionId = regions[0].id;
    if (Object.prototype.hasOwnProperty.call(globalThis.App.urlParameters, 'region')) {
      const region = getRegionWithRegionID(globalThis.App.urlParameters.region);
      if (region !== null) {
        selectedRegionId = region.id;
      }
    }

    const filterLayersConfigByRegionId = function (layers, regionId) {
      const newLayersConfig = [];
      for (let i = 0, len = layers.length; i < len; i += 1) {
        const layer = layers[i];
        if (layer.type === 'folder') {
          if (!Object.prototype.hasOwnProperty.call(layer, 'regionId')) {
            const newLayer = JSON.parse(JSON.stringify(layer));
            newLayer.folder = filterLayersConfigByRegionId(newLayer.folder, regionId);
            if (newLayer.folder.length > 0) {
              newLayersConfig.push(newLayer);
            }
          } else if (layer.regionId === regionId) {
            const newLayer = JSON.parse(JSON.stringify(layer));
            newLayersConfig.push(newLayer);
          }
        } else if (layer.type === 'layer') {
          newLayersConfig.push(JSON.parse(JSON.stringify(layer)));
        }
      }
      return newLayersConfig;
    };

    const layersConfigsByRegion = {};
    for (const region of regions) {
      const newLayersConfig = {};
      Object.keys(layersConfig).forEach(function (prop) {
        newLayersConfig[prop] = filterLayersConfigByRegionId(layersConfig[prop], region.id);
      });
      layersConfigsByRegion[region.id] = newLayersConfig;
    }

    blueprint.itemDefinition.firstLayersConfig = layersConfigsByRegion;

    globalThis.App.Layers.setLayersConfigInstanceToId(currentInstanceId, layersConfigsByRegion[selectedRegionId]);
  },
  createExtendedTool(owningBlock) {
    const { regions } = globalThis.App.Config.sources;
    let selectedRegionId = regions[0].id;
    if (globalThis.App.urlParameters.hasOwnProperty('region')) {
      const region = getRegionWithRegionID(globalThis.App.urlParameters.region);
      if (region !== null) {
        selectedRegionId = region.id;
      }
    }

    const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();

    const extendedTool = {
      owningBlock,
      layersConfigInstances: {},
      lastInstanceId: currentInstanceId,
      selectedRegionId,
    };

    extendedTool.layersConfigInstances[currentInstanceId] = owningBlock.itemDefinition.firstLayersConfig;

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_CREATED,
      owningBlock.itemDefinition.addInstanceToList,
      extendedTool
    );

    return extendedTool;
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const regionConfigs = globalThis.App.Config.sources.regions;
    const data = [];

    for (let i = 0, len = regionConfigs.length; i < len; i += 1) {
      const regionConfig = regionConfigs[i];
      data.push({
        value: regionConfig.id,
        text: regionConfig.title,
      });
    }

    // If there's a `sort` property in the block config
    if (block.sort) {
      // Sort the regions by ascending/descending order
      sortObjects(data, 'text', block.sort);
    }

    const store = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data,
    });
    const selectedRegion = extendedTool.selectedRegionId;

    const regionTool = {
      extendedTool,
      valueField: 'value',
      id: 'regionCombo',
      displayField: 'text',
      store,
      width: block.width,
      editable: false,
      emptyText: 'Select a Region',
      value: selectedRegion,
      listeners: {
        change(combo) {
          const value = combo.getValue();
          this.extendedTool.selectedRegionId = value;
          const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
          // get the current project that we are on. This functionality would be mainly for LCMAP
          const block = extendedTool.owningBlock.blockConfig;

          const layersConfig = this.extendedTool.layersConfigInstances[currentInstanceId][value];
          const mapWindowBlueprints = getBlueprintsByName('cMapWindow');

          if (mapWindowBlueprints[0].blockConfig.block === 'relative') {
            const mapWindowBlocks = getBlocksByName('cMapWindow');
            for (let i = mapWindowBlocks.length - 1; i >= 0; i -= 1) {
              const mapWindowBlock = mapWindowBlocks[i];
              mapWindowBlock.unRender();
              mapWindowBlock.remove();
            }

            //LCMAP region change logic for yearSlider to update accordingly.
            const slideYears = Ext.getCmp('slideYears');
            let yearSlider = Ext.getCmp('yearSlider');
            // check if the current viewer has a yearSlider and a slideYear text
            if (slideYears !== undefined && yearSlider !== undefined) {
              const layers = globalThis.App.Layers._layers;
              for (let i = 0; i < layers.length; i++) {
                // we need the layer that correspods to the current region that we are currently on
                if (layers[i]?.additionalAttributes?.rasterDataset.includes(extendedTool.selectedRegionId)) {
                  const granule = globalThis.App.Layers._originalGranules.get(layers[i].id);
                  if (granule !== undefined) {
                    const endDate = granule.end;
                    const startDate = granule.start;
                    const year1 = startDate ? startDate.getFullYear() : null;
                    const year2 = endDate ? endDate.getFullYear() : null;
                    slideYears.setText(`${year1}-${year2}`);
                    yearSlider.setMinValue(year1);
                    yearSlider.setMaxValue(year2);
                    yearSlider.setValue([year1, year2]);
                    break;
                  }
                }
              }
            }

            globalThis.App.Layers.setLayersConfigInstanceToId(currentInstanceId, layersConfig);

            // Sometimes the currentInstanceId does not match the instanceId on globalThis.App.Layers, this breaks the region change.
            globalThis.App.Layers.setConfigInstanceId(currentInstanceId);

            // Reset the _granules map with the original granule map
            globalThis.App.Layers._granules = globalThis.App.Layers._originalGranules;

            globalThis.App.Layers.createNewInstanceOfLayersConfig();

            globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_REQUESTING_NEW_MAP_WINDOW, null, null);

            const mapWindows = getBlocksByName('cMapWindow');

            globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED, layersConfig, null);

            globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED, mapWindows[0].extendedTool, null);

            globalThis.App.EventHandler.postEvent(
              globalThis.App.EventHandler.types.EVENT_REGION_CHANGED,
              this.extendedTool,
              this.extendedTool.selectedRegionId
            );
          } else {
            const urlParameters = [];
            for (const prop in globalThis.App.urlParameters) {
              if (prop !== 'region') {
                urlParameters.push(`${prop}=${globalThis.App.urlParameters[prop]}`);
              }
            }
            urlParameters.push(`region=${value}`);
            const url = `${window.location.href.split('?')[0]}?${urlParameters.join('&')}`;
            window.location.href = url;
          }
        },
        afterrender() {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.component.el.dom.title = this.extendedTool.component.emptyText;
        },
      },
    };

    const combo = Ext.create('Ext.form.field.ComboBox', regionTool);
    extendedTool.component = combo;
    return combo;
  },
};
