export const cAddWMSLayerTool = {
  options: {
    requiredBlocks: ['cAddWMSLayerForm'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    let extjsButton = {
      extendedTool,
      xtype: 'button',
      text: block.text || '',
      id: 'btn-add-layer',
      cls: 'override mg5-r',
      iconCls: 'fa fa-add-wms',
      // glyph : 0xf055,
      marginLeft: 10,
      marginBottom: 10,
      tooltip: block.tooltip,
      tooltipType: 'title',
      handler: function () {
        if (!Ext.getCmp('addWmsLayerWindow')) {
          const addWMSLayerFormBlueprint = this.extendedTool.owningBlock.blueprint.getReferencedBlueprint('cAddWMSLayerForm');
          const formBlock = addWMSLayerFormBlueprint.createBlock();
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
