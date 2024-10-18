import { toFilename } from '../../../helpers/string';

export const cExportCSV = {
  options: {
    requiredBlocks: ['cChartContainer'],
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const menuItem = {
      text: block.title,
      tooltip: block.tooltip,
      tooltipType: 'title',
      extendedTool: extendedTool,
      listeners: {
        click: function () {
          const chartContainerBlock = this.extendedTool.owningBlock.getReferencedBlock('cChartContainer');
          const chartContainer = chartContainerBlock.extendedTool;

          const mapWindowBlock = chartContainer.owningBlock.getReferencedBlock('cMapWindow');
          const mapWindow = mapWindowBlock.component;

          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);

          const chartHandler = chartContainer.chartHandler;
          const attributes = chartContainer.getAttributes();
          const filename = toFilename(mapWindow.title || attributes.layerName);

          // layerName determines the name of the saved file
          chartHandler.exportChart(attributes.id, 'CSV', {
            period: attributes.period,
            // if the layerName is empty then use the filename created from the mapWindow title.
            // but if the layerName is not an empty string, then use that instead.
            layerName: attributes.layerName || filename,
            graunle: globalThis.App.Layers._granules.get(layer.id),
            startMonth: attributes.startMonth,
            chartId: attributes.overlayTitle,
          });
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    return menuItem;
  },
};
