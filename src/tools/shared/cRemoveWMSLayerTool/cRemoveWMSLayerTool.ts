export const cRemoveWMSLayerTool = {
  options: {
    requiredBlocks: ['cRemoveWMSLayerForm'],
  },
  createExtendedTool(owningBlock) {
    return {
      owningBlock,
    };
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const extjsButton = {
      extendedTool,
      text: block.text || '',
      xtype: 'button',
      id: 'btn-remove-layer',
      cls: 'override mg5-r',
      iconCls: 'fa fa-remove-wms ',
      // glyph : 0xf056,
      marginLeft: 10,
      marginBottom: 10,
      tooltip: block.tooltip,
      tooltipType: 'title',
      handler() {
        if (!Ext.getCmp('removeWmsLayerWindow')) {
          const removeWMSLayerFormBlueprint = this.extendedTool.owningBlock.blueprint.getReferencedBlueprint('cRemoveWMSLayerForm');
          const formBlock = removeWMSLayerFormBlueprint.createBlock();
          const renderedParent = formBlock.getClosestRenderedParent();
          renderedParent.render();
        }
      },
      listeners: {
        afterrender() {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    return extjsButton;
  },
};
