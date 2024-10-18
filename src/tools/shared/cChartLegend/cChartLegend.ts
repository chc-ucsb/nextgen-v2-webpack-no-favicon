export const cChartLegend = {
  options: {
    requiredBlocks: ['cChartContainer'],
  },
  createExtendedTool: function (owningBlock) {
    const chartContainerBlock = owningBlock.getReferencedBlock('cChartContainer');
    const chartContainer = chartContainerBlock.extendedTool;

    let addLegend = owningBlock.blockConfig.pressed;

    if (chartContainer.hasOwnProperty('addLegend')) {
      addLegend = chartContainer.addLegend;
    }

    return {
      owningBlock: owningBlock,
      addLegend: addLegend,
    };
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    return {
      cls: 'x-btn-left legend-glyph',
      iconCls: 'fa fa-list-ul',
      extendedTool: extendedTool,
      tooltip: block.tooltip,
      tooltipType: 'title',
      legendPosition: block.legendPosition,
      enableToggle: true,
      pressed: extendedTool.addLegend,
      listeners: {
        toggle: function () {
          const chartContainerBlock = this.extendedTool.owningBlock.getReferencedBlock('cChartContainer');
          const chartContainer = chartContainerBlock.extendedTool;

          const attributes = chartContainer.getAttributes();
          const chartHandler = chartContainer.chartHandler;
          const chart = chartHandler.getChartById(attributes.id);
          chartContainer.addLegend = this.pressed;

          if (this.pressed === true) {
            const legend = new globalThis.AmCharts.AmLegend();
            const legendOptions = chartContainer.getLegendOptions(this.legendPosition);
            for (let prop in legendOptions) {
              legend[prop] = legendOptions[prop];
            }
            chart.chart.addLegend(legend);
          } else {
            chart.chart.removeLegend();
          }

          chart.chart.invalidateSize();
        },
        afterrender: function () {
          const chartContainerBlock = this.extendedTool.owningBlock.getReferencedBlock('cChartContainer');
          const chartContainer = chartContainerBlock.extendedTool;

          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
          chartContainer.addLegend = this.pressed;
        },
      },
    };
  },
};
