export const cExternalLinkButtonTool = {
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const component = {
      extendedTool: extendedTool,
      xtype: 'button',
      //cls : 'x-btn-middle white-glyph',
      cls: 'x-btn-middle',
      //iconCls: "fa " + block.icon,
      tooltip: block.tooltip,
      tooltipType: 'title',
      width: block.width,
      height: block.height,
      text: block.text ? block.text : undefined,
      iconCls: undefined,
      handler: function () {
        window.open(this.extendedTool.owningBlock.blockConfig.url, '_blank');
      },
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    if (typeof block.text !== 'undefined') {
      component.text = block.text;
    } else {
      component.iconCls = 'fa ' + block.icon;
    }

    return component;
  },
};
