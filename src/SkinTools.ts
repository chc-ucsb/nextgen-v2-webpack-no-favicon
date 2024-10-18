import View from 'ol/View';
import { DoubleClickZoom, DragBox, DragPan, DragZoom, KeyboardPan, KeyboardZoom, MouseWheelZoom, PinchZoom } from 'ol/interaction';
import { always, shiftKeyOnly } from 'ol/events/condition';
import { defaults as olControlDefaults, MousePosition, OverviewMap, ZoomToExtent } from 'ol/control';
import Projection from 'ol/proj/Projection';
import { createStringXY } from 'ol/coordinate';
import { parseISO } from 'date-fns';
import Bar from 'ol-ext/control/Bar';
import Toggle from 'ol-ext/control/Toggle';
import Button from 'ol-ext/control/Button';
import Legend from 'ol-ext/control/Legend';
import TextButton from 'ol-ext/control/TextButton';
import Overlay from 'ol-ext/control/Overlay';
import Notification from 'ol-ext/control/Notification';
import { cBlocks } from './Architect/cBlocks';
import { objPropExists } from './helpers/object';
import { tools } from './importedTools';
import { Dictionary } from './@types';
import { buildLayerGranuleName, buildUrlParams, getRandomString, toFilename } from './helpers/string';
import { Granule } from './Granules';
import { getPeriodsPerMonth } from './helpers/granule';
import { first, last } from './helpers/array';
import { getRegionWithRegionID, logger } from './utils';
import { Transport } from './Network/Transport';
import { compositeBlobs, startDownloadOfImageURL } from './helpers/network';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';

