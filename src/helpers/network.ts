import { AjaxOptions, Dictionary, LayerConfig } from '../@types';
import { buildUrl, dataUriToBlob, parseGETURL } from './string';
import { Transport } from '../Network/Transport';
import { WCSRequest } from '../Network/WCSRequest';
import { objPropExists } from './object';

/**
 * Perform an asynchronous AJAX request.
 * @param {AjaxOptions} options
 * @returns {XMLHttpRequest}
 */
export const ajax = (options: AjaxOptions): XMLHttpRequest => {
  const request = new XMLHttpRequest();

  request.open(options.method, options.url, true);
  if (options.method !== undefined && options.method.toUpperCase() === 'POST') {
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(JSON.stringify(options.body) || '');
  } else {
    request.send();
  }

  request.onerror = function (): string {
    return 'Request failed to load.';
  };
  return request;
};

/**
 * Perform an asynchronous AJAX request.
 * @param {AjaxOptions} options
 * @returns {XMLHttpRequest}
 */
export const asyncAjax = (options: AjaxOptions): XMLHttpRequest => {
  const request = new XMLHttpRequest();
  // Request.id = Utils.getRandomString(32, 36)
  request.open(options.method || 'GET', options.url, true);
  if (objPropExists(options, 'timeout')) request.timeout = options.timeout || 0;
  if (options.method !== undefined && options.method.toUpperCase() === 'POST') {
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(options.body || '');
  } else {
    request.send();
  }

  request.onreadystatechange = function (): void {
    if (request.readyState === 4) {
      if (request.status === 200 || !objPropExists(options, 'errorCallback')) {
        options?.callback(request, options.callbackObj);
      } else {
        options?.errorCallback(request, options.callbackObj);
      }
    }
  };

  return request;
};

export const getJsonLayerListWithGeoserverCapabilitiesURL = (json: Dictionary): Array<any> => {
  let _json;

  for (const prop of Object.keys(json)) _json = json[prop];

  const parseLayers = function (layer, parsedLayers = []): Array<any> {
    if (layer['@attributes'] && layer['@attributes'].queryable === '1') {
      const meta: any = {};
      let boundingBoxName = '';

      if (layer.Name) meta.name = layer.Name['#text'];
      if (layer.Title) meta.title = layer.Title['#text'];

      if (layer.BoundingBox) {
        boundingBoxName = 'BoundingBox';
      } else if (layer.LatLonBoundingBox) {
        boundingBoxName = 'LatLonBoundingBox';
      }

      if (boundingBoxName !== '') {
        const boundingBox = [];
        if (layer[boundingBoxName].constructor === Array) {
          for (const bbox of layer[boundingBoxName]) {
            const attributes = bbox['@attributes'];
            boundingBox.push(attributes);
          }
          // for (let i = 0; i < layer[boundingBoxName].length; i += 1) {
          //   const attributes = layer[boundingBoxName][i]['@attributes']
          //   boundingBox.push(attributes)
          // }
        } else {
          boundingBox.push(layer[boundingBoxName]['@attributes']);
        }

        meta.boundingBox = boundingBox;
      }

      if (layer.Style) {
        meta.style = {};
        if (layer.Style.Name) meta.style.name = layer.Style.Name['#text'];
        if (layer.Style.LegendURL) {
          meta.style.legendURL = {};
          if (layer.Style.LegendURL.Format) meta.style.legendURL.format = layer.Style.LegendURL.Format['#text'];
          if (layer.Style.LegendURL.OnlineResource)
            meta.style.legendURL.onlineResource = layer.Style.LegendURL.OnlineResource['@attributes']['xlink:href'];
        }
      }
      parsedLayers.push(meta);
    }

    if (layer.Layer) {
      if (layer.Layer.constructor === Array) {
        layer.Layer.map((aLayer) => {
          parsedLayers = parseLayers(aLayer, parsedLayers);
        });
        /*
         * for (let i = 0; i < layer.Layer.length; i += 1) {
         *   parsedLayers = parseLayers(layer.Layer[i], parsedLayers)
         * }
         */
      } else {
        parsedLayers = parseLayers(layer.Layer, parsedLayers);
      }
    }

    return parsedLayers;
  };

  return parseLayers(_json.Capability.Layer);
};

export const startDownloadOfImageURLWithLegend = (
  mapURL: string,
  sourceType: string,
  legendURL: string,
  mime: string,
  filenameToUse: string,
  callback: Function
): void => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const mapImage = new Image();
  mapImage.setAttribute('crossOrigin', 'anonymous');
  mapImage.src = mapURL;
  document.body.appendChild(mapImage);
  mapImage.onload = function () {
    const mapWidth = mapImage.width;
    const mapHeight = mapImage.height;
    const legendImage = new Image();
    legendImage.setAttribute('crossOrigin', 'anonymous');
    legendImage.src = legendURL;
    document.body.appendChild(legendImage);
    legendImage.onload = function () {
      const legendWidth = legendImage.width;
      const legendHeight = legendImage.height;
      const x = mapWidth;
      const y = mapHeight - legendHeight;
      canvas.setAttribute('width', `${mapWidth + legendWidth}px`);
      canvas.setAttribute('height', `${mapHeight}px`);
      ctx.drawImage(mapImage, 0, 0, mapWidth, mapHeight);
      ctx.drawImage(legendImage, x, y, legendWidth, legendHeight);
      const newURL = mime === 'image/geotiff' ? canvas.toDataURL('image/png') : canvas.toDataURL(mime);

      const blob = dataUriToBlob(newURL, mime);

      if (navigator.appVersion.toString().indexOf('.NET') > 0) {
        /*
         * This if statement is to detect IE
         * bc IE cannot open blob urls
         * https://buddyreno.me/efficiently-detecting-ie-browsers-8744d13d558
         */
        window.navigator.msSaveOrOpenBlob(blob, filenameToUse);
      } else {
        const link = document.createElement('a');
        link.setAttribute('download', filenameToUse);
        link.setAttribute('href', window.URL.createObjectURL(blob));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Delete link;
      }

      document.body.removeChild(legendImage);
      // Delete legendImage;
      document.body.removeChild(mapImage);
      // Delete mapImage;
      document.body.removeChild(canvas);
      // Delete canvas;
      callback();
    };
  };
};

