import Overlay from 'ol/Overlay';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OverlayPositioning from 'ol/OverlayPositioning';
import { Fill, Style, Circle, Stroke } from 'ol/style';
import * as olSphere from 'ol/sphere';
import Draw from 'ol/interaction/Draw';
import { LineString, Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import GeometryType from 'ol/geom/GeometryType';
import { unByKey } from 'ol/Observable';
import { getBlocksByName } from '../../../helpers/extjs';

export const cMeasure = {
  options: {
    events: ['collapse', 'expand'],
  },
  userDefinedColor: '#ffcc33',
  style: null,
  lockedWindows: [],
  overlaysArray: [],
  featuresArray: [],
  map: null,
  mapWindowFocused(postingObj, callbackObj) {
    const mapWindow = postingObj;
    const extendedTool = callbackObj;

    // Remove all Draw interactions- since we will be triggering startMeasure again for new focused window.
    // All the other windows will now lose any in-progress drawings.
    const mapWindows = getBlocksByName('cMapWindow');
    mapWindows.forEach((window) => {
      const mapPanel = window.getReferencedBlock('cMapPanel');
      const { map } = mapPanel.component;
      const drawItems = map.getInteractions();
      drawItems.array_.forEach((draw) => {
        if (draw instanceof Draw) map.removeInteraction(draw);
      });
    });

    extendedTool.activeMapWindow = mapWindow.owningBlock;
    extendedTool.sketch = null;
    const mapPanelBlock = extendedTool.activeMapWindow.getReferencedBlock('cMapPanel');
    if (mapPanelBlock) cMeasure.map = mapPanelBlock.component.map;

    if (extendedTool.resetVal) {
      extendedTool.startMeasure(extendedTool.resetVal);
    } else {
      extendedTool.startMeasure(null);
    }
  },
  mapWindowDestroyed(postingObj) {
    const index = cMeasure.lockedWindows.indexOf(postingObj.owningBlock);
    if (index >= 0) {
      cMeasure.lockedWindows.splice(index, 1);
    }
  },
  updateLockedWindows(postingObj) {
    const checkedWindows = postingObj;
    cMeasure.lockedWindows = postingObj;
    cMeasure.featuresArray = [];
    cMeasure.overlaysArray = [];
    cMeasure.gatherOverlaysAndFeatures(checkedWindows);
    cMeasure.addOverlaysAndFeatures(checkedWindows);
  },
  gatherOverlaysAndFeatures(checkedWindows) {
    checkedWindows.forEach((window) => {
      const mapPanelBlock = window.getReferencedBlock('cMapPanel');
      const { map } = mapPanelBlock.component;

      const layers = map.getLayers().array_;
      let vector;
      layers.forEach((layer) => {
        if (layer.values_?.id === 'measure') vector = layer;
      });
      if (vector) {
        const source = vector.getSource();
        const features = source.getFeatures();
        features.forEach((feature) => {
          cMeasure.featuresArray.push(feature);
        });
      }
      const overlays = map.getOverlays().array_;
      overlays.forEach((overlay) => {
        const overlayItem = overlay.getProperties();
        var distance = overlayItem.element.innerHTML;
        if (distance != '') {
          const position = overlay.getPosition();
          const item = overlay.getProperties();
          var distance = item.element.innerHTML;
          var tooltip = {
            position,
            distance,
          };
          if (!cMeasure.overlaysArray.some(({ distance }) => distance === tooltip.distance)) {
            // this is to prevent duplicate overlays. here we filter out by adding only new measurements, and checking that they are finished drawings (class name will include 'static')
            if (overlay.values_.element.className.includes('static')) cMeasure.overlaysArray.push(tooltip);
          }
        }
      });
    });
  },
  addOverlaysAndFeatures(checkedWindows) {
    for (let i = 0; i < checkedWindows.length; i++) {
      const mapPanelBlock = checkedWindows[i].getReferencedBlock('cMapPanel');
      const { map } = mapPanelBlock.component;

      const layers = map.getLayers().array_;
      let vector;
      layers.forEach((layer) => {
        if (layer.values_?.id === 'measure') vector = layer;
      });

      const source = vector.getSource();

      cMeasure.featuresArray.forEach((feature) => {
        try {
          feature.setStyle(cMeasure.style); // if the style isn't set here it uses feature defaults (blue)
          source.addFeature(feature);
        } catch (err) {
          console.log(); // if this catches it's an OL Error 30, the source already contains the feature
        }
      });

      const overlays = map.getOverlays().array_;
      const currentOverlays = [];

      overlays.forEach((overlay) => {
        const overlayItem = overlay.getProperties();
        var distance = overlayItem.element.innerHTML;
        if (distance != '') {
          const position = overlay.getPosition();
          const item = overlay.getProperties();
          var distance = item.element.innerHTML;
          var tooltip = {
            position,
            distance,
          };
          currentOverlays.push(tooltip);
        }
      });

      const overlaysToAdd = [...cMeasure.overlaysArray];

      for (let q = 0; q < overlaysToAdd.length; q++) {
        for (var z = 0; z < currentOverlays.length; ) {
          if (overlaysToAdd.length != 0 && overlaysToAdd[q].distance == currentOverlays[z].distance) {
            overlaysToAdd.splice(q, 1);
            var z = 0;
            if (q != 0) {
              q--;
            }
          } else {
            z++;
          }
        }
      }

      overlaysToAdd.forEach((overlay) => {
        const measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'tooltip tooltip-static';
        measureTooltipElement.innerHTML = overlay.distance;
        const measureTooltip = new Overlay({
          element: measureTooltipElement,
          offset: [0, -15],
          position: overlay.position,
          positioning: OverlayPositioning.BOTTOM_CENTER,
        });
        map.addOverlay(measureTooltip);
      });
    }
  },

  createExtendedTool(owningBlock) {
    const styles = `
        .tooltip { position: relative; background: rgba(0, 0, 0, 0.5); border-radius: 4px; color: white; padding: 4px 8px; opacity: 0.7; white-space: nowrap; }
        .tooltip-measure { opacity: 1; font-weight: bold; }
        .tooltip-static { background-color: userDefinedColor; color: black; border: 1px solid white; }
        .tooltip-static:before { border-top: 6px solid rgba(0, 0, 0, 0.5); border-right: 6px solid transparent; border-left: 6px solid transparent; content: ""; position: absolute; bottom: -6px; margin-left: -7px; left: 50%; }
        .tooltip-measure:before { border-top: 6px solid rgba(0, 0, 0, 0.5); border-right: 6px solid transparent; border-left: 6px solid transparent; content: ""; position: absolute; bottom: -6px; margin-left: -7px; left: 50%; }
        .tooltip-static:before { border-top-color: #ffcc33; }
        `;
    const block = owningBlock.blockConfig;
    if (typeof block.color !== 'undefined') {
      cMeasure.userDefinedColor = block.color;
    }
    const finalStyles = styles.replace('userDefinedColor', cMeasure.userDefinedColor);
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = finalStyles;
    document.body.appendChild(styleSheet);
    let mapWindow = null;
    // Get the default focused map window on app load.
    const mapWindows = getBlocksByName('cMapWindow');
    for (let i = 0, len = mapWindows.length; i < len; i++) {
      mapWindow = mapWindows[i];
      break;
    }
    const extendedTool = {
      owningBlock,
      activeMapWindow: mapWindow,
      measureTooltipElement: null,
      measureTooltip: null,
      wgs84Sphere: olSphere,
      draw: null,
      sketch: null,
      listener: false,
      resetVal: null,
      imperial: false,
      /**
       * Create a new vector layer
       * @returns {VectorLayer}
       */
      newVector() {
        const style = new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: cMeasure.userDefinedColor,
            width: 2,
          }),
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33',
            }),
          }),
        });
        const vector = new VectorLayer({
          source: new VectorSource(),
          style,
        });
        vector.set('id', 'measure');
        cMeasure.style = style; // this is done so that when features are added (spatialLockChange) they can use the same vector styles
        return vector;
      },
      /**
       * If a map has a measure VectorLayer, call addInteraction to begin drawing. If not, add a Vec
       * @param {String}
       */
      startMeasure(newValue) {
        const layers = cMeasure.map.getLayers().array_;
        const result = layers.filter((layer) => layer.values_?.id === 'measure'); // check if current map has vector object, if yes start drawing if not add vector and run again
        if (result.length > 0) {
          const drawItems = cMeasure.map.getInteractions().array_;
          drawItems.forEach((item) => {
            // removes ALL draw objects from map-- there becomes multiple when changing maps AND changing measure type
            if (item instanceof Draw) {
              cMeasure.map.removeInteraction(item);
            }
          });
          this.addInteraction(newValue);
        } else {
          cMeasure.map.addLayer(this.newVector());
          this.startMeasure(newValue);
        }
      },
      /**
       * Create an Overlay and adds it to the active map.
       */
      createMeasureTooltip() {
        if (this.measureTooltipElement) {
          this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'tooltip tooltip-measure';
        this.measureTooltip = new Overlay({
          element: this.measureTooltipElement,
          offset: [0, -15],
          positioning: OverlayPositioning.BOTTOM_CENTER,
        });
        cMeasure.map.addOverlay(this.measureTooltip);
      },
      /**
       * Takes the geom object and returns length. If the user has selected imperial units it will convert first.
       * @param {Geometry}
       * @returns {String}
       */
      formatLength(line) {
        const length = olSphere.getLength(line);
        if (this.imperial == true) return this.formatImperialArea(length);
        if (length > 100) {
          return `${Math.round((length / 1000) * 100) / 100} km`;
        } else {
          return `${Math.round(length * 100) / 100} m`;
        }
      },
      /**
       * Takes the geom object and returns length. If the user has selected imperial units it will convert first.
       * @param {Geometry}
       * @returns {String}
       */
      formatArea(polygon) {
        let output;
        const area = olSphere.getArea(polygon);
        if (this.imperial == true) return this.formatImperialArea(area);
        if (area > 10000) {
          output = `${Math.round((area / 1000000) * 100) / 100} km<sup>2</sup>`;
        } else {
          output = `${Math.round(area * 100) / 100} m<sup>2</sup>`;
        }
        return output;
      },
      /**
       * Takes the area size and returns it in imperial measurements.
       * @param {number}
       * @returns {String}
       */
      formatImperialArea(area) {
        area *= 10.764; // convert area (square meters) to square feet
        let output;
        if (area < 27878400) {
          // less than one square mile display feet
          output = `${Math.round(area)} ` + `ft<sup>2</sup>`;
        } else {
          area /= 2.788e7; // else greater than 1 mile convert to square miles and display
          output = `${Math.round(area * 100) / 100} ` + `mi<sup>2</sup>`;
        }
        return output;
      },
      /**
       * Takes the length and returns it in imperial measurements.
       * @param {number}
       * @returns {String}
       */
      formatImperialLength(length) {
        length *= 3.281;
        let output;
        if (length < 10560) {
          // less than two miles display feet
          output = `${Math.round(length)} ` + `ft`;
        } else {
          length /= 5280;
          output = `${Math.round(length * 100) / 100} ` + `mi`;
        }
        return output;
      },
      /**
       * Creates a Draw interaction. When the user clicks to begin (drawstart) we format the length/area while drawing,
       * and afterwards (drawend) a feature is made and added to the map.
       * @param {String}
       */
      addInteraction(newValue) {
        if (newValue) {
          const type = newValue.val == 'area' ? GeometryType.POLYGON : GeometryType.LINE_STRING;
          const draw = new Draw({
            source: new VectorSource(),
            type,
            style: new Style({
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
              }),
              stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2,
              }),
              image: new Circle({
                radius: 5,
                stroke: new Stroke({
                  color: 'rgba(0, 0, 0, 0.7)',
                }),
                fill: new Fill({
                  color: 'rgba(255, 255, 255, 0.2)',
                }),
              }),
            }),
          });
          cMeasure.map.addInteraction(draw);
          this.createMeasureTooltip();
          draw.on('drawstart', function (evt) {
            extendedTool.sketch = evt.feature;
            let tooltipCoord;
            extendedTool.listener = extendedTool.sketch.getGeometry().on('change', function (evt) {
              const geom = evt.target;
              let output;
              if (geom instanceof Polygon) {
                output = extendedTool.formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
              } else if (geom instanceof LineString) {
                output = extendedTool.formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
              }
              extendedTool.measureTooltipElement.innerHTML = output;
              extendedTool.measureTooltip.setPosition(tooltipCoord);
            });
          });
          draw.on('drawend', function (evt) {
            let feature;
            let coord;
            const geom = evt.feature.getGeometry();
            if (geom instanceof Polygon) {
              coord = geom.getCoordinates();
              feature = new Feature({
                geometry: new Polygon(coord),
              });
            } else if (geom instanceof LineString) {
              coord = geom.getCoordinates();
              feature = new Feature({
                geometry: new LineString(coord),
              });
            }
            const layers = cMeasure.map.getLayers().array_;
            let vector;
            layers.forEach((item) => {
              if (item.values_?.id === 'measure') vector = item;
            });
            const source = vector.getSource(); // grab the layers of current map, take the source of the last item (the drawing we just made), and apply the geom feature
            source.addFeature(feature);
            extendedTool.measureTooltipElement.className = 'tooltip tooltip-static';
            extendedTool.measureTooltip.setOffset([0, -7]);
            if (cMeasure.lockedWindows !== null && cMeasure.lockedWindows.length > 0) {
              cMeasure.updateLockedWindows(cMeasure.lockedWindows);
            }
            extendedTool.sketch = null; // unset sketch
            extendedTool.measureTooltipElement = null; // unset tooltip so that a new one can be created
            extendedTool.createMeasureTooltip(); // called to create a new empty div
            unByKey(this.listener);
          });
        }
      },
    };
    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED,
      owningBlock.itemDefinition.mapWindowFocused,
      extendedTool
    );
    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_DESTROYED,
      owningBlock.itemDefinition.mapWindowDestroyed,
      extendedTool
    );

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_SPATIAL_LOCKING_WINDOW_UPDATED,
      owningBlock.itemDefinition.updateLockedWindows,
      extendedTool
    );

    return extendedTool;
  },
  getComponent(extendedTool) {
    const block = extendedTool.owningBlock.blockConfig;
    const component = {
      extendedTool,
      title: 'Measure',
      collapsible: block.hasOwnProperty('collapsible') ? block.collapsible : true,
      collapsed: block.hasOwnProperty('collapsed') ? block.collapsed : true,
      componentCls: 'panel-border',
      grow: true,
      autoSize: true,
      border: 1,
      bodyCls: 'roundCorners',
      cls: 'padPanel',
      layout: {
        type: 'vbox',
        align: 'middle',
      },
      items: [
        {
          extendedTool,
          xtype: 'radiogroup',
          layout: 'hbox',
          width: '100%',
          id: 'measureRadio',
          items: [
            {
              boxLabel: 'Length (Line)',
              name: 'val',
              inputValue: 'length',
              checked: false,
            },
            {
              boxLabel: 'Area (Shape)',
              name: 'val',
              inputValue: 'area',
              checked: false,
            },
          ],
          listeners: {
            change(el, newValue, oldValue) {
              extendedTool.startMeasure(newValue);
              extendedTool.resetVal = newValue;
            },
            afterrender() {
              const mapPanelBlock = extendedTool.activeMapWindow.getReferencedBlock('cMapPanel');
              cMeasure.map = mapPanelBlock.component.map;
              const layer = extendedTool.newVector();
              // adds a vector to initial map created, without it spatially locking overrides the vector source and removes features
              cMeasure.map.addLayer(layer);
            },
          },
        },
        {
          extendedTool,
          xtype: 'checkboxgroup',
          layout: 'hbox',
          name: 'imperial',
          width: '100%',
          id: 'measureCheckbox',
          items: [
            {
              boxLabel: 'Use Imperial Distance',
              name: 'unit',
              inputValue: true,
            },
          ],
          listeners: {
            change(el, newValue, oldValue) {
              if (newValue.unit == true) {
                extendedTool.imperial = true;
              } else {
                extendedTool.imperial = false;
              }
            },
          },
        },
        {
          extendedTool,
          xtype: 'button',
          text: 'Clear Measurements',
          scale: 'small',
          width: '100%',
          listeners: {
            click() {
              const mapWindows = getBlocksByName('cMapWindow');

              mapWindows.forEach((mapWindow) => {
                const mapPanel = mapWindow.getReferencedBlock('cMapPanel');
                const { map } = mapPanel.component;
                map.getOverlays().clear();

                const vectors = map.getLayers().array_;
                vectors.forEach((item) => {
                  if (item.values_?.id === 'measure') {
                    item.getSource().clear();
                  }
                });
              });
              this.extendedTool.startMeasure(extendedTool.resetVal);
            },
          },
        },
        {
          extendedTool,
          xtype: 'button',
          text: 'Stop Measuring',
          scale: 'small',
          width: '100%',
          listeners: {
            click() {
              const mapWindows = getBlocksByName('cMapWindow');
              mapWindows.forEach((window) => {
                const mapPanel = window.getReferencedBlock('cMapPanel');
                const { map } = mapPanel.component;
                const layers = map.getLayers().array_;
                const result = layers.filter((layer) => layer.id === 'measure');
                if (result) {
                  const drawItems = map.getInteractions();
                  drawItems.forEach((draw) => {
                    if (draw instanceof Draw) map.removeInteraction(draw);
                  });
                }
              });
              const extRadio = Ext.getCmp('measureRadio');
              extRadio.reset();
              const extCheck = Ext.getCmp('measureCheckbox');
              extCheck.reset();
              this.extendedTool.startMeasure(null);
              extendedTool.resetVal = null;
              extendedTool.imperial = null;
            },
          },
        },
      ],
      listeners: {
        collapse: function () {
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.find((x) => x.type.includes('expand')).el.dom.title = 'Expand';
          this.extendedTool.owningBlock.fire('collapse', this.extendedTool);
        },

        expand: function () {
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.find((x) => x.type.includes('collapse')).el.dom.title = 'Collapse';
          this.extendedTool.owningBlock.fire('expand', this.extendedTool);
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.forEach((element) => {
              element.el.dom.title = element.type[0].toUpperCase() + element.type.split('-')[0].slice(1);
            });
        },
      },
    };
    return component;
  },
};
