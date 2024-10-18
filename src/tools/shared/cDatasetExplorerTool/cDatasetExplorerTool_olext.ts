import { getBlocksByName } from '../../../helpers/extjs';
import { Granule } from '../../../Granules';

export const cDatasetExplorerTool_olext = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
    events: ['layerchange'],
  },
  getComponent(extendedTool: { owningBlock: { blockConfig: any; getReferencedBlock: (arg0: string) => any } }, items, toolbar, menu) {
    const getDataSetExplorer = () => {
      // const layersConfigId = globalThis.App.Layers.getConfigInstanceId();
      // const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
      // const onlyOnLayer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);

      const getRootOverlayConfig = function (layers, onlyOnLayerId, depth = 0) {
        if (depth > 1) return null;

        let i = 0;
        const len = layers.length;
        for (; i < len; i += 1) {
          const layer = layers[i];
          if (depth > 0) {
            const onLayer = globalThis.App.Layers.query(layer.folder, {
              id: onlyOnLayerId,
            });
            if (onLayer.length > 0) {
              return layer;
            }
          }

          if (layer.type === 'folder') {
            const rootFolder = getRootOverlayConfig(layer.folder, onlyOnLayerId, depth + 1);
            if (rootFolder !== null) return rootFolder.folder;
          }
        }

        return null;
      };

      const getDatasetExplorerOptions = () => {
        const layersConfigId = globalThis.App.Layers.getConfigInstanceId();
        const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
        const onlyOnLayer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);

        let overlays = [];
        if (onlyOnLayer === false) {
          const hiddenOverlay = globalThis.App.Layers.getTopLayer(layersConfig?.hidden);
          if (hiddenOverlay) {
            overlays = getRootOverlayConfig(layersConfig.hidden, hiddenOverlay.id);
            // hiddenOverlay.display = true;
            // overlays = layersConfig.hidden[0].folder[0].folder;
          } else {
            overlays = layersConfig.overlays[0].folder[0].folder;
          }
        } else {
          const onlyOnLayerId = onlyOnLayer.id;
          overlays = getRootOverlayConfig(layersConfig.overlays, onlyOnLayerId);
        }

        const options = overlays.map((overlay) => {
          return {
            configs: overlay,
            parentId: null,
          };
        });

        return options;
      };

      /**
       * The way the DatasetExplorerTool works is it's essentially separating the layers from their parent folders.
       * If this tool is used, then there are layers that reside within a parent "Data Set" folder (Data, Anomaly, ZScore, etc).
       * Each layer's parentId is tied to the id of the Data Set folder, making filtering simpler.
       * @param options
       * @returns {{defaultSelection: any, _options: any[], childCombo: any, _childOptions: any[]}}
       */
      const prepareTool = (options) => {
        const _options = [];
        const _childOptions = [];
        let childCombo = null;

        options.forEach((option) => {
          const overlay = option.configs;
          if (overlay.type === 'folder') {
            for (const childOverlay of overlay.folder) {
              _childOptions.push({
                configs: childOverlay,
                parentId: overlay.id,
              });
            }
          }
        });

        if (_childOptions.length > 0) childCombo = prepareTool(_childOptions);

        options.forEach((option) => {
          const overlay = option.configs;
          const optionObj: any = {
            id: overlay.id,
            text: overlay.title,
            parentId: option.parentId,
          };

          if (overlay.type === 'layer') {
            if (overlay.mask === false && overlay.loadOnly === false) {
              optionObj.selectedByDefault = overlay.display;
              _options.push(optionObj);
            }
          } else if (_childOptions.find((childOption) => childOption.parentId === overlay.id)) {
            _options.push(optionObj);
          }
        });

        // Get the default selection
        const getDefaultSelectedOption = (tool) => {
          if (tool.childCombo) {
            const childOpt = getDefaultSelectedOption(tool.childCombo);
            if (childOpt === undefined) {
              return;
            }
            return tool._options.find((option) => option.id === childOpt.parentId);
          }
          return tool._options.find((option) => option.selectedByDefault === true);
        };

        return {
          _options,
          _childOptions,
          childCombo,
          defaultSelection: getDefaultSelectedOption({
            _options,
            _childOptions,
            childCombo,
          }),
        };
      };

      /**
       * Remove all options from a select element
       * @param selectElement
       */
      const removeAllOptions = (selectElement: HTMLSelectElement): void => {
        while (selectElement.options.length > 0) {
          selectElement.remove(0);
        }
      };

      const getChildComboOptions = (tool, selectedParentValue) => {
        const options = tool.initOptions._options;
        const selectedOption = tool.options[tool.selectedIndex]?.text;

        removeAllOptions(tool);

        options.forEach((o) => {
          if (o.parentId === selectedParentValue) {
            const el = document.createElement('option');
            el.value = o.id;
            el.text = o.text;
            if (o.text === selectedOption) el.selected = true;
            tool.appendChild(el);
          }
        });

        return tool;
      };

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

      const onChange = (newChildComboSelection: string): void => {
        const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
        mapWindowBlock.component.fireEvent('activate');
        const owningMapWindow = mapWindowBlock.extendedTool;
        const { layersConfigId } = owningMapWindow;
        const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);

        // update Layers._granules with the instance of the new id
        globalThis.App.Layers._granules = globalThis.App.Layers.granuleInstances.get(layersConfigId);

        if (owningMapWindow.owningBlock.rendered === true) {
          // Get all the active rasters so we can turn them off
          const lastOverlays = globalThis.App.Layers.query(layersConfig.overlays, {
            type: 'layer',
            active: true,
            mask: false,
            loadOnly: false,
          });
          let lastOverlay = lastOverlays[0];

          const lastHiddenOverlays = globalThis.App.Layers.query(layersConfig.hidden, {
            type: 'layer',
            active: true,
            mask: false,
            loadOnly: false,
          });
          let lastHiddenOverlay = lastHiddenOverlays[0];

          let i = 0;
          const len = lastOverlays.length;
          for (; i < len; i += 1) {
            lastOverlays[i].display = false;
            lastOverlays[i].active = false;
          }

          let j = 0;
          const hiddenLen = lastHiddenOverlays.length;
          for (; j < hiddenLen; j += 1) {
            lastHiddenOverlays[j].active = false;
            lastHiddenOverlays[j].display = false;
          }

          const newOverlays = globalThis.App.Layers.query(
            layersConfig,
            {
              type: 'layer',
              id: newChildComboSelection,
            },
            ['overlays', 'hidden']
          );
          const newOverlay = newOverlays[0];

          if (newOverlay.isWMST) {
            const newOverlayGranule = globalThis.App.Layers._granules.get(newOverlay?.parentGranuleName || newOverlay.id);
            if (newOverlayGranule.activeInterval?.layerName) {
              // Get the virtual dataset layer that's associated with the interval's `layerName` property
              const hiddenLayers = globalThis.App.Layers.query(
                layersConfig,
                (layer) => {
                  return layer.additionalAttributes?.rasterDataset === newOverlayGranule.activeInterval?.layerName;
                },
                ['hidden']
              );

              // virtualDatasetActive = true;

              const layerToDisplay = hiddenLayers[0];
              layerToDisplay.active = true;
              layerToDisplay.display = true;
            } else {
              newOverlay.display = true;
              newOverlay.active = true;
            }
          } else {
            newOverlay.display = true;
            newOverlay.active = true;
          }

          if (!lastOverlay) lastOverlay = lastHiddenOverlay;

          // Only copy over the same selected month/year/etc for non-virtual datasets
          if (typeof lastOverlay !== 'undefined' && lastOverlay.id !== newOverlay.id) {
            // Here we are copying the settings from one granule to another.
            const oldGranule: Granule = globalThis.App.Layers._granules.get(lastOverlay?.parentGranuleName || lastOverlay.id);
            const newGranule: Granule = globalThis.App.Layers._granules.get(newOverlay?.parentGranuleName || newOverlay.id);

            // Set the same year so the selected year is consistent
            if (oldGranule.selectedYearIndex > newGranule.selectableYears.length - 1) {
              newGranule.selectedYearIndex = newGranule.selectableYears.findIndex((y) => y.text === newGranule.getYearOfActiveInterval());
            } else {
              newGranule.selectedYearIndex = oldGranule.selectedYearIndex;
            }

            // Update the selectable months because the year may have changed
            newGranule.selectableMonths = newGranule.getSelectableMonths();

            // Fix for going from pentadal February 2020 to 3-month
            // (which doesn't have 2020 data) so we have to go to Dec-Jan-Feb of 2019
            if (!newGranule.selectableMonths.length) {
              newGranule.selectedYearIndex -= 1;
              newGranule.selectableMonths = newGranule.getSelectableMonths();
            }

            // Update the selected month index as well as the selected month of the new granule.
            if (newGranule.selectableMonths[oldGranule.selectedMonthIndex]) {
              newGranule.selectedMonthIndex = oldGranule.selectedMonthIndex;
            } else {
              newGranule.selectedMonthIndex = newGranule.selectableMonths.length - 1;
            }

            // Ensure a valid selected month index
            if (newGranule.selectedMonthIndex === -1) {
              newGranule.selectedMonthIndex = newGranule.selectableMonths.length - 1;
            }

            newGranule.selectedMonth = newGranule.selectableMonths[newGranule.selectedMonthIndex];

            // Ensure the same selected selectable index across granules (1st pentad of the month selected on both, for example)
            newGranule.selectedSelectableIntervalIndex = oldGranule.selectedSelectableIntervalIndex;

            // Finally, calculate the new active interval based on the new selections
            newGranule.updateActiveInterval();

            // Here we need to check if the active interval contains a label since it's
            // possible that we enabled a hidden layer just before the month/year change we just did.
            // So, let's do the same loop for enabling the correct layer
            enableVirtualDatasetLayer(newGranule);

            const nextButton = document.getElementById(`nextButton-${mapWindowBlock.extendedTool.layersConfigId}`) as HTMLButtonElement;
            if (newGranule.selectedIntervalIndex === newGranule.intervals.length - 1) {
              nextButton.disabled = true;
            } else {
              nextButton.disabled = false;
            }
          }

          globalThis.App.Layers.setLayersConfigInstanceToId(layersConfigId, layersConfig);

          globalThis.App.Layers.setConfigInstanceId(layersConfigId);

          globalThis.App.Layers.updateLayerAttributes(newOverlay.id);

          globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED, owningMapWindow, owningMapWindow);

          mapWindowBlock.fire('layerchange', this);
        }
      };

      const getBuildToolOptions = (tool) => {
        const child = tool.childCombo;
        const mainCombo = document.createElement('select');
        const instanceId = globalThis.App.Layers.getConfigInstanceId();
        mainCombo.id = `dataTypeCombo-${instanceId}`;

        // when a dataset is deslected from the TOC, simply return
        if (tool.defaultSelection === undefined) {
          return;
        }
        const defaultSelection = tool.defaultSelection?.id;
        let childCombo;

        tool._options.forEach((o) => {
          const el = document.createElement('option');
          el.value = o.id;
          el.text = o.text;
          mainCombo.appendChild(el);
        });

        if (child) {
          childCombo = document.createElement('select');
          childCombo.id = `periodicityCombo-${instanceId}`;
          childCombo.initOptions = child;
          childCombo = getChildComboOptions(childCombo, defaultSelection);

          // Events for changes to the child combo
          childCombo.addEventListener('change', (evt) => {
            onChange(evt.target.value);
          });
          tool.childCombo = childCombo;
        }

        // @ts-ignore
        mainCombo.initOptions = tool;

        // Events for changes to the main combo
        mainCombo.addEventListener('change', (evt) => {
          const { target }: any = evt;
          const selectedValue = target.value;
          const theChildCombo = document.getElementById(`periodicityCombo-${globalThis.App.Layers.getConfigInstanceId()}`) as HTMLSelectElement;

          // Update the child combo options
          getChildComboOptions(theChildCombo, selectedValue);
          onChange(theChildCombo.value);
        });

        // Place all the combos inside a DIV
        const container = document.createElement('div');
        container.appendChild(mainCombo);
        container.appendChild(document.createTextNode(' '));
        container.appendChild(childCombo);

        // To place a space between the Select elements, we return a TextNode.
        // Returning just a space breaks the event listeners.
        return [container];
      };

      //Execute this callback to update the combo boxes when the datepicker is changed
      // globalThis.App.EventHandler.registerCallbackForEvent(
      //   globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
      //   function (eventObject, callbackObject, postingObject) {
      //     const layersConfigId = globalThis.App.Layers.getConfigInstanceId();
      //     const mainCombo = document.getElementById(`dataTypeCombo-${layersConfigId}`) as HTMLSelectElement;
      //     const childCombo = document.getElementById(`periodicityCombo-${layersConfigId}`) as HTMLSelectElement;
      //     const mainComboSelectedIndex = mainCombo.selectedIndex;
      //     const childComboSelectedIndex = childCombo.selectedIndex;

      //     const mapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
      //     if(mapWindowBlock.component !== null)
      //      mapWindowBlock.component.fireEvent('activate');

      //     const mapWindows = getBlocksByName('cMapWindow');

      //     // get the newly generated combo boxes and copy over the options into the existing main/childCombo
      //     let TocChanged = true;
      //     const comboArray = getBuildToolOptions(prepareTool(getDatasetExplorerOptions()), TocChanged);
      //     if(comboArray !== undefined){
      //       const newCombos = comboArray[0]?.children;
      //       const mainComboReplacement = newCombos[0];
      //       const childComboReplacement = newCombos[1];

      //       // Remove all the options in the original combos
      //       removeAllOptions(mainCombo);
      //       removeAllOptions(childCombo);

      //       // Reattach the new options to the existing combo boxes
      //       // @ts-ignore
      //       Array.from(mainComboReplacement.options).forEach((opt) => mainCombo.add(opt));
      //       // @ts-ignore
      //       Array.from(childComboReplacement.options).forEach((opt) => childCombo.add(opt));

      //       // We also have to attach the new initOptions so we can transition to other prelim data types
      //       // @ts-ignore
      //       mainCombo.initOptions = mainComboReplacement.initOptions;
      //       // @ts-ignore
      //       childCombo.initOptions = childComboReplacement.initOptions;

      //       mainCombo.selectedIndex = mainComboSelectedIndex;
      //       childCombo.selectedIndex = childComboSelectedIndex;
      //     }
      //   },
      //   this
      // );

      return [...getBuildToolOptions(prepareTool(getDatasetExplorerOptions())).filter((html) => html)];
    };

    globalThis.App.OpenLayers.controls['dataset-explorer'] = getDataSetExplorer;

    return;
  },
};
