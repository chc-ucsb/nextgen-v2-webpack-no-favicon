import { Dictionary } from '../@types';

export type TimeConfig = {
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
  ignoreLeapYear?: boolean;
  granuleReference: 'start' | 'end';
};

export interface ApplicationSettings {
  sources: Dictionary;
  chartTypes: Dictionary;
  chartBuilders: Dictionary;
  chartNormalizers: Dictionary;
  chartExporters: Dictionary;
  analytics: Dictionary;
  proxies: Dictionary;
  time: TimeConfig;
  debugMode: boolean;
  serviceCheck?: Dictionary;
}

/**
 * Used to customize the NextGenViewer application.
 */
export class Config implements ApplicationSettings {
  debugMode = false;
  sources: Dictionary = {};
  chartTypes: Dictionary = {};
  chartBuilders: Dictionary = {};
  chartNormalizers: Dictionary = {};
  chartExporters: Dictionary = {};
  analytics: Dictionary = {};
  time: TimeConfig = {
    weekStartsOn: 0,
    ignoreLeapYear: false,
    granuleReference: 'start',
  };

  proxies: Dictionary = {
    Generic: './proxy.php',
    WMSProxyURL: '',
    WCSProxyURL:
      '?layerId={{layerId}}&layerName={{wcsLayerName}}&lowerLeftX={{wcsLowerLeftX}}&lowerLeftY={{wcsLowerLeftY}}&upperRightX={{wcsUpperRightX}}&upperRightY={{wcsUpperRightY}}&resolution={{resolution}}&srs={{wcsInputSrs}}&outputSrs={{wcsOutputSrs}}',
    WCSProxyURL2:
      '?layerId={{layerId}}&layerName={{wcsLayerName}}&lowerLeftX={{wcsLowerLeftX}}&lowerLeftY={{wcsLowerLeftY}}&upperRightX={{wcsUpperRightX}}&upperRightY={{wcsUpperRightY}}&resolution={{resolution}}&pixelHeight={{wcsRasterPixelHeight}}&pixelWidth={{wcsRasterPixelWidth}}&srs={{wcsInputSrs}}&outputSrs={{wcsOutputSrs}}',
    WCSProxyURL3:
      '?layerId={{layerId}}&layerName={{wcsLayerName}}&lowerLeftX={{wcsLowerLeftX}}&lowerLeftY={{wcsLowerLeftY}}&upperRightX={{wcsUpperRightX}}&upperRightY={{wcsUpperRightY}}&resolution={{resolution}}&srs={{wcsInputSrs}}&outputSrs={{wcsOutputSrs}}&nativeSrs={{wcsInputSrs2}}',
    WCSProxyURLPhenology:
      '?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId={{wcsLayerName}}&compression=DEFLATE&subset=http://www.opengis.net/def/axis/OGC/0/X({{wcsLowerLeftX}},{{wcsUpperRightX}})&subset=http://www.opengis.net/def/axis/OGC/0/Y({{wcsLowerLeftY}},{{wcsUpperRightY}})&SUBSETTINGCRS=http://www.opengis.net/def/crs/EPSG/0/{{wcsOutputSrs}}',
    // WCSProxyURLPhenology: '?layerName={{wcsLayerName}}&lowerLeftX={{wcsLowerLeftX}}&lowerLeftY={{wcsLowerLeftY}}&upperRightX={{wcsUpperRightX}}&upperRightY={{wcsUpperRightY}}&wcsURL={{wcsUrl}}&outputSrs={{wcsOutputSrs}}',
  };

  /**
   * Activate Debug mode.
   * @returns {Config}
   */
  debug(): Config {
    this.debugMode = true;

    return this;
  }

  /**
   * Set sources for JSON files.
   * @param {Dictionary} args
   * @returns {Config}
   */
  addSources(args: Dictionary): Config {
    if (typeof args === 'object') {
      this.sources = { ...this.sources, ...args };
    } else {
      this.throwError(args, 'addSources', 'object');
    }

    return this;
  }

  /**
   * Add custom chart types.
   * @param {Array<Function>} args
   * @returns {Config}
   */
  addChartTypes(args: Array<Function>): Config {
    if (Array.isArray(args)) {
      args.map((arg) => {
        this.chartTypes[arg.name] = arg;
      });
    } else {
      this.throwError(args, 'addChartTypes', 'array');
    }

    return this;
  }

  /**
   * Add custom chart builders.
   * @param {Array<Function>} args
   * @returns {Config}
   */
  addChartBuilders(args: Array<Function>): Config {
    if (Array.isArray(args)) {
      args.map((arg) => {
        this.chartBuilders[arg.name] = arg;
      });
    } else {
      this.throwError(args, 'addChartBuilders', 'array');
    }

    return this;
  }

  /**
   * Add custom chart normalizers that will alter the data received from the server
   * prior to building the chart.
   * @param {Array<Function>} args
   * @returns {Config}
   */
  addChartNormalizers(args: Array<Function>): Config {
    if (Array.isArray(args)) {
      args.map((arg) => {
        this.chartNormalizers[arg.name] = arg;
      });
    } else {
      this.throwError(args, 'addChartNormalizer', 'array');
    }

    return this;
  }

  /*
   * Add proxies to bypass CORS restrictions when fetching a GetCapabilities XML document.
   *
   * The [Utils#buildUrlParams]{@link buildUrlParams} function will be used to insert the appropriate
   * parameters into the URL.
   * The parameter '{{service}}' will be converted to the function [getService]{@link Store.urlParamGetters#getService},
   * which will be used to get the replacement value.
   * @example
   * {
   *   WMSProxyURL: 'proxies/wmsProxy.php?url={{url}}?SERVICE={{service}}&REQUEST={{request}}'
   * }
   */
  addProxies(args: Dictionary): Config {
    if (typeof args === 'object') {
      this.proxies = { ...this.proxies, ...args };
    } else {
      this.throwError(args, 'addProxies', 'object');
    }
    return this;
  }

  /**
   * Set any properties related to analytics here. Matomo and Google are supported.
   * @param {Dictionary} args
   * @returns {Config}
   */
  setAnalytics(args: Dictionary): Config {
    if (typeof args === 'object') {
      this.analytics = args;
    } else {
      this.throwError(args, 'setAnalytics', 'object');
    }

    return this;
  }

  /**
   * Set any properties related to how _time_ is handled in the application.
   *
   * This applies to what day of the week the year starts on, if leap years should be ignored,
   * and how granules are referenced (by the start or end date).
   * @param {TimeConfig} args
   * @returns {Config}
   */
  setTimeHandlingProperties(args: TimeConfig): Config {
    if (typeof args === 'object') {
      this.time = args;
    } else {
      this.throwError(args, 'setTimeHandlingProperties', 'object');
    }

    return this;
  }

  /**
   * Generic function to throw an error when invalid args are passed.
   * @param args
   * @param {string} fnName
   * @param {string} expectedType
   */
  private throwError(args: any, fnName: string, expectedType: string): void {
    throw new Error(`Invalid arguments given to ${fnName}. Expected type is ${expectedType}, but was given type of ${typeof args}. ${args}`);
  }
}
