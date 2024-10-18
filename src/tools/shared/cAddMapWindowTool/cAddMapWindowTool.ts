export const cAddMapWindowTool = {
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const extjsButton = {
      extendedTool,
      text: 'New Map Window',
      xtype: 'button',
      cls: 'override mg5-r',
      iconCls: 'fa fa-plus-circle',
      tooltip: block.tooltip,
      tooltipType: 'title',
      handler() {
        globalThis.App.Layers.createNewInstanceOfLayersConfig();

        globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_REQUESTING_NEW_MAP_WINDOW, null, null);

        /*
                globalThis.App.EventHandler.postEvent(
                    globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED,
                    this.mapperWindow,
                    this.mapperWindow);
                */
      },
      listeners: {
        afterrender() {
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.owningBlock.component = this;
        },
      },
    };

    return extjsButton;
  },
};
