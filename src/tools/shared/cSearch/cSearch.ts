import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Geocoder from 'ol-geocoder';
import 'ol-geocoder/dist/ol-geocoder.min.css';
import { getBlocksByName } from '../../../helpers/extjs';
import { Control } from 'ol/control';

export const cSearch = {
  activeMapPanel: null,
  activeMapWindow: null,
  extendedTool: null,
  lockedWindows: null,
  originalPinExists: null,
  zoomLevel: 30,
  geoArray: [],
  geoPin: null,
  mapWindowCreated(postingObj) {
    cSearch.addSearch(postingObj);
  },
  mapWindowFocused(postingObj) {
    const currentWindow = postingObj.owningBlock;
    if (currentWindow) cSearch.activeMapWindow = currentWindow;
    const currentPanel = currentWindow.getReferencedBlock('cMapPanel');
    if (currentPanel) cSearch.activeMapPanel = currentPanel.component.map;
    if (cSearch.lockedWindows && cSearch.lockedWindows.length == 0) {
      cSearch.geoPin = null;
    }
  },
  removePin(evt) {
    let lockFlag = false;
    let mapID;
    // We post a focus event so that when the user clicks remove pin button it removes them from the correct window
    const mapWindowBlock = cSearch.activeMapWindow;
    const mapperWindow = mapWindowBlock.extendedTool;
    globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED, mapperWindow, cSearch.activeMapPanel);

    // If the focused map (where the clear pin button was clicked) is locked, lockFlag true to remove pin from all locked windows
    const evtPath = typeof evt.path !== 'undefined' ? evt.path : evt.composedPath();
    evtPath.forEach((element) => {
      if (element.className === 'clear-button') mapID = element.id;
    });

    if (cSearch.lockedWindows?.length) {
      cSearch.lockedWindows.forEach((window) => {
        if (mapID === window.id) lockFlag = true;
      });
    }

    if (lockFlag) {
      cSearch.lockedWindows.forEach((window) => {
        const mapPanel = window.getReferencedBlock('cMapPanel');
        const { map } = mapPanel.component;
        const searchLayer = cSearch.getSearchLayer(map);
        const geoLayer = cSearch.getGeoLayer(map);
        if (searchLayer) cSearch.removeFeatureLoop(searchLayer, false);
        if (geoLayer) cSearch.removeFeatureLoop(geoLayer, false);
      });
    } else {
      const mapWindows = getBlocksByName('cMapWindow');
      mapWindows.forEach((window) => {
        if (window.id === mapID) {
          const mapPanel = window.getReferencedBlock('cMapPanel');
          const searchLayer = cSearch.getSearchLayer(mapPanel.component.map);
          const geoLayer = cSearch.getGeoLayer(mapPanel.component.map);
          if (searchLayer) cSearch.removeFeatureLoop(searchLayer, false);
          if (geoLayer) cSearch.removeFeatureLoop(geoLayer, false);
        }
      });
    }
    cSearch.geoPin = null;
  },
  updateLockedWindows(lockedWindows) {
    cSearch.lockedWindows = lockedWindows;
    if (cSearch.lockedWindows.length > 0) {
      const mapPanelBlock = cSearch.lockedWindows[0].getReferencedBlock('cMapPanel');
      const { map } = mapPanelBlock.component;
      if (cSearch.geoPin == null || cSearch.geoPin.length == 0) {
        const vector = cSearch.getSearchLayer(map);
        if (vector) {
          const source = vector.getSource();
          cSearch.geoPin = source.getFeatures();
        } else cSearch.geoPin = null;
      }
    } else {
      cSearch.geoPin = null;
    }
    for (const window of cSearch.lockedWindows) {
      if (cSearch.geoPin[0]?.getGeometry().mapID === window.id) {
        cSearch.originalPinExists = true;
        break;
      } else {
        cSearch.originalPinExists = false;
      }
    }
    cSearch.sharePin();
  },
  getGeoLayer(map) {
    const layers = map.getLayers().array_;
    let vector;
    layers.forEach((layer) => {
      if (layer.values_?.name?.includes('geocoder-layer')) vector = layer;
    });
    return vector;
  },
  getSearchLayer(map) {
    const layers = map.getLayers().array_;
    let vector;
    layers.forEach((layer) => {
      if (layer.values_?.id?.includes('search')) vector = layer;
    });
    return vector;
  },
  searchButton(geoItem, mapWindow) {
    const mapPanelBlock = mapWindow.getReferencedBlock('cMapPanel');
    const { map } = mapPanelBlock.component;
    geoItem.on('addresschosen', function (evt) {
      map.getView().setCenter(evt.coordinate);
      const geoLayer = cSearch.getGeoLayer(map);
      if (geoLayer) cSearch.removeFeatureLoop(geoLayer, true); // we pass true to remove all but newest feature(pin), to prevent more than one pin per map
      const searchLayer = cSearch.getSearchLayer(map);
      if (searchLayer) {
        cSearch.removeFeatureLoop(searchLayer, false);
        const geoFeatures = geoLayer.getSource().getFeatures();
        searchLayer.getSource().addFeature(geoFeatures[0]); // use newest pin to add to source
      }
      searchLayer.getSource().getFeatures()[0].getGeometry().mapID = mapWindow.id;
      if (cSearch.lockedWindows !== null && cSearch.lockedWindows.some((item) => item == mapWindow)) {
        cSearch.geoPin = searchLayer.getSource().getFeatures()[0];
        cSearch.updateLockedWindows(cSearch.lockedWindows);
      } else {
        map.removeLayer(geoLayer);
      }
      map.getView().setZoom(cSearch.zoomLevel);
    });
  },
  removeFeatureLoop(layer, leaveOne) {
    const source = layer.getSource();
    const features = source.getFeatures();
    if (!leaveOne) {
      if (features.length > 0) {
        for (let k = 0; k < features.length; k++) {
          source.removeFeature(features[k]);
          features.shift();
        }
      }
    } else if (features.length > 1) {
      for (let j = 0; j < features.length - 1; j++) {
        source.removeFeature(features[j]);
        features.shift();
      }
    }
  },
  sharePin() {
    cSearch.lockedWindows.forEach((window) => {
      const mapPanelBlock = window.getReferencedBlock('cMapPanel');
      const { map } = mapPanelBlock.component;
      const vector = cSearch.getSearchLayer(map);
      if (vector) cSearch.removeFeatureLoop(vector, false);
      const geoLayer = cSearch.getGeoLayer(map);
      if (typeof geoLayer !== 'undefined') {
        map.removeLayer(geoLayer);
      }
      if (cSearch.geoPin?.length) {
        vector.getSource().addFeatures(cSearch.geoPin);
        if (cSearch.originalPinExists) {
          map.getView().setCenter(cSearch.geoPin[0].getGeometry().getCoordinates());
          map.getView().setZoom(cSearch.zoomLevel);
        }
      }
    });
  },
  addSearch(postingObj) {
    const mapWindow = !postingObj.hasOwnProperty('owningBlock') ? postingObj : postingObj.owningBlock;
    const mapPanelBlock = mapWindow.getReferencedBlock('cMapPanel');
    const { map } = mapPanelBlock.component;
    cSearch.activeMapPanel = map;

    const geo = new Geocoder('nominatim', {
      provider: 'osm',
      lang: 'en',
      placeholder: 'Search for ...',
      limit: 5,
      keepOpen: false,
      autoComplete: true,
      countrycodes: 'us',
    });
    map.addControl(geo);

    if (!cSearch.getSearchLayer(map)) {
      const vector = new VectorLayer({
        source: new VectorSource(),
      });
      vector.set('id', 'search');
      map.addLayer(vector);
    } // A new layer is created because ol-geocoder only creates a layer for pins after a search, meaning if user has yet to search on a new map it wouldn't have a layer to apply pins to

    cSearch.searchButton(geo, mapWindow);

    // const button = document.createElement('button');
    // button.innerHTML = 'Clear Pins';
    // button.className = 'clear-button';
    // button.addEventListener('click', cSearch.removePin);
    // button.id = mapWindow.id;
    // const element = document.createElement('div');
    // element.className = 'clear-pin ol-control';
    // element.appendChild(button);
    // const clearButtonControl = new Control({ element });
    // map.addControl(clearButtonControl);
  },
  createExtendedTool(owningBlock) {
    const extendedTool = {
      owningBlock,
    };
    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_SPATIAL_LOCKING_WINDOW_UPDATED,
      owningBlock.itemDefinition.updateLockedWindows,
      extendedTool
    );
    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_CREATED,
      owningBlock.itemDefinition.mapWindowCreated,
      owningBlock
    );
    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED,
      owningBlock.itemDefinition.mapWindowFocused,
      owningBlock
    );
    cSearch.extendedTool = extendedTool;
    return extendedTool;
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    if (typeof block.zoomLevel !== 'undefined') {
      cSearch.zoomLevel = block.zoomLevel;
    }
    const component = {
      extendedTool,
      listeners: {
        afterrender() {
          const mapWindow = getBlocksByName('cMapWindow');
          cSearch.addSearch(mapWindow[0]);
          cSearch.activeMapWindow = mapWindow[0];
        },
      },
    };
    return component;
  },
};