export const SkinTools = {
  cBlocks,
  ...tools,
  /**
   * Namespace holds all methods for creating a month combobox in the date picker.
   */
  monthCombo: {
    /**
     * Registers callbacks to events on the periodicity object.
     */
    registerEvents(picker, id, layerId) {
      // With Extjs, we can't guarantee when the html for the select box
      // is actually added to the DOM so we have to check it's existence every 100 milliseconds.
      // TaskManager does not throw errors, so you have to make sure everything is correct --
      // that all accessed properties are valid, etc.
      Ext.TaskManager.start({
        interval: 100,
        run() {
          const monthCombo: any = document.getElementById(id);
          // If the select box is in the DOM
          if (monthCombo) {
            // Get the granule based on the layerId
            const g = globalThis.App.Layers._granules.get(layerId);

            // Store the granule on the combobox element
            monthCombo.granule = g;
            monthCombo.picker = picker;

            // If the selected month index is greater than what the selected year offers,
            // default to the last month available.
            monthCombo.selectedIndex = g.selectedMonthIndex;

            // Update the granule in an onchange event
            // When the user changes the selected option in the month
            // select box, changed the selected period in the granule object.
            monthCombo.onchange = function () {
              g.setSelectedMonthIndex(this.selectedIndex);
              globalThis.App.Layers.updateLayerAttributes(layerId);
              this.picker.updateValue();
            };

            g.events.registerCallbackForEvent(
              'selectionChange',
              (evtObj, combo, pObj) => {
                combo.selectedIndex = combo.granule.selectedMonthIndex;
              },
              monthCombo
            );

            // When the available month's to select from changes, such as when the year
            // changes, update the options in the select box.
            g.events.registerCallbackForEvent(
              'optionsChange',
              function (evtObj, monthCombo, pObj) {
                // Try to keep the same selection if it exists in the new list.
                // So if December is selected, and the year changes but December
                // is available in the year, then select December.
                // If December is selected in a previous year and the year changes
                // to the current year which only has data through October, select October instead.
                // let selectedValue = monthCombo.selectedIndex;
                const months = monthCombo.granule.selectableMonths;

                // Remove all current options.
                const optionCount = monthCombo.options.length - 1;
                for (let i = optionCount; i >= 0; i -= 1) {
                  monthCombo.remove(i);
                }

                // Determine if the selected option is available in the new list.
                let lowVal = monthCombo.granule.selectedMonthIndex;
                let highVal = 0;

                months.forEach((month) => {
                  if (month.value < lowVal) lowVal = month.value;
                  if (month.value > highVal) highVal = month.value;
                  const htmlOption = document.createElement('option');
                  htmlOption.value = month.value;
                  const text = document.createTextNode(month.text);
                  htmlOption.appendChild(text);
                  monthCombo.appendChild(htmlOption);
                });

                let selectedValue = monthCombo.granule.selectedMonthIndex;
                if (selectedValue < lowVal) selectedValue = lowVal;
                if (selectedValue > highVal) selectedValue = highVal;

                monthCombo.granule.setSelectedMonthIndex(selectedValue, true);
                monthCombo.selectedIndex = monthCombo.granule.selectedMonthIndex;
                monthCombo.picker.updateValue();
              },
              monthCombo
            );
            return false;
          }
          return true;
        },
      });
    },

    /**
     * Creates the `select` element and sets the options/styles.
     * @param picker
     * @param id
     * @param layerId
     * @returns {HTMLElement}
     */
    getMonthCombo(picker, id, layerId): HTMLElement {
      const monthCombo = document.createElement('select');

      // Get the granule based on the layerId
      const g = globalThis.App.Layers._granules.get(layerId);

      // Get the selectable months from the granule.
      const months = g.selectableMonths;

      // create an <option> tag for each month
      months.forEach((month) => {
        const htmlOption = document.createElement('option');
        htmlOption.value = month.value;
        const text = document.createTextNode(month.text);
        htmlOption.appendChild(text);
        monthCombo.appendChild(htmlOption);
      });

      monthCombo.setAttribute('style', 'width: 115px; height: 25px; margin: 0 5px;');
      monthCombo.setAttribute('id', id);
      monthCombo.setAttribute('class', 'periodicityCombo');
      return monthCombo;
    },
  },

  // Not used by any projects.
  monthSpinner: {
    getMonthSpinner(picker) {
      const periodicityWrapper = globalThis.App.Periodicity.getPeriodicityWrapperById(picker.layerId);
      const monthPeriod = periodicityWrapper.periodicity.getChildPeriodByName('month');
      // const optionsPerParent = monthPeriod.getOptionsPerParent();
      const { months } = globalThis.App.Config.sources.periods[periodicityWrapper.type];

      const customSpinner = Ext.ComponentQuery.query('customspinner');
      if (customSpinner.length === 0) {
        this.createCustomSpinner();
      }

      const monthSpinner = Ext.create('widget.customspinner', {
        picker,
        periodicity: monthPeriod,
        margin: '0 5 0 5',
        editable: false,
        name: 'month',
        value: monthPeriod.formatSelection('label'),
        data: months,
        width: 115,
      });

      monthPeriod.registerEvent('selectionChange', monthSpinner, function (selection) {
        monthSpinner.setValue(selection.text);
        monthSpinner.picker.updateValue();
      });

      monthPeriod.registerEvent('optionsChange', monthSpinner, function (options) {
        const selectedValue = {
          value: monthSpinner.periodicity.selectedPeriod,
          text: monthSpinner.periodicity.formatSelection('label'),
        };

        const lowVal = {
          value: monthSpinner.periodicity.start,
          text: monthSpinner.periodicity.formatSelection('label'),
        };
        const highVal = {
          value: 0,
          text: '',
        };

        options.forEach((option) => {
          if (option.value < lowVal.value) {
            lowVal.value = option.value;
            lowVal.text = option.text;
          }
          if (option.value > highVal.value) {
            highVal.value = option.value;
            highVal.text = option.text;
          }
        });

        if (selectedValue.value < lowVal.value) {
          selectedValue.value = lowVal.value;
          selectedValue.text = lowVal.text;
        }
        if (selectedValue.value > highVal.value) {
          selectedValue.value = highVal.value;
          selectedValue.text = highVal.text;
        }

        monthSpinner.minValue = lowVal.text;
        monthSpinner.highValue = highVal.text;
        monthSpinner.setValue(selectedValue.text);
        monthSpinner.periodicity.selectedPeriod = selectedValue.value;
        monthSpinner.picker.updateValue();
      });

      return monthSpinner;
    },
    createCustomSpinner() {
      Ext.define('Ext.ux.CustomSpinner', {
        extend: 'Ext.form.field.Spinner',
        alias: 'widget.customspinner',
        onSpinUp() {
          const period = this.periodicity;
          if (period.hasNext(period.title)) {
            period.setSelectedPeriod(period.selectedPeriod + 1);
          } else if (period.parentPeriod !== null && period.parentPeriod.hasNext(period.parentPeriod.title)) {
            period.parentPeriod.setSelectedPeriod(period.parentPeriod.selectedPeriod + 1);
            period.selectFirst(period.title);
            period.parentPeriod.callEvents('selectionChange', {
              value: period.parentPeriod.selectedPeriod,
              text: period.parentPeriod.formatSelection('label'),
            });
          }
          period.callEvents('selectionChange', {
            value: period.selectedPeriod,
            text: period.formatSelection('label'),
          });
          globalThis.App.Layers.updateLayerAttributes(this.picker.layerId);
          this.picker.updateValue();
        },
        onSpinDown() {
          const period = this.periodicity;
          if (period.hasPrev(period.title)) {
            period.setSelectedPeriod(period.selectedPeriod - 1);
          } else if (period.parentPeriod !== null && period.parentPeriod.hasPrev(period.parentPeriod.title)) {
            period.parentPeriod.setSelectedPeriod(period.parentPeriod.selectedPeriod - 1);
            period.selectLast(period.title);
            period.parentPeriod.callEvents('selectionChange', {
              value: period.parentPeriod.selectedPeriod,
              text: period.parentPeriod.formatSelection('label'),
            });
          }
          period.callEvents('selectionChange', {
            value: period.selectedPeriod,
            text: period.formatSelection('label'),
          });
          period.callChildEvents('optionsChange');
          globalThis.App.Layers.updateLayerAttributes(this.picker.layerId);
          this.picker.updateValue();
        },
      });
    },
  },

  /**
   * namespace to hold all methods for creating the year select box.
   * Since the year is at the top of the periodicity, we don't need to
   * worry about the available options changing.
   */
  yearCombo: {
    registerEvents(picker, id, layerId): void {
      Ext.TaskManager.start({
        interval: 100,
        run() {
          const yearCombo: any = document.getElementById(id);

          if (yearCombo) {
            // Get the granule for the layer
            const g = globalThis.App.Layers._granules.get(layerId);

            // Set the defaults for the combo box.
            yearCombo.granule = g;
            yearCombo.picker = picker;
            yearCombo.selectedIndex = g.selectedYearIndex;

            yearCombo.onchange = function () {
              (this.granule as Granule).setSelectedYearIndex(this.selectedIndex);
              globalThis.App.Layers.updateLayerAttributes(layerId);

              // need to update selectableMonths based on year
              // need to generate available intervals based on selected year and selected month
              this.picker.updateValue();
            };

            g.events.registerCallbackForEvent(
              'selectionChange',
              function () {
                yearCombo.selectedIndex = yearCombo.granule.selectedYearIndex;
              },
              yearCombo
            );

            return false;
          }
          return true;
        },
      });
    },
    getYearCombo(picker, id, layerId): HTMLSelectElement {
      const yearCombo = document.createElement('select');
      const g = globalThis.App.Layers._granules.get(layerId);
      let years = g.selectableYears;

      // Remove the following year for 3-months if selectableMonths contains cross-year options
      // The extra year is there because the granule_end is in that year.
      if (
        g.periodType === '3month' && // fail-fast
        !g.getIntervalsInYear(g.selectableYears[g.selectableYears.length - 1]?.text).length &&
        (g.selectableMonths.find((m) => m.text === 'Nov-Dec-Jan') || g.selectableMonths.find((m) => m.text === 'Dec-Jan-Feb'))
      ) {
        years = years.slice(0, -1);
      }

      years.forEach((year) => {
        const htmlOption = document.createElement('option');
        htmlOption.value = year.value;
        const text = document.createTextNode(year.text);
        htmlOption.appendChild(text);
        htmlOption.appendChild(text);
        yearCombo.appendChild(htmlOption);
      });

      yearCombo.setAttribute('style', 'width: 65px; height: 25px; margin: 0 5px;');
      yearCombo.setAttribute('id', id);
      yearCombo.setAttribute('class', 'periodicityCombo');

      return yearCombo;
    },
  },
  periodCombo: {
    registerEvents(picker, id) {
      const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
      const layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
      const layerId = layer.id;

      Ext.TaskManager.start({
        interval: 100,
        run() {
          const periodCombo = document.getElementById(id);

          if (periodCombo) {
            const granule = globalThis.App.Layers._granules.get(layerId);
            const periodicityWrapper = globalThis.App.Periodicity.getPeriodicityWrapperById(layerId);
            const period = periodicityWrapper.periodicity.getChildPeriodByName('period');
            periodCombo.setAttribute('granule', granule);
            periodCombo.setAttribute('picker', picker);
            periodCombo.setAttribute('selectedIndex', period.getSelectedIndex());

            period.onchange = function () {
              this.periodicity.setSelectedPeriod(parseInt(this.options[this.selectedIndex].value, 10));
              globalThis.App.Layers.updateLayerAttributes(layerId);
              this.picker.updateValue();
            };

            period.registerEvent('selectionChange', period, function () {
              period.selectedIndex = period.periodicity.getSelectedIndex();
            });

            period.registerEvent('optionsChange', period, function () {
              let selectedValue = parseInt(period.options[period.selectedIndex].value, 10);
              const options = period.periodicity.getOptionsPerParent();
              const { length } = period.options;
              for (let i = length - 1; i >= 0; i -= 1) {
                period.remove(i);
              }

              let lowVal = period.periodicity.start;
              let highVal = 0;

              options.forEach((option) => {
                if (option.value < lowVal) lowVal = option.value;
                if (option.value > highVal) highVal = option.value;
                const htmlOption = document.createElement('option');
                htmlOption.value = option.value;
                const text = document.createTextNode(option.text);
                htmlOption.appendChild(text);
                period.appendChild(htmlOption);
              });

              if (selectedValue < lowVal) selectedValue = lowVal;
              if (selectedValue > highVal) selectedValue = highVal;

              // period.periodicity.selectedPeriod = parseInt(selectedValue, 10);
              period.periodicity.selectedPeriod = selectedValue;
              period.selectedIndex = period.periodicity.getSelectedIndex();
              period.picker.updateValue();
            });
            return false;
          }
          return true;
        },
      });
    },
    getPeriodCombo(picker, id, layerId) {
      const period = globalThis.App.Periodicity.getPeriodicityWrapperById(layerId).periodicity.getChildPeriodByName('period');

      const granule = globalThis.App.Layers._granules.get(layerId);
      const periodCombo = document.createElement('select');
      const options = granule.getIntervalsWithinSelectedMonthYear();

      options.forEach((option) => {
        const htmlOption = document.createElement('option');
        htmlOption.value = option.value;
        const text = document.createTextNode(option.text);
        htmlOption.appendChild(text);
        periodCombo.appendChild(htmlOption);
      });

      periodCombo.setAttribute('style', 'width: 115px; height: 25px; margin: 0 5px;');
      // periodCombo.style = 'width: 115px; height: 25px; margin: 0 5px;';
      periodCombo.setAttribute('id', id);
      periodCombo.setAttribute('class', 'periodicityCombo');
      return periodCombo;
    },
  },
  yearSpinner: {
    getYearSpinner(picker) {
      const customSpinner = Ext.ComponentQuery.query('customspinner');
      if (customSpinner.length === 0) {
        this.monthSpinner.createCustomSpinner();
      }

      const yearPeriod = globalThis.App.Periodicity.getPeriodicityWrapperById(picker.layerId).periodicity.getChildPeriodByName('year');
      const savedSelection = yearPeriod.selectedPeriod;

      // Get the granule based on the layerId
      const g = globalThis.App.Layers._granules.get(picker.layerId);

      yearPeriod.selectedPeriod = 1;
      // const minPeriod = yearPeriod.formatLabel();
      yearPeriod.selectedPeriod = yearPeriod.end;
      // const maxPeriod = yearPeriod.formatLabel();
      yearPeriod.selectedPeriod = savedSelection;

      const yearSpinner = Ext.create('widget.customspinner', {
        picker,
        periodicity: yearPeriod,
        granule: g,
        editable: false,
        margin: '0 5 0 5',
        anchor: '100%',
        name: 'year',
        value: g.getYearOfActiveInterval(),
        width: 65,
      });

      g.events.registerCallbackForEvent(
        'selectionChange',
        function (selection) {
          yearSpinner.setValue(selection.text);
          yearSpinner.picker.updateValue();
        },
        yearSpinner
      );

      return yearSpinner;
    },
  },

  /**
   * This creates the button that goes back one period.
   */
  previousBtn: {
    getPreviousBtn(picker) {
      const prevBtn = Ext.create('Ext.button.Button', {
        picker,
        cls: 'cal-button',
        iconCls: 'x-tbar-page-prev fa fa-chevron-left',
        handler() {
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
          const layerId = layer.id;

          // Get the granule
          const granule = globalThis.App.Layers._granules.get(layerId);

          // Move back one interval if it's not already set to the first available period.
          granule.prev();
          globalThis.App.Layers.updateLayerAttributes(layerId);
          this.picker.updateValue();
        },
      });

      return prevBtn;
    },
  },

  /**
   * This creates the button that goes forward one period.
   */
  nextBtn: {
    getNextBtn(picker) {
      const nextBtn = Ext.create('Ext.button.Button', {
        picker,
        cls: 'cal-button',
        iconCls: 'x-tbar-page-next  fa fa-chevron-right',
        handler() {
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
          const layerId = layer.id;
          // Move forward one interval if it's not already set to the last available period.
          const granule = globalThis.App.Layers._granules.get(layerId);
          granule.next();
          globalThis.App.Layers.updateLayerAttributes(layerId);
          this.picker.updateValue();
        },
      });

      return nextBtn;
    },
  },

  /**
   * Namespace to hold the methods for creating periodic buttons on the date picker.
   */
  customCalendar: {
    getComboBox(picker) {
      this.picker = picker;
      this.periodicity = globalThis.App.Periodicity.getPeriodicityWrapperById(this.picker.layerId).periodicity.getChildPeriodByName('period');
    },

    /**
     * Generates the container to hold the periodic buttons.
     */
    getCustomCalendar(picker, layerId) {
      this.pdBtnWidth = 40;
      const pdColumns = 4;
      this.picker = picker;
      const granule = globalThis.App.Layers._granules.get(layerId);
      const periodicBtns = this.generatePeriodicBtns(this.picker, layerId);

      const customCalendarItem = Ext.create('Ext.container.Container', {
        id: 'customCalendar',
        picker: this.picker,
        cls: 'center-buttons',
        layout: {
          type: 'table',
          columns: pdColumns,
          tdAttrs: {
            style: 'padding: 5px 2.5px;',
          },
        },
        defaults: {
          enableToggle: true,
        },
        items: periodicBtns,
      });

      this.customCalendarItem = customCalendarItem;

      // Toggle the buttons when the year changes.
      if (granule !== null) {
        granule.events.registerCallbackForEvent(
          'selectionChange',
          function (selection, customCalendar) {
            const periodicBtns = customCalendar.customCalendarItem.query('button');

            // Because generatePeriodicBtns pads the intervals if they're missing, we can't rely
            // on the selectedSelectableIntervalIndex property to equal the button's value since the value
            // is derived from its index in the periodicBtns array.
            // To get around this, we filter out the disabled buttons, then by using the selectedSelectableIntervalIndex
            // to get the index of the correct button.
            const toggleableBtns = periodicBtns.filter((btn) => btn.disabled === false);
            if (!toggleableBtns.length) return;
            toggleableBtns[(selection as Granule).selectedSelectableIntervalIndex].toggle(true);
          },
          this
        );

        // Regenerate the buttons when the month changes
        granule.events.registerCallbackForEvent(
          'optionsChange',
          function (evtObj, customCalendar, granule) {
            customCalendar.customCalendarItem.removeAll();
            customCalendar.customCalendarItem.add(globalThis.App.Tools.customCalendar.generatePeriodicBtns(customCalendar.picker, layerId));
            customCalendar.customCalendarItem.doLayout();
            globalThis.App.Layers.updateLayerAttributes(layerId);
            customCalendar.picker.updateValue();
          },
          this
        );
      }

      return [customCalendarItem];
    },

    generatePeriodicBtns(picker, layerId) {
      const periodicBtns = [];

      const granule = globalThis.App.Layers._granules.get(layerId);
      const periodsConfig = globalThis.App.Config.sources.periods[granule.periodType];

      // Hide interval buttons on 1-month, 2-month, 3-month and year since there is only 1 button
      if (granule && !granule.periodType.endsWith('month') && granule.periodType !== 'year') {
        let intervalsInMonth = getPeriodsPerMonth(granule);
        const intervals: Array<Record<string, string>> = granule.getIntervalsWithinSelectedMonthYear();
        const selectedSelectableIndex = granule.selectedSelectableIntervalIndex;

        // Code for inserting the correct offset of intervals for months that don't contain the full month
        // Ex. Fire Danger WFPI starts Apr. 29th, 2019, so instead of D1 and D2 being selectable, we want D29 and D30 selectable.
        if (intervals.length > intervalsInMonth) intervalsInMonth = intervals.length;
        const offset = intervalsInMonth - intervals.length;

        // Function for determining if a button is disabled.
        let isDisabled = (i) => i > intervals.length;

        if (granule.periodType === 'week' || granule.periodType === 'firedanger_week') {
          const startDay = parseISO(first(intervals).start).getDate();
          if (startDay > 7) {
            isDisabled = (i) => i <= offset;
          } else {
            isDisabled = (i) => i > intervalsInMonth - offset;
          }
        }

        if (granule.periodType === 'day') {
          const startDay = parseISO(first(intervals).start).getDate();
          const endDay = parseISO(last(intervals).start).getDate();
          // everything prior to this startDay and after this endDay should be disabled
          isDisabled = (i) => i < startDay || i > endDay;
        }

        let val = -1;
        // eslint-disable-next-line no-return-assign
        const incVal = (): number => (val += 1);
        for (let i = 1; i <= intervalsInMonth; i += 1) {
          const obj = {
            id: `button${i}`,
            picker,
            xtype: 'button',
            text: `${periodsConfig.shortName}${i}`,
            value: isDisabled(i) ? null : incVal(),
            pressed: undefined,
            enableToggle: true,
            disabled: isDisabled(i),
            toggleGroup: 'periods',
            tooltip: `${periodsConfig.fullName}-${i}`,
            width: this.pdBtnWidth,
            handler() {
              // onClick handler for buttons
              const granule = globalThis.App.Layers._granules.get(layerId);
              granule.selectedSelectableIntervalIndex = this.value;
              granule.updateActiveInterval();
              globalThis.App.Layers.updateLayerAttributes(layerId);
              this.picker.updateValue();
            },
          };
          obj.pressed = obj.value === selectedSelectableIndex;
          periodicBtns.push(obj);
        }
        granule.selectedSelectableIntervalIndex = selectedSelectableIndex;
      }

      return periodicBtns;
    },
  },
  datePicker: {
    /**
     * In the original TOC, we used to show a date picker for each layer inside the TOC itself.
     * I don't think it's used anymore by any of the projects.
     */
    defineDatePickerColumn() {
      Ext.define('datePicker.Column', {
        extend: 'Ext.grid.column.Column',
        alias: 'widget.datePickerColumn',
        renderer(value, p, record) {
          const containerId = Ext.id();
          let container = `<div id="${containerId}"></div>`;
          const granule = globalThis.App.Layers._granules.get(record.data.id);

          if (granule && record.data.timeSeriesSelected !== '' && typeof record.data.timeSeriesSelected !== 'undefined') {
            if (granule.getIntervalsWithinSelectedMonthYear().length) {
              const datePicker = Ext.create('widget.periodic', {
                delayedRenderTo: containerId,
                layerId: record.data.id,
                value: record.data.timeSeriesSelected,
              });
            } else {
              container = `<div id="${containerId}">${record.data.timeSeriesSelected}</div>`;
            }
          }

          return container;
        },
      });
    },

    /**
     * Defines the Extjs override for a date picker.
     */
    defineDatePicker() {
      this.defineDatePickerColumn();

      Ext.define('Periods.view.periodPicker', {
        extend: 'Ext.form.field.Picker',
        alias: 'widget.periodic',
        width: 130,
        componentType: 'datePicker',
        triggerCls: 'x-form-date-trigger',
        xtype: 'toggle-buttons',

        /**
         * Handles showing and hiding the calendar button in the toolbar.
         * @param newLayerConfig
         */
        layersConfigUpdated(newLayerConfig) {
          const topLayer = globalThis.App.Layers.getTopLayer(newLayerConfig.overlays);

          // Show/hide the calendar button if the top layer has a timeseries property
          if (topLayer && topLayer.timeseries) {
            const granule = globalThis.App.Layers._granules.get(topLayer.id);

            if (granule.getIntervalsWithinSelectedMonthYear().length) {
              this.show();
            } else {
              this.hide();
            }
          } else {
            this.hide();
          }

          /* if (this.owningToolbar) {
                          let toolbar = this.owningToolbar;
                          let menuItems = toolbar.layout.overflowHandler.menu.items.items;

                          for (let i = 0, len = menuItems.length; i < len; i+=1) {
                              let menuItem = menuItems[i];
                              if (menuItem instanceof Periods.view.periodPicker) {
                                  //menuItem.layerId = topLayer.id;
                                  menuItem.setLayerId(topLayer.id);
                console.log(menuItem);
                console.log(menuItem.id);
                              }
                          }
                      } */
        },

        shouldUsePeriodicButtons() {
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
          if (layer && layer.timeseries && layer.timeseries.type === 'day') {
            return true;
          }
          return true;
        },

        initComponent(...args) {
          if (this.delayedRenderTo) {
            this.delayRender();
          }

          // @ts-ignore
          (Ext.form.field.Picker || Picker).callParent.apply(this, args);
        },

        /**
         * Make sure the container exists before rendering.
         */
        delayRender() {
          Ext.TaskManager.start({
            scope: this,
            interval: 100,
            run() {
              const container = Ext.fly(this.delayedRenderTo);

              if (container) {
                this.render(container);
                return false;
              }
              return true;
            },
          });
        },

        updateValue() {
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
          const newValue = buildLayerGranuleName(layer);

          this.setValue(newValue);
        },

        /**
         * Override the createPicker method to return our own custom date picker window.
         */
        createPicker() {
          const { pickerType } = this;
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
          const layerId = layer.id;
          const granule = globalThis.App.Layers._granules.get(layerId);

          this.pdWindowHeight = '30';
          this.pdColumns = granule === null || granule?.periodType === 'year' ? 1.85 : 6;
          this.pdBtnWidth = 30;
          this.pdWindowWidth = this.pdBtnWidth * (this.pdColumns + 3);

          this.itemsPerMonth = granule === null ? 0 : getPeriodsPerMonth(granule);
          if (this.itemsPerMonth !== 0) {
            this.pdWindowHeight =
              this.pdBtnWidth * (Math.ceil(this.itemsPerMonth / this.pdColumns) + 1) + 4 * (Math.ceil(this.itemsPerMonth / this.pdColumns) + 1);
          }
          const shouldUsePeriodicButtons = this.shouldUsePeriodicButtons();

          if (pickerType === 'spinners') {
            const columns = shouldUsePeriodicButtons === true ? 2 : 1;
            this.yearMonthContainer = Ext.create('Ext.container.Container', {
              layout: {
                type: 'table',
                columns,
              },
              width: 250,
            });
          } else if (pickerType === 'combobox') {
            this.yearMonthContainer = Ext.create('Ext.container.Container', {
              width: 250,
            });
          }

          this.subMonthContainer = Ext.create('Ext.container.Container', {
            items: [],
          });

          // Create the window to use for the date picker.
          const periodWindow = Ext.create('Ext.window.Window', {
            wrapper: this,
            title: 'Select Period',
            height: 'auto',
            // minHeight: this.pdWindowHeight,
            width: this.pdWindowWidth,
            minWidth: this.pdWindowWidth,
            closable: false,
            header: false,
            style: {
              border: 'solid 1px #ccc;',
            },
            xtype: 'toggle-buttons',
            layout: {
              type: 'table',
              columns: 3,
            },
            bodyStyle: 'padding: 5px 10px 5px 10px;',
            items: [
              {
                xtype: 'container',
                width: 25,
                items: [globalThis.App.Tools.previousBtn.getPreviousBtn(this)],
              },
              {
                xtype: 'container',
                width: granule === null || granule?.periodType === 'year' ? 75 : 205,
                items: [this.yearMonthContainer, this.subMonthContainer],
              },
              {
                xtype: 'container',
                width: 25,
                items: [globalThis.App.Tools.nextBtn.getNextBtn(this)],
              },
            ],
            listeners: {
              /**
               * We need to completely remove all items when the date picker is hidden and add them
               * back in when it's shown because Extjs has a serious problem with layout if we leave them in.
               */
              hide() {
                this.wrapper.yearMonthContainer.removeAll();
                this.wrapper.subMonthContainer.removeAll();
              },

              beforeshow() {
                const instanceId = globalThis.App.Layers.getConfigInstanceId();
                const layersConfig = globalThis.App.Layers.getLayersConfigById(instanceId);
                const layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
                const layerId = layer.id;

                // update Layers._granules with the instance of the new id
                // Fix for rare window focus bug where the datepicker would show without focusing the window
                // first, which caused the datepicker of the second window to display the wrong date
                globalThis.App.Layers._granules = globalThis.App.Layers.granuleInstances.get(instanceId);
                const granule = globalThis.App.Layers._granules.get(layerId);

                if (granule === null) return false;

                if (pickerType === 'combobox') {
                  this.createCombos(layerId);
                } else if (pickerType === 'spinners') {
                  this.createSpinners();
                }

                const { subMonthContainer } = this.wrapper;
                if (this.wrapper.shouldUsePeriodicButtons() === true) {
                  subMonthContainer.add(globalThis.App.Tools.customCalendar.getCustomCalendar(this.wrapper, layerId));
                } else {
                  this.createPeriodCombo();
                }

                this.doLayout();
              },
            },

            createPeriodCombo() {
              const { subMonthContainer } = this.wrapper;
              const periodId = `period-combo-${getRandomString(32, 36)}`;

              const periodCombo = globalThis.App.Tools.periodCombo.getPeriodCombo(this.wrapper, periodId, layerId);

              const comboDiv = document.createElement('div');
              comboDiv.appendChild(periodCombo);
              subMonthContainer.update(comboDiv.outerHTML);
              globalThis.App.Tools.periodCombo.registerEvents(this.wrapper, periodId);
            },

            /**
             * Create the month/year dropdown boxes
             * @param layerId
             */
            createCombos(layerId) {
              const { yearMonthContainer } = this.wrapper;
              const yearId = `year-combo-${getRandomString(32, 36)}`;

              const yearCombo = globalThis.App.Tools.yearCombo.getYearCombo(this.wrapper, yearId, layerId);

              const comboDiv = document.createElement('div');
              comboDiv.appendChild(yearCombo);
              globalThis.App.Tools.yearCombo.registerEvents(this.wrapper, yearId, layerId);

              if (granule !== null && granule.periodType !== 'year') {
                const monthId = `month-combo-${getRandomString(32, 36)}`;
                const monthCombo = globalThis.App.Tools.monthCombo.getMonthCombo(this.wrapper, monthId, layerId);
                comboDiv.appendChild(monthCombo);
                globalThis.App.Tools.monthCombo.registerEvents(this.wrapper, monthId, layerId);
              }

              yearMonthContainer.update(comboDiv.outerHTML);
            },

            createSpinners() {
              const { yearMonthContainer } = this.wrapper;
              const yearSpinner = globalThis.App.Tools.yearSpinner.getYearSpinner(this.wrapper);
              yearMonthContainer.add(yearSpinner);

              const monthSpinner = globalThis.App.Tools.monthSpinner.getMonthSpinner(this.wrapper);
              yearMonthContainer.add(monthSpinner);
            },
          });

          return periodWindow;
        },
      });
    },

    getWindowHeight(itemsPerMonth) {
      this.pdColumns = 6;
      this.pdBtnWidth = 30;

      if (globalThis.App.Periodicity.itemsPerMonth !== 0) {
        this.pdWindowHeight = this.pdBtnWidth * (Math.ceil(itemsPerMonth / this.pdColumns) + 1) + 4 * (Math.ceil(itemsPerMonth / this.pdColumns) + 1);
      }

      return this.pdWindowHeight;
    },
  },

  /**
   * Namespace for defining an ExtJS panel for an OpenLayers map.
   */
  OpenLayers: {
    defineOpenLayers() {
      Ext.define('OpenlayersPanel', {
        extend: 'Ext.panel.Panel',
        map: null,
        layout: 'fit',

        activeDataQueryComponent: '',

        createControlBar(options, map) {
          const { controls, position, ..._options } = options;
          const mainBar = new Bar(_options);
          mainBar.setPosition(position);
          controls.forEach((control) => {
            if (!control) return;
            const item = this.getControl(control, map);
            if (item) mainBar.addControl(item);
          });
          return mainBar;
        },

        createNotificationPanel(options, map) {
          const { controls, ..._options } = options;

          const html = document.createElement('div');

          if (_options.header) html.innerHTML += _options.header;

          controls.forEach((control) => {
            if (!control) return;
            const item = this.getControl(control, map);
            if (item) {
              if (Array.isArray(item)) {
                item.forEach((i) => {
                  if (typeof i === 'object') html.appendChild(i);
                  else if (typeof i === 'string') html.innerHTML += i;
                });
              } else {
                html.appendChild(item);
              }
            }
          });

          const notification = new Notification({}, _options.className, true, true);

          map.addControl(notification);

          const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');

          const toggle = new Toggle({
            html: '<i class="fa fa-calendar"></i>',
            className: 'datePicker',
            title: 'Date Picker',
            // autoActivate: options.active ?? false,
            onToggle(): void {
              // Activate the window on button click
              mapWindowBlock.component.fireEvent('activate');

              if (this.getActive()) {
                notification.show(html, -1); // (whatToShow, howLongToShow) where -1 means 'forever'
              } else notification.hide();
            },
          });

          // Create an event listener on the map panel to activate the Toggle button + Notification
          const mapPanelBlock = this.extendedTool.owningBlock;
          mapPanelBlock.on(
            'rendercomponent',
            function (callbackObj, postingObj, eventObj) {
              if (options.active) {
                // Set the toggle button to active
                toggle.setActive(options.active);
                // Show the notification popup
                notification.show(html, -1);
              }
            },
            this
          );

          return toggle;
        },

        getOverlayMenu(options, map) {
          const { controls, ..._options } = options;
          const html = document.createElement('div');
          if (_options.header) html.innerHTML += _options.header;

          controls.forEach((control) => {
            if (!control) return;
            const item = this.getControl(control, map);
            if (item) {
              if (Array.isArray(item)) {
                item.forEach((i) => {
                  if (typeof i === 'object') html.appendChild(i);
                  else if (typeof i === 'string') html.innerHTML += i;
                });
              } else {
                html.appendChild(item);
              }
            }
          });

          const menu = new Overlay({
            closeBox: true,
            className: 'slide-left menu',
            content: html,
          });

          const instanceId = globalThis.App.Layers.getConfigInstanceId();
          menu.element.id = `mapOverlay-${instanceId}`;

          if (_options.width) {
            menu.element.style.width = _options.width;
          }

          menu.on('change:visible', (ev) => {
            // Adjust the map controls on the left so they remain visible when the overlay menu is open.
            const closedStyle = '0.5em';

            // Determine the offset for the controls
            const overlay = document.getElementById(`mapOverlay-${instanceId}`);
            const style = overlay.style.width;
            const value = style.match(/(\d+)/g)[0];
            const suffix = style.slice(value.length);

            const openStyle = `${parseInt(value) + 1}${suffix}`;

            // Get an array of all the map controls
            const mapControls = map
              .getControls()
              .getArray()
              .map((control) => control.element);

            const leftControls = mapControls.filter((control) => control.classList.contains('ol-left'));
            const zoomControl = mapControls.filter((control) => control.classList.contains('ol-zoom'));
            const mousePositionControl = mapControls.filter((control) => control.classList.contains('ol-mouse-position'));

            if (ev.visible) {
              if (leftControls.length) {
                for (const control of leftControls) {
                  control.style.left = openStyle;
                }
              }
              if (zoomControl.length) {
                for (const control of zoomControl) {
                  control.style.left = openStyle;
                }
              }
              if (mousePositionControl.length) {
                for (const control of mousePositionControl) {
                  control.style.left = openStyle;
                }
              }
            } else {
              if (leftControls.length) {
                for (const control of leftControls) {
                  control.style.left = closedStyle;
                }
              }
              if (zoomControl.length) {
                for (const control of zoomControl) {
                  control.style.left = closedStyle;
                }
              }
              if (mousePositionControl.length) {
                for (const control of mousePositionControl) {
                  control.style.left = closedStyle;
                }
              }
            }
          });

          let title = 'Dataset Explorer';
          let menuIcon = 'fa-bars';

          if (globalThis.App.OpenLayers.controls['date-picker'].altTitle) {
            title = globalThis.App.OpenLayers.controls['date-picker'].altTitle;
            menuIcon = 'fa-calendar';
          }

          const menuToggleControl = new Toggle({
            html: `<i class="fa ${menuIcon}"></i>`,
            className: 'menu',
            title,
            onToggle(): void {
              menu.toggle();
            },
          });

          return [menu, menuToggleControl];
        },

        /**
         * Function that returns HTML elements for the map overlay control
         * @param control
         * @returns {any}
         */
        // getOverlayControl(control, map) {
        //   const name = typeof control === 'string' ? control : control?.name;
        //   const options = typeof control === 'string' ? null : control?.options ?? {};
        //   const controls = typeof control === 'string' ? null : control?.controls ?? [];
        //
        //   if (objPropExists(globalThis.App.OpenLayers.controls, name)) {
        //     return globalThis.App.OpenLayers.controls[name]({
        //       map,
        //       controls,
        //       options,
        //     });
        //   }
        //
        //   return null;
        //
        //   // switch (name) {
        //   //   case 'dataset-explorer':
        //   //     return this.getDataSetExplorer();
        //   //   case 'date-picker':
        //   //     return this.getDatePicker(map);
        //   //   default:
        //   //     return null;
        //   // }
        // },

        /**
         * Function that returns a OpenLayers map control
         * @param control
         * @param map
         * @returns {[ol_control_Overlay, ol_control_Toggle] | ol_control_Button | ol_control_Toggle | null | ZoomToExtent | ol_control_Legend | ol_control_Bar}
         */
        getControl(control, map) {
          const name = typeof control === 'string' ? control : control?.name;
          const options = typeof control === 'string' ? null : control?.options ?? {};
          const position = typeof control === 'string' ? null : control?.position ?? 'top-left';
          const controls = typeof control === 'string' ? null : control?.controls ?? [];

          if (objPropExists(globalThis.App.OpenLayers.controls, name)) {
            return globalThis.App.OpenLayers.controls[name]({
              map,
              controls,
              options,
              position,
            });
          }

          switch (name) {
            //   case 'download':
            //     return this.getDownloadMenuButton(controls, map);
            case 'overlay':
              return this.getOverlayMenu({ ...options, controls }, map);
            case 'toolbar':
              return this.createControlBar(
                {
                  ...options,
                  position,
                  controls,
                },
                map
              );
            case 'notification':
              return this.createNotificationPanel({ ...options, controls }, map);
            default:
              return null;
          }
        },

        initComponent() {
          const { extendedTool } = this;

          // @ts-ignore
          (Ext.panel.Panel.prototype || Panel).initComponent.apply(this, arguments);

          const { blockConfig } = this.extendedTool.owningBlock;

          const viewConfigs: Dictionary = {
            center: [2309109.7504386036, 841426.3073632196],
            zoom: 4,
            minZoom: 1,
            // zoomFactor: 1.2 // OL 6.0.1 changed how zoom deltas are handled https://github.com/openlayers/openlayers/issues/3684
          };

          // If cMapPanel contains a "boundExtent" property we add it to viewConfigs to restrict what is displayed in the map
          if (objPropExists(blockConfig, 'boundExtent') && blockConfig.boundExtent !== null) {
            viewConfigs.extent = blockConfig.boundExtent;
          }

          // If cMapPanel contains a "minZoom" property we add it to viewConfigs to restrict how far user can zoom out
          if (objPropExists(blockConfig, 'minZoom') && blockConfig.minZoom !== null) {
            viewConfigs.minZoom = blockConfig.minZoom;
          }

          // If cMapPanel contains a "maxZoom" property we add it to viewConfigs to restrict how far user can zoom in
          if (objPropExists(blockConfig, 'maxZoom') && blockConfig.maxZoom !== null) {
            viewConfigs.maxZoom = blockConfig.maxZoom;
          }

          // Allow overwriting the projection and max extent from the template.json.
          if (objPropExists(blockConfig, 'projection') && blockConfig.projection !== null && blockConfig.projection !== '') {
            const projConfig: {
              code: string;
              units: string;
              [key: string]: any;
            } = {
              code: blockConfig.projection,
              units: 'm',
            };

            if (objPropExists(blockConfig, 'max_extent') && blockConfig.max_extent !== null && blockConfig.max_extent.length > 0) {
              projConfig.extent = blockConfig.max_extent;
            }
            viewConfigs.projection = new Projection(projConfig);
          }

          // Allow overwriting the center position from the template.json.
          if (objPropExists(blockConfig, 'center') && blockConfig.center !== null && blockConfig.center.length > 0) {
            viewConfigs.center = blockConfig.center;
          }

          const view = new View(viewConfigs);

          // Allow adding default interactions from template.json.
          const interactions = [];
          const interactionConfigs = blockConfig.interactions;
          if (typeof interactionConfigs !== 'undefined') {
            for (let i = 0, len = interactionConfigs.length; i < len; i += 1) {
              const interaction = interactionConfigs[i];
              switch (interaction) {
                case 'pan':
                  interactions.push(
                    new KeyboardPan({
                      condition: always,
                    })
                  );
                  interactions.push(
                    new DragPan({
                      condition: always,
                    })
                  );
                  break;
                case 'zoom':
                  interactions.push(
                    new DoubleClickZoom({
                      // condition: condition.always,
                      // delta: 5
                    })
                  );
                  interactions.push(
                    new PinchZoom({
                      // condition: condition.always,
                    })
                  );
                  interactions.push(
                    new KeyboardZoom({
                      condition: always,
                    })
                  );
                  interactions.push(
                    new MouseWheelZoom({
                      condition: always,
                    })
                  );
                  interactions.push(
                    new DragZoom({
                      condition: shiftKeyOnly,
                    })
                  );
                  break;
                default:
                  break;
              }
            }
          }

          /**
           * Set up the map controls
           */
          // Default controls
          const controls = olControlDefaults({
            attributionOptions: {
              collapsible: true,
            },
          });

          /**
           * Add to blockConfig for cMapPanel:
           * @example
           * showMouseCoordinates: {
           *   add: true,
           *   projection: 'EPSG:4326',
           * },
           */
          // Show mouse coordinates?
          if (blockConfig?.mouseCoordinates?.show) {
            const mousePositionControl = new MousePosition({
              coordinateFormat: createStringXY(4),
              projection: blockConfig.mouseCoordinates?.projection ?? 'EPSG:4326',
              undefinedHTML: '&nbsp;',
            });
            controls.extend([mousePositionControl]);
          }
          const map = globalThis.App.OpenLayers.Map({
            logo: false,
            view,
            interactions,
            controls,
          });

          // overview map for LANDFIRE
          if (blockConfig?.overviewMap) {
            const overviewMapControl = new OverviewMap({
              className: 'ol-overviewmap ol-custom-overviewmap',
              layers: [
                new TileLayer({
                  source: new OSM({
                    url: blockConfig.url,
                  }),
                }),
              ],
              collapseLabel: '\u00BB',
              label: '\u00AB',
              collapsed: true,
            });
            controls.extend([overviewMapControl]);
          }
          /**
           * Add the custom map controls from template.ts
           * This is done after the map is created because some tools require access to the map object to initialize.
           */
          if (blockConfig?.controls && Array.isArray(blockConfig.controls)) {
            blockConfig.controls
              // Get controls.
              .map((control) => this.getControl(control, map))
              .flat()
              // Remove any null/undefined controls.
              .filter((control) => control)
              // Add each control to the map.
              .forEach((control) => {
                map.addControl(control);
              });
          }

          // Override the tileLoadInitCallback for the map to mask the map on tile load.
          map.tileLoadInitCallback = function () {
            extendedTool.maskComponent();
          };

          // Override the tileLoadCompleteCallback for the map to unmask the map on tile load complete.
          map.tileLoadCompleteCallback = function () {
            extendedTool.unMaskComponent();
          };

          this.map = map;
        },
        listeners: {
          afterrender() {
            this.map.setTarget(this.body.dom);
            this.map.render();
            this.extendedTool.component = this;
            this.extendedTool.owningBlock.component = this;
            this.extendedTool.owningBlock.rendered = true;
            this.map.extendedTool = this.extendedTool;
            this.extendedTool.getReady(this);
            this.extendedTool.owningBlock.fire('rendercomponent', this.extendedTool);
          },
          resize() {
            this.map.setTarget(this.body.dom);
            this.map.updateSize();
            this.map.render();
          },
        },
      });
    },
  },

  createGridPanelHeaderCheckbox() {
    // Create Extjs overridden checkcolumn to allow a checkbox in header.
    // Source: https://github.com/twinssbc/extjs-CheckColumnPatch
    Ext.define('Ext.ux.CheckColumnPatch', {
      override: 'Ext.ux.CheckColumn',

      /**
       * @cfg {Boolean} [columnHeaderCheckbox=false]
       * True to enable check/uncheck all rows
       */
      columnHeaderCheckbox: false,

      constructor(config) {
        const me = this;

        this.superclass.constructor.apply(this, arguments);

        me.addEvents('beforecheckallchange', 'checkallchange');

        if (me.columnHeaderCheckbox) {
          me.on(
            'headerclick',
            function () {
              this.updateAllRecords();
            },
            me
          );

          me.on(
            'render',
            function (comp) {
              const grid = comp.up('grid');
              this.mon(
                grid,
                'reconfigure',
                function () {
                  if (this.isVisible()) {
                    this.bindStore();
                  }
                },
                this
              );

              if (this.isVisible()) {
                this.bindStore();
              }

              this.on('show', function () {
                this.bindStore();
              });
              this.on('hide', function () {
                this.unbindStore();
              });
            },
            me
          );
        }
      },

      onStoreDataUpdate() {
        let allChecked;
        let image;

        if (!this.updatingAll) {
          allChecked = this.getStoreIsAllChecked();
          if (allChecked !== this.allChecked) {
            this.allChecked = allChecked;
            image = this.getHeaderCheckboxImage(allChecked);
            this.setText(image);
          }
        }
      },

      getStoreIsAllChecked() {
        const me = this;
        let allChecked = true;

        // Sometimes this method get's called before the afterrender
        // callback that sets the reference to the extended tool.
        if (me.extendedTool) {
          const { featureList } = me.extendedTool;
          for (let i = 0, len = featureList.length; i < len; i += 1) {
            const feature = featureList[i];
            if (feature[1] === false) {
              allChecked = false;
              return false;
            }
          }
        } else {
          me.store.each(function (record) {
            allChecked = record.get(this.dataIndex);
            // if (!record.get(this.dataIndex)) {
            //   allChecked = false;
            //   return false;
            // }
          }, me);
        }

        return allChecked;
      },

      bindStore() {
        const me = this;
        const grid = me.up('grid');
        const store = grid.getStore();

        me.store = store;

        me.mon(
          store,
          'datachanged',
          function () {
            this.onStoreDataUpdate();
          },
          me
        );
        me.mon(
          store,
          'update',
          function () {
            this.onStoreDataUpdate();
          },
          me
        );

        me.onStoreDataUpdate();
      },

      unbindStore() {
        const me = this;
        const { store } = me;

        me.mun(store, 'datachanged');
        me.mun(store, 'update');
      },

      updateAllRecords() {
        const me = this;
        const allChecked = !me.allChecked;

        if (me.fireEvent('beforecheckallchange', me, allChecked) !== false) {
          this.updatingAll = true;
          me.store.suspendEvents();
          me.store.each(function (record) {
            record.set(this.dataIndex, allChecked);
          }, me);
          me.store.resumeEvents();
          me.up('grid').getView().refresh();
          this.updatingAll = false;
          this.onStoreDataUpdate();
          me.fireEvent('checkallchange', me, allChecked);
        }
      },

      /**
       * Get the Extjs css class for the checkbox.
       */
      getHeaderCheckboxImage(allChecked) {
        const cls = [];
        // const cssPrefix = Ext.baseCSSPrefix;
        const cssPrefix = 'x-';

        if (this.columnHeaderCheckbox) {
          allChecked = this.getStoreIsAllChecked();
          // Extjs 4.2.x css
          cls.push(`${cssPrefix}grid-checkcolumn`);
          // Extjs 4.1.x css
          cls.push(`${cssPrefix}grid-checkheader`);

          if (allChecked) {
            // Extjs 4.2.x css
            cls.push(`${cssPrefix}grid-checkcolumn-checked`);
            // Extjs 4.1.x css
            cls.push(`${cssPrefix}grid-checkheader-checked`);
          }
        }
        return `<div style="margin:auto" class="${cls.join(' ')}">&#160;</div>`;
      },
    });
  },

  /**
   * ExtJS plugin for including a Select All/Reset option for a combo box.
   */
  createSelectAllCombo() {
    Ext.define('comboSelectedCount', {
      alias: 'plugin.selectedCount',
      init(combo) {
        const fl = combo.getFieldLabel();
        const id = `${combo.getId()}-toolbar-panel`;
        let allSelected = false;
        let lastValue;

        Ext.apply(combo, {
          listConfig: {
            tpl: `<div id="${id}"></div><tpl for="."><div class="x-boundlist-item">{${combo.displayField}} </div></tpl>`,
          },
        });
        const toolbar = Ext.create('Ext.toolbar.Toolbar', {
          items: [
            {
              text: 'Select all',
              xtype: 'button',
              handler(btn, e) {
                // Store the last value for when the Reset button is clicked.
                // lastValue = combo.lastValue;
                combo.select(combo.getStore().getRange());
                allSelected = true;
                e.stopEvent();
              },
            },
            {
              text: 'Reset',
              xtype: 'button',
              handler(btn, e) {
                combo.setValue(this.defaultSelection);
                // Set the value to the last value prior to clicking Select All
                // combo.select(lastValue);
                // combo.setValue(lastValue);
                allSelected = false;
                e.stopEvent();
              },
              defaultSelection: [],
              listeners: {
                added() {
                  const { extendedTool } = combo;
                  const chartContainer = extendedTool.owningBlock.getReferencedBlock('cChartContainer');
                  chartContainer.on(
                    'datatypechanged',
                    function (callbackObj) {
                      const { combo, button } = callbackObj;
                      button.defaultSelection = combo.extendedTool.getDefaultValue();
                    },
                    { button: this, combo }
                  );
                },
              },
            },
          ],
        });
        combo.on({
          expand: {
            fn() {
              const dropdown = Ext.get(id).dom.parentElement;
              const container = Ext.DomHelper.insertBefore(dropdown, `<div id="${id}-container"></div>`, true);
              toolbar.render(container);
            },
            single: true,
          },
        });
      },
    });
  },
};
