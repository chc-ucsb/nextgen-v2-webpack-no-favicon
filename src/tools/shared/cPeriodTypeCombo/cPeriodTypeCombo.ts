export const cPeriodTypeCombo = {
  options: {
    requiredBlocks: ['cChartContainer', 'cMapWindow'],
  },
  createExtendedTool: function (owningBlock) {
    const block = owningBlock.blockConfig;

    const extendedTool = {
      owningBlock: owningBlock,
      tooltipText: block.tooltip,
      tooltipType: 'title',
      saveSelection: block.saveSelection,
      setStore: function () {
        const chartContainerBlock = this.owningBlock.getReferencedBlock('cChartContainer');
        const chartContainer = chartContainerBlock.extendedTool;

        const value = chartContainer.selectedDataType;
        const attributes = chartContainer.getAttributes();
        const chartTypes = attributes.chartTypes;
        const data = [];

        let i = 0;
        const len = chartTypes.length;
        for (; i < len; i += 1) {
          const chartType = chartTypes[i];
          data.push({
            value: chartType.dataType,
            name: chartContainer.getDataTypeName(chartType.dataType),
          });
        }

        const store = Ext.create('Ext.data.Store', {
          fields: ['value', 'name'],
          data: data,
        });

        this.component.bindStore(store);
        this.component.setValue(value);
      },
    };

    const chartContainerBlock = owningBlock.getReferencedBlock('cChartContainer');
    chartContainerBlock.on(
      'activate',
      function (callbackObj, postingObj, eventObj) {
        const extendedTool = postingObj;
        if (postingObj.attributesUpdated !== true) return;
        const chartContainer = callbackObj;

        const value = chartContainer.component.getValue();
        const periodFormat = extendedTool.getPeriodFormat(value);
        extendedTool.setSelectedPeriodFormat(periodFormat);
        extendedTool.setSelectedDataType(value);
      },
      extendedTool
    );

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const chartContainerBlock = extendedTool.owningBlock.getReferencedBlock('cChartContainer');
    const chartContainer = chartContainerBlock.extendedTool;
    const data = [];
    const chartTypes = chartContainer.getAttributes().chartTypes;
    const value = chartContainer.selectedDataType;
    let i = 0;
    const len = chartTypes.length;
    for (; i < len; i += 1) {
      const dataType = chartTypes[i].dataType;
      data.push({
        name: chartContainer.getDataTypeName(dataType),
        value: dataType,
      });
    }

    const combo = {
      saveSelection: block.saveSelection,
      extendedTool: extendedTool,
      width: block.width,
      editable: false,
      multiSelect: false,
      matchFieldWidth: false,
      listConfig: {
        minWidth: block.width,
      },
      displayField: 'name',
      valueField: 'value',
      value: value,
      store: Ext.create('Ext.data.Store', {
        fields: ['name', 'value'],
        data: data,
      }),
      queryMode: 'local',
      listeners: {
        change: function () {
          const extendedTool = this.extendedTool;
          const value = this.getValue();
          const chartContainerBlock = extendedTool.owningBlock.getReferencedBlock('cChartContainer');
          const chartContainer = chartContainerBlock.extendedTool;
          const periodFormat = chartContainer.getPeriodFormat(value);
          chartContainer.setSelectedPeriodFormat(periodFormat);
          chartContainer.setSelectedDataType(value);
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.component.el.dom.title = this.extendedTool.tooltipText;
        },
      },
    };

    const combobox = Ext.create('Ext.form.field.ComboBox', combo);
    return combobox;
  },
};
