import { toFilename } from '../../../helpers/string';

export const cExportPNG = {
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

          const chartHandler = chartContainer.chartHandler;
          const attributes = chartContainer.getAttributes();
          const filename = toFilename(mapWindow.title || attributes.layerName);
          chartHandler.exportChart(attributes.id, 'PNG', {
            layerName: filename,
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
