import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { DragBox } from 'ol/interaction';
import { always } from 'ol/events/condition';
import Feature from 'ol/Feature';
import proj4 from 'proj4';
import { Fill, Stroke, Style } from 'ol/style';
import { getRandomString } from '../../../helpers/string';

export const cSelectBBOXTool = {
  options: {
    events: ['aoiSelected'],
    requiredBlocks: ['cMapWindow', 'cMapPanel', 'cQueryParamsDisplay', 'cResetQuery', 'cRegionTool'],
  },
  createExtendedTool: function (owningBlock) {
    const owningMapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const owningMapWindow = owningMapWindowBlock.extendedTool;

    let toggleGroupId = null;
    if (owningMapWindow !== null) {
      toggleGroupId = owningMapWindow.toggleGroupId;
    }

    const extendedTool = {
      owningBlock: owningBlock,
      toggleGroupId: toggleGroupId,
      toolUniqueID: getRandomString(32, 36),
      vector: new VectorLayer({
        source: new VectorSource(),
      }),
      selectedExtent: null,
      selectedProjection: null,
      vectorAdded: false,
      cqlFilterId: undefined,
      mapInteraction: undefined,
    };

    const mapInteraction = new DragBox({
      condition: always,
    });

    mapInteraction.on('boxstart', function (event) {
      extendedTool.vector.getSource().clear();
    });

    mapInteraction.on(
      'boxend',
      function (event) {
        let vector = extendedTool.vector;
        let owningBlock = extendedTool.owningBlock;
        const mapPanelBlock = owningBlock.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        const mapProjection = map.getView().getProjection().getCode();
        const cqlFilterDisplayBlock = owningBlock.getReferencedBlock('cQueryParamsDisplay');
        const geom = mapInteraction.getGeometry();
        const extent = geom.getExtent();
        this.selectedExtent = geom.getExtent();
        this.selectedProjection = mapProjection;

        const olFeature = new Feature(geom.clone());
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
        vector.getSource().addFeature(olFeature);
        map.removeLayer(vector);
        map.addLayer(vector);

        if (cqlFilterDisplayBlock !== null) {
          cqlFilterDisplayBlock.extendedTool.setFilter('bbox', 'BBOX: ' + extent.join(', '));
        }

        // Retrieve all layers mapped in the template.json with a type of "overlay". These are the layers that will be
        // filtered by the selected AOI.
        const mappedOverlays = globalThis.App.Layers.filterByTypes(extendedTool.owningBlock.blockConfig.layers, ['overlay']);
        const layerIds = [];
        for (var i = 0, len = mappedOverlays.length; i < len; i += 1) {
          layerIds.push(mappedOverlays[i].id);
        }

        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const layers = globalThis.App.Layers.query(
          layersConfig,
          function (layer) {
            if (layer.type === 'layer' && layer.mask === false && layerIds.indexOf(layer.id) !== -1) return true;
            return false;
          },
          ['overlays', 'boundaries']
        );

        for (var i = 0, len = layers.length; i < len; i += 1) {
          var layer = layers[i];
          const newProj = layer.srs;
          let newExtent = JSON.parse(JSON.stringify(extent));
          if (mapProjection !== newProj) {
            const minxy = proj4(mapProjection, newProj, [newExtent[0], newExtent[1]]);
            const maxxy = proj4(mapProjection, newProj, [newExtent[2], newExtent[3]]);
            newExtent = [minxy[0], minxy[1], maxxy[0], maxxy[1]];
          }

          if (!layer.hasOwnProperty('cqlFilter')) {
            layer.cqlFilter = {};
          }

          if (!layer.cqlFilter.hasOwnProperty(extendedTool.cqlFilterId)) {
            layer.cqlFilter[extendedTool.cqlFilterId] = null;
          }

          layer.cqlFilter[extendedTool.cqlFilterId] = 'BBOX(' + layer.geometryName + ',' + newExtent.join(',') + ')';
          globalThis.App.OpenLayers.forceLayerUpdateById(layer.id, map);
          map.getView().fit(extent, map.getSize());
        }

        //Fire the event to set the State Combobox appropriately
        owningBlock.fire('aoiSelected', this);

        globalThis.App.EventHandler.postEvent(
          globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED,
          layersConfig,
          globalThis.App.Layers.layersConfig
        );
      }
      // extendedTool
    );

    extendedTool.mapInteraction = mapInteraction;

    const regionBlock = owningBlock.getReferencedBlock('cRegionTool');
    if (regionBlock !== null) {
      regionBlock.on(
        'regionSelected',
        function (callbackObj, postingObj) {
          const extendedTool = callbackObj;

          const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('state', null);
            cqlFilterDisplayBlock.extendedTool.setFilter('subState', null);
          }

          extendedTool.component.toggle(false);
        },
        extendedTool
      );
    }

    const resetQueryBlock = owningBlock.getReferencedBlock('cResetQuery');
    if (resetQueryBlock !== null) {
      resetQueryBlock.on(
        'click',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const overlays = globalThis.App.Layers.query(layersConfig.overlays, {
            type: 'layer',
            mask: false,
          });

          let i = 0;
          const len = overlays.length;
          for (; i < len; i += 1) {
            const overlay = overlays[i];
            if (overlay.hasOwnProperty('cqlFilter') && overlay.cqlFilter.hasOwnProperty(extendedTool.cqlFilterId)) {
              overlay.cqlFilter[extendedTool.cqlFilterId] = null;
            }
          }

          const cqlFilterDisplayBlock = extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
          if (cqlFilterDisplayBlock !== null) {
            cqlFilterDisplayBlock.extendedTool.setFilter('bbox', null);
          }

          extendedTool.component.toggle(false);
        },
        extendedTool
      );
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

    const extBBOXTool = {
      extendedTool: extendedTool,
      cls: 'x-btn-left',
      iconCls: 'fa fa-bbox',
      xtype: 'button',
      //text: 'Select Box on Map',
      tooltip: block.tooltip,
      tooltipType: 'title',
      enableToggle: true,
      toggleGroup: extendedTool.toggleGroupId,
      id: extendedTool.toolUniqueID,
      pressed: block.pressed,
      listeners: {
        toggle: function (button, pressed) {
          const me = this;
          const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
          const map = mapPanelBlock.component.map;

          if (me.pressed) {
            map.addInteraction(me.extendedTool.mapInteraction);
            const siblings = me.extendedTool.owningBlock.parent.childItems;
            let i = 0;
            const len = siblings.length;
            for (; i < len; i += 1) {
              const sibling = siblings[i];
              if (sibling.id === me.extendedTool.owningBlock.id) continue;
              if (sibling.component.enableToggle === true && sibling.component.pressed === true) {
                sibling.component.toggle(false);
              } else if (sibling.extendedTool.hasOwnProperty('toggle')) {
                sibling.extendedTool.toggle(false);
              }
            }

            map.addLayer(this.extendedTool.vector);
          } else {
            map.removeInteraction(me.extendedTool.mapInteraction);
            const cqlFilterDisplayBlock = this.extendedTool.owningBlock.getReferencedBlock('cQueryParamsDisplay');
            if (cqlFilterDisplayBlock !== null) {
              cqlFilterDisplayBlock.extendedTool.setFilter('bbox', null);
            }
            map.removeLayer(this.extendedTool.vector);
            this.extendedTool.vector.getSource().clear();
          }
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;

          if (this.pressed === true) {
            const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            if (mapPanelBlock.rendered === false) {
              mapPanelBlock.on(
                'rendercomponent',
                function (callbackObj, postingObj) {
                  const mapPanel = postingObj;
                  const extBBOXTool = callbackObj;
                  const map = mapPanel.owningBlock.component.map;
                  map.addInteraction(extBBOXTool.mapInteraction);
                },
                this.extendedTool
              );
            } else {
              var map = mapPanelBlock.component.map;
              map.addInteraction(this.extendedTool.mapInteraction);
            }
          }
        },
      },
    };

    return extBBOXTool;
  },
};
