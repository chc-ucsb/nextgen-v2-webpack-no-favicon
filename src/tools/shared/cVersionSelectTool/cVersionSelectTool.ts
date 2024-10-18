import { getVersionWithVersionID } from '../../../utils';
import { getBlocksByName, getBlueprintsByName } from '../../../helpers/extjs';
import { sortObjects } from '../../../helpers/array';
import { version } from 'proj4';
import { ExtentEvent } from 'ol/interaction/Extent';
import { extend } from 'ol/extent';

export const cVersionSelectTool = {
  globalSelectedVersion: null,
  firstLayersConfig: null,
  addInstanceToList(eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    const newInstanceId = eventObject;    
    const layersConfigByVersionRegionId = extendedTool.layersConfigInstances[extendedTool.lastInstanceId];
    const newLayersConfig = postingObject;
    const newLayersConfigByVersionRegionId = {};

    console.log("layersconfigbyversionregion", layersConfigByVersionRegionId);

    const selectedRegion = globalThis.App.Layers.getSelectedRegion();
    console.log("selected Region", selectedRegion);

    for (const version_region in layersConfigByVersionRegionId) {
      console.log("version region", version_region);
      if (version_region === extendedTool.selectedVersionId) {
        newLayersConfigByVersionRegionId[version_region] = newLayersConfig;
      } else {
        newLayersConfigByVersionRegionId[version_region] = JSON.parse(JSON.stringify(layersConfigByVersionRegionId[version_region]));
      }
    }

    extendedTool.layersConfigInstances[newInstanceId] = newLayersConfigByVersionRegionId;
    extendedTool.lastInstanceId = newInstanceId;
  },

  init(blueprint) {
    const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
    const layersConfig = globalThis.App.Layers.getLayersConfigById(currentInstanceId);

    console.log("layersconfig", layersConfig);
    const { regions } = globalThis.App.Config.sources;
    const { versions } = globalThis.App.Config.sources;
    const selectedRegionId = regions[0].id;
    let selectedVersionId = versions[0].id;  
    globalThis.App.Layers.setSelectedVersion(selectedVersionId);  
    const selectedRegion = globalThis.App.Layers.getSelectedRegion();
    console.log("selected Region", selectedRegion);
    let version_region = selectedVersionId + "_" + selectedRegion;

    if (Object.prototype.hasOwnProperty.call(globalThis.App.urlParameters, 'version')) {
      const Version = getVersionWithVersionID(globalThis.App.urlParameters.Version);
      if (Version !== null) {
        selectedVersionId = Version.id;
      }
    }

    const filterLayersConfigByVersionRegionId = function (layers, versionId, regionId) {
      const newLayersConfig = [];
      for (let i = 0, len = layers.length; i < len; i += 1) {
        const layer = layers[i];

        if (layer.type === 'folder') {
          if (!Object.prototype.hasOwnProperty.call(layer, 'versionId')) {
            const newLayer = JSON.parse(JSON.stringify(layer));
            newLayer.folder = filterLayersConfigByVersionRegionId(newLayer.folder, versionId, regionId);
            if (newLayer.folder.length > 0) {
              newLayersConfig.push(newLayer);
            }
          } else if (layer.versionId === versionId && layer.regionId === regionId) {
            const newLayer = JSON.parse(JSON.stringify(layer));
            newLayersConfig.push(newLayer);
          }
        } else if (layer.type === 'layer') {
          newLayersConfig.push(JSON.parse(JSON.stringify(layer)));
        }
      }

      return newLayersConfig;
    };

    const layersConfigsByVersionRegion = {};
    for (const Version of versions) {
      for(const Region of regions) {        
        const newLayersConfig = {};

        Object.keys(layersConfig).forEach(function (prop) {
          newLayersConfig[prop] = filterLayersConfigByVersionRegionId(layersConfig[prop], Version.id, Region.id);
        });

        var key = Version.id + "_" + Region.id;

        layersConfigsByVersionRegion[key] = newLayersConfig;
      }   
    }

    console.log("layersconfigbyversion", layersConfigsByVersionRegion);

    blueprint.itemDefinition.firstLayersConfig = layersConfigsByVersionRegion;

    globalThis.App.Layers.setLayersConfigInstanceToId(currentInstanceId, layersConfigsByVersionRegion[version_region]);
    blueprint.itemDefinition.globalSelectedVersion = selectedVersionId;
  },
  createExtendedTool(owningBlock) {
    const { versions } = globalThis.App.Config.sources;
    const { regions } = globalThis.App.Config.sources;
    let selectedVersionId = versions[0].id;
    let selectedRegionId = regions[0].id;

    let value = selectedVersionId + "_" + selectedRegionId;

    if (globalThis.App.urlParameters.hasOwnProperty('version')) {
      const version = getVersionWithVersionID(globalThis.App.urlParameters.version);
      if (version !== null) {
        selectedVersionId = version.id;
      }
    }

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
    const VersionConfigs = globalThis.App.Config.sources.versions;
    const data = [];

    for (let i = 0, len = VersionConfigs.length; i < len; i += 1) {
      const versionConfig = VersionConfigs[i];
      data.push({
        value: versionConfig.id,
        text: versionConfig.title,
      });
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
    const selectedVersion = extendedTool.selectedVersionId;

    const VersionSelectTool = {
      extendedTool,
      valueField: 'value',
      displayField: 'text',
      store,
      width: block.width,
      editable: false,
      emptyText: 'Select a Version',
      value: selectedVersion,
      listeners: {
        change(combo) {
          const value = combo.getValue();
          const { versions } = globalThis.App.Config.sources;
          const selectedRegion = globalThis.App.Layers.getSelectedRegion();
          this.extendedTool.selectedVersionId = value;
          const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
          const version_region = value + "_" + selectedRegion;
          const layersConfig = this.extendedTool.layersConfigInstances[currentInstanceId][version_region];
          globalThis.App.Layers.setSelectedVersion(value);

          console.log("version_region after change", version_region);

          //console.log("selected region", selectedRegion);

          globalThis.App.Layers.setLayersConfigInstanceToId(currentInstanceId, layersConfig);

          // Sometimes the currentInstanceId does not match the instanceId on globalThis.App.Layers, this breaks the version change.
          globalThis.App.Layers.setConfigInstanceId(currentInstanceId);

          globalThis.App.Layers.createNewInstanceOfLayersConfig();

          globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED, layersConfig, null);

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