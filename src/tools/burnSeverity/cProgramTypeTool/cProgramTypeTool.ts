/* The ProgramTypeTool is a combobox that is populated using a wfs
   call to get the program types from the firePolygons layer */

import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { getRandomString } from '../../../helpers/string';
import { Transport } from '../../../Network/Transport';

export const cProgramTypeTool = {
  options: {
    requiredBlocks: ['cMapWindow', 'cMapPanel', 'cQueryParamsDisplay', 'cResetQuery'],
    events: ['select'],
  },
  layerConfigUpdated: function (postingObj, callbackObj, eventObj) {
    const extendedTool = callbackObj;
    if (extendedTool.vectorAdded === true) {
      const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
      const map = mapPanelBlock.component.map;
      map.removeLayer(extendedTool.vector);
      map.addLayer(extendedTool.vector);
    }
  },
  createExtendedTool: function (owningBlock) {
    let selectedProgram = null;

    if (globalThis.App.urlParameters.hasOwnProperty('product')) {
      selectedProgram = decodeURIComponent(globalThis.App.urlParameters.product).toLowerCase() || null;
    }

    const owningMapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const owningMapWindow = owningMapWindowBlock.extendedTool;

    const extendedTool = {
      owningBlock: owningBlock,
      value: null,
      vector: new VectorLayer({
        source: new VectorSource(),
      }),
      vectorAdded: false,
      // getStoreLayer will get the layer to be used to query
      getStoreLayer() {
        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const layerMapping = this.owningBlock.blockConfig.layers[0];
        const layer = globalThis.App.Layers.query(
          layersConfig,
          {
            id: layerMapping.id,
          },
          ['overlays', 'boundaries']
        )[0];

        return layer;
      },
      /* getStore will query the store layer for the id and display values
       * and put it into a data store for loading the combobbox */
      async getStore() {
        const layer = this.getStoreLayer();
        const layerMapping = this.owningBlock.blockConfig.layers[0];
        const featureInfoMapping = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['display', 'id']);
        const properties = [];

        for (var i = 0, len = featureInfoMapping.length; i < len; i += 1) {
          properties.push(featureInfoMapping[i].propertyName);
        }

        const propertyNameParam = '&propertyName=' + properties.join(',');
        const url = layer.source.wfs;
        const params =
          'service=WFS&request=GetFeature&version=1.1.0&srsName=' +
          layer.srs +
          '&typeNames=' +
          layer.name +
          '&outputFormat=application/json' +
          propertyNameParam;
        //var url =
        // 'http://igskmncnvs191.cr.usgs.gov:8080/geoserver/mtbs/wfs?service=WFS&request=GetFeature&version=1.1.0&srsName='+layer.srs+'&typeNames='+layer.name+'&outputFormat=json'+propertyNameParam+cqlFilterParam;
        let store = [];

        const res = await Transport.post(params).to(url, {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
        });
        const collection = await res.json();
        const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['id'], 'propertyName');
        const displayProperty = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['display'], 'propertyName')[0];
        const fields = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['display', 'id'], 'propertyName');

        const features = globalThis.App.OpenLayers.combineFeaturesByProperties(collection.features, idProperties);
        const data = [];
        //make the list distinct
        let v = 0;
        var len = features.length;
        for (; v < len; v += 1) {
          const feature = features[v];
          const obj = {};
          let i = 0;
          const length = featureInfoMapping.length;
          for (; i < length; i += 1) {
            const featureInfoMap = featureInfoMapping[i];
            const value = globalThis.App.Layers.getFeatureInfoValue(feature, featureInfoMap.propertyName);
            obj[featureInfoMap.propertyName] = value;
          }
          data.push(obj);
        }
        //Sort the list alphabetically
        data.sort(function (a, b) {
          if (a[displayProperty].toLowerCase() < b[displayProperty].toLowerCase()) {
            return -1;
          }
          if (a[displayProperty].toLowerCase() > b[displayProperty].toLowerCase()) {
            return 1;
          }
          return 0;
        });
        // The data store holding the data
        store = Ext.create('Ext.data.Store', {
          fields: fields,
          data: data,
        });
        /* Bind the store to the combobox */
        this.component.bindStore(store);

        this.value = this.component.store.data.items.find((x) => x.data.map_prog.toLowerCase() == selectedProgram) || null;

        if (this?.value !== null) {
          this.component.setValue(this.value);
        }
      },
      //When the combobox list is changed, this function is called which sets the cql filter to the
      //items selected in the multi-select list.
      setSelected: function () {
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        const cqlFilterDisplayBlock = this.owningBlock.getReferencedBlock('cQueryParamsDisplay');
        let displayText = '';
        const values = this.component.getValue();

        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const layerMapping = extendedTool.owningBlock.blockConfig.layers[0];
        const layers = globalThis.App.Layers.query(layersConfig.overlays, {
          id: layerMapping.id,
        });
        const id = this.owningBlock.blueprint.id;
        let i = 0;
        const len = layers.length;
        for (; i < len; i += 1) {
          const layer = layers[i];
          if (!layer.hasOwnProperty('cqlFilter')) {
            layer.cqlFilter = {};
          }
          if (!layer.cqlFilter.hasOwnProperty(id)) {
            layer.cqlFilter[id] = '';
          }

          if (values.length === 0) {
            layer.cqlFilter[id] = null;
            displayText = null;
          } else {
            const idProperty = globalThis.App.Layers.getFeatureIdProperty(layerMapping.featureInfo);
            layer.cqlFilter[id] = idProperty + " in ('";
            let j = 0;
            const len2 = values.length;
            for (; j < len2; j += 1) {
              layer.cqlFilter[id] += values[j];
              if (j !== values.length - 1) {
                layer.cqlFilter[id] += "','";
              } else {
                layer.cqlFilter[id] += "')";
              }
            }
            displayText = 'Products: ' + values;
          }

          globalThis.App.OpenLayers.forceLayerUpdateById(layer.id, map);
        }

        if (cqlFilterDisplayBlock !== null) {
          cqlFilterDisplayBlock.extendedTool.setFilter('program', displayText);
        }

        globalThis.App.EventHandler.postEvent(
          globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED,
          layersConfig,
          globalThis.App.Layers.layersConfig
        );
      },
    };

    //If the Reset Button is enabled, then set the cqlFilter on the layers, clear the tools and query parameters
    // values
    const resetQueryBlock = owningBlock.getReferencedBlock('cResetQuery');
    if (resetQueryBlock !== null) {
      resetQueryBlock.on(
        'click',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          if (extendedTool.owningBlock.rendered === false) return;
          const layerMapping = extendedTool.owningBlock.blockConfig.layers[0];

          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

          const layers = globalThis.App.Layers.query(layersConfig.overlays, {
            id: layerMapping.id,
          });

          // Set the cqlFilter to null for each layer
          const id = extendedTool.owningBlock.blueprint.id;
          let i = 0;
          const len = layers.length;
          for (; i < len; i += 1) {
            const layer = layers[i];
            if (layer.hasOwnProperty('cqlFilter') && layer.cqlFilter.hasOwnProperty(id)) {
              layer.cqlFilter[id] = null;
            }
          }

          //Set the query parameters text to null for fire type
          const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('program', null);
          }

          //Set this tools value to null
          extendedTool.component.setValue(null);
          extendedTool.value = null;

          if (extendedTool.vectorAdded === true) {
            const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            const map = mapPanelBlock.component.map;
            map.removeLayer(extendedTool.vector);
            extendedTool.vector.getSource().clear();
            extendedTool.vectorAdded = false;
          }
        },
        extendedTool
      );
    }

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
      extendedTool.owningBlock.itemDefinition.layerConfigUpdated,
      extendedTool
    );

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const owningMapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
    if (!owningMapWindowBlock.hasOwnProperty('featureCqlFilterId')) {
      owningMapWindowBlock.featureCqlFilterId = getRandomString(32, 36);
    }
    extendedTool.cqlFilterId = owningMapWindowBlock.featureCqlFilterId;

    const layerMapping = extendedTool.owningBlock.blockConfig.layers[0];
    const featureInfoMapping = layerMapping.featureInfo;
    const valueField = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['id'], 'propertyName')[0];
    const displayField = globalThis.App.Layers.getFeaturePropertiesByTypes(featureInfoMapping, ['display'], 'propertyName')[0];

    // Simple ComboBox using the data store
    const simpleCombo = Ext.create('Ext.form.field.ComboBox', {
      extendedTool: extendedTool,
      autoRender: true,
      editable: false,
      multiSelect: true,
      region: 'north',
      width: block.width,
      queryMode: 'local',
      emptyText: block.emptyText,
      typeAhead: true,
      valueField: valueField,
      displayField: displayField,
      listeners: {
        change: function () {
          this.extendedTool.setSelected();
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.getStore();
          this.extendedTool.component.el.dom.title = this.extendedTool.owningBlock.blockConfig.emptyText;
        },
      },
    });
    return simpleCombo;
  },
};
