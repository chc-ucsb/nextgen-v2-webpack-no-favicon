import { LayerConfig } from '../../../@types';
import { getRandomString } from '../../../helpers/string';

export const cLayerRadioButtons = {
  options: {
    events: ['select'],
  },
  createExtendedTool: function (owningBlock) {
    const extendedTool = {
      owningBlock: owningBlock,
      toolUniqueID: getRandomString(32, 36),
      radioName: getRandomString(32, 36),
      selectedValue: null,
    };

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const radioButtons = [];
    const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
    const layerMapping: Array<LayerConfig> = block.layers;
    const layers = [];

    for (var i = 0, len = layerMapping.length; i < len; i += 1) {
      const layerMap = layerMapping[i];
      var layer = globalThis.App.Layers.query(
        layersConfig,
        {
          type: 'layer',
          mask: false,
          id: layerMap.id,
        },
        ['overlays', 'boundaries']
      );

      if (layer.length > 0) layers.push(layer[0]);
    }

    for (var i = 0, len = layers.length; i < len; i += 1) {
      var layer = layers[i];
      radioButtons.push({
        extendedTool: extendedTool,
        boxLabel: layer.title,
        name: extendedTool.radioName,
        inputValue: layer.id,
        style: 'white-space: nowrap;',
        listeners: {
          afterrender: function () {
            // Component returned from this tool will be an array of components.
            if (!this.extendedTool.hasOwnProperty('component')) {
              this.extendedTool.component = [];
              this.extendedTool.owningBlock.component = [];
              this.extendedTool.owningBlock.rendered = true;
            }

            this.extendedTool.component.push(this);
            this.extendedTool.owningBlock.component.push(this);
            if (this.extendedTool.selectedValue === this.inputValue) {
              this.suspendEvents();
              this.setValue(true);
              this.resumeEvents();
              this.extendedTool.owningBlock.fire('select', this.extendedTool);
            }
          },
          change: function (checkbox, checked) {
            if (checked === true) {
              const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

              const boundary = globalThis.App.Layers.query(
                layersConfig,
                {
                  type: 'layer',
                  id: this.inputValue,
                },
                ['overlays', 'boundaries']
              )[0];

              if (boundary.display === false) {
                boundary.display = true;

                globalThis.App.EventHandler.postEvent(
                  globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
                  layersConfig,
                  globalThis.App.Layers.layersConfig
                );

                globalThis.App.EventHandler.postEvent(
                  globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED,
                  layersConfig,
                  globalThis.App.Layers.layersConfig
                );
              }

              this.extendedTool.radioGroup.active = true;
              this.extendedTool.selectedValue = this.inputValue;
              this.extendedTool.owningBlock.fire('select', this.extendedTool);
              const relatedBlueprints = this.extendedTool.owningBlock.blueprint.relatedBlockBlueprints;

              let i = 0;
              const len = relatedBlueprints.length;
              for (; i < len; i += 1) {
                const blueprint = relatedBlueprints[i];
                if (blueprint.block === null) continue;
                if (blueprint.block.rendered === false) {
                  blueprint.block.extendedTool.selectedValue = this.inputValue;
                  continue;
                }
                blueprint.block.extendedTool.radioGroup.active = false;
                const relatedComponent = blueprint.block.extendedTool.component;
                let hasValue = false;

                let j = 0;
                const length = relatedComponent.length;
                for (; j < length; j += 1) {
                  relatedComponent[j].suspendEvents();

                  if (relatedComponent[j].inputValue === this.inputValue) {
                    relatedComponent[j].setValue(true);
                    hasValue = true;
                    blueprint.block.extendedTool.selectedValue = relatedComponent[j].inputValue;
                  } else {
                    relatedComponent[j].setValue(false);
                  }

                  relatedComponent[j].resumeEvents();
                }

                if (hasValue === false) {
                  blueprint.block.extendedTool.selectedValue = null;
                }

                blueprint.block.fire('select', blueprint.block.extendedTool);
              }
            }
          },
        },
      });
    }

    return radioButtons;
  },
};
