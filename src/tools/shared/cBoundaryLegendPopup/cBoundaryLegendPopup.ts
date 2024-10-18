import { getLegendURL } from '../../../helpers/network';

export const cBoundaryLegendPopup = {
  getComponent: function (extendedTool) {
    const block = extendedTool.owningBlock.blockConfig;
    const component = {
      extendedTool: extendedTool,
      //iconCls: (block.iconClass) ? block.iconClass : 'fa fa-hand-paper-o',
      tooltip: block.tooltip,
      tooltipType: 'title',
      enableToggle: true,
      pressed: false,
      text: block.text ? block.text : 'Legend',
      popupWindow: null,
      listeners: {
        toggle: function (button, pressed) {
          if (pressed) {
            const legendButton = this;
            const block = this.extendedTool.owningBlock.blockConfig;
            this.popupWindow = Ext.create('Ext.Window', {
              title: block.title ? block.title : 'Map Legend',
              collapsible: true,
              ghost: false,
              constrain: true,
              width: 250,
              height: 200,
              autoShow: true,
              y: 100,
              x: document.body.clientWidth - 255,
              listeners: {
                close: function () {
                  legendButton.suspendEvents();
                  legendButton.toggle();
                  legendButton.resumeEvents();
                },
                afterrender: function () {
                  const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
                  const boundaries = globalThis.App.Layers.query(layersConfig.boundaries, {
                    type: 'layer',
                    loadOnly: false,
                    mask: false,
                  });

                  if (boundaries.length > 0) {
                    let html = '';
                    let i = 0;
                    const len = boundaries.length;
                    for (; i < len; i += 1) {
                      const boundary = boundaries[i];
                      const legendUrl = getLegendURL(boundary, 50, 20);
                      if (legendUrl !== null) {
                        html += '<div><img src="' + legendUrl + '" /><span style="margin-left: 5px;">' + boundary.title + '</span></div>';
                      }
                    }
                    this.update(html);
                  }
                },
              },
            });
          } else {
            this.popupWindow.suspendEvents();
            this.popupWindow.close();
          }
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    return component;
  },
};
