import { getLegendURL } from '../../../helpers/network';
import { buildUrl } from '../../../helpers/string';
import { objPropExists } from '../../../helpers/object';
import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { LayerConfig } from '../../../@types';
import { query } from '../../../helpers/array';

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
      imageLoadCallback: function (mapperWindow, image) {
        const legendPanel = this.component;
        const mapWindowId = mapperWindow.component.getId();
        const mapWindowBodyEl = document.getElementById(mapWindowId + '-body');
        const maxHeight = parseInt(mapWindowBodyEl.style.height) - 20;
        const cMapLegendTool = Ext.getCmp(`cMapLegendTool-${globalThis.App.Layers.getConfigInstanceId()}`);
        let imageHeight, html;
        if (image.height) {
          imageHeight = image.height;
          html = '<img id="' + legendPanel.getId() + '-image" src="' + image.src + '">';
        }

        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const layers = globalThis.App.Layers.query(
          layersConfig,
          {
            type: 'layer',
            display: true,
            mask: false,
            loadOnly: false,
          },
          ['overlays', 'hidden', 'boundaries']
        );

        let legendTitleHtml = '';
        // check if we have active layers and make sure they have legend property
        // otherwise disbale the CMapLegendTool
        if (layers.length > 0 && layers[0].legend !== undefined) {
          cMapLegendTool.enable();
          if (layers[0]?.legend?.panelTitle) {
            imageHeight += 30;
            legendTitleHtml += `<div class="legend-title" id="legend-title">${layers[0]?.legend?.title}</div>`;
          } else if (layers[0]?.unit) {
            imageHeight += 30;
            legendTitleHtml += `<div class="legend-title" id="legend-title">(${layers[0]?.unit})</div>`;
          }
        } else {
          cMapLegendTool.disable();
        }

        // if (layers.length > 0 && layers[0].unit) {
        //   imageHeight += 10;
        //   html = `<p style="margin:0;text-align:center;">(${layers[0].unit})</p>${html}`;
        // }

        legendPanel.update(`${legendTitleHtml}${html}`);
        if (imageHeight > maxHeight) {
          legendPanel.setAutoScroll(true);
          legendPanel.setHeight(maxHeight);
          var width = image.width + 20;
          legendPanel.setWidth(width);
        } else {
          legendPanel.setAutoScroll(false);
          legendPanel.setHeight(imageHeight);
          var width = image.width + 10;
          legendPanel.setWidth(width);
        }

        // legendPanel.setWidth(image.width);
        legendPanel.updateLocation();
      },
      updateLegendImage: async function () {
        const mapWindowBlock = this.owningBlock.getReferencedBlock('cMapWindow');
        const block = this.owningBlock.blockConfig;
        const mapperWindow = mapWindowBlock.extendedTool;
        const extendedTool = this;
        const layersConfig = globalThis.App.Layers.getLayersConfigById(mapperWindow.layersConfigId);
        //var windowJsonLayers =
        // getAllLayersIncludeOverlayIncludeBoundaryRequireDisplay(layersConfig, true, false,
        // false);
        const windowJsonLayers = globalThis.App.Layers.query(
          layersConfig,
          {
            type: 'layer',
            display: true,
          },
          ['overlays', 'hidden', 'boundaries']
        );

        const noLegendLayer = windowJsonLayers.find((layer) => layer.legend === undefined);
        // check if there are no layers selected. If that is the case then we do need the legend tool activated.
        if (windowJsonLayers.length == 0) {
          extendedTool.imageLoadCallback(mapWindowBlock.extendedTool, this);
          return;
          // this check is for making sure that we dont call `imageLoadCallBack` if the dataset layer and a layer which does not have legend is selected.
          // we need to continue creating the legend for the datasets layers
        } else if (noLegendLayer !== undefined && windowJsonLayers.length === 0) {
          extendedTool.imageLoadCallback(mapWindowBlock.extendedTool, this);
          return;
        }
        // this check is to make sure that we do not create legends for layers that don't have a legend.
        else if (windowJsonLayers[0]?.legend === undefined) {
          extendedTool.imageLoadCallback(mapWindowBlock.extendedTool, this);
          return;
        }

        windowJsonLayers.sort(globalThis.App.OpenLayers.zIndexSortAscending);
        const cMapLegendTool = Ext.getCmp(`cMapLegendTool-${globalThis.App.Layers.getConfigInstanceId()}`);
        if (cMapLegendTool.isDisabled()) cMapLegendTool.enable();

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
          var default_options = {
            fontStyle: 'normal',
            fontColor: '000000',
            fontSize: 13,
            absoluteMargins: true,
            labelMargin: 5,
            dx: 10.0,
            dy: 0.2,
            mx: 0.2,
            my: 0.2,
          };

          if (block?.legend?.[0]) {
            const overrides = Object.entries(block.legend[0]);
            overrides.forEach((entry) => {
              const name = entry[0];
              default_options[name] = entry[1];
            });
          }

          const default_entries = Object.entries(default_options);
          var options_str = '';

          default_entries.forEach((element) => {
            options_str += element[0] + ':' + element[1] + ';';
          });

          var layerName;
          if (objPropExists(layer, 'wmstName')) {
            layerName = layer.wmstName;
          } else {
            layerName = layer.name;
          }

          const params = {
            REQUEST: 'GetLegendGraphic',
            VERSION: '1.0.0',
            FORMAT: 'image/png',
            LAYER: layerName,
            STYLE: layer?.legend?.style ?? '',
            WIDTH: 20,
            HEIGHT: 17,
            LEGEND_OPTIONS: options_str,
          };

          legendURL = buildUrl(layer.source.wms, params);
        }

        if (legendURL == null) {
          return;
        }

        const image = new Image();

        let res = await fetch(legendURL);

        // Only check for the inclusion of image/png because the Content-Type could have more set to the header.
        if (!res.headers.get('Content-Type').includes('image/png')) {
          this.component.hide();
        } else {
          let blob = await res.blob();
          image.src = URL.createObjectURL(blob);
        }

        // image.src = legendURL;

        image.onload = function () {
          if (mapWindowBlock.rendered == true) {
            extendedTool.imageLoadCallback(mapWindowBlock.extendedTool, this);
          } else {
            const image = this;
            mapWindowBlock.on(
              'rendercomponent',
              function (callbackObj, postingObj, eventObj) {
                const extendedTool = callbackObj;
                const mapperWindow = postingObj;
                extendedTool.imageLoadCallback(mapperWindow, image);
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
        const maxHeight = parseInt(mapWindowBodyEl.style.height) - 20;
        const legendImage = document.getElementById(extendedTool.component.getId() + '-image') as HTMLImageElement;
        if (legendImage === null) return;
        const imageHeight = legendImage.height;
        if (maxHeight < imageHeight) {
          extendedTool.component.setAutoScroll(true);
          extendedTool.component.setHeight(maxHeight);
        } else {
          extendedTool.component.setAutoScroll(false);
          extendedTool.component.setHeight(imageHeight);
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
      width: 30,
      height: 100,
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
