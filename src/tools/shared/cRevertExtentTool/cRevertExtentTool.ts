import { getRandomString } from '../../../helpers/string';

export const cRevertExtentTool = {
  options: {
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
  },
  createExtendedTool: function (owningBlock) {
    const toolUniqueID = getRandomString(32, 36);

    const owningMapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const owningMapWindow = owningMapWindowBlock.extendedTool;

    const extendedTool = {
      owningBlock: owningBlock,
      extToolID: toolUniqueID,
      lastStoredExtentArray: new Array(),
      currentIndex: 0,
      updateOverflowMenu: function () {
        const toolbar = this.owningToolbar;
        const extendedTool = this;
        const component = this.component;
        if (toolbar) {
          const toolType = this.component.toolType;
          const menuItems = toolbar.layout.overflowHandler.menu.items.items;
          let i = 0;
          const len = menuItems.length;
          for (; i < len; i += 1) {
            const menuItem = menuItems[i];
            if (menuItem.toolType === toolType) {
              if (extendedTool.currentIndex > 1) {
                menuItem.setDisabled(false);
              } else {
                menuItem.setDisabled(true);
              }
              break;
            }
          }
        }
      },
      getReady: function () {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');

        mapPanelBlock.on(
          'rendercomponent',
          function (callbackObj, postingObj) {
            const extendedRevertExtentTool = callbackObj;
            const mapPanel = postingObj;

            const map = mapPanel.owningBlock.component.map;
            map.on('moveend', checknewextent);

            function checknewextent(evt) {
              const d = globalThis.App.OpenLayers.getCurrentMapWindowExtent(map);

              extendedRevertExtentTool.lastStoredExtentArray.push(d);

              extendedRevertExtentTool.currentIndex++;
              extendedRevertExtentTool.updateOverflowMenu();

              if (extendedRevertExtentTool.currentIndex > 1) {
                Ext.getCmp(extendedRevertExtentTool.extToolID).setDisabled(false);
              }
            }
          },
          this
        );
      },
    };

    owningMapWindowBlock.on(
      'overflowmenushow',
      function (extendedTool) {
        extendedTool.updateOverflowMenu();
      },
      extendedTool
    );

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const extRevertExtentTool = {
      extendedTool: extendedTool,
      xtype: 'button',
      cls: 'x-btn-left',
      iconCls: block.iconClass ? block.iconClass : 'previous-extent-button-icon',
      tooltip: block.tooltip,
      tooltipType: 'title',
      toolType: 'revertExtent',
      enableToggle: false,
      id: extendedTool.extToolID,
      disabled: true,
      pressed: false,
      handler: function () {
        const extendedTool = this.extendedTool;
        if (extendedTool.currentIndex > 1) {
          const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
          extendedTool.currentIndex = extendedTool.currentIndex - 2;
          globalThis.App.OpenLayers.setCurrentMapWindowExtentFromExtentThatIsAlreadyInCorrectProjection(
            extendedTool.lastStoredExtentArray[extendedTool.currentIndex],
            mapPanelBlock.component.map
          );
          extendedTool.lastStoredExtentArray.pop();
          extendedTool.lastStoredExtentArray.pop();
          extendedTool.updateOverflowMenu();
        }

        if (!(extendedTool.currentIndex > 1)) {
          this.setDisabled(true);
        }

        const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
        mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
      },
      listeners: {
        afterrender: function () {
          this.extendedTool.getReady();
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    return extRevertExtentTool;
  },
};
