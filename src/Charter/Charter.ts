import { Source } from 'ol/source';
import * as Common from '../helpers/chart';
import { ChartHandler } from './ChartHandler';
import { DataHandler } from './DataHandler';
import { Exporters } from './Exporters';
import { Chart } from './Chart';
import { ChartTypes, ConfigOverride } from './ChartTypes';
import { ChartBuilders } from './ChartBuilders';
import { ChartNormalizers } from './normalizers';
import { Dict, Dictionary, LayerConfig } from '../@types';
import { objPropExists } from '../helpers/object';
import { buildUrlParams, getRandomString, propExists } from '../helpers/string';
import { query } from '../helpers/array';

export class Charter {
  currentDate: Date;
  currentYear: number;
  ChartHandler: typeof ChartHandler;
  DataHandler: typeof DataHandler;
  charts: Array<Chart>;
  Exporters: typeof Exporters;
  Common: typeof Common;
  ChartTypes: typeof ChartTypes;
  ChartBuilders: typeof ChartBuilders;
  ChartNormalizers: typeof ChartNormalizers;
  configZ = {
    showByDefault: {
      amountSelected: 2,
      startSelectionAt: 'latest',
      others: ['stm'],
    },
    savePeriodSelection: true,
    saveGraphSelection: true,
    colors: [
      '#9E413E',
      '#40699C',
      '#7F9A48',
      '#664E83',
      '#5AC7D2',
      '#CC7B38',
      '#9984B6',
      '#BE4B48',
      '#99BA55',
      '#DAB0AF',
      '#B6C4DB',
      '#F79646',
      '#40699C',
      '#406900',
      '#000000',
    ],
    standardDeviation: 'false',
    graphBullets: 'true',
    decimalDigits: 2,
    gradient: false,
    legend: 'false',
    fillChart: 'false',
    startInWindow: false,
  };

  constructor() {
    this.setCurrentDate();
    this.ChartHandler = ChartHandler;
    this.DataHandler = DataHandler;
    this.Exporters = Exporters;
    this.Common = Common;
    this.ChartTypes = ChartTypes;
    this.ChartBuilders = ChartBuilders;
    this.ChartNormalizers = ChartNormalizers;
  }

