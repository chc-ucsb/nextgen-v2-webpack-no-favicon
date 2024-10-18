export const cClipNShipBtn = {
  options: {
    requiredBlocks: ['cClipNShip'],
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const component = {
      extendedTool: extendedTool,
      xtype: 'button',
      tooltip: block.tooltip,
      tooltipType: 'title',
      iconCls: 'fa fa-crop',
      handler: function () {
        const clipNShipPanel = this.extendedTool.owningBlock.getReferencedBlock('cClipNShip');
        clipNShipPanel.extendedTool.openAndEnable();
      },
    };

    return component;
  },
};
