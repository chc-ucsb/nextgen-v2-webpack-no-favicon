import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cMapWindowChartArea = {
  options: {
    events: ['collapse', 'expand'],
    delayRender: true,
    destroyIfEmpty: true,
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    let chartArea: Dict<any> = {
      extendedTool: extendedTool,
      collapsible: typeof block.collapsible !== 'undefined' ? block.collapsible : false,
      collapsed: typeof block.collapsed !== 'undefined' ? block.collapsed : false,
      collapseDirection: 'bottom',
      title: block.title,
      width: block.width,
      height: block.height,
      layout: 'fit',
      flex: 5,
      items: items,
      listeners: {
        collapse: function () {
          if (this.extendedTool.owningBlock.component.header)
            this.extendedTool.owningBlock.component.header.tools.find((x) => x.type == 'expand-top').el.dom.title = 'Expand';
          this.extendedTool.owningBlock.fire('collapse', this.extendedTool);
        },

        expand: function () {
          if (this.extendedTool.owningBlock.component.header)
            this.extendedTool.owningBlock.component.header.tools.find((x) => x.type == 'collapse-bottom').el.dom.title = 'Collapse';
          this.extendedTool.owningBlock.fire('expand', this.extendedTool);
        },
        afterrender: function () {
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.owningBlock.component = this;
          if (this.extendedTool.owningBlock.component.header)
            this.extendedTool.owningBlock.component.header.tools.forEach((element) => {
              element.el.dom.title = element.type[0].toUpperCase() + element.type.split('-')[0].slice(1);
            });
        },
        resize: function () {
          this.doLayout();
        },
      },
    };

    chartArea = addToolBarItems(block, chartArea, toolbar);
    return ExtJSPosition(chartArea, block);
  },
};
