export const cDatePickerTool = {
  options: {
    requiredBlocks: ['cMapWindow'],
  },
  init(blueprint) {
    if (Ext.ComponentQuery.query('periodic').length === 0) globalThis.App.Tools.datePicker.defineDatePicker();
  },
  createExtendedTool(owningBlock) {
    // const datasetExplorerTool = owningBlock.getReferencedBlock('cDatasetExplorerTool');
    const cMapWindow = owningBlock.getReferencedBlock('cMapWindow');

    const extendedTool = {
      owningBlock,
      tooltipText: owningBlock.blockConfig.tooltip,
      pickerType: owningBlock.blockConfig.pickerType,
    };

    if (cMapWindow !== null) {
      cMapWindow.on(
        'layerchange',
        function (callbackObj, postingObj) {
          const datePickerTool = callbackObj;
          const datasetExplorerTool = postingObj;
          const mapWindowBlock = datasetExplorerTool.owningBlock.getReferencedBlock('cMapWindow');
          const layersConfig = globalThis.App.Layers.getLayersConfigById(mapWindowBlock.extendedTool.layersConfigId);
          // var layersConfig = mapWindowBlock.extendedTool.mapWindowMapperLayersConfig;

          datePickerTool.component.layersConfigUpdated(layersConfig);
        },
        extendedTool
      );
    }

    return extendedTool;
  },
  getComponent(extendedTool, items, toolbar, menu) {
    // const block = extendedTool.owningBlock.blockConfig;

    const layersConfigID = globalThis.App.Layers.getConfigInstanceId();
    const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigID);
    const topLayer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
    const granule = globalThis.App.Layers._granules.get(topLayer.id);
    let hidden = true;

    if (granule !== null && granule?.getIntervalsWithinSelectedMonthYear()) {
      hidden = false;
    }

    const aDatePickerTool = Ext.create('widget.periodic', {
      extendedTool,
      width: 30,
      layerId: topLayer.id,
      pickerType: extendedTool.pickerType,
      hidden,
      listeners: {
        afterrender() {
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.component.el.dom.title = this.extendedTool.tooltipText;
        },
      },
    });

    return aDatePickerTool;
  },
};
