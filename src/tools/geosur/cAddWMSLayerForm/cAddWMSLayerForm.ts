/** cAddWMSLayerForm.js
 * Tool to add WMS layers by the user on TOC and map panel for GEOSUR viewer using cDefaultTOC.
 * This tools is based on the cAddWMSLayerForm shared tool but modified to make it work for cDefaultTOC
 * where a new folder needs to be created to add the WMS layers coming from this tool.
 *
 * Required Tools:
 *      N/A
 *
 * Block Parameters:
 *      Required:
 *          block: block position (relative)
 *          name: "cAddWMSLayerForm" - The name of the tool.
 *          import: The location of the tools javascript code
 *              Ex: import": "tools.geosur.cAddWMSLayerForm.cAddWMSLayerForm"
 *          add: Boolean - Indicates whether to load this tool or not
 *          height: Integer - tool window height
 *          width: Integer - tool window width
 *          title: String - tool window title
 *          x: Integer - x window position
 *           y: Integer - y window position
 *
 *      Optional:
 *          progressMessage: String - progress message when loading layers to the viewer
 *          additionalLayersTitle: String - Folder name where the WMS layers selected in the tool will be added, if not defined "Additional Layers" is used.
 *          wmsLayersTitle: String - Folder name used in 'getmap', if not defined "WMS layers" is used.
 *          getLayersBtnTxt: String - Get layers button label, if not defined "Get layers" is used.
 *          addSelectedLayersBtnTxt: String - Add selected layers button label, if not defined "Add selected layers" is used.
 *          wmsLayerTitleTxt: String - Title for the list of layers retrieve from WMS URL, if not defined "Layers" is used.
 *          wmsUrlFieldLbl: String - URL field label, if not defined "URL:" is used.
 *          titleTxtFieldLbl: String - Title field text, if not defined "Title" is used.
 *          legendStyleTxtFieldLbl: String - Legend style field text, if not defined "Legend style:" is used.
 *          legendUrlTxtFieldLbl: String - Legend URL field text, if not defined "Legend URL:" is used.
 *          legendTitleHereTitle: String - Legend title here title, if not defined "Legend title" is used.
 *          errorRequestMessage: String - Error message when request parameter is incorrect, if not defined "Invalid request parameter" is used.
 *          errorServiceMessage: String - Error message when service parameter is incorrect, if not defined "Invalid service parameter" is used.
 *          errorCapabilitiesRequestMessage: String - Error message when getCapabilites is invalid, if not defined "Request must be valid GetCapabilities" is used.
 *          errorUrlRequestMessage: String - Error message when URL is invalid, if not defined "Request could not complete. Please check the URL.<br> Status code: " is used.
 *          errorDuplicateLayersMessage: String - Error message when selected WMS layers are duplicated in WMS folder, if not defined "Some selected layers already exist in" is used.
 *
 */
import { buildUrl, buildUrlParams, hashCode, parseGETURL, XMLtoJSON } from '../../../helpers/string';
import { getJsonLayerListWithGeoserverCapabilitiesURL } from '../../../helpers/network';
import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Transport } from '../../../Network/Transport';
import { isEmpty } from '../../../helpers/validation';
import { objPropExists } from '../../../helpers/object';
import { Dictionary } from '../../../@types';
import { first } from '../../../helpers/array';

