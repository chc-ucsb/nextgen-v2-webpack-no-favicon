import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { MultiPolygon, Polygon, Point as PointGeom } from 'ol/geom';
import { Fill, Stroke, Style } from 'ol/style';
import Feature from 'ol/Feature';
import { unByKey } from 'ol/Observable';
import { asyncAjax } from '../../../helpers/network';
import { logger, dateHelpers } from '../../../utils';
import { getRandomString } from '../../../helpers/string';
import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Transport } from '../../../Network/Transport';
import { Dict } from '../../../@types';
import { Point } from 'proj4';

// TODO: Switch `buildTableFromIdList` and `layersConfigUpdated` from
//  using asyncAjax to the Transport class.
//  Upon initial testing, setting either `buildTableFromIdList` or `layersConfigUpdated`
//  to `async` causes the component to fail when rendering.

export const cFeatureInfoTable = {
  options: {
    requiredBlocks: ['cMapPanel'],
    events: ['tableUpdatedEvent', 'checkchange'],
  },
  init: function (blueprint) {
    Ext.define('Ext.grid.header.ContainerCustomSort', {
      override: 'Ext.grid.header.Container',
      onSortAscClick: function () {
        logger.log(this);
        const sortParam = this.getMenu().activeHeader.dataIndex;
        this.extendedTool.sortColumnName = sortParam;
        this.extendedTool.sortDirection = 'ASC';
        this.extendedTool.sortColumn();
      },
      onSortDescClick: function () {
        const sortParam = this.getMenu().activeHeader.dataIndex;
        this.extendedTool.sortColumnName = sortParam;
        this.extendedTool.sortDirection = 'DESC';
        this.extendedTool.sortColumn();
      },
    });

    globalThis.App.Tools.createGridPanelHeaderCheckbox();
  },
  layersConfigUpdated: function (layersConfig, callbackObject, postingObject) {
    const extendedTool = callbackObject;
    extendedTool.maskComponent();

    // Set default total pages and current page to 0.
    extendedTool.currentPage = 0;
    extendedTool.totalPages = 0;
    const mappedLayers = extendedTool.owningBlock.blockConfig.layers;
    const mappedLayerIds = [];
    for (var i = 0, len = mappedLayers.length; i < len; i += 1) {
      mappedLayerIds.push(mappedLayers[i].id);
    }

    // Fetch displayed overlays.
    const displayedLayers = globalThis.App.Layers.query(
      layersConfig,
      function (layer) {
        if (
          mappedLayerIds.indexOf(layer.id) !== -1 &&
          layer.type === 'layer' &&
          layer.mask === false &&
          (layer.display === true || layer.loadOnly === true)
        ) {
          return true;
        }
        return false;
      },
      ['overlays']
    );

    // Check to ensure at least one filter exists before loading features into table.
    let hasAnyCqlFilter = false;
    for (var i = 0, len = displayedLayers.length; i < len; i += 1) {
      var layer = displayedLayers[i];
      if (layer.hasOwnProperty('cqlFilter') && layer.cqlFilter !== null) {
        hasAnyCqlFilter = true;
        break;
      }
    }

    // If no cql filter exists, empty table and return.
    if (hasAnyCqlFilter === false) {
      extendedTool.component.getStore().removeAll();
      extendedTool.unMaskComponent();
      extendedTool.featureList = [];
      extendedTool.owningBlock.fire('tableUpdatedEvent', extendedTool);
      return;
    }

    for (var i = 0, len = displayedLayers.length; i < len; i += 1) {
      var layer = displayedLayers[i];
      let cqlFilterParam = '';
      const cqlFilter = [];
      let idProperty = '';

      if (layer.hasOwnProperty('cqlFilter')) {
        for (let prop in layer.cqlFilter) {
          if (layer.cqlFilter[prop] !== null) cqlFilter.push(layer.cqlFilter[prop]);
        }
      }
      if (cqlFilter.length > 0) {
        cqlFilterParam = '&CQL_FILTER=' + cqlFilter.join(' AND ');
      }
      extendedTool.cqlFilter = cqlFilterParam;

      const toolLayerConfig = globalThis.App.Layers.getLayerConfig(layer.id, extendedTool.owningBlock.blockConfig.layers);
      const propertyNameParam = [];
      if (toolLayerConfig !== null) {
        idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(toolLayerConfig.featureInfo, ['id'], 'propertyName')[0];
        propertyNameParam.push(idProperty);
      }

      if (extendedTool.sortColumnName !== null) {
        propertyNameParam.push(extendedTool.sortColumnName);
      }

      // Send wfs request to retrieve only the ids of all features to be loaded.
      const url = layer.source.wfs;
      const params =
        'service=WFS&request=GetFeature&version=1.1.0&srsName=' +
        layer.srs +
        '&typeNames=' +
        layer.name +
        '&outputFormat=application/json&propertyName=' +
        propertyNameParam.join(',') +
        cqlFilterParam;

      // const res = await Transport.post(params).to(url, {
      //   headers: {
      //     'Content-type': 'application/x-www-form-urlencoded',
      //   },
      // });
      // const featureInfo = await res.json();
      //
      // // Get mappings in template.json for this layer.
      // const layerMapping = globalThis.App.Layers.getLayerConfig(layer.id, extendedTool.owningBlock.blockConfig.layers);
      // const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName');
      // // Combine all polygons belonging to a multipolygon into a multipolygon.
      // const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperties);
      // // Set current page and total pages.
      // const featureCount = features.length;
      // if (featureCount > 0) {
      //   this.currentPage = 1;
      //   this.totalPages = Math.ceil(featureCount / extendedTool.recordsPerPage);
      // }
      //
      // // Retrieve paging toolbar.
      // const items = extendedTool.component.getDockedItems();
      // let toolbar;
      // for (i = 0; i < items.length; i += 1) {
      //   if (items[i].xtype === 'toolbar') {
      //     toolbar = items[i];
      //     break;
      //   }
      // }
      // // Set total pages for paging form elements.
      // toolbar.child('#inputItem').setMaxValue(extendedTool.totalPages);
      //
      // const featureList = [];
      // for (i = 0; i < featureCount; i += 1) {
      //   // featureList is a multidimentional array of feature ids and checked values. Not storing objects for
      //   // performance reasons.
      //   featureList.push([features[i].properties[idProperties[0]], true]);
      // }
      //
      // if (extendedTool.sortColumnName !== null) {
      //   extendedTool.featureList = extendedTool.sortFeatureList(featureList, features, extendedTool.sortColumnName, idProperties[0], extendedTool.sortDirection);
      // } else {
      //   extendedTool.featureList = featureList;
      // }
      //
      // /* Check to see if we're supposed to highlight a feature */
      // if (extendedTool.selectedFeatureId !== null) {
      //   const currentPage = extendedTool.currentPage;
      //   let recordIndex = null;
      //   let recordPage = 1;
      //   //Determine the recordIndex for the selectedFeature
      //   for (i = 0; i < featureList.length; i += 1) {
      //     const feature = featureList[i];
      //     if (feature[0] === extendedTool.selectedFeatureId) {
      //       recordIndex = i;
      //       break;
      //     }
      //   }
      //
      //   if (recordIndex !== null) {
      //     //Determine the page and the new record index
      //     while (recordIndex >= extendedTool.recordsPerPage) {
      //       recordIndex -= extendedTool.recordsPerPage;
      //       recordPage += 1;
      //     }
      //
      //     //Set the row and change the page
      //     extendedTool.rowToSelect = recordIndex;
      //     extendedTool.currentPage = recordPage;
      //   } else {
      //     // Highlighted record was not found so remove the table and map highlight
      //     extendedTool.rowToSelect = null;
      //     extendedTool.unhighlightFeature(extendedTool.selectedFeatureId);
      //   }
      // }
      // extendedTool.buildTableFromIdList();

      asyncAjax({
        method: 'POST',
        url: url,
        body: params,
        callbackObj: {
          layer: layer,
          extendedTool: extendedTool,
          cqlFilter: cqlFilterParam,
        },
        callback: function (response, callbackObj) {
          let i;
          const layer = callbackObj.layer;
          const extendedTool = callbackObj.extendedTool;
          const featureInfo = JSON.parse(response.responseText);
          if (callbackObj.cqlFilter !== extendedTool.cqlFilter) return;

          // Get mappings in template.json for this layer.
          const layerMapping = globalThis.App.Layers.getLayerConfig(callbackObj.layer.id, extendedTool.owningBlock.blockConfig.layers);
          const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName');
          // Combine all polygons belonging to a multipolygon into a multipolygon.
          const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperties);
          // Set current page and total pages.
          const featureCount = features.length;
          if (featureCount > 0) {
            extendedTool.currentPage = 1;
            extendedTool.totalPages = Math.ceil(featureCount / extendedTool.recordsPerPage);
          }

          // Retrieve paging toolbar.
          const items = extendedTool.component.getDockedItems();
          let toolbar;
          for (i = 0; i < items.length; i += 1) {
            if (items[i].xtype === 'toolbar') {
              toolbar = items[i];
              break;
            }
          }
          // Set total pages for paging form elements.
          toolbar.child('#inputItem').setMaxValue(extendedTool.totalPages);

          const featureList = [];
          for (i = 0; i < featureCount; i += 1) {
            // featureList is a multidimentional array of feature ids and checked values. Not storing objects for
            // performance reasons.
            featureList.push([features[i].properties[idProperties[0]], true]);
          }

          if (extendedTool.sortColumnName !== null) {
            extendedTool.featureList = extendedTool.sortFeatureList(
              featureList,
              features,
              extendedTool.sortColumnName,
              idProperties[0],
              extendedTool.sortDirection
            );
          } else {
            extendedTool.featureList = featureList;
          }

          /* Check to see if we're supposed to highlight a feature */
          if (extendedTool.selectedFeatureId !== null) {
            const currentPage = extendedTool.currentPage;
            let recordIndex = null;
            let recordPage = 1;
            //Determine the recordIndex for the selectedFeature
            for (i = 0; i < featureList.length; i += 1) {
              const feature = featureList[i];
              if (feature[0] === extendedTool.selectedFeatureId) {
                recordIndex = i;
                break;
              }
            }

            if (recordIndex !== null) {
              //Determine the page and the new record index
              while (recordIndex >= extendedTool.recordsPerPage) {
                recordIndex -= extendedTool.recordsPerPage;
                recordPage += 1;
              }

              //Set the row and change the page
              extendedTool.rowToSelect = recordIndex;
              extendedTool.currentPage = recordPage;
            } else {
              // Highlighted record was not found so remove the table and map highlight
              extendedTool.rowToSelect = null;
              extendedTool.unhighlightFeature(extendedTool.selectedFeatureId);
            }
          }
          extendedTool.buildTableFromIdList();
        },
      });
    }
  },
  createExtendedTool: function (owningBlock) {
    let heightDiff = -1;
    const parentHeight = owningBlock.parent.blockConfig.height;
    const height = owningBlock.blockConfig.height;
    if (typeof parentHeight !== 'undefined' && typeof parentHeight === 'number' && typeof height !== 'undefined' && typeof height === 'number') {
      heightDiff = parentHeight - height;
    }

    let defaultSortColumn = null;
    const columnMetaData = [];
    const displayedLayers = globalThis.App.Layers.query(
      globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId()),
      {
        type: 'layer',
        display: true,
      },
      ['overlays', 'boundaries']
    );

    // Finds the id property of a mapped displayed layer to set the default sort.
    let i = 0;
    const len = displayedLayers.length;
    for (; i < len; i += 1) {
      const layer = displayedLayers[i];
      const toolLayerConfig = globalThis.App.Layers.getLayerConfig(layer.id, owningBlock.blockConfig.layers);
      if (toolLayerConfig !== null) {
        defaultSortColumn = globalThis.App.Layers.getFeaturePropertiesByTypes(toolLayerConfig.featureInfo, ['id'], 'propertyName')[0];
        const properties = globalThis.App.Layers.getFeaturePropertiesByTypes(toolLayerConfig.featureInfo, ['id', 'name', 'display']);
        let j = 0;
        const length = properties.length;
        for (; j < length; j += 1) {
          const property = properties[j];
          columnMetaData.push({
            name: property.propertyName,
            width: property.hasOwnProperty('columnWidth') ? property.columnWidth : 120,
            hidden: false,
          });
        }
        break;
      }
    }

    const extendedTool = {
      owningBlock: owningBlock,
      heightDiff: heightDiff,
      mask: null,
      vector: new VectorLayer({
        source: new VectorSource(),
      }),
      currentRequestId: null, // Store latest request id in case a previous request returns after sending latest
      // request.
      mapClickEventKey: null, // Store the id of the registered map click event so we can remove it later.
      selectedFeatureId: null, // Store the selected feature to prevent highlighting over it.
      highlightedFeatureId: null, // Store the highlighted feature id to prevent highlighting it again.
      afterPageText: 'of {0}', // Text to appear after page text box. {0} will be replaced by total pages.
      rowCountText: 'Showing {0} - {1} of {2}',
      featureList: [], // Store a list of all feature ids and their checked status in the table.
      currentPage: 0,
      totalPages: 0,
      recordsPerPage: 50, // Changing this will alter how many records are displayed per page.
      columnMetaData: columnMetaData, // Stores information about columns. (display order, hidden status, width)
      sortColumnName: defaultSortColumn, // Store the name of the column to be sorted by. Column name is the same as
      // the feature info property to sort by.
      featureIdProperty: defaultSortColumn,
      sortDirection: 'ASC', // Store the sort direction.
      rowToSelect: null, // When highlighting a row in the table, if the record is on another page, set this to the
      // row index to be highlighted when changing pages.
      isMasked: false, // Prevent interactions while table is masked.
      component: undefined,
      featureIdList: [],
      cqlFilter: '',

      // Custom sort functions to sort features based on one of their properties. Supports sorting strings in which
      // some strings start with numbers.
      naturalSort: function (array, columnName) {
        const sortColumn = columnName;
        let a, b, a1, b1;
        const rx = /(\d+)|(\D+)/g,
          rd = /\d+/;
        return array.sort(function (as, bs) {
          a = String(as.properties[sortColumn]).toLowerCase().match(rx);
          b = String(bs.properties[sortColumn]).toLowerCase().match(rx);
          // if no string is present (aka null value)
          if (a && !b) {
            return -1;
          } else if (!a && b) {
            return 1;
          } else if (!a && !b) {
            return 0;
          }
          // if both values, proceed with normal sorting
          while (a.length && b.length) {
            a1 = a.shift();
            b1 = b.shift();
            if (rd.test(a1) || rd.test(b1)) {
              if (!rd.test(a1)) return 1;
              if (!rd.test(b1)) return -1;
              if (a1 != b1) return a1 - b1;
            } else if (a1 != b1) return a1 > b1 ? 1 : -1;
          }
          return a.length - b.length;
        });
      },
      naturalSortDesc: function (array, columnName) {
        const sortColumn = columnName;
        let a, b, a1, b1;
        const rx = /(\d+)|(\D+)/g,
          rd = /\d+/;
        // Same as naturalSort but we switch variables 'as' and 'bs' around.
        return array.sort(function (bs, as) {
          a = String(as.properties[sortColumn]).toLowerCase().match(rx);
          b = String(bs.properties[sortColumn]).toLowerCase().match(rx);
          // if no string is present (aka null value)
          if (a && !b) {
            return -1;
          } else if (!a && b) {
            return 1;
          }
          // if both values, proceed with normal sorting
          while (a.length && b.length) {
            a1 = a.shift();
            b1 = b.shift();
            if (rd.test(a1) || rd.test(b1)) {
              if (!rd.test(a1)) return 1;
              if (!rd.test(b1)) return -1;
              if (a1 != b1) return a1 - b1;
            } else if (a1 != b1) return a1 > b1 ? 1 : -1;
          }
          return a.length - b.length;
        });
      },
      // Creates an instance of Feature
      getOLFeature: function (featureInfo, style, layer) {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        const feature = featureInfo.features[0];
        const featureProjection = layer.srs;
        let coords = feature.geometry.coordinates;
        const type = feature.geometry.type;
        const mapProjection = map.getView().getProjection().getCode();
        const layerMapping = globalThis.App.Layers.getLayerConfig(layer.id, this.owningBlock.blockConfig.layers);
        const idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName')[0];

        // Convert coordinate projection if needed.
        if (featureProjection !== mapProjection) {
          coords = globalThis.App.OpenLayers.convertCoordProj(coords, featureProjection, mapProjection);
        }

        let geometry;
        if (type === 'MultiPolygon') {
          geometry = new MultiPolygon(coords);
        } else if (type === 'Point') {
          geometry = new PointGeom(coords);
        } else {
          geometry = new Polygon(coords);
        }

        const olFeature = new Feature(geometry);
        olFeature.setId(feature.properties[idProperty]);
        olFeature.setStyle(style);

        return olFeature;
      },
      // Creates and instance of Style to be applied to a selected feature.
      getSelectedStyle: function () {
        return new Style({
          stroke: new Stroke({
            color: 'rgba(135,206,235,1)',
            width: 4,
          }),
          fill: new Fill({
            color: 'rgba(0,0,0,0)',
          }),
        });
      },
      // Creates and instance of Style to be applied to a highlighted feature.
      getHighlightedStyle: function () {
        return new Style({
          stroke: new Stroke({
            color: 'rgba(255,154,0,.8)',
            width: 1,
          }),
          fill: new Fill({
            color: 'rgba(255,154,0,.5)',
          }),
        });
      },
      // Add a click event to the map to highlight a fire that is clicked on.
      addMapEvent: function () {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;

        this.mapClickEventKey = map.on(
          'click',
          async function (event) {
            if (this.isMasked === true) return;
            const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            const map = mapPanelBlock.component.map;
            const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
            const displayedOverlays = globalThis.App.Layers.query(layersConfig.overlays, {
              type: 'layer',
              display: true,
              loadOnly: false,
              mask: false,
            });

            if (displayedOverlays.length > 0) {
              let i = 0;
              const len = displayedOverlays.length;
              for (; i < len; i += 1) {
                const overlay = displayedOverlays[i];
                const toolLayerConfig = globalThis.App.Layers.getLayerConfig(overlay.id, extendedTool.owningBlock.blockConfig.layers);
                if (toolLayerConfig !== null) {
                  const featureInfo = await globalThis.App.OpenLayers.getLayerFeatureInfoViaXYCoord(overlay, event.coordinate, map);
                  extendedTool.selectFeature(featureInfo, overlay);
                  break;
                }
              }
            }
          },
          this
        );
      },
      // Removes the map click event.
      removeMapEvent: function (event) {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;

        map.removeLayer(this.vector);
        this.vector.getSource().clear();

        unByKey(this.mapClickEventKey);
      },
      // Gets the ids from the full list of feature ids that belong to the current page and rebuilds the table with
      // those features.
      buildTableFromIdList: function () {
        // Retrieve the paging toolbar.
        const items = this.component.getDockedItems();
        let toolbar;
        for (var i = 0, len = items.length; i < len; i += 1) {
          if (items[i].xtype === 'toolbar') {
            toolbar = items[i];
            break;
          }
        }

        // Sets paging buttons enabled/disabled as needed.
        toolbar.child('#first').setDisabled(this.currentPage === 1);
        toolbar.child('#prev').setDisabled(this.currentPage === 1);
        toolbar.child('#next').setDisabled(this.currentPage === this.totalPages);
        toolbar.child('#last').setDisabled(this.currentPage === this.totalPages);
        toolbar.child('#inputItem').setValue(this.currentPage);
        toolbar.child('#afterTextItem').setText(Ext.String.format(this.afterPageText, this.totalPages));

        const firstRecordCount = this.currentPage === 0 ? 0 : (this.currentPage - 1) * this.recordsPerPage + 1;
        let lastRecordCount = this.currentPage * this.recordsPerPage;
        const totalRecordCount = this.featureList.length;
        if (lastRecordCount > totalRecordCount) lastRecordCount = totalRecordCount;
        toolbar
          .child('#rowCount')
          .setText(
            Ext.String.format(
              extendedTool.rowCountText,
              firstRecordCount.toLocaleString(),
              lastRecordCount.toLocaleString(),
              totalRecordCount.toLocaleString()
            )
          );

        if (this.featureList.length === 0) {
          // If no features are returned, empty the table.
          this.component.getStore().removeAll();
          this.unMaskComponent();
          this.owningBlock.fire('tableUpdatedEvent', this);
          return;
        }

        const mappedLayerIds = [];
        const mappedLayers = this.owningBlock.blockConfig.layers;
        for (var i = 0, len = mappedLayers.length; i < len; i += 1) {
          mappedLayerIds.push(mappedLayers[i].id);
        }

        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const layers = globalThis.App.Layers.query(
          layersConfig,
          function (layer) {
            if (
              layer.type === 'layer' &&
              mappedLayerIds.indexOf(layer.id) !== -1 &&
              layer.mask === false &&
              (layer.display === true || layer.loadOnly === true)
            ) {
              return true;
            }
            return false;
          },
          ['overlays']
        );

        let completeRequestCount = 0;

        for (var i = 0, len = layers.length; i < len; i += 1) {
          var layer = layers[i];
          const featureProperties = [];
          let featureParam = '';
          let idProperty = '';
          let cqlFilterParam = '';
          const idList = [];

          // Create the 'propertyName' wfs parameter from the layer mapping in template.json.
          const toolLayerConfig = globalThis.App.Layers.getLayerConfig(layer.id, extendedTool.owningBlock.blockConfig.layers);
          if (toolLayerConfig !== null) {
            idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(toolLayerConfig.featureInfo, ['id'], 'propertyName')[0];
            const featureInfoConfigs = globalThis.App.Layers.getFeaturePropertiesByTypes(toolLayerConfig.featureInfo, ['id', 'name', 'display']);
            for (var j = 0, length = featureInfoConfigs.length; j < length; j += 1) {
              featureProperties.push(featureInfoConfigs[j].propertyName);
            }
          }

          if (featureProperties.length > 0) {
            featureParam = '&propertyName=' + featureProperties.join(',');
          }

          // Retrieve the fire ids for the current page and create the cql filter.
          const startIndex = ((this.currentPage ? this.currentPage : 1) - 1) * this.recordsPerPage;
          let endIndex = startIndex + this.recordsPerPage - 1;
          if (endIndex >= this.featureList.length) endIndex = this.featureList.length - 1;
          for (var k = startIndex; k <= endIndex; k += 1) {
            idList.push(this.featureList[k][0]);
          }

          this.featureIdList = idList;

          if (idList.length > 0) {
            cqlFilterParam = '&CQL_FILTER=' + idProperty + " IN ('" + idList.join("','") + "')";
          }

          const url = layer.source.wfs;
          const params =
            'service=WFS&request=GetFeature&version=1.1.0&srsName=' +
            layer.srs +
            '&typeNames=' +
            layer.name +
            '&outputFormat=application/json' +
            featureParam +
            cqlFilterParam;

          // const res = await Transport.post(params).to(url, {
          //   headers: {
          //     'Content-type': 'application/x-www-form-urlencoded',
          //   },
          // });
          // const featureInfo = await res.json();
          // const layerMapping = globalThis.App.Layers.getLayerConfig(layer.id, extendedTool.owningBlock.blockConfig.layers);
          // const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName');
          // const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperties);
          // const sortedFeatures = [];
          // const len = idList.length;
          // for (i = 0; i < len; i += 1) {
          //   const id = idList[i];
          //   let j = 0;
          //   const length = features.length;
          //   for (; j < length; j += 1) {
          //     const feature = features[j];
          //     if (feature.properties[idProperties[0]] === id) {
          //       sortedFeatures.push(feature);
          //     }
          //   }
          // }
          // extendedTool.addFeaturesToTable(layer, sortedFeatures);
          //
          // completeRequestCount += 1;
          // // If multiple layers are being filtered, execute after all requests are returned.
          // if (completeRequestCount === len) {
          //   extendedTool.unMaskComponent();
          //   this.component.updateLayout();
          //   //Fire the tableUpdatedEvent so the label gets updated with the new count
          //   extendedTool.owningBlock.fire('tableUpdatedEvent', extendedTool);
          // }

          asyncAjax({
            method: 'POST',
            url: url,
            body: params,
            callbackObj: {
              layer: layer,
              extendedTool: extendedTool,
              idList: idList,
              numRequests: len,
            },
            callback: function (response, callbackObj) {
              const layer = callbackObj.layer;
              const extendedTool = callbackObj.extendedTool;
              const featureInfo = JSON.parse(response.responseText);
              const layerMapping = globalThis.App.Layers.getLayerConfig(layer.id, extendedTool.owningBlock.blockConfig.layers);
              const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName');
              const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperties);
              const idList = callbackObj.idList;
              const sortedFeatures = [];

              for (var q = 0; q < idList.length; q++) {
                if (idList[q] !== extendedTool.featureIdList[q]) {
                  return;
                }
              }

              let i = 0;
              const len = idList.length;
              for (; i < len; i += 1) {
                const id = idList[i];
                let j = 0;
                const length = features.length;
                for (; j < length; j += 1) {
                  const feature = features[j];
                  if (feature.properties[idProperties[0]] === id) {
                    sortedFeatures.push(feature);
                  }
                }
              }
              extendedTool.addFeaturesToTable(layer, sortedFeatures);

              completeRequestCount += 1;
              // If multiple layers are being filtered, execute after all requests are returned.
              if (completeRequestCount === callbackObj.numRequests) {
                extendedTool.unMaskComponent();
                extendedTool.component.updateLayout();
                //Fire the tableUpdatedEvent so the label gets updated with the new count
                extendedTool.owningBlock.fire('tableUpdatedEvent', extendedTool);
              }
            },
          });
        }
      },
      // When checking or unchecking a record in the table, store the checked value along with the id of that record.
      storeCheckedValue: function (recordIndex, checked) {
        const record = this.component.getStore().getAt(recordIndex); // The record that was checked/unchecked.
        const mappedLayers = this.owningBlock.blockConfig.layers;
        let i = 0;
        const len = mappedLayers.length;
        for (; i < len; i += 1) {
          const mappedLayer = mappedLayers[i];
          const idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(mappedLayer.featureInfo, ['id'], 'propertyName')[0];
          const featureId = record.get(idProperty);
          if (featureId) {
            const featureList = this.featureList;
            let j = 0;
            const length = featureList.length;
            for (; j < length; j += 1) {
              const feature = featureList[j];
              // Index 0 holds feature id. Index 1 holds checked status.
              if (feature[0] === featureId) {
                feature[1] = checked;
                return;
              }
            }
          }
        }
      },
      // Set all stored checked values to checked/unchecked.
      setAllChecked: function (allChecked) {
        const featureList = this.featureList;
        let i = 0;
        const len = featureList.length;
        for (; i < len; i += 1) {
          featureList[i][1] = allChecked;
        }
      },
      // Build the columns and data store and add it to the table.
      addFeaturesToTable: function (layer, features) {
        const layerToolConfig = globalThis.App.Layers.getLayerConfig(layer.id, this.owningBlock.blockConfig.layers);
        if (layerToolConfig === null) return;

        const featureInfoConfig = globalThis.App.Layers.getFeaturePropertiesByTypes(layerToolConfig.featureInfo, ['id', 'name', 'display']);
        const featureIdProperty = globalThis.App.Layers.getFeatureIdProperty(layerToolConfig.featureInfo);

        // Create the checkbox column.
        const fields = ['download'];
        const data = [];
        const columns: Array<any> = [
          {
            extendedTool: this,
            xtype: 'checkcolumn',
            columnHeaderCheckbox: true,
            dataIndex: 'download',
            sortable: false,
            enableColumnHide: false,
            hideable: false,
            menuDisabled: true,
            resizable: false,
            width: 40,
            listeners: {
              checkchange: function (column, recordIndex, checked) {
                this.extendedTool.storeCheckedValue(recordIndex, checked);
                this.onStoreDataUpdate();
                this.extendedTool.owningBlock.fire('checkchange', this.extendedTool);
              },
              checkallchange: function (column, allChecked) {
                this.extendedTool.owningBlock.fire('checkchange', this.extendedTool);
              },
              beforecheckallchange: function (column, allChecked) {
                this.extendedTool.setAllChecked(allChecked);
              },
            },
          },
        ];

        // Build out fields and data from layer mapping in template.json.
        const columnMetaData = this.columnMetaData;
        for (var i = 0, len = columnMetaData.length; i < len; i += 1) {
          const columnName = columnMetaData[i].name;
          let config;
          const hidden = columnMetaData[i].hidden;
          for (var j = 0, length = featureInfoConfig.length; j < length; j += 1) {
            if (featureInfoConfig[j].propertyName === columnName) {
              config = featureInfoConfig[j];
              break;
            }
          }

          fields.push(columnName);

          let className = null;
          // If a column was sorted, add appropriate sort arrow.
          if (this.sortColumnName === columnName) {
            if (this.sortDirection === 'ASC') {
              className = 'x-column-header-sort-ASC';
            } else if (this.sortDirection === 'DESC') {
              className = 'x-column-header-sort-DESC';
            }
          }

          columns.push({
            text: config.displayName,
            dataIndex: columnName,
            extendedTool: this,
            hidden: hidden,
            width: columnMetaData[i].width,
            cls: className,
            listeners: {
              // Add column to list of hidden columns.
              hide: function () {
                let i = 0;
                const len = this.extendedTool.columnMetaData.length;
                for (; i < len; i += 1) {
                  if (this.extendedTool.columnMetaData[i].name === this.dataIndex) {
                    this.extendedTool.columnMetaData[i].hidden = true;
                    break;
                  }
                }
              },
              // Remove column from list of hidden columns.
              show: function () {
                let i = 0;
                const len = this.extendedTool.columnMetaData.length;
                for (; i < len; i += 1) {
                  if (this.extendedTool.columnMetaData[i].name === this.dataIndex) {
                    this.extendedTool.columnMetaData[i].hidden = false;
                    break;
                  }
                }
              },
              // Change sort state on header click.
              headerclick: function (ct, column) {
                if (this.dataIndex !== this.extendedTool.sortColumnName) {
                  this.extendedTool.sortDirection = 'ASC';
                } else if (this.extendedTool.sortDirection === 'ASC') {
                  this.extendedTool.sortDirection = 'DESC';
                } else if (this.extendedTool.sortDirection === 'DESC') {
                  this.extendedTool.sortDirection = 'ASC';
                } else {
                  this.extendedTool.sortDirection = 'ASC';
                }

                this.extendedTool.sortColumnName = this.dataIndex;
                this.extendedTool.sortColumn();
              },
            },
          });
        }

        // Create data store for table.
        const featureList = this.featureList;
        for (var i = 0, len = features.length; i < len; i += 1) {
          const feature = features[i];
          const obj = this.buildFeatureInfoObj(featureInfoConfig, feature);

          const featureId = globalThis.App.Layers.getFeatureId(layerToolConfig.featureInfo, feature['properties']);
          obj[featureIdProperty] = featureId;
          obj.layerId = layer.id;
          obj.download = true;
          for (var j = 0, length = featureList.length; j < length; j += 1) {
            const existingFeature = featureList[j];
            if (existingFeature[0] === featureId) {
              obj.download = existingFeature[1];
            }
          }

          data.push(obj);
        }

        const store = Ext.create('Ext.data.Store', {
          fields: fields,
          data: data,
        });

        this.component.reconfigure(store, columns);

        //If we're supposed to select a row in the table, scroll and select it
        if (this.rowToSelect !== null) {
          const tableView = this.component.getView();
          this.component.suspendEvents();
          tableView.scrollRowIntoView(this.rowToSelect);
          tableView.select(this.rowToSelect);
          this.component.resumeEvents();
        }
      },
      // Recurse through feature info and builds an object of feature properties and their values.
      buildFeatureInfoObj: function (toolFeatureInfoConfig, featureInfo, obj) {
        if (typeof obj === 'undefined') {
          obj = {};
        }

        for (let propertyName in featureInfo) {
          if (Object.prototype.toString.call(featureInfo[propertyName]) === '[object Object]') {
            obj = this.buildFeatureInfoObj(toolFeatureInfoConfig, featureInfo[propertyName], obj);
            return obj;
          }
        }

        let i = 0;
        const len = toolFeatureInfoConfig.length;
        for (; i < len; i += 1) {
          const propertyConfig = toolFeatureInfoConfig[i];
          if (featureInfo.hasOwnProperty(propertyConfig.propertyName)) {
            let value = featureInfo[propertyConfig.propertyName];
            if (value !== null) {
              if (!isNaN(value)) {
                if (propertyConfig.dataType === 'integer') {
                  value = Math.round(value);
                } else if (
                  propertyConfig.dataType === 'decimal' &&
                  propertyConfig.hasOwnProperty('decimalPlaces') &&
                  !isNaN(propertyConfig.decimalPlaces)
                ) {
                  const decimalPlaces = parseInt(propertyConfig.decimalPlaces);
                  let multiplier = 1;
                  let cnt = 0;
                  while (cnt < decimalPlaces) {
                    cnt += 1;
                    multiplier *= 10;
                  }
                  value = Math.round(value * multiplier) / multiplier;
                }
                if (propertyConfig.formatNumber === true) {
                  value = value.toLocaleString(undefined, { maximumSignificantDigits: 21 });
                }
              } else if (propertyConfig.dataType === 'date') {
                //ISO format is mm-dd-yyyy which assumes UTC but javascript date uses local
                //so before converting string to a date, replace - with / and remove the Z
                value = value.replace(/-/g, '/').replace('Z', '');
                if (propertyConfig.hasOwnProperty('format')) {
                  value = dateHelpers.formatDate(new Date(value), propertyConfig.format);
                } else {
                  value = new Date(value).toDateString();
                }
              }
            }
            obj[propertyConfig.propertyName] = value;
          }
        }

        return obj;
      },
      // Sends request to retrieve all feature ids along with the feature info property to sort by. After sorting the
      // features by the column, rebuild the full list of feature ids in the new order.
      sortColumn: async function () {
        this.maskComponent();
        const propertyNameParam = [];
        const columnName = this.sortColumnName;
        if (columnName !== null) propertyNameParam.push(columnName);
        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const displayedLayers = globalThis.App.Layers.query(
          layersConfig,
          function (layer) {
            if (layer.type === 'layer' && layer.mask === false && (layer.display === true || layer.loadOnly === true)) {
              return true;
            }
            return false;
          },
          ['overlays']
        );

        // Create cql filter to get back all features from the list of features.
        const featureIds = [];
        for (var i = 0, len = this.featureList.length; i < len; i += 1) {
          featureIds.push("'" + this.featureList[i][0] + "'");
        }

        for (var i = 0, len = displayedLayers.length; i < len; i += 1) {
          var layer = displayedLayers[i];
          const cqlFilter = [];
          let cqlFilterParam = '';
          let idProperty = '';

          const toolLayerConfig = globalThis.App.Layers.getLayerConfig(layer.id, extendedTool.owningBlock.blockConfig.layers);
          if (toolLayerConfig !== null) {
            idProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(toolLayerConfig.featureInfo, ['id'], 'propertyName')[0];
            propertyNameParam.push(idProperty);
          }

          if (layer.hasOwnProperty('cqlFilter')) {
            for (let prop in layer.cqlFilter) {
              if (layer.cqlFilter[prop] !== null) cqlFilter.push(layer.cqlFilter[prop]);
            }
          }
          if (cqlFilter.length > 0) {
            cqlFilterParam = '&CQL_FILTER=' + cqlFilter.join(' AND ');
          }

          // Send request for feature ids along with feature property to sort by (column name).
          const url = layer.source.wfs;
          const params =
            'service=WFS&request=GetFeature&version=1.1.0&srsName=' +
            layer.srs +
            '&typeNames=' +
            layer.name +
            '&outputFormat=application/json&propertyName=' +
            propertyNameParam.join(',') +
            cqlFilterParam;

          const res = await Transport.post(params).to(url, {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded',
            },
          });
          const columnName = extendedTool.sortColumnName;
          const direction = extendedTool.sortDirection;
          const featureInfo = await res.json();
          const layerMapping = globalThis.App.Layers.getLayerConfig(layer.id, extendedTool.owningBlock.blockConfig.layers);
          const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName');
          const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperties);

          extendedTool.featureList = extendedTool.sortFeatureList(extendedTool.featureList, features, columnName, idProperties[0], direction);
          extendedTool.buildTableFromIdList();

          // asyncAjax({
          //   method: 'POST',
          //   url: url,
          //   body: params,
          //   callbackObj: {
          //     layer: layer,
          //     extendedTool: extendedTool,
          //   },
          //   callback: function(response, callbackObj) {
          //     const layer = callbackObj.layer;
          //     const extendedTool = callbackObj.extendedTool;
          //     const columnName = extendedTool.sortColumnName;
          //     const direction = extendedTool.sortDirection;
          //     const featureInfo = JSON.parse(response.responseText);
          //     const layerMapping = globalThis.App.Layers.getLayerConfig(callbackObj.layer.id, extendedTool.owningBlock.blockConfig.layers);
          //     const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName');
          //     const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperties);
          //
          //     extendedTool.featureList = extendedTool.sortFeatureList(extendedTool.featureList, features, columnName, idProperties[0], direction);
          //     extendedTool.buildTableFromIdList();
          //   },
          // });
        }
      },
      // Sort list of features by feature info property, strip feature list to just ids, and set checked state to the
      // stored check state.
      sortFeatureList: function (oldFeatureList, features: Array<any>, propertyName, idProperty, direction) {
        if (direction === 'ASC') {
          features = extendedTool.naturalSort(features, propertyName);
        } else if (direction === 'DESC') {
          features = extendedTool.naturalSortDesc(features, propertyName);
        }

        // Retrieve only the feature ids from the sorted list.
        const newFeatureList = [];
        for (var i = 0, len = features.length; i < len; i += 1) {
          const feature = features[i];
          newFeatureList.push([feature.properties[idProperty], true]);
        }
        let j = 0;
        const length = oldFeatureList.length;
        for (; j < length; j += 1) {
          const existingFeature = oldFeatureList[j];
          if (existingFeature[1] === false) {
            for (var i = 0, len = newFeatureList.length; i < len; i += 1) {
              const newFeature = newFeatureList[i];
              if (existingFeature[0] === newFeature[0]) {
                newFeature[1] = false;
                break;
              }
            }
          }
        }

        return newFeatureList;
      },
      // Highlight row when clicked or for a specific fire in the table that was clicked on in the map.
      highlightTableRecord: function (propertyName, id) {
        const currentPage = this.currentPage;
        const featureList = this.featureList;
        let recordIndex = null;
        let recordPage = 1;
        let i = 0;
        const len = featureList.length;
        for (; i < len; i += 1) {
          const feature = featureList[i];
          if (feature[0] === id) {
            recordIndex = i;
            break;
          }
        }
        if (recordIndex === null) return;

        while (recordIndex >= this.recordsPerPage) {
          recordIndex -= this.recordsPerPage;
          recordPage += 1;
        }

        if (recordPage === currentPage) {
          const record = this.component.getStore().getAt(recordIndex);
          if (record) {
            const tableView = this.component.getView();
            this.component.suspendEvents();
            tableView.scrollRowIntoView(record.index);
            tableView.select(record);
            this.component.resumeEvents();
          }
        } else {
          this.rowToSelect = recordIndex;
          this.setCurrentPage(recordPage);
        }
      },
      selectFeature: function (featureInfo, layer) {
        if (featureInfo.features.length > 0) {
          // Open the table when a feature is clicked.
          const parent = this.owningBlock.parent.component;
          if (parent.collapsed) {
            parent.expand();
          }

          const feature = featureInfo.features[0];
          const layerToolConfigs = globalThis.App.Layers.getLayerConfig(layer.id, this.owningBlock.blockConfig.layers);
          const featureId = globalThis.App.Layers.getFeatureId(layerToolConfigs.featureInfo, feature['properties']);
          const featureIdProperty = globalThis.App.Layers.getFeatureIdProperty(layerToolConfigs.featureInfo);

          // Check to make sure we are not selecting the same feature twice.
          if (this.selectedFeatureId !== featureId) {
            // If we have another feature selected, unselect it first.
            if (this.selectedFeatureId !== null) {
              var currentFeature = this.vector.getSource().getFeatureById(this.selectedFeatureId);
              if (currentFeature !== null) {
                this.vector.getSource().removeFeature(currentFeature);
              }
            }

            // If we are selecting the currently highlighted feature, first remove the highlight.
            // Since requests are asyncronous, we can't garuntee the feature will be highlighted before the user
            // clicks.
            if (featureId === this.highlightedFeatureId || this.highlightedFeatureId) {
              const highlightedFeature = this.vector.getSource().getFeatureById(this.highlightedFeatureId);
              if (highlightedFeature !== null) {
                this.vector.getSource().removeFeature(highlightedFeature);
              }
              this.highlightedFeatureId = null;
            }

            this.selectedFeatureId = featureId; // Set the currently selected feature id.
            const olFeature = this.getOLFeature(featureInfo, this.getSelectedStyle(), layer); // Create
            // OpenLayers
            // feature.
            this.vector.getSource().addFeature(olFeature);

            // Find fire record in table.
            this.highlightTableRecord(featureIdProperty, olFeature.getId());
          } else {
            // in case the user scrolls after selecting a feature and clicks the feature again, re-scroll to feature.
            this.highlightTableRecord(featureIdProperty, this.selectedFeatureId);
          }
        } else {
          // No features where user clicked.
          // If a feature is selected, de-select it.
          [this.selectedFeatureId, this.highlightedFeatureId]
            // Remove null/undefined values before iterating
            .filter((featureId) => Boolean(featureId))
            .forEach((featureId) => {
              const feature = this.vector.getSource().getFeatureById(featureId);
              if (feature) this.vector.getSource().removeFeature(feature);
              featureId = null;
            });
        }
      },
      highlightFeature: function (featureInfo, layer) {
        const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        if (featureInfo.features.length > 0) {
          const feature = featureInfo.features[0];
          const layerToolConfigs = globalThis.App.Layers.getLayerConfig(layer.id, this.owningBlock.blockConfig.layers);
          const featureId = globalThis.App.Layers.getFeatureId(layerToolConfigs.featureInfo, feature['properties']);

          // Check to make sure we are not trying to highlight the same polygon twice.
          if (extendedTool.highlightedFeatureId !== featureId) {
            // If we have a feature currently highlighted, first remove the highlight.
            if (extendedTool.highlightedFeatureId !== null) {
              const highlightedFeature = extendedTool.vector.getSource().getFeatureById(extendedTool.highlightedFeatureId);
              if (highlightedFeature !== null) {
                extendedTool.vector.getSource().removeFeature(highlightedFeature);
              }
            }

            // Check to make sure we are not trying to highlight the currently selected feature.
            if (extendedTool.selectedFeatureId !== featureId) {
              const olFeature = extendedTool.getOLFeature(featureInfo, this.getHighlightedStyle(), layer);
              extendedTool.highlightedFeatureId = featureId;
              extendedTool.vector.getSource().addFeature(olFeature);

              // Remove and add the layer again to ensure it's on the top of the map.
              map.removeLayer(extendedTool.vector);
              map.addLayer(extendedTool.vector);
            } else {
              extendedTool.highlightedFeatureId = null;
            }
          }
        }
      },
      // Queries the features by feature id and calls eith selectFeature or highlightFeature.
      queryFeatureInfo: async function (featureQuery, layer, callbackName) {
        const wfsSource = layer.source.wfs;
        const params =
          'service=WFS&request=GetFeature&version=1.1.0&srsName=' +
          layer.srs +
          '&typeNames=' +
          layer.name +
          '&outputFormat=application/json&CQL_FILTER=' +
          featureQuery;
        const res = await Transport.get(wfsSource + params);
        // if (this.currentRequestId !== res['id']) return;
        const featureInfo = await res.json();
        const layerMapping = globalThis.App.Layers.getLayerConfig(layer.id, this.owningBlock.blockConfig.layers);
        const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName');
        featureInfo.features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperties);
        this[callbackName](featureInfo, layer);

        // const request = Transport.get(wfsSource + params, {
        //   callbackObj: {
        //     extendedTool: this,
        //     layer,
        //     callbackName,
        //   },
        //   callback: (response, callbackObj) => {
        //     const extendedTool = callbackObj.extendedTool;
        //     const callbackName = callbackObj.callbackName;
        //
        //     console.log('in callback');
        //
        //     // If another request was sent before this request completed, cancel this callback.
        //     if (extendedTool.currentRequestId !== response.id) return;
        //     const featureInfo = JSON.parse(response.responseText);
        //     const layerMapping = globalThis.App.Layers.getLayerConfig(callbackObj.layer.id, extendedTool.owningBlock.blockConfig.layers);
        //     const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName');
        //     featureInfo.features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperties);
        //     extendedTool[callbackName](featureInfo, callbackObj.layer);
        //   },
        // });

        // const request = asyncAjax({
        //   url: wfsSource,
        //   body: params,
        //   method: 'POST',
        //   callbackObj: {
        //     extendedTool: this,
        //     layer: layer,
        //     callbackName: callbackName,
        //   },
        //   callback: function(response, callbackObj) {
        //     const extendedTool = callbackObj.extendedTool;
        //     const callbackName = callbackObj.callbackName;
        //
        //     // If another request was sent before this request completed, cancel this callback.
        //     // TODO: Figure out what this was for/an alternative
        //     // @ts-ignore
        //     if (extendedTool.currentRequestId !== response.id) return;
        //     const featureInfo = JSON.parse(response.responseText);
        //     const layerMapping = globalThis.App.Layers.getLayerConfig(callbackObj.layer.id, extendedTool.owningBlock.blockConfig.layers);
        //     const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName');
        //     featureInfo.features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperties);
        //     extendedTool[callbackName](featureInfo, callbackObj.layer);
        //   },
        // });

        // TODO: Figure out what this was for/an alternative
        this.currentRequestId = res['id'];
      },
      unhighlightFeature: function (featureId) {
        const olFeature = this.vector.getSource().getFeatureById(featureId);
        if (olFeature !== null) {
          this.vector.getSource().removeFeature(olFeature);
        }
      },
      maskComponent: function () {
        if (this.isMasked === true) return;
        this.isMasked = true;
        if (this.mask === null) {
          // @ts-ignore
          this.mask = new Ext.LoadMask(this.component, {
            msg: 'Loading Feature information ...',
          });
        }
        this.mask.show();
      },
      unMaskComponent: function () {
        if (this.isMasked === false) return;
        this.mask.hide();
        this.isMasked = false;
      },
      setCurrentPage: function (pageNum) {
        if (this.isMasked === true) return;
        this.maskComponent();
        if (typeof pageNum === 'undefined' || isNaN(pageNum)) pageNum = 1;
        pageNum = parseInt(pageNum, 10);
        if (pageNum <= 0) pageNum = 1;
        if (pageNum > this.totalPages) pageNum = this.totalPages;
        this.currentPage = pageNum;
        this.buildTableFromIdList();
      },
    };

    const parentBlock = owningBlock.parent;
    if (parentBlock !== null) {
      parentBlock.on(
        'resize',
        function (callbackObj, postingObj) {
          const extendedTool = callbackObj;
          const heightDiff = extendedTool.heightDiff;
          if (heightDiff === -1) return;

          const parent = extendedTool.owningBlock.parent.component;
          const newHeight = parent.getHeight() - heightDiff;
          extendedTool.component.setHeight(newHeight);
        },
        extendedTool
      );
    }

    var mapPanelBlock = owningBlock.getReferencedBlock('cMapPanel');
    if (mapPanelBlock.rendered === true) {
      var map = mapPanelBlock.component.map;
      map.addLayer(extendedTool.vector);
    } else {
      mapPanelBlock.on(
        'rendercomponent',
        function (callbackObj, postingObj) {
          const extendedTool = callbackObj;
          const mapPanelTool = postingObj;
          const map = mapPanelTool.component.map;
          map.addLayer(extendedTool.vector);
        },
        extendedTool
      );
    }

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const width = block.width;
    const height = block.height;
    const store = Ext.create('Ext.data.Store', {
      fields: [],
      data: [],
    });

    const pagingToolbar: Array<any> = [
      {
        xtype: 'button',
        itemId: 'first',
        extendedTool: extendedTool,
        tooltip: 'First Page',
        tooltipType: 'title',
        // @ts-ignore
        iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
        style: 'padding: 3px; border-color: transparent;',
        disabled: true,
        handler: function () {
          this.extendedTool.rowToSelect = null;
          if (this.extendedTool.selectedFeatureId) {
            this.extendedTool.unhighlightFeature(this.extendedTool.selectedFeatureId);
            this.extendedTool.selectedFeatureId = null;
          }
          this.extendedTool.setCurrentPage(1);
        },
      },
      {
        xtype: 'button',
        itemId: 'prev',
        extendedTool: extendedTool,
        tooltip: 'Previous Page',
        tooltipType: 'title',
        // @ts-ignore
        iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
        style: 'padding: 3px; border-color: transparent;',
        disabled: true,
        handler: function () {
          this.extendedTool.rowToSelect = null;
          if (this.extendedTool.selectedFeatureId) {
            this.extendedTool.unhighlightFeature(this.extendedTool.selectedFeatureId);
            this.extendedTool.selectedFeatureId = null;
          }
          this.extendedTool.setCurrentPage(this.extendedTool.currentPage - 1);
        },
      },
      '-',
      'Page',
      {
        xtype: 'numberfield',
        itemId: 'inputItem',
        extendedTool: extendedTool,
        // @ts-ignore
        cls: Ext.baseCSSPrefix + 'tbar-page-number',
        allowDecimals: false,
        minValue: 1,
        hideTrigger: true,
        enableKeyEvents: true,
        keyNavEnabled: false,
        selectOnFocus: true,
        submitValue: false,
        isFormField: false,
        width: 40,
        value: extendedTool.currentPage,
        margins: '-1 2 3 2',
        mouseWheelEnabled: false,
        listeners: {
          //scope: me,
          keydown: function (field, event) {
            const key = event.getKey();
            const increment = event.shiftKey ? 10 : 1;
            const value = parseInt(this.getValue(), 10);
            const currentPage = this.extendedTool.currentPage;

            if (key == event.RETURN) {
              event.stopEvent();
              if (value && !isNaN(value)) {
                if (this.extendedTool.selectedFeatureId) {
                  this.extendedTool.unhighlightFeature(this.extendedTool.selectedFeatureId);
                  this.extendedTool.selectedFeatureId = null;
                }
                this.extendedTool.setCurrentPage(value);
              } else {
                this.setValue(currentPage);
              }
            } else if (key == event.HOME || key == event.END) {
              event.stopEvent();
              const pageNum = key == event.HOME ? 1 : this.extendedTool.totalPages;
              if (this.extendedTool.selectedFeatureId) {
                this.extendedTool.unhighlightFeature(this.extendedTool.selectedFeatureId);
                this.extendedTool.selectedFeatureId = null;
              }
              this.setValue(pageNum);
              this.extendedTool.setCurrentPage(pageNum);
            } else if (key == event.UP || key == event.PAGE_UP) {
              event.stopEvent();
              if (this.extendedTool.selectedFeatureId) {
                this.extendedTool.unhighlightFeature(this.extendedTool.selectedFeatureId);
                this.extendedTool.selectedFeatureId = null;
              }
              this.extendedTool.setCurrentPage(currentPage + increment);
            } else if (key == event.DOWN || key == event.PAGE_DOWN) {
              event.stopEvent();
              if (this.extendedTool.selectedFeatureId) {
                this.extendedTool.unhighlightFeature(this.extendedTool.selectedFeatureId);
                this.extendedTool.selectedFeatureId = null;
              }
              this.extendedTool.setCurrentPage(currentPage + increment * -1);
            }
          },
          blur: function () {
            this.setValue(this.extendedTool.currentPage);
          },
        },
      },
      {
        xtype: 'tbtext',
        itemId: 'afterTextItem',
        text: Ext.String.format(extendedTool.afterPageText, extendedTool.totalPages),
      },
      '-',
      {
        xtype: 'button',
        itemId: 'next',
        extendedTool: extendedTool,
        tooltip: 'Next Page',
        tooltipType: 'title',
        // @ts-ignore
        iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
        style: 'padding: 3px; border-color: transparent;',
        handler: function () {
          this.extendedTool.rowToSelect = null;
          if (this.extendedTool.selectedFeatureId) {
            this.extendedTool.unhighlightFeature(this.extendedTool.selectedFeatureId);
            this.extendedTool.selectedFeatureId = null;
          }
          this.extendedTool.setCurrentPage(this.extendedTool.currentPage + 1);
        },
      },
      {
        xtype: 'button',
        itemId: 'last',
        extendedTool: extendedTool,
        tooltip: 'Last Page',
        tooltipType: 'title',
        // @ts-ignore
        iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
        style: 'padding: 3px; border-color: transparent;',
        handler: function () {
          this.extendedTool.rowToSelect = null;
          if (this.extendedTool.selectedFeatureId) {
            this.extendedTool.unhighlightFeature(this.extendedTool.selectedFeatureId);
            this.extendedTool.selectedFeatureId = null;
          }
          this.extendedTool.setCurrentPage(this.extendedTool.totalPages);
        },
      },
      {
        xtype: 'tbfill',
      },
      {
        xtype: 'tbtext',
        text: 'Records Per Page:',
      },
    ];

    const recordsPerPageOptions = extendedTool.owningBlock.blockConfig.recordsPerPageOptions;
    if (recordsPerPageOptions && recordsPerPageOptions.length > 0) {
      const toggleGroup = getRandomString(32, 36);
      //var data = [];
      extendedTool.recordsPerPage = recordsPerPageOptions[0];
      let i = 0;
      const len = recordsPerPageOptions.length;
      for (; i < len; i += 1) {
        const option = recordsPerPageOptions[i];
        /*data.push({
         text: option.toLocaleString(),
         value: option
         });*/

        pagingToolbar.push({
          xtype: 'button',
          extendedTool: extendedTool,
          enableToggle: true,
          toggleGroup: toggleGroup,
          pressed: i === 0,
          text: option.toLocaleString(),
          recordsPerPage: option,
          handler: function () {
            this.extendedTool.maskComponent();
            this.extendedTool.recordsPerPage = this.recordsPerPage;
            this.extendedTool.totalPages = Math.ceil(this.extendedTool.featureList.length / this.extendedTool.recordsPerPage);
            if (this.extendedTool.currentPage > this.extendedTool.totalPages) this.extendedTool.currentPage = this.extendedTool.totalPages;
            this.extendedTool.buildTableFromIdList();
          },
        });
      }

      /*pagingToolbar.push({
       xtype: 'combobox',
       extendedTool: extendedTool,
       width: 60,
       editable: false,
       store: Ext.create('Ext.data.Store', {
       fields: ['text', 'value'],
       data: data
       }),
       value: recordsPerPageOptions[0],
       displayField: 'text',
       valueField: 'value',
       listeners: {
       select: function() {
       this.extendedTool.maskComponent();
       this.extendedTool.recordsPerPage = this.getValue();
       this.extendedTool.totalPages = Math.ceil(this.extendedTool.featureList.length / this.extendedTool.recordsPerPage);
       if (this.extendedTool.currentPage > this.extendedTool.totalPages) this.extendedTool.currentPage = this.extendedTool.totalPages;
       this.extendedTool.buildTableFromIdList();
       }
       }
       });*/
    }

    pagingToolbar.push({ xtype: 'tbfill' });
    pagingToolbar.push({
      xtype: 'tbtext',
      itemId: 'rowCount',
      text: Ext.String.format(extendedTool.rowCountText, 1, extendedTool.recordsPerPage, extendedTool.totalPages),
    });

    let extTool: Dict<any> = {
      extendedTool: extendedTool,
      xtype: 'grid',
      store: store,
      columns: [],
      scroll: true,
      autoScroll: false,
      flex: 1,
      border: 1,
      width: width,
      height: height,
      bbar: pagingToolbar,
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;

          globalThis.App.EventHandler.registerCallbackForEvent(
            globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED,
            this.extendedTool.owningBlock.itemDefinition.layersConfigUpdated,
            this.extendedTool
          );

          this.extendedTool.addMapEvent();
          this.columnManager.headerCt.extendedTool = this.extendedTool;

          // Call manually after first load.
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          this.extendedTool.owningBlock.itemDefinition.layersConfigUpdated(layersConfig, this.extendedTool);
        },
        itemmouseenter: function (view, record) {
          //var layerId = record.get('layerId');
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layers = globalThis.App.Layers.query(
            layersConfig,
            {
              //id: layerId,
              display: true,
            },
            ['overlays', 'boundaries']
          );

          if (layers.length > 0) {
            for (var i = 0, len = layers.length; i < len; i += 1) {
              const layer = layers[i];
              const layerToolConfigs = globalThis.App.Layers.getLayerConfig(layer.id, this.extendedTool.owningBlock.blockConfig.layers);
              if (layerToolConfigs !== null) {
                const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerToolConfigs.featureInfo, ['id']);
                const idQuery = [];
                for (var i = 0, len = idProperties.length; i < len; i += 1) {
                  const property = idProperties[i].propertyName;
                  const value = record.get(property);
                  idQuery.push(property + " = '" + value + "'");
                }
                this.extendedTool.queryFeatureInfo(idQuery.join(' AND '), layer, 'highlightFeature');
                break;
              }
            }
          }
        },
        select: function (gridPanel, record) {
          //var layerId = record.get('layerId');
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layers = globalThis.App.Layers.query(
            layersConfig,
            {
              //id: layerId,
              display: true,
            },
            ['overlays', 'boundaries']
          );

          if (layers.length > 0) {
            for (var i = 0, len = layers.length; i < len; i += 1) {
              const layer = layers[i];
              const layerToolConfigs = globalThis.App.Layers.getLayerConfig(layer.id, this.extendedTool.owningBlock.blockConfig.layers);
              if (layerToolConfigs !== null) {
                const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerToolConfigs.featureInfo, ['id']);
                const idQuery = [];
                for (var i = 0, len = idProperties.length; i < len; i += 1) {
                  const property = idProperties[i].propertyName;
                  const value = record.get(property);
                  idQuery.push(property + " = '" + value + "'");
                }
                this.extendedTool.queryFeatureInfo(idQuery.join(' AND '), layer, 'selectFeature');
                break;
              }
            }
          }
        },
        afterlayout: function () {
          if (this.extendedTool.selectedFeatureId !== null) {
            this.extendedTool.highlightTableRecord(this.extendedTool.featureIdProperty, extendedTool.selectedFeatureId);
          }
        },
        columnmove: function (ct, column, fromIndex, toIndex) {
          const columnMetaData = this.extendedTool.columnMetaData;
          const columns = ct.getGridColumns();
          const newColumnMetaData = [];

          let j = 0;
          const length = columns.length;
          for (; j < length; j += 1) {
            var column = columns[j];
            let i = 0;
            const len = columnMetaData.length;
            for (; i < len; i += 1) {
              const metaData = columnMetaData[i];
              if (column.dataIndex === metaData.name) {
                newColumnMetaData.push(metaData);
                break;
              }
            }
          }
          this.extendedTool.columnMetaData = newColumnMetaData;
        },
        columnresize: function (ct, column) {
          let i = 0;
          const len = this.extendedTool.columnMetaData.length;
          for (; i < len; i += 1) {
            if (this.extendedTool.columnMetaData[i].name === column.dataIndex) {
              this.extendedTool.columnMetaData[i].width = column.width;
              break;
            }
          }
        },
      },
    };
    extTool = addToolBarItems(block, extTool, toolbar);
    return ExtJSPosition(extTool, block);
  },
};
