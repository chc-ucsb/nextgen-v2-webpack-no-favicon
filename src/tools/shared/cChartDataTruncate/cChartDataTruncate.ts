import startPointImg from '../../../../assets/images/start_point.jpg';

export const cChartDataTruncate = {
  options: {
    requiredBlocks: ['cChartContainer'],
  },
  createExtendedTool: function (owningBlock) {
    const extendedTool = {
      owningBlock: owningBlock,
      setChartTruncating: function () {
        const chartContainer = this.owningBlock.getReferencedBlock('cChartContainer');
        chartContainer.extendedTool.startTruncating();
      },
      unsetChartTruncating: function () {
        const chartContainer = this.owningBlock.getReferencedBlock('cChartContainer');
        chartContainer.extendedTool.stopTruncating();
      },
    };

    const chartContainerBlock = owningBlock.getReferencedBlock('cChartContainer');
    chartContainerBlock.on(
      'graphtypechanged',
      function (callbackObject, postingObject, eventObject) {
        const extendedTool = callbackObject;
        const chartContainer = postingObject;
        if (extendedTool.owningBlock.rendered === true) {
          const component = extendedTool.component;
          if (component.pressed === true) {
            component.toggle();
          }

          if (chartContainer.canTruncate() === true) {
            component.show();
          } else {
            component.hide();
          }
        }
        if (chartContainer.truncating === true) {
        }
      },
      extendedTool
    );

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const component = {
      extendedTool: extendedTool,
      xtype: 'button',
      //cls : 'x-btn-left',
      //iconCls: (block.iconClass) ? block.iconClass : 'fa fa-scissors',
      icon: startPointImg,
      iconAlign: 'left',
      text: '<span style="color: black;">' + block.text + '</span>',
      textAlign: 'right',
      hidden: true,
      width: block.width ? block.width : 115,
      tooltip: block.tooltip,
      tooltipType: 'title',
      enableToggle: true,
      listeners: {
        toggle: function () {
          if (this.pressed) {
            this.extendedTool.setChartTruncating();
          } else {
            this.extendedTool.unsetChartTruncating();
          }
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;

          const chartContainerBlock = this.extendedTool.owningBlock.getReferencedBlock('cChartContainer');
          if (chartContainerBlock.extendedTool.canTruncate() === true) {
            this.show();
          }
        },
      },
    };

    return component;
  },
};
