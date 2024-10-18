export const cPopupButtonTool = {
  createExtendedTool: function (owningBlock) {
    const extendedTool = {
      owningBlock: owningBlock,
      showPopupWindow: function () {
        const block = this.owningBlock.blockConfig;
        const title = block.popupTitle;
        const desc = '<p>' + block.popupBody + '</p>';

        // @ts-ignore
        const infoPopup = new Ext.Window({
          id: 'popupInfoWindow',
          frame: false,
          layout: 'fit',
          width: block.popupWidth,
          height: block.popupHeight,
          modal: true,
          plain: true,
          closable: true,
          y: 100,
          bodyStyle: 'border: none;border-radius:10px;',
          items: [
            {
              id: 'popupInfoBody',
              items: [
                {
                  height: block.popupHeight,
                  id: 'note',
                  html: "<div style='font-size: 16px;'>" + title + ':</div></br>' + desc,
                  style: 'font-family: verdana,arial; font-size: 13px; color: #444;padding:30px 20px;line-height: 25px;text-align:justify;',
                  bodyStyle: 'border: none;',
                },
              ],
            },
          ],
        });

        infoPopup.show();
      },
      setCookie: function (cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        const expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
      },
      getCookie: function (cname) {
        const name = cname + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return '';
      },
    };

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    block.icon;
    block.text;
    block.tooltip;
    block.width;
    block.height;

    //block.popupTitle = "hello";
    //block.popupBody = "hello";
    //block.popupHeight = 100;

    const component = {
      extendedTool: extendedTool,
      xtype: 'button',
      //cls : 'x-btn-middle white-glyph',
      cls: 'x-btn-middle',
      //iconCls: "fa " + block.icon,
      tooltip: block.tooltip,
      tooltipType: 'title',
      width: block.width,
      height: block.height,
      text: undefined,
      iconCls: undefined,
      handler: function () {
        this.extendedTool.showPopupWindow();
      },
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;

          if (this.extendedTool.owningBlock.blockConfig.showOnFirstLoad === true) {
            const cookie = this.extendedTool.getCookie('popupOnLoad');
            if (cookie === '') {
              this.extendedTool.setCookie('popupOnLoad', '1', 1);
              this.extendedTool.showPopupWindow();
            }
          }
        },
      },
    };

    if (typeof block.text !== 'undefined') {
      component.text = block.text;
    } else {
      component.iconCls = 'fa ' + block.icon;
    }

    return component;
  },
};
