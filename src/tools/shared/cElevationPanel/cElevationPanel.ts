/*
custom block fields
    ignoreDisplayNames
*/

import { getRandomString } from '../../../helpers/string';
import { roundValue } from '../../../helpers/math';
import { ExtJSPosition } from '../../../helpers/extjs';
import { isUrl } from '../../../helpers/validation';
import value from '*.png';
import { extend } from 'ol/extent';

export const cElevationPanel = {
  options: {
    events: ['collapse', 'expand'],
  },
  openDrawer: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    const ElevationPanel = extendedTool.component;
    const parent = extendedTool.owningBlock.parent.component;

    if (parent.collapsed) {
      parent.expand();
    }

    if (ElevationPanel.collapsed) {
      ElevationPanel.expand();
    }
  },
  mapWindowFocused: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;

    const newLayersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
    const map = eventObject.owningBlock.getReferencedBlock('cMapPanel').component.map;
    // If a crosshair exists the identify tool is active, so we update the panel to show values for the newly focused window.
    const shouldShut = globalThis.App.OpenLayers.getCrosshairLayer(map) ? extendedTool.updateElevationPanel(newLayersConfig) : false;
    extendedTool.applyShouldShut(shouldShut);
  },
  ElevationUpdatedCallbackFunction: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    const mapWindow = eventObject;

    //console.log("in updated function", extendedTool);

    const shouldShut = extendedTool.updateElevationPanel(mapWindow);
    extendedTool.tempMask.hide();

    extendedTool.applyShouldShut(shouldShut);
  },
  ElevationFetchingCallbackFunction: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    const ElevationPanel = extendedTool.component;
    // @ts-ignore
    extendedTool.tempMask = new Ext.LoadMask(ElevationPanel, {
      msg: 'Elevation Info',
    });
    
    //extract values from event object
    var elevation = eventObject["USGS_Elevation_Point_Query_Service"]["Elevation_Query"]["Elevation"] + " ft";
    var x = eventObject["USGS_Elevation_Point_Query_Service"]["Elevation_Query"]["x"]
    var y = eventObject["USGS_Elevation_Point_Query_Service"]["Elevation_Query"]["y"]

    //fix to 2 decimal places
    var x_fixed = x.toFixed(2);
    var y_fixed = y.toFixed(2);

    extendedTool.component.items.items[0].setValue(elevation);
    extendedTool.component.items.items[1].setValue(x_fixed);
    extendedTool.component.items.items[2].setValue(y_fixed);
    
    extendedTool.tempMask.show();
  },
  mapWindowDestroyed: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    extendedTool.clearElevationPanel();
  },
  mapWindowCreated: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    extendedTool.clearElevationPanel();
  },
  createExtendedTool: function (owningBlock) {
    return {
      owningBlock: owningBlock,
      uniqueId: 'elevation-panel-' + getRandomString(32, 36),
      tempMask: null,
      clearElevationPanel: function () {
        const test = this.component;
        let f;
        while ((f = test.items.first())) {
          test.remove(f, true);
        }
      },
      updateElevationPanel: function (newLayersConfig) {
        if (typeof this.component === 'undefined') return false;
      },
      //since there is only one used it makes sense to not make the
      //mutating methods part of the object
      applyShouldShut: function (shouldShut) {
        const parent = this.owningBlock.parent.component;
        if (shouldShut) {
          if (!parent.collapsed) {
            if (!this.component.collapsed) {
              this.component.toggleCollapse(true);
            }
          }
        } else {
          if (!parent.collapsed) {
            if (this.component.collapsed && this.component.items.length > 0) {
              this.component.toggleCollapse(true);
            }
          }
        }

        if (!parent.collapsed) {
          parent.doLayout();
          this.component.doLayout();
        }
      },
    };
  },

  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const panel = {
      extendedTool: extendedTool,
      id: extendedTool.uniqueId,
      title: block.title,
      collapsible: typeof block.collapsible !== 'undefined' ? block.collapsible : false,
      collapsed: typeof block.collapsed !== 'undefined' ? block.collapsed : false,
      componentCls: 'panel-border',
      closable: false,
      height: block.height,
      width: block.width,
      border: 1,
      bodyCls: 'roundCorners',
      cls: 'padPanel',
      layout: {
        type: 'vbox',
        align: 'middle',
      },
      items: [ 
              {
                xtype: 'displayfield',
                name: 'ele',
                fieldLabel: 'Elevation',
                value: ''
              },
              {
                xtype: 'displayfield',
                name: 'lat',
                fieldLabel: 'Longitude',
                value: ''
              },
              {
                xtype: 'displayfield',
                name: 'lon',
                fieldLabel: 'Latitude',
                value: ''
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
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.forEach((element) => {
              element.el.dom.title = element.type[0].toUpperCase() + element.type.split('-')[0].slice(1);
            });

            globalThis.App.EventHandler.registerCallbackForEvent(
              globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_ELEVATION_FETCHING,
              this.extendedTool.owningBlock.itemDefinition.ElevationFetchingCallbackFunction,
              this.extendedTool
            );

            globalThis.App.EventHandler.registerCallbackForEvent(
              globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_ELEVATION_UPDATED,
              this.extendedTool.owningBlock.itemDefinition.ElevationUpdatedCallbackFunction,
              this.extendedTool
            );
        },
      },
    };

    return ExtJSPosition(panel, block);
  },
};
