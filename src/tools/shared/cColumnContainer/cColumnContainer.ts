import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cColumnContainer = {
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const width = block.width;
    const height = block.height;
    const resizable = block.hasOwnProperty('resizable') ? block.resizable : true;
    let component: Dict<any> = {
      extendedTool: extendedTool,
      resizable: resizable,
      xtype: 'container',
      layout: {
        type: 'hbox',
        align: 'stretch',
        defaultMargins: {
          left: 10,
          right: 10,
          top: 10,
        },
      },
      padding: 10,
      width: width,
      height: height,
      items: items,
    };

    component = addToolBarItems(block, component, toolbar);
    return ExtJSPosition(component, block);
  },
};
