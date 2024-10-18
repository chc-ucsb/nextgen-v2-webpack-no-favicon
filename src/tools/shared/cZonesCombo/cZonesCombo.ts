export const cZonesCombo = {
  options: {
    requiredBlocks: ['cChartContainer', 'cMapWindow'],
  },
  createExtendedTool(owningBlock) {
    const extendedTool = {
      owningBlock,
      tooltipText: owningBlock.blockConfig.tooltip,
      saveSelection: owningBlock.blockConfig.saveSelection,
      setStore() {
        // Sets the store on initial chart load.
        const storeData = this.getComboData();
        const { value } = storeData[0];
        const store = Ext.create('Ext.data.Store', {
          fields: ['name', 'value'],
          data: storeData,
        });

        this.component.bindStore(store);
        this.component.setValue(value);
      },
      getComboData() {
        // Get the data for the store.
        const chartContainerBlock = this.owningBlock.getReferencedBlock('cChartContainer');
        const chartContainer = chartContainerBlock.extendedTool;

        const comboData = [];
        const chartAttributes = chartContainer.getAllAttributes();
        for (let i = 0, len = chartAttributes.length; i < len; i += 1) {
          const attributes = chartAttributes[i];
          comboData.push({
            value: attributes.boundaryId,
            name: attributes.boundaryTitle,
          });
        }

        return comboData;
      },
    };

    return extendedTool;
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const chartContainerBlock = extendedTool.owningBlock.getReferencedBlock('cChartContainer');
    const chartContainer = chartContainerBlock.extendedTool;
    const chartAttributes = chartContainer.getAllAttributes();
    const data = [];
    const value = chartAttributes[0].boundaryId;
    for (let i = 0, len = chartAttributes.length; i < len; i += 1) {
      const attributes = chartAttributes[i];
      data.push({
        name: attributes.boundaryTitle,
        value: attributes.boundaryId,
      });
    }

    const combo = {
      saveSelection: block.saveSelection,
      extendedTool,
      width: block.width,
      editable: false,
      multiSelect: false,
      matchFieldWidth: false,
      listConfig: {
        minWidth: block.width,
      },
      valueField: 'value',
      displayField: 'name',
      store: Ext.create('Ext.data.Store', {
        fields: ['name', 'value'],
        data,
      }),
      value,
      emptyText: 'Add Layers',
      listeners: {
        change() {
          const chartContainerBlock = this.extendedTool.owningBlock.getReferencedBlock('cChartContainer');
          const chartContainer = chartContainerBlock.extendedTool;
          chartContainer.setSelectedBoundaryId(this.getValue());
        },
        afterrender() {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.component.el.dom.title = this.extendedTool.tooltipText;
        },
      },
    };

    const combobox = Ext.create('Ext.form.field.ComboBox', combo);
    return combobox;
  },
};
