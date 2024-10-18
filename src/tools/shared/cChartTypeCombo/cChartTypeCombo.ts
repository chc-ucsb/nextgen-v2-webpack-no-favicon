import barGraph from '../../../../assets/images/bars.png';
import lineChart from '../../../../assets/images/line_chart.png';

export const cChartTypeCombo = {
  options: {
    requiredBlocks: ['cChartContainer', 'cMapWindow'],
  },
  createExtendedTool: function (owningBlock) {
    const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const mapperWindow = mapWindowBlock.extendedTool;

    const extendedTool = {
      owningBlock: owningBlock,
      setStore: function () {
        // Sets the store for this combo on initial chart load.
        const chartContainerBlock = this.owningBlock.getReferencedBlock('cChartContainer');
        const chartContainer = chartContainerBlock.extendedTool;
        const mapWindowBlock = this.owningBlock.getReferencedBlock('cMapWindow');
        const mapperWindow = mapWindowBlock.extendedTool;

        const data = this.getComboData(),
          attributes = chartContainer.getAttributes(),
          value = mapperWindow.savedGraphSelection[chartContainer.getDataTypeName()][attributes.overlayId][attributes.boundaryId];

        const store = Ext.create('Ext.data.Store', {
          fields: ['name', 'value', 'qtip'],
          data: data,
          autoLoad: true,
        });

        this.component.suspendEvents();
        this.component.bindStore(store);
        this.component.setValue(value);
        this.component.store.load({
          scope: this,
          callback: function (records) {
            this.component.updateImage();
          },
        });
        this.component.resumeEvents();
      },
      getComboData: function () {
        // Gets the data for the store (either bar or line graph).
        const data = [];
        const chartContainerBlock = this.owningBlock.getReferencedBlock('cChartContainer');
        if (chartContainerBlock !== null) {
          const chartContainer = chartContainerBlock.extendedTool;
          const graphTypes = chartContainer.getGraphTypes();
          let imagePaths = this.owningBlock.blockConfig.images;
          if (typeof imagePaths === 'undefined') {
            imagePaths = {
              bar: `${barGraph}`,
              line: `${lineChart}`,
            };
          }
          let i = 0;
          const len = graphTypes.length;
          for (; i < len; i += 1) {
            switch (graphTypes[i]) {
              case 'bar':
                data.push({
                  name: imagePaths.bar,
                  value: graphTypes[i],
                  qtip: 'Bar graph',
                });
                break;
              case 'line':
                data.push({
                  name: imagePaths.line,
                  value: graphTypes[i],
                  qtip: 'Line graph',
                });
            }
          }
        }
        return data;
      },
    };

    var chartContainerBlock = owningBlock.getReferencedBlock('cChartContainer');
    if (chartContainerBlock !== null) {
      chartContainerBlock.on(
        'attributesupdated',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          extendedTool.attributesUpdated = true;
          if (extendedTool.owningBlock.rendered === true) extendedTool.setStore();
        },
        extendedTool
      );
    }

    if (typeof mapperWindow.savedGraphSelection === 'undefined') {
      mapperWindow.savedGraphSelection = {};
    }

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    var chartContainerBlock = extendedTool.owningBlock.getReferencedBlock('cChartContainer');
    const chartContainer = chartContainerBlock.extendedTool;
    const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
    const mapperWindow = mapWindowBlock.extendedTool;

    const savedGraphSelection = mapperWindow.savedGraphSelection,
      chartAttributes = chartContainer.getAllAttributes();

    let i = 0;
    const len = chartAttributes.length;
    for (; i < len; i += 1) {
      const attributes = chartAttributes[i],
        boundaryId = attributes.boundaryId,
        overlayId = attributes.overlayId;

      let j = 0;
      const length = attributes.chartTypes.length;
      for (; j < length; j += 1) {
        const chartType = attributes.chartTypes[j];
        const dataTypeName = chartContainer.getDataTypeName(chartType.dataType);
        if (!savedGraphSelection.hasOwnProperty(dataTypeName)) savedGraphSelection[dataTypeName] = {};
        if (!savedGraphSelection[dataTypeName].hasOwnProperty(overlayId)) savedGraphSelection[dataTypeName][overlayId] = {};
        if (savedGraphSelection[dataTypeName][overlayId].hasOwnProperty(boundaryId)) continue;
        savedGraphSelection[dataTypeName][overlayId][boundaryId] = chartType.graphTypes[0];
      }
    }

    const combo = {
      saveSelection: block.saveSelection,
      extendedTool: extendedTool,
      width: block.width,
      editable: false,
      multiSelect: false,
      valueField: 'value',
      comboType: 'chartTypeCombo',
      tpl: [
        // Allows rendering of images instead of text in combobox.
        '<tpl for=".">',
        '<div class="x-boundlist-item" title="{qtip}">',
        '<img src="{name}"/>',
        '</div>',
        '</tpl>',
      ],
      getImageUrl: function () {
        let name = '';
        const value = this.getValue();
        const records = this.store.data.items;
        let i = 0;
        const len = records.length;
        for (; i < len; i += 1) {
          const record = records[i];
          if (record.get('value') === value) {
            name = record.get('name');
            break;
          }
        }
        return name;
      },
      getOverflowCombo: function () {
        const toolbar = this.owningToolbar;
        if (toolbar && toolbar.layout.overflowHandler.menu) {
          const items = toolbar.layout.overflowHandler.menu.items.items;
          let i = 0;
          const len = items.length;
          for (; i < len; i += 1) {
            const item = items[i];
            if (item.comboType === 'chartTypeCombo') {
              return item;
            }
          }
        }

        return null;
      },
      updateOverflowCombo(data, selection) {
        const overflowCombo = this.getOverflowCombo();
        if (overflowCombo !== null) {
          overflowCombo.suspendEvents();
          if (typeof data === 'undefined' || data === null) data = this.getComboData();
          if (typeof selection === 'undefined' || selection === null) selection = this.lastSelection;

          const store = Ext.create('Ext.data.Store', {
            fields: ['name', 'value', 'qtip'],
            data: data,
            autoLoad: true,
          });

          overflowCombo.clearValue();
          overflowCombo.bindStore(store);
          overflowCombo.setValue(selection);
          overflowCombo.resumeEvents();

          this.updateOverflowImage();
        }
      },
      updateImage: function () {
        // Updates the image shown in the combobox.
        const imageUrl = this.getImageUrl();

        this.inputEl.setStyle({
          'background-image': 'url(' + imageUrl + ')',
          'background-repeat': 'no-repeat',
          'background-position': '3px center',
          'padding-left': '25px',
        });

        this.updateOverflowImage(imageUrl);
      },
      updateOverflowImage: function (imageUrl) {
        const overflowCombo = this.getOverflowCombo();
        if (overflowCombo !== null) {
          if (typeof imageUrl === 'undefined') imageUrl = this.getImageUrl();
          overflowCombo.inputEl.setStyle({
            'background-image': 'url(' + imageUrl + ')',
            'background-repeat': 'no-repeat',
            'background-position': '3px center',
            'padding-left': '25px',
          });
        }
      },
      listeners: {
        change: function (combo, records) {
          const chartContainerBlock = this.extendedTool.owningBlock.getReferencedBlock('cChartContainer');
          const chartContainer = chartContainerBlock.extendedTool;
          const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');

          const value = combo.getValue();
          combo.updateImage();

          if (mapWindowBlock !== null) {
            const mapperWindow = mapWindowBlock.extendedTool;

            const attributes = chartContainer.getAttributes();

            if (combo.saveSelection === true) {
              mapperWindow.savedGraphSelection[chartContainer.getDataTypeName()][attributes.overlayId][attributes.boundaryId] = value;
            }
          }

          chartContainer.setSelectedGraphType(value);
        },
        afterrender: function (combo, records) {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.component.el.dom.title = this.extendedTool.owningBlock.blockConfig.tooltip;
          const chartContainer = chartContainerBlock.extendedTool;
          const attributes = chartContainer.getAttributes(),
            value = mapperWindow.savedGraphSelection[chartContainer.getDataTypeName()][attributes.overlayId][attributes.boundaryId];
          if (value) chartContainer.selectedGraphType = value;
          if (this.extendedTool.attributesUpdated === true) {
            this.extendedTool.setStore();
          }
        },
      },
    };

    const combobox = Ext.create('Ext.form.field.ComboBox', combo);

    var chartContainerBlock = extendedTool.owningBlock.getReferencedBlock('cChartContainer');
    if (chartContainerBlock !== null) {
      chartContainerBlock.on(
        'boundaryidchanged',
        function (extendedTool) {
          const chartContainerBlock = extendedTool.owningBlock.getReferencedBlock('cChartContainer');
          const chartContainer = chartContainerBlock.extendedTool;
          const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
          const mapperWindow = mapWindowBlock.extendedTool;
          extendedTool.setStore();
          chartContainer.setSelectedGraphType(extendedTool.component.getValue());
        },
        extendedTool
      );

      chartContainerBlock.on(
        'datatypechanged',
        function (extendedTool) {
          const chartContainerBlock = extendedTool.owningBlock.getReferencedBlock('cChartContainer');
          const chartContainer = chartContainerBlock.extendedTool;
          const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
          const mapperWindow = mapWindowBlock.extendedTool;
          extendedTool.setStore();
          chartContainer.setSelectedGraphType(extendedTool.component.getValue());
        },
        extendedTool
      );

      chartContainerBlock.on(
        'overflowmenushow',
        function (extendedTool) {
          extendedTool.component.updateOverflowCombo(extendedTool.getComboData(), extendedTool.component.lastSelection);
        },
        extendedTool
      );
    }

    return combobox;
  },
};
