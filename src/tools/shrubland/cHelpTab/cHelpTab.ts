import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cHelpTab = {
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const position = block.block;
    const { width } = block;
    const { height } = block;

    let helpTab: Dict<any> = {
      extendedTool,
      layout: 'anchor',
      title: block.title,
      autoScroll: true,
      scrollable: true,
      defaults: {
        split: true,
        bodyPadding: 0,
      },
      items: [
        {
          items: items[0][0],
        },
        {
          items: items[0][1],
        },
      ],
      listeners: {
        afterrender() {
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    helpTab = addToolBarItems(block, helpTab, toolbar);

    return ExtJSPosition(helpTab, block);
  },
};
