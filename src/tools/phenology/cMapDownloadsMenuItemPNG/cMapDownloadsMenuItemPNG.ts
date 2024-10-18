import { getLegendURL, startDownloadOfImageURL, startDownloadOfImageURLWithLegend } from '../../../helpers/network';
import { toFilename } from '../../../helpers/string';

export const cMapDownloadsMenuItemPNG = {
  options: {
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const menuItem = {
      extendedTool: extendedTool,
      text: block.text,
      tooltip: block.tooltip ? block.tooltip : '',
      tooltipType: 'title',
      handler: function () {
        const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
        const mapperWindow = mapWindowBlock.extendedTool;
        const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');

        const blockConfig = this.extendedTool.owningBlock.blockConfig;
        const type = blockConfig.type;
        const format = blockConfig.format;
        const layersConfig = globalThis.App.Layers.getLayersConfigById(mapperWindow.layersConfigId);
        const openlayersMap = mapPanelBlock.component.map;

        const includeBoundaries = blockConfig.includeBoundaries;
        const overrideExtentWithFullExtent = blockConfig.overrideExtentWithFullExtent;

        // @ts-ignore
        const tempMask = new Ext.LoadMask(Ext.get(mapWindowBlock.component.id), {
          msg: 'Generating download ...',
        });
        tempMask.show();

        //--------------

        //var windowJsonLayers = getAllLayersIncludeOverlayIncludeBoundaryRequireDisplay(layersConfig, true, false, true);

        const windowJsonLayers = globalThis.App.Layers.query(
          layersConfig,
          {
            type: 'layer',
            display: true,
            mask: false,
            loadOnly: false,
          },
          ['overlays', 'boundaries']
        );

        if (windowJsonLayers.length === 0) return null;

        windowJsonLayers.sort(globalThis.App.OpenLayers.zIndexSortAscending);

        const layer = windowJsonLayers[0];

        const aURL = globalThis.App.OpenLayers.getDownloadURLOfMapImage(
          layersConfig,
          openlayersMap,
          'image/png',
          mapPanelBlock.component.getWidth(),
          mapPanelBlock.component.getHeight()
        );

        //To include just the overlay, remove boundaries from globalThis.App.Layers.query and use the below aURL
        //aURL = globalThis.App.OpenLayers.getDownloadURLOfJSONLayerObject(windowJsonLayers[0],openlayersMap,"image/png",mapPanelBlock.component.getWidth(),mapPanelBlock.component.getHeight());

        const title = toFilename(globalThis.App.Layers.getTopLayerTitle(layersConfig.overlays));

        const legendURL = getLegendURL(layer);

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
