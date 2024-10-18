export const cTransparency = {
  options: {
    requiredBlocks: ['cDefaultToc', 'cLayersToc'],
  },
  setNewLayerSelection(callbackObj, postingObj, eventObj) {
    const extendedTool = callbackObj;
    const layerId = eventObj;
    const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
    const layers = globalThis.App.Layers.query(
      layersConfig,
      {
        type: 'layer',
        id: layerId,
        transparency: true,
      },
      ['overlays', 'boundaries', 'baselayers', 'additional', 'hidden']
    );

    if (layers.length > 0) {
      const layer = layers[0];
      if (!Object.prototype.hasOwnProperty.call(layer, 'opacity')) {
        layer.opacity = 100;
      }
      extendedTool.layerId = layerId;
      extendedTool.component.setValue(layer.opacity * 100);
      extendedTool.component.setDisabled(false);
    } else {
      extendedTool.layerId = null;
      extendedTool.component.setValue(100);
      extendedTool.component.setDisabled(true);
    }
  },
  createExtendedTool(owningBlock) {
    const extendedTool = {
      owningBlock,
      layerId: null,
    };

    const defaultTocBlock = owningBlock.getReferencedBlock('cDefaultToc');
    if (defaultTocBlock !== null) {
      defaultTocBlock.on('recordselected', owningBlock.itemDefinition.setNewLayerSelection, extendedTool);
    }

    const layersTocBlock = owningBlock.getReferencedBlock('cLayersToc');
    if (layersTocBlock !== null) {
      layersTocBlock.on('recordselected', owningBlock.itemDefinition.setNewLayerSelection, extendedTool);
    }

    return extendedTool;
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const slider = Ext.create('Ext.slider.Single', {
      extendedTool,
      height: block.height,
      style: {
        marginLeft: '10px',
        marginRight: '10px',
        marginBottom: '10px',
      },
      disabled: true,
      value: 100,
      width: block.width,
      increment: 5,
      minValue: 0,
      maxValue: 100,
      labelAlign: 'top',
      fieldLabel: typeof block.fieldLabel !== 'undefined' ? block.fieldLabel : 'Layer Transparency(Highlight Layer):',
      listeners: {
        changecomplete(slider, newValue, thumb, eOpts) {
          globalThis.App.Layers.setLayerOpacity(this.extendedTool.layerId, newValue / 100);
        },
        change(slider, newValue, thumb, eOpts) {
          globalThis.App.Layers.setLayerOpacity(this.extendedTool.layerId, newValue / 100);
        },
        afterrender() {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    });

    return slider;
  },
};
