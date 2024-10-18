import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cTocContainer = {
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const position = block.block;
    const width = block.width;
    const height = block.height;

    let contentsTab: Dict<any> = {
      extendedTool,
      items,
      width,
      height,
      autoScroll: true,
      maxHeight: height,
      title: block.title,
      listeners: {
        afterrender() {
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.owningBlock.component = this;
        },
      },
    };

    contentsTab = addToolBarItems(block, contentsTab, toolbar);

    return ExtJSPosition(contentsTab, block);
  },
};
