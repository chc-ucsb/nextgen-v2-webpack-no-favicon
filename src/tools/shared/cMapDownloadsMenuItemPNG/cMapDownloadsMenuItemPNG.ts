import { logger } from '../../../utils';
import { compositeBlobs, getLegendURL, startDownloadOfImageURL, startDownloadOfImageURLWithLegend } from '../../../helpers/network';
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
          msg: typeof block.progressMessage !== 'undefined' ? block.progressMessage : 'Generating download ...',
        });
        tempMask.show();

        //so the whole thing here
        //is we need to get separate getMapRequests for each layer
        //the reason is because the layers are all on different servers
        //so we cannot make a request to one server with all of the layers
        //that we want
        //instead we have to make requests to each server
        //then composite the images by ourselves into one image for download

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

        if (windowJsonLayers.length == 0) return null;

        windowJsonLayers.sort(globalThis.App.OpenLayers.zIndexSortAscending);

        var layer = windowJsonLayers[0];
        var legendURL = getLegendURL(layer);
        // var aURL = globalThis.App.OpenLayers.getDownloadURLOfMapImage(
        //   layersConfig,
        //   openlayersMap,
        //   'image/png',
        //   mapPanelBlock.component.getWidth(),
        //   mapPanelBlock.component.getHeight()
        // );
        //
        // var title = toFilename(globalThis.App.Layers.getTopLayerTitle(layersConfig.overlays));
        //
        // var legendURL = getLegendURL(layer);
        //
        // debugger;
        //
        // if (legendURL === null) {
        //   startDownloadOfImageURL(aURL, type, 'image/png', title + '.png', function () {
        //     tempMask.hide();
        //   });
        // } else {
        //   startDownloadOfImageURLWithLegend(aURL, type, legendURL, 'image/png', title + '.png', function () {
        //     tempMask.hide();
        //   });
        // }

        const w = mapPanelBlock.component.getWidth();
        const h = mapPanelBlock.component.getHeight();
        const mime = 'image/png';

        const title = toFilename(globalThis.App.Layers.getTopLayerTitle(layersConfig.overlays));

        const extension = 'png';
        const filenameToUse = title + '.' + extension;

        // http://stackoverflow.com/questions/31710768/how-can-i-fetch-an-array-of-urls-with-promise-all
        // ie doesnt support arrow syntax
        // so map fetch function to each url to create a array of fetch promises for each url
        const fetchURLPromises: Array<Promise<Blob>> = windowJsonLayers
          .map((layer) => globalThis.App.OpenLayers.getDownloadURLOfJSONLayerObject(layer, openlayersMap, mime, w, h))
          .map((url) => fetch(url).then((res) => res.blob()));

        Promise.all(fetchURLPromises)
          .then(function (blobArray) {
            // so now we have all of the rasters loaded from their urls

            const canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            canvas.setAttribute('width', w + 'px');
            canvas.setAttribute('height', h + 'px');

            compositeBlobs(canvas, ctx, blobArray, (compositeBlob) => {
              const dlUrl = window.URL.createObjectURL(compositeBlob);
              if (legendURL === null) {
                startDownloadOfImageURL(dlUrl, type, 'image/png', title + '.png', function () {
                  tempMask.hide();
                });
              } else {
                startDownloadOfImageURLWithLegend(dlUrl, type, legendURL, 'image/png', title + '.png', function () {
                  tempMask.hide();
                });
              }
              // @ts-ignore
              // if (/*@cc_on!@*/ false || !!document.documentMode) {
              //   //this if statement is to detect IE
              //   //bc IE cannot open blob urls
              //   //https://buddyreno.me/efficiently-detecting-ie-browsers-8744d13d558
              //   window.navigator.msSaveOrOpenBlob(compositeBlob, filenameToUse);
              // } else {
              //   const dlUrl = window.URL.createObjectURL(compositeBlob);
              //   const link = document.createElement('a');
              //   link.setAttribute('download', filenameToUse);
              //   link.setAttribute('href', dlUrl);
              //   document.body.appendChild(link);
              //   link.click();
              //   URL.revokeObjectURL(dlUrl);
              // }
              // tempMask.hide();
            });
          })
          .catch(function (err) {
            logger.error(err);
          });

        //logger(windowJsonLayers);
        //logger(globalThis.App.OpenLayers.getDownloadURLOfJSONLayerObject(windowJsonLayers[0],openlayersMap,"image/png",mapPanelBlock.component.getWidth(),mapPanelBlock.component.getHeight()));

        /*
         //--------------

         var windowJsonLayers = getAllLayersIncludeOverlayIncludeBoundaryRequireDisplay(layersConfig, true, false, true);

         if (windowJsonLayers.length == 0)
         return null;

         windowJsonLayers.sort(globalThis.App.OpenLayers.zIndexSortAscending);

         var layer = windowJsonLayers[windowJsonLayers.length - 1];

         var aURL = globalThis.App.OpenLayers.getDownloadURLOfMapImage(
         layersConfig,
         openlayersMap,
         "image/png",
         mapPanelBlock.component.getWidth(),
         mapPanelBlock.component.getHeight());

         var title = globalThis.App.Layers.getTopLayerTitle(layersConfig.overlays).replace(/,/g, "").replace(/ /g, "_");

         var legendURL = getLegendURL(layer);

         startDownloadOfImageURL(aURL, 'image/png', title + ".png", function () {
         tempMask.hide();
         });

         logger(aURL);


         if (legendURL === null) {
         startDownloadOfImageURL(aURL, 'image/png', title + ".png", function () {
         tempMask.hide();
         });
         } else {
         startDownloadOfImageURLWithLegend(aURL, legendURL, 'image/png', title + ".png", function () {
         tempMask.hide();
         });
         }
         */
      },
    };

    return menuItem;
  },
};
