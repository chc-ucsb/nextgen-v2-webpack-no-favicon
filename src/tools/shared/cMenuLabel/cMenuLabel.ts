export const cMenuLabel = {
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    return {
      extendedTool: extendedTool,
      xtype: 'tbtext',
      text: block.label,
      style: { marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };
  },
};
