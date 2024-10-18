import { getRandomString } from '../../../helpers/string';

export const cChartToolsMenu = {
  options: {
    requiredBlocks: ['cChartContainer'],
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    var _menu = {
      extendedTool: extendedTool,
      height: block.height,
      width: block.width,
      iconCls: 'fa fa-cog',
      tooltip: block.tooltip,
      tooltipType: 'title',
      id: getRandomString(32, 36),
      cls: 'x-btn-text-icon',
      menu: Ext.create('Ext.menu.Menu', {
        items: menu,
      }),
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    return _menu;
  },
};
