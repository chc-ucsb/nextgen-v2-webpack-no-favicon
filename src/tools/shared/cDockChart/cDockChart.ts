export const cDockChart = {
  options: {
    requiredBlocks: ['cChartContainer', 'cMapWindow', 'cGraphTool'],
  },
  createExtendedTool: function (owningBlock) {
    const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');

    const extendedTool = {
      owningBlock: owningBlock,
    };

    mapWindowBlock.on(
      'remove',
      function (extendedTool) {
        if (extendedTool.owningBlock.rendered === true) extendedTool.component.disable();
      },
      extendedTool
    );

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const glyphClass = block.dockedState === 'docked' ? 'fa-expand' : 'fa-compress';

    return {
      extendedTool: extendedTool,
      xtype: 'button',
      html: '<span class="pop-out fa ' + glyphClass + '"></span>',
      tooltip: block.tooltip,
      tooltipType: 'title',
      border: false,
      handler: function () {
        const chartContainerBlock = this.extendedTool.owningBlock.getReferencedBlock('cChartContainer');
        const chartContainer = chartContainerBlock.extendedTool;

        const selectedBoundaryId = chartContainer.selectedBoundaryId;
        const selectedGraphType = chartContainer.selectedGraphType;
        const selectedPeriods = chartContainer.selectedPeriods;
        const selectedDataType = chartContainer.selectedDataType;
        const periodFormat = chartContainer.periodFormat;
        const chartAttributes = chartContainer.chartAttributes;
        const mapperWindow = chartContainer.mapperWindow;
        const addLegend = chartContainer.addLegend;
        const chartData = chartContainer.data;

        chartContainerBlock.unRender();
        chartContainerBlock.remove();

        const relatedBlueprint = chartContainerBlock.blueprint.relatedBlockBlueprints[0];
        relatedBlueprint.itemDefinition.enabledChartContainerId = relatedBlueprint.id;
        relatedBlueprint.undelayRender();

        let newBlock = relatedBlueprint.block;
        if (newBlock === null) {
          newBlock = relatedBlueprint.createBlock();
        }

        newBlock.selectedBoundaryId = selectedBoundaryId;
        newBlock.selectedGraphType = selectedGraphType;
        newBlock.selectedPeriods = selectedPeriods;
        newBlock.selectedDataType = selectedDataType;
        newBlock.periodFormat = periodFormat;
        newBlock.chartAttributes = chartAttributes;
        newBlock.mapperWindow = mapperWindow;
        newBlock.addLegend = addLegend;
        newBlock.data = chartData;

        const renderedParent = newBlock.getClosestRenderedParent();
        renderedParent.render();

        // Update the chart type combo which does not execute upon docking/undocking
        const graphTool = extendedTool.owningBlock.getReferencedBlock('cGraphTool');
        graphTool.extendedTool.featureInfoUpdated();
      },
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };
  },
};
