import { handleError, Transport } from './Transport';
import { buildUrl, parseXML } from '../helpers/string';

// WCS 1.0.0 info https://portal.opengeospatial.org/files/05-076
const getWCSTemplate = ({
  layerName,
  lowerLeftX,
  lowerLeftY,
  upperRightX,
  upperRightY,
  gridOffsetX,
  gridOffsetY,
  srs,
  outputSrs,
  granuleStart,
}): string => {
  if (granuleStart) {
    return `<?xml version="1.0" encoding="UTF-8"?><GetCoverage version="1.0.0" service="WCS"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wcs"
    xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml"
    xmlns:ogc="http://www.opengis.net/ogc" xsi:schemaLocation="http://www.opengis.net/wcs
    http://schemas.opengis.net/wcs/1.0.0/getCoverage.xsd">
    <sourceCoverage>${layerName}</sourceCoverage>
    <domainSubset>
      <spatialSubset>
        <gml:Envelope srsName="${srs}">
          <gml:pos>${lowerLeftX} ${lowerLeftY}</gml:pos>
          <gml:pos>${upperRightX} ${upperRightY}</gml:pos>
        </gml:Envelope>
        <gml:Grid dimension="2">
          <gml:limits>
            <gml:GridEnvelope>
              <gml:low>0 0</gml:low>
              <gml:high>${gridOffsetX} ${gridOffsetY}</gml:high>
            </gml:GridEnvelope>
          </gml:limits>
          <gml:axisName>x</gml:axisName>
          <gml:axisName>y</gml:axisName>
        </gml:Grid>
      </spatialSubset>
      <temporalSubset>
        <gml:timePosition>${granuleStart}T00:00:00.000Z</gml:timePosition>
      </temporalSubset>
    </domainSubset>
    <output>
      <crs>${outputSrs}</crs>
      <format>GeoTIFF</format>
    </output>
  </GetCoverage>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?><GetCoverage version="1.0.0" service="WCS"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wcs"
    xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml"
    xmlns:ogc="http://www.opengis.net/ogc" xsi:schemaLocation="http://www.opengis.net/wcs
    http://schemas.opengis.net/wcs/1.0.0/getCoverage.xsd">
    <sourceCoverage>${layerName}</sourceCoverage>
    <domainSubset>
      <spatialSubset>
        <gml:Envelope srsName="${srs}">
          <gml:pos>${lowerLeftX} ${lowerLeftY}</gml:pos>
          <gml:pos>${upperRightX} ${upperRightY}</gml:pos>
        </gml:Envelope>
        <gml:Grid dimension="2">
          <gml:limits>
            <gml:GridEnvelope>
              <gml:low>0 0</gml:low>
              <gml:high>${gridOffsetX} ${gridOffsetY}</gml:high>
            </gml:GridEnvelope>
          </gml:limits>
          <gml:axisName>x</gml:axisName>
          <gml:axisName>y</gml:axisName>
        </gml:Grid>
      </spatialSubset>
    </domainSubset>
    <output>
      <crs>${outputSrs}</crs>
      <format>GeoTIFF</format>
    </output>
  </GetCoverage>`;
};

export class WCSRequest {
  /**
   * Makes a WCS POST request for the _current_ extent (what parts of the raster that are shown in the viewport) of the map.
   * JS implementation of WCSProxy.php 1 & 3.
   * @param {string} url
   * @param {{layerName: string; lowerLeftX: number; lowerLeftY: number; upperRightX: number; upperRightY: number; srs: string; outputSrs: string; resolution: number; nativeSrs?: string}} params
   * @returns {Promise<Response>}
   */
  static async currentExtent(
    url: string,
    params: {
      layerName: string;
      layerId: string;
      lowerLeftX: number;
      lowerLeftY: number;
      upperRightX: number;
      upperRightY: number;
      srs: string;
      outputSrs: string;
      resolution: number;
      nativeSrs?: string;
    }
  ): Promise<Response> {
    const { layerName, layerId, lowerLeftX, lowerLeftY, upperRightX, upperRightY, srs, outputSrs, nativeSrs } = params;
    let { resolution } = params;

    const xDist = upperRightX - lowerLeftX;
    const yDist = upperRightY - lowerLeftY;

    /**
     * "resolution" is a loosely used term that needs to be changed
     * its actually pixel size, where pixelsize is the size per pixel in how many coordinates
     * it takes up in the reference coordinate system.
     *
     * EG:
     * QDRI VegDRI Raster = EPSG:3785 pixelSize = 1277.43
     * FEWS RFE2 Raster = EPSG:4326 pixelsize = 0.1
     *
     * PixelSize info can be looked up from the properties of the raster in qgis, which
     * you can get to by right clicking on it in the qgis layer list
     *
     * The thing is with wcs requests, you have to specify a bounding box, and then
     * pixel height + pixel width that you want back. So you need to convert the coordinate bbox to pixel height and pixel width.
     *
     * The wcs request needs both.
     *
     * This is a hack to transform the EPSG:4326 pixel size to EPSG:3785/3857.
     * Right now we only have EPSG:4326 + EPSG3857 rasters in our viewers that use the WCS download
     *
     * * * * * * * * * * * * * * * * * * * * *
     *
     * https://www.neonscience.org/resources/learning-hub/tutorials/raster-res-extent-pixels-r
     * The spatial resolution of a raster refers the size of each cell in meters. This size in turn relates to the area on the ground that the pixel represents.
     * QGIS lists the 'Pixel Size' as an X,Y pair, this is the size in meters (length, width) each pixel represents.
     *
     * https://wiki.openstreetmap.org/wiki/Precision_of_coordinates
     * Latitudinal distance (in metres) = (decimal latitude A - decimal latitude B) * 111 120 m
     *
     * resolution = area on ground per pixel
     * 111120 = 1 degree of latitude (east/west) in meters
     * resolution * 111120 = total size (in meters) of all pixels
     * Finally, by dividing the xDist and yDist, we convert the coordinate distance to the image's pixel size
     */
    if (nativeSrs) {
      // WCSProxy3
      if (outputSrs === 'EPSG:4326' && nativeSrs === 'EPSG:4326') {
        resolution *= 111120;
      }
    } else if (outputSrs === 'EPSG:4326' && srs === 'EPSG:3857') {
      // WCSProxy1
      resolution *= 111120;
    }

    // Convert coordinate distance to on disk image pixel size
    const gridOffsetX = Math.round(xDist / resolution);
    const gridOffsetY = Math.round(yDist / resolution);

    // Add the TIME parameter
    const granuleStart = globalThis.App.Layers._granules.get(layerId)?.activeInterval.start;

    // eslint-disable-next-line no-return-await
    return await Transport.post(
      getWCSTemplate({ layerName, lowerLeftX, lowerLeftY, upperRightX, upperRightY, gridOffsetX, gridOffsetY, srs, outputSrs, granuleStart })
    )
      .to(url, {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
        },
      })
      .catch((e) => {
        handleError(e);
        throw new Error(`Error! The given parameters are not valid for a WCS request.
        To request an image for the current map extent, the 'resolution' property must be set.
        `);
      });
  }

  /**
   * Makes a WCS POST request for the _full_ extent (the entire raster) displayed on the map.
   * JS implementation of WCSProxy2.php.
   * ___
   * This exists because I am not sure that the output of wcsProxy.php is correct based on my conversations with Danny Howard and that GeoServer doesn't make the same output when using the wcs request builder.
   * Keeping both makeWCSRequestUsingExtent and makeWCSRequestFullRaster to compare going forward.
   * -Reza
   * @param {string} url
   * @param {{layerName: string; lowerLeftX: number; lowerLeftY: number; upperRightX: number; upperRightY: number; pixelHeight: number; pixelWidth: number; srs: string; outputSrs: string;}} params
   * @returns {Promise<Response>}
   */
  static async fullExtent(
    url: string,
    params: {
      layerId: string;
      layerName: string;
      lowerLeftX: number;
      lowerLeftY: number;
      upperRightX: number;
      upperRightY: number;
      pixelHeight: number;
      pixelWidth: number;
      srs: string;
      outputSrs: string;
    }
  ): Promise<Response> {
    // const { layerName, lowerLeftX, lowerLeftY, upperRightX, upperRightY, pixelWidth: gridOffsetX, pixelHeight: gridOffsetY, srs, outputSrs } = params;
    const { layerId, layerName, srs } = params;

    /*
     * The goal is to get the RAW GeoTIFF from disk. To be as precise a possible, we first
     * make a DescribeCoverage request for the layer. This allows us to get the on-disk extent and pixel size.
     *
     * We don't want the image to be reprojected, so we use the same SRS for input and output.
     */

    const coverageParams = {
      service: 'WCS',
      version: '2.0.1',
      request: 'describeCoverage',
      coverageId: layerName,
    };
    const coverageUrl = buildUrl(url, coverageParams);
    const req = await Transport.get(coverageUrl);
    const res = await req.text();

    const parsedXml = parseXML(res);
    const [lowerLeftX, lowerLeftY] = parsedXml.getElementsByTagName('gml:lowerCorner').item(0).textContent.split(' ');
    const [upperRightX, upperRightY] = parsedXml.getElementsByTagName('gml:upperCorner').item(0).textContent.split(' ');
    const [gridOffsetX, gridOffsetY] = parsedXml
      .getElementsByTagName('gml:high')
      .item(0)
      .textContent.split(' ')
      .map((val) => parseInt(val) + 1);

    // Add the TIME parameter
    const granuleStart = globalThis.App.Layers._granules.get(layerId)?.activeInterval.start;

    // eslint-disable-next-line no-return-await
    return await Transport.post(
      getWCSTemplate({
        layerName,
        lowerLeftX,
        lowerLeftY,
        upperRightX,
        upperRightY,
        gridOffsetX,
        gridOffsetY,
        srs,
        // We use the same srs for input and output
        outputSrs: srs,
        granuleStart,
      })
    )
      .to(url, {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
        },
      })
      .catch((e) => {
        handleError(e);
        throw new Error(`Error! The given parameters are not valid for a WCS request.
        To request an image of the full map extent, the 'pixelHeight' and 'pixelWidth' properties must be set.`);
      });
  }
}
