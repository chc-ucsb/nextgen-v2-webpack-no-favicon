import { buildUrlParams, toFilename } from '../../../helpers/string';
import { compositeBlobs, startDownloadOfImageURL } from '../../../helpers/network';
import { getRegionWithRegionID, logger } from '../../../utils';
import { objPropExists } from '../../../helpers/object';
import TextButton from 'ol-ext/control/TextButton';
import Bar from 'ol-ext/control/Bar';
import Toggle from 'ol-ext/control/Toggle';

export const cMapDownloadsTool_olext = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const getDownloadMenuButton = ({ controls, map }) => {
      const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
      const mapperWindow = mapWindowBlock.extendedTool;
      const mapPanelBlock = extendedTool.owningBlock;
      const layersConfig = globalThis.App.Layers.getLayersConfigById(mapperWindow.layersConfigId);
      const openlayersMap = map;

      const getMenuItem = (item) => {
        const { format, text, type, layersInDisplay, progressMessage, extentSize, useNativeSrs } = item;

        let extension = format;
        let clickHandler;

        if (format === 'image/geotiff') {
          extension = 'tiff';
        } else if (format === 'image/png') {
          extension = 'png';
        }

        // If `type` is a link open the url in a new tab
        if (type === 'link') {
          clickHandler = () => {
            window.open(item.url, '_blank');
          };
        } else if (layersInDisplay) {
          clickHandler = () => {
            let title;
            const tempMask = new Ext.LoadMask(Ext.get(mapWindowBlock.component.id), {
              msg: typeof progressMessage !== 'undefined' ? progressMessage : 'Generating download ...',
            });
            tempMask.show();
            const windowJsonLayers = globalThis.App.Layers.query(
              layersConfig,
              {
                type: 'layer',
                display: true,
                mask: false,
                loadOnly: false,
              },
              ['overlays', 'hidden', 'boundaries']
            );

            const w = mapperWindow.component.getWidth();
            const h = mapperWindow.component.getHeight();
            const mime = 'image/png';

            const overlaysLayerTitle = toFilename(globalThis.App.Layers.getTopLayerTitle(layersConfig.overlays));
            const hiddenLayerTitle = toFilename(globalThis.App.Layers.getTopLayerTitle(layersConfig.hidden));

            if (overlaysLayerTitle === 'No_Layers_Selected') {
              title = hiddenLayerTitle;
            } else title = overlaysLayerTitle;
            const extension = 'png';
            const filenameToUse = `${title}.${extension}`;

            // http://stackoverflow.com/questions/31710768/how-can-i-fetch-an-array-of-urls-with-promise-all
            // ie doesnt support arrow syntax
            // so map fetch function to each url to create a array of fetch promises for each url
            const fetchURLPromises: Array<Promise<Blob>> = windowJsonLayers
              .map((layer) => globalThis.App.OpenLayers.getDownloadURLOfJSONLayerObject(layer, openlayersMap, 'image/png', w, h))
              .map((url) => fetch(url).then((res) => res.blob()));

            Promise.all(fetchURLPromises)
              .then(function (blobArray) {
                // so now we have all of the rasters loaded from their urls

                const canvas = document.createElement('canvas');
                document.body.appendChild(canvas);
                const ctx = canvas.getContext('2d');
                canvas.setAttribute('width', `${w}px`);
                canvas.setAttribute('height', `${h}px`);

                compositeBlobs(canvas, ctx, blobArray, (compositeBlob) => {
                  // @ts-ignore
                  // eslint-disable-next-line spaced-comment
                  if (/*@cc_on!@*/ false || !!document.documentMode) {
                    // this if statement is to detect IE
                    // bc IE cannot open blob urls
                    // https://buddyreno.me/efficiently-detecting-ie-browsers-8744d13d558
                    window.navigator.msSaveOrOpenBlob(compositeBlob, filenameToUse);
                  } else {
                    const dlUrl = window.URL.createObjectURL(compositeBlob);
                    const link = document.createElement('a');
                    link.setAttribute('download', filenameToUse);
                    link.setAttribute('href', dlUrl);
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(dlUrl);
                  }
                  tempMask.hide();
                });
              })
              .catch(function (err) {
                logger.error(err);
              });
          };
        } else {
          clickHandler = () => {
            let downloadUrl = '';
            let title;
            const tempMask = new Ext.LoadMask(Ext.get(mapWindowBlock.component.id), {
              msg: typeof progressMessage !== 'undefined' ? progressMessage : 'Generating download ...',
            });
            tempMask.show();

            const windowJsonLayers = globalThis.App.Layers.query(
              layersConfig,
              {
                type: 'layer',
                display: true,
                mask: false,
                loadOnly: false,
              },
              ['overlays', 'hidden']
            );

            if (!windowJsonLayers.length) return;

            windowJsonLayers.sort(globalThis.App.OpenLayers.zIndexSortAscending);

            const layer = windowJsonLayers[windowJsonLayers.length - 1];
            const overlaysLayerTitle = toFilename(globalThis.App.Layers.getTopLayerTitle(layersConfig.overlays));
            const hiddenLayerTitle = toFilename(globalThis.App.Layers.getTopLayerTitle(layersConfig.hidden));

            if (overlaysLayerTitle === 'No_Layers_Selected') {
              title = hiddenLayerTitle;
            } else title = overlaysLayerTitle;
            if (type === 'wcs') {
              const regionFolder = globalThis.App.Layers.query(
                layersConfig,
                function (folder) {
                  if (folder.type !== 'folder' || !objPropExists(folder, 'regionId')) return false;
                  const displayedLayers = globalThis.App.Layers.query(folder.folder, {
                    type: 'layer',
                    display: true,
                    mask: false,
                    loadOnly: false,
                  });

                  if (displayedLayers.length > 0) return true;
                  return false;
                },
                ['overlays', 'hidden']
              );

              let region = globalThis.App.Config.sources.regions[0];
              if (regionFolder.length > 0) {
                const { regionId } = regionFolder[0];
                region = getRegionWithRegionID(regionId);
              }

              let wcsProxy;
              downloadUrl = layer.source.wcs;

              if (useNativeSrs) {
                wcsProxy = layer.source.wcs + globalThis.App.Config.proxies.WCSProxyURL3;
              } else if (objPropExists(layer, 'pixelWidth') && objPropExists(layer, 'pixelHeight')) {
                wcsProxy = layer.source.wcs + globalThis.App.Config.proxies.WCSProxyURL2;
              } else {
                wcsProxy = layer.source.wcs + globalThis.App.Config.proxies.WCSProxyURL;
              }

              if (typeof wcsProxy === 'string' && wcsProxy !== '') {
                // Object to be passed into buildUrlParams to make string replacements to the proxy url
                const dataObj = {
                  layer,
                  region,
                  currentExtent: undefined,
                };

                if (extentSize === 'full') {
                  dataObj.currentExtent = region.bbox;
                } else {
                  dataObj.currentExtent = globalThis.App.OpenLayers.getCurrentMapWindowExtent(openlayersMap);
                }

                downloadUrl = buildUrlParams(wcsProxy, dataObj);
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
                mapPanelBlock.getReferencedBlock('cMapPanel').component.getWidth(),
                mapPanelBlock.getReferencedBlock('cMapPanel').component.getHeight(),
                layer.style
              );
            }

            startDownloadOfImageURL(downloadUrl, type, format, `${title}.${extension}`, function () {
              tempMask.hide();
            });
          };
        }

        const textButton = new TextButton({
          html: text,
          handleClick: clickHandler,
        });

        return textButton;
      };

      const subBar = new Bar({
        toggleOne: true,
        controls: controls.map((c) => getMenuItem(c)),
      });

      const mainBar = new Bar({
        controls: [
          new Toggle({
            html: '<i class="fa fa-download"></i>',
            bar: subBar,
            title: 'Download',
          }),
        ],
      });

      return mainBar;
    };

    globalThis.App.OpenLayers.controls['download'] = getDownloadMenuButton;

    return;
  },
};