  /**
   * When boundaries are separated into different sub folders, Mike wants the
   * boundaries in the lowest folder in the TOC to be the ones we show charts for.
   */
  getEnabledBoundaryFolder(layersConfig): boolean {
    for (let i = layersConfig.length - 1; i >= 0; i -= 1) {
      if (layersConfig[i].type === 'folder') {
        const isEnabled = this.getEnabledBoundaryFolder(layersConfig[i].folder);
        if (typeof isEnabled === 'string') return isEnabled;
        if (isEnabled) return layersConfig[i].id;
      }
    }

    for (let i = layersConfig.length - 1; i >= 0; i -= 1) {
      if (layersConfig[i].type === 'layer' && (layersConfig[i].display === true || layersConfig[i].loadOnly === true)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets an object that maps chart configs to overlays and boundaries that are currently displayed in the map.
   */
  getChartMapping(layersConfig, coords, projection) {
    const chartConfigs = globalThis.App.Config.sources.charts;
    const chartMapping = {
      combined: [],
    };

    const overlays = globalThis.App.Layers.query(
      layersConfig,
      function (layer) {
        if (
          layer.type === 'layer' &&
          layer.mask === false &&
          objPropExists(layer, 'timeseries') &&
          (layer.display === true || layer.loadOnly === true)
        ) {
          return true;
        }
        return false;
      },
      ['overlays', 'hidden']
    );

    const boundariesFolderId = this.getEnabledBoundaryFolder(layersConfig.boundaries);

    const boundaries = [];
    const boundariesFolder = globalThis.App.Layers.query(layersConfig.boundaries, {
      type: 'folder',
      id: boundariesFolderId,
    });
    if (boundariesFolder.length > 0) {
      const items = boundariesFolder[0].folder;
      for (let i = 0, len = items.length; i < len; i += 1) {
        const item = items[i];
        if (item.type === 'layer' && item.mask === false && (item.display === true || item.loadOnly === true)) boundaries.push(item);
      }
    }

    const combObj = {};
    let dataSources = [];
    for (let i = 0, len = overlays.length; i < len; i += 1) {
      const overlay: Dict<any> = overlays[i];
      for (let j = boundaries.length - 1; j >= 0; j -= 1) {
        const boundary = boundaries[j];
        for (let k = 0, chartConfigLength = chartConfigs.length; k < chartConfigLength; k += 1) {
          const chartConfig = chartConfigs[k];
          let overlayIndex = -1;

          // Check overlays in chart config to find any with matching overlay id.
          for (let ii = 0, overlayConfigLength = chartConfig.overlays.length; ii < overlayConfigLength; ii += 1) {
            const configuredOverlay = chartConfig.overlays[ii];
            if (overlay.id === configuredOverlay.forLayerId) {
              overlayIndex = ii;
              break;
            }
          }

          const boundaryIndex = chartConfig.boundaries.indexOf(boundary.id);
          let boundaryTitle = boundary.title;
          let boundaryName = boundary.name;
          let startMonth = null;
          dataSources = [];
          if (overlayIndex !== -1 && boundaryIndex !== -1) {
            const { timeseriesSourceLayerIds, impersonate, type } = chartConfig.overlays[overlayIndex];
            if (objPropExists(chartConfig, 'startMonth')) startMonth = chartConfig.startMonth;

            // Use the boundaryLabels property for the boundary title if present.
            if (objPropExists(chartConfig, 'boundaryLabels') && chartConfig.boundaryLabels.length > boundaryIndex) {
              boundaryTitle = chartConfig.boundaryLabels[boundaryIndex];
            }

            if (objPropExists(chartConfig, 'geoengineBoundaryNames') && chartConfig.geoengineBoundaryNames.length > boundaryIndex) {
              boundaryName = chartConfig.geoengineBoundaryNames[boundaryIndex];
            }

            let id: string;
            for (let ii = 0, sourceLayersLength = timeseriesSourceLayerIds.length; ii < sourceLayersLength; ii += 1) {
              id = timeseriesSourceLayerIds[ii];

              // Support for overriding the timeseriesSourceLayerId if the 'impersonate' property is set.
              if (impersonate) id = impersonate;

              if (type === 'combined') {
                if (!(boundaryName in combObj)) {
                  combObj[boundaryName] = {
                    boundaryTitle: '',
                    boundary: '',
                    ids: [],
                    chartConfigs: [],
                    overlays: [],
                    overlayIndexes: [],
                  };
                }
                combObj[boundaryName].boundaryTitle = boundaryTitle;
                combObj[boundaryName].boundary = boundaries[j];
                combObj[boundaryName].ids.push(id);
                combObj[boundaryName].chartConfigs.push(chartConfig);
                combObj[boundaryName].overlays.push(overlay);
                combObj[boundaryName].overlayIndexes.push(overlayIndex);
              } else {
                const layers = globalThis.App.Layers.query(layersConfig, { id }, ['overlays', 'hidden']);
                if (layers.length > 0) {
                  const layer = layers[0];
                  dataSources.push({
                    url: buildUrlParams(chartConfig.source.url, {
                      boundary,
                      overlay: layer,
                      boundaryName,
                      coords,
                      projection,
                    }),
                    callbackType: chartConfig.source.type,
                    overlayId: layer.id,
                    normalizer: this.getChartNormalizer(chartConfig.source?.normalizer),
                  });
                }
              }
            }
            if (dataSources.length > 0) {
              if (!objPropExists(chartMapping, overlay.id)) {
                chartMapping[overlay.id] = [];
              }
              chartMapping[overlay.id].push({
                overlay: chartConfig.overlays[overlayIndex],
                timeseriesSourceLayerIds,
                overlayId: overlay.id,
                overlayTitle: overlay.title,
                boundaryId: boundary.id,
                boundaryTitle,
                dataSources,
                chartTypes: JSON.parse(JSON.stringify(chartConfig.chartTypes)),
                boundaryName,
                startMonth,
                unit: overlay.unit,
                yAxisLabel: overlay.additionalAttributes.chartYAxisLabel,
                chartTitle: objPropExists(overlay.additionalAttributes, 'chartTitle')
                  ? overlay.additionalAttributes.chartTitle
                  : overlay.additionalAttributes.chartYAxisLabel,
                period: overlay.timeseries.type,
                staticSeasonNames: chartConfig.source.staticSeasonNames,
                id: getRandomString(32, 36),
              });
            }
          }
        }
      }
    }

    // eslint-disable-next-line guard-for-in
    for (const prop in combObj) {
      const { ids, boundary, chartConfigs, overlays, overlayIndexes, boundaryTitle } = combObj[prop];
      for (let z = 0; z < ids.length; z += 1) {
        const id = ids[z];
        const chartConfig = chartConfigs[z];
        const layers = globalThis.App.Layers.query(layersConfig, { id }, ['overlays', 'hidden']);
        if (layers.length > 0) {
          const layer = layers[0];
          if (!(prop in dataSources)) {
            dataSources[prop] = [];
          }
          dataSources[prop].push({
            url: buildUrlParams(chartConfig.source.url, {
              boundary,
              overlay: layer,
              boundaryName: prop,
              coords,
              projection,
            }),
            callbackType: chartConfig.source.type,
            overlayId: layer.id,
            overlayName: chartConfig.overlays[0].title,
            normalizer: this.getChartNormalizer(chartConfig.source?.normalizer),
          });
        }
      }

      chartMapping.combined.push({
        overlay: chartConfigs[0].overlays[overlayIndexes[0]],
        timeseriesSourceLayerIds: [],
        overlayId: 'combined',
        boundaryId: boundary.id,
        boundaryTitle,
        dataSources: dataSources[prop],
        chartTypes: JSON.parse(JSON.stringify(chartConfigs[0].chartTypes)),
        boundaryName: prop,
        startMonth: 1,
        unit: overlays[0].unit,
        yAxisLabel: overlays[0].additionalAttributes.chartYAxisLabel,
        chartTitle: objPropExists(overlays[0].additionalAttributes, 'chartTitle')
          ? overlays[0].additionalAttributes.chartTitle
          : overlays[0].additionalAttributes.chartYAxisLabel,
        period: chartConfigs[0].chartTypes[0].dataType,
        staticSeasonNames: chartConfigs[0].source.staticSeasonNames,
        id: getRandomString(32, 36),
      });
    }

    if (!chartMapping.combined?.length) {
      delete chartMapping.combined;
    }

    return chartMapping;
  }

  getChartNormalizer(fnName: string): Function {
    return this.ChartNormalizers?.[fnName];
  }

  getChartAttributes(chartItem, overlay, boundary, coords) {
    this.setCurrentDate();
    return globalThis.App.RemoteResource.getChartAttributes(chartItem, overlay, boundary, coords);
  }

  getLayerConfiguration(layers: Array<any> = [], results: Array<any> = [], title: string, status = false) {
    let newTitle;
    /*
     * if (typeof status === 'undefined') {
     *   status = false
     * }
     */

    // if (typeof results === 'undefined') results = []

    Object.keys(layers).map((o) => {
      let layer = layers[o];
      if (layer.type === 'folder') {
        if (status !== false) {
          newTitle = `${title} ${layer.title}`;
        } else {
          newTitle = '';
          status = true;
        }

        layer = this.getLayerConfiguration(layer.folder, results, newTitle, status);
      } else if (layer.type === 'layer') {
        if (layer.display === true || layer.loadOnly === true) {
          const finalTitle = `${title} ${layer.title}`;
          results.push({
            layer,
            title: finalTitle.trim(),
          });
        }
      }
      status = true;
    });

    return results;
  }

  getBoundaryConfiguration(boundaries, results) {
    if (typeof results === 'undefined') results = [];

    for (let o = 0, len = boundaries.length; o < len; o += 1) {
      const layer = boundaries[o];
      if (layer.type === 'folder') {
        this.getBoundaryConfiguration(layer.folder, results);
      } else if (layer.type === 'layer') {
        results.push(layer);
      }
    }

    return results;
  }

  setCurrentDate(): void {
    this.currentDate = new Date();
    this.currentYear = this.currentDate.getFullYear();
  }

  /**
   * Get the seasons to display by default in the chart.
   * the default season can be overridden in the template.json except for means which are always shown.
   */
  getDefaultSelectedYears(startMonth: number, years: Array<string>, staticSeasonNames: Array<string>, configOverride: ConfigOverride): Array<string> {
    const defaultConfig = this.configZ.showByDefault;
    let { amountSelected } = defaultConfig;
    let { others } = defaultConfig;
    let { startSelectionAt } = defaultConfig;

    if (typeof configOverride !== 'undefined') {
      if (objPropExists(configOverride, 'amountSelected')) {
        amountSelected = configOverride.amountSelected;
      }
      if (objPropExists(configOverride, 'others')) {
        others = configOverride.others;
      }
      if (objPropExists(configOverride, 'startSelectionAt')) {
        startSelectionAt = configOverride.startSelectionAt;
      }
    }

    let defaultSelection = [];

    // Split up years by years and strings (such as 'Mean')
    const yearValues = [];
    const additionalValues = [];

    for (const year of years) {
      if (/[a-zA-Z]/.test(year)) {
        additionalValues.push(year);
      } else {
        yearValues.push(year);
      }
    }

    if (startSelectionAt === 'earliest') {
      yearValues.sort();
    }

    let selectCount = typeof amountSelected === 'number' ? amountSelected : 0;
    if (selectCount > yearValues.length) selectCount = yearValues.length;

    for (let i = 0; i < selectCount; i += 1) {
      defaultSelection.push(`${yearValues[i]}`);
    }

    const crossYears = [];
    if (startMonth >= 6) {
      for (const yr in defaultSelection) {
        if (typeof defaultSelection[yr] !== 'number') {
          crossYears.push(defaultSelection[yr]);
        } else {
          const tempYear = defaultSelection[yr] + 1;
          const finalYear = `${defaultSelection[yr]}-${tempYear}`;
          crossYears.push(finalYear);
        }
      }
      defaultSelection = crossYears;
    }

    additionalValues.map((val) => {
      if (others.indexOf(val) !== -1) defaultSelection.push(val);
    });

    if (staticSeasonNames) {
      staticSeasonNames.map((name) => {
        defaultSelection.push(name);
      });
    }

    return defaultSelection;
  }

  /**
   * Generate a random color as a hex value.
   * @returns {string}
   */
  getRandomChartColor(): string {
    return `#${'0123456789abcdef'
      .split('')
      .map(function (v, i, a) {
        return i > 5 ? null : a[Math.floor(Math.random() * 16)];
      })
      .join('')
      .toUpperCase()}`;
  }

  /**
   * Generates colors for each season in the `options.fullSeasons` object, then
   * pushes the data to the `configZ.colors` array, which
   * already contains hard-coded values for the first 16 periods. This is why
   * even though the colors are randomly generated, there's consistency to how
   * the initial (and most commonly used) data is displayed.
   * @param {Dictionary} options
   * @returns {Record<string, string>}
   */
  getChartColors(options: Dictionary): Record<string, string> {
    let chartColors = {};
    if (options.customColors) {
      chartColors = options.customColors;
    }
    const configUrlColors = this.configZ.colors;
    const totalYears = options.fullSeasons;
    let yearsLength = totalYears.length;

    if (yearsLength > configUrlColors.length) {
      yearsLength -= configUrlColors.length;
      while (yearsLength > 0) {
        configUrlColors.push(this.getRandomChartColor());
        yearsLength -= 1;
      }
    }

    for (let w = 0; w < options.fullSeasons.length; w += 1) {
      chartColors[totalYears[w]] = configUrlColors[w];
    }

    return chartColors;
  }

  getChartItem(chartId: string): Chart {
    for (const mc in this.charts) {
      if (this.charts[mc].id === chartId) {
        return this.charts[mc];
      }
    }
  }

  /*
   * getShortTitle(tabTitle: string): string {
   *   let output: string
   *   if (tabTitle.length > 15) {
   *     output = `${tabTitle.substring(0, 14)}...`
   *     // tabTitle = tabTitle + '...'
   *   }
   *   return output
   * }
   */

  /**
   * For the new means, parse the mean name to get a more readable name for display.
   */
  /*
   * getSeasonDisplayName(season: string): string {
   *   season = season.toString()
   *   if (season.indexOf('_') !== -1) {
   *     let parts = season.split('_')
   *     let type = parts[0].split('')
   */

  /*
   *     let startYear, endYear
   *     if (parts[1].indexOf('-') !== -1) {
   *       // Is in format YYYY-YYYY
   *       let splitYear = parts[1].split('-')
   *       startYear = splitYear[0]
   *       endYear = splitYear[1]
   *     } else {
   *       startYear = parts[1]
   *       endYear = parts[parts.length - 1]
   *     }
   */

  /*
   *     type[0] = type[0].toUpperCase()
   *     season = `${type.join('')} (${startYear}-${endYear})`
   *   }
   *   return season
   *   // season = season.toString()
   *   // if (season.indexOf('_') !== -1) {
   *   //   let parts = season.split('_')
   *   //   let type = parts[0].split('')
   *   //   type[0] = type[0].toUpperCase()
   *   //   season = type.join('') + ' (' + parts[1] + '-' + parts[parts.length - 1] + ')'
   *   // }
   *   // return season
   * }
   */
}
