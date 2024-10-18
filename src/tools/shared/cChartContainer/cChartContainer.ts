import { getRandomString, isStaticSeasonName, isValidPeriodName } from '../../../helpers/string';
import { convertPathToObjReference, objPropExists } from '../../../helpers/object';
import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Transport } from '../../../Network/Transport';
import { DataHandler } from '../../../Charter/DataHandler';
import { Dict } from '../../../@types';
import { addCurrentYearToYearsList, formatYearCategory, formatMonthCategory, getCategoryBalloonFunction } from '../../../helpers/chart';
import { isEmpty } from '../../../helpers/validation';
import { isArrayEqual } from '../../../helpers/array';
import { ChartHandler } from '../../../Charter/ChartHandler';
import { getPeriodsPerYear } from '../../../helpers/periodicity';

async function onFeatureInfoUpdated(callbackObj, postingObj) {
  let attributes;
  const extendedTool = callbackObj;
  const mapperWindow = postingObj;
  extendedTool.attributesUpdated = true;

  const { chartAttributes } = extendedTool;
  const layersConfig = globalThis.App.Layers.getLayersConfigById(mapperWindow.layersConfigId);
  const layers = {};

  // Most of the chart attributes can be pulled from the configs but
  // a fews parts need to be added later from the feature info.
  for (let i = 0; i < chartAttributes.length; i += 1) {
    attributes = chartAttributes[i];
    let overlay;
    let boundary;
    if (objPropExists(layers, attributes.overlayId)) {
      overlay = layers[attributes.overlayId];
    } else if (attributes.overlay.type === 'combined') {
      for (let j = 0; j < attributes.dataSources.length; j += 1) {
        overlay = globalThis.App.Layers.query(layersConfig, { id: attributes.dataSources[j].overlayId }, ['overlays', 'hidden'])[0];
        layers[attributes.dataSources[j].overlayId] = overlay;
      }
    } else {
      overlay = globalThis.App.Layers.query(layersConfig, { id: attributes.overlayId }, ['overlays', 'hidden'])[0];
      layers[attributes.overlayId] = overlay;
    }

    if (objPropExists(layers, attributes.boundaryId)) {
      boundary = layers[attributes.boundaryId];
    } else {
      boundary = globalThis.App.Layers.query(layersConfig.boundaries, { id: attributes.boundaryId })[0];
      layers[attributes.boundaryId] = boundary;
    }

    const newAttributes = globalThis.App.Charter.getChartAttributes(attributes, overlay, boundary);
    for (const prop in newAttributes) {
      extendedTool.chartAttributes[i][prop] = newAttributes[prop];
    }
  }

  // If the chart handler exists, we know the chart is built and can set the title.
  // If not, the title will be set once the chart is built.
  if (extendedTool.chartHandler) {
    attributes = extendedTool.getAttributes();
    if (attributes.layerName) {
      extendedTool.chartHandler.setTitle(attributes.id, attributes.layerName);
    }
  }

  extendedTool.owningBlock.fire('attributesupdated', extendedTool);

  await extendedTool.getData();
}