export const startDownloadOfImageURL = async (
  url: string,
  sourceType: string,
  mime: string,
  filenameToUse: string,
  callback?: Function
): Promise<void> => {
  let res;

  if (sourceType === 'wcs') {
    const {
      baseUrl,
      layerId,
      layerName,
      lowerLeftX,
      lowerLeftY,
      upperRightX,
      upperRightY,
      resolution,
      srs,
      outputSrs,
      pixelWidth,
      pixelHeight,
      nativeSrs,
    } = parseGETURL(url);

    if (pixelHeight && pixelWidth) {
      // WCSProxy2
      res = await WCSRequest.fullExtent(baseUrl, {
        layerId,
        layerName,
        lowerLeftX,
        lowerLeftY,
        upperRightX,
        upperRightY,
        pixelHeight,
        pixelWidth,
        srs,
        outputSrs,
      });
    } else {
      // WCSProxy 1/3
      res = await WCSRequest.currentExtent(baseUrl, {
        layerName,
        layerId,
        lowerLeftX,
        lowerLeftY,
        upperRightX,
        upperRightY,
        srs,
        outputSrs,
        resolution,
        nativeSrs,
      });
    }
  }

  if (sourceType === 'wms') {
    res = await Transport.get(url);
  }

  const blob = new Blob([await res.blob()], { type: mime });
  if (navigator.appVersion.toString().indexOf('.NET') > 0) {
    /*
     * IE has problems with downloading blobs
     * http://stackoverflow.com/questions/20310688/blob-download-not-working-in-ie
     */
    window.navigator.msSaveBlob(blob, filenameToUse);
  } else {
    const link = document.createElement('a');
    link.setAttribute('download', filenameToUse);
    link.setAttribute('href', window.URL.createObjectURL(blob));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Delete link;
  }

  if (callback) callback();
};

/**
 * Read in the JS file and convert to an object
 * @param {string} strPath
 * @returns {any}
 */
export const convertJSFileObjReference = async (strPath: string): Promise<any> => {
  const url = strPath;
  const someJsonRawText = await Transport.get(url, {
    cache: 'default',
  });

  // eslint-disable-next-line no-eval
  return eval(await someJsonRawText.text());
};

export const getLegendURL = (layer: LayerConfig, width = 20, height = 17): string | null => {
  const legendUrl = null;
  if (objPropExists(layer, 'legend')) {
    const wmsURL = layer.source.wms;
    let layerName;

    if (objPropExists(layer, 'wmstName')) {
      layerName = layer.wmstName;
    } else {
      layerName = layer.name;
    }

    const styleToUse = layer.legend.style;

    const queryParams = {
      REQUEST: 'GetLegendGraphic',
      VERSION: '1.0.0',
      FORMAT: 'image/png',
      WIDTH: width,
      HEIGHT: height,
      LAYER: layerName,
      STYLE: styleToUse,
      LEGEND_OPTIONS: 'dx:10.0;dy:0.2;mx:0.2;my:0.2;fontStyle:normal;fontColor:000000;absoluteMargins:true;labelMargin:5;fontSize:13',
    };

    return buildUrl(wmsURL, queryParams);
  }
  return legendUrl;
};

/**
 * Create a composite image from an array of image blobs.
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<Blob>} blobArray
 * @param callback
 */
export const compositeBlobs = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  blobArray: Array<Blob>,
  callback: (blob: Blob) => void
): void => {
  const img = new Image();
  // Take out first element of array.
  const blob = blobArray.shift();

  img.src = URL.createObjectURL(blob);
  img.onload = function () {
    // When the image is loaded from the blob, draw it onto the canvas context.
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Loop until blobArray has been exhausted.
    if (blobArray.length > 0) {
      compositeBlobs(canvas, ctx, blobArray, callback);
    } else {
      // Set the output mime.
      const mime = 'image/png';

      // Return a new blob created from the layered images to the callback.
      callback(dataUriToBlob(canvas.toDataURL(mime), mime));
    }
  };
};

/**
 * Changes the protocol of a URL string to from HTTP to HTTPS only if the viewer is loaded from a secure site.
 * If the page is not a secure site, then no change is made.
 *
 * This is to prevent 'Blocked loading mixed active content' errors by not mixing HTTPS and HTTP content.
 * If the viewer is hosted on an HTTPS site, requesting content from an HTTP protocol will result in an error.
 * However, if the viewer is hosted on an HTTP site, it's OK to request content from an HTTPS site.
 * @param {string} url
 * @returns {string}
 */
export const upgradeUrlProtocol = (url: string): string => {
  if (location.protocol === 'https:' && url.startsWith('http:')) {
    return url.replace(/http:/, location.protocol);
  }
  return url;
};
