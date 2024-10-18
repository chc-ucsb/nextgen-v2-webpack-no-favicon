import { id } from 'date-fns/locale';
import { getRandomString } from '../../../helpers/string';

export const cDataDownloadBtn = {
  options: {
    requiredBlocks: ['cDataDownload', 'cMapWindow'],
  },

  createExtendedTool: function (owningBlock) {
    var uniqueId = 'downloadBtn-' + getRandomString(32, 36);

    return {
      owningBlock: owningBlock,
      uniqueId: uniqueId,
    };
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
      id: extendedTool.uniqueId,
      toggleGroup: mapWindowBlock.extendedTool.toggleGroupId,
      pressed: block.pressed,
      dataDownload: true,
      priorToggle: false,
      listeners: {
        toggle: function () {
          if (!this.priorToggle && this.pressed) {
            const DataDownloadPanel = this.extendedTool.owningBlock.getReferencedBlock('cDataDownload');
            const drawCombo = Ext.getCmp('drawCombo');
            const drawMethodText = Ext.getCmp('drawTest');
            drawCombo.setVisible(true);
            drawCombo.setValue('Rectangle');
            drawMethodText.setVisible(true);
            DataDownloadPanel.extendedTool.openAndEnable(mapWindowBlock);
            Ext.getCmp('redirectDownload').hide();
            Ext.getCmp('redirectDownloadText').hide();
            this.priorToggle = true;
          } else if (this.priorToggle && !this.pressed) {
            const mapWindow = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
            this.priorToggle = false;
            const DataDownloadTool = this.extendedTool.owningBlock.getReferencedBlock('cDataDownload');
            DataDownloadTool.extendedTool.disbaleTemplateLayers();
            DataDownloadTool.extendedTool.empty(mapWindow);
            const dataDownloadPanel = Ext.ComponentQuery.query('[title=Data Download Tool]');
            if (dataDownloadPanel.length > 0) (dataDownloadPanel[0] as Ext.IPanel).collapse();
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