export const cAddWMSLayerForm = {
  options: {
    delayRender: true,
  },
  createExtendedTool: function (owningBlock) {
    return {
      owningBlock: owningBlock,
      mask: null,
      maskTool: function () {
        const block = owningBlock.blockConfig;
        if (this.mask === null) {
          this.mask = new Ext.LoadMask(this.component, {
            msg: typeof block.progressMessage !== 'undefined' ? block.progressMessage : 'Loading Layers ...',
          });
        }

        this.mask.show();
      },
      unmaskTool: function () {
        setTimeout(
          function (addWmsLayerTool) {
            addWmsLayerTool.mask.hide();
          },
          500,
          this
        );
      },
      getCurrentMapWindow: function () {
        const mapWindowComponent = Ext.getCmp(globalThis.App.Layers.getConfigInstanceId());
        if (mapWindowComponent) return mapWindowComponent;
        return null;
      },
    };
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    let errorMessage = null;

    const addWmsLayerForm = {
      extendedTool: extendedTool,
      title: block.title,
      id: 'addWmsLayerWindow',
      width: block.width,
      height: block.height,
      layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start',
      },
      autoHeight: true,
      bodyStyle: 'padding:5px;',
      border: false,
      collapsible: true,
      constrain: true,
      items: [
        {
          xtype: 'textfield',
          name: 'url',
          fieldLabel: typeof block.wmsUrlFieldLbl !== 'undefined' ? block.wmsUrlFieldLbl : 'WMS URL:',
        },
        {
          xtype: 'button',
          name: 'get-layers',
          text: typeof block.getLayersBtnTxt !== 'undefined' ? block.getLayersBtnTxt : 'Get layers',
          handler: function () {
            const addWmsLayerTool = this.addWmsLayerTool;
            const urlTextField = addWmsLayerTool.query('textfield[name=url]')[0];

            let url = '';
            url = urlTextField.getValue();
            if (url == '') return;
            addWmsLayerTool.extendedTool.maskTool();

            if (addWmsLayerTool.query('grid[id=addLayersList]').length > 0) {
              var grid = addWmsLayerTool.query('grid[id=addLayersList]');
              addWmsLayerTool.remove(grid[0]);
            }

            if (addWmsLayerTool.query('textfield[name=title]').length > 0) {
              var textField = addWmsLayerTool.query('textfield[name=title]');
              addWmsLayerTool.remove(textField[0]);
            }

            if (addWmsLayerTool.query('textfield[name=wmsLegendURL]').length > 0) {
              var textField = addWmsLayerTool.query('textfield[name=wmsLegendURL]');
              addWmsLayerTool.remove(textField[0]);
            }

            if (addWmsLayerTool.query('textfield[name=bbox]').length > 0) {
              var textField = addWmsLayerTool.query('textfield[name=bbox]');
              addWmsLayerTool.remove(textField[0]);
            }

            if (addWmsLayerTool.query('textfield[name=wmsLegendStyle]').length > 0) {
              var textField = addWmsLayerTool.query('textfield[name=wmsLegendStyle]');
              addWmsLayerTool.remove(textField[0]);
            }

            if (addWmsLayerTool.query('button[id=addLayersBtn]').length > 0) {
              const button = addWmsLayerTool.query('button[id=addLayersBtn]');
              addWmsLayerTool.remove(button[0]);
            }

            if (addWmsLayerTool.query('panel[id=error-panel]').length > 0) {
              const panel = addWmsLayerTool.query('panel[id=error-panel]');
              addWmsLayerTool.remove(panel[0]);
            }

            const parsedURL = parseGETURL(url);

            // Check for valid wms service url
            if (!parsedURL.request || !parsedURL.REQUEST) {
              parsedURL.REQUEST = 'GetCapabilities';
            }
            if (!parsedURL.service || !parsedURL.SERVICE) {
              parsedURL.SERVICE = 'WMS';
            }

            if (parsedURL.REQUEST.toLowerCase() !== 'getmap' && parsedURL.REQUEST.toLowerCase() !== 'getcapabilities') {
              addWmsLayerTool.height = 135;
              errorMessage = typeof block.errorRequestMessage !== 'undefined' ? block.errorRequestMessage : 'Invalid or missing request parameter';
              addWmsLayerTool.add({
                xtype: 'panel',
                id: 'error-panel',
                html: "<p style='color:red;'>" + errorMessage + '</p>',
              });
              addWmsLayerTool.extendedTool.unmaskTool();
              return;
            } else if (parsedURL.SERVICE.toLowerCase() !== 'wms') {
              addWmsLayerTool.height = 135;
              errorMessage = typeof block.errorServiceMessage !== 'undefined' ? block.errorServiceMessage : 'Invalid or missing service parameter';
              addWmsLayerTool.add({
                xtype: 'panel',
                id: 'error-panel',
                html: "<p style='color:red;'>" + errorMessage + '</p>',
              });
              addWmsLayerTool.extendedTool.unmaskTool();
              return;
            }

            // FIXME - getmap not working
            if (parsedURL.REQUEST.toLowerCase() === 'getmap') {
              addWmsLayerTool.height = 135;
              errorMessage =
                typeof block.errorCapabilitiesRequestMessage !== 'undefined'
                  ? block.errorCapabilitiesRequestMessage
                  : 'Request must be valid GetCapabilities';
              addWmsLayerTool.add({
                xtype: 'panel',
                id: 'error-panel',
                html: "<p style='color:red;'>" + errorMessage + '</p>',
              });
              addWmsLayerTool.extendedTool.unmaskTool();
              return; // The rest of getmap code disabled.

              // if (parsedURL.crs)
              //     parsedURL.srs = parsedURL.crs;
              // parsedURL.srs = parsedURL.srs.replace(/%3A/, ":");

              // addWmsLayerTool.height = 240;
              // addWmsLayerTool.add({
              //     xtype : 'textfield',
              //     name : 'title',
              //     fieldLabel : (typeof(block.titleFieldLbl) !== 'undefined') ? block.titleTxtFieldLbl : 'Title:',
              //     margin : '5px 0',
              // }, {
              //     xtype : 'textfield',
              //     name : 'wmsLegendStyle',
              //     fieldLabel : (typeof(block.legendStyleTxtFieldLbl) !== 'undefined') ? block.legendStyleTxtFieldLbl : 'Legend Style:',
              //     margin : '5px 0',
              // }, {
              //     xtype : 'textfield',
              //     name : 'wmsLegendURL',
              //     fieldLabel : (typeof(block.legendUrlTxtFieldLbl) !== 'undefined') ? block.legendUrlTxtFieldLbl : 'Legend URL:',
              //     margin : '5px 0',
              // });

              // var layers = parsedURL.layers;

              // var addLayerBtn = Ext.create('Ext.Button', {
              //         text : (typeof(block.addSelectedLayersBtnTxt) !== 'undefined') ? block.addSelectedLayersBtnTxt : 'Add selected layers',
              //         id : 'addLayersBtn',
              //         margin : '10 0 0 0',
              //         handler : function () {
              //             var addWmsLayerTool = this.addWmsLayerTool;
              //             var titleTextField = addWmsLayerTool.query('textfield[name=title]')[0];
              //             var title = (titleTextField.getValue()) ? titleTextField.getValue() : (parsedURL.layers) ? parsedURL.layers : "";
              //             var bbox = "";
              //             if (bbox == "" && parsedURL.bbox)
              //                 bbox = parsedURL.bbox;

              //             var folder = {
              //                 isAdded : true,
              //                 type : 'layer',
              //                 name : layers,
              //                 title : title,
              //                 opacity : 1,
              //                 display : true,
              //                 mask : false,
              //                 loadOnly : false,
              //                 zIndex : 0,
              //                 source : {
              //                     wms : parsedURL.baseURL + "?",
              //                 },
              //                 version : parsedURL.version,
              //                 srs : parsedURL.srs,
              //                 bbox : bbox,
              //                 legend : {
              //                     "style" : addWmsLayerTool.query('textfield[name=wmsLegendStyle]')[0].getValue(),
              //                     "title" : "",
              //                     "customImageURL" : addWmsLayerTool.query('textfield[name=wmsLegendURL]')[0].getValue(),
              //                 },
              //                 transparency : (parsedURL.transparent && parsedURL.transparent.toLowerCase() === "true") ? true : false,
              //                 id : "layer-" + Math.abs(Utils.hashCode(layers + parseInt(Math.random() * 10000) + Math.floor((Math.random() * Math.pow(10, 5) + 1)))),
              //             };

              //             var tocType = mapper.tocConfig.configuration.type;
              //             if (tocType === 'dataset') {
              //                 var mapWindow = addWmsLayerTool.extendedTool.getCurrentMapWindow(),
              //                 layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId()),
              //                 additional = {};

              //                 if (layersConfig.hasOwnProperty('additional') === false) {
              //                     additional = {
              //                         type : 'folder',
              //                         title : (typeof(block.additionalLayersTitle) !== 'undefined') ? block.additionalLayersTitle : 'Additional Layers',
              //                         id : "layer-" + Math.abs(Utils.hashCode(layers + parseInt(Math.random() * 10000) + Math.floor((Math.random() * Math.pow(10, 5) + 1)))),
              //                         expanded : true,
              //                         folder : []
              //                     };
              //                     layersConfig.overlays.push(additional);
              //                 } else {
              //                     for (var i = 0, len = layersConfig.overlays.length; i < len; i+=1) {
              //                         if (layersConfig.overlays[i].title === 'Additional Layers') {
              //                             additional = layersConfig.overlays[i];
              //                             break;
              //                         }
              //                     }
              //                 }

              //                 additional.folder.unshift(folder);
              //                 mapWindow.extendedTool.mapWindowMapperLayersConfig = layersConfig;

              //                 globalThis.App.OpenLayers.updateMapLayerOpacitiesAndDisplayedLayersFromLayersConfig(layersConfig, mapWindow.extendedTool.mapWindowOpenLayersPanel.map);
              //                 skin.toc.layersTree.updateTocStore();

              //                 /*************************/

              //                 var mapWindow = addWmsLayerTool.extendedTool.getCurrentMapWindow(),
              //                 layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

              //                 var parentFolder = globalThis.App.Layers.query(
              //                     layersConfig.overlays,
              //                     function (folder) {
              //                         if (folder.type !== 'folder') return false;
              //                         var layers = folder.folder;
              //                         for (var i = 0, len = layers.length; i < len; i+=1) {
              //                             var layer = layers[i];
              //                             if (layer.type === 'folder') return false;
              //                             if (layer.display === true) return true;
              //                         }
              //                         return false;
              //                     }
              //                 );

              //                 if (parentFolder.length > 0) {
              //                     parentFolder = parentFolder[0];
              //                     parentFolder.folder = selection.concat(parentFolder.folder);
              //                 }

              //                 mapWindow.extendedTool.mapWindowMapperLayersConfig = layersConfig;

              //                 globalThis.App.EventHandler.postEvent(
              //                     globalThis.App.EventHandler.types.EVENT_MAPWINDOW_LAYER_CONFIGURATION_UPDATED,
              //                     layersConfig,
              //                     mapWindow.extendedTool
              //                 );

              //                 globalThis.App.OpenLayers.updateMapLayerOpacitiesAndDisplayedLayersFromLayersConfig(layersConfig, mapWindow.extendedTool.mapWindowOpenLayersPanel.map);
              //                 skin.toc.layersTree.updateTocStore();
              //                 mapWindow.setTitle(globalThis.App.Layers.getTopLayerTitle(layersConfig.overlays));
              //             } else if (tocType === 'layers') {
              //                 var layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
              //                 var overlays = layersConfig.overlays;
              //                 var datasetFolder;
              //                 for (var i = 0; i < overlays.length; i++) {
              //                     if (overlays[i].title === 'Dataset') {
              //                         datasetFolder = overlays[i];
              //                         break;
              //                     }
              //                 }

              //                 var newFolder;
              //                 for (var i = 0; i < datasetFolder.folder.length; i++) {
              //                     if (datasetFolder.folder[i].title == 'WMS Layers') {
              //                         newFolder = datasetFolder.folder[i];
              //                         break;
              //                     }
              //                 }

              //                 if (!newFolder) {
              //                     var newFolder = {
              //                         expanded : true,
              //                         type : 'folder',
              //                         title : (typeof(block.wmsLayersTitle) !== 'undefined') ? block.wmsLayersTitle : 'WMS Layers',
              //                         id : "layer-" + Math.abs(Utils.hashCode(layers + parseInt(Math.random() * 10000) + Math.floor((Math.random() * Math.pow(10, 5) + 1)))),
              //                         folder : [folder],
              //                     };

              //                     datasetFolder.folder.unshift(newFolder);
              //                 } else {
              //                     newFolder.folder.unshift(folder);
              //                 }

              //                 var mapWindow = addWmsLayerTool.extendedTool.getCurrentMapWindow();
              //                 mapWindow.extendedTool.mapWindowMapperLayersConfig = layersConfig;
              //                 mapWindow.setTitle(globalThis.App.Layers.getTopLayerTitle(layersConfig.overlays));
              //                 globalThis.App.OpenLayers.updateMapLayerOpacitiesAndDisplayedLayersFromLayersConfig(mapWindow.extendedTool.mapWindowMapperLayersConfig, mapWindow.extendedTool.mapWindowOpenLayersPanel.map);
              //                 skin.toc.defaultTree.updateTocStore();
              //             }
              //         }
              //     });

              // addLayerBtn.addWmsLayerTool = addWmsLayerTool;
              // addWmsLayerTool.add(addLayerBtn);
              // skin.addWmsLayerTool.unMaskAddWmsLayerTool();
            } else if (parsedURL.REQUEST.toLowerCase() === 'getcapabilities') {
              addWmsLayerTool.height = 420;
              let requestUrl;
              const proxyUrl = globalThis.App.Config.proxies.WMSProxyURL;

              if (typeof proxyUrl === 'string' && proxyUrl !== '') {
                requestUrl = buildUrlParams(proxyUrl, parsedURL);
              } else {
                requestUrl = buildUrl(parsedURL.baseUrl, {
                  REQUEST: parsedURL.REQUEST,
                  SERVICE: parsedURL.SERVICE,
                });
              }

              // Prevent 'Blocked loading mixed active content' errors by not mixing HTTPS and HTTP content.
              // If the viewer is hosted on an HTTPS site, requesting content from an HTTP protocol will result in an error.
              // However, if the viewer is hosted on an HTTP site, it's OK to request content from an HTTPS site.
              if (location.protocol === 'https:' && requestUrl.startsWith('http:')) {
                requestUrl = requestUrl.replace(/http:/, location.protocol);
                urlTextField.setValue(requestUrl);
              }

              Transport.get(requestUrl, {
                callback: async function (configRequest) {
                  const json = XMLtoJSON(await configRequest.text());
                  for (let prop in json) if (json[prop].constructor === Array) json[prop] = json[prop][json[prop].length - 1]; // Remove extra tags such as the <!DOCTYPE> tag.
                  const storeData = getJsonLayerListWithGeoserverCapabilitiesURL(json).map((layer) => {
                    const data: Dictionary = {
                      title: isEmpty(layer.title) ? layer.name : layer.title,
                      name: layer.name,
                      legendName: layer?.style?.name ?? '',
                      legendURL: layer?.style?.legendURL?.onlineResource ?? null,
                    };

                    if (objPropExists(layer, 'boundingBox')) {
                      const boundingBox: Record<string, string> = first(layer.boundingBox);
                      const { minx, miny, maxx, maxy } = boundingBox;
                      data.bbox = [minx, miny, maxx, maxy];
                      if (objPropExists(boundingBox, 'CRS')) data.crs = boundingBox.CRS;
                      if (objPropExists(boundingBox, 'SRS')) data.srs = boundingBox.SRS;
                    }

                    return data;
                  });

                  const store = Ext.create('Ext.data.Store', {
                    fields: ['title', 'name', 'legendName', 'legendURL', 'crs'],
                    data: storeData,
                  });

                  const columns = [
                    {
                      text: typeof block.wmsLayerTitleTxt !== 'undefined' ? block.wmsLayerTitleTxt : 'Layer Title',
                      dataIndex: 'title',
                      width: '100%',
                    },
                  ];

                  const grid = Ext.create('Ext.grid.Panel', {
                    store: store,
                    id: 'addLayersList',
                    columns: columns,
                    width: 300,
                    height: 200,
                    margin: '10 0 0 0',
                    border: 1,
                    style: {
                      borderStyle: 'solid',
                    },
                    selModel: {
                      mode: 'MULTI',
                      listeners: {
                        selectionchange: function (model, selected) {
                          const titleTextField = addWmsLayerTool.query('textfield[name=title]')[0];
                          if (selected.length > 1) {
                            titleTextField.disable();
                          } else {
                            titleTextField.enable();
                          }
                        },
                      },
                    },
                  });

                  addWmsLayerTool.add(grid);

                  addWmsLayerTool.add(
                    {
                      xtype: 'textfield',
                      name: 'title',
                      fieldLabel: typeof block.titleTxtFieldLbl !== 'undefined' ? block.titleTxtFieldLbl : 'Title:',
                      margin: '5px 0',
                    },
                    {
                      xtype: 'textfield',
                      name: 'wmsLegendStyle',
                      fieldLabel: typeof block.legendStyleTxtFieldLbl !== 'undefined' ? block.legendStyleTxtFieldLbl : 'Legend Style:',
                      margin: '5px 0',
                    }
                  );

                  const addLayerBtn = Ext.create('Ext.Button', {
                    text: typeof block.addSelectedLayersBtnTxt !== 'undefined' ? block.addSelectedLayersBtnTxt : 'Add selected layers',
                    id: 'addLayersBtn',
                    margin: '10 0 0 0',
                    addWmsLayerTool: addWmsLayerTool,
                    handler() {
                      const { addWmsLayerTool } = this;
                      const titleTextField = addWmsLayerTool.query('textfield[name=title]')[0];

                      const models = grid.getSelectionModel().getSelection();

                      // Loop through selected layers define newLayer and added to selection
                      const selections = models.map((model) => {
                        let title;
                        if (models.length === 1) {
                          title = titleTextField.getValue();
                          if (title === '') title = model.raw.title;
                        } else {
                          title = model.raw.title;
                        }

                        const newLayer: Dictionary = {
                          isAdded: true,
                          type: 'layer',
                          title: title,
                          name: model.raw.name,
                          opacity: 1,
                          display: true,
                          mask: false,
                          loadOnly: false,
                          zIndex: 0,
                          source: {
                            wms: parsedURL.baseUrl + '?',
                          },
                          legend: {
                            style: addWmsLayerTool.query('textfield[name=wmsLegendStyle]')[0].getValue(),
                            customImageURL: model.raw?.legendURL ?? null,
                            title: block.legendTitleHereTitle ?? 'Legend Title Here',
                          },
                          transparency: true,
                          id: 'layer-' + Math.abs(hashCode(model.raw.name + Math.random() * 10000 + Math.floor(Math.random() * Math.pow(10, 5) + 1))),
                        };

                        if (model.raw.bbox) newLayer.bbox = model.raw.bbox;
                        if (model.raw.srs) newLayer.srs = model.raw.srs;
                        if (model.raw.crs) newLayer.crs = model.raw.crs;
                        globalThis.App.Layers.storeLayerIdentifiers(newLayer);
                        return newLayer;
                      });

                      const additionalLayersFolder =
                        typeof block.additionalLayersTitle !== 'undefined' ? block.additionalLayersTitle : 'Additional Layers';

                      const mapWindow = addWmsLayerTool.extendedTool.getCurrentMapWindow();
                      const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

                      // Check if additional layers folder already exists in layersConfig.overlays
                      // if exist get the index value from array
                      const addLayersIndex = layersConfig.overlays.findIndex((overlay) => overlay.title === additionalLayersFolder);

                      // if additional layers folder exists, append selection layers
                      // otherwise create folder and add it to layersConfig.overlays
                      // with the selection info
                      const duplicatedAddedLayers = [];
                      const errorPanel = Ext.getCmp('error-panel');
                      const errorPanelExists = typeof errorPanel !== 'undefined';

                      addWmsLayerTool.height = 420;

                      // Remove any existing error panel
                      if (errorPanelExists) {
                        addWmsLayerTool.remove(errorPanel);
                      }

                      if (addLayersIndex > -1) {
                        const addedLayers = layersConfig.overlays[addLayersIndex].folder;
                        for (const selection of selections) {
                          const idx: number = addedLayers.findIndex((x) => x.title === selection.title);
                          if (idx === -1) addedLayers.unshift(selection);
                          else duplicatedAddedLayers.unshift(selection.title);
                        }

                        // Display message about layers already added in additionalLayersFolder
                        if (duplicatedAddedLayers.length > 0) {
                          addWmsLayerTool.height = 500;

                          errorMessage =
                            typeof block.errorDuplicateLayerMessage !== 'undefined'
                              ? block.errorDuplicateLayerMessage
                              : 'Some selected layers already exist in';

                          addWmsLayerTool.add({
                            xType: 'panel',
                            id: 'error-panel',
                            html: `<p style='color: red;'>${errorMessage} '${additionalLayersFolder}'<br />${duplicatedAddedLayers.join(', ')}</p>`,
                          });

                          addWmsLayerTool.extendedTool.unmaskTool();
                          return;
                        }
                      } else {
                        layersConfig.overlays.push({
                          type: 'folder',
                          title: additionalLayersFolder,
                          name: 'additional',
                          id: 'layer-' + Math.abs(hashCode(String(Math.random() * 10000 + Math.floor(Math.random() * Math.pow(10, 5) + 1)))),
                          expanded: true,
                          folder: selections,
                        });
                      }

                      const mapPanelBlock = mapWindow.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
                      globalThis.App.OpenLayers.updateMapLayerOpacitiesAndDisplayedLayersFromLayersConfig(layersConfig, mapPanelBlock.component.map);

                      globalThis.App.EventHandler.postEvent(
                        globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
                        layersConfig,
                        null
                      );

                      globalThis.App.EventHandler.postEvent(
                        globalThis.App.EventHandler.types.EVENT_MAPWINDOW_LAYER_CONFIGURATION_UPDATED,
                        layersConfig,
                        mapWindow.extendedTool
                      );
                    },
                  });

                  addWmsLayerTool.add(addLayerBtn);
                  addWmsLayerTool.extendedTool.unmaskTool();
                },
                callbackObj: addWmsLayerTool,
                errCallback: function (configRequest, addWmsLayerTool) {
                  addWmsLayerTool.height = 155;
                  errorMessage =
                    typeof block.errorUrlRequestMessage !== 'undefined'
                      ? block.errorUrlRequestMessage
                      : 'Request could not complete. Please check the URL.<br> Status code: ';
                  addWmsLayerTool.add({
                    xtype: 'panel',
                    id: 'error-panel',
                    html: "<p style='color:red;'>" + errorMessage + configRequest.status + '</p>',
                  });
                  addWmsLayerTool.extendedTool.unmaskTool();
                },
              });
            }
          },
        },
      ],
      listeners: {
        close: function () {
          this.extendedTool.owningBlock.remove();
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;

          const getLayersBtn = this.query('button[name=get-layers]')[0];
          getLayersBtn.addWmsLayerTool = this;
        },
      },
    };

    return ExtJSPosition(addToolBarItems(block, addWmsLayerForm, toolbar), block);
  },
};
