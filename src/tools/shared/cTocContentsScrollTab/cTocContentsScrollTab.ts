import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cTocContentsScrollTab = {
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const position = block.block;
    const { width } = block;
    const { height } = block;

    let contentsTab: Dict<any> = {
      extendedTool,
      layout: 'anchor',
      title: block.title,
      autoScroll: true,
      scrollable: true,
      defaults: {
        split: true,
        bodyPadding: 0,
      },
      items,
      listeners: {
        afterrender() {
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    contentsTab = addToolBarItems(block, contentsTab, toolbar);

    return ExtJSPosition(contentsTab, block);
  },
};
