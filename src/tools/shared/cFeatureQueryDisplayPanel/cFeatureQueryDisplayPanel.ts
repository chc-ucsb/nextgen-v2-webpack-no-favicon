import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Transport } from '../../../Network/Transport';
import { Dict } from '../../../@types';

export const cFeatureQueryDisplayPanel = {
  cqlFilterUpdated: function (eventObj, callbackObj, postingObj) {
    const extendedTool = callbackObj;
    extendedTool.updateDisplayedFeatures();
  },
  createExtendedTool: function (owningBlock) {
    const extendedTool = {
      owningBlock: owningBlock,
      lastRequest: null,
      cqlFilter: null,
      updateDisplayedFeatures: async function () {
        if (this.lastRequest !== null) {
          this.lastRequest.requestCanceled = true;
        }
        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const layerMapping = this.owningBlock.blockConfig.layers;
        let overlay = null;
        const headerText = this.owningBlock.blockConfig.label;

        let i = 0;
        const len = layerMapping.length;
        for (; i < len; i += 1) {
          const layerMap = layerMapping[i];
          const overlays = globalThis.App.Layers.query(layersConfig.overlays, {
            type: 'layer',
            display: true,
            mask: false,
            id: layerMap.id,
          });

          if (overlays.length > 0) {
            overlay = overlays[0];
            break;
          }
        }

        if (overlay === null) {
          this.component.getHeader().setTitle(headerText.replace('{count}', 0));
          return;
        }

        let cqlFilterParam = '';
        const cqlFilter = [];
        const featureProperties = [];
        let featureParam = '';

        if (overlay.hasOwnProperty('cqlFilter')) {
          for (let prop in overlay.cqlFilter) {
            if (overlay.cqlFilter[prop] !== null) cqlFilter.push(overlay.cqlFilter[prop]);
          }
        }
        if (cqlFilter.length > 0) {
          cqlFilterParam = '&CQL_FILTER=' + cqlFilter.join(' AND ');
        }
        this.cqlFilter = cqlFilterParam;

        const toolLayerConfig = globalThis.App.Layers.getLayerConfig(overlay.id, this.owningBlock.blockConfig.layers);
        if (toolLayerConfig !== null) {
          const featureInfoConfigs = globalThis.App.Layers.getFeaturePropertiesByTypes(toolLayerConfig.featureInfo, ['id']);
          let j = 0;
          const length = featureInfoConfigs.length;
          for (; j < length; j += 1) {
            featureProperties.push(featureInfoConfigs[j].propertyName);
          }
        }

        if (featureProperties.length > 0) {
          featureParam = '&propertyName=' + featureProperties.join(',');
        }

        const url = overlay.source.wfs;
        const params =
          'service=WFS&request=GetFeature&version=1.1.0&srsName=' +
          overlay.srs +
          '&typeNames=' +
          overlay.name +
          '&outputFormat=application/json' +
          featureParam +
          cqlFilterParam;
        const res = await Transport.post(params).to(url, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        this.lastRequest = res;

        if (res['requestCanceled']) return;
        res['returned'] = true;
        const featureInfo = await res.json();
        if (this.cqlFilter !== cqlFilterParam) return;
        const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping[0].featureInfo, ['id'], 'propertyName');
        const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperties);
        this.component.getHeader().setTitle(headerText.replace('{count}', features.length.toLocaleString()));

        // this.lastRequest = asyncAjax({
        //   method: 'POST',
        //   url: url,
        //   body: params,
        //   callbackObj: {
        //     extendedTool: this,
        //     overlay: overlay,
        //   },
        //   callback: function(response, callbackObj) {
        //     // TODO: Figure out what this was for/an alternative
        //     // @ts-ignore
        //     if (response.requestCanceled === true) {
        //       return;
        //     }
        //     // TODO: Figure out what this was for/an alternative
        //     // @ts-ignore
        //     response.returned = true;
        //     const extendedTool = callbackObj.extendedTool;
        //     const overlay = callbackObj.overlay;
        //     const featureInfo = JSON.parse(response.responseText);
        //     const layerMapping = globalThis.App.Layers.getLayerConfig(overlay.id, extendedTool.owningBlock.blockConfig.layers);
        //     const idProperties = globalThis.App.Layers.getFeaturePropertiesByTypes(layerMapping.featureInfo, ['id'], 'propertyName');
        //
        //     const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, idProperties);
        //     const headerText = extendedTool.owningBlock.blockConfig.label;
        //     extendedTool.component.getHeader().setTitle(headerText.replace('{count}', features.length.toLocaleString()));
        //   },
        // });
      },
    };

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    let component: Dict<any> = {
      extendedTool: extendedTool,
      width: block.width,
      height: block.height,
      cls: 'x-toolbar-default x-toolbar',
      style: 'border-color: #FFFFFF;',
      layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'center',
        defaultMargins: '0 5px',
      },
      defaults: {
        cls: 'x-btn-middle',
        ui: 'default-toolbar',
      },
      header: {
        frame: false,
        titleAlign: 'center',
        cls: 'tool-group-panel-header',
        style: {
          fontWeight: 'bold',
          backgroundColor: '#FFFFFF',
          color: 'black!important',
          padding: 0,
        },
        shadow: false,
        title: block.label,
      },
      items: items,
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;

          globalThis.App.EventHandler.registerCallbackForEvent(
            globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED,
            this.extendedTool.owningBlock.itemDefinition.cqlFilterUpdated,
            this.extendedTool
          );

          this.extendedTool.updateDisplayedFeatures();
        },
      },
    };

    component = addToolBarItems(block, component, toolbar);

    return Ext.create('Ext.panel.Panel', ExtJSPosition(component, block));
  },
};
