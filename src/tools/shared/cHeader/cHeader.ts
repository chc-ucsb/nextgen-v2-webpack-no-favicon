import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cHeader = {
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const position = block.block;
    const width = block.width;
    const height = block.height;
    const { content } = block;
    const resizable = Object.prototype.hasOwnProperty.call(block, 'resizable') ? block.resizable : true;

    let header: Dict<any> = {
      extendedTool,
      items,
      menu,
      resizable,
      layout: 'absolute',
      header: false,
      collapsible: Object.prototype.hasOwnProperty.call(block, 'collapsible') ? block.collapsible : false,
      collapsed: Object.prototype.hasOwnProperty.call(block, 'collapsed') ? block.collapsed : false,
      collapseMode: 'mini',
      bodyStyle: block.bodyStyle,
      split: true,
      splitterResize: false,
      minHeight: 60,
      height,
      maxHeight: height,
      html: content,
      listeners: {
        afterrender() {
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.owningBlock.component = this;
        },
      },
    };

    if (toolbar) header = addToolBarItems(block, header, toolbar);

    return ExtJSPosition(header, block);
  },
};
