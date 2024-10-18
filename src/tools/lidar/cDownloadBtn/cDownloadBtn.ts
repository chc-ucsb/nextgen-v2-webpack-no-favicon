import { Transport } from '../../../Network/Transport';
import { parse } from 'date-fns';

export const cDownloadBtn = {
  options: {
    requiredBlocks: ['cFeatureInfoTable'],
  },
  createExtendedTool: function (owningBlock) {
    const extendedTool = {
      button: null,
      email: '',
      recordLength: 0,
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
                for (let feature of features) {
                  if (feature.properties[idProperty] === tableRecord[0]) {
                    let value = '';
                    for (let property of properties) {
                      if (property === 'Site' || property === 'Plot') {
                        value = value + feature.properties[property] + '_';
                      } else if (property === 'Year' || property === 'Month' || property === 'Day') {
                        value = value + feature.properties[property].toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
                      } else if ('gid') {
                        // do nothing
                      } else {
                        value = value + feature.properties[property];
                      }
                    }
                    downloadRecords.push(value);
                  }
                }
              }
            }

            // const form = document.createElement('form');
            // form.setAttribute('method', 'POST');
            // form.setAttribute('action', formUrl);
            // const input = document.createElement('input');
            // input.setAttribute('type', 'hidden');
            // input.setAttribute('name', 'file_paths');
            // input.setAttribute('value', downloadRecords.join(','));
            // form.appendChild(input);
            // document.body.appendChild(form);
            // form.submit();

            const request = new XMLHttpRequest();
            request.open('POST', formUrl, true);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
            let port = '';
            if (window.location.port) {
              port = `:${window.location.port}`;
            }

            let jsonDwnldRcrds = JSON.stringify(downloadRecords);
            request.send(`layers=${jsonDwnldRcrds}&email=${extendedTool.email}`);

            request.onreadystatechange = function (): void {
              if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(request.response);
                if (response.success === true) {
                  let successAlert = `Your download request has successfully been sent and will be processed for you within 24 hours. You will receive an e-mail with instructions on retrieving your data. Thank you.`;
                  alert(successAlert);
                } else {
                  alert(`ERROR: ${response.errorMessage}`);
                }
              }
            };
          }
        }
      },
      // basic email validation
      emailIsValid(email: string = this.email): boolean {
        /*
         * make sure that string follows basic email format
         * if there are spaces we probably have an invalid email
         */
        if (/[^@]+@[^@]+\.[^@]+/.test(email) && /\s+/.test(email) === false) {
          return true;
        }

        return false;
      },
      toggleDownloadBtn(recordCount: number = this.recordCount): void {
        this.recordCount = recordCount;
        const btnText = this.owningBlock.blockConfig.text;
        // this.button.text = btnText.replace('{count}', recordCount.toLocaleString());
        this.button.setText(btnText.replace('{count}', recordCount.toLocaleString()));
        // this.button.setText(btnText.replace('{count}', '1'));
        if (this.recordCount && this.emailIsValid()) {
          this.enableDownloadBtn();
        } else {
          this.disableDownloadBtn();
        }
      },
      disableDownloadBtn(): void {
        this.button.disable();
      },
      enableDownloadBtn(): void {
        this.button.enable();
      },
    };

    return extendedTool;
  },

  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const component = {
      extendedTool: extendedTool,
      xtype: 'panel',
      layout: 'column',
      width: block.width,
      items: [
        {
          xtype: 'textfield',
          emptyText: 'Email',
          style: { marginRight: '10px' },
          text: block.text,
          listeners: {
            change(textbox, value): void {
              const emailTrimed = value.trim();
              if (extendedTool.emailIsValid(emailTrimed)) {
                textbox.inputEl.el.dom.style.color = 'black';
                extendedTool.email = emailTrimed;
                extendedTool.toggleDownloadBtn();
              } else {
                textbox.inputEl.el.dom.style.color = 'crimson';
                extendedTool.email = '';
                extendedTool.disableDownloadBtn(); //email not valid; straight to disable
              }
            },
          },
        },
        {
          xtype: 'button',
          text: block.text,
          handler: function () {
            extendedTool.startDownload();
          },
          listeners: {
            afterrender: function () {
              extendedTool.button = this;
            },
          },
        },
      ],
    };

    const featureInfoTableBlock = extendedTool.owningBlock.getReferencedBlock('cFeatureInfoTable');
    if (featureInfoTableBlock !== null) {
      featureInfoTableBlock.on(
        'tableUpdatedEvent',
        function (callbackObj, postingObj) {
          const extendedTool = callbackObj;
          const featureInfoTable = postingObj;

          const recordCount = featureInfoTable.featureList.length;

          extendedTool.toggleDownloadBtn(recordCount);
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

          extendedTool.toggleDownloadBtn(recordCount);
        },
        extendedTool
      );
    }

    return component;
  },
};
