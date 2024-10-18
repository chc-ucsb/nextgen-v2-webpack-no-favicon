import { getRegionWithRegionID } from '../../../utils';
import { buildUrlParams, toFilename } from '../../../helpers/string';
import { startDownloadOfImageURL } from '../../../helpers/network';

export const cMapDownloadsMenuItemRAWFullExtent = {
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
        console.log(mapperWindow);
        var layersConfig = globalThis.App.Layers.getLayersConfigById(mapperWindow.layersConfigId);
        var openlayersMap = mapPanelBlock.component.map;

        var includeBoundaries = blockConfig.includeBoundaries;
        var overrideExtentWithFullExtent = blockConfig.overrideExtentWithFullExtent;

        var downloadUrl = '';

        var extension = '';
        if (format === 'image/geotiff') {
          extension = 'tiff';
        } else if (format === 'image/png') {
          extension = 'png';
        }

        // @ts-ignore
        var tempMask = new Ext.LoadMask(Ext.get(mapWindowBlock.component.id), {
          msg: 'Generating download ...',
        });
        tempMask.show();

        var windowJsonLayers = globalThis.App.Layers.query(layersConfig.overlays, {
          type: 'layer',
          display: true,
          mask: false,
          loadOnly: false,
        });

        if (windowJsonLayers.length == 0) return null;

        windowJsonLayers.sort(globalThis.App.OpenLayers.zIndexSortAscending);

        var layer = windowJsonLayers[windowJsonLayers.length - 1];

        var title = toFilename(globalThis.App.Layers.getTopLayerTitle(layersConfig.overlays));

        var region;

        if (type === 'wcs') {
          var regionFolder = globalThis.App.Layers.query(layersConfig.overlays, function (folder) {
            if (folder.type !== 'folder' || !folder.hasOwnProperty('regionId')) return false;
            var displayedLayers = globalThis.App.Layers.query(folder.folder, {
              type: 'layer',
              display: true,
              mask: false,
              loadOnly: false,
            });

            if (displayedLayers.length > 0) return true;
            return false;
          });

          region = globalThis.App.Config.sources.regions[0];
          if (regionFolder.length > 0) {
            var regionId = regionFolder[0].regionId;
            region = getRegionWithRegionID(regionId);
          }

          downloadUrl = layer.source.wcs;
          var wcsProxy2 = downloadUrl + globalThis.App.Config.proxies.WCSProxyURL2;
          if (typeof wcsProxy2 === 'string' && wcsProxy2 !== '') {
            downloadUrl = buildUrlParams(wcsProxy2, {
              layer: layer,
              region: region,
              //currentExtent: globalThis.App.OpenLayers.getCurrentMapWindowExtent(openlayersMap)
              currentExtent: region.bbox,
            });
          }
        }

        startDownloadOfImageURL(downloadUrl, type, format, title + '.' + extension, function () {
          tempMask.hide();
        });
      },
    };

    return menuItem;
  },
};

export var toolName = 'cMapDownloadsMenuItemRAWFullExtent';
export var tool = cMapDownloadsMenuItemRAWFullExtent;
