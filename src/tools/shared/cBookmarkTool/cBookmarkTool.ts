import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import * as olSphere from 'ol/sphere';
import Draw from 'ol/interaction/Draw';
import { getBlocksByName } from '../../../helpers/extjs';
import { transform } from 'ol/proj';

export const cBookmark = {
  options: {
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
    events: ['collapse', 'expand'],
  },
  lockedWindows: [],
  map: null,
  createExtendedTool(owningBlock) {
    const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    let mapWindow = null;
    // Get the default focused map window on app load.
    const mapWindows = getBlocksByName('cMapWindow');
    for (let i = 0, len = mapWindows.length; i < len; i++) {
      mapWindow = mapWindows[i];
      break;
    }

    const extendedTool = {
      owningBlock,
      mapWindowBlock: mapWindowBlock,
      activeMapWindow: mapWindow,
      reconfigureBookmarksTOC(cookieArray: any): void {
        const tocExtendedTool = Ext.getCmp('bookmarksTOCTree');
        const customBookmark = {
          text: 'Custom Bookmarks',
          children: cookieArray,
          expanded: false,
        };
        // check if there are existing custom bookmarks. if there are then we can remove them
        // and then append the updated custom bookmarks.
        // else this is the first time we are adding custom bookmarks to the tree.
        if (tocExtendedTool.getStore().getRootNode().lastChild.data.text === 'Custom Bookmarks') {
          tocExtendedTool.getStore().getRootNode().lastChild.remove();
          tocExtendedTool.getStore().getRootNode().appendChild(customBookmark);
        } else tocExtendedTool.getStore().getRootNode().appendChild(customBookmark);
      },
      toogleRemoveBtn(): void {
        const tocExtendedTool = Ext.getCmp('bookmarksTOCTree');
        const selectedChildren = tocExtendedTool.getChecked();
        if (selectedChildren.length > 0) this.enableRemoveButton();
        else this.disableRemoveButton();
      },
      enableRemoveButton(): void {
        const downloadBtn = this.component.query('#removeBookmarkBtn')[0];
        downloadBtn.enable();
      },
      disableRemoveButton(): void {
        const downloadBtn = this.component.query('#removeBookmarkBtn')[0];
        downloadBtn.disable();
      },
      setCookie: function (cname, cvalue, exdays) {
        let previousBookmarks = [];
        // get any previous cookies so we can append the new cookie after the current cookies.
        const cookie = this.getCookie('bookmarks');
        let exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        if (cookie !== '') previousBookmarks.push(cookie);
        previousBookmarks.push(cvalue);
        document.cookie = cname + '=' + previousBookmarks + ';' + 'expires=' + exdate.toUTCString() + ';';
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
  getComponent(extendedTool) {
    const block = extendedTool.owningBlock.blockConfig;
    let cookieArray = [];
    const component = {
      extendedTool: extendedTool,
      title: 'Bookmarks Tool',
      collapsible: block.hasOwnProperty('collapsible') ? block.collapsible : true,
      collapsed: block.hasOwnProperty('collapsed') ? block.collapsed : true,
      componentCls: 'panel-border',
      collapseFirst: false,
      grow: true,
      autoSize: true,
      autoScroll: true,
      autoHeight: true,
      border: 1,
      bodyCls: 'roundCorners',
      cls: 'padPanel',
      tools: [
        {
          type: 'help',
          tooltip: 'Get Help',
          callback: function (panel, tool, event) {
            Ext.Msg.show({
              title: 'Bookmark Tool',
              msg: 'This tool allows you to add or remove a bookmarked area. Double click the bookmark to zoom to the area that corresponds to it.',
              buttons: Ext.Msg.CANCEL,
              icon: Ext.Msg.QUESTION,
            });
          },
        },
      ],
      layout: {
        type: 'vbox',
        align: 'middle',
      },
      items: [
        {
          xtype: 'panel',
          id: 'bookmarksPanel',
          width: '100%',
          autoscroll: true,
          scrollable: true,
          items: [
            {
              extendedTool,
              xtype: 'treeStore',
              id: 'bookmarksTOCTree',
              rootVisible: false,
              lines: true,
              hideHeaders: true,
              expanded: false,
              root: { expanded: false, children: block.data.childData },
              listeners: {
                itemdblclick: function (tree, record, item, index, e, eOpts) {
                  let storeArray: Array<number> = [];
                  let temp: Array<number> = [];
                  let testArray = record.raw.coords;
                  for (let i = 0; i < 2; i++) {
                    storeArray.push(testArray[i]);
                  }
                  for (let j = 2; j < testArray.length; j++) {
                    temp.push(parseFloat(testArray[j]));
                  }
                  // transform the converted coordinates from EPSG:4326 to EPSG:3857
                  let coordinates = transform(storeArray, 'EPSG:4326', 'EPSG:3857');
                  let lastTwoCoordinates = transform(temp, 'EPSG:4326', 'EPSG:3857');
                  const windows = getBlocksByName('cMapWindow');
                  // get the active map window
                  const mapwindow = windows.find((window) => window.extendedTool.layersConfigId === globalThis.App.Layers.getConfigInstanceId());
                  const mapPanel = mapwindow.getReferencedBlock('cMapPanel');
                  const { map } = mapPanel.component;
                  // push all coordinates to one array
                  lastTwoCoordinates.forEach((x) => {
                    coordinates.push(x);
                  });
                  globalThis.App.OpenLayers.setExtentForMap(map, coordinates, 'EPSG:3857');
                },
                checkChange() {
                  extendedTool.toogleRemoveBtn();
                },
              },
            },
            {
              extendedTool,
              xtype: 'textfield',
              id: 'customBookmark',
              width: '90%',
              emptyText: 'Add Custom Bookmark Name',
              style: { marginLeft: '10px', marginTop: '5px' },
              isUserGeoJSON: false,
              hidden: false,
              listeners: {
                change(value) {
                  const addButton = Ext.getCmp('bookmarksButton');
                  if (value.lastValue !== '') {
                    addButton.enable();
                  } else {
                    addButton.disable();
                  }
                },
              },
            },
            {
              layout: 'column',
              width: '97%',
              style: {
                marginTop: '10px',
                marginBottom: '10px',
              },
              items: [
                {
                  extendedTool,
                  xtype: 'button',
                  text: 'Add',
                  id: 'bookmarksButton',
                  columnWidth: 0.5,
                  disabled: true,
                  style: {
                    marginLeft: '10px',
                  },
                  listeners: {
                    click() {
                      const cloneCookieArray = [];
                      const storeArray = [];
                      const temp = [];
                      let children;
                      const textField = Ext.getCmp('customBookmark');
                      const userInput = textField.value;

                      const windows = getBlocksByName('cMapWindow');
                      const mapwindow = windows.find((window) => window.extendedTool.layersConfigId === globalThis.App.Layers.getConfigInstanceId());
                      const mapPanel = mapwindow.getReferencedBlock('cMapPanel');
                      const { map } = mapPanel.component;

                      const extent = globalThis.App.OpenLayers.getCurrentMapWindowExtent(map);
                      for (let i = 0; i < 2; i++) {
                        storeArray.push(extent[i]);
                      }
                      for (let j = 2; j < extent.length; j++) {
                        temp.push(extent[j]);
                      }

                      let coordinates = transform(storeArray, 'EPSG:3857', 'EPSG:4326');
                      let lastTwoCoordinates = transform(temp, 'EPSG:3857', 'EPSG:4326');
                      lastTwoCoordinates.forEach((x) => {
                        coordinates.push(x);
                      });
                      const cookie = extendedTool.getCookie('bookmarks');
                      const parsedCookie = JSON.parse('[' + cookie + ']');
                      // will enter this if we already have custom bookmarks
                      // else we need to get the cookies and push the new one
                      if (parsedCookie.length === cookieArray.length) {
                        children = {
                          text: userInput,
                          leaf: true,
                          coords: coordinates,
                          checked: false,
                        };
                        cookieArray.push(children);
                      } else {
                        parsedCookie.forEach((x) => {
                          x.forEach((y) => {
                            cookieArray.push(y);
                          });
                        });
                        children = {
                          text: userInput,
                          leaf: true,
                          coords: coordinates,
                          checked: false,
                        };
                        cookieArray.push(children);
                        cookieArray = [...new Map(cookieArray.map((item) => [item.text, item])).values()];
                      }
                      cloneCookieArray.push({
                        text: userInput,
                        leaf: true,
                        coords: coordinates,
                        checked: false,
                      });
                      extendedTool.setCookie('bookmarks', JSON.stringify(cloneCookieArray), 32768);
                      extendedTool.reconfigureBookmarksTOC(cookieArray);
                      textField.setValue('');
                    },
                  },
                },
                {
                  extendedTool,
                  xtype: 'button',
                  text: 'Remove',
                  id: 'removeBookmarkBtn',
                  columnWidth: 0.5,
                  disabled: true,
                  style: {
                    marginLeft: '15px',
                  },
                  listeners: {
                    click() {
                      let children;
                      let modifiedCookies = [];
                      const tocExtendedTool = Ext.getCmp('bookmarksTOCTree');
                      // get the selected bookmarks that the user wants to remove
                      const selectedChildren = tocExtendedTool.getChecked();
                      selectedChildren.forEach((x) => {
                        x.destroy();
                      });

                      const cookie = extendedTool.getCookie('bookmarks');
                      const parsedCookie = JSON.parse('[' + cookie + ']');

                      parsedCookie.forEach((x) => {
                        x.forEach((y) => {
                          modifiedCookies.push(y);
                        });
                      });
                      // isolate the bookmarks cookies that are not selected for removal
                      for (var i = modifiedCookies.length - 1; i >= 0; i--) {
                        for (var j = 0; j < selectedChildren.length; j++) {
                          if (modifiedCookies[i] && modifiedCookies[i].text === selectedChildren[j].data.text) {
                            modifiedCookies.splice(i, 1);
                          }
                        }
                      }
                      // delete all cookies so we can set cookies from scratch.
                      document.cookie.split(';').forEach(function (c) {
                        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString());
                      });

                      if (modifiedCookies.length > 0) extendedTool.setCookie('bookmarks', JSON.stringify(modifiedCookies), 32768);
                      else cookieArray = [];
                      extendedTool.disableRemoveButton();
                      extendedTool.reconfigureBookmarksTOC(modifiedCookies);
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
      listeners: {
        collapse: function () {
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.find((x) => x.type.includes('expand')).el.dom.title = 'Expand';
          this.extendedTool.owningBlock.fire('collapse', this.extendedTool);
        },
        expand: function () {
          let finalCookieArray = [];
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.find((x) => x.type.includes('collapse')).el.dom.title = 'Collapse';
          this.extendedTool.owningBlock.fire('expand', this.extendedTool);
          // document.cookie.split(';').forEach(function (c) {
          //   document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString());
          // });
          const cookie = this.extendedTool.getCookie('bookmarks');
          // to avoid the non-whitespace error, I had to add the [ ] when parsing the cookie.
          const parseCookie = JSON.parse('[' + cookie + ']');
          // currently the parsedCookie has array of arrays but we need just array of cookies
          parseCookie.forEach((x) => {
            x.forEach((y) => {
              finalCookieArray.push(y);
            });
          });
          this.extendedTool.reconfigureBookmarksTOC(finalCookieArray);
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.forEach((element) => {
              element.el.dom.title = element.type[0].toUpperCase() + element.type.split('-')[0].slice(1);
            });
        },
      },
    };
    return component;
  },
};
