/**
 * Config options:
 * showOnFirstLoad: boolean
 * useOKButtons: boolean
 */

export const cPopupButtonTool = {
  createExtendedTool: function (owningBlock) {
    var extendedTool = {
      owningBlock: owningBlock,
      showPopupWindow: function () {
        var block = this.owningBlock.blockConfig;
        var title = block.popupTitle;
        var desc = '<p>' + block.popupBody + '</p>';

        // @ts-ignore
        var infoPopup = new Ext.Window({
          id: 'popupInfoWindow',
          frame: false,
          layout: 'fit',
          width: 500,
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
                  // block.addFormatting is used in the landfire template config. Landfire project is using the shrubland's cPopupButtonTool.
                  height: block.popupHeight,
                  id: 'note',
                  html: block.addFormatting ? "<div style='font-size: 16px;'>" + title + ':</div></br>' + desc : desc,
                  style: block.addFormatting
                    ? 'font-family: verdana,arial; font-size: 13px; color: #444;padding:30px 20px;line-height: 25px;text-align:justify;'
                    : 'font-family: helvetica, arial, verdana, sans-serif; font-size: 13px; line-height:17px; color: #444;padding:2px 6px;',
                  bodyStyle: 'border: none;',
                },
              ],
            },
          ],
        });

        infoPopup.show();
      },

      showMessageBox: function () {
        const block = this.owningBlock.blockConfig;
        Ext.MessageBox.show({
          height: block.popupHeight,
          title: block.popupTitle,
          msg: block.popupBody,
          buttons: Ext.MessageBox.OK,
          autoScroll: true,
        });
      },

      setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        var expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
      },
      getCookie: function (cname) {
        var name = cname + '=';
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
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
    var block = extendedTool.owningBlock.blockConfig;

    //block.popupTitle = "hello";
    //block.popupBody = "hello";
    //block.popupHeight = 100;

    var component = {
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
        // Runs when the button is clicked
        // Determine what type of popup to create.
        if (this.extendedTool.owningBlock.blockConfig.useOkButtons === true) {
          this.extendedTool.showMessageBox();
        } else {
          this.extendedTool.showPopupWindow();
        }
      },
      listeners: {
        afterrender: function () {
          // Runs when the button is rendered to screen.
          // Used to show the popup to the user automatically when the viewer loads

          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;

          if (this.extendedTool.owningBlock.blockConfig.showOnFirstLoad === true) {
            var cookie = this.extendedTool.getCookie('popupOnLoad');

            // Only show the popup if the cookie is NOT set.
            // If this is NOT the first time it's been loaded, then the cookie's value will be 1.
            if (cookie === '') {
              this.extendedTool.setCookie('popupOnLoad', '1', 1);

              if (this.extendedTool.owningBlock.blockConfig.useOkButtons === true) {
                this.extendedTool.showMessageBox();
              } else {
                this.extendedTool.showPopupWindow();
              }
            }
          } else if (this.extendedTool.owningBlock.blockConfig.alwaysShow === true) {
            if (this.extendedTool.owningBlock.blockConfig.useOkButtons === true) {
              this.extendedTool.showMessageBox();
            } else {
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