export const cChartContainer = {
  options: {
    delayRender: true,
    requiredBlocks: ['cGraphTool', 'cMapWindow', 'cMapPanel'],
    groupBy: 'cMapWindow',
    events: [
      'datatypechanged',
      'graphtypechanged',
      'periodschanged',
      'boundaryidchanged',
      'periodformatchanged',
      'attributesupdated',
      'rendercomponent',
      'activate',
      'periodsync',
      'truncatingstart',
      'truncatingend',
      'startpointset',
      'overflowmenushow',
    ],
  },
  getDefaultChartOptions(selectedChart, chartAttributes) {
    const title = chartAttributes.overlayTitle;
    const yAxisTitle = chartAttributes.yAxisLabel;

    return {
      /**
       * options: The chart configurations supported by AmCharts. Passed directly into the AmCharts.makeChart function.
       *
       * Documentation: https://docs.amcharts.com/3/
       */
      options: this.chartOptions[selectedChart].getAmChartsOptions(this, chartAttributes),
      /**
       * events: Allows setting event handlers on the chart.
       */
      events: {},
      /**
       * custom: Custom objects used for the chart.
       *
       * Custom objects are passed as the string name to the chart handler and automatically assigned to
       * a class in either (core) globalThis.App.Charter[objectKey] or custom.amcharts[objectKey]
       */
      custom: this.chartOptions[selectedChart].getCustomOptions(this, chartAttributes),
    };
  },
  chartOptions: {
    annual: {
      canTruncate: false,
      chartTypes: {
        bar: 'BarGraph',
        line: 'LineGraph',
      },
      periodFormat: 'years',
      cumulative: false,
      getName(chartAttributes) {
        return globalThis.App.Config.sources.periods[chartAttributes.period].fullName;
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return {
          type: 'serial',
          theme: 'none',
          pathToImages: 'amcharts/images/',
          columnWidth: 1,
          categoryField: 'x',
          categoryAxis: {
            parseDates: true,
            markPeriodChange: false,
            gridPosition: 'start',
            autoGridCount: false,
            equalSpacing: true,
            gridCount: 12,
            labelFunction: formatMonthCategory,
          },
          valueAxes: [
            {
              title: chartAttributes.yAxisLabel,
              fontSize: 8,
              id: 'ValueAxis-1',
              position: 'left',
              axisAlpha: 0,
            },
          ],
          chartCursor: {
            categoryBalloonFunction: getCategoryBalloonFunction(chartAttributes.startMonth, chartAttributes.period),
          },
          export: {
            enabled: true,
            menu: [],
            dataDateFormat: 'MM-DD',
            legend: {
              position: 'bottom',
            },
          },
          chartScrollbar: {
            autoGridCount: false,
            gridCount: 0,
            scrollbarHeight: 15,
          },
        };
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          /**
           * chartBuilder: Manipulates chart data, sets chart specific defaults, adds graphs to the chart, etc.
           *
           * Objects in core:
           *     DefaultChartBuilder: A default chart builder used if none is specified.
           *     ChartBuilder: A basic chart builder used for handling most charts.
           *     AnnualChartBuilder: A special chart builder used for displaying data across years.
           *     GradientChartBuilder: A special chart builder used for displaying a gradient next to a data chart.
           *     MinMaxChartBuilder: A chart builder that also calculates min, max, and average.
           */
          chartBuilder: 'ChartBuilder',

          /**
           * chartType: Dynamically builds out graphs to be added to the chart.
           *
           * Objects in core:
           *     StaticChartType: A default chart type if none is specified. Does nothing. Use if statically assigning
           * graphs through the AmCharts configs. LineGraph: Dynamically builds out basic line graphs based on the
           * selected years. BarGraph: Dynamically builds out basic bar graphs based on the selected years.
           * AnnualBarGraph: Dynamically build out special bar graphs to display specific period across years.
           * AnnualLineGraph: Dynamically build out special line graphs to display specific period across years.
           * LineGraphWithSD: Same as LineGraph but adds +-1 standard deviation graphs. MinMaxLineGraph: Same as
           * LineGraph but adds the min, max, and averate lines. GradientGraph: Special chart type for gradient graphs.
           */
          chartType: 'BarGraph',

          /**
           * exporters: Defines objects used for exporting this chart.
           *
           * Supported formats: PNG, CSV
           */
          exporters: {
            /**
             * PNG: Exports chart as png.
             *
             * Objects in core:
             *     defaultExport: Uses Basic AmCharts functionality.
             */
            PNG: 'defaultExport',

            /**
             * CSV: Exports chart as csv.
             *
             * Objects in core:
             *     monthlyExport: Exports monthly data.
             *     yearlyExport: Exports annual data.
             *     sevenDayExport: Special exporter used for weekly data.
             */
            CSV: 'monthlyExport',
          },
        };
      },
    },
    annual_cumulative: {
      canTruncate: true,
      chartTypes: {
        bar: 'BarGraph',
        line: 'LineGraph',
      },
      periodFormat: 'years',
      cumulative: true,
      getName(chartAttributes) {
        return 'Cumulative';
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return {
          type: 'serial',
          theme: 'none',
          pathToImages: 'amcharts/images/',
          columnWidth: 1,
          categoryField: 'x',
          categoryAxis: {
            parseDates: true,
            equalSpacing: false,
            markPeriodChange: false,
            gridPosition: 'start',
            autoGridCount: false,
            gridCount: 12,
            labelFunction: formatMonthCategory,
          },
          valueAxes: [
            {
              title: chartAttributes.yAxisLabel,
              fontSize: 8,
              id: 'ValueAxis-1',
              position: 'left',
              axisAlpha: 0,
            },
          ],
          chartCursor: {
            categoryBalloonFunction: getCategoryBalloonFunction(chartAttributes.startMonth, chartAttributes.period),
            listeners: [
              {
                event: 'changed',
                method(e) {
                  e.chart.lastCursorPosition = e.index;
                },
              },
            ],
          },
          export: {
            enabled: true,
            menu: [],
            dataDateFormat: 'MM-DD',
          },
          chartScrollbar: {
            autoGridCount: false,
            gridCount: 0,
            scrollbarHeight: 15,
          },
        };
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          chartBuilder: 'ChartBuilder',
          chartType: 'BarGraph',
          exporters: {
            PNG: 'defaultExport',
            CSV: 'monthlyExport',
          },
        };
      },
    },
    interannual: {
      canTruncate: false,
      chartTypes: {
        bar: 'AnnualBarGraph',
        line: 'AnnualLineGraph',
      },
      periodFormat: 'periods',
      cumulative: false,
      getName(chartAttributes) {
        return 'Interannual';
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return {
          type: 'serial',
          theme: 'none',
          pathToImages: 'amcharts/images/',
          columnWidth: 1,
          categoryField: 'x',
          categoryAxis: {
            fontSize: 9,
            labelRotation: 90,
            minHorizontalGap: 5,
            markPeriodChange: false,
            autoGridCount: true,
          },
          valueAxes: [
            {
              title: chartAttributes.yAxisLabel,
              fontSize: 8,
              id: 'ValueAxis-1',
              position: 'left',
              axisAlpha: 0,
            },
          ],
          chartCursor: {},
          export: {
            enabled: true,
            menu: [],
            legend: {
              position: 'bottom',
            },
          },
          chartScrollbar: {
            autoGridCount: false,
            gridCount: 0,
            scrollbarHeight: 15,
          },
        };
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          chartBuilder: 'AnnualChartBuilder',
          chartType: 'AnnualBarGraph',
          exporters: {
            PNG: 'defaultExport',
            CSV: 'yearlyExport',
          },
        };
      },
    },
    minmax: {
      canTruncate: false,
      chartTypes: {
        bar: 'MinMaxBarGraph',
        line: 'MinMaxLineGraph',
      },
      periodFormat: 'years',
      cumulative: false,
      getName(chartAttributes) {
        return globalThis.App.Config.sources.periods[chartAttributes.period].fullName;
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return {
          type: 'serial',
          theme: 'none',
          pathToImages: 'amcharts/images/',
          columnWidth: 1,
          categoryField: 'x',
          categoryAxis: {
            parseDates: true,
            equalSpacing: false,
            markPeriodChange: false,
            gridPosition: 'start',
            autoGridCount: false,
            gridCount: 12,
            labelFunction: formatMonthCategory,
          },
          valueAxes: [
            {
              title: chartAttributes.yAxisLabel,
              fontSize: 8,
              id: 'ValueAxis-1',
              position: 'left',
              axisAlpha: 0,
            },
          ],
          chartCursor: {
            categoryBalloonFunction: getCategoryBalloonFunction(chartAttributes.startMonth, chartAttributes.period),
          },
          export: {
            enabled: true,
            menu: [],
            dataDateFormat: 'MM-DD',
            legend: {
              position: 'bottom',
            },
          },
          chartScrollbar: {
            autoGridCount: false,
            gridCount: 0,
            scrollbarHeight: 15,
          },
        };
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          chartBuilder: 'MinMaxChartBuilder',
          chartType: 'LineGraph',
          exporters: {
            PNG: 'defaultExport',
            CSV: 'monthlyExport',
          },
        };
      },
    },
    minmax_anomaly: {
      canTruncate: false,
      chartTypes: {
        bar: 'MinMaxBarGraph',
        line: 'MinMaxAnomalyLineGraph',
      },
      periodFormat: 'years',
      cumulative: false,
      getName(chartAttributes) {
        return globalThis.App.Config.sources.periods[chartAttributes.period].fullName;
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return {
          type: 'serial',
          theme: 'none',
          pathToImages: 'amcharts/images/',
          columnWidth: 1,
          categoryField: 'x',
          categoryAxis: {
            parseDates: true,
            equalSpacing: false,
            markPeriodChange: false,
            gridPosition: 'start',
            autoGridCount: false,
            gridCount: 12,
            labelFunction: formatMonthCategory,
          },
          valueAxes: [
            {
              title: chartAttributes.yAxisLabel,
              fontSize: 8,
              id: 'ValueAxis-1',
              position: 'left',
              axisAlpha: 0,
            },
          ],
          chartCursor: {
            categoryBalloonFunction: getCategoryBalloonFunction(chartAttributes.startMonth, chartAttributes.period),
          },
          export: {
            enabled: true,
            menu: [],
            dataDateFormat: 'MM-DD',
            legend: {
              position: 'bottom',
            },
          },
          chartScrollbar: {
            autoGridCount: false,
            gridCount: 0,
            scrollbarHeight: 15,
          },
        };
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          chartBuilder: 'MinMaxChartBuilder',
          chartType: 'LineGraph',
          exporters: {
            PNG: 'defaultExport',
            CSV: 'monthlyExport',
          },
        };
      },
    },
    minmax_cumulative: {
      canTruncate: true,
      chartTypes: {
        bar: 'MinMaxBarGraph',
        line: 'MinMaxLineGraph',
      },
      periodFormat: 'years',
      cumulative: true,
      getName(chartAttributes) {
        return 'Cumulative';
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return {
          type: 'serial',
          theme: 'none',
          pathToImages: 'amcharts/images/',
          columnWidth: 1,
          categoryField: 'x',
          categoryAxis: {
            parseDates: true,
            equalSpacing: false,
            markPeriodChange: false,
            gridPosition: 'start',
            autoGridCount: false,
            gridCount: 12,
            labelFunction: formatMonthCategory,
          },
          valueAxes: [
            {
              title: chartAttributes.yAxisLabel,
              fontSize: 8,
              id: 'ValueAxis-1',
              position: 'left',
              axisAlpha: 0,
            },
          ],
          chartCursor: {
            categoryBalloonFunction: getCategoryBalloonFunction(chartAttributes.startMonth, chartAttributes.period),
          },
          export: {
            enabled: true,
            menu: [],
            dataDateFormat: 'MM-DD',
          },
          chartScrollbar: {
            autoGridCount: false,
            gridCount: 0,
            scrollbarHeight: 15,
          },
        };
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          chartBuilder: 'MinMaxChartBuilder',
          chartType: 'LineGraph',
          exporters: {
            PNG: 'defaultExport',
            CSV: 'monthlyExport',
          },
        };
      },
    },
    annual_prelim: {
      canTruncate: false,
      chartTypes: {
        bar: 'GefsBarGraph',
        line: 'GefsLineGraph',
      },
      periodFormat: 'years',
      cumulative: false,
      getName(chartAttributes) {
        return globalThis.App.Config.sources.periods[chartAttributes.period].fullName;
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return itemDefinition.chartOptions.annual.getAmChartsOptions(itemDefinition, chartAttributes);
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          chartBuilder: 'PrelimChartBuilder',
          chartType: 'GefsBarGraph',
          exporters: {
            PNG: 'defaultExport',
            CSV: 'monthlyExport',
          },
        };
      },
    },
    annual_cumulative_prelim: {
      canTruncate: false,
      chartTypes: {
        bar: 'PrelimBarGraph',
        line: 'PrelimLineGraph',
      },
      periodFormat: 'years',
      cumulative: false,
      getName(chartAttributes) {
        return 'Cumulative';
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return itemDefinition.chartOptions.annual_cumulative.getAmChartsOptions(itemDefinition, chartAttributes);
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          chartBuilder: 'PrelimChartBuilder',
          chartType: 'PrelimLineGraph',
          exporters: {
            PNG: 'defaultExport',
            CSV: 'monthlyExport',
          },
        };
      },
    },
    interannual_prelim: {
      chartTypes: {
        bar: 'AnnualBarGraph',
        line: 'AnnualLineGraph',
      },
      periodFormat: 'periods',
      cumulative: false,
      getName(chartAttributes) {
        return 'Interannual';
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return itemDefinition.chartOptions.interannual.getAmChartsOptions(itemDefinition, chartAttributes);
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          chartBuilder: 'AnnualPrelimChartBuilder',
          chartType: 'AnnualLineGraph',
          exporters: {
            PNG: 'defaultExport',
            CSV: 'yearlyExport',
          },
        };
      },
    },

    annual_gefs: {
      canTruncate: false,
      chartTypes: {
        bar: 'GefsBarGraph',
        line: 'GefsLineGraph',
      },
      periodFormat: 'years',
      cumulative: false,
      getName(chartAttributes) {
        return globalThis.App.Config.sources.periods[chartAttributes.period].fullName;
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return itemDefinition.chartOptions.annual.getAmChartsOptions(itemDefinition, chartAttributes);
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          chartBuilder: 'GefsChartBuilder',
          chartType: 'GefsBarGraph',
          exporters: {
            PNG: 'defaultExport',
            CSV: 'monthlyExport',
          },
        };
      },
    },
    interannual_gefs: {
      chartTypes: {
        bar: 'AnnualBarGraph',
        line: 'AnnualLineGraph',
      },
      periodFormat: 'periods',
      cumulative: false,
      getName(chartAttributes) {
        return 'Interannual';
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return itemDefinition.chartOptions.interannual.getAmChartsOptions(itemDefinition, chartAttributes);
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          chartBuilder: 'AnnualGefsChartBuilder',
          chartType: 'AnnualGefsLineGraph',
          exporters: {
            PNG: 'defaultExport',
            CSV: 'yearlyExport',
          },
        };
      },
    },
    annual_cumulative_gefs: {
      canTruncate: true,
      chartTypes: {
        bar: 'GefsBarGraph',
        line: 'GefsLineGraph',
      },
      periodFormat: 'years',
      cumulative: true,
      getName(chartAttributes) {
        return 'Cumulative';
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return itemDefinition.chartOptions.annual_cumulative.getAmChartsOptions(itemDefinition, chartAttributes);
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          chartBuilder: 'GefsChartBuilder',
          chartType: 'GefsLineGraph',
          exporters: {
            PNG: 'defaultExport',
            CSV: 'monthlyExport',
          },
        };
      },
    },
    year: {
      canTruncate: false,
      chartTypes: {
        line: 'YearlyLineGraph',
      },
      periodFormat: 'years',
      cumulative: false,
      getName(chartAttributes) {
        return globalThis.App.Config.sources.periods[chartAttributes.period].fullName;
      },
      getAmChartsOptions(itemDefinition, chartAttributes) {
        return {
          type: 'serial',
          theme: 'none',
          pathToImages: 'amcharts/images/',
          columnWidth: 1,
          categoryField: 'x',
          categoryAxis: {
            parseDates: true,
            markPeriodChange: false,
            gridPosition: 'start',
            autoGridCount: false,
            equalSpacing: true,
            gridCount: 12,
            labelFunction: formatYearCategory,
          },
          valueAxes: [
            {
              title: chartAttributes.yAxisLabel,
              fontSize: 8,
              id: 'ValueAxis-1',
              position: 'left',
              axisAlpha: 0,
            },
          ],
          chartCursor: {
            categoryBalloonFunction: getCategoryBalloonFunction(chartAttributes.startMonth, chartAttributes.period),
          },
          export: {
            enabled: true,
            menu: [],
            dataDateFormat: 'yyyy',
            legend: {
              position: 'bottom',
            },
          },
          chartScrollbar: {
            autoGridCount: false,
            gridCount: 0,
            scrollbarHeight: 15,
          },
        };
      },
      getCustomOptions(itemDefinition, chartAttributes) {
        return {
          /**
           * chartBuilder: Manipulates chart data, sets chart specific defaults, adds graphs to the chart, etc.
           *
           * Objects in core:
           *     DefaultChartBuilder: A default chart builder used if none is specified.
           *     ChartBuilder: A basic chart builder used for handling most charts.
           *     AnnualChartBuilder: A special chart builder used for displaying data across years.
           *     GradientChartBuilder: A special chart builder used for displaying a gradient next to a data chart.
           *     MinMaxChartBuilder: A chart builder that also calculates min, max, and average.
           */
          chartBuilder: 'YearlyChartBuilder',

          /**
           * chartType: Dynamically builds out graphs to be added to the chart.
           *
           * Objects in core:
           *     StaticChartType: A default chart type if none is specified. Does nothing. Use if statically assigning
           * graphs through the AmCharts configs. LineGraph: Dynamically builds out basic line graphs based on the
           * selected years. BarGraph: Dynamically builds out basic bar graphs based on the selected years.
           * AnnualBarGraph: Dynamically build out special bar graphs to display specific period across years.
           * AnnualLineGraph: Dynamically build out special line graphs to display specific period across years.
           * LineGraphWithSD: Same as LineGraph but adds +-1 standard deviation graphs. MinMaxLineGraph: Same as
           * LineGraph but adds the min, max, and averate lines. GradientGraph: Special chart type for gradient graphs.
           */
          chartType: 'YearlyLineGraph',

          /**
           * exporters: Defines objects used for exporting this chart.
           *
           * Supported formats: PNG, CSV
           */
          exporters: {
            /**
             * PNG: Exports chart as png.
             *
             * Objects in core:
             *     defaultExport: Uses Basic AmCharts functionality.
             */
            PNG: 'defaultExport',

            /**
             * CSV: Exports chart as csv.
             *
             * Objects in core:
             *     monthlyExport: Exports monthly data.
             *     yearlyExport: Exports annual data.
             *     sevenDayExport: Special exporter used for weekly data.
             */
            CSV: 'yearlyExport',
          },
        };
      },
    },
  },

  // Although we configure the charts in the template.json in two places, we only use one at a time.
  enabledChartContainerId: null,

  // This method will be ran before any blocks are created.
  init(blueprint) {
    // Get a reference to the cMapPanel and cGraphTool blueprints.
    const { requiredBlockBlueprints } = blueprint;
    let graphToolBlueprint;
    let mapPanelBlueprint;
    for (let i = 0, len = requiredBlockBlueprints.length; i < len; i += 1) {
      const requiredBlock = requiredBlockBlueprints[i];
      if (requiredBlock.blockConfig.name === 'cMapPanel') {
        mapPanelBlueprint = requiredBlock;
      }
      if (requiredBlock.blockConfig.name === 'cGraphTool') {
        graphToolBlueprint = requiredBlock;
      }
    }

    // Track all other chart container blocks that are created.
    blueprint.trackedBlocks = [];

    // Set the enabled chart container id to the default. Since this method can be
    // called multiple times by different copies of the chart container blueprint,
    // we only set it once by checking for null value.
    if (blueprint.itemDefinition.enabledChartContainerId === null && blueprint.blockConfig.isDefault === true) {
      blueprint.itemDefinition.enabledChartContainerId = blueprint.id;
    }

    mapPanelBlueprint.on(
      'blockcreated',
      function (blueprint, mapPanelBlock) {
        // Open charts on map click but only if the graph tool is selected.
        mapPanelBlock.on(
          'click',
          function (callbackObject, postingObject, eventObject) {
            const blueprint = callbackObject;
            if (blueprint.id !== blueprint.itemDefinition.enabledChartContainerId) return;
            const graphTool = graphToolBlueprint.block.extendedTool;

            // Check OpenLayers panel if the chart tool is active.
            // Return to prevent the chart container from displaying
            if (graphTool.enabled === false || graphTool?.component?.pressed === false) return;
            if (graphTool?.olExtComponent?.getActive() === false) return;
            // if (postingObject?.component?.activeDataQueryComponent && postingObject.component.activeDataQueryComponent !== 'chart') return;

            const mapWindowBlock = mapPanelBlock.getReferencedBlock('cMapWindow');
            const { layersConfigId } = mapWindowBlock.extendedTool;
            const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
            const { map } = eventObject;
            const projection = map.getView().getProjection().getCode();
            // Get mapping of chart configs to layer configs.
            const chartMapping = globalThis.App.Charter.getChartMapping(layersConfig, eventObject.coordinate, projection);

            // Destroy any open chart windows belonging to a map window before creating new ones.
            const { trackedBlocks } = blueprint;
            for (let i = 0, len = trackedBlocks.length; i < len; i += 1) {
              const trackedBlock = trackedBlocks[i];
              if (trackedBlock.rendered === true) trackedBlock.unRender();
              trackedBlock.remove();
            }
            blueprint.trackedBlocks = [];

            blueprint.undelayRender();

            // For each item in the chart mapping, create a new chart block.
            // First one will create it on this blueprint but subsequent ones will
            // automatically create a copy of this blueprint and create a block for it.
            let renderedParent;
            for (const overlayId in chartMapping) {
              const chartAttributes = chartMapping[overlayId];

              const chartContainerBlock = blueprint.createBlock();
              blueprint.trackedBlocks.push(chartContainerBlock);

              renderedParent = chartContainerBlock.getClosestRenderedParent();
              chartContainerBlock.chartAttributes = chartAttributes;
              chartContainerBlock.selectedBoundaryId = chartAttributes[0].boundaryId;
              chartContainerBlock.lastClickCoord = eventObject.coordinate;
            }
            renderedParent.render();
          },
          blueprint
        );
      },
      blueprint
    );
  },
  createExtendedTool(owningBlock) {
    const uniqueId = `chart-container-${getRandomString(32, 36)}`;

    // When docking charts in or out of a map window, we need to pass state between them.
    const selectedBoundaryId = owningBlock.selectedBoundaryId ? owningBlock.selectedBoundaryId : null;
    const selectedDataType = owningBlock.selectedDataType ? owningBlock.selectedDataType : owningBlock.chartAttributes[0].chartTypes[0].dataType;
    const selectedGraphType = owningBlock.selectedGraphType
      ? owningBlock.selectedGraphType
      : owningBlock.chartAttributes[0].chartTypes[0].graphTypes[0];
    const selectedPeriods = owningBlock.selectedPeriods ? owningBlock.selectedPeriods : ['stm', 2016, 2015];
    const periodFormat = owningBlock.periodFormat ? owningBlock.periodFormat : 'years';
    let addLegend;
    if (owningBlock.hasOwnProperty('addLegend')) addLegend = owningBlock.addLegend;

    const extendedTool: Record<string, any> = {
      owningBlock,
      truncateStartPeriod: null,
      truncating: false,
      uniqueId,
      // Prevent the first request for timeseries from beings sent multiple times.
      isInitialRequest: false,
      // Store the last request made so we can cancel them if new requests
      // are made but the previous ones have not returned yet.
      // A chart can get data from multiple sources so lastRequests is an array.
      lastRequests: [],
      chartAttributes: owningBlock.chartAttributes,
      // Value in the cPeriodTypeCombo tool.
      selectedDataType,
      // Value in the cChartTypeCombo tool.
      selectedGraphType,
      // Value in the cYearsCombo tool.
      selectedPeriods,
      // Either periods for interannual charts or years for all other charts.
      periodFormat,
      // Value in the cZonesCombo tool.
      selectedBoundaryId,
      chartHandler: null as ChartHandler,
      dataHandler: null as DataHandler,
      mask: null,
      isMasked: false,

      canTruncate() {
        const dataType = this.selectedDataType;
        return this.owningBlock.itemDefinition.chartOptions[dataType].canTruncate;
      },
      startTruncating() {
        const { chart } = this.getChartObj();
        if (this.canTruncate() === false || this.truncating === true) return;
        this.truncating = true;
        const extendedTool = this;
        this.truncateCallback = function (e) {
          // The chart contains all of our graphs, and each one has the same "currentDataItem" which includes the Date object of the selected item.
          const startPeriod = chart.graphs[0].currentDataItem?.category;
          if (startPeriod) {
            extendedTool.truncateStartPeriod = startPeriod;
            extendedTool.owningBlock.fire('startpointset', extendedTool);
            extendedTool.refreshChart();
          }
        };

        // AmCharts does not have an event for clicking the chart so register to the dom element.
        chart.chartDiv.addEventListener('click', this.truncateCallback);
        this.owningBlock.fire('truncatingstart', this);
      },
      stopTruncating() {
        if (this.truncating === false) return;
        const { chart } = this.getChartObj();
        chart.chartDiv.removeEventListener('click', this.truncateCallback);
        this.truncating = false;
        this.owningBlock.fire('truncatingend', this);
      },
      resetStartPoint() {
        this.truncateStartPeriod = null;
        this.refreshChart();
      },
      getChartObj() {
        const attributes = this.getAttributes();
        return this.chartHandler.getChartById(attributes.id);
      },
      destroy() {
        this.owningBlock.destroy();
      },
      setSelectedBoundaryId(boundaryId) {
        this.maskComponent();
        this.selectedBoundaryId = boundaryId;
        this.owningBlock.fire('boundaryidchanged', this);
        this.getData();
      },
      setSelectedPeriods(periods) {
        // if (periods === this.selectedPeriods) return;
        this.selectedPeriods = periods;
        this.owningBlock.fire('periodschanged', this);
        if (this.owningBlock.rendered === true && this.dataHandler !== null) this.refreshChart();
      },
      syncSelectedPeriods(periodList) {
        this.owningBlock.fire('periodsync', this, periodList);
      },
      setSelectedGraphType(graphType) {
        this.selectedGraphType = graphType;
        const attributes = this.getAttributes();
        if (this.chartHandler !== null) {
          const chart = this.chartHandler.getChartById(attributes.id);
          if (chart) chart.setChartType(chart.getNewChartType(this.getSelectedGraphType()));
        }
        this.owningBlock.fire('graphtypechanged', this);
        this.refreshChart();
      },
      setSelectedDataType(dataType) {
        if (this.selectedDataType === dataType) return;
        this.selectedDataType = dataType;
        const chartConfig = this.getChartOptions();
        const html = `<div id="${this.component.id}-chart"></div>`;
        this.component.update(html);
        this.chartHandler = new ChartHandler(chartConfig);
        this.refreshChart();
        this.owningBlock.fire('datatypechanged', this);
      },
      setSelectedPeriodFormat(periodFormat) {
        if (this.periodFormat === periodFormat) return;
        this.periodFormat = periodFormat;
        this.owningBlock.fire('periodformatchanged', this);
      },
      getPeriodFormat(dataType) {
        if (typeof dataType === 'undefined') dataType = this.selectedDataType;
        return this.owningBlock.itemDefinition.chartOptions[dataType].periodFormat;
      },
      getDataTypeName(dataType) {
        if (typeof dataType === 'undefined') dataType = this.selectedDataType;
        return this.owningBlock.itemDefinition.chartOptions[dataType].getName(this.getAttributes());
      },
      // Get the configured graph types for the selected data type in the charts.json.
      getGraphTypes() {
        const attributes = this.getAttributes();
        const { chartTypes } = attributes;
        const { selectedDataType } = this;

        for (let i = 0, len = chartTypes.length; i < len; i += 1) {
          if (chartTypes[i].dataType === selectedDataType) {
            return chartTypes[i].graphTypes;
          }
        }

        return null;
      },
      // Get the chart types in the charts.json.
      getChartTypes() {
        const { chartAttributes } = this;
        const boundaryId = this.selectedBoundaryId;

        for (let i = 0, len = chartAttributes.length; i < len; i += 1) {
          const attributes = chartAttributes[i];
          if (attributes.boundaryId === boundaryId) {
            return attributes.chartTypes;
          }
        }
      },
      // Gets the attributes for the selected boundary.
      getAttributes() {
        const boundaryId = this.selectedBoundaryId;

        for (let i = 0, len = this.chartAttributes.length; i < len; i += 1) {
          const attributes = this.chartAttributes[i];
          if (boundaryId === null || attributes.boundaryId === boundaryId) {
            return attributes;
          }
        }
        return null;
      },

      getAllAttributes() {
        return this.chartAttributes;
      },
      // Get the AmCharts configurations for a legend.
      getLegendOptions(legendPosition) {
        return {
          rollOverGraphAlpha: 0.2,
          switchable: false,
          labelText: '[[title]]',
          position: legendPosition,
          fontSize: 9,
          autoMargins: false,
          marginLeft: 5,
          marginRight: 0,
          spacing: 5,
          valueText: '',
          valueWidth: 0,
        };
      },
      // Get the actual name of the chart type object in mapper.
      getSelectedGraphType() {
        const attributes = this.getAttributes();
        const graphType = this.selectedGraphType;
        const { selectedDataType } = this;
        return this.owningBlock.itemDefinition.chartOptions[selectedDataType].chartTypes[graphType];
      },
      getChartOptions() {
        const { selectedDataType } = this;
        const attributes = this.getAttributes();
        const chartOptions = [];
        const defaultOptions = this.owningBlock.itemDefinition.getDefaultChartOptions(selectedDataType, attributes);

        const { scrollbarBackgroundColor } = this.owningBlock.blockConfig;
        const { scrollbarSelectedBackgroundColor } = this.owningBlock.blockConfig;
        if (typeof scrollbarBackgroundColor !== 'undefined') {
          defaultOptions.options.chartScrollbar.backgroundColor = scrollbarBackgroundColor;
        }
        if (typeof scrollbarSelectedBackgroundColor !== 'undefined') {
          defaultOptions.options.chartScrollbar.selectedBackgroundColor = scrollbarSelectedBackgroundColor;
        }

        defaultOptions.custom.chartType = this.getSelectedGraphType();

        defaultOptions.options.legend = this.getLegendOptions('bottom');

        if (attributes.period === 'week' || attributes.period === 'firedanger_week') {
          defaultOptions.custom.exporters.CSV = 'sevenDayExport';
        } else if (attributes.period === 'day') {
          defaultOptions.custom.exporters.CSV = 'oneDayExport';
        }

        if (attributes.layerName && attributes.layerName !== 'null') {
          defaultOptions.options.titles = [
            {
              text: attributes.layerName,
              size: 12,
            },
          ];
        }

        chartOptions.push({
          id: attributes.id,
          name: `${this.uniqueId}-chart`,
          options: defaultOptions.options,
          custom: defaultOptions.custom,
          events: defaultOptions.events,
        });

        // Gradient charts are no longer used.
        if (globalThis.App.Charter.configZ.gradient) {
          const gradientOptions = {
            options: {
              type: 'serial',
              theme: 'light',
              categoryField: 'date',
              sequencedAnimation: false,
              categoryAxis: {
                markPeriodChange: false,
                gridPosition: 'start',
                labelsEnabled: false,
                gridAlpha: false,
                fontSize: 9,
                startOnAxis: true,
                autoGridCount: true,
              },
              legend: {
                enabled: true,
              },
              export: {
                enabled: true,
                menu: [], // disable menu
              },
              trendLines: [],
              guides: [],
              valueAxes: [
                {
                  fontSize: 8,
                  id: 'ValueAxis-2',
                  position: 'left',
                  axisAlpha: 0,
                  gridAlpha: 0,
                  labelsEnabled: false,
                  stackType: 'regular',
                },
              ],
              allLabels: [],
              balloon: {},
            },
            events: {},
            custom: {
              chartBuilder: 'GradientChartBuilder',
              chartType: 'GradientGraph',
            },
          };

          chartOptions.push({
            id: `${attributes.chartId}-gradient`,
            name: `${this.component.id}-yaxis-legend`,
            options: gradientOptions.options,
            custom: gradientOptions.custom,
            events: gradientOptions.events,
          });
        }

        return chartOptions;
      },
      resizeChart(width, height) {
        if (this.chartHandler) this.chartHandler.setChartSize(width, height);
      },
      truncatePrelimData(data, prelimData) {
        let newData = {};
        let latestSeason = 0;
        let latestPeriod = 0;
        for (var season in data) {
          if (!isNaN(parseInt(season)) && parseInt(season) > latestSeason) {
            latestSeason = parseInt(season);
          }
        }
        if (latestSeason !== 0 && prelimData.hasOwnProperty(latestSeason.toString())) {
          for (var i = 0, len = data[latestSeason].length; i < len; i += 1) {
            var x = parseInt(data[latestSeason][i].x);
            if (x > latestPeriod) {
              latestPeriod = x;
            }
          }

          if (latestPeriod !== 0) {
            for (var season in prelimData) {
              if (season === latestSeason.toString()) {
                newData[season] = [];
                for (var i = 0, len = prelimData[season].length; i < len; i += 1) {
                  var x = parseInt(prelimData[season][i].x);
                  if (x > latestPeriod) {
                    newData[season].push(prelimData[season][i]);
                  }
                }
              } else if (parseInt(season) > latestSeason) {
                newData[season] = prelimData[season];
              }
            }
          } else {
            newData = prelimData;
          }
        } else {
          newData = prelimData;
        }
        return newData;
      },
      getSeasons() {
        const attributes = this.getAttributes();
        let seasons = JSON.parse(JSON.stringify(attributes.seasons));
        if (attributes.staticSeasonNames) {
          seasons = seasons.concat(attributes.staticSeasonNames);
        }
        seasons.reverse();
        return seasons;
      },
      // Send the requests for timeseries data and build the chart after it's complete.
      // async getData() {
      //   // This loop is what aborts the getData() call if one is already running.
      //   for (var i = 0, len = this.lastRequests.length; i < len; i += 1) {
      //     var request = this.lastRequests[i];
      //     if (request.returned !== true) {
      //       request.canceled = true;
      //     }
      //   }
      //
      //   this.dataHandler = null;
      //   this.lastRequests = [];
      //   this.data = {}; // Stores data from each request by overlay id.
      //
      //   const attributes = this.getAttributes();
      //   let dataRoot: string;
      //   for (var i = 0, len = attributes.chartTypes.length; i < len; i += 1) {
      //     const chartType = attributes.chartTypes[i];
      //     if (chartType.dataType === selectedDataType) {
      //       dataRoot = chartType.dataRoot;
      //     }
      //   }
      //
      //   const { dataSources } = attributes;
      //   const totalSources = dataSources.length;
      //   let totalCompleted = 0;
      //
      //   for (let dataSource of dataSources) {
      //     let response;
      //     const overlayId = dataSource.overlayId;
      //     const normalizer = dataSource.normalizer;
      //     const request = await Transport.get(dataSource.url);
      //
      //     if (request['canceled'] === true) return;
      //
      //     if (!request.ok) {
      //       response = JSON.stringify({
      //         message: 'no polygon intersects with those coordinates',
      //       });
      //     }
      //
      //     response = await request.json();
      //
      //     // Check for no data responses from the servlet.
      //     if (objPropExists(response, 'message')) {
      //       extendedTool.data[overlayId] = {};
      //     } else if (typeof dataRoot === 'string') {
      //       extendedTool.data[overlayId] = convertPathToObjReference(response, dataRoot);
      //     } else {
      //       // TODO: Delete? Since we don't have to handle multiple data sources
      //
      //       // let period = attributes.period
      //       // dataRoot[overlayId] = dataRoot[overlayId].replace('{{periodicity}}', period)
      //       // let extractedData = convertPathToObjReference(data, dataRoot[overlayId])
      //
      //       // console.log(extractedData)
      //
      //       extendedTool.data[overlayId] = convertPathToObjReference(response, dataRoot[overlayId]);
      //     }
      //
      //     // Only execute the following code once all requests are complete.
      //     // Right now, only prelim charts should have multiple data sources.
      //     totalCompleted += 1;
      //     if (totalCompleted !== totalSources) return;
      //
      //     if (attributes.overlay.type === 'single') {
      //       extendedTool.dataHandler = new DataHandler(extendedTool.data[overlayId], { period: attributes.period }, undefined, normalizer);
      //     } else if (attributes.overlay.type === 'consecutive') {
      //       // For prelim charts, we have multiple data sources so we need multiple data handlers for it.
      //       const overlayIds = attributes.overlay.timeseriesSourceLayerIds;
      //
      //       response = extendedTool.data[overlayIds[0]];
      //       const prelimData = extendedTool.truncatePrelimData(response, extendedTool.data[overlayIds[1]]);
      //       extendedTool.dataHandler = [
      //         new DataHandler(response, {
      //           period: attributes.period,
      //         }),
      //         new DataHandler(prelimData, {
      //           period: attributes.period,
      //         }),
      //       ];
      //     } else if (attributes.overlay.type === 'gefs') {
      //       // For GEFS charts, we follow the same process as 'single' type overlays
      //       // The data will be parsed by the Builder
      //       // let data = extendedTool.data[overlayId]
      //       extendedTool.dataHandler = new DataHandler(
      //         extendedTool.data[overlayId],
      //         {
      //           period: attributes.period,
      //         },
      //         undefined,
      //         normalizer
      //       );
      //     }
      //
      //     if (extendedTool.owningBlock.rendered === true) {
      //       extendedTool.chartHandler = null;
      //       extendedTool.refreshChart();
      //     }
      //
      //     // let request = asyncAjax({
      //     //   method: 'GET',
      //     //   // jsonp: (dataSource.callbackType === 'jsonp') ? true : false,
      //     //   url: dataSource.url,
      //     //   callbackObj: {
      //     //     extendedTool: this,
      //     //     overlayId: dataSource.overlayId,
      //     //     normalizer: dataSource.normalizer,
      //     //   },
      //     //   callback(request, callbackObj) {
      //     //     // request.responseText is readonly, so we create a copy of it so that the
      //     //     // 'no polygon...' error can be assigned if the request status is !== 200
      //     //     let response = request.responseText;
      //     //
      //     //     // If the chart was closed or the user clicked the map again before
      //     //     // this request is complete, prevent the callback from doing anything.
      //     //
      //     //     // TODO: Figure out what this was for/an alternative
      //     //     // @ts-ignore
      //     //     if (request.canceled === true) return;
      //     //     if (request.status !== 200) {
      //     //       response = JSON.stringify({
      //     //         message: 'no polygon intersects with those coordinates',
      //     //       });
      //     //     }
      //     //
      //     //     const { extendedTool } = callbackObj;
      //     //     const { overlayId } = callbackObj;
      //     //     const { normalizer } = callbackObj;
      //     //
      //     //     var data = JSON.parse(response);
      //     //
      //     //     // Check for no data responses from the servlet.
      //     //     if (data.hasOwnProperty('message')) {
      //     //       extendedTool.data[overlayId] = {};
      //     //     } else if (typeof dataRoot === 'string') {
      //     //       extendedTool.data[overlayId] = convertPathToObjReference(data, dataRoot);
      //     //     } else {
      //     //       // TODO: Delete? Since we don't have to handle multiple data sources
      //     //
      //     //       // let period = attributes.period
      //     //       // dataRoot[overlayId] = dataRoot[overlayId].replace('{{periodicity}}', period)
      //     //       // let extractedData = convertPathToObjReference(data, dataRoot[overlayId])
      //     //
      //     //       // console.log(extractedData)
      //     //
      //     //       extendedTool.data[overlayId] = convertPathToObjReference(data, dataRoot[overlayId]);
      //     //     }
      //     //
      //     //     // Only execute the following code once all requests are complete.
      //     //     // Right now, only prelim charts should have multiple data sources.
      //     //     totalCompleted += 1;
      //     //     if (totalCompleted !== totalSources) return;
      //     //
      //     //     if (attributes.overlay.type === 'single') {
      //     //       extendedTool.dataHandler = new globalThis.App.Charter.DataHandler(extendedTool.data[overlayId], { period: attributes.period }, undefined, normalizer);
      //     //     } else if (attributes.overlay.type === 'consecutive') {
      //     //       // For prelim charts, we have multiple data sources so we need multiple data handlers for it.
      //     //       const overlayIds = attributes.overlay.timeseries_source_layer_ids;
      //     //       var data = extendedTool.data[overlayIds[0]];
      //     //       const prelimData = extendedTool.truncatePrelimData(data, extendedTool.data[overlayIds[1]]);
      //     //       extendedTool.dataHandler = [
      //     //         new globalThis.App.Charter.DataHandler(data, {
      //     //           period: attributes.period,
      //     //         }),
      //     //         new globalThis.App.Charter.DataHandler(prelimData, {
      //     //           period: attributes.period,
      //     //         }),
      //     //       ];
      //     //     } else if (attributes.overlay.type === 'gefs') {
      //     //       // For GEFS charts, we follow the same process as 'single' type overlays
      //     //       // The data will be parsed by the Builder
      //     //       // let data = extendedTool.data[overlayId]
      //     //       extendedTool.dataHandler = new globalThis.App.Charter.DataHandler(
      //     //         extendedTool.data[overlayId],
      //     //         {
      //     //           period: attributes.period,
      //     //         },
      //     //         undefined,
      //     //         normalizer
      //     //       );
      //     //     }
      //     //
      //     //     if (extendedTool.owningBlock.rendered === true) {
      //     //       extendedTool.chartHandler = null;
      //     //       extendedTool.refreshChart();
      //     //     }
      //     //   },
      //     // });
      //
      //     // TODO: Figure out what this was for/an alternative
      //     // @ts-ignore
      //     Object.assign(request, {
      //       returned: false,
      //     });
      //     this.lastRequests.push(request);
      //   }
      // },

      async getData() {
        for (const lastRequest of this.lastRequests) {
          if (!lastRequest.returned) lastRequest.canceled = true;
        }
        this.lastRequests = [];
        this.dataHandler = null;
        if (!this.data) this.data = {};

        const attributes = this.getAttributes();
        let dataRoot: string;
        for (const chartType of attributes.chartTypes) {
          if (chartType.dataType === selectedDataType) {
            dataRoot = chartType.dataRoot;
          }
        }

        const { dataSources } = attributes;
        const totalSources = dataSources.length;
        let totalCompleted = 0;

        let data = {};
        for (const dataSource of dataSources) {
          const { normalizer } = dataSource;
          let { overlayId } = dataSource;
          if (attributes.overlay.type === 'combined') {
            //specify special overlayId to combine data under
            overlayId = 'combined';
          } else {
            // reset data if not combined
            data = {};
          }

          // PREVENT REQUEST IF WE ALREADY HAVE THE DATA
          // DataHandler performs sortGranules on the data on initialization. This is an expensive funciton
          // so to avoid having to perform it many times in a row, we're storing the DataHandler instance
          // since DataHandler also keeps track of its original data.
          if (extendedTool.data?.[attributes.boundaryId]?.[overlayId]) {
            this.dataHandler = extendedTool.data[attributes.boundaryId][overlayId];

            // Increment completed request count because we already have the data.
            totalCompleted += 1;
          } else {
            extendedTool.data[attributes.boundaryId] = {};
            extendedTool.data[attributes.boundaryId][overlayId] = null;
          }

          // Only request the data if we don't have it stored.
          if (isEmpty(this.dataHandler)) {
            const request = Transport.get(dataSource.url);
            this.lastRequests.push(request);
            if (this.lastRequests.includes(request)) {
              if (request['canceled']) return;

              try {
                const response = await request;
                const jsonResponse = await response.json();
                if (response?.ok) {
                  if (typeof dataRoot === 'string') {
                    if (attributes.overlay.type === 'combined') {
                      // this clears out some of the extra information while still keeping the data grouped
                      for (const property in jsonResponse) {
                        let dataYears = jsonResponse[property].data;
                        for (const year in dataYears) {
                          dataYears[year] = dataYears[year][0];
                        }
                        data[dataSource.overlayName] = dataYears;
                      }
                    } else {
                      data = convertPathToObjReference(jsonResponse, dataRoot);
                    }
                  } else {
                    // TODO: Delete? Since we don't have to handle multiple data sources

                    // let period = attributes.period
                    // dataRoot[overlayId] = dataRoot[overlayId].replace('{{periodicity}}', period)
                    // let extractedData = convertPathToObjReference(data, dataRoot[overlayId])

                    // console.log(extractedData)

                    data = convertPathToObjReference(jsonResponse, dataRoot[overlayId]);
                  }

                  // Increment completed request count
                  totalCompleted += 1;

                  if (totalCompleted !== totalSources) continue;

                  if (attributes.overlay.type === 'single') {
                    extendedTool.data[attributes.boundaryId][overlayId] = new DataHandler(
                      data,
                      {
                        period: attributes.period,
                        boundaryId: attributes.boundaryId,
                      },
                      undefined,
                      normalizer
                    );
                  } else if (attributes.overlay.type === 'consecutive') {
                    // For prelim charts, we have multiple data sources so we need multiple data handlers for it.
                    const overlayIds = attributes.overlay.timeseriesSourceLayerIds;

                    data = data[overlayIds[0]];
                    const prelimData = extendedTool.truncatePrelimData(data, extendedTool.data[attributes.boundaryId][overlayIds[1]]);
                    extendedTool.data[attributes.boundaryId][overlayId] = [
                      new DataHandler(data, {
                        period: attributes.period,
                        boundaryId: attributes.boundaryId,
                      }),
                      new DataHandler(prelimData, {
                        period: attributes.period,
                        boundaryId: attributes.boundaryId,
                      }),
                    ];
                  } else if (attributes.overlay.type === 'gefs') {
                    // For GEFS charts, we follow the same process as 'single' type overlays
                    // The data will be parsed by the Builder
                    extendedTool.data[attributes.boundaryId][overlayId] = new DataHandler(
                      data,
                      {
                        period: attributes.period,
                        boundaryId: attributes.boundaryId,
                      },
                      undefined,
                      normalizer
                    );
                  } else if (attributes.overlay.type === 'combined') {
                    // multiple requests should be in one chart
                    if (extendedTool.data[attributes.boundaryId][overlayId] instanceof DataHandler) {
                      extendedTool.data[attributes.boundaryId][overlayId].addData(data);
                    } else {
                      extendedTool.data[attributes.boundaryId][overlayId] = new DataHandler(
                        data,
                        {
                          period: attributes.period,
                          boundaryId: attributes.boundaryId,
                        },
                        undefined,
                        normalizer
                      );
                    }
                  }
                  // extendedTool.dataHandler = extendedTool.data[attributes.boundaryId][overlayId];
                } else {
                  // HTTP request succeeded, but GeoEngine returned a 404 with an error message.
                  extendedTool.data[attributes.boundaryId][overlayId] = new DataHandler(
                    {},
                    {
                      period: attributes.period,
                      boundaryId: attributes.boundaryId,
                    },
                    undefined,
                    normalizer
                  );
                  // if (objPropExists(jsonResponse, 'error')) logger.derror(jsonResponse.error);
                }
              } catch (err) {
                // HTTP request failed (bad URL).
                console.log(err);
                extendedTool.data[attributes.boundaryId][overlayId] = new DataHandler(
                  {},
                  {
                    period: attributes.period,
                    boundaryId: attributes.boundaryId,
                  },
                  undefined,
                  normalizer
                );
              }
              extendedTool.dataHandler = extendedTool.data[attributes.boundaryId][overlayId];
            }
          }

          this.dataHandler = extendedTool.data[attributes.boundaryId][overlayId];

          if (extendedTool.owningBlock.rendered === true) {
            extendedTool.chartHandler = null;
            extendedTool.refreshChart();
          }
        }
      },

      // Rebuilds
      refreshChart() {
        this.maskComponent();

        if (this.chartHandler === null) {
          this.component.update(`<div id="${this.uniqueId}-chart"></div>`);
          const chartConfig = this.getChartOptions();
          this.chartHandler = new ChartHandler(chartConfig);
        }

        const attributes = this.getAttributes();
        let chartFixedValues;
        for (let i = 0, len = attributes.chartTypes.length; i < len; i += 1) {
          const chartType = attributes.chartTypes[i];
          if (chartType.dataType === this.selectedDataType) {
            chartFixedValues = chartType.hasOwnProperty('yAxisRange') ? chartType.yAxisRange : 'auto';
          }
        }

        // Prevent chart build if the data for the requested boundaryId is not available.
        // Fixes bug where when switching boundaries (ie. from Crop Zones to Admin 1) -- the chart
        // title will change immediately when the boundary is changed, but the chart data will not
        // update until whenever the request for the data is complete and there is no load mask during this time.
        // Due to the event-callback structure of the app, this refreshChart function will execute multiple times.
        // Because the chart is successfully being built (with stale data) while the data is still fetching, the load mask
        // is not being shown while the new data is being fetched.
        // If the chart layer is impersonating another layer, then we also look for that data.
        if (!this?.data?.[attributes.boundaryId]?.[attributes.overlayId] && !this?.data?.[attributes.boundaryId]?.[attributes.overlay?.impersonate])
          return;
        if (this.selectedBoundaryId !== this.dataHandler?.boundaryId) return;

        // Convert cross years (doesn't do anything if startMonth is 1) and then reset the data back to originalData
        const convertedSeasons = this.dataHandler.convertCrossYears(attributes.startMonth ?? 1, attributes.period).getData();
        const sortedSeasons = Object.keys(convertedSeasons).filter(isValidPeriodName).sort().reverse();
        const staticSeasons = attributes?.staticSeasonNames ?? [];
        attributes.seasons = sortedSeasons;

        const seasons = [...staticSeasons, ...sortedSeasons];

        if (seasons.length) {
          // Capture the cYearsCombo component from the chartContainer.
          const comboExtendedTool = extendedTool.owningBlock.toolbarItems.find(function (item) {
            return item.blockConfig.name === 'cYearsCombo';
          })?.extendedTool;
          let combo;
          if (comboExtendedTool?.combo) {
            combo = comboExtendedTool.combo;
          }

          // Prevent event handlers from firing
          combo?.suspendEvents();

          /*
           * setStore() executes getComboData(), which builds a new store based on the chartContainer's `seasons` attribute.
           * That's why we override the seasons and staticSeasonNames with our new values.
           * Following the call to getComboData(), setStore() binds the new store to the component and
           * sets the combobox's value to the return value of getDefaultValue()
           */
          comboExtendedTool?.setStore();

          // Update options.years so the latest cYearsCombo selection is reflected.
          // selectedPeriods is used by truncateDataByProperty to filter the selected years.
          this.selectedPeriods = comboExtendedTool?.getDefaultValue() ?? this.selectedPeriods;

          // Resume listening for event handlers
          combo?.resumeEvents();
        }

        const chartColors = globalThis.App.Charter.getChartColors({
          fullSeasons: seasons,
          customColors: attributes.chartTypes[0].customColors,
        });

        const options: Record<string, any> = {
          id: `${this.component.id}-chart`,
          name: `${this.component.id}-chart`,
          truncateStartPeriod: this.truncateStartPeriod,
          period: attributes.period,
          layer: attributes.overlay.title,
          years: this.selectedPeriods,
          startMonth: attributes.startMonth,
          colors: chartColors,
          dataType: this.selectedDataType,
          cumulative: this.owningBlock.itemDefinition.chartOptions[this.selectedDataType].cumulative,
          /**
           * yAxisRange: string|object
           *
           * Possible values:
           *   string 'auto' Automatically adjusts y axis to fit the data.
           *   object {min:[value], max:[value]} set the min and/or max value of the y axis.
           */
          yAxisRange: chartFixedValues,
        };

        // I originally used Extjs' task manager to set an interval to check for the existence
        // of the chart div but for some reason, any error that happens in here or in
        // any function called from here is suppressed.
        /* Ext.TaskManager.start({
         scope : this,
         interval : 100,
         run : function () {
         var container = Ext.fly(this.component.id + '-chart');
         if (container) {
         this.chartHandler.buildCharts(this.dataHandler, options);
         if (this.addLegend === false) {
         var attributes = this.getAttributes();
         var chart = this.chartHandler.getChartById(attributes.id);
         chart.chart.removeLegend();
         }

         var bodyEl = document.getElementById(this.component.id + '-body');
         this.resizeChart(parseInt(bodyEl.style.width), parseInt(bodyEl.style.height));

         setTimeout(function (extendedTool) {
         extendedTool.unMaskComponent();
         }, 200, this);
         return false;
         } else {
         return true;
         }
         }
         }); */

        // We can't guarantee that the chart div will actually be rendered to the page before this code executes.
        // The Extjs component's afterrender event does not work for custom html added inside a component.

        ((): void => {
          const container = Ext.fly(`${extendedTool.component.id}-chart`);
          if (container) {
            // Add a reference to the cChartContainer component so it can be manipulated by the chart builder (if
            // applicable)
            options.chartContainer = extendedTool;

            /**
             * Fix for a bug related to EWX Lite interannual charts where swapping between tabs while switching between
             * Interannual and the default dataType causes the `options.years` array to have both years (string) and periods (number).
             * For example: ['2020', 4, 7]
             * This causes the chart legend to display a blank option for the string, breaking the chart balloons
             */
            if (options.dataType.includes('interannual')) {
              // Remove years that are not numbers
              options.years = options.years.filter((y) => typeof y === 'number');

              options.colors = globalThis.App.Charter.getChartColors({
                fullSeasons: getPeriodsPerYear(options.period),
              });
            }

            extendedTool.chartHandler.buildCharts(extendedTool.dataHandler, options);
            if (extendedTool.addLegend === false) {
              const attributes = extendedTool.getAttributes();
              const chart = extendedTool.chartHandler.getChartById(attributes.id);
              chart.chart.removeLegend();
            }

            const bodyEl = document.getElementById(`${extendedTool.component.id}-body`);
            extendedTool.resizeChart(parseInt(bodyEl.style.width), parseInt(bodyEl.style.height));

            setTimeout(() => extendedTool.unMaskComponent(), 200);
          }
        })();

        // const test = function() {
        //   const container = Ext.fly(`${extendedTool.component.id}-chart`);
        //   if (container) {
        //     // Add a reference to the cChartContainer component so it can be manipulated by the chart builder (if
        //     // applicable)
        //     options.chartContainer = extendedTool;
        //
        //     extendedTool.chartHandler.buildCharts(extendedTool.dataHandler, options);
        //     if (extendedTool.addLegend === false) {
        //       const attributes = extendedTool.getAttributes();
        //       const chart = extendedTool.chartHandler.getChartById(attributes.id);
        //       chart.chart.removeLegend();
        //     }
        //
        //     const bodyEl = document.getElementById(`${extendedTool.component.id}-body`);
        //     extendedTool.resizeChart(parseInt(bodyEl.style.width), parseInt(bodyEl.style.height));
        //
        //     setTimeout(function() {
        //       extendedTool.unMaskComponent();
        //     }, 200);
        //     return false;
        //   }
        //   return true;
        // };

        // setTimeout(function() {
        //   test();
        // }, 500);
      },
      maskComponent() {
        if (this.isMasked === true) return;
        if (this.mask === null) {
          // @ts-ignore
          this.mask = new Ext.LoadMask(this.component, {
            msg: 'Loading Chart ...',
          });
        }
        this.mask.show();
        this.isMasked = true;
      },
      unMaskComponent() {
        if (this.isMasked === false) return;
        this.isMasked = false;
        this.mask.hide();
      },
    };

    const graphToolBlock = owningBlock.getReferencedBlock('cGraphTool');

    // The graph tool sends the feature info request on map click.
    graphToolBlock.on('featureinfoupdated', onFeatureInfoUpdated, extendedTool, extendedTool.owningBlock.id);

    if (typeof addLegend !== 'undefined') {
      extendedTool.addLegend = addLegend;
    }

    return extendedTool;
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const attributes = extendedTool.getAttributes();
    const chartTitle = attributes.chartTitle ? attributes.chartTitle : attributes.yAxisLabel;

    let chartContainer: Dict<any> = {
      extendedTool,
      id: extendedTool.uniqueId,
      ghost: false,
      height: block.height,
      width: block.width,
      title: chartTitle,
      closable: typeof block.closable !== 'undefined' ? block.closable : true,
      collapsible: typeof block.collapsible !== 'undefined' ? block.collapsible : false,
      collapsed: typeof block.collapsed !== 'undefined' ? block.collapsed : false,
      // Add the div the chart will render to.
      html: `<div id="${extendedTool.uniqueId}-chart"></div>`,
      bodyCls: 'chart-container-body',
      listeners: {
        afterrender(chartContainer) {
          this.extendedTool.component = chartContainer;
          this.extendedTool.owningBlock.component = chartContainer;
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.maskComponent();
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.forEach((element) => {
              element.el.dom.title = element.type[0].toUpperCase() + element.type.split('-')[0].slice(1);
            });

          const attributes = this.extendedTool.getAttributes();
          // If data handler exists, then the timeseries data is already available.
          if (this.extendedTool.dataHandler !== null) {
            this.extendedTool.refreshChart();
          } else if (attributes.startMonth !== null) {
            // Start month can be set in the charts.json or returned from the feature info request.
            this.extendedTool.isInitialRequest = true;

            // When cDockChart duplicates the chart component, it's storing the values on the owningBlock.
            // To prevent refetching the data, we have to assign it from the owningBlock to the extendedTool.
            if (this.extendedTool.owningBlock.data) {
              this.extendedTool.data = this.extendedTool.owningBlock.data;
            }

            this.extendedTool.getData();
          }

          this.extendedTool.owningBlock.fire('rendercomponent', this.extendedTool);
        },
        resize(chartWindow, width, height) {
          const bodyEl = document.getElementById(`${this.id}-body`);
          this.extendedTool.resizeChart(parseInt(bodyEl.style.width), parseInt(bodyEl.style.height));
        },
        close() {
          // When the chart is closed, remove the target on the map showing clicked location and clear feature info.
          const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');

          if (mapWindowBlock.extendedTool) {
            const { layersConfigId } = mapWindowBlock.extendedTool;
            const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
            const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            const { map } = mapPanelBlock.component;
            let layer;
            if ((layer = globalThis.App.OpenLayers.getCrosshairLayer(map))) {
              map.removeLayer(layer);
            }

            globalThis.App.Layers.clearFeatureInfo(layersConfig);
            this.extendedTool.owningBlock.remove();
          }
        },
        activate() {
          this.extendedTool.resizeChart();
          this.extendedTool.owningBlock.fire('activate', this.extendedTool);
        },
      },
    };

    // Customize the toolbar to broadcast an overflowmenushow event
    // so tools can handle Extjs' bugs when moving them to the menu.
    const toolbarConfigs = {
      enableOverflow: true,
      chartContainer: extendedTool,
      overflowGraphComboUpdated: false,
      listeners: {
        overflowchange() {
          if (this.overflowGraphComboUpdated === false) {
            this.overflowGraphComboUpdated = true;
            const { menu } = this.layout.overflowHandler;
            menu.wrapper = this;
            menu.on('show', function () {
              this.wrapper.chartContainer.owningBlock.fire('overflowmenushow');
            });
          }
        },
        afterrender() {
          this.chartContainer.componentToolbar = this;
        },
      },
    };
    chartContainer = addToolBarItems(block, chartContainer, toolbar, toolbarConfigs);
    return ExtJSPosition(chartContainer, block);
  },
};
