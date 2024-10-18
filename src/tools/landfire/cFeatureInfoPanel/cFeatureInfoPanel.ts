/*
custom block fields
    ignoreDisplayNames
*/

import { getRandomString } from '../../../helpers/string';
import { roundValue } from '../../../helpers/math';
import { ExtJSPosition } from '../../../helpers/extjs';
import { isUrl } from '../../../helpers/validation';
import { objPropExists } from '../../../helpers/object';
import { buildUrl } from '../../../helpers/string';
import { Transport } from '../../../Network/Transport';

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
    const map = eventObject.owningBlock.getReferencedBlock('cMapPanel').component.map;
    // If a crosshair exists the identify tool is active, so we update the panel to show values for the newly focused window.
    const shouldShut = globalThis.App.OpenLayers.getCrosshairLayer(map) ? extendedTool.updateFeatureInfoPanel(newLayersConfig) : false;
    //extendedTool.applyShouldShut(shouldShut);
  },
  featureInfoUpdatedCallbackFunction: function (eventObject, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    const mapWindow = eventObject;
    const newLayersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

    const shouldShut = extendedTool.updateFeatureInfoPanel(newLayersConfig);
    extendedTool.tempMask.hide();

    //extendedTool.applyShouldShut(shouldShut);
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

      getLegendURL: function (layer, width = 20, height = 17): string | null {
        const legendUrl = null;
        if (objPropExists(layer, 'legend')) {
          const wmsURL = layer.source.wms;
          let layerName;

          if (objPropExists(layer, 'wmstName')) {
            layerName = layer.wmstName;
          } else {
            layerName = layer.name;
          }

          const queryParams = {
            REQUEST: 'GetLegendGraphic',
            VERSION: '1.0.0',
            FORMAT: 'application/json',
            LAYER: layerName,
          };

          return buildUrl(wmsURL, queryParams);
        }
        return legendUrl;
      },

      makeGetRequest: async function (path) {
        const res = await Transport.get(path);
        const featureInfo = await res.json();

        return featureInfo;
      },

      updateFeatureInfoPanel: async function (newLayersConfig) {
        if (typeof this.component === 'undefined') return false;

        const layersFeatureInfos = globalThis.App.Layers.query(
          newLayersConfig,
          {
            featureInfo: '*',
            display: true,
            loadOnly: false,
            mask: false,
          },
          ['overlays', 'boundaries', 'additional']
        );

        const layersFeatureInfoLoadOnly = globalThis.App.Layers.query(
          newLayersConfig,
          {
            featureInfo: '*',
            display: false,
            loadOnly: true,
            mask: false,
          },
          ['overlays', 'boundaries', 'additional']
        );

        layersFeatureInfos.push.apply(layersFeatureInfos, layersFeatureInfoLoadOnly);

        this.component.removeAll();

        let areAllFeaturesNull = true;
        let nullCheck = [];

        const customRows = owningBlock.blockConfig?.customRows || [];

        for (let index in layersFeatureInfos) {
          const layerWithFeatureInfo = layersFeatureInfos[index];

          let layerFeatureInfoHtml = '';

          if (layerWithFeatureInfo.featureInfo) {
            let match;
            const customRowsToAdd = [];

            if (layerWithFeatureInfo.featureInfo.GRAY_INDEX) {
              let grayIndexValue;
              grayIndexValue = layerWithFeatureInfo.featureInfo.GRAY_INDEX.value;
              let legendURL = this.getLegendURL(layerWithFeatureInfo);

              // If the layer has no legend property the url will be NULL
              if (legendURL) {
                let response = await this.makeGetRequest(legendURL);

                if (response) {
                  const resJson = response.Legend[0].rules[0].symbolizers[0].Raster.colormap.entries;

                  resJson.forEach((element) => {
                    if (element.quantity == grayIndexValue) {
                      match = element;
                    }
                  });

                  if (match !== undefined) {
                    if (match.label && match.color) {
                      let label = match.label;
                      let color = match.color;

                      customRowsToAdd.push([
                        `<b>Color: </b> <div style="background-color:${color};width:10px;height:10px;display:inline-block"></div> <br/>`,
                      ]);
                      customRowsToAdd.push([`<b>Label: </b> ${label} <br/>`]);
                    }
                  }
                }
              }
            }

            // If the layer has multiple feature infos (like from an ArcGIS server), we want to create separate entries in the panel
            if (Array.isArray(layerWithFeatureInfo.featureInfo)) {
              for (let i = 0; i < layerWithFeatureInfo.featureInfo.length; i += 1) {
                const featureInfoNode = layerWithFeatureInfo.featureInfo[i];
                let row;
                if (!featureInfoNode) layerFeatureInfoHtml = 'No Data Available <br/>';

                // Create the custom rows here
                // https://stackoverflow.com/questions/5520880/getting-content-between-curly-braces-in-javascript-with-regex
                // https://stackoverflow.com/questions/5334380/replacing-text-inside-of-curley-braces-javascript
                // Regex to find values in curly braces
                const valueInCurlyBraces = /{([^}]+)}/g;
                const valueInDoubleCurlyBraces = /{{([^}]+)}}/g;

                customRows.forEach((parts: Array<string>, idx: number) => {
                  // Loop over the parts of each custom row
                  let skip = false;

                  const tmp = parts.map((part) => {
                    if (skip) return;

                    let found = [];
                    let curMatch;

                    // We should check if these found values even exist in the featureInfoNode. Boundary layers might not have the same properties as rasters.
                    //  If even one value is missing we should skip the custom row

                    try {
                      // Process any double curly braces
                      // Values that are in double curly braces are used as a reference to another featureInfo property.
                      // LANDFIRE, for example, uses the 'legenField' property to determine which featureInfo value should be used.
                      // So here we're replacing {{legenField}} with whatever is in that field (for example) CLASSNAMES. This will remove the first set of curly braces.
                      // {CLASSNAMES} will then be replaced below when we process values in single curly braces.
                      while ((curMatch = valueInDoubleCurlyBraces.exec(part))) {
                        part = part.replace(new RegExp('{' + curMatch[1] + '}', 'gi'), featureInfoNode[curMatch[1]].value);
                      }

                      // Collect all the values that are within single curly braces
                      while ((curMatch = valueInCurlyBraces.exec(part))) {
                        found.push(curMatch[1]);
                      }

                      for (let i = 0; i < found.length; i += 1) {
                        // Replace each value in curly braces with the value from the featureInfo
                        if (!featureInfoNode[found[i]]) {
                          // If it doesn't exist, check if it's there but lowercase (ex. 'PROPERTY' may not exist, but 'property' does)
                          part = part.replace(new RegExp('{' + found[i] + '}', 'gi'), featureInfoNode[found[i].toLowerCase()].value);
                        } else {
                          part = part.replace(new RegExp('{' + found[i] + '}', 'gi'), featureInfoNode[found[i]].value);
                        }
                      }
                    } catch (e) {
                      skip = true;
                      return;
                    }

                    return part;
                  });

                  if (!skip) customRowsToAdd.push(tmp.concat('<br />').join(''));
                });

                for (let featureInfoProperty in featureInfoNode) {
                  if (featureInfoProperty === 'settings') break;

                  const oneFeatureObject = featureInfoNode[featureInfoProperty];

                  row = `<b>${oneFeatureObject.displayName}:</b> ${roundValue(oneFeatureObject.displayValue, oneFeatureObject.significantDigits)}`;

                  if (this.owningBlock.blockConfig.replaceNullWithNoData) row = row.replace('null', 'No Data');

                  // Make URL values clickable links.
                  if (isUrl(oneFeatureObject.displayValue as string)) {
                    row = row.replace(
                      oneFeatureObject.displayValue,
                      `<a href="${oneFeatureObject.displayValue}" target="_blank">${oneFeatureObject.displayValue}</a>`
                    );
                  }

                  if (layerWithFeatureInfo.additionalAttributes?.identifyToolValues?.[oneFeatureObject.displayValue]) {
                    row = `${oneFeatureObject.displayName} : ${
                      layerWithFeatureInfo.additionalAttributes.identifyToolValues[oneFeatureObject.displayValue]
                    }`;
                  }

                  if (layerWithFeatureInfo.additionalAttributes?.elevationToolValues?.[oneFeatureObject.displayValue]) {
                    row = `${oneFeatureObject.displayName} : ${
                      layerWithFeatureInfo.additionalAttributes.elevationToolValues[oneFeatureObject.displayValue]
                    }`;
                  }

                  if (typeof this.owningBlock.blockConfig.ignoreDisplayNames !== 'undefined') {
                    if (this.owningBlock.blockConfig.ignoreDisplayNames.includes(oneFeatureObject.displayName)) {
                    } else {
                      layerFeatureInfoHtml = layerFeatureInfoHtml + row + '<br/>';
                    }
                  } else {
                    layerFeatureInfoHtml = layerFeatureInfoHtml + row + '<br/>';
                  }

                  if (typeof oneFeatureObject === 'object' && oneFeatureObject.value !== null) {
                    areAllFeaturesNull = false;
                  } else if (oneFeatureObject) {
                    areAllFeaturesNull = false;
                  }
                }

                // Skip custom rows if no replacements have been made on it. -- Prevent adding the 'Color' row to rasters that don't have it
                // Append the custom rows to layerFeatureInfoHtml
                customRowsToAdd.forEach((customRow) => {
                  layerFeatureInfoHtml += customRow;
                });

                // Add <hr /> if multiple feature infos exist
                if (i < layerWithFeatureInfo.featureInfo.length - 1) {
                  layerFeatureInfoHtml += '<hr />';
                }
              }
            } else {
              const featureInfoNode = layerWithFeatureInfo.featureInfo;
              let row;

              if (!featureInfoNode) layerFeatureInfoHtml = 'No Data Available <br/>';

              if (layerWithFeatureInfo.source?.vectorTile) {
                Object.entries(featureInfoNode).map(([key, value]) => {
                  row = `<b>${key}:</b> ${value}`;
                  if (this.owningBlock.blockConfig.replaceNullWithNoData) row = row.replace('null', 'No Data');

                  // Make URL values clickable links.
                  if (isUrl(value as string)) {
                    row = row.replace(value, `<a href="${value}" target="_blank">${value}</a>`);
                  }

                  layerFeatureInfoHtml = layerFeatureInfoHtml + row + '<br/>';
                });
              } else {
                // Create the custom rows here
                const valueInCurlyBraces = /{([^}]+)}/g;
                const valueInDoubleCurlyBraces = /{{([^}]+)}}/g;

                customRows.forEach((parts: Array<string>, idx: number) => {
                  // Loop over the parts of each custom row
                  let skip = false;

                  const tmp = parts.map((part) => {
                    if (skip) return;

                    let found = [];
                    let curMatch;

                    // We should check if these found values even exist in the featureInfoNode. Boundary layers might not have the same properties as rasters.
                    //  If even one value is missing we should skip the custom row

                    try {
                      // Process any double curly braces
                      // Values that are in double curly braces are used as a reference to another featureInfo property.
                      // LANDFIRE, for example, uses the 'legenField' property to determine which featureInfo value should be used.
                      // So here we're replacing {{legenField}} with whatever is in that field (for example) CLASSNAMES. This will remove the first set of curly braces.
                      // {CLASSNAMES} will then be replaced below when we process values in single curly braces.
                      while ((curMatch = valueInDoubleCurlyBraces.exec(part))) {
                        part = part.replace(new RegExp('{' + curMatch[1] + '}', 'gi'), featureInfoNode[curMatch[1]].value);
                      }

                      // Collect all the values that are within single curly braces
                      while ((curMatch = valueInCurlyBraces.exec(part))) {
                        found.push(curMatch[1]);
                      }

                      for (let i = 0; i < found.length; i += 1) {
                        // Replace each value in curly braces with the value from the featureInfo
                        if (!featureInfoNode[found[i]]) {
                          // If it doesn't exist, check if it's there but lowercase (ex. 'PROPERTY' may not exist, but 'property' does)
                          part = part.replace(new RegExp('{' + found[i] + '}', 'gi'), featureInfoNode[found[i].toLowerCase()].value);
                        } else {
                          part = part.replace(new RegExp('{' + found[i] + '}', 'gi'), featureInfoNode[found[i]].value);
                        }
                      }
                    } catch (e) {
                      skip = true;
                      return;
                    }

                    return part;
                  });

                  if (!skip) {
                    customRowsToAdd.push(tmp.concat('<br />').join(''));
                  }
                });

                for (let featureInfoProperty in featureInfoNode) {
                  const oneFeatureObject = featureInfoNode[featureInfoProperty];

                  if (oneFeatureObject.displayName == 'GRAY_INDEX') {
                    oneFeatureObject.displayName = 'Pixel Value';
                  }

                  row = `<b>${oneFeatureObject.displayName}:</b> ${roundValue(oneFeatureObject.displayValue, oneFeatureObject.significantDigits)}`;

                  if (this.owningBlock.blockConfig.replaceNullWithNoData) row = row.replace('null', 'No Data');

                  // Make URL values clickable links.
                  if (isUrl(oneFeatureObject.displayValue as string)) {
                    row = row.replace(
                      oneFeatureObject.displayValue,
                      `<a href="${oneFeatureObject.displayValue}" target="_blank">${oneFeatureObject.displayValue}</a>`
                    );
                  }

                  if (layerWithFeatureInfo.additionalAttributes?.identifyToolValues?.[oneFeatureObject.displayValue]) {
                    row = `${oneFeatureObject.displayName} : ${
                      layerWithFeatureInfo.additionalAttributes.identifyToolValues[oneFeatureObject.displayValue]
                    }`;
                  }

                  if (layerWithFeatureInfo.additionalAttributes?.elevationToolValues?.[oneFeatureObject.displayValue]) {
                    row = `${oneFeatureObject.displayName} : ${
                      layerWithFeatureInfo.additionalAttributes.elevationToolValues[oneFeatureObject.displayValue]
                    }`;
                  }

                  if (typeof this.owningBlock.blockConfig.ignoreDisplayNames !== 'undefined') {
                    if (this.owningBlock.blockConfig.ignoreDisplayNames.includes(oneFeatureObject.displayName)) {
                    } else {
                      layerFeatureInfoHtml = layerFeatureInfoHtml + row + '<br/>';
                    }
                  } else {
                    layerFeatureInfoHtml = layerFeatureInfoHtml + row + '<br/>';
                  }

                  if (typeof oneFeatureObject === 'object' && oneFeatureObject.value !== null) {
                    areAllFeaturesNull = false;
                  } else if (oneFeatureObject) {
                    areAllFeaturesNull = false;
                  }
                }

                // TODO: Don't add the custom row if no replacements have been made on it. -- Prevent adding the 'Color' row to rasters that don't have it
                // Append the custom rows to layerFeatureInfoHtml
                customRowsToAdd.forEach((customRow) => {
                  layerFeatureInfoHtml = layerFeatureInfoHtml + customRow;
                });
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

          onLayers = globalThis.App.Layers.query(newLayersConfig.additional, { id: layerWithFeatureInfo.id });
          if (onLayers.length > 0) {
            sectionToUse = newLayersConfig.additional;
          }

          if (layerFeatureInfoHtml === '') {
            layerFeatureInfoHtml = 'No Data Available <br/>';
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
          // Add to nullCheck array, non-null values will be at the front (displayed at top of panel).
          if (layerFeatureInfoHtml.includes('null') || layerFeatureInfoHtml.includes('No Data')) {
            nullCheck.push(anItem);
          } else {
            nullCheck.unshift(anItem);
          }
        }

        nullCheck.forEach((layer) => {
          this.component.add(layer);
        });

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
      collapseFirst: false,
      closable: false,
      overflowY: 'auto',
      height: block.height,
      width: block.width,
      border: 1,
      bodyCls: 'roundCorners',
      cls: 'padPanel',
      tools: [
        {
          type: 'help',
          tooltip: 'Get Help',
          callback: function (panel, tool, event) {
            Ext.Msg.show({
              title: 'Identify Tool',
              msg:
                'This tool allows the user to get feature info for a specific pixel. To activate, please select <i class="fa ' +
                'fa-info-circle mrlc-fb"></i> from the map window toolbar and select a pixel on the map. ',
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
