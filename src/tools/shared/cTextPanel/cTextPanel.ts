import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cTextPanel = {
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const position = block.block;
    const width = block.width;
    const height = block.height;
    const content = block.content;

    let component: Dict<any> = {
      extendedTool: extendedTool,
      items: items,
      cls: block.cssClass,
      style: block.style,
      header: false,
      collapsible: typeof block.collapsible !== 'undefined' ? block.collapsible : false,
      collapsed: typeof block.collapsed !== 'undefined' ? block.collapsed : false,
      html: content,
      width: width,
      height: height,
      listeners: {
        afterrender: function () {
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.owningBlock.component = this;
        },
      },
    };

    component = addToolBarItems(block, component, toolbar);

    return ExtJSPosition(component, block);
  },
};
