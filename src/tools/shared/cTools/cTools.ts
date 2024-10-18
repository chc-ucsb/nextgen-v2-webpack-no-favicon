import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';

export const cTools = {
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const position = block.block;
    const width = block.width;
    const height = block.height;
    const title = block.title;

    const tools = {
      extendedTool: extendedTool,
      id: 'cTools',
      layout: 'anchor',
      title: title,
      collapsible: typeof block.collapsible !== 'undefined' ? block.collapsible : false,
      collapsed: typeof block.collapsed !== 'undefined' ? block.collapsed : false,
      split: true,
      width: width,
      autoScroll: true,
      rendered: false,
      items: items,
      listeners: {
        afterrender: function (panel) {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
          this.rendered = true;
          const panelEl = document.getElementById(panel.id);
          panelEl.style.zIndex = '99999';
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.forEach((element) => {
              element.el.dom.title = element.type[0].toUpperCase() + element.type.split('-')[0].slice(1);
            });
          if (this.extendedTool.component.placeholder) {
            this.extendedTool.component.placeholder.el.dom.title = 'Preview';
            this.extendedTool.component.placeholder.tools.forEach((element) => {
              element.el.dom.title = element.type[0].toUpperCase() + element.type.split('-')[0].slice(1);
            });
          }
        },
      },
    };

    return ExtJSPosition(tools, block);
  },
};
