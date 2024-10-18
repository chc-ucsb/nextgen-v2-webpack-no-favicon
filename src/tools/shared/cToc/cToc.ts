import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cToc = {
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const position = block.block;
    const width = block.width;
    const height = block.height;

    let toc: Dict<any> = {
      extendedTool: extendedTool,
      id: 'toolsTOCLegendArea',
      layout: 'fit',
      header: false,
      split: true,
      collapsible: typeof block.collapsible !== 'undefined' ? block.collapsible : false,
      collapsed: typeof block.collapsed !== 'undefined' ? block.collapsed : false,
      collapseMode: 'mini',
      width: width,
      minHeight: 60,
      height: height,
      maxHeight: height,
      items: items,
      listeners: {
        resize: function () {
          //skin.toc.tocTabs.reFreshTabs();
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    toc = addToolBarItems(block, toc, toolbar);

    return ExtJSPosition(toc, block);
  },
};
