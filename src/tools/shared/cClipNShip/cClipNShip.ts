import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import proj4 from 'proj4';
import { Fill, Stroke, Style } from 'ol/style';
import { fromExtent } from 'ol/geom/Polygon';
import Feature from 'ol/Feature';
import { always } from 'ol/events/condition';
import { DragBox } from 'ol/interaction';
import { getBlocksByName } from '../../../helpers/extjs';

export const cClipNShip = {
  mapWindowFocused: function (postingObj, callbackObj, eventObj) {
    const mapWindow = postingObj;
    const extendedTool = callbackObj;
    const activeMapWindow = extendedTool.activeMapWindow;

    // enables form items if it was previously disabled by
    // all map windows being closed.
    extendedTool.enableForm();

    if (activeMapWindow !== null && activeMapWindow.extendedTool !== null) {
      // In case the focused event triggers twice on same map window.
      if (activeMapWindow.extendedTool.layersConfigId === mapWindow.layersConfigId) return;
      // Remove the vector from the current map window.
      extendedTool.removeVector();
    }

    // Checks if the interaction was added to the last map window
    // and if so, remove it and add it to the newly selected map window.
    if (extendedTool.interactionAdded === true) {
      if (activeMapWindow !== null) extendedTool.removeMapInteraction();
      extendedTool.activeMapWindow = mapWindow.owningBlock;
      extendedTool.addMapInteraction();
    } else {
      extendedTool.activeMapWindow = mapWindow.owningBlock;
    }
    extendedTool.addVector();
  },
  mapWindowDestroyed: function (postingObj, callbackObj, eventObj) {
    const extendedTool = callbackObj;
    const mapWindows = getBlocksByName('cMapWindow');
    if (mapWindows.length === 1) {
      // If there is only one map window when this event is called
      // then that means the map window is about to be destroyed so
      // there WILL be no map windows after this callback executes.
      extendedTool.disableForm();
      extendedTool.activeMapWindow = null;
    }
  },
  createExtendedTool: function (owningBlock) {
    let mapWindow = null;
    // Get the default focused map window on app load.
    const mapWindows = getBlocksByName('cMapWindow');
    let i = 0;
    const len = mapWindows.length;
    for (; i < len; i += 1) {
      mapWindow = mapWindows[i];
      break;
    }

    const extendedTool = {
      owningBlock: owningBlock,
      activeMapWindow: mapWindow,
      interactionAdded: false,
      mapInteraction: undefined,
      lat: {
        min: null,
        max: null,
      },
      lon: {
        min: null,
        max: null,
      },
      // Shows the selected extent in the map after the user drags
      // a box or adds coordinates manually.
      vector: new VectorLayer({
        source: new VectorSource(),
      }),
      addMapInteraction: function () {
        const mapWindow = this.activeMapWindow;
        this.interactionAdded = true;
        const mapPanelBlock = mapWindow.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        map.addInteraction(this.mapInteraction);
      },
      removeMapInteraction: function () {
        const mapWindow = this.activeMapWindow;
        this.interactionAdded = false;
        const mapPanelBlock = mapWindow.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        map.removeInteraction(this.mapInteraction);
      },
      disableDownloadBtn: function () {
        const downloadBtn = this.component.query('#wcsDownloadBtn')[0];
        downloadBtn.disable();
      },
      enableDownloadBtn: function () {
        const downloadBtn = this.component.query('#wcsDownloadBtn')[0];
        downloadBtn.enable();
      },
      // disables and enables entire form except for the
      // download button since that is handled separately.
      disableForm: function () {
        this.clearForm();
        const selectExtentBtn = Ext.getCmp('clipNShipToggle');
        const clearBtn = Ext.getCmp('wcsDownloadClear');
        const component = this.component;
        const minLatTxtBox = component.query('[name=minLat]')[0];
        const maxLatTxtBox = component.query('[name=maxLat]')[0];
        const minLonTxtBox = component.query('[name=minLon]')[0];
        const maxLonTxtBox = component.query('[name=maxLon]')[0];
        selectExtentBtn.disable();
        clearBtn.disable();
        minLatTxtBox.disable();
        maxLatTxtBox.disable();
        minLonTxtBox.disable();
        maxLonTxtBox.disable();
      },
      enableForm: function () {
        const selectExtentBtn = Ext.getCmp('clipNShipToggle');
        const clearBtn = Ext.getCmp('wcsDownloadClear');
        const component = this.component;
        const minLatTxtBox = component.query('[name=minLat]')[0];
        const maxLatTxtBox = component.query('[name=maxLat]')[0];
        const minLonTxtBox = component.query('[name=minLon]')[0];
        const maxLonTxtBox = component.query('[name=maxLon]')[0];
        selectExtentBtn.enable();
        clearBtn.enable();
        minLatTxtBox.enable();
        maxLatTxtBox.enable();
        minLonTxtBox.enable();
        maxLonTxtBox.enable();
      },
      clearForm: function () {
        const component = this.component;
        const minLatTxtBox = component.query('[name=minLat]')[0];
        const maxLatTxtBox = component.query('[name=maxLat]')[0];
        const minLonTxtBox = component.query('[name=minLon]')[0];
        const maxLonTxtBox = component.query('[name=maxLon]')[0];
        minLatTxtBox.reset();
        maxLatTxtBox.reset();
        minLonTxtBox.reset();
        maxLonTxtBox.reset();
      },
      removeVector: function () {
        const mapPanelBlock = this.activeMapWindow.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        map.removeLayer(this.vector);
      },
      addVector: function () {
        const mapPanelBlock = this.activeMapWindow.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        map.addLayer(this.vector);
      },
      // Will clear the blue extent box but does
      // not remove the layer from the map.
      clearFeatures: function () {
        this.vector.getSource().clear();
      },
      setFeature: function (extent, projection) {
        const mapPanel = this.activeMapWindow.getReferencedBlock('cMapPanel');
        const map = mapPanel.component.map;
        const mapProjection = map.getView().getProjection().getCode();
        let newExtent;

        // Convert the extent projection if needed.
        if (projection !== mapProjection) {
          let minxy = [extent[0], extent[1]];
          let maxxy = [extent[2], extent[3]];
          minxy = proj4(projection, mapProjection, minxy);
          maxxy = proj4(projection, mapProjection, maxxy);
          newExtent = [minxy[0], minxy[1], maxxy[0], maxxy[1]];
        } else {
          newExtent = extent;
        }

        const olFeature = new Feature({ geometry: fromExtent(newExtent) });
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
      },
      handleTextboxChange: function () {
        this.clearFeatures();
        const extent = [this.lon.min, this.lat.min, this.lon.max, this.lat.max];
        const projection = 'EPSG:4326'; // Hard coded to lat/lon. Will be converted to map projection.
        this.setFeature(extent, projection);
        this.validateSelection();
      },
      validateSelection: function () {
        let isValid = true;
        const validationMessage = Ext.getCmp('latLonValidationMessage');
        const maxArea = this.owningBlock.blockConfig.maxExtentAreaDegrees;

        const mapPanelBlock = this.activeMapWindow.getReferencedBlock('cMapPanel');
        const map = mapPanelBlock.component.map;
        let geom = this.mapInteraction.getGeometry();
        const extent = geom.getExtent();
        const mapProjection = map.getView().getProjection().getCode();

        if (mapProjection !== 'EPSG:4326') {
          geom = geom.clone().transform(mapProjection, 'EPSG:4326');
        }
        const area = geom.getArea();

        const miny = parseFloat(this.lat.min);
        const maxy = parseFloat(this.lat.max);
        const minx = parseFloat(this.lon.min);
        const maxx = parseFloat(this.lon.max);

        if (area > maxArea) {
          isValid = false;
          validationMessage.setText('Exceeded maximum area of ' + maxArea + ' degrees.');
          validationMessage.setHeight(20);
          this.disableDownloadBtn();
        } else if (isNaN(minx) || isNaN(miny) || isNaN(maxx) || isNaN(maxy)) {
          isValid = false;
          this.disableDownloadBtn();
        } else if (minx > maxx) {
          isValid = false;
          validationMessage.setText('Longitude minimum cannot be greater than maximum. You may have crossed the antimeridian');
          validationMessage.setHeight(60);
          this.disableDownloadBtn();
        } else if (miny > maxy) {
          isValid = false;
          validationMessage.setText('Latitude minimum cannot be greater than maximum.');
          validationMessage.setHeight(40);
          this.disableDownloadBtn();
        } else {
          this.enableDownloadBtn();
          validationMessage.setText('');
          validationMessage.setHeight(0);
        }

        return isValid;
      },
      openAndEnable: function () {
        const parent = this.owningBlock.parent.component;
        if (parent.collapsed) {
          parent.expand();
        }

        if (this.owningBlock.rendered === true) {
          if (this.component.collapsed) {
            this.component.expand();
          }

          var clipNShipBtn = Ext.getCmp('clipNShipToggle');
          if (clipNShipBtn.pressed === false) {
            clipNShipBtn.toggle(true);
          }
        } else {
          setTimeout(
            function (extendedTool) {
              if (extendedTool.component.collapsed) {
                extendedTool.component.expand();
              }

              const clipNShipBtn = Ext.getCmp('clipNShipToggle');
              if (clipNShipBtn.pressed === false) {
                clipNShipBtn.toggle(true);
              }
            },
            200,
            this
          );
        }
      },
    };

    // const fill = new Fill({
    //   color: 'rgba(255,154,0,0.5)',
    // });
    //
    // const style = new Style({
    //   stroke: new Stroke({
    //     color: [255, 154, 0, 1],
    //     width: 2,
    //   }),
    //   fill: fill,
    // });

    const mapInteraction = new DragBox({
      condition: always,
      // style: style,
    });

    mapInteraction.on('boxstart', function (event) {
      extendedTool.clearFeatures();
    });

    mapInteraction.on('boxend', function (event) {
      const mapPanelBlock = extendedTool.activeMapWindow.getReferencedBlock('cMapPanel');
      const map = mapPanelBlock.component.map;
      let geom = extendedTool.mapInteraction.getGeometry();
      const mapProjection = map.getView().getProjection().getCode();
      extendedTool.setFeature(geom.getExtent(), mapProjection);

      if (mapProjection !== 'EPSG:4326') {
        geom = geom.clone().transform(mapProjection, 'EPSG:4326');
      }
      let extent = geom.getExtent();

      const minx = extent[0];
      const miny = extent[1];
      const maxx = extent[2];
      const maxy = extent[3];

      // Update lat/long text boxes while preventing
      // their changed events from fireing.
      const component = this.component;
      const minLatTxtBox = component.query('[name=minLat]')[0];
      const maxLatTxtBox = component.query('[name=maxLat]')[0];
      const minLonTxtBox = component.query('[name=minLon]')[0];
      const maxLonTxtBox = component.query('[name=maxLon]')[0];
      minLatTxtBox.suspendEvents();
      minLatTxtBox.setValue(miny);
      minLatTxtBox.resumeEvents();
      maxLatTxtBox.suspendEvents();
      maxLatTxtBox.setValue(maxy);
      maxLatTxtBox.resumeEvents();
      minLonTxtBox.suspendEvents();
      minLonTxtBox.setValue(minx);
      minLonTxtBox.resumeEvents();
      maxLonTxtBox.suspendEvents();
      maxLonTxtBox.setValue(maxx);
      maxLonTxtBox.resumeEvents();

      extendedTool.lat.min = miny;
      extendedTool.lat.max = maxy;
      extendedTool.lon.min = minx;
      extendedTool.lon.max = maxx;

      const isValid = extendedTool.validateSelection();
      if (isValid) {
        const selectExtentBtn = Ext.getCmp('clipNShipToggle');
        selectExtentBtn.toggle(false);
      }
    });

    extendedTool.mapInteraction = mapInteraction;

    // No need to subscribe to map window created event
    // since the focused event is fired when created.
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

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const component = {
      extendedTool: extendedTool,
      title: 'Clip and Ship',
      collapsible: block.hasOwnProperty('collapsible') ? block.collapsible : true,
      collapsed: block.hasOwnProperty('collapsed') ? block.collapsed : true,
      componentCls: 'panel-border',
      grow: true,
      autoSize: true,
      border: 1,
      bodyCls: 'roundCorners',
      cls: 'padPanel',
      layout: 'vbox',
      items: [
        {
          xtype: 'button',
          text: 'Select Extent on Map',
          enableToggle: true,
          extendedTool: extendedTool,
          id: 'clipNShipToggle',
          listeners: {
            toggle: function () {
              if (this.pressed) {
                this.extendedTool.addMapInteraction();
              } else {
                this.extendedTool.removeMapInteraction();
              }
            },
          },
        },
        {
          xtype: 'tbtext',
          text: 'Latitude (dd):',
          style: { marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
        },
        {
          layout: {
            type: 'table',
            columns: 2,
          },
          width: '100%',
          columnWidth: '50%',
          items: [
            {
              extendedTool: extendedTool,
              xtype: 'textfield',
              name: 'minLat',
              emptyText: 'min',
              style: {
                marginRight: '3px',
              },
              listeners: {
                change: function (textbox, value) {
                  this.extendedTool.lat.min = value;
                  this.extendedTool.handleTextboxChange();
                },
              },
            },
            {
              extendedTool: extendedTool,
              xtype: 'textfield',
              name: 'maxLat',
              emptyText: 'max',
              listeners: {
                change: function (textbox, value) {
                  this.extendedTool.lat.max = value;
                  this.extendedTool.handleTextboxChange();
                },
              },
            },
          ],
        },
        {
          xtype: 'tbtext',
          text: 'Longitude (dd):',
          style: { marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
        },
        {
          layout: {
            type: 'table',
            columns: 2,
          },
          width: '100%',
          columnWidth: '50%',
          items: [
            {
              extendedTool: extendedTool,
              xtype: 'textfield',
              name: 'minLon',
              emptyText: 'min',
              style: {
                marginRight: '3px',
              },
              listeners: {
                change: function (textbox, value) {
                  this.extendedTool.lon.min = value;
                  this.extendedTool.handleTextboxChange();
                },
              },
            },
            {
              extendedTool: extendedTool,
              xtype: 'textfield',
              name: 'maxLon',
              emptyText: 'max',
              listeners: {
                change: function (textbox, value) {
                  this.extendedTool.lon.max = value;
                  this.extendedTool.handleTextboxChange();
                },
              },
            },
          ],
        },
        {
          xtype: 'tbtext',
          text: '',
          id: 'latLonValidationMessage',
          width: '100%',
          height: 0,
          style: { color: 'red', width: '100%', whiteSpace: 'normal' },
        },
        {
          layout: 'column',
          width: '100%',
          columnWidth: '50%',
          items: [
            {
              extendedTool: extendedTool,
              xtype: 'button',
              text: 'Clear',
              id: 'wcsDownloadClear',
              columnWidth: 0.5,
              style: {
                marginRight: '40px',
              },
              handler: function () {
                this.extendedTool.clearForm();
              },
            },
            {
              extendedTool: extendedTool,
              xtype: 'button',
              text: 'Download',
              id: 'wcsDownloadBtn',
              columnWidth: 0.5,
              disabled: true,
              style: {
                marginLeft: '15px',
              },
              handler: function () {
                const layersConfigId = globalThis.App.Layers.getConfigInstanceId();
                const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
                const layers = globalThis.App.Layers.query(layersConfig.overlays, {
                  type: 'layer',
                  display: true,
                  mask: false,
                  loadOnly: false,
                });

                if (layers.length === 0) return;
                let layer = null;
                let i = 0;
                const len = layers.length;
                for (; i < len; i += 1) {
                  if (layers[i].source.wcs) {
                    layer = layers[i];
                    break;
                  }
                }

                if (layer === null) return;

                const latMin = this.extendedTool.lat.min;
                const latMax = this.extendedTool.lat.max;
                const lonMin = this.extendedTool.lon.min;
                const lonMax = this.extendedTool.lon.max;

                const url =
                  layer.source.wcs +
                  '?service=WCS&request=GetCoverage&version=2.0.1&coverageId=' +
                  layer.name +
                  '&format=image/tiff&subset=Lat(' +
                  latMin +
                  ',' +
                  latMax +
                  ')&subset=Long(' +
                  lonMin +
                  ',' +
                  lonMax +
                  ')';
                const link = document.createElement('a');
                link.href = url;
                link.download = '';
                link.type = 'image/tiff';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              },
            },
          ],
        },
      ],
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;

          if (this.extendedTool.activeMapWindow !== null) {
            this.extendedTool.addVector();
          }
        },
      },
    };

    return component;
  },
};
