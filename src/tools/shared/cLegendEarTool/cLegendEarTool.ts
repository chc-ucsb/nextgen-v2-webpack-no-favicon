import { getLegendURL } from '../../../helpers/network';

export const cLegendEarTool = {
  options: {
    requiredBlocks: ['cMapWindow'],
  },
  createExtendedTool(owningBlock) {
    const layersConfigId = globalThis.App.Layers.getConfigInstanceId();

    const legendEarTool = {
      owningBlock: owningBlock,
      layerId: layersConfigId,
      legendPanel: Ext.create('Ext.Window', {
        wrapper: this,
        active: false,
        header: false,
        border: 0,
        constrain: false,
        html: '<img></img>',
        bodyStyle: 'border: none; border-radius:5px;',
        style: {
          borderWidth: '1px',
          borderStyle: 'solid',
        },
        closable: false,
        items: {
          border: false,
        },
        updateLocation() {
          const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
          const mapperWindow = mapWindowBlock.extendedTool;
          const mapWindow = mapperWindow.component;

          const x = mapWindow.getX();
          const y = mapWindow.getY();
          const height = mapWindow.getHeight();
          const width = mapWindow.getWidth();
          this.setPosition(x + width + 10, y + 35);
        },
      }),
      updateLegendImage() {
        const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
        const mapperWindow = mapWindowBlock.extendedTool;

        const layersConfig = globalThis.App.Layers.getLayersConfigById(mapperWindow.layersConfigId);
        // const windowJsonLayers = getAllLayersIncludeOverlayIncludeBoundaryRequireDisplay(layersConfig, true, false, true);
        const windowJsonLayers = globalThis.App.Layers.query(layersConfig.overlays, {
          type: 'layer',
          display: true,
          mask: false,
        });

        if (windowJsonLayers.length == 0) return;

        windowJsonLayers.sort(globalThis.App.OpenLayers.zIndexSortAscending);

        const layer = windowJsonLayers[windowJsonLayers.length - 1];

        const legendURL = getLegendURL(layer);

        if (legendURL == null) return;

        const image = new Image();
        image.src = legendURL;
        const legendPanel = this.legendPanel;
        image.onload = function () {
          legendPanel.update('<img src="' + this['src'] + '" alt="">');

          legendPanel.setHeight(this['height']);
          legendPanel.setWidth(this['width']);
        };
      },
      layersConfigUpdated(newLayerConfig, receiver, postingObject) {
        if (globalThis.App.Layers.getConfigInstanceId() == receiver.layerId) {
          receiver.updateLegendImage();
        }
      },
    };

    legendEarTool.legendPanel.show();
    legendEarTool.legendPanel.hide();

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
      legendEarTool.layersConfigUpdated,
      legendEarTool
    );

    return legendEarTool;
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const legendEarBtn = {
      extendedTool: extendedTool,
      cls: 'x-btn-left legend-glyph',
      iconCls: 'fa fa-list-ul',
      tooltip: 'Toggle map legend',
      tooltipType: 'title',
      enableToggle: true,
      pressed: false,
      listeners: {
        toggle() {
          const legend = this.extendedTool.legendPanel;
          if (this.pressed == true) {
            legend.show();
            legend.active = true;
            legend.updateLocation();
            const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
            extendedTool.updateLegendImage();
          } else {
            legend.hide();
            legend.active = false;
            extendedTool.updateLegendImage();
          }
        },
        afterrender() {
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    extendedTool.updateLegendImage();
    return legendEarBtn;
  },
};
