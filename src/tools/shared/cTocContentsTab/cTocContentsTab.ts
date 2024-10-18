import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cTocContentsTab = {
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const position = block.block;
    const width = block.width;
    const height = block.height;

    let contentsTab: Dict<any> = {
      extendedTool: extendedTool,
      layout: 'border',
      title: block.title,
      defaults: {
        split: true,
        bodyPadding: 0,
      },
      tabConfig: {
        title: block.title,
        tooltip: block.tooltip,
        tooltipType: 'title',
      },
      items: items,
      listeners: {
        afterrender: function () {
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
