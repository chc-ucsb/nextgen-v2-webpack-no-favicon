export const cDatasetExplorerTool = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
    events: ['layerchange'],
  },
  Option: function (id, title, parentId) {
    this.id = id;
    this.text = title;
    this.parentId = parentId;
  },
  createExtendedTool: function (owningBlock) {
    const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const owningMapWindow = mapWindowBlock.extendedTool;
    const mapPanelBlock = owningBlock.getReferencedBlock('cMapPanel');

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

    const layersConfigId = globalThis.App.Layers.getConfigInstanceId();
    const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
    const onlyOnLayer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);

    // FIXME: if region has no overlay layers, onlyOnLayer === [] -- which is truthy and incorrectly passes below
    // `onlyOnLayer === false` check

    let overlays = [];
    if (onlyOnLayer === false) {
      overlays = layersConfig.overlays[0].folder[0].folder;
    } else {
      var onlyOnLayerId = onlyOnLayer.id;
      overlays = getRootOverlayConfig(layersConfig.overlays, onlyOnLayerId);
    }

    const options = [];
    for (var i = 0, len = overlays.length; i < len; i += 1) {
      const overlay = overlays[i];
      options.push({
        configs: overlay,
        parentId: null,
      });
    }

    const datasetExplorerTool = new owningBlock.itemDefinition.DatasetExplorerTool(options, null, owningBlock);

    mapWindowBlock.on(
      'overflowmenushow',
      function (datasetExplorerTool) {
        datasetExplorerTool.ensureItemsInMenu();
        datasetExplorerTool.updateOverflowCombos();
      },
      datasetExplorerTool
    );

    return datasetExplorerTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    return extendedTool.getAllCombos();
  },
  DatasetExplorerTool: function (options, parentCombo, owningBlock) {
    this.init = function (options, parentCombo, owningBlock) {
      this.parentCombo = typeof parentCombo === 'undefined' ? null : parentCombo;
      this.owningBlock = owningBlock;
      this.selectedParentId = null;
      this.childCombo = null;
      this.options = [];
      const childOptions = [];

      for (var i = 0, len = options.length; i < len; i += 1) {
        var option = options[i];
        var overlay = option.configs;

        if (overlay.type === 'folder') {
          let j = 0;
          const length = overlay.folder.length;
          for (; j < length; j += 1) {
            const childOverlay = overlay.folder[j];
            childOptions.push({
              configs: childOverlay,
              parentId: overlay.id,
            });
          }
        }
      }

      this.childCombo = childOptions.length > 0 ? new owningBlock.itemDefinition.DatasetExplorerTool(childOptions, this, owningBlock) : null;

      for (var i = 0, len = options.length; i < len; i += 1) {
        var option = options[i];
        var overlay = option.configs;
        const optionObj = new owningBlock.itemDefinition.Option(overlay.id, overlay.title, option.parentId);

        if (overlay.type === 'layer') {
          // Prevent including externally added layers (via `resource` url param) from showing up in the DatasetExplorer
          // by excluding layers that contain `isAdded`.
          if (overlay.mask === false && overlay.loadOnly === false && !overlay.isAdded) {
            optionObj.selectedByDefault = overlay.display;
            this.options.push(optionObj);
          }
        } else {
          if (this.childCombo.hasOptionForParent(overlay.id)) this.options.push(optionObj);
        }
      }

      this.createCombo();
    };

    this.getDefaultSelectedOption = function () {
      if (this.childCombo !== null) {
        const childOption = this.childCombo.getDefaultSelectedOption();
        if (childOption === null) return null;
        for (var i = 0, len = this.options.length; i < len; i += 1) {
          var option = this.options[i];
          if (option.id === childOption.parentId) return option;
        }
      } else {
        for (var i = 0, len = this.options.length; i < len; i += 1) {
          var option = this.options[i];
          if (option.selectedByDefault === true) return option;
        }
      }

      return null;
    };

    this.hasOptionForParent = function (parentId) {
      const options = this.getOptionsForParent(parentId);
      if (this.childCombo !== null) {
        let i = 0;
        const len = options.length;
        for (; i < len; i += 1) {
          const option = options[i];
          if (this.childCombo.hasOptionForParent(option.id)) return true;
        }
      }

      return options.length > 0;
    };

    this.getOptionsForParent = function (parentId) {
      const availableOptions = [];

      let i = 0;
      const len = this.options.length;
      for (; i < len; i += 1) {
        const option = this.options[i];
        if (option.parentId === parentId) availableOptions.push(option);
      }

      return availableOptions;
    };

    this.getOptionById = function (id) {
      let i = 0;
      const len = this.options.length;
      for (; i < len; i += 1) {
        const option = this.options[i];
        if (option.id === id) return option;
      }
      return null;
    };

    this.setOptions = function (parentId) {
      this.combo.suspendEvents();
      this.selectedParentId = parentId;
      const selectedOption = this.getOptionById(this.combo.getValue());
      const newOptions = this.getOptionsForParent(parentId);
      let newSelection = null;
      let newValue = '';

      if (newOptions.length === 0) {
        if (!this.combo.isHidden()) {
          this.combo.hide();
        }

        this.isComboEmpty = true;
        this.hideOverflowCombo();
        this.combo.clearValue();
        this.combo.resumeEvents();
        return;
      } else {
        if (this.combo.isHidden()) {
          this.combo.show();
        }

        this.isComboEmpty = false;
        this.showOverflowCombo();
      }

      if (selectedOption !== null) {
        for (var i = 0, len = newOptions.length; i < len; i += 1) {
          const newOption = newOptions[i];
          if (newOption.text === selectedOption.text) {
            newSelection = newOption;
            break;
          }
        }
      }

      this.combo.clearValue();
      const storeData = this.getStoreData();
      this.combo.bindStore(this.createStore(storeData));

      if (newSelection === null) {
        newValue = storeData[0].id;
      } else {
        for (var i = 0, len = storeData.length; i < len; i += 1) {
          const data = storeData[i];
          if (data.id === newSelection.id) {
            newValue = data.id;
            break;
          }
        }
      }

      this.selectedOption = newValue;
      this.combo.setValue(newValue);
      if (this.combo.overflowClone) {
        const overflowCombo = this.combo.overflowClone;
        const overflowStore = this.createStore();
        overflowCombo.bindStore(overflowStore);
        overflowCombo.setValue(newValue);
      }
      this.change();
      this.combo.resumeEvents();
    };

    this.change = function () {
      if (this.childCombo !== null) {
        this.childCombo.setOptions(this.selectedOption);
      }

      const mapWindowBlock = this.owningBlock.getReferencedBlock('cMapWindow');
      const owningMapWindow = mapWindowBlock.extendedTool;
      const layersConfigId = owningMapWindow.layersConfigId;
      const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);

      // update Layers._granules with the instance of the new id
      globalThis.App.Layers._granules = globalThis.App.Layers.granuleInstances.get(layersConfigId);

      if (owningMapWindow.owningBlock.rendered === true && (this.childCombo === null || this.childCombo.isComboEmpty === true)) {
        const lastOverlays = globalThis.App.Layers.query(layersConfig.overlays, {
          type: 'layer',
          active: true,
          mask: false,
          loadOnly: false,
        });
        const lastOverlay = lastOverlays[0];

        let i = 0;
        const len = lastOverlays.length;
        for (; i < len; i += 1) {
          lastOverlays[i].display = false;
          lastOverlays[i].active = false;
        }

        const newOverlays = globalThis.App.Layers.query(layersConfig.overlays, {
          type: 'layer',
          id: this.combo.getValue(),
        });
        const newOverlay = newOverlays[0];
        newOverlay.display = true;
        newOverlay.active = true;

        if (typeof lastOverlay !== 'undefined' && lastOverlay.id !== newOverlay.id) {
          // Here we are copying the settings from one granule to another.
          const oldGranule = globalThis.App.Layers._granules.get(lastOverlay.id);
          const newGranule = globalThis.App.Layers._granules.get(newOverlay.id);

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

          // Finally, calculate the new active interval based on the new selections
          newGranule.updateActiveInterval();
        }

        globalThis.App.Layers.setLayersConfigInstanceToId(layersConfigId, layersConfig);

        globalThis.App.Layers.setConfigInstanceId(layersConfigId);
        globalThis.App.Layers.updateLayerAttributes(newOverlay.id);

        globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED, owningMapWindow, owningMapWindow);

        this.owningBlock.fire('layerchange', this);
      }
    };

    this.createCombo = function () {
      const defaultOption = this.getDefaultSelectedOption();
      if (defaultOption === null) {
        this.selectedParentId = null;
      } else {
        this.selectedParentId = defaultOption.parentId;
      }

      const store = this.createStore();

      this.combo = Ext.create('Ext.form.field.ComboBox', {
        wrapper: this,
        width: 87,
        margin: '0 8px 0 0',
        queryMode: 'local',
        editable: false,
        autoRender: true,
        autoShow: true,
        displayField: 'name',
        valueField: 'id',
        listeners: {
          change: function (combo, newValue) {
            this.wrapper.selectedOption = newValue;
            this.wrapper.change();
          },
          beforeshow: function () {
            if (this.wrapper.isComboEmpty === true) return false;
          },
          afterrender: function () {
            if (this.wrapper.parentCombo)
              this.el.dom.title = this.wrapper.owningBlock.blockConfig.childTooltip
                ? this.wrapper.owningBlock.blockConfig.childTooltip
                : 'subcategory';
            if (this.wrapper.childCombo)
              this.el.dom.title = this.wrapper.owningBlock.blockConfig.parentTooltip
                ? this.wrapper.owningBlock.blockConfig.parentTooltip
                : 'data type';
          },
        },
      });

      this.combo.initialConfig.storedComboId = this.combo.id;
      this.combo.bindStore(store);
      if (defaultOption !== null) {
        this.combo.setValue(defaultOption.id);
      }
    };

    this.hideOverflowCombo = function () {
      const overflowCombo = this.combo.overflowClone;
      if (overflowCombo) {
        overflowCombo.hide();
      }
    };

    this.showOverflowCombo = function () {
      const overflowCombo = this.combo.overflowClone;
      if (overflowCombo) {
        overflowCombo.show();
      }
    };

    this.updateOverflowCombos = function () {
      const overflowCombo = this.combo.overflowClone;
      if (overflowCombo) {
        if (this.isComboEmpty === true) {
          if (!overflowCombo.isHidden()) {
            overflowCombo.hide();
          }
        } else {
          if (overflowCombo.isHidden()) {
            overflowCombo.show();
          }
        }

        const store = this.createStore();
        overflowCombo.bindStore(store);
        overflowCombo.setValue(this.combo.getValue());
      }

      if (this.childCombo !== null) this.childCombo.updateOverflowCombos();
    };

    this.ensureItemsInMenu = function () {
      if (this.isComboEmpty === true) {
        const mapWindowBlock = this.owningBlock.getReferencedBlock('cMapWindow');

        const overflowHandler = mapWindowBlock.extendedTool.mapWindowToolbar.layout.overflowHandler;
        if (!overflowHandler.hasOwnProperty('menu')) return;
        const menuItems = overflowHandler.menu.items.items;
        let menuItemFound = false;

        let i = 0;
        const len = menuItems.length;
        for (; i < len; i += 1) {
          const menuItem = menuItems[i];
          if (menuItem.initialConfig.storedComboId === this.combo.id) {
            menuItemFound = true;
            break;
          }
        }

        if (menuItemFound === false) {
          let insertIndex = 0;
          if (this.parentCombo !== null) {
            const parentIndex = this.parentCombo.getIndexOfOverflowCombo();
            if (parentIndex !== false) {
              insertIndex = parentIndex + 1;
            }

            const overflowCombo = Ext.create(Ext.getClassName(this.combo), overflowHandler.createMenuConfig(this.combo));
            this.combo.overflowClone = overflowHandler.menu.insert(insertIndex, overflowCombo);
          }
        }
      }

      if (this.childCombo !== null) {
        this.childCombo.ensureItemsInMenu();
      }
    };

    this.getIndexOfOverflowCombo = function () {
      const mapWindowBlock = this.owningBlock.getReferencedBlock('cMapWindow');

      const overflowHandler = mapWindowBlock.extendedTool.mapWindowToolbar.layout.overflowHandler;
      if (!overflowHandler.hasOwnProperty('menu')) return;
      const menuItems = overflowHandler.menu.items.items;
      let i = 0;
      const len = menuItems.length;
      for (; i < len; i += 1) {
        const menuItem = menuItems[i];
        if (menuItem.initialConfig.storedComboId === this.combo.id) {
          return i;
        }
      }
      return false;
    };

    this.getStoreData = function () {
      const options = this.getOptionsForParent(this.selectedParentId);
      const data = [];

      let i = 0;
      const len = options.length;
      for (; i < len; i += 1) {
        const option = options[i];
        data.push({
          id: option.id,
          name: option.text,
        });
      }

      return data;
    };

    this.createStore = function (storeData) {
      if (typeof storeData === 'undefined') {
        storeData = this.getStoreData();
      }

      const store = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: storeData,
      });

      return store;
    };

    this.getAllCombos = function (comboList) {
      if (typeof comboList === 'undefined') comboList = [];

      comboList.push(this.combo);
      if (this.childCombo !== null) {
        return this.childCombo.getAllCombos(comboList);
      }

      return comboList;
    };

    this.init(options, parentCombo, owningBlock);
  },
};
