/** cMapDownloadsTool.js
 * Group tool for map download tools based on cMapPanel
 *
 * Required Tools:
 *      cMapPanel
 *      cMapWindow
 *
 * Block Parameters:
 *      Required:
 *          name: "cMapDownloadsTool" - The name of the tool.
 *          import: The location of the tools javascript code
 *              Ex: import": "tools.shared.cMapDownloadsTool.cMapDownloadsTool"
 *          add: Boolean - Indicates whether to load this tool or not
 *
 *      Optional:
 *          title:
 *          cssClass:
 *          tooltip: Message display when the cursor is positioned over the icon tool, if not defined "Save" is used.
 *
 */

export const cMapDownloadsTool = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const downloadMapImageBtn = {
      extendedTool: extendedTool,
      text: '',
      iconCls: 'fa fa-cog',
      tooltip: typeof block.tooltip !== 'undefined' ? block.tooltip : 'Save',
      tooltipType: 'title',
      //id : getRandomString(32, 36),
      cls: 'x-btn-text',
      menu: Ext.create('Ext.menu.Menu', {
        extendedTool: extendedTool,
        items: menu,
        listeners: {
          hide: function () {
            //refocus the mapwindow
            const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            const mapperWindow = mapWindowBlock.extendedTool;

            globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED, mapperWindow, mapperWindow);
          },
          show: function () {
            var mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            const mapperWindow = mapWindowBlock.extendedTool;

            const layersConfig = globalThis.App.Layers.getLayersConfigById(mapperWindow.layersConfigId);
            const topLayer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
            const exportable = topLayer.exportable;
            if (topLayer === false || exportable === false) {
              this.items.eachKey(function (key, item) {
                item.disable();
              });
            } else {
              this.items.eachKey(function (key, item) {
                item.enable();
              });
            }

            var mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
          },
        },
      }),
    };

    return downloadMapImageBtn;
  },
};
