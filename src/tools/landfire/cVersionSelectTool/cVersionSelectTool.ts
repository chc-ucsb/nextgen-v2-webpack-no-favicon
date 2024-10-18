import { getRegionWithRegionID } from '../../../utils';
import { getBlocksByName, getBlueprintsByName } from '../../../helpers/extjs';
import { sortObjects } from '../../../helpers/array';

export const cVersionSelectTool = {
  globalSelectedVersion: null,
  globalLayerConfig: null,
  firstLayersConfig: null,
  addInstanceToList(eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    const newInstanceId = eventObject;
    extendedTool.selectedVersionId = globalThis.App.Layers.getSelectedVersion();
    extendedTool.selectedRegionId = globalThis.App.Layers.getSelectedRegion();
    extendedTool.version_region = extendedTool.selectedVersionId + '_' + extendedTool.selectedRegionId;

    const layersConfigByVersionRegionId = globalThis.App.Layers.getVersionRegionConfig();

    extendedTool.layersConfigInstances[newInstanceId] = layersConfigByVersionRegionId;
    extendedTool.lastInstanceId = newInstanceId;

    // Update the store?

    const block = extendedTool.owningBlock.blockConfig;
    const versionConfigs = globalThis.App.Config.sources.versions;
    const data = [];

    // Using a Set will remove any duplicate items, and Array.from converts that Set back into an array.
    const versionsForRegion = Array.from(
      new Set(
        globalThis.App.Layers.query(
          globalThis.App.Config.sources.layers,
          function (item) {
            if (item.versionId !== undefined && item.regionId === globalThis.App.Layers.getSelectedRegion()) return true;
            return false;
          },
          ['overlays']
        ).map((item) => item.versionId)
      )
    );

    for (let i = 0, len = versionConfigs.length; i < len; i += 1) {
      const versionConfig = versionConfigs[i];

      if (versionsForRegion.includes(versionConfig.id)) {
        data.push({
          value: versionConfig.id,
          text: versionConfig.title,
        });
      }
    }

    // If there's a `sort` property in the block config
    if (block.sort) {
      // Sort the versions by ascending/descending order
      sortObjects(data, 'text', block.sort);
    }

    const store = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data,
    });

    callbackObject.component.bindStore(store);
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

        const versionsForRegion = Array.from(
          new Set(
            globalThis.App.Layers.query(
              globalThis.App.Config.sources.layers,
              function (item) {
                if (item.versionId !== undefined && item.regionId === Region.id) return true;
                return false;
              },
              ['overlays']
            ).map((item) => item.versionId)
          )
        );

        if (versionsForRegion.includes(Version.id)) {
          Object.keys(versionregionlayersConfig).forEach(function (prop) {
            newLayersConfig[prop] = filterLayersConfigByVersionRegionId(versionregionlayersConfig[prop], Version.id, Region.id);
          });

          var key = Version.id + '_' + Region.id;

          layersConfigsByVersionRegion[key] = newLayersConfig;
        }
      }
    }

    blueprint.itemDefinition.firstLayersConfig = globalThis.App.Layers.getVersionRegionConfig();

    globalThis.App.Layers.setLayersConfigInstanceToId(currentInstanceId, layersConfigsByVersionRegion[initialKey]);
  },
  createExtendedTool(owningBlock) {
    const { regions } = globalThis.App.Config.sources;
    const { versions } = globalThis.App.Config.sources;
    let selectedRegionId = regions[0].id;
    let selectedVersionId = versions[0].id;
    let value = selectedVersionId + '_' + selectedRegionId;

    /*     if (globalThis.App.urlParameters.hasOwnProperty('region')) {
      const region = getRegionWithRegionID(globalThis.App.urlParameters.region);
      if (region !== null) {
        selectedRegionId = region.id;
      }
    } */

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
    const versionConfigs = globalThis.App.Config.sources.versions;
    const data = [];

    // Using a Set will remove any duplicate items, and Array.from converts that Set back into an array.
    const versionsForRegion = Array.from(
      new Set(
        globalThis.App.Layers.query(
          globalThis.App.Config.sources.layers,
          function (item) {
            if (item.versionId !== undefined && item.regionId === globalThis.App.Layers.getSelectedRegion()) return true;
            return false;
          },
          ['overlays']
        ).map((item) => item.versionId)
      )
    );

    for (let i = 0, len = versionConfigs.length; i < len; i += 1) {
      const versionConfig = versionConfigs[i];

      if (versionsForRegion.includes(versionConfig.id)) {
        data.push({
          value: versionConfig.id,
          text: versionConfig.title,
        });
      }
    }

    // If there's a `sort` property in the block config
    if (block.sort) {
      // Sort the versions by ascending/descending order
      sortObjects(data, 'text', block.sort);
    }

    const store = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data,
    });
    const selectedVersion = globalThis.App.Layers.getSelectedVersion();

    const VersionSelectTool = {
      extendedTool,
      valueField: 'value',
      displayField: 'text',
      id: 'mainVersionSelectTool',
      store,
      width: block.width,
      editable: false,
      emptyText: 'Select a Version',
      value: selectedVersion,
      listeners: {
        change(combo) {
          const value = combo.getValue();
          let selectedRegion = globalThis.App.Layers.getSelectedRegion();
          this.extendedTool.selectedVersionId = value;
          this.extendedTool.selectedRegionId = globalThis.App.Layers.getSelectedRegion();
          const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
          const version_region = value + '_' + selectedRegion;
          const mapWindowBlueprints = getBlueprintsByName('cMapWindow');
          const layersConfig = this.extendedTool.layersConfigInstances[currentInstanceId][version_region];

          globalThis.App.Layers.setSelectedVersion(value);

          if (mapWindowBlueprints[0].blockConfig.block === 'relative') {
            const mapWindowBlocks = getBlocksByName('cMapWindow');
            for (let i = mapWindowBlocks.length - 1; i >= 0; i -= 1) {
              const mapWindowBlock = mapWindowBlocks[i];
              mapWindowBlock.unRender();
              mapWindowBlock.remove();
            }

            globalThis.App.Layers.setLayersConfigInstanceToId(currentInstanceId, layersConfig);

            // Sometimes the currentInstanceId does not match the instanceId on globalThis.App.Layers, this breaks the version change.
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
          } //else {
          //   const urlParameters = [];
          //   for (const prop in globalThis.App.urlParameters) {
          //     if (prop !== 'region') {
          //       urlParameters.push(`${prop}=${globalThis.App.urlParameters[prop]}`);
          //     }
          //   }
          //   urlParameters.push(`region=${value}`);
          //   const url = `${window.location.href.split('?')[0]}?${urlParameters.join('&')}`;
          //   window.location.href = url;
          // }
        },
        afterrender() {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.component.el.dom.title = this.extendedTool.component.emptyText;
        },
      },
    };

    const combo = Ext.create('Ext.form.field.ComboBox', VersionSelectTool);
    extendedTool.component = combo;
    return combo;
  },
};
