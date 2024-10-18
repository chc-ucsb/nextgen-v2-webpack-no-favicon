import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';

export const cTabPanel = {
  options: {
    destroyIfEmpty: true,
  },
  addChild: function (component, child) {
    component.add(child);
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const tabPanel = ExtJSPosition(
      {
        extendedTool: extendedTool,
        xtype: 'tabpanel',
        DeferredRender: false,
        layout: 'card',
        autoRender: false,
        autoShow: false,
        defaults: {},
        closable: false,
        activeTab: 0,
        items: items,
        listeners: {
          afterrender: function () {
            this.extendedTool.owningBlock.rendered = true;
            this.extendedTool.owningBlock.component = this;
          },
        },
      },
      block
    );

    return tabPanel;
  },
};
