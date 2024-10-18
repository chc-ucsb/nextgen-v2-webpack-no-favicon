import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cTOCDesktopLike = {
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const position = block.block;
    const width = block.width;
    const height = block.height;
    const resizable = block.hasOwnProperty('resizable') ? block.resizable : true;

    let toc: Dict<any> = {
      id: 'toolsTOCLegendArea',
      //layout : 'fit',
      resizable: resizable,
      autoScroll: true,
      header: false,
      split: true,
      collapsible: typeof block.collapsible !== 'undefined' ? block.collapsible : false,
      collapsed: typeof block.collapsed !== 'undefined' ? block.collapsed : false,
      width: width,
      minHeight: 60,
      height: height,
      maxHeight: height,
      items: items,
      listeners: {
        resize: function () {
          //skin.toc.tocTabs.reFreshTabs();
        },
      },
    };

    toc = addToolBarItems(block, toc, toolbar);

    return ExtJSPosition(toc, block);
  },
};
