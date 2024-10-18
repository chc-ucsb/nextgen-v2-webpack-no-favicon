import { getPeriodLabel, getPeriodsPerYear } from '../../../helpers/periodicity';

export const cYearsCombo = {
  options: {
    requiredBlocks: ['cChartContainer', 'cMapWindow'],
  },
  init(blueprint) {
    globalThis.App.Tools.createSelectAllCombo();
  },
  createExtendedTool(owningBlock) {
    const block = owningBlock.blockConfig;

    let chartContainerBlock = owningBlock.getReferencedBlock('cChartContainer');
    const chartContainer = chartContainerBlock.extendedTool;
    const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const mapperWindow = mapWindowBlock.extendedTool;

    const extendedTool = {
      owningBlock,
      tooltipText: block.tooltip,
      saveSelection: block.saveSelection,
      store: null,
      defaultValue: null,
      createStore() {
        const data = extendedTool.getComboData();
        this.store = Ext.create('Ext.data.Store', {
          fields: ['name', 'value'],
          data,
        });
        this.defaultValue = this.getDefaultValue();
      },
      /**
       * Sets the combo box store on initial chart load.
       */
      setStore() {
        const data = extendedTool.getComboData();
        // if a.value exists it's jan-1 and such
        if (typeof data[0]?.value !== 'number') {
          data.sort((a, b) => {
            return parseInt(b.value) - parseInt(a.value);
          });
        }
        const finalItem = data[data.length - 1];
        // if (isNaN(finalItem.value)) data.unshift(data.splice(data.indexOf(data[finalItem]), 1)[0]);
        const store = Ext.create('Ext.data.Store', {
          fields: ['name', 'value'],
          data,
        });
        this.component.bindStore(store);

        const defaultVal = this.getDefaultValue();
        this.component.setValue(defaultVal);
      },
      getComboData() {
        // Gets the data for the store.
        const chartContainerBlock = this.owningBlock.getReferencedBlock('cChartContainer');
        const chartContainer = chartContainerBlock.extendedTool;

        const attributes = chartContainer.getAttributes();
        const periodFormat = chartContainer.getPeriodFormat();
        const data = [];
        if (periodFormat === 'years') {
          // Not interannual. Get list of years.
          const { seasons } = attributes;
          const { staticSeasonNames } = attributes;

          if (staticSeasonNames) {
            for (var i = 0, len = staticSeasonNames.length; i < len; i += 1) {
              var season = staticSeasonNames[i];
              data.push({
                name: globalThis.App.Charter.Common.getSeasonDisplayName(season),
                value: season,
              });
            }
          }

          for (var i = 0; i < seasons.length; i++) {
            var season = seasons[i].toString();
            const display = season.toString();
            data.push({
              name: display,
              value: season,
            });
          }
        } else if (periodFormat === 'periods') {
          // Interannual. Get list of periods.
          const { period } = attributes;
          getPeriodsPerYear(period).map((periodInYear) => {
            data.push({
              name: getPeriodLabel(period, periodInYear),
              value: periodInYear,
            });
          });
        }

        return data;
      },
      getSavedSelection() {
        // Retrieves the saved selection when opening a new chart on the same map window.
        const mapWindowBlock = this.owningBlock.getReferencedBlock('cMapWindow');

        if (mapWindowBlock !== null) {
          const mapperWindow = mapWindowBlock.extendedTool;
          const chartContainerBlock = this.owningBlock.getReferencedBlock('cChartContainer');
          const chartContainer = chartContainerBlock.extendedTool;
          const attributes = chartContainer.getAttributes();
          if (!mapperWindow.savedPeriodSelection.hasOwnProperty(chartContainer.uniqueId)) {
            return [];
          }
          if (!mapperWindow.savedPeriodSelection[chartContainer.uniqueId].hasOwnProperty(attributes.period)) {
            return [];
          }
          return mapperWindow.savedPeriodSelection[chartContainer.uniqueId][attributes.period][chartContainer.getPeriodFormat()];
        }
      },
      setSavedSelection(value) {
        // Sets saved selection per map window.
        const mapWindowBlock = this.owningBlock.getReferencedBlock('cMapWindow');

        if (mapWindowBlock !== null) {
          const mapperWindow = mapWindowBlock.extendedTool;
          const chartContainerBlock = this.owningBlock.getReferencedBlock('cChartContainer');
          const chartContainer = chartContainerBlock.extendedTool;
          const attributes = chartContainer.getAttributes();
          if (!mapperWindow.savedPeriodSelection.hasOwnProperty(chartContainer.uniqueId)) {
            mapperWindow.savedPeriodSelection[chartContainer.uniqueId] = {};
          }
          if (!mapperWindow.savedPeriodSelection[chartContainer.uniqueId].hasOwnProperty(attributes.period)) {
            mapperWindow.savedPeriodSelection[chartContainer.uniqueId][attributes.period] = {
              years: [],
              periods: [],
            };
          }
          mapperWindow.savedPeriodSelection[chartContainer.uniqueId][attributes.period][chartContainer.getPeriodFormat()] = value;
        }
      },
      getDefaultValue() {
        // Gets the default value to select in the combo.
        const chartContainerBlock = this.owningBlock.getReferencedBlock('cChartContainer');
        const chartContainer = chartContainerBlock.extendedTool;
        const mapWindowBlock = this.owningBlock.getReferencedBlock('cMapWindow');

        const periodFormat = chartContainer.getPeriodFormat();
        const attributes = chartContainer.getAttributes();
        let value;
        const mapWindow = mapWindowBlock.component;
        const savedSelection = this.getSavedSelection();
        if (this.saveSelection === true && mapWindow && savedSelection.length > 0 && savedSelection[0]) {
          // If savedSelection fails its only value is NaN which is falsy, that is why we have the final comparitor.
          // The reversal is because sometimes getSavedSelection() returns a junk
          // Uses saved selection if a selection was previously made and the map window has not been closed.
          const savedSelection = this.getSavedSelection();
          value = [];
          const options = this.getComboData();
          for (let i = 0; i < options.length; i++) {
            const option = options[i].value;
            for (let j = 0; j < savedSelection.length; j++) {
              const selection = savedSelection[j];
              if (selection === option) {
                value.push(option);
              }
            }
          }
        } else if (periodFormat === 'years') {
          // Retrieve default selected years on initial load.
          const { seasons } = attributes;
          // This way no matter how the years are delivered they'll be passed in to getDefaultSelectedYears in descending order
          seasons.sort();
          seasons.reverse();
          value = globalThis.App.Charter.getDefaultSelectedYears(
            attributes.startMonth,
            seasons,
            attributes.staticSeasonNames,
            this.owningBlock.blockConfig.showByDefault
          );
        } else {
          // Get default selected periods on initial load (default is current period in current year).
          value = [this.endPeriod];

          // Fix for interannual charts for monthly data -- 0 is not a valid month
          if (this.endPeriod === 0) {
            value = [1];
          }
        }

        return value;
      },
      isDataChanged(list1, list2) {
        for (var i = 0, len = list1.length; i < len; i += 1) {
          const value1 = list1[i];
          if (list2.indexOf(value1) === -1) {
            return true;
          }
        }
        for (var i = 0, len = list2.length; i < len; i += 1) {
          const value2 = list2[i];
          if (list1.indexOf(value2) === -1) {
            return true;
          }
        }
        return false;
      },
      getOverflowCombo() {
        // Retrieve the associated combo in toolbars overflow menu.
        const toolbar = this.component.owningToolbar;
        if (toolbar?.layout?.overflowHandler?.menu) {
          const { items } = toolbar.layout.overflowHandler.menu.items;
          let i = 0;
          const len = items.length;
          for (; i < len; i += 1) {
            const item = items[i];
            if (item.comboType === 'periodsCombo') {
              return item;
            }
          }
        }
        return null;
      },
      updateOverflowCombo(data, newPeriodsComboValue) {
        // Since the combo in the overflow menu is a copy of this combo, make sure it is updated when this combo is
        // updated.
        const overflowCombo = this.getOverflowCombo();
        if (overflowCombo !== null) {
          overflowCombo.suspendEvents();
          if (typeof data === 'undefined' || data === null) data = this.getComboData();
          if (typeof newPeriodsComboValue === 'undefined' || newPeriodsComboValue === null) newPeriodsComboValue = this.getDefaultValue();

          const store = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data,
          });

          overflowCombo.clearValue();
          overflowCombo.bindStore(store);
          overflowCombo.setValue(newPeriodsComboValue);
          overflowCombo.resumeEvents();
        }
      },
    };

    chartContainerBlock = extendedTool.owningBlock.getReferencedBlock('cChartContainer');

    chartContainerBlock.on(
      'periodsync',
      function (callbackObj, postingObj, eventObj) {
        let periodObj;
        let i;
        let len;
        const extendedTool = callbackObj;
        if (extendedTool.attributesUpdated !== true) return;
        const chartContainer = postingObj;
        const periodList = eventObj;

        const { seasons } = chartContainer.getAttributes();
        const selection = extendedTool.getDefaultValue();
        const newSelection = [];
        for (let i = 0, len = periodList.length; i < len; i += 1) {
          const periodObj = periodList[i];
          if (seasons.indexOf(periodObj.period) !== -1 && periodObj.selected === true) {
            newSelection.push(periodObj.period);
          }
        }

        for (let i = 0, len = selection.length; i < len; i += 1) {
          const value = selection[i];
          let valueInPeriodList = false;
          for (let j = 0, length = periodList.length; j < length; j += 1) {
            const periodObj = periodList[j];
            if (periodObj.period === value) {
              valueInPeriodList = true;
              break;
            }
          }
          if (valueInPeriodList === false) {
            newSelection.push(value);
          }
        }
        extendedTool.setSavedSelection(newSelection);
        if (extendedTool.owningBlock.rendered === true) {
          extendedTool.component.suspendEvents();
          extendedTool.setStore();
          extendedTool.component.resumeEvents();
        }
        chartContainer.setSelectedPeriods(newSelection);
      },
      extendedTool
    );

    chartContainerBlock.on(
      'attributesupdated',
      function (callbackObj, postingObj, eventObj) {
        // After feature info is returned (chart attributes), we can use them here.
        const extendedTool = callbackObj;
        const chartContainer = postingObj;
        extendedTool.attributesUpdated = true;
        chartContainer.setSelectedPeriods(extendedTool.getDefaultValue());
        const attributes = chartContainer.getAttributes();

        if (extendedTool.owningBlock.rendered === true) {
          extendedTool.component.suspendEvents();
          extendedTool.setStore();
          extendedTool.component.resumeEvents();
          let { width, addSelectAllButtons } = extendedTool.owningBlock.blockConfig;
          if (!width) width = 30;
          // width += 10;
          const pickerWidth = attributes.startMonth > 1 || addSelectAllButtons ? width + 30 : width;
          extendedTool.component.getPicker().setWidth(pickerWidth);
        }

        if (!extendedTool.hasOwnProperty('endPeriod')) {
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
          const layerId = layer.id;
          const granule = globalThis.App.Layers._granules.get(layerId);
          const date = new Date();
          if (attributes.period === 'pentad') {
            const monthPentad = date.getMonth() * 6; // Get the number of monthly pentads
            let pentad = Math.ceil(date.getDate() / 5); // Get the current pentad of the month
            if (pentad > 6) pentad = 6; // The 31st would technically be a 7th pentad but we join it with the 6th
            extendedTool.endPeriod = monthPentad + pentad; // Set endPeriod equal to the current pentad in the year
          }
          if (attributes.period === `month` || attributes.period === `2month` || attributes.period === `3month`) {
            extendedTool.endPeriod = date.getMonth();
          }
          if (attributes.period === 'dekad') {
            const monthDekads = date.getMonth() * 3; // Get the number of monthly dekads
            let dekad = Math.ceil(date.getDate() / 10); // Get the current dekad of the month
            if (dekad > 3) dekad = 3; // The 31st would technically be a 4th dekad but we join it with the 3rd
            extendedTool.endPeriod = monthDekads + dekad; // Set endPeriod equal to the current pentad in the year
          }
        }
      },
      extendedTool
    );

    if (typeof mapperWindow.savedPeriodSelection === 'undefined') {
      mapperWindow.savedPeriodSelection = {};
    }

    return extendedTool;
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const { width } = block;

    const combo = {
      saveSelection: block.saveSelection,
      extendedTool,
      width,
      editable: false,
      multiSelect: true,
      matchFieldWidth: false,
      plugins: block.addSelectAllButtons === true ? ['selectedCount'] : [],
      displayField: 'name',
      valueField: 'value',
      comboType: 'periodsCombo',
      listeners: {
        change() {
          const value = this.getValue();
          const chartContainerBlock = this.extendedTool.owningBlock.getReferencedBlock('cChartContainer');
          const chartContainer = chartContainerBlock.extendedTool;
          if (this.saveSelection === true) this.extendedTool.setSavedSelection(value);
          chartContainer.setSelectedPeriods(value);
        },
        afterrender() {
          const chartContainerBlock = this.extendedTool.owningBlock.getReferencedBlock('cChartContainer');
          const chartContainer = chartContainerBlock.extendedTool;
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.component.el.dom.title = this.extendedTool.tooltipText;
          if (!this.extendedTool.attributesUpdated) return;
          const attributes = chartContainer.getAttributes();
          this.suspendEvents();
          this.extendedTool.setStore();
          this.resumeEvents();
          let { width, addSelectAllButtons } = this.extendedTool.owningBlock.blockConfig;
          if (!width) width = 30;
          // width += 10;
          const pickerWidth = attributes.startMonth > 1 || addSelectAllButtons ? width + 30 : width;
          this.getPicker().setWidth(pickerWidth);
        },
      },
    };

    const combobox = Ext.create('Ext.form.field.ComboBox', combo);
    extendedTool.combo = combobox;

    const chartContainerBlock = extendedTool.owningBlock.getReferencedBlock('cChartContainer');
    chartContainerBlock.on(
      'datatypechanged',
      function (extendedTool) {
        // Fires when the period type combo is changed. If interannual is selected, show list of periods. Else list of
        // years.
        const combo = extendedTool.component;
        const chartContainerBlock = extendedTool.owningBlock.getReferencedBlock('cChartContainer');
        const chartContainer = chartContainerBlock.extendedTool;

        combo.suspendEvents();
        combo.clearValue();
        combo.resumeEvents();
        const data = extendedTool.getComboData();
        const value = extendedTool.getDefaultValue();
        const store = Ext.create('Ext.data.Store', {
          fields: ['name', 'value'],
          data: JSON.parse(JSON.stringify(data)),
        });
        combo.bindStore(store);
        combo.setValue(value);
        extendedTool.updateOverflowCombo(data, value);
      },
      extendedTool
    );

    chartContainerBlock.on(
      'boundaryidchanged',
      function (extendedTool) {
        // Fires when the period type combo is changed. If interannual is selected, show list of periods. Else list of
        // years.
        const combo = extendedTool.component;
        const chartContainerBlock = extendedTool.owningBlock.getReferencedBlock('cChartContainer');
        const chartContainer = chartContainerBlock.extendedTool;

        combo.suspendEvents();
        combo.clearValue();
        combo.resumeEvents();
        const data = extendedTool.getComboData();
        const value = extendedTool.getDefaultValue();
        const store = Ext.create('Ext.data.Store', {
          fields: ['name', 'value'],
          data: JSON.parse(JSON.stringify(data)),
        });
        combo.bindStore(store);
        combo.setValue(value);
        extendedTool.updateOverflowCombo(data, value);
      },
      extendedTool
    );

    chartContainerBlock.on(
      'overflowmenushow',
      function (extendedTool) {
        extendedTool.updateOverflowCombo(extendedTool.getComboData(), extendedTool.getDefaultValue());
      },
      extendedTool
    );

    chartContainerBlock.on(
      'overflowmenushow',
      function (extendedTool) {
        extendedTool.updateOverflowCombo(extendedTool.getComboData(), extendedTool.getDefaultValue());
      },
      extendedTool
    );

    return combobox;
  },
};
