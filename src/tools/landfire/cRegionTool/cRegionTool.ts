import { getRegionWithRegionID } from '../../../utils';
import { getBlocksByName, getBlueprintsByName } from '../../../helpers/extjs';
import { sortObjects } from '../../../helpers/array';

export const cRegionTool = {
  globalSelectedRegion: null,
  firstLayersConfig: null,
  addInstanceToList(eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    const newInstanceId = eventObject;
    const newLayersConfig = postingObject;
    const layersConfigByVersionRegionId = extendedTool.layersConfigInstances[extendedTool.lastInstanceId];
    const newLayersConfigByVersionRegionId = {};
    extendedTool.selectedVersionId = globalThis.App.Layers.getSelectedVersion();
    extendedTool.selectedRegionId = globalThis.App.Layers.getSelectedRegion();
    extendedTool.version_region = extendedTool.selectedVersionId + '_' + extendedTool.selectedRegionId;

    for (const regionId in layersConfigByVersionRegionId) {
      if (regionId === extendedTool.version_region) {
        newLayersConfigByVersionRegionId[regionId] = newLayersConfig;
      } else {
        newLayersConfigByVersionRegionId[regionId] = JSON.parse(JSON.stringify(layersConfigByVersionRegionId[regionId]));
      }
    }

    extendedTool.layersConfigInstances[newInstanceId] = newLayersConfigByVersionRegionId;
    extendedTool.lastInstanceId = newInstanceId;
  },

  init(blueprint) {
    const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
    const versionregionlayersConfig = globalThis.App.Layers.getLayersConfigById(currentInstanceId);
    const { regions } = globalThis.App.Config.sources;
    const { versions } = globalThis.App.Config.sources;
    let selectedVersionId = versions[0].id;
    let selectedRegionId = regions[0].id;

    if (Object.prototype.hasOwnProperty.call(globalThis.App.urlParameters, 'region')) {
      const region = getRegionWithRegionID(globalThis.App.urlParameters.region);
      if (region !== null) {
        selectedRegionId = region.id;
      }
    }
    const initialKey = selectedVersionId + '_' + selectedRegionId;
    globalThis.App.Layers.setSelectedRegion(selectedRegionId);
    globalThis.App.Layers.setSelectedVersion(selectedVersionId);

    const filterLayersConfigByVersionRegionId = function (layers, versionId, regionId) {
      const newLayersConfig = [];
      for (let i = 0, len = layers.length; i < len; i += 1) {
        const layer = layers[i];

        if (layer.type === 'folder') {
          if (!Object.prototype.hasOwnProperty.call(layer, 'regionId')) {
            const newLayer = JSON.parse(JSON.stringify(layer));
            newLayer.folder = filterLayersConfigByVersionRegionId(newLayer.folder, versionId, regionId);
            if (newLayer.folder.length > 0) {
              newLayersConfig.push(newLayer);
            }
          } else if (layer.regionId === regionId) {
            if (layer.versionId === versionId) {
              const newLayer = JSON.parse(JSON.stringify(layer));
              newLayersConfig.push(newLayer);
            } else if (!Object.prototype.hasOwnProperty.call(layer, 'versionId')) {
              const newLayer = JSON.parse(JSON.stringify(layer));
              newLayersConfig.push(newLayer);
            }
          }
        } else if (layer.type === 'layer') {
          newLayersConfig.push(JSON.parse(JSON.stringify(layer)));
        }
      }

      return newLayersConfig;
    };

    const layersConfigsByVersionRegion = {};

    for (const Version of versions) {
      for (const Region of regions) {
        const newLayersConfig = {};

        Object.keys(versionregionlayersConfig).forEach(function (prop) {
          newLayersConfig[prop] = filterLayersConfigByVersionRegionId(versionregionlayersConfig[prop], Version.id, Region.id);
        });

        var key = Version.id + '_' + Region.id;

        layersConfigsByVersionRegion[key] = newLayersConfig;
      }
    }

    blueprint.itemDefinition.firstLayersConfig = layersConfigsByVersionRegion;

    globalThis.App.Layers.setVersionRegionConfig(layersConfigsByVersionRegion);

    globalThis.App.Layers.setLayersConfigInstanceToId(currentInstanceId, layersConfigsByVersionRegion[initialKey]);
  },
  createExtendedTool(owningBlock) {
    const { regions } = globalThis.App.Config.sources;
    const { versions } = globalThis.App.Config.sources;
    let selectedRegionId = regions[0].id;
    let selectedVersionId = versions[0].id;
    let value = selectedVersionId + '_' + selectedRegionId;

    if (globalThis.App.urlParameters.hasOwnProperty('region')) {
      const region = getRegionWithRegionID(globalThis.App.urlParameters.region);
      if (region !== null) {
        selectedRegionId = region.id;
        console.log('setting', selectedRegionId);
      }
    }

    globalThis.App.Layers.setSelectedRegion(selectedRegionId);
    globalThis.App.Layers.setSelectedVersion(selectedVersionId);

    const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();

    const extendedTool = {
      owningBlock,
      layersConfigInstances: {},
      lastInstanceId: currentInstanceId,
      value,
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
    const selectedRegion = globalThis.App.Layers.getSelectedRegion();

    const regionTool = {
      extendedTool,
      valueField: 'value',
      displayField: 'text',
      store,
      width: block.width,
      editable: false,
      emptyText: 'Select a Region',
      value: selectedRegion,
      id: 'cRegionTool',
      listeners: {
        change(combo) {
          const value = combo.getValue();
          globalThis.App.Layers.setSelectedRegion(value);
          let selectedVersion = globalThis.App.Layers.getSelectedVersion();
          this.extendedTool.selectedRegionId = value;
          const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
          const version_region = selectedVersion + '_' + value;
          const mapWindowBlueprints = getBlueprintsByName('cMapWindow');
          const layersConfig = this.extendedTool.layersConfigInstances[currentInstanceId][version_region];

          if (mapWindowBlueprints[0].blockConfig.block === 'relative') {
            const mapWindowBlocks = getBlocksByName('cMapWindow');
            for (let i = mapWindowBlocks.length - 1; i >= 0; i -= 1) {
              const mapWindowBlock = mapWindowBlocks[i];
              mapWindowBlock.unRender();
              mapWindowBlock.remove();
            }

            const versionSelectorCombo = Ext.getCmp('mainVersionSelectTool');

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
