/** cZoomToRegionTool.js
 * Zoom to region (full extent) tool to set the region (full) extent on cMapPanel
 *
 * Required Tools:
 *      cMapPanel
 *      cMapWindow
 *
 * Block Parameters:
 *      Required:
 *          name: "cZoomToRegionTool" - The name of the tool.
 *          import: The location of the tools javascript code
 *              Ex: import": "tools.shared.cZoomToRegionTool.cZoomToRegionTool"
 *          add: Boolean - Indicates whether to load this tool or not
 *
 *      Optional:
 *          title:
 *          cssClass:
 *          tooltip: Message display when the cursor is positioned over the icon tool, if not defined "Zoom To Region" is used.
 *
 */

import { getRandomString, singleDigitToDouble } from '../../../helpers/string';
import { Granule } from '../../../Granules';
import { getPeriodsPerMonth } from '../../../helpers/granule';
import { format as formatDate, parseISO } from 'date-fns';
import { first, last, sortObjects } from '../../../helpers/array';
import { getBlocksByName } from '../../../helpers/extjs';
import { LayerConfig } from 'src/@types';
import { NextGenViewer } from 'src/NextGenViewer';
import FormatType from 'ol/format/FormatType';
import { objPropExists } from '../../../helpers/object';

export const cDatePickerTool_olext = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
  },
  getComponent(extendedTool: { owningBlock: { blockConfig: any; getReferencedBlock: (arg0: string) => any } }, items: any, toolbar: any, menu: any) {
    const block = extendedTool.owningBlock.blockConfig;
    const getDatePicker = ({ map }) => {
      const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');

      const getPeriodicityButtons = (instanceId: string): Array<HTMLElement> => {
        const buttonContainer = document.getElementById(`periodicContainer-${instanceId}`);
        const buttonHTMLCollection = buttonContainer.children;
        return Array.from(buttonHTMLCollection) as Array<HTMLElement>;
      };
      const getPressedButton = (instanceId: string): HTMLElement => {
        const buttonArray = getPeriodicityButtons(instanceId);
        // @ts-ignore
        return buttonArray.find((btn) => btn.pressed);
      };

      const colorPressedButton = (instanceId: string, btnIndex: number) => {
        const btn = getPressedButton(instanceId);
        const buttonArray = getPeriodicityButtons(instanceId);

        if (buttonArray.length && btn) {
          const newBtn: HTMLElement = buttonArray.find((btn) => btn.id === `button${btnIndex + 1}`);

          btn.style.background = '';
          // @ts-ignore
          btn.pressed = false;
          // @ts-ignore
          newBtn.pressed = true;
          colorPeriodButtons(btn, instanceId);
        }
      };

      // Color and add a tooltip to the period buttons based on the type of data we are on.
      // Example: Final data, Prelim Data or Gefs data
      const colorPeriodButtons = (button: HTMLElement, instanceId: string) => {
        const layersConfig = globalThis.App.Layers.getLayersConfigById(instanceId);
        let layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
        let layerId: any;
        if (!layer) {
          layer = globalThis.App.Layers.getTopLayer(layersConfig.hidden);
          layerId = layer?.parentGranuleName;
        } else layerId = layer.id;

        // Get the granule
        const granule = globalThis.App.Layers._granules.get(layerId);
        if (granule.activeInterval?.layerName) {
          if (granule.activeInterval.layerName.includes('prelim')) {
            button.style.background = '#7F7F7F';
            //@ts-ignore
            button.title = `${button.innerHTML} ${granule.activeInterval.label}`;
            button.style.border = '2px solid #000000';
          } else {
            button.style.background = '#f7b32b';
            //@ts-ignore
            button.title = `${button.innerHTML} ${granule.activeInterval.label}`;
            button.style.border = '2px solid #000000';
          }
        } else {
          button.style.background = '#40699C';
          //@ts-ignore
          button.title = `${button.innerHTML} Final`;
          button.style.border = '2px solid #000000';
        }
      };

      // Get the layer id of the top layer
      const getLayerId = (): string => {
        const instanceId = globalThis.App.Layers.getConfigInstanceId();
        const layersConfig = globalThis.App.Layers.getLayersConfigById(instanceId);
        let layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
        if (!layer) {
          layer = globalThis.App.Layers.getTopLayer(layersConfig.hidden);
          if (layer?.parentGranuleName) {
            // get the grunule of the parent layer
            const granule = globalThis.App.Layers._granules.get(layer.parentGranuleName);
            // check for the `label` property on the granule
            if (!granule.activeInterval?.layerName) {
              const index = granule.intervals.findIndex((element) => element.layerName === layer.additionalAttributes.rasterDataset);
              granule.setSelectedIntervalIndex(index);
              globalThis.App.Layers._granules.set(layer.parentGranuleName, granule);
            }
          }
          return layer?.parentGranuleName;
        } else return layer.id;
      };

      // Remove all options from a <select> element.
      const removeAll = (el: HTMLSelectElement): HTMLSelectElement => {
        for (let i = el.options.length; i >= 0; i -= 1) {
          el.options.remove(i);
        }

        return el;
      };

      // create an <option> tag for each option.
      const addOptions = (el: HTMLSelectElement, options: Array<{ value: string; text: string }>): HTMLSelectElement => {
        // create an <option> tag for each month
        options.forEach((opt) => {
          const htmlOption = document.createElement('option');
          htmlOption.value = opt.value;
          const text = document.createTextNode(opt.text);
          htmlOption.appendChild(text);
          el.appendChild(htmlOption);
        });

        return el;
      };

      // Determine if periodic buttons should be used.
      const shouldUsePeriodicButtons = (): boolean => {
        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);

        if (layer && layer.timeseries && layer.timeseries.type === 'day') {
          return true;
        }
        return true;
      };

      const handleDisablingButtons = (granule: Granule) => {
        const prevButton = document.getElementById(`prevButton-${mapWindowBlock.extendedTool.layersConfigId}`) as HTMLButtonElement;
        const nextButton = document.getElementById(`nextButton-${mapWindowBlock.extendedTool.layersConfigId}`) as HTMLButtonElement;

        if (granule.selectedIntervalIndex === 0) {
          prevButton.disabled = true;
          prevButton.classList.add('no-hover');
        } else {
          prevButton.disabled = false;
          prevButton.classList.remove('no-hover');
        }

        if (granule.selectedIntervalIndex === granule.intervals.length - 1) {
          nextButton.disabled = true;
          nextButton.classList.add('no-hover');
        } else {
          nextButton.disabled = false;
          nextButton.classList.remove('no-hover');
        }
      };

      const generatePeriodicButtons = (layerId: string) => {
        const periodicBtns = [];
        let granule: Granule = globalThis.App.Layers._granules.get(layerId);
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

          const getPressedButton = () => periodicBtns.find((btn) => btn.pressed);
          // get the index of the first prelim/gefs interval. All the prelim and gefs intervals have a label property
          // eslint-disable-next-line no-return-assign
          const incVal = (): number => (val += 1);
          for (let i = 1; i <= intervals.length; i += 1) {
            const button = document.createElement('button');
            button.id = `button${i}`;
            button.value = String(isDisabled(i) ? null : incVal());
            button.textContent = `${periodsConfig.shortName}${i}`;
            button.disabled = isDisabled(i);
            // @ts-ignore
            button.pressed = parseInt(button.value) === selectedSelectableIndex;

            // we need to have a border around the active button when the data type is changed.
            // For example --> Going from Data --> Anomaly
            // @ts-ignore
            if (button.pressed) {
              button.style.background = '#40699C';
              //@ts-ignore
              button.title = `${button.innerHTML} Final`;
              button.style.border = '2px solid #000000';
            }

            // if we are on virtual datasets, we need to color the buttons accordingly
            if (intervals[i - 1]?.layerName) {
              if (intervals[i - 1].layerName.includes('prelim')) {
                button.style.background = '#7F7F7F'; // based on prelim chart color
                //@ts-ignore
                button.title = `${button.innerHTML} ${intervals[i - 1].label}`;
              } else if (intervals[i - 1].layerName.includes('gefs')) {
                button.style.background = '#f7b32b'; // based on gefs chart color
                //@ts-ignore
                button.title = `${button.innerHTML} ${intervals[i - 1].label}`;
              }
            } else {
              // @ts-ignore
              button.style.background = '#40699C';
              //@ts-ignore
              button.title = `${button.innerHTML} Final`;
            }

            button.addEventListener('click', function (ev) {
              mapWindowBlock.component.fireEvent('activate');
              // onClick handler for buttons
              // Activate the window on button click
              mapWindowBlock.component.fireEvent('activate');

              granule.selectedSelectableIntervalIndex = parseInt(button.value);
              granule.updateActiveInterval();

              enableVirtualDatasetLayer(granule);

              handleDisablingButtons(granule);

              const prevPressedBtn = getPressedButton();

              prevPressedBtn.pressed = false;
              if (prevPressedBtn.title.includes('Prelim')) {
                prevPressedBtn.style.background = '#7F7F7F';
                prevPressedBtn.style.border = 'none';
              } else if (prevPressedBtn.title.includes('GEFS')) {
                prevPressedBtn.style.background = '#f7b32b';
                prevPressedBtn.style.border = 'none';
              } else {
                prevPressedBtn.style.background = '#40699C';
                prevPressedBtn.style.border = 'none';
              }
              // @ts-ignore
              this.pressed = true;
              this.style.border = '2px solid #000000';
            });
            periodicBtns.push(button);
          }
          granule.selectedSelectableIntervalIndex = selectedSelectableIndex;
        }

        return periodicBtns;
      };

      // Handles the switching of the layers based on the granule state.
      const enableVirtualDatasetLayer = (granule: Granule) => {
        // Determine if we're going from Parent to Child or vise versa
        // To do this we'll check the Granule's activeInterval to see if there's a label on it.
        // If a label exists, we know it's a child dataset. If not, it's a parent.
        const layerConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

        // Get all the active rasters so we can turn them off
        const activeRasters = globalThis.App.Layers.query(
          layerConfig,
          {
            type: 'layer',
            display: true,
            mask: false,
            loadOnly: false,
          },
          ['overlays', 'hidden']
        );

        // Turn off the displayed rasters
        for (let i = 0; i < activeRasters.length; i += 1) {
          activeRasters[i].active = false;
          activeRasters[i].display = false;
        }

        // If there is a label on the granule's active interval we know it's a virtual dataset
        if (granule.activeInterval?.layerName) {
          // Get the virtual dataset layer that's associated with the interval's `layerName` property
          const hiddenLayers = globalThis.App.Layers.query(
            layerConfig,
            (layer) => {
              return layer.additionalAttributes?.rasterDataset === granule.activeInterval?.layerName;
            },
            ['hidden']
          );

          const layerToDisplay = hiddenLayers[0];
          layerToDisplay.active = true;
          layerToDisplay.display = true;

          globalThis.App.Layers.updateLayerAttributes(layerToDisplay.id);
        } else {
          // Going from child layer to parent layer
          // We need to get the parent layer from the active hidden layer

          // Get the ID of the new layer we need to turn on
          // If the layer has a `parentGranuleName` property then we use that
          // otherwise default to the layer's ID
          const parentLayerId = activeRasters[0]?.parentGranuleName || activeRasters[0].id;

          const newLayer = globalThis.App.Layers.query(
            layerConfig,
            (layer) => {
              return layer.id === parentLayerId;
            },
            ['overlays']
          );
          newLayer[0].active = true;
          newLayer[0].display = true;

          globalThis.App.Layers.updateLayerAttributes(parentLayerId);
        }
      };

      const getPreviousButton = (granule: Granule) => {
        const button = document.createElement('button');
        button.id = `prevButton-${mapWindowBlock.extendedTool.layersConfigId}`;
        button.textContent = '<';
        button.classList.add('prevBtn');
        button.addEventListener('click', () => {
          mapWindowBlock.component.fireEvent('activate');
          // On prev click
          let layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          let layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
          let layerId;
          if (!layer) {
            layer = globalThis.App.Layers.getTopLayer(layersConfig.hidden);
            layerId = layer?.parentGranuleName;
          } else layerId = layer.id;

          // Get the granule
          const granule = globalThis.App.Layers._granules.get(layerId);
          if (!granule) return;
          granule.prev();

          enableVirtualDatasetLayer(granule);

          handleDisablingButtons(granule);

          const periodicCombo = document.getElementById(`periodicContainer-${mapWindowBlock.extendedTool.layersConfigId}`);
          Array.from(periodicCombo.children).forEach((el) => periodicCombo.removeChild(el));
          if (shouldUsePeriodicButtons()) {
            const periodicButtons = generatePeriodicButtons(layerId);

            let periodicRow = document.createElement('div');
            periodicRow.style.display = 'inline-flex';
            for (let i = 0; i < periodicButtons.length; i++) {
              if (i % 16 == 0 && i != 0) {
                periodicCombo.appendChild(periodicRow);
                periodicRow = document.createElement('div');
                periodicRow.style.display = 'inline-flex';
              }
              if (periodicButtons.length > 9) {
                periodicButtons[i].style['font-size'] = '0.8em';
              }
              periodicRow.appendChild(periodicButtons[i]);
            }
            periodicCombo.appendChild(periodicRow);
          }

          colorPressedButton(globalThis.App.Layers.getConfigInstanceId(), granule.selectedSelectableIntervalIndex);
        });

        if (granule.selectedIntervalIndex === 0) {
          button.disabled = true;
        } else {
          button.disabled = false;
        }

        return button;
      };

      const getNextButton = (granule: Granule) => {
        const button = document.createElement('button');
        button.id = `nextButton-${mapWindowBlock.extendedTool.layersConfigId}`;
        button.textContent = '>';
        button.classList.add('nextBtn');
        button.addEventListener('click', () => {
          mapWindowBlock.component.fireEvent('activate');
          // Determine which layer ID to use -- If there are no on overlay rasters, check the hidden rasters
          let layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

          let layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
          let layerId;
          if (!layer) {
            layer = globalThis.App.Layers.getTopLayer(layersConfig?.hidden);
            layerId = layer?.parentGranuleName;
          } else layerId = layer.id;

          // Get the granule
          const granule = globalThis.App.Layers._granules.get(layerId);
          if (!granule) return;
          granule.next();

          enableVirtualDatasetLayer(granule);

          handleDisablingButtons(granule);

          const periodicCombo = document.getElementById(`periodicContainer-${mapWindowBlock.extendedTool.layersConfigId}`);
          Array.from(periodicCombo.children).forEach((el) => periodicCombo.removeChild(el));
          if (shouldUsePeriodicButtons()) {
            const periodicButtons = generatePeriodicButtons(layerId);

            let periodicRow = document.createElement('div');
            periodicRow.style.display = 'inline-flex';
            for (let i = 0; i < periodicButtons.length; i++) {
              if (i % 16 == 0 && i != 0) {
                periodicCombo.appendChild(periodicRow);
                periodicRow = document.createElement('div');
                periodicRow.style.display = 'inline-flex';
              }
              if (periodicButtons.length > 9) {
                periodicButtons[i].style['font-size'] = '0.8em';
              }
              periodicRow.appendChild(periodicButtons[i]);
            }
            periodicCombo.appendChild(periodicRow);
          }

          colorPressedButton(globalThis.App.Layers.getConfigInstanceId(), granule.selectedSelectableIntervalIndex);
        });

        if (granule.selectedIntervalIndex === granule.intervals.length - 1) {
          button.disabled = true;
        } else {
          button.disabled = false;
        }

        return button;
      };

      const getYearCombo = (layerId) => {
        const yearId = `year-combo-${getRandomString(32, 36)}`;
        let yearCombo = document.createElement('select');
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

        yearCombo = addOptions(yearCombo, years);

        yearCombo.setAttribute('style', 'width: 65px; height: 25px; margin: 0 5px; display: inline-block;');
        yearCombo.setAttribute('id', yearId);
        yearCombo.setAttribute('class', 'periodicityCombo');

        // Set the defaults for the combo box.
        // @ts-ignore
        yearCombo.granule = g;
        // yearCombo.picker = picker;
        yearCombo.selectedIndex = g.selectedYearIndex;

        yearCombo.addEventListener('change', function (ev) {
          // @ts-ignore
          (this.granule as Granule).setSelectedYearIndex(this.selectedIndex);
          // globalThis.App.Layers.updateLayerAttributes(layerId);

          // @ts-ignore
          enableVirtualDatasetLayer(this.granule as Granule);

          // @ts-ignore
          handleDisablingButtons(this.granule as Granule);

          // need to update selectableMonths based on year
          // need to generate available intervals based on selected year and selected month
          if (objPropExists(yearCombo, 'monthCombo')) {
            // @ts-ignore
            addOptions(removeAll(yearCombo.monthCombo), (this.granule as Granule).getSelectableMonths());
            // @ts-ignore
            yearCombo.monthCombo.selectedIndex = this.granule.selectedMonthIndex;
          }

          if (shouldUsePeriodicButtons()) {
            const instanceId = globalThis.App.Layers.getConfigInstanceId();
            const buttonContainer = document.getElementById(`periodicContainer-${instanceId}`);
            const periodicButtons = generatePeriodicButtons(layerId);

            while (buttonContainer.firstChild) {
              buttonContainer.removeChild(buttonContainer.lastChild);
            }
            let periodicRow = document.createElement('div');
            periodicRow.style.display = 'inline-flex';
            for (let i = 0; i < periodicButtons.length; i++) {
              if (i % 16 == 0 && i != 0) {
                buttonContainer.appendChild(periodicRow);
                periodicRow = document.createElement('div');
                periodicRow.style.display = 'inline-flex';
              }
              if (periodicButtons.length > 9) {
                periodicButtons[i].style['font-size'] = '0.8em';
              }
              periodicRow.appendChild(periodicButtons[i]);
            }
            buttonContainer.appendChild(periodicRow);
          }
          //@ts-ignore
          colorPressedButton(globalThis.App.Layers.getConfigInstanceId(), this.granule.selectedSelectableIntervalIndex);
        });

        g.events.registerCallbackForEvent(
          'selectionChange',
          function () {
            // @ts-ignore
            yearCombo.selectedIndex = yearCombo.granule.selectedYearIndex;
          },
          yearCombo
        );

        return yearCombo;
      };

      const getMonthCombo = (layerId) => {
        const monthId = `month-combo-${getRandomString(32, 36)}`;
        let monthCombo = document.createElement('select');
        let childrenGranuleMonths = [];

        // Get the granule based on the layerId
        let g = globalThis.App.Layers._granules.get(layerId);
        const months = g.selectableMonths;

        monthCombo = addOptions(monthCombo, months);

        monthCombo.setAttribute('style', 'width: 65px; height: 25px; margin: 0 5px; display: inline-block;');
        monthCombo.setAttribute('id', monthId);
        monthCombo.setAttribute('class', 'periodicityCombo');

        // Store the granule on the combobox element
        // @ts-ignore
        monthCombo.granule = g;

        // If the selected month index is greater than what the selected year offers,
        // default to the last month available.
        monthCombo.selectedIndex = g.selectedMonthIndex;

        // Update the granule in an onchange event
        // When the user changes the selected option in the month
        // select box, changed the selected period in the granule object.

        monthCombo.addEventListener('change', function () {
          mapWindowBlock.component.fireEvent('activate');

          g.setSelectedMonthIndex(this.selectedIndex);

          enableVirtualDatasetLayer(g);

          handleDisablingButtons(g);

          if (shouldUsePeriodicButtons()) {
            const instanceId = globalThis.App.Layers.getConfigInstanceId();
            const buttonContainer = document.getElementById(`periodicContainer-${instanceId}`);
            const periodicButtons = generatePeriodicButtons(layerId);

            while (buttonContainer.firstChild) {
              buttonContainer.removeChild(buttonContainer.lastChild);
            }
            let periodicRow = document.createElement('div');
            periodicRow.style.display = 'inline-flex';
            for (let i = 0; i < periodicButtons.length; i++) {
              if (i % 16 == 0 && i != 0) {
                buttonContainer.appendChild(periodicRow);
                periodicRow = document.createElement('div');
                periodicRow.style.display = 'inline-flex';
              }
              if (periodicButtons.length > 9) {
                periodicButtons[i].style['font-size'] = '0.8em';
              }
              periodicRow.appendChild(periodicButtons[i]);
            }
            buttonContainer.appendChild(periodicRow);
          }
          //@ts-ignore
          colorPressedButton(globalThis.App.Layers.getConfigInstanceId(), this.granule.selectedSelectableIntervalIndex);
        });

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
            // monthCombo.picker.updateValue();
          },
          monthCombo
        );

        return monthCombo;
      };

      const createCombos = (layerId): Array<HTMLSelectElement> => {
        const combos = [];
        const yearCombo = getYearCombo(layerId);
        combos.push(yearCombo);

        const granule = globalThis.App.Layers._granules.get(layerId);

        // Build the month combo only for non-yearly datasets.
        if (granule !== null && granule.periodType !== 'year') {
          const monthCombo = getMonthCombo(layerId);
          // @ts-ignore
          yearCombo.monthCombo = monthCombo;

          combos.push(monthCombo);
        }

        return combos;
      };

      const createPicker = () => {
        const instanceId = globalThis.App.Layers.getConfigInstanceId();
        const layerId = getLayerId();

        const granule = globalThis.App.Layers._granules.get(layerId);
        // update Layers._granules with the instance of the new id
        // Fix for rare window focus bug where the datepicker would show without focusing the window
        // first, which caused the datepicker of the second window to display the wrong date
        globalThis.App.Layers._granules = globalThis.App.Layers.granuleInstances.get(instanceId);

        if (!granule) return;

        const outerContainer = document.createElement('div');
        const controlContainer = document.createElement('div');

        const innerContainer = document.createElement('div');
        innerContainer.style.display = 'inline-block';

        const prevDiv = document.createElement('div');
        prevDiv.style.display = 'inline-block';
        prevDiv.appendChild(getPreviousButton(granule));

        const nextDiv = document.createElement('div');
        nextDiv.style.display = 'inline-block';
        nextDiv.appendChild(getNextButton(granule));

        const comboDiv = document.createElement('div');
        comboDiv.style.display = 'inline-block';
        comboDiv.id = `combosContainer-${instanceId}`;

        const combos = createCombos(layerId);
        combos.forEach((el) => comboDiv.appendChild(el));

        controlContainer.appendChild(prevDiv);
        controlContainer.appendChild(comboDiv);
        controlContainer.appendChild(nextDiv);

        outerContainer.appendChild(controlContainer);

        // determine if periods should be created
        if (shouldUsePeriodicButtons()) {
          const periodicContainer = document.createElement('div');
          periodicContainer.style.display = 'inline';
          periodicContainer.id = `periodicContainer-${instanceId}`;

          // send in the optional updated granule that has the activeInterval that corresponds to the last available prelim data
          const periodicButtons = generatePeriodicButtons(layerId);

          let periodicRow = document.createElement('div');
          periodicRow.style.display = 'inline-flex';
          for (let i = 0; i < periodicButtons.length; i++) {
            if (i % 16 == 0 && i != 0) {
              periodicContainer.appendChild(periodicRow);
              periodicRow = document.createElement('div');
              periodicRow.style.display = 'inline-flex';
            }
            //If there are 10 or more buttons, the font for all the buttons smaller so the text doesn't spill over.
            if (periodicButtons.length > 9) {
              periodicButtons[i].style['font-size'] = '0.8em';
            }
            periodicRow.appendChild(periodicButtons[i]);
          }
          periodicContainer.appendChild(periodicRow);
          outerContainer.appendChild(periodicContainer);
        }

        return outerContainer;
      };

      // Alter the date picker when the DataSet Explorer changes.
      mapWindowBlock.on('layerchange', () => {
        const layerId = getLayerId();
        const granule = globalThis.App.Layers._granules.get(layerId);

        if (!granule) return document.createElement('div');

        // Get the container for the drop down boxes
        const combos = document.getElementById(`combosContainer-${mapWindowBlock.extendedTool.layersConfigId}`);

        // Remove the combos
        Array.from(combos.children).forEach((el) => combos.removeChild(el));

        // Remove buttons
        const periodicCombo = document.getElementById(`periodicContainer-${mapWindowBlock.extendedTool.layersConfigId}`);
        Array.from(periodicCombo.children).forEach((el) => periodicCombo.removeChild(el));

        handleDisablingButtons(granule);

        if (granule !== null) {
          // Rebuild the combos and reattach them to the div we just emptied
          createCombos(getLayerId()).forEach((el) => combos.appendChild(el));

          if (shouldUsePeriodicButtons()) {
            const periodicButtons = generatePeriodicButtons(layerId);
            let periodicRow = document.createElement('div');
            periodicRow.style.display = 'inline-flex';
            for (let i = 0; i < periodicButtons.length; i++) {
              if (i % 16 == 0 && i != 0) {
                periodicCombo.appendChild(periodicRow);
                periodicRow = document.createElement('div');
                periodicRow.style.display = 'inline-flex';
              }
              if (periodicButtons.length > 9) {
                periodicButtons[i].style['font-size'] = '0.8em';
              }
              periodicRow.appendChild(periodicButtons[i]);
            }
            periodicCombo.appendChild(periodicRow);
          }
        }
      });

      const picker = createPicker();
      if (!picker) return;

      // const header = document.createElement('h3');
      // header.textContent = block.altTitle ? block.altTitle : 'Date Picker';

      return picker;
    };

    globalThis.App.OpenLayers.controls['date-picker'] = getDatePicker;

    return;
  },
};
