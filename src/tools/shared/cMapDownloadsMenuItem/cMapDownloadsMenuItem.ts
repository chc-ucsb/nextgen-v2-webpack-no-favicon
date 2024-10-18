import { getRegionWithRegionID } from '../../../utils';
import { buildUrlParams, toFilename } from '../../../helpers/string';
import { startDownloadOfImageURL } from '../../../helpers/network';

export const cMapDownloadsMenuItem = {
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

        //var includeBoundaries = blockConfig.includeBoundaries;
        //var overrideExtentWithFullExtent = blockConfig.overrideExtentWithFullExtent;

        let downloadUrl = '';

        let extension = '';
        if (format === 'image/geotiff') {
          extension = 'tiff';
        } else if (format === 'image/png') {
          extension = 'png';
        }

        // @ts-ignore
        const tempMask = new Ext.LoadMask(Ext.get(mapWindowBlock.component.id), {
          msg: 'Generating download ...',
        });
        tempMask.show();

        const windowJsonLayers = globalThis.App.Layers.query(layersConfig.overlays, {
          type: 'layer',
          display: true,
          mask: false,
          loadOnly: false,
        });

        if (windowJsonLayers.length == 0) return null;

        windowJsonLayers.sort(globalThis.App.OpenLayers.zIndexSortAscending);

        const layer = windowJsonLayers[windowJsonLayers.length - 1];

        const title = toFilename(globalThis.App.Layers.getTopLayerTitle(layersConfig.overlays));

        if (type === 'wcs') {
          const regionFolder = globalThis.App.Layers.query(layersConfig.overlays, function (folder) {
            if (folder.type !== 'folder' || !folder.hasOwnProperty('regionId')) return false;
            const displayedLayers = globalThis.App.Layers.query(folder.folder, {
              type: 'layer',
              display: true,
              mask: false,
              loadOnly: false,
            });

            if (displayedLayers.length > 0) return true;
            return false;
          });

          let region = globalThis.App.Config.sources.regions[0];
          if (regionFolder.length > 0) {
            const regionId = regionFolder[0].regionId;
            region = getRegionWithRegionID(regionId);
          }

          downloadUrl = layer.source.wcs;
          const wcsProxy = layer.source.wcs + globalThis.App.Config.proxies.WCSProxyURL;
          if (typeof wcsProxy === 'string' && wcsProxy !== '') {
            downloadUrl = buildUrlParams(wcsProxy, {
              layer: layer,
              region: region,
              currentExtent: globalThis.App.OpenLayers.getCurrentMapWindowExtent(openlayersMap),
            });
          } else {
            if (layer.hasOwnProperty('cqlFilter')) {
              const cqlFilter = [];
              for (let prop in layer.cqlFilter) {
                if (layer.cqlFilter[prop] !== null) cqlFilter.push(layer.cqlFilter[prop]);
              }
              downloadUrl += '?FILTER=' + cqlFilter.join(' AND ');
            }
          }
        } else if (type === 'wms') {
          downloadUrl = globalThis.App.OpenLayers.getDownloadURLofTopOverlay(
            layersConfig,
            openlayersMap,
            format,
            mapPanelBlock.component.getWidth(),
            mapPanelBlock.component.getHeight(),
            layer.style
          );
        }

        startDownloadOfImageURL(downloadUrl, type, format, title + '.' + extension, function () {
          tempMask.hide();
        });
      },
    };

    return menuItem;
  },
};
