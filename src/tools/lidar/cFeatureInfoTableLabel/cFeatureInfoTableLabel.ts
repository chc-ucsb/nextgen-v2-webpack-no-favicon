export const cFeatureInfoTableLabel = {
  options: {
    requiredBlocks: ['cFeatureInfoTable'],
  },
  featureTableUpdatedCallback: function (callbackObj, postingObj) {
    const extendedTool = callbackObj;
    const aoiTool = postingObj;
    const featureInfoTableBlock = extendedTool.owningBlock.getReferencedBlock('cFeatureInfoTable');
    let totalCount = 0;
    if (featureInfoTableBlock.rendered === true) {
      totalCount = featureInfoTableBlock.extendedTool.featureList.length;
    }
    extendedTool.component.setText('Total Fires: ' + totalCount);
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const extTool = {
      extendedTool: extendedTool,
      xtype: 'tbtext',
      text: block.label,
      style: block.style,
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    /* Set up the listener for featureInfoTable so the label gets updated when its updated */
    const featureInfoTableBlock = extendedTool.owningBlock.getReferencedBlock('cFeatureInfoTable');
    featureInfoTableBlock.on('tableUpdatedEvent', extendedTool.owningBlock.itemDefinition.featureTableUpdatedCallback, extendedTool);

    return extTool;
  },
};
