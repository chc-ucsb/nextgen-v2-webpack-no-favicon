export const cRegionSelectorMenu = {
  options: {
    events: ['menushow'],
    requiredBlocks: ['cMapPanel', 'cMapWindow', 'cResetQuery', 'cRegionTool'],
  },
  createExtendedTool: function (owningBlock) {
    const extendedTool = {
      owningBlock: owningBlock,
      pressed: false,
      toggle: function (state) {
        if (state === true) {
          if (this.pressed === false) {
            const siblings = this.owningBlock.parent.childItems;
            let i = 0;
            const len = siblings.length;
            for (; i < len; i += 1) {
              const sibling = siblings[i];
              if (sibling.id === this.owningBlock.id) continue;
              if (sibling.component.enableToggle === true && sibling.component.pressed === true) {
                sibling.component.toggle(false);
              } else if (sibling.extendedTool.hasOwnProperty('toggle')) {
                sibling.extendedTool.toggle(false);
              }
            }

            this.pressed = true;
            this.component.addCls('selected-menu-btn');
          }
        } else if (this.pressed === true) {
          this.pressed = false;
          this.component.removeCls('selected-menu-btn');
        }
      },
    };

    const regionBlock = owningBlock.getReferencedBlock('cRegionTool');
    if (regionBlock !== null) {
      regionBlock.on(
        'regionSelected',
        function (callbackObj, postingObj) {
          const extendedTool = callbackObj;
          extendedTool.toggle(false);
        },
        extendedTool
      );
    }

    const resetQueryBlock = owningBlock.getReferencedBlock('cResetQuery');
    if (resetQueryBlock !== null) {
      resetQueryBlock.on(
        'click',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          extendedTool.toggle(false);
        },
        extendedTool
      );
    }

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const component = {
      extendedTool: extendedTool,
      xtype: 'button',
      text: '',
      iconCls: 'fa fa-aoi-list-select',
      tooltip: block.tooltip,
      tooltipType: 'title',
      width: block.width,
      height: block.height,
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
      menu: Ext.create('Ext.menu.Menu', {
        extendedTool: extendedTool,
        items: [
          {
            xtype: 'panel',
            style: 'padding: 0; margin: 0;',
            bodyStyle: 'padding: 0; margin: 0;',
            items: menu,
          },
        ],
        listeners: {
          hide: function () {
            //refocus the mapwindow
            const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            const mapperWindow = mapWindowBlock.extendedTool;

            globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED, mapperWindow, mapperWindow);
          },
          show: function () {
            this.extendedTool.toggle(true);
            const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
            this.extendedTool.owningBlock.fire('menushow', this.extendedTool);
          },
        },
      }),
    };

    return component;
  },
};
