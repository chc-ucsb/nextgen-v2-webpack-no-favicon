export const cDataDownloadBtn = {
  options: {
    requiredBlocks: ['cDataDownload', 'cMapWindow'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
    const component = {
      extendedTool,
      cls: 'x-btn-left',
      tooltip: block.tooltip,
      tooltipType: 'title',
      iconCls: 'fa fa-arrow-circle-o-down',
      enableToggle: true,
      toggleGroup: mapWindowBlock.extendedTool.toggleGroupId,
      pressed: block.pressed,
      dataDownload: true,
      priorToggle: false,
      listeners: {
        toggle: function () {
          if (!this.priorToggle && this.pressed) {
            const DataDownloadPanel = this.extendedTool.owningBlock.getReferencedBlock('cDataDownload');
            DataDownloadPanel.extendedTool.openAndEnable(mapWindowBlock);
            this.priorToggle = true;
          } else if (this.priorToggle && !this.pressed) {
            this.priorToggle = false;
            const DataDownloadTool = this.extendedTool.owningBlock.getReferencedBlock('cDataDownload');
            DataDownloadTool.extendedTool.empty(mapWindowBlock);
            const dataDownloadPanel = Ext.ComponentQuery.query('[title=Data Download]');
            (dataDownloadPanel[0] as Ext.IPanel).collapse();
            const downloadPanel = Ext.getCmp('dataDownloadPanel');
            downloadPanel.hide();
            const categoryText = Ext.getCmp('categoryText');
            categoryText.show();
          }
        },
      },
    };

    return component;
  },
};
