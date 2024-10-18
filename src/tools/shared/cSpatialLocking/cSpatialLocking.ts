import View from 'ol/View';
import { getRandomString } from '../../../helpers/string';
import { getBlocksByName } from '../../../helpers/extjs';

export const cSpatialLocking = {
  options: {
    events: ['collapse', 'expand'],
  },
  updateNames: function (eventObject, callbackObject, postingObject) {
    const aMapWindow = postingObject;
    const checkboxID = aMapWindow.component.getId() + 'checkbox';
    const extCheckBox = Ext.getCmp(checkboxID);
    const extMapWindow = Ext.getCmp(aMapWindow.component.getId());
    extCheckBox.setBoxLabel(extMapWindow.title);
  },
  removeWindowFromExtList: function (eventObject, callbackObject, postingObject) {
    const aMapWindow = postingObject;
    const extendedTool = callbackObject;
    const spatialLockingExtTool = extendedTool.component;
    const count = spatialLockingExtTool.items.getCount();

    for (let i = 0; i < count; i++) {
      const extCheckBox = spatialLockingExtTool.items.items[i];
      const mapWindowIDForCheckBox = extCheckBox.id;

      if (mapWindowIDForCheckBox === aMapWindow.component.getId() + 'checkbox') {
        i = count;
        spatialLockingExtTool.remove(extCheckBox);
      }
    }
  },
  addWindowToExtList: function (eventObject, aCallbackObject, postingObject) {
    const aMapWindow = postingObject,
      extendedTool = aCallbackObject;
    let mapWindowTitle = aMapWindow.component.title;
    //mapWindowTitle = aMapWindow.mapWindowExtWindowTitle;
    // if (mapWindowTitle.length > 34) {
    //   mapWindowTitle = mapWindowTitle.substr(0, 31) + '...';
    // }

    let checked = false;

    if (aCallbackObject.owningBlock.blockConfig.defaultLock && aCallbackObject.owningBlock.blockConfig.defaultLock === true) {
      checked = true;
    }

    // @ts-ignore
    const newCheckbox = new Ext.form.Checkbox({
      extendedTool: extendedTool,
      id: aMapWindow.component.getId() + 'checkbox',
      fieldlabel: 'aLabel',
      boxLabel: mapWindowTitle,
      grow: true,
      checked,
      listeners: {
        change: function (field, newValue, oldValue, options) {
          globalThis.App.Tools.cSpatialLocking.unlockMaps();
          globalThis.App.Tools.cSpatialLocking.lockMaps(this.extendedTool);
        },
      },
    });
    Ext.getCmp('spatialLockingToolExtPanel').add(newCheckbox);
    if (checked)
      setTimeout(() => {
        globalThis.App.Tools.cSpatialLocking.lockMaps(extendedTool);
      }, 10);
  },
  lockMaps: function (extendedTool) {
    const totalWindows = getBlocksByName('cMapWindow');

    const extCheckBoxes = Ext.getCmp('spatialLockingToolExtPanel').items.items;
    const checkedMapWindows = [];
    //-------

    //get checked mapWindows
    //start at 1 to skip first checkbox
    let x;
    let len;

    for (x = 0, len = extCheckBoxes.length; x < len; x += 1) {
      if (extCheckBoxes[x].checked === true) checkedMapWindows.push(totalWindows[x]);
    }

    if (totalWindows.length > 1) {
      let center, resolution;
      for (x = 0, len = checkedMapWindows.length; x < len; x += 1) {
        const mapPanelBlock = checkedMapWindows[x].getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        const view = map.getView();
        if (x === 0) {
          center = view.getCenter();
          resolution = view.getResolution();
        } else {
          view.setCenter(center);
          view.setResolution(resolution);
        }
        view.set('map', map);
        view.set('extendedTool', extendedTool);
        view.set('uniqueId', getRandomString(32, 36));

        view.on('change:center', function (event) {
          this.get('extendedTool').handleCenter(this);
        });

        view.on('change:resolution', function (event) {
          this.get('extendedTool').handleZoom(this);
        });
      }
    }

    globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_SPATIAL_LOCKING_WINDOW_UPDATED, checkedMapWindows, extendedTool);
  },
  unlockMaps: function () {
    const totalWindows = getBlocksByName('cMapWindow'); //code executed with checkbox is
    // checked, locking map windows code

    let x = 0;
    const len = totalWindows.length;
    for (; x < len; x += 1) {
      const mapWindow = totalWindows[x];
      const mapPanelBlock = mapWindow.getReferencedBlock('cMapPanel');
      const map = mapPanelBlock.component.map;

      const currentView = map.getView();
      const currentZoom = currentView.getZoom();
      const currentCenter = currentView.getCenter();

      //ol3 doesnt store these when we create the view in defineOpenLayers
      //so we cant retrieve them

      const minZoom = 1;
      const zoomFactor = 2;

      map.setView(
        new View({
          center: currentCenter,
          zoom: currentZoom,
          zoomFactor: zoomFactor,
          minZoom: minZoom,
        })
      );
    }
  },
  createExtendedTool: function (owningBlock) {
    return {
      owningBlock: owningBlock,
      preventBacklash: false,
      handleCenter: function (view) {
        if (this.preventBacklash === false) {
          this.preventBacklash = true;
          const totalWindows = getBlocksByName('cMapWindow');
          const extCheckBoxes = Ext.getCmp('spatialLockingToolExtPanel').items.items;
          const checkedMapWindows = [];
          let x;
          for (x = 0, len = extCheckBoxes.length; x < len; x += 1) {
            if (extCheckBoxes[x].checked === true) checkedMapWindows.push(totalWindows[x]);
          }
          for (var i = 0, len = checkedMapWindows.length; i < len; i += 1) {
            const mapPanelBlock = checkedMapWindows[i].getReferencedBlock('cMapPanel');
            const map = mapPanelBlock.component.map;
            if (map.getView().get('uniqueId') !== view.get('uniqueId')) {
              map.getView().setCenter(view.getCenter());
            }
          }
          this.preventBacklash = false;
        }
      },
      handleZoom: function (view) {
        if (this.preventBacklash === false) {
          this.preventBacklash = true;
          const totalWindows = getBlocksByName('cMapWindow');
          const extCheckBoxes = Ext.getCmp('spatialLockingToolExtPanel').items.items;
          const checkedMapWindows = [];
          let x;
          for (x = 0, len = extCheckBoxes.length; x < len; x += 1) {
            if (extCheckBoxes[x].checked === true) checkedMapWindows.push(totalWindows[x]);
          }
          for (var i = 0, len = checkedMapWindows.length; i < len; i += 1) {
            const mapPanelBlock = checkedMapWindows[i].getReferencedBlock('cMapPanel');
            const map = mapPanelBlock.component.map;
            if (map.getView().get('uniqueId') !== view.get('uniqueId')) {
              map.getView().setResolution(view.getResolution());
            }
          }
          this.preventBacklash = false;
        }
      },
    };
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const position = block.block;
    const title = block.title;
    const height = block.height;

    const panel = Ext.create('Ext.Panel', {
      extendedTool: extendedTool,
      title: title,
      width: 'auto',
      height: height,
      collapsible: typeof block.collapsible !== 'undefined' ? block.collapsible : false,
      collapsed: typeof block.collapsed !== 'undefined' ? block.collapsed : false,
      collapseFirst: false,
      closable: false,
      componentCls: 'panel-border',
      id: 'spatialLockingToolExtPanel',
      autoScroll: true,
      border: 1,
      bodyCls: 'roundCorners',
      cls: 'padPanel',
      tools: [
        {
          type: 'help',
          tooltip: 'Get Help',
          callback: function (panel, tool, event) {
            Ext.Msg.show({
              title: 'Spatial Locking Tool',
              msg:
                'This tool allows the user to spatially lock multiple map windows.  When two or more windows are visible, users can click the checkbox of each dataset window they want synced.  Once checked, moving around spatially in one of the checked windows will automatically move all other checked windows in unison',
              buttons: Ext.Msg.CANCEL,
              icon: Ext.Msg.QUESTION,
            });
          },
        },
      ],
      listeners: {
        collapse: function () {
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.find((x) => x.type.includes('expand')).el.dom.title = 'Expand';
          this.extendedTool.owningBlock.fire('collapse', this.extendedTool);
        },

        expand: function () {
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.find((x) => x.type.includes('collapse')).el.dom.title = 'Collapse';
          this.extendedTool.owningBlock.fire('expand', this.extendedTool);
        },

        afterrender: function () {
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.rendered = true;
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.forEach((element) => {
              element.el.dom.title = element.type[0].toUpperCase() + element.type.split('-')[0].slice(1);
            });
        },
      },
    });

    const mapWindows = getBlocksByName('cMapWindow');
    let i = 0;
    const len = mapWindows.length;
    for (; i < len; i += 1) {
      const mapWindow = mapWindows[i];
      globalThis.App.Tools.cSpatialLocking.addWindowToExtList(null, extendedTool, mapWindow.extendedTool);
    }

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_CREATED,
      extendedTool.owningBlock.itemDefinition.addWindowToExtList,
      extendedTool
    );

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_DESTROYED,
      extendedTool.owningBlock.itemDefinition.removeWindowFromExtList,
      extendedTool
    );

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_LAYER_CONFIGURATION_UPDATED,
      extendedTool.owningBlock.itemDefinition.updateNames,
      extendedTool
    );

    return panel;
  },
};
