import { getLegendURL, startDownloadOfImageURL, startDownloadOfImageURLWithLegend } from '../../../helpers/network';
import { toFilename } from '../../../helpers/string';

export const cMapDownloadsMenuItemPNG = {
  options: {
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    var block = extendedTool.owningBlock.blockConfig;

    var menuItem = {
      extendedTool: extendedTool,
      text: block.text,
      handler: function () {
        var mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
        var mapperWindow = mapWindowBlock.extendedTool;
        var mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');

        var blockConfig = this.extendedTool.owningBlock.blockConfig;
        var type = blockConfig.type;
        var format = blockConfig.format;
        var layersConfig = globalThis.App.Layers.getLayersConfigById(mapperWindow.layersConfigId);
        var openlayersMap = mapPanelBlock.component.map;

        var includeBoundaries = blockConfig.includeBoundaries;
        var overrideExtentWithFullExtent = blockConfig.overrideExtentWithFullExtent;

        // @ts-ignore
        var tempMask = new Ext.LoadMask(Ext.get(mapWindowBlock.component.id), {
          msg: 'Generating download ...',
        });
        tempMask.show();

        //--------------

        //var windowJsonLayers = getAllLayersIncludeOverlayIncludeBoundaryRequireDisplay(layersConfig, true, false, true);

        var windowJsonLayers = globalThis.App.Layers.query(
          layersConfig,
          {
            type: 'layer',
            display: true,
            mask: false,
            loadOnly: false,
          },
          ['overlays', 'boundaries']
        );

        if (windowJsonLayers.length == 0) return null;

        windowJsonLayers.sort(globalThis.App.OpenLayers.zIndexSortAscending);

        var layer = windowJsonLayers[windowJsonLayers.length - 1];

        var aURL = globalThis.App.OpenLayers.getDownloadURLOfMapImage(
          layersConfig,
          openlayersMap,
          'image/png',
          mapPanelBlock.component.getWidth(),
          mapPanelBlock.component.getHeight()
        );

        var title = toFilename(globalThis.App.Layers.getTopLayerTitle(layersConfig.overlays));

        var legendURL = getLegendURL(layer);

        if (legendURL === null) {
          startDownloadOfImageURL(aURL, type, 'image/png', title + '.png', function () {
            tempMask.hide();
          });
        } else {
          startDownloadOfImageURLWithLegend(aURL, type, legendURL, 'image/png', title + '.png', function () {
            tempMask.hide();
          });
        }
      },
    };

    return menuItem;
  },
};
