/* The cSliderTool is a multi-point slider allowing the
   user to select a date or date range and then the layer
   is updated with features from those specific dates */
export const cSliderTool = {
  options: {
    requiredBlocks: ['cMapPanel', 'cQueryParamsDisplay', 'cResetQuery'],
  },
  init: function (blueprint) {
    const cqlFilterDisplayBlueprint = blueprint.getReferencedBlueprint('cQueryParamsDisplay');
    let displayText = '';
    const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
    var layerMapping = blueprint.blockConfig.layers[0];
    const layers = globalThis.App.Layers.query(layersConfig.overlays, {
      id: layerMapping.id,
    });
    const id = blueprint.id;
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
      const beginningYear = blueprint.blockConfig.initialValues[0];
      const endingYear = blueprint.blockConfig.initialValues[1];
      var layerMapping = blueprint.blockConfig.layers[0];
      const idProperty = globalThis.App.Layers.getFeatureIdProperty(layerMapping.featureInfo);
      // If the values are the same just use one for single year
      if (beginningYear === endingYear) {
        layer.cqlFilter[id] = idProperty + ' BETWEEN ' + beginningYear + '-01-01 AND ' + beginningYear + '-12-31';
        displayText = 'Year: ' + beginningYear;
      } else {
        layer.cqlFilter[id] = idProperty + ' BETWEEN ' + beginningYear + '-01-01 AND ' + endingYear + '-12-31';
        displayText = 'Years: ' + beginningYear + ' to ' + endingYear;
      }
    }

    if (cqlFilterDisplayBlueprint !== null) {
      cqlFilterDisplayBlueprint.itemDefinition.defaultFilters.year = displayText;
    }
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const position = block.block;
    const value1 = block.initialValues[0];
    const value2 = block.initialValues[1];
    const minValue = block.minValue;
    const maxValue = block.maxValue;

    const slider = Ext.create('Ext.slider.Multi', {
      extendedTool: extendedTool,
      selectedLayerIdentifier: 'nothingyet',
      label: 'multiSlider',
      id: 'multiSlider',
      region: 'north',
      cls: block.cssClass,
      height: block.height,
      width: block.width,
      style: block.style,
      disabled: false,
      values: [value1, value2],
      increment: 1,
      minValue: minValue,
      maxValue: maxValue,
      constrainThumbs: false,
      labelAlign: 'top',
      useTips: false,
      listeners: {
        changecomplete: function (t, options) {
          const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
          const map = mapPanelBlock.component.map;
          const cqlFilterDisplayBlock = this.extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          let displayText = '';

          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layerMapping = extendedTool.owningBlock.blockConfig.layers[0];
          const layers = globalThis.App.Layers.query(layersConfig.overlays, {
            id: layerMapping.id,
          });
          const id = this.extendedTool.owningBlock.blueprint.id;
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
            const idProperty = globalThis.App.Layers.getFeatureIdProperty(layerMapping.featureInfo);
            /* If the values are the same just use one for single year */
            if (t.thumbs[0].value === t.thumbs[1].value) {
              layer.cqlFilter[id] = idProperty + ' BETWEEN ' + t.thumbs[0].value + '-01-01' + ' AND ' + t.thumbs[0].value + '-12-31';
              displayText = 'Year: ' + t.thumbs[0].value;
            } else {
              /* Depending on which slider is first, may need to swap the order so the between works */
              if (t.thumbs[0].value < t.thumbs[1].value) {
                var beginningYear = t.thumbs[0].value;
                var endingYear = t.thumbs[1].value;
              } else {
                var beginningYear = t.thumbs[1].value;
                var endingYear = t.thumbs[0].value;
              }

              layer.cqlFilter[id] = idProperty + ' BETWEEN ' + beginningYear + '-01-01' + ' AND ' + endingYear + '-12-31';
              displayText = 'Years: ' + beginningYear + ' to ' + endingYear;
            }
            globalThis.App.OpenLayers.forceLayerUpdateById(layer.id, map);
          }

          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('year', displayText);
          }

          globalThis.App.EventHandler.postEvent(
            globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED,
            layersConfig,
            globalThis.App.Layers.layersConfig
          );
        },
        afterrender: function (t, options) {
          for (let i = 0; i < t.thumbs.length; i++) {
            const thumbElId = t.thumbs[i].el.id;
            const thumbLabelElId = 'thumb-label-' + i;
            Ext.DomHelper.append(thumbElId, {
              tag: 'div',
              id: thumbLabelElId,
              cls: thumbLabelElId,
              html: t.thumbs[i].value,
            });
          }

          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
        change: function (t, options) {
          for (let i = 0; i < t.thumbs.length; i++) {
            const thumbLabelElId = 'thumb-label-' + i;
            Ext.DomHelper.overwrite(thumbLabelElId, {
              tag: 'div',
              id: thumbLabelElId,
              cls: thumbLabelElId,
              html: t.thumbs[i].value,
            });
            Ext.get(thumbLabelElId).applyStyles('margin-left:0%');
          }
        },
      },
    });

    const resetQueryBlock = extendedTool.owningBlock.getReferencedBlock('cResetQuery');
    if (resetQueryBlock !== null) {
      resetQueryBlock.on(
        'click',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const layerMapping = extendedTool.owningBlock.blockConfig.layers[0];
          const idProperty = globalThis.App.Layers.getFeatureIdProperty(layerMapping.featureInfo);
          const initialValues = extendedTool.owningBlock.blockConfig.initialValues;
          const startYear = initialValues[0];
          const endYear = initialValues[1];
          let cqlFilter = '';
          let displayText = '';

          if (startYear === endYear) {
            cqlFilter = idProperty + ' = ' + startYear;
            displayText = 'Year: ' + startYear;
          } else {
            cqlFilter = idProperty + ' BETWEEN ' + startYear + ' AND ' + endYear;
            displayText = 'Years: ' + startYear + ' to ' + endYear;
          }
          const layers = globalThis.App.Layers.query(layersConfig.overlays, {
            id: layerMapping.id,
          });

          const id = extendedTool.owningBlock.blueprint.id;
          let i = 0;
          const len = layers.length;
          for (; i < len; i += 1) {
            const layer = layers[i];
            if (layer.hasOwnProperty('cqlFilter') && layer.cqlFilter.hasOwnProperty(id)) {
              layer.cqlFilter[id] = cqlFilter;
            }
          }

          const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('ig_date', displayText);
          }

          extendedTool.component.setValue(initialValues, false);
        },
        extendedTool
      );
    }

    return slider;
  },
};
