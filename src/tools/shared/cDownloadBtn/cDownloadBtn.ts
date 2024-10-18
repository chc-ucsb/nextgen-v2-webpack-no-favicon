import { Transport } from '../../../Network/Transport';
import { parse } from 'date-fns';

export const cDownloadBtn = {
  options: {
    requiredBlocks: ['cFeatureInfoTable'],
  },
  createExtendedTool: function (owningBlock) {
    const extendedTool = {
      owningBlock: owningBlock,
      startDownload: async function () {
        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const layers = globalThis.App.Layers.query(
          layersConfig,
          {
            type: 'layer',
            display: true,
            loadOnly: false,
            mask: false,
          },
          ['overlays', 'boundaries']
        );

        let requestCount = 0;
        let totalCount = 0;
        const layerMapping = this.owningBlock.blockConfig.layers;
        const formUrl = this.owningBlock.blockConfig.url;

        let i = 0;
        const len = layers.length;
        for (; i < len; i += 1) {
          const layer = layers[i];
          const mappedLayer = globalThis.App.Layers.getLayerConfig(layer.id, layerMapping);
          if (mappedLayer === null) continue;

          totalCount += 1;

          const mappedFeatureInfo = mappedLayer.featureInfo;
          let cqlFilterParam = '';
          const cqlFilter = [];
          let idProperty = '';
          const properties = [];

          if (layer.hasOwnProperty('cqlFilter')) {
            for (let prop in layer.cqlFilter) {
              if (layer.cqlFilter[prop] !== null) cqlFilter.push(layer.cqlFilter[prop]);
            }
          }
          if (cqlFilter.length > 0) {
            cqlFilterParam = '&CQL_FILTER=' + cqlFilter.join(' AND ');
          }

          for (var j = 0, length = mappedFeatureInfo.length; j < length; j += 1) {
            if (mappedFeatureInfo[j].type === 'id') idProperty = mappedFeatureInfo[j].propertyName;
            properties.push(mappedFeatureInfo[j].propertyName);
          }

          const url = layer.source.wfs;
          const params =
            'service=WFS&request=GetFeature&version=1.1.0&srsName=' +
            layer.srs +
            '&typeNames=' +
            layer.name +
            '&outputFormat=application/json&propertyName=' +
            properties.join(',') +
            cqlFilterParam;

          const res = await Transport.post(params).to(url, {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded',
            },
          });
          const featureInfo = await res.json();
          const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, [idProperty]);
          requestCount += 1;

          if (requestCount === totalCount) {
            const featureInfoTableBlock = this.owningBlock.getReferencedBlock('cFeatureInfoTable');
            const tableRecords = featureInfoTableBlock.extendedTool.featureList;
            const downloadRecords = [];

            for (let tableRecord of tableRecords) {
              if (tableRecord[1] === true) {
                let filePath = mappedLayer.downloadPath;

                for (let feature of features) {
                  if (feature.properties[idProperty] === tableRecord[0]) {
                    for (let property of properties) {
                      let value = feature.properties[property];
                      if (typeof value === 'string') value = value.toLowerCase();
                      if (property.includes('date')) {
                        var dateToCompare = new Date();
                        var newValue = parse(value, "yyyy-MM-dd'z'", dateToCompare);
                        if (dateToCompare.getTime() !== newValue.getTime()) value = newValue.getFullYear();
                      }

                      filePath = filePath.replace('{' + property + '}', value);
                    }
                  }
                }
                globalThis.App.Analytics.reportActivity(filePath, 'Downloads', 'Download');
                downloadRecords.push(filePath);
              }
            }

            const form = document.createElement('form');
            form.setAttribute('method', 'POST');
            form.setAttribute('action', formUrl);
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', 'file_paths');
            input.setAttribute('value', downloadRecords.join(','));
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
          }

          // asyncAjax({
          //   method: 'POST',
          //   body: params,
          //   url: url,
          //   callbackObj: {
          //     requestCount: requestCount,
          //     totalCount: totalCount,
          //     extendedTool: this,
          //     downloadPath: mappedLayer.downloadPath,
          //     properties: properties,
          //     idProperty: idProperty,
          //   },
          //   callback: function(response, callbackObj) {
          //     const featureInfo = JSON.parse(response.responseText);
          //     const extendedTool = callbackObj.extendedTool;
          //     const downloadPath = callbackObj.downloadPath;
          //     const properties = callbackObj.properties;
          //     const idProperty = callbackObj.idProperty;
          //     const features = globalThis.App.OpenLayers.combineFeaturesByProperties(featureInfo.features, [idProperty]);
          //
          //     callbackObj.requestCount += 1;
          //     if (callbackObj.totalCount === callbackObj.requestCount) {
          //       const featureInfoTableBlock = extendedTool.owningBlock.getReferencedBlock('cFeatureInfoTable');
          //       const tableRecords = featureInfoTableBlock.extendedTool.featureList;
          //       const downloadRecords = [];
          //       let i = 0;
          //       const len = tableRecords.length;
          //       for (; i < len; i += 1) {
          //         const tableRecord = tableRecords[i];
          //         if (tableRecord[1] === true) {
          //           let filePath = downloadPath;
          //           let j = 0;
          //           const length = features.length;
          //           for (; j < length; j += 1) {
          //             const feature = features[j];
          //             if (feature.properties[idProperty] === tableRecord[0]) {
          //               let k = 0;
          //               const propertiesLength = properties.length;
          //               for (; k < propertiesLength; k += 1) {
          //                 const property = properties[k];
          //                 let value = feature.properties[property];
          //                 if (typeof value === 'string') value = value.toLowerCase();
          //                 filePath = filePath.replace('{' + property + '}', value);
          //               }
          //             }
          //           }
          //           globalThis.App.Analytics.reportActivity(filePath, 'Downloads', 'Download');
          //           downloadRecords.push(filePath);
          //         }
          //       }
          //
          //       const form = document.createElement('form');
          //       form.setAttribute('method', 'POST');
          //       form.setAttribute('action', 'https://edcintl.cr.usgs.gov/mtbs_remote_zip_servlet/ZipServlet');
          //       const input = document.createElement('input');
          //       input.setAttribute('type', 'hidden');
          //       input.setAttribute('name', 'file_paths');
          //       input.setAttribute('value', downloadRecords.join(','));
          //       form.appendChild(input);
          //       document.body.appendChild(form);
          //       form.submit();
          //     }
          //   },
          // });
        }
      },
    };

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const component = {
      extendedTool: extendedTool,
      xtype: 'button',
      width: block.width,
      height: block.height,
      text: block.text,
      handler: function () {
        this.extendedTool.startDownload();
      },
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    const featureInfoTableBlock = extendedTool.owningBlock.getReferencedBlock('cFeatureInfoTable');
    if (featureInfoTableBlock !== null) {
      featureInfoTableBlock.on(
        'tableUpdatedEvent',
        function (callbackObj, postingObj) {
          const extendedTool = callbackObj;
          const featureInfoTable = postingObj;

          const recordCount = featureInfoTable.featureList.length;

          const btnText = extendedTool.owningBlock.blockConfig.text;
          extendedTool.component.setText(btnText.replace('{count}', recordCount.toLocaleString()));
        },
        extendedTool
      );

      featureInfoTableBlock.on(
        'checkchange',
        function (callbackObj, postingObj) {
          const extendedTool = callbackObj;
          const featureInfoTable = postingObj;

          let recordCount = 0;
          const featureList = featureInfoTable.featureList;
          let i = 0;
          const len = featureList.length;
          for (; i < len; i += 1) {
            const feature = featureList[i];
            if (feature[1] === true) {
              recordCount += 1;
            }
          }

          const btnText = extendedTool.owningBlock.blockConfig.text;
          extendedTool.component.setText(btnText.replace('{count}', recordCount));
        },
        extendedTool
      );
    }

    return component;
  },
};
