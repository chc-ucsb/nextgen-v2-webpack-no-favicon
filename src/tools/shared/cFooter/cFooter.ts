import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cFooter = {
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const position = block.block;
    const width = block.width;
    const height = block.height;

    const content = block.content;
    const resizable = block.hasOwnProperty('resizable') ? block.resizable : true;

    let component: Dict<any> = {
      extendedTool: extendedTool,
      items: items,
      menu: menu,
      resizable: resizable,
      layout: 'absolute',
      header: false,
      collapsible: typeof block.collapsible !== 'undefined' ? block.collapsible : false,
      collapsed: typeof block.collapsed !== 'undefined' ? block.collapsed : false,
      collapseMode: 'mini',
      bodyStyle: block.bodyStyle,
      split: true,
      minHeight: 60,
      height: height,
      maxHeight: height,
      html: content,
      listeners: {
        afterrender: function () {
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.owningBlock.component = this;
        },
      },
    };

    if (toolbar) component = addToolBarItems(block, component, toolbar);

    return ExtJSPosition(component, block);
  },
};
