import { getLegendURL } from '../../../helpers/network';
import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';

export const cMapLegend = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
    autoShow: false,
  },
  layersConfigUpdated: function (newLayerConfig, callbackObject, postingObject) {
    const mapPanelExtendedTool = callbackObject;
    const mapWindowBlock = mapPanelExtendedTool.owningBlock.getReferencedBlock('cMapWindow');
    const mapperWindow = mapWindowBlock.extendedTool;

    if (mapperWindow !== null && globalThis.App.Layers.getConfigInstanceId() == mapperWindow.layersConfigId) {
      mapPanelExtendedTool.updateLegendImage();
    }
  },
  createExtendedTool: function (owningBlock) {
    const extendedTool = {
      owningBlock: owningBlock,
      imageLoadCallback: function (mapperWindow, image, title) {
        const legendPanel = this.component;
        const mapWindowId = mapperWindow.component.getId();
        const mapWindowBodyEl = document.getElementById(mapWindowId + '-body');
        const maxHeight = parseInt(mapWindowBodyEl.style.height) - 20;
        legendPanel.update(
          '<div class="legend-title" id="legend-title">' + title + '</div>' + '<img id="' + legendPanel.getId() + '-image" src="' + image.src + '">'
        );
        if (image.height > maxHeight) {
          legendPanel.setAutoScroll(true);
          legendPanel.setHeight(maxHeight);
          var width = image.width + 20;
          legendPanel.setWidth(width);
        } else {
          legendPanel.setAutoScroll(false);
          //legendPanel.setHeight(image.height);
          var width = image.width;
          //legendPanel.setWidth(width);
        }

        legendPanel.updateLocation();
      },
      updateLegendImage: function () {
        const mapWindowBlock = this.owningBlock.getReferencedBlock('cMapWindow');
        const mapperWindow = mapWindowBlock.extendedTool;

        const layersConfig = globalThis.App.Layers.getLayersConfigById(mapperWindow.layersConfigId);
        //var windowJsonLayers = getAllLayersIncludeOverlayIncludeBoundaryRequireDisplay(layersConfig, true, false, false);
        const windowJsonLayers = globalThis.App.Layers.query(layersConfig.overlays, {
          type: 'layer',
          display: true,
          mask: false,
        });

        if (windowJsonLayers.length == 0) return;

        windowJsonLayers.sort(globalThis.App.OpenLayers.zIndexSortAscending);

        const layer = windowJsonLayers[0];

        let legendURL;
        if (
          layer.legend &&
          layer.legend.hasOwnProperty('customImageURL') &&
          layer.legend.customImageURL !== null &&
          layer.legend.customImageURL !== ''
        ) {
          legendURL = layer.legend.customImageURL;
        } else {
          legendURL = getLegendURL(layer);
        }

        if (legendURL == null) return;
        const image = new Image();
        image.src = legendURL;
        const title = layer.legend.title;
        const extendedTool = this;
        image.onload = function () {
          if (mapWindowBlock.rendered == true) {
            extendedTool.imageLoadCallback(mapWindowBlock.extendedTool, this, title);
          } else {
            const image = this;
            mapWindowBlock.on(
              'rendercomponent',
              function (callbackObj, postingObj, eventObj) {
                const extendedTool = callbackObj;
                const mapperWindow = postingObj;
                extendedTool.imageLoadCallback(mapperWindow, image, title);
              },
              extendedTool
            );
          }
        };
      },
    };

    var mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    var mapperWindow = mapWindowBlock.extendedTool;

    mapWindowBlock.on(
      'resize',
      function (callbackObj, postingObj, eventObj) {
        const extendedTool = callbackObj;
        const mapperWindow = postingObj;
        const mapWindowBodyEl = document.getElementById(mapperWindow.component.getId() + '-body');
        const maxHeight = parseInt(mapWindowBodyEl.style.height) - 40;
        const legendImage = document.getElementById(extendedTool.component.getId() + '-image');
        if (legendImage === null) return;
        // @ts-ignore
        const imageHeight = legendImage.height;
        if (maxHeight < imageHeight) {
          extendedTool.component.setAutoScroll(true);
          extendedTool.component.setHeight(maxHeight);
        } else {
          extendedTool.component.setAutoScroll(false);
          //extendedTool.component.setHeight(imageHeight);
        }
      },
      extendedTool
    );

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    let legendPanel = {
      extendedTool: extendedTool,
      xtype: 'panel',
      header: false,
      border: 0,
      constrain: true,
      html: '<img></img>',
      bodyStyle: 'border: none; border-radius:5px;',
      style: {
        borderWidth: '1px',
        borderStyle: 'solid',
        bottom: '5px',
        right: '5px',
      },
      //width: 30,
      //height: 100,
      closable: false,
      items: {
        border: false,
      },
      focusOnToFront: false,
      autoShow: true,
      hideMode: 'visibility',
      updateLocation: function () {
        const parent = this.extendedTool.owningBlock.parent;
        if (parent.rendered === true) {
          var parentComponent = parent.component;
          this.anchorTo(parentComponent.getEl(), 'br-br?', [-5, -5]);
          this.toFront(true);
        } else {
          parent.on(
            'rendercomponent',
            function (callbackObj, postingObj, eventObj) {
              const mapLegendComponent = callbackObj;
              const parentExtendedTool = postingObj;
              const parentComponent = parentExtendedTool.component;
              this.anchorTo(parentComponent.getEl(), 'br-br?', [-5, -5]);
              this.toFront(true);
            },
            this
          );
        }
      },
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;

          setTimeout(
            function (component) {
              const parentComponent = component.extendedTool.owningBlock.parent.component;
              component.extendedTool.updateLegendImage();
              component.updateLocation();

              const mapWindowBlock = component.extendedTool.owningBlock.getReferencedBlock('cMapWindow');

              mapWindowBlock.on(
                'move',
                function (legendPanel) {
                  if (legendPanel.active === true) {
                    legendPanel.updateLocation();
                  }
                },
                component
              );

              mapWindowBlock.on(
                'activate',
                function (legendPanel) {
                  if (legendPanel.active === true) {
                    legendPanel.updateLocation();
                  }
                },
                component
              );

              mapWindowBlock.on(
                'resize',
                function (legendPanel) {
                  if (legendPanel.active === true) {
                    legendPanel.updateLocation();
                  }
                },
                component
              );

              mapWindowBlock.on(
                'collapse',
                function (legendPanel) {
                  legendPanel.hide();
                },
                component
              );

              mapWindowBlock.on(
                'expand',
                function (legendPanel) {
                  if (legendPanel.active === true) {
                    legendPanel.show();
                    legendPanel.updateLocation();
                  }
                },
                component
              );

              mapWindowBlock.on(
                'close',
                function (legendPanel) {
                  legendPanel.close();
                },
                component
              );

              mapWindowBlock.on(
                'destroy',
                function (legendPanel) {
                  legendPanel.extendedTool.owningBlock.unRender();
                  legendPanel.extendedTool.owningBlock.remove();
                },
                component
              );

              if (component.extendedTool.owningBlock.itemDefinition.options.autoShow === false) {
                component.active = false;
                component.hide();
              } else {
                component.active = true;
              }
            },
            100,
            this
          );
        },
        beforedestroy: function () {
          globalThis.App.EventHandler.removeAllCallbacksForObject(this.extendedTool);
        },
        close: function () {
          this.extendedTool.owningBlock.remove();
        },
      },
    };

    legendPanel = Ext.create('Ext.panel.Panel', ExtJSPosition(legendPanel, block));

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
      extendedTool.owningBlock.itemDefinition.layersConfigUpdated,
      extendedTool
    );

    return legendPanel;
  },
};
