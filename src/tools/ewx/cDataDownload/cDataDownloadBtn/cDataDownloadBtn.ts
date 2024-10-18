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
            const mapWindow = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            this.priorToggle = false;
            const DataDownloadTool = this.extendedTool.owningBlock.getReferencedBlock('cDataDownload');
            DataDownloadTool.extendedTool.empty(mapWindow);
          }
        },
      },
    };

    return component;
  },
};
