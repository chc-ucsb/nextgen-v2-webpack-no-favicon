/*
custom block fields
    ignoreDisplayNames
*/

import { getRandomString } from '../../../helpers/string';
import { roundValue } from '../../../helpers/math';
import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';

export const cFeatureInfoPanel = {
  options: {
    events: ['collapse', 'expand'],
  },
  openDrawer: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    const featureInfoPanel = extendedTool.component;
    const parent = extendedTool.owningBlock.parent.component;

    if (parent.collapsed) {
      parent.expand();
    }

    if (featureInfoPanel.collapsed) {
      featureInfoPanel.expand();
    }
  },
  mapWindowFocused: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;

    const newLayersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
    const shouldShut = extendedTool.updateFeatureInfoPanel(newLayersConfig);
    extendedTool.applyShouldShut(shouldShut);
  },
  featureInfoUpdatedCallbackFunction: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    const mapWindow = eventObject;
    const newLayersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

    const shouldShut = extendedTool.updateFeatureInfoPanel(newLayersConfig);
    extendedTool.tempMask.hide();

    extendedTool.applyShouldShut(shouldShut);
  },
  featureInfoFetchingCallbackFunction: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    const featureInfoPanel = extendedTool.component;
    // @ts-ignore
    extendedTool.tempMask = new Ext.LoadMask(featureInfoPanel, {
      msg: 'Fetching Info',
    });
    extendedTool.tempMask.show();
  },
  mapWindowDestroyed: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    extendedTool.clearFeatureInfoPanel();
  },
  mapWindowCreated: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    extendedTool.clearFeatureInfoPanel();
  },
  createExtendedTool: function (owningBlock) {
    return {
      owningBlock: owningBlock,
      uniqueId: 'feature-info-panel-' + getRandomString(32, 36),
      tempMask: null,
      clearFeatureInfoPanel: function () {
        const test = this.component;
        let f;
        while ((f = test.items.first())) {
          test.remove(f, true);
        }
      },
      updateFeatureInfoPanel: function (newLayersConfig) {
        if (typeof this.component === 'undefined') return false;

        const layersFeatureInfos = globalThis.App.Layers.query(
          newLayersConfig,
          {
            featureInfo: '*',
            display: true,
            loadOnly: false,
            mask: false,
          },
          ['overlays', 'boundaries']
        );

        this.component.removeAll();

        let areAllFeaturesNull = true;

        for (let index in layersFeatureInfos) {
          const layerWithFeatureInfo = layersFeatureInfos[index];

          const layername = layerWithFeatureInfo.name;

          let layerFeatureInfoHtml = '';

          for (let propertyName in layerWithFeatureInfo) {
            if (propertyName === 'featureInfo') {
              const featureInfoNode = layerWithFeatureInfo[propertyName];

              for (let featureInfoProperty in featureInfoNode) {
                const oneFeatureObject = featureInfoNode[featureInfoProperty];

                var row = oneFeatureObject.displayName + ' : ' + roundValue(oneFeatureObject.displayValue, oneFeatureObject.significantDigits);

                if (layername.search('phenologyamp') != -1) {
                  var required_value = oneFeatureObject.displayValue / 100;
                  var row = oneFeatureObject.displayName + ' : ' + required_value;
                }

                if (layername.search('phenologyeosn') != -1 || layername.search('phenologymaxn') != -1 || layername.search('phenologysosn') != -1) {
                  var required_value = (oneFeatureObject.displayValue - 100) / 100;
                  var row = oneFeatureObject.displayName + ' : ' + required_value;
                }

                //logger(oneFeatureObject.displayName);
                //logger(this.owningBlock.blockConfig);

                if (typeof this.owningBlock.blockConfig.ignoreDisplayNames !== 'undefined') {
                  if (this.owningBlock.blockConfig.ignoreDisplayNames.includes(oneFeatureObject.displayName)) {
                    //logger("ignoring" + oneFeatureObject.displayName);
                  } else {
                    layerFeatureInfoHtml = layerFeatureInfoHtml + row + '<br/>';
                  }
                } else {
                  layerFeatureInfoHtml = layerFeatureInfoHtml + row + '<br/>';
                }

                if (oneFeatureObject.value != null) {
                  areAllFeaturesNull = false;
                }
              }
            }
          }

          let sectionToUse = null;

          let onLayers = globalThis.App.Layers.query(newLayersConfig.boundaries, { id: layerWithFeatureInfo.id });
          if (onLayers.length > 0) {
            sectionToUse = newLayersConfig.boundaries;
          }

          onLayers = globalThis.App.Layers.query(newLayersConfig.overlays, { id: layerWithFeatureInfo.id });
          if (onLayers.length > 0) {
            sectionToUse = newLayersConfig.overlays;
          }

          //take each layer and make a panel from it
          //for each in the feature info loop
          const anItem = {
            title: globalThis.App.Layers.getDisplayNameForLayer(layerWithFeatureInfo, sectionToUse),
            collapsed: false,
            collapsible: false,
            height: 'auto',
            cls: 'featureInfoPanelSidebar',
            html: "<div class='info-panels'>" + layerFeatureInfoHtml + '</div>',
          };

          this.component.add(anItem);
        }

        return areAllFeaturesNull;
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
            if (this.component.collapsed) {
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
      closable: false,
      overflowY: 'auto',
      height: block.height,
      width: block.width,
      border: 1,
      bodyCls: 'roundCorners',
      cls: 'padPanel',
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
            globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_FEATUREINFO_FETCHING,
            this.extendedTool.owningBlock.itemDefinition.featureInfoFetchingCallbackFunction,
            this.extendedTool
          );

          globalThis.App.EventHandler.registerCallbackForEvent(
            globalThis.App.EventHandler.types.EVENT_LAYER_CONFIGURATION_FEATUREINFO_UPDATED,
            this.extendedTool.owningBlock.itemDefinition.featureInfoUpdatedCallbackFunction,
            this.extendedTool
          );

          globalThis.App.EventHandler.registerCallbackForEvent(
            globalThis.App.EventHandler.types.EVENT_REQUEST_TOOLS_DRAWER_OPEN,
            this.extendedTool.owningBlock.itemDefinition.openDrawer,
            this.extendedTool
          );

          globalThis.App.EventHandler.registerCallbackForEvent(
            globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED,
            this.extendedTool.owningBlock.itemDefinition.mapWindowFocused,
            this.extendedTool
          );

          globalThis.App.EventHandler.registerCallbackForEvent(
            globalThis.App.EventHandler.types.EVENT_MAPWINDOW_DESTROYED,
            this.extendedTool.owningBlock.itemDefinition.mapWindowDestroyed,
            this.extendedTool
          );

          globalThis.App.EventHandler.registerCallbackForEvent(
            globalThis.App.EventHandler.types.EVENT_MAPWINDOW_CREATED,
            this.extendedTool.owningBlock.itemDefinition.mapWindowCreated,
            this.extendedTool
          );
        },
      },
    };

    return ExtJSPosition(panel, block);
  },
};

export var toolName = 'cFeatureInfoPanel';
export var tool = cFeatureInfoPanel;
