import { getRegionWithRegionID } from '../../../utils';
import proj4 from 'proj4';
import { Fill, Stroke, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Polygon } from 'ol/geom';
import { getRandomString } from '../../../helpers/string';

export const cRegionTool = {
  options: {
    events: ['regionSelected', 'rendercomponent'],
    requiredBlocks: [
      'cMapWindow',
      'cMapPanel',
      'cQueryParamsDisplay',
      'cResetQuery',
      'cSelectRegionTool',
      'cSelectBBOXTool',
      'cStateTool',
      'cSubStateTool',
    ],
  },
  removeVector: function (callbackObj, postingObj) {
    const extendedTool = callbackObj;
    if (extendedTool.vectorAdded === true) {
      extendedTool.vectorAdded = false;
      const mapPanelBlock = extendedTool.owningBlock.getReferencedBlock('cMapPanel');
      const map = mapPanelBlock.component.map;
      extendedTool.vector.getSource().clear();
      map.removeLayer(extendedTool.vector);
    }

    const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
    if (cqlFilterDisplayBlock !== null) {
      cqlFilterDisplayBlock.extendedTool.setFilter('region', null);
    }

    extendedTool.component.clearValue();
  },
  createExtendedTool: function (owningBlock) {
    let selectedRegionId = globalThis.App.Config.sources.regions[0].id;
    if (globalThis.App.urlParameters.hasOwnProperty('region')) {
      const region = getRegionWithRegionID(globalThis.App.urlParameters.region);
      if (region !== null) {
        selectedRegionId = region.id;
      }
    }

    const extendedTool = {
      owningBlock: owningBlock,
      selectedRegionId: selectedRegionId,
      vector: new VectorLayer({
        source: new VectorSource(),
      }),
      vectorAdded: false,
      selectedCoords: null,
      selectedProjection: null,
      selectRegion: function (regionId) {
        let maxxy: Array<number>;
        let minxy: Array<number>;
        const region = getRegionWithRegionID(regionId);
        let extent = region.bbox;
        const regionProj = region.srs;
        const mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        const firstProj = map.getView().getProjection().getCode();
        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const layerMapping = globalThis.App.Layers.filterByTypes(this.owningBlock.blockConfig.layers, ['overlay']);

        if (this.vectorAdded === true) {
          this.vector.getSource().clear();
        } else {
          this.vectorAdded = true;
          map.addLayer(this.vector);
        }
        this.selectedCoords = extent;
        this.selectedProjection = firstProj;

        let i = 0;
        const len = layerMapping.length;
        for (; i < len; i += 1) {
          const layerMap = layerMapping[i];
          let layer = globalThis.App.Layers.query(
            layersConfig,
            {
              type: 'layer',
              mask: false,
              id: layerMap.id,
            },
            ['overlays', 'boundaries']
          );

          if (layer.length === 0) continue;
          layer = layer[0];

          const newProj = layer.srs;
          let newExtent = JSON.parse(JSON.stringify(extent));
          if (firstProj !== newProj) {
            minxy = proj4(firstProj, newProj, [newExtent[0], newExtent[1]]);
            maxxy = proj4(firstProj, newProj, [newExtent[2], newExtent[3]]);
            newExtent = [minxy[0], minxy[1], maxxy[0], maxxy[1]];
          }

          if (!layer.hasOwnProperty('cqlFilter')) {
            layer.cqlFilter = {};
          }

          if (!layer.cqlFilter.hasOwnProperty(this.cqlFilterId)) {
            layer.cqlFilter[this.cqlFilterId] = null;
          }

          layer.cqlFilter[this.cqlFilterId] = 'BBOX(' + layer.geometryName + ',' + newExtent.join(',') + ')';
          globalThis.App.OpenLayers.forceLayerUpdateById(layer.id, map);
        }

        // Convert extent into a series of points for a polygon.
        if (firstProj !== regionProj) {
          //coords = globalThis.App.OpenLayers.convertCoordProj(coords, regionProj, firstProj);
          minxy = proj4(regionProj, firstProj, [extent[0], extent[1]]);
          maxxy = proj4(regionProj, firstProj, [extent[2], extent[3]]);
          extent = [minxy[0], minxy[1], maxxy[0], maxxy[1]];
        }
        const coords = [
          [
            [extent[0], extent[3]],
            [extent[0], extent[1]],
            [extent[2], extent[1]],
            [extent[2], extent[3]],
          ],
        ];
        const olFeature = new Feature(new Polygon(coords));
        olFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: 'rgba(0,0,255,1)',
              width: 4,
            }),
            fill: new Fill({
              color: 'rgba(0,0,0,0)',
            }),
          })
        );
        this.vector.getSource().addFeature(olFeature);
        map.removeLayer(this.vector);
        map.addLayer(this.vector);

        setTimeout(
          function (extent, map) {
            map.getView().fit(extent, map.getSize());
          },
          10,
          extent,
          map
        );

        const cqlFilterDisplayBlock = this.owningBlock.getReferencedBlock('cQueryParamsDisplay');
        if (cqlFilterDisplayBlock !== null) {
          cqlFilterDisplayBlock.extendedTool.setFilter('region', 'Region: ' + region.title);
        }

        this.owningBlock.fire('regionSelected', this);
      },
    };

    const resetQueryBlock = owningBlock.getReferencedBlock('cResetQuery');
    if (resetQueryBlock !== null) {
      resetQueryBlock.on(
        'click',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          const layerMapping = globalThis.App.Layers.filterByTypes(extendedTool.owningBlock.blockConfig.layers, ['overlays']);
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

          let i = 0;
          const len = layerMapping.length;
          for (; i < len; i += 1) {
            const layerMap = layerMapping[i];
            let layer = globalThis.App.Layers.query(
              layersConfig,
              {
                type: 'layer',
                mask: false,
                id: layerMap.id,
              },
              ['overlays', 'boundaries']
            );

            if (layer.length === 0) continue;
            layer = layer[0];

            if (layer.hasOwnProperty('cqlFilter') && layer.cqlFilter.hasOwnProperty(extendedTool.cqlFilterId)) {
              layer.cqlFilter[extendedTool.cqlFilterId] = null;
            }
          }

          extendedTool.component.setValue(extendedTool.selectedRegionId);
          //extendedTool.selectRegion(extendedTool.selectedRegionId);
        },
        extendedTool
      );
    }

    const selectRegionBlock = owningBlock.getReferencedBlock('cSelectRegionTool');
    if (selectRegionBlock !== null) {
      selectRegionBlock.on('aoiSelected', owningBlock.itemDefinition.removeVector, extendedTool);
    }

    const selectBboxBlock = owningBlock.getReferencedBlock('cSelectBBOXTool');
    if (selectBboxBlock !== null) {
      selectBboxBlock.on('aoiSelected', owningBlock.itemDefinition.removeVector, extendedTool);
    }

    const stateBlock = owningBlock.getReferencedBlock('cStateTool');
    if (stateBlock !== null) {
      stateBlock.on('select', owningBlock.itemDefinition.removeVector, extendedTool);
    }

    const subStateBlock = owningBlock.getReferencedBlock('cSubStateTool');
    if (subStateBlock !== null) {
      subStateBlock.on('select', owningBlock.itemDefinition.removeVector, extendedTool);
    }

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const owningMapWindowBlock = extendedTool.owningBlock.getReferencedBlock('cMapWindow');
    if (!owningMapWindowBlock.hasOwnProperty('featureCqlFilterId')) {
      owningMapWindowBlock.featureCqlFilterId = getRandomString(32, 36);
    }
    extendedTool.cqlFilterId = owningMapWindowBlock.featureCqlFilterId;
    const regionConfigs = globalThis.App.Config.sources.regions;
    const data = [];

    let i = 0;
    const len = regionConfigs.length;
    for (; i < len; i += 1) {
      const regionConfig = regionConfigs[i];
      data.push({
        value: regionConfig.id,
        text: regionConfig.title,
      });
    }

    const store = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data: data,
    });
    const selectedRegion = extendedTool.selectedRegionId;

    const regionTool = {
      extendedTool: extendedTool,
      valueField: 'value',
      displayField: 'text',
      store: store,
      width: block.width,
      editable: false,
      emptyText: 'Select a Region',
      value: selectedRegion,
      listeners: {
        change: function (combo) {
          const value = combo.getValue();
          if (value !== null) {
            this.extendedTool.selectRegion(value);

            globalThis.App.EventHandler.postEvent(
              globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED,
              globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId()),
              globalThis.App.Layers.layersConfig
            );
          }
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
          this.extendedTool.component.el.dom.title = this.emptyText;
          this.extendedTool.owningBlock.fire('rendercomponent', this.extendedTool);

          const value = this.getValue();
          if (value !== null) {
            const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            if (mapPanelBlock.rendered === false) {
              mapPanelBlock.on(
                'rendercomponent',
                function (callbackObj, postingObj) {
                  const extendedTool = callbackObj;
                  const value = extendedTool.component.getValue();
                  extendedTool.selectRegion(value);

                  globalThis.App.EventHandler.postEvent(
                    globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED,
                    globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId()),
                    globalThis.App.Layers.layersConfig
                  );
                },
                this.extendedTool
              );
            } else {
              this.extendedTool.selectRegion(value);
              globalThis.App.EventHandler.postEvent(
                globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED,
                globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId()),
                globalThis.App.Layers.layersConfig
              );
            }
          }
        },
      },
    };

    var combo = Ext.create('Ext.form.field.ComboBox', regionTool);
    extendedTool.component = combo;
    return combo;
  },
};
