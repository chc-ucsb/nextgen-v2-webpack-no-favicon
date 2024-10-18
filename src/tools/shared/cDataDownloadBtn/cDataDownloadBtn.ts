import Toggle from 'ol-ext/control/Toggle';

export const cDataDownloadBtn = {
  options: {
    requiredBlocks: ['cDataDownload', 'cMapWindow'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');

    if (block.olExt) {
      const getDownloadToggleButton = ({ map, options }) => {
        const button = new Toggle({
          html: '<i class="fa fa-arrow-circle-o-down"></i>',
          className: 'select',
          title: 'Download Tool',
          active: false,
          onToggle: (isToggled: boolean) => {
            if (isToggled) {
              map.extendedTool.component.activeDataQueryComponent = 'download-tool';

              const DataDownloadPanel = extendedTool.owningBlock.getReferencedBlock('cDataDownload');
              DataDownloadPanel.extendedTool.openAndEnable(mapWindowBlock);
            } else {
              map.extendedTool.component.activeDataQueryComponent = '';

              const DataDownloadTool = extendedTool.owningBlock.getReferencedBlock('cDataDownload');
              DataDownloadTool.extendedTool.empty(mapWindowBlock);
            }
          },
        });

        button.addEventListener('change:active', function (event) {
          const isActive = event.active;

          // Close and remove the map interaction for the download tool
          if (!isActive) {
            const DataDownloadTool = extendedTool.owningBlock.getReferencedBlock('cDataDownload');
            DataDownloadTool.extendedTool.empty(mapWindowBlock);
          }
        });

        return button;
      };

      globalThis.App.OpenLayers.controls['download-tool'] = getDownloadToggleButton;

      return;
    } else {
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
    }
  },
};
