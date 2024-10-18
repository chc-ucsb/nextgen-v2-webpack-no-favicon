export const cMapDownloadsTool = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    var block = extendedTool.owningBlock.blockConfig;

    var downloadMapImageBtn = {
      extendedTool: extendedTool,
      text: '',
      iconCls: 'fa fa-cog',
      tooltip: 'Save',
      tooltipType: 'title',
      //id : getRandomString(32, 36),
      cls: 'x-btn-text',
      menu: Ext.create('Ext.menu.Menu', {
        extendedTool: extendedTool,
        items: menu,
        listeners: {
          hide: function () {
            //refocus the mapwindow
            var mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            var mapperWindow = mapWindowBlock.extendedTool;

            globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED, mapperWindow, mapperWindow);
          },
          show: function () {
            var mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            var mapperWindow = mapWindowBlock.extendedTool;

            var layersConfig = globalThis.App.Layers.getLayersConfigById(mapperWindow.layersConfigId);
            var topLayer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
            if (topLayer === false) {
              this.items.eachKey(function (key, item) {
                item.disable();
              });
            } else {
              this.items.eachKey(function (key, item) {
                item.enable();
              });
            }

            //---------------------------HACK FOR QDRI DEADLINE

            var windowJsonLayers = globalThis.App.Layers.query(
              layersConfig,
              {
                type: 'layer',
                display: true,
                mask: false,
              },
              ['overlays']
            );

            for (var layerIndex = 0, len = windowJsonLayers.length; layerIndex < len; layerIndex += 1) {
              var layer = windowJsonLayers[windowJsonLayers.length - 1 - layerIndex];

              if (layer.name == 'usdm_current') {
                this.items.eachKey(function (key, item) {
                  item.disable();
                });
              }
            }

            //------------------------------------------------------------------>

            var mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
          },
        },
      }),
    };

    return downloadMapImageBtn;
  },
};
