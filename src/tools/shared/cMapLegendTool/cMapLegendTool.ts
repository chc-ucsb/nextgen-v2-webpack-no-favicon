export const cMapLegendTool = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapLegend', 'cMapWindow'],
  },
  init: function (blueprint) {
    const mapLegendBlueprint = blueprint.getReferencedBlueprint('cMapLegend');

    if (mapLegendBlueprint) {
      if (!mapLegendBlueprint.itemDefinition.options) {
        mapLegendBlueprint.itemDefinition.options = {};
      }

      mapLegendBlueprint.itemDefinition.options.autoShow = blueprint.blockConfig.pressed;
    }
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const layerConfigId = globalThis.App.Layers.getConfigInstanceId();
    const button = {
      extendedTool: extendedTool,
      cls: 'x-btn-left legend-glyph',
      iconCls: 'fa fa-list-ul',
      id: `cMapLegendTool-${layerConfigId}`,
      tooltip: block.tooltip,
      tooltipType: 'title',
      enableToggle: true,
      pressed: block.pressed,
      listeners: {
        toggle: function () {
          const mapLegendBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapLegend');
          const legendPanel = mapLegendBlock.component;
          if (this.pressed == true) {
            legendPanel.show();
            legendPanel.active = true;
            legendPanel.updateLocation();
          } else {
            legendPanel.hide();
            legendPanel.active = false;
          }
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    return button;
  },
};
