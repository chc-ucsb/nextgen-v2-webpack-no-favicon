import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cTocTabPanel = {
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    let Tabs: Dict<any> = {
      extendedTool,
      xtype: 'tabpanel',
      layout: 'card',
      activeTab: 0,
      enableTabScroll: true,
      plain: true,
      items,
    };

    Tabs = addToolBarItems(block, Tabs, toolbar);

    return ExtJSPosition(Tabs, block);
  },
};
