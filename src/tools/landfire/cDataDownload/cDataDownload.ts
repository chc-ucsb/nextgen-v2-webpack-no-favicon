import VectorLayer from 'ol/layer/Vector';
import OverlayPositioning from 'ol/OverlayPositioning';
import { Dictionary, LayerConfig } from 'src/@types';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import { boundingExtent, extend, Extent, getCenter } from 'ol/extent';
import { Translate } from 'ol/interaction';
import { fromLonLat, ProjectionLike, toLonLat, transform } from 'ol/proj';
import Feature from 'ol/Feature';
import Polygon, { fromExtent } from 'ol/geom/Polygon';
import Collection from 'ol/Collection';
import { closestOnCircle, Coordinate } from 'ol/coordinate';
import { getBlocksByName } from '../../../helpers/extjs';
import { getArea } from 'ol/sphere';
import Overlay from 'ol/Overlay';
import GeoJSON from 'ol/format/GeoJSON';
import GeometryType from 'ol/geom/GeometryType';
import { inflateCoordinatesArray } from 'ol/geom/flat/inflate';
import Draw, { createBox } from 'ol/interaction/Draw';
import { truncateString, buildLabel, getRandomString } from '../../../helpers/string';
import './cDataDownload.css';
import gpsi from './gpsi';
import gjv from 'geojson-validation';

interface NodeData {
  style?: string;
  boxLabel?: string;
  name: string;
  inputValue?: string;
}

class Node {
  id: string;
  data: NodeData;
  radio: boolean;
  defaultChecked: boolean;
  selected: boolean;
  prevSelected: boolean;
  enabled: boolean;
  parent: Node;
  children: Array<Node>;
  purpose: any;
  metadataFile: string;
  nodeTest: boolean;
  /* Set the initial values for the node */
  constructor(data: NodeData, radio = false, dc = false, id = null) {
    this.id = id;
    this.data = data;
    this.radio = radio;
    this.defaultChecked = dc;
    this.selected = dc;
    this.prevSelected = dc;
    this.enabled = false;
    this.parent = null;
    this.children = [];
    this.purpose = null;
    this.metadataFile = null;
  }

  addParent(parent: Node): void {
    this.parent = parent;
    parent.children.push(this);
  }

  addChild(child: Array<Node> | Node): void {
    if (Array.isArray(child)) {
      this.children = this.children.concat(child);
      for (const el of child) {
        el.parent = this;
      }
    } else {
      this.children.push(child);
      child.parent = this;
    }
  }

  /* Add node and the node's children to the specified component
   Disable all  nodes that are children of another node
   */
  addToCmp(cmp): void {
    cmp.items.items = [];

    // For parent folder titles to appear in the checkboxgroup we create an array of objects, each one including the folder it should be under,
    // and a unique property 'downloadCategoryTitle' (layer.name could not be used due to MRLC not using wmstName) a flag is also set for ordering later.
    var categoriesAndLayers = [];

    categoriesAndLayers = globalThis.App.Layers.getCurrentLayersConfig();

    const sorted = [];

    categoriesAndLayers['overlays'][0].folder.forEach((folder) => {
      if (!folder.hasOwnProperty('pushToDownload')) {
        sorted.push({ folder: folder });
      }
    });

    var more = true;

    if (!sorted[0].folder.folder[0].folder) {
      more = false;
    }

    const sorted2 = [];

    if (more) {
      sorted[0].folder.folder[0].folder.forEach((folder) => {
        sorted2.push({ folder: folder });
      });
    }

    var more2 = true;

    if (!sorted2[0].folder.folder[0].folder) {
      more2 = false;
    }

    const layers = [];

    //get layers from the lowest level of folders
    sorted2.forEach((folder) => {
      folder.folder.folder.forEach((layer) => {
        layers.push({ title: layer.title });
      });
    });

    layers.forEach((layer) => {
      cmp.add({
        xtype: 'checkbox',
        boxLabel: layer['title'],
        name: layer['title'],
        hidden: false,
        add: true,
      });
    });
  }

  getChildren(): Array<Node> {
    const nodes = [];
    let q = this.children.concat(); // concat forces to set q by value and not reference
    while (Array.isArray(q) && q.length) {
      const node = q.pop();
      q = q.concat(node.children);
      nodes.push(node);
    }

    return nodes;
  }

  getSelectedChildren(): Array<Node> {
    const nodes = [];
    const q = this.children.concat(); // concat forces to set q by value and not reference
    while (Array.isArray(q) && q.length) {
      const node = q.pop();
      if (node.selected) {
        nodes.push(node);
      }
    }

    return nodes;
  }

  disableChildren(): Array<Node> {
    const nodes = [];
    let q = this.children.concat(); // concat forces to set q by value and not reference
    while (Array.isArray(q) && q.length) {
      const node = q.pop();
      q = q.concat(node.children);

      const cb = Ext.getCmp(node.id);
      cb.setValue(false);
      cb.disable();
      node.selected = false;
      node.enabled = false;
      nodes.push(node);
    }

    return nodes;
  }

  enableChildren(): Array<Node> {
    const nodes = [];
    let q = this.children.concat(); // concat forces to set q by value and not reference
    while (Array.isArray(q) && q.length) {
      const node = q.pop();
      q = q.concat(node.children);

      const cb = Ext.getCmp(node.id);
      cb.enable();
      node.enabled = true;
      if (node.defaultChecked) {
        cb.setValue(true);
        node.selected = true;
        nodes.push(node);
      }
    }
    return nodes;
  }

  removeChildren(): void {
    const q = this.children;
    while (Array.isArray(q) && q.length) {
      let node = q.pop();
      for (const child of node.children) {
        q.push(child);
      }
      node = null;
    }
  }

  getSiblings(): Array<Node> {
    if (this.parent !== null) {
      // concat forces to set children by value and not reference
      const children = this.parent.children.concat();
      children.forEach((child, idx) => {
        // don't count node as a sibling of itself; remove it
        if (child === this) {
          children.splice(idx, 1);
        }
      });
      return children;
    }
    return [];
  }

  /* Forces the siblings of the node to act like radio buttons
   EXTjs is not touched here, instead we only set the
   value of this node and its siblings based upon the value
   it held before as well as the value of the sibling nodes.
   */
  radioBehavior(): Array<Node> {
    // only perform this function if it is enabled and is to act like a radio button
    if (this.radio && this.enabled) {
      const sibs = this.getSiblings();
      if (this.selected === true) {
        for (const sib of sibs) {
          sib.selected = false;
        }
        return sibs;
      }
      let keep = null;
      let count = 0;
      for (const sib of sibs) {
        if (sib.selected === false) {
          count += 1;
        }
        if (sib.prevSelected === true || sib.defaultChecked === true) {
          keep = sib;
        }
      }
      if (count === sibs.length) {
        if (keep == null) {
          if (this.prevSelected === true || this.defaultChecked === true) {
            keep = this;
            keep.selected = true;
          }
          return [keep];
        }
      }
    }
    return [];
  }

  getNodeByDataName(name: string): Node | boolean {
    const q = this.children.concat(); // concat forces to set q by value and not reference
    while (Array.isArray(q) && q.length) {
      const node = q.pop();
      if (node.data.name === name) {
        return node;
      }
    }
    return false;
  }
}

export const cDataDownload = {
  options: {
    events: ['collapse', 'expand'],
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
  },
  mapWindowCreated(postingObj: Dictionary, callbackObj: Dictionary): void {
    const mapWindow = postingObj;
    const extendedTool = callbackObj;

    /*
     * enables form items if it was previously disabled by
     * all map windows being closed.
     */
    const tools = Ext.getCmp('cTools');
    const toolCheck = setInterval(() => {
      if (tools.rendered) {
        extendedTool.enableForm();
        clearInterval(toolCheck);
      }
    }, 1000);

    extendedTool.activeMapWindow = mapWindow.owningBlock;

    /*
     * Checks if the interaction was added to the last map window
     * and if so, add it to the newly selected map window.
     */
    if (extendedTool.interactionAdded === true) {
      extendedTool.addMapInteraction();
    }

    const mapWindows = getBlocksByName('cMapWindow');

    if (mapWindows.length === 1) {
      /*
       * If this is the only map window then there were previously
       * no windows. We should make sure the form is up to date with
       * the box on the map.
       */
      extendedTool.updateTextBoxCoords();
    }
    extendedTool.activeMapWindow.on(
      'click',
      function (callbackObj, postingObj, event) {
        const extendedTool = callbackObj;
        const mapperWindow = postingObj;

        extendedTool.mapClickListenerCallbackFunction(event, mapperWindow);
      },
      extendedTool
    );

    extendedTool.addVector();
  },
  mapWindowFocused(postingObj: Dictionary, callbackObj: Dictionary): void {
    const mapWindow = postingObj;
    const extendedTool = callbackObj;
    extendedTool.activeMapWindow = mapWindow.owningBlock;
    extendedTool.activeMapWindow.toolbarItems.forEach((element) => {
      if (element.blockConfig.name == 'cDataDownloadBtn') {
        const downloadButton = Ext.getCmp(element.extendedTool.uniqueId);
        if (downloadButton.pressed) {
          const source = extendedTool.getCurrentMapVectorSource();
          const drawItems = source.getFeatures();
          drawItems.forEach((drawItem) => {
            if (drawItem.values_.id === 'dataDownloadBox') {
              extendedTool.fetchCategories();
            }
          });
          extendedTool.createDrawInteraction();
        }
      }
    });
    extendedTool.updateBBoxCategories();
    extendedTool.updateTextBoxCoords();
  },
  mapWindowDestroyed(postingObj: Dictionary, callbackObj: Dictionary, eventObj): void {
    const extendedTool = callbackObj;
    const mapWindows = getBlocksByName('cMapWindow');
    const winlen = mapWindows.length;
    if (winlen === 1) {
      // If there is only one map window when this event is called
      // then that means the map window is about to be destroyed so
      // there WILL be no map windows after this callback executes.
      extendedTool.disableForm();
      extendedTool.activeMapWindow = null;
      extendedTool.updateBBoxCategories();
    } else if (eventObj.owningBlock.id !== mapWindows[0].id) {
      [extendedTool.activeMapWindow] = mapWindows;
    } else if (eventObj.owningBlock.id !== mapWindows[winlen - 1].id) {
      extendedTool.activeMapWindow = mapWindows[winlen - 1];
    }
  },

  createExtendedTool(owningBlock) {
    // Get the default focused map window on app load.
    const [mapWindow = null] = getBlocksByName('cMapWindow');
    //const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const highlightStyle = new Style({
      fill: new Fill({
        color: 'rgba(236,100,100,0.7)',
      }),
      stroke: new Stroke({
        color: '#e5043b',
        width: 1.25,
      }),
    });
    // Default style set for the vector polygons
    const regularStyle = new Style({
      fill: new Fill({ color: 'rgba(0,0,0,0)' }),
      stroke: new Stroke({
        color: '#000000',
        width: 1.25,
      }),
    });
    const extendedTool = {
      toggleGroupId: mapWindow.extendedTool.toggleGroupId,
      qsource: null,
      rsource: null,
      owningBlock,
      activeMapPanel: null,
      activeMapWindow: mapWindow,
      measureTooltipElement: null,
      measureTooltip: null,
      area: null,
      currentFeature: null,
      requestJSONStr: [],
      allCats: [],
      layers_with_extent: [],
      polygonExtent: null,
      categoryArray: [],
      geoJsonStr: null,
      userGeoJSON: null,
      panelMask: null,
      scrollPosition: null,
      scrollPosition2: null,
      interactionAdded: false,
      xmlRequestComplete: true,
      bboxIsValid: false,
      downloadPanelToggle: false,
      templateIsActive: false,
      bboxSize: 0,
      categories: [],
      selectedCategories: [],
      precision: 5,
      email: '',
      projectionOption: 'Standard',
      selectedFeature: {},
      lat: {
        min: null,
        max: null,
      },
      lon: {
        min: null,
        max: null,
      },
      hyp: null,
      a1: null,
      a2: null,
      // potentially configurable variables
      lew: 274, // landsat scene size east to west in km (183)
      lns: 255, // landsat scene size north to south in km (170)
      R: 6371, // average radius of the Earth in km
      // variables based upon the variables above
      createDefaultVars(): void {
        this.rootNode = new Node({ name: 'root' });
      },
      getCurrentMap(): Dictionary {
        const mapPanelBlock = this.activeMapWindow?.getReferencedBlock('cMapPanel');
        let map = null;
        if (mapPanelBlock) {
          map = mapPanelBlock.component.map;
        }

        return map;
      },

      // update version selector based on the region
      reconfigureVersionSelector(): void {
        this.selectedVersionId = globalThis.App.Layers.getSelectedVersion();
        this.selectedRegionId = globalThis.App.Layers.getSelectedRegion();
        this.version_region = this.selectedVersionId + '_' + this.selectedRegionId;
        const versionSelector = Ext.getCmp('selectVersionCombo');

        // Update the store
        const versionConfigs = globalThis.App.Config.sources.versions;
        const data = [];

        // Using a Set will remove any duplicate items, and Array.from converts that Set back into an array.
        const versionsForRegion = Array.from(
          new Set(
            globalThis.App.Layers.query(
              globalThis.App.Config.sources.layers,
              function (item) {
                if (item.versionId !== undefined && item.regionId === globalThis.App.Layers.getSelectedRegion()) return true;
                return false;
              },
              ['overlays']
            ).map((item) => item.versionId)
          )
        );

        for (let i = 0, len = versionConfigs.length; i < len; i += 1) {
          const versionConfig = versionConfigs[i];

          if (versionsForRegion.includes(versionConfig.id)) {
            data.push({
              value: versionConfig.id,
              text: versionConfig.title,
            });
          }
        }

        const store = Ext.create('Ext.data.Store', {
          fields: ['value', 'text'],
          data,
        });

        versionSelector.bindStore(store);
      },

      reconfigureDownloadTOC(): void {
        let TOCJSON = [];
        const titleLength = 70;
        var versionConfig = [];
        const tocExtendedTool = Ext.getCmp('downloadTOCTree');
        const versionCombo = Ext.getCmp('selectVersionCombo');
        let selectedVersionId = versionCombo.getValue();
        let selectedRegionId = globalThis.App.Layers.getSelectedRegion();
        let version_region = selectedVersionId + '_' + selectedRegionId;
        const versionRegionConfig = globalThis.App.Layers.getVersionRegionConfig();
        let config = versionRegionConfig[version_region];
        extendedTool.layers_with_extent = [];

        extendedTool.reconfigureVersionSelector();

        // Check if extendedTool.categories contains entries from extendedTool.allCats
        const hasItem = extendedTool.allCats.some((val) => Object.keys(extendedTool.categories).includes(val));

        if (hasItem) {
          config.overlays[0].folder.forEach((folder) => {
            if (!folder.hasOwnProperty('pushToDownload')) {
              versionConfig.push(folder);
            }
          });

          config.boundaries.forEach((folder) => {
            if (!folder.hasOwnProperty('pushToDownload')) {
              versionConfig.push(folder);
            }
          });

          const newVersionConfig = extendedTool.enableLayerMasking(versionConfig);

          const overlays = this.parseLayers(newVersionConfig, undefined, undefined, titleLength);

          TOCJSON = TOCJSON.concat(overlays);

          var store = Ext.create('Ext.data.TreeStore', {
            id: 'downloadTOCTree',
            rootVisible: false,
            lines: true,
            hideHeaders: true,
            root: {
              expanded: false,
              children: TOCJSON,
            },
            listeners: {
              checkchange() {
                extendedTool.toggleDownloadBtn();
                const panel = Ext.getCmp('parentPanel');
                panel.body.scrollTo('top', extendedTool.scrollPosition);
              },
              beforeitemclick() {
                const panel = Ext.getCmp('parentPanel');
                extendedTool.scrollPosition2 = panel.body.getScrollTop();
              },
              afterlayout() {
                const panel = Ext.getCmp('parentPanel');
                panel.body.scrollTo('top', extendedTool.scrollPosition2);
              },
            },
          });
          tocExtendedTool.reconfigure(store);
          const downloadTOC = Ext.getCmp('downloadTOCTree');
          downloadTOC.show();
        }
      },

      /*
       * Masks layers in the download TOC if the AOI extent
       * does not match with the layer extent.
       */
      enableLayerMasking(versionConfig) {
        var newVersionConfig = [];
        const elementTitle = extendedTool.owningBlock.blockConfig.hasOwnProperty('workspace')
          ? extendedTool.owningBlock.blockConfig.workspace
          : 'landfire';

        versionConfig.forEach((element) => {
          if (element.type === 'folder') {
            const newLayer = JSON.parse(JSON.stringify(element));
            newLayer.folder = extendedTool.enableLayerMasking(newLayer.folder);
            if (newLayer.folder.length > 0) {
              newVersionConfig.push(newLayer);
            }
          } else if (element.type === 'layer') {
            // Check if the layer is in the list of layers in the categories object.
            const layerCheck = Object.values(extendedTool.categories)
              .flat()
              .find((item) => element.name.includes(item.src_file) || element.name.includes(item.clpd_rstr));

            if (layerCheck) {
              newVersionConfig.push(JSON.parse(JSON.stringify(element)));
            }
          }
        });

        return newVersionConfig;
      },

      /*
       * Shows the selected extent in the map after the user drags
       * a box or adds coordinates manually.
       */

      extentIsEmpty(extent = this.getCurrentMapVectorSource().getExtent()): boolean {
        for (const v of extent) {
          if (v) {
            return false;
          }
        }
        return true;
      },

      // makes sure extent is a finite number and that minimum longitude/latitude does not meet the maximum longitude/latitude
      extentIsValid(extent: Extent = this.getCurrentMapVectorSource().getExtent()): boolean {
        if (extent[0] === extent[2] || extent[1] === extent[3]) {
          return false;
        }
        for (const extentValue of extent) {
          if (!Number.isFinite(Number(extentValue))) {
            return false;
          }
        }

        return true;
      },
      extentTooBig(area) {
        if (extendedTool.owningBlock.blockConfig.hasOwnProperty('maxArea') && area > extendedTool.owningBlock.blockConfig.maxArea) {
          return true;
        }
        return false;
      },
      // basic email validation
      emailIsValid(email: string): boolean {
        /*
         * make sure that string follows basic email format
         * if there are spaces we probably have an invalid email
         */
        if (/[^@]+@[^@]+\.[^@]+/.test(email) && /\s+/.test(email) === false) {
          return true;
        }

        return false;
      },
      /*
       * make sure the text
       *  only enable the donwload button if we have selected categories and an email
       *  and if the extent is valid
       */
      toggleDownloadBtn(): void {
        const tocExtendedTool = Ext.getCmp('downloadTOCTree');
        const drawCombo = Ext.getCmp('drawCombo');
        const selectedChildren = tocExtendedTool.getChecked();
        if (drawCombo.value === 'GeoJSON' || drawCombo.value === 'Template') {
          if (this.emailIsValid(this.email) && selectedChildren.length > 0) {
            this.enableDownloadBtn();
          } else this.disableDownloadBtn();
        } else {
          if (this.emailIsValid(this.email) && this.extentIsValid() && this.bboxIsValid && selectedChildren.length > 0) {
            this.enableDownloadBtn();
          } else {
            this.disableDownloadBtn();
          }
        }
      },
      disableDownloadBtn(): void {
        const downloadBtn = this.component.query('#wcsDownloadBtn')[0];
        downloadBtn.disable();
      },
      enableDownloadBtn(): void {
        const downloadBtn = this.component.query('#wcsDownloadBtn')[0];
        downloadBtn.enable();
      },
      /*
       * disables and enables entire form except for the
       * download button since that is handled separately.
       */
      disableForm(): void {
        this.clearForm();
        const { component } = this;
        const minLatTxtBox = component.query('[name=minLat]')[0];
        const maxLatTxtBox = component.query('[name=maxLat]')[0];
        const minLonTxtBox = component.query('[name=minLon]')[0];
        const maxLonTxtBox = component.query('[name=maxLon]')[0];
        Ext.getCmp('wcsDownloadClear').disable();
        minLatTxtBox.disable();
        maxLatTxtBox.disable();
        minLonTxtBox.disable();
        maxLonTxtBox.disable();
      },
      enableForm(): void {
        const { component } = this;
        const minLatTxtBox = component.query('[name=minLat]')[0];
        const maxLatTxtBox = component.query('[name=maxLat]')[0];
        const minLonTxtBox = component.query('[name=minLon]')[0];
        const maxLonTxtBox = component.query('[name=maxLon]')[0];
        minLatTxtBox.enable();
        maxLatTxtBox.enable();
        minLonTxtBox.enable();
        maxLonTxtBox.enable();

        const extent: Extent = [this.lon.min, this.lat.min, this.lon.max, this.lat.max];
        if (this.extentIsValid(extent)) {
          if (this.extentTooBig(extendedTool.area)) {
            Ext.getCmp('redirectDownloadText').show();
          }
          if (extendedTool.owningBlock.blockConfig.redirectText) {
            Ext.getCmp('redirectDownloadText').hide();
          }
        } else {
          this.clearForm();
          this.toggleDownloadBtn();
        }

        Ext.getCmp('wcsDownloadClear').enable();
      },
      clearForm(): void {
        const email = Ext.getCmp('Email');
        email.setValue('');
        extendedTool.projectionOption = 'Standard';
        const projectionCombo = Ext.getCmp('projectionCombo');
        projectionCombo.setValue('NAD 1983 Albers (Standard)');

        this.reconfigureDownloadTOC();
        extendedTool.requestJSONStr = [];
        extendedTool.categoryArray = [];

        const { component } = this;
        const minLatTxtBox = component.query('[name=minLat]')[0];
        const maxLatTxtBox = component.query('[name=maxLat]')[0];
        const minLonTxtBox = component.query('[name=minLon]')[0];
        const maxLonTxtBox = component.query('[name=maxLon]')[0];
        minLatTxtBox.reset();
        maxLatTxtBox.reset();
        minLonTxtBox.reset();
        maxLonTxtBox.reset();
      },
      /*
       * add and remove vector functions
       * if nothing provided; will add this.vector
       */
      removeVector(): void {
        const vector = this.getCurrentMapVectorSource();
        const map = this.getCurrentMap();
        map.removeLayer(vector);
      },
      addVector(): void {
        const vector = new VectorLayer({
          source: new VectorSource(),
          style: [
            new Style({
              stroke: new Stroke({
                color: 'rgba(0,0,255,1)',
                width: 2,
              }),
              fill: new Fill({
                color: 'rgba(0,0,0,0.3)',
              }),
            }),
          ],
        });
        vector.set('id', 'dataDownload');
        const map = this.getCurrentMap();
        map.addLayer(vector);
      },
      addMapInteraction(): void {
        const panelWindows = getBlocksByName('cMapWindow');
        for (const panelWindow of panelWindows) {
          const mapPanelBlock = panelWindow.getReferencedBlock('cMapPanel');
          const { map } = mapPanelBlock.component;
          map.addInteraction(this.mapInteraction);
        }
        this.interactionAdded = true;
      },
      removeMapInteraction(): void {
        const panelWindows = getBlocksByName('cMapWindow');
        for (const panelWindow of panelWindows) {
          const mapPanelBlock = panelWindow.getReferencedBlock('cMapPanel');
          const { map } = mapPanelBlock.component;
          map.removeInteraction(this.mapInteraction);
        }
        this.interactionAdded = false;
      },
      getCurrentMapVectorSource(): any {
        const layers = extendedTool.getCurrentMap()?.getLayers().array_;
        let vector;
        if (layers) {
          layers.forEach((layer) => {
            if (layer.values_.id && layer.values_.id === 'dataDownload') vector = layer;
          });
        }
        if (vector) return vector.getSource();
        else return false;
      },
      createMeasureTooltip(): void {
        if (this.measureTooltipElement) {
          this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'tooltip tooltip-measure';
        const drawCombo = Ext.getCmp('drawCombo');
        if (drawCombo.value === 'Rectangle' || drawCombo.value === 'GeoJSON') {
          this.measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: OverlayPositioning.BOTTOM_CENTER,
          });
        } else if (drawCombo.value === 'Polygon') {
          this.measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: OverlayPositioning.CENTER_LEFT,
          });
        }

        this.getCurrentMap().addOverlay(this.measureTooltip);
      },

      createTranslate(): void {
        this.mapInteraction = new Translate({
          features: new Collection([this.feature]),
        });
        /*
         * this method is changing the coordinates as the polygon is being translated
         * extended periods of dragging or dragging at highly zoomed in levels leads to the mouse separating from the polygon
         */
        this.mapInteraction.on(
          'translating',
          function () {
            const source = extendedTool.getCurrentMapVectorSource();
            const extent = source.getExtent();
            const featur = source.getFeatures();
            const geom = featur[0].getGeometry() as Polygon;
            const center = getCenter(extent);

            const points = extendedTool.getWrappedBoxCoordinates('center', center);

            // by getting the bounding extent we can create a rectangle instead of a trapezoid
            const newext = boundingExtent([points[0], points[1], points[2], points[3]]);
            const np1 = [newext[2], newext[3]];
            const np2 = [newext[2], newext[1]];
            const np3 = [newext[0], newext[1]];
            const np4 = [newext[0], newext[3]];
            geom.setCoordinates([[np1, np2, np3, np4]]);

            extendedTool.updateTextBoxCoords(false);
          },
          extendedTool
        );
        // when we are done dragging we want to update the available categories for download
        this.mapInteraction.on(
          'translateend',
          function () {
            extendedTool.updateBBoxCategories();
          },
          extendedTool
        );

        this.addMapInteraction();
      },

      createDrawInteraction(typeOfDrawing?: string): void {
        let selfIntersectingPolygon = false;
        const latText = Ext.getCmp('latText');
        const lonText = Ext.getCmp('lonText');
        const lats = Ext.getCmp('latitudes');
        const lons = Ext.getCmp('longitudes');
        // remove any existing drawing that the user might have drawn.
        const map = this.getCurrentMap();
        //map.getOverlays().clear();
        const drawItems = map.getInteractions();

        drawItems.array_.forEach((item) => {
          if (item.customID) {
            map.removeInteraction(item);
          }
        });

        // remove any previous features that the user might have drawn
        const source = this.getCurrentMapVectorSource();
        let draw;
        let convertToMiles = extendedTool.owningBlock.blockConfig.convertToMiles;

        if (typeOfDrawing === 'Polygon') {
          draw = new Draw({
            source: new VectorSource(),
            type: GeometryType.POLYGON,
          });
        } else if (typeOfDrawing === 'Rectangle') {
          draw = new Draw({
            source: new VectorSource(),
            type: GeometryType.CIRCLE,
            geometryFunction: createBox(),
          });
        } else {
          draw = new Draw({
            source: new VectorSource(),
            type: GeometryType.CIRCLE,
            geometryFunction: createBox(),
          });
        }
        draw.customID = 'test';
        this.getCurrentMap().addInteraction(draw);

        draw.on('drawstart', function (evt) {
          const GeoJSON = Ext.getCmp('GeoJSON');
          GeoJSON.setValue('');
          extendedTool.getCurrentMap().getOverlays().clear();
          extendedTool.createMeasureTooltip();

          //  remove any previous drawings
          const drawItems = source.getFeatures();
          drawItems.forEach((drawItem) => {
            if (drawItem.values_.id === 'dataDownloadBox') source.removeFeature(drawItem);
          });
          const sketch = evt.feature;
          this.listener = sketch.getGeometry().on('change', function (evt) {
            const geom = evt.target;
            let output;
            let display;
            const area = getArea(geom);
            extendedTool.area = Math.floor((area / 1000000) * 100) / 100;

            if (convertToMiles) {
              display = Math.floor((area / 1000000 / 2.59) * 100) / 100;
              extendedTool.measureTooltipElement.innerHTML = `${display}mi<sup>2</sup>`;
            } else {
              display = Math.floor((area / 1000000) * 100) / 100;
              extendedTool.measureTooltipElement.innerHTML = `${display}km<sup>2</sup>`;
            }

            // get the size of the drawing that the user draws.
            extendedTool.bboxSize = output;
            const tooltipCoord = geom.getInteriorPoint().getCoordinates();
            if (extendedTool.measureTooltipElement == null) extendedTool.createMeasureTooltip();
            extendedTool.measureTooltip.setPosition(tooltipCoord);
          });
        });

        draw.on('drawend', function (evt) {
          const refetchButton = Ext.getCmp('refetchProducts');
          refetchButton.hide();

          // to make sure the AOI corresponds to the active region.
          const currentRegion = Ext.getCmp('cRegionTool').value;
          const regions = globalThis.App.Config.sources.regions;
          const currentRegionExtent = regions.find((x) => x.id === currentRegion).bbox;
          let tempPolygon = fromExtent(currentRegionExtent);
          const regionFeature = new Feature({
            geometry: tempPolygon,
          });
          const geom = evt.feature.getGeometry();
          if (!regionFeature.getGeometry().intersectsExtent(geom.getExtent())) {
            alert('The AOI is not associated with the current extent. Please pan over to the appropriate extent.');
            Ext.getCmp('noBoxText').hide();
            Ext.getCmp('redirectDownload').hide();
            Ext.getCmp('redirectDownloadText').hide();
            Ext.getCmp('dataDownloadPanel').hide();
          } else {
            var extent = geom.getExtent();
            const coord = (geom as Polygon).getCoordinates();
            const feature = new Feature({
              geometry: new Polygon(coord),
            });
            feature.set('id', 'dataDownloadBox');
            extendedTool.currentFeature = feature;
            const source = extendedTool.getCurrentMapVectorSource();
            source.addFeature(feature);
            extendedTool.hidePanelItems(extent);
            const writer = new GeoJSON();
            const EPSG3587JsonStr = JSON.parse(writer.writeFeatures([feature]));
            extendedTool.userGeoJSON = JSON.stringify(EPSG3587JsonStr);

            // check for self intersecting polygon.
            var options = {
              reportVertexOnVertex: false,
              useSpatialIndex: false,
            };
            var isects = gpsi(
              EPSG3587JsonStr.features[0],
              function filterFn(isect) {
                return [isect];
              },
              options
            );
            if (isects.length == 0) {
              selfIntersectingPolygon = false;
              extendedTool.updateTextBoxCoords();
            } else {
              selfIntersectingPolygon = true;
              alert('Cannot draw a self intersecting polygon. Please try again.');
              map.getOverlays().clear();

              // remove any previous features that the user might have drawn
              const featureItems = source.getFeatures();
              featureItems.forEach((drawItem) => {
                if (drawItem.values_.id === 'dataDownloadBox') source.removeFeature(drawItem);
              });
            }

            // if (extendedTool.bboxSize <= extendedTool.owningBlock.blockConfig.maxArea && selfIntersectingPolygon === false)
            //   extendedTool.activeMapPanel.extendedTool.maskComponent('Fetching Datasets ...');
            extendedTool.measureTooltipElement.className = 'tooltip tooltip-static';
            const drawCombo = Ext.getCmp('drawCombo');
            if (drawCombo.value === 'Rectangle') {
              extendedTool.updateTextBoxCoords();
              extendedTool.measureTooltip.setOffset([0, -7]);

              latText.setVisible(true);
              lonText.setVisible(true);
              lats.setVisible(true);
              lons.setVisible(true);
            } else if (drawCombo.value === 'Polygon') {
              extendedTool.measureTooltip.setOffset([0, -10]);

              latText.setVisible(false);
              lonText.setVisible(false);
              lats.setVisible(false);
              lons.setVisible(false);
            }
            //extendedTool.measureTooltipElement = null; // unset tooltip so that a new one can be created
            const GeoJson = Ext.getCmp('GeoJSON');
            const GeoJSONText = Ext.getCmp('GeoJSONText');
            GeoJson.setVisible(false);
            GeoJSONText.setVisible(false);
            const tocExtendedTool = Ext.getCmp('downloadTOCTree');
            const selectedChildren = tocExtendedTool.getChecked();

            const noDataLayers = [];
            const check = [];

            const features = extendedTool.getCurrentMapVectorSource().getFeatures();
            let ddFeature = features.filter((x) => {
              if (x.values_?.id == 'dataDownloadBox') return x;
            });
            let copyFeature = ddFeature[0].clone(); // If we use the original any subsequent downloads with the same feature will be transformed more than once, breaking the coords
            //geom.transform(mapProj, sourceProj);
            extendedTool.geoJsonStr = JSON.parse(writer.writeFeatures([copyFeature]));

            extendedTool.fetchCategories();
          }
        });
      },

      fetchCategories(polygonFeature?) {
        //const categoryText = Ext.getCmp('categoryText');
        const downloadTOC = Ext.getCmp('downloadTOCTree');
        downloadTOC.hide();
        //categoryText.show();
        //categoryText.setText('Fetching Categories...');
        extendedTool.panelMask = new Ext.LoadMask(Ext.getCmp('dataDownloadPanel').el, { msg: 'Retrieving Available Products...' });
        extendedTool.panelMask.show();
        const lssource = this.getCurrentMapVectorSource();
        let extent: Extent = [null, null, null, null];
        if (lssource) {
          extent = lssource?.getExtent();
        }

        let polygon = extendedTool.getPolygonFeature();
        if (polygon === undefined) {
          extendedTool.polygonExtent = polygonFeature;
          extent = polygonFeature;
          let layers = this.getDownloadLayers();
          if (!layers.length) {
            layers = this.getLayers();
          }
          const geoserver = extendedTool.owningBlock.blockConfig.geoserver ? extendedTool.owningBlock.blockConfig.geoserver : layers[0].source.wfs;
          const shapeFile = extendedTool.owningBlock.blockConfig.shapeFile ? extendedTool.owningBlock.blockConfig.shapeFile : layers[0].name;

          extendedTool.downloadPanelToggle = true;

          const baseurl = `${geoserver}request=GetFeature&version=1.1.0&typeName=${shapeFile}&BBOX=`;
          const url = `${baseurl + extent[0]},${extent[1]},${extent[2]},${extent[3]}`;

          this.getXML(this, url);
        } else extendedTool.polygonExtent = polygon.getGeometry().getExtent();
        const geom = polygon?.getGeometry();
        const area = geom ? getArea(geom) / 1000000 : undefined;

        if (area <= extendedTool.owningBlock.blockConfig.maxArea) {
          let layers = this.getDownloadLayers();
          if (!layers.length) {
            layers = this.getLayers();
          }
          const geoserver = extendedTool.owningBlock.blockConfig.geoserver ? extendedTool.owningBlock.blockConfig.geoserver : layers[0].source.wfs;
          const shapeFile = extendedTool.owningBlock.blockConfig.shapeFile ? extendedTool.owningBlock.blockConfig.shapeFile : layers[0].name;

          extendedTool.downloadPanelToggle = true;

          const baseurl = `${geoserver}request=GetFeature&version=1.1.0&typeName=${shapeFile}&BBOX=`;
          const url = `${baseurl + extent[0]},${extent[1]},${extent[2]},${extent[3]}`;

          this.getXML(this, url);
        }
      },

      getPolygonFeature(): any {
        const source = extendedTool.getCurrentMapVectorSource();
        if (source) {
          const polygons = source.getFeatures().filter((x) => {
            if (x.values_?.id == 'dataDownloadBox') return x;
          });
          return polygons[0];
        } else {
          return undefined;
        }
      },

      parseXMLforCategories(request: XMLHttpRequest) {
        const xmlDoc = request.responseXML; // the xml itself
        extendedTool.activeMapPanel.extendedTool.unMaskComponent();
        var k = 0;

        // this grabs the whole array, but we only need one value? Is there a better way to do this? Does this even take enough time to be concerned about?
        let downloadLayers = this.getDownloadLayers();
        let layers = this.getLayers();

        let lyrs = downloadLayers;
        if (!downloadLayers.length) {
          lyrs = layers;
        }
        const elementTitle = extendedTool.owningBlock.blockConfig.hasOwnProperty('workspace')
          ? extendedTool.owningBlock.blockConfig.workspace
          : lyrs[0]?.name.split(':')[0];

        /*
         * categoryTags: the name of the category that the dataset belongs to (Science Products, Impervious, Land Cover, etc.)
         * srcMeta: the name of the source metadata file (usually the file/layer name with the processing date part removed)
         * clpdRstr: the name of the clipped raster file as it appears on disk
         * srcRaster: the SRC Raster filename that corresponds to the selected layer
         * srcMetadata: the metadata filename that corresponds to the selected layer
         */
        const categoryTags = xmlDoc.getElementsByTagName(`${elementTitle}:category`);
        const srcMeta = xmlDoc.getElementsByTagName(`${elementTitle}:src_meta`);
        const clpdRstr = xmlDoc.getElementsByTagName(`${elementTitle}:clpd_rstr`);
        const srcFolder = xmlDoc.getElementsByTagName(`${elementTitle}:src_folder`);
        const srcFile = xmlDoc.getElementsByTagName(`${elementTitle}:src_file`);
        const srcMetadata = xmlDoc.getElementsByTagName(`${elementTitle}:clpd_meta`);
        const srcProj = xmlDoc.getElementsByTagName(`${elementTitle}:src_proj`);
        const metadataArr = xmlDoc.getElementsByTagName(`${elementTitle}:metadata`);
        const maxBBoxSize = xmlDoc.getElementsByTagName(`${elementTitle}:maxBboxSiz`);
        const extent = xmlDoc.getElementsByTagName(`${elementTitle}:extent`);
        var cat = null;
        var validExtents = [];

        for (let m = 0; m < extent.length; m++) {
          if (extent[m]['innerHTML'] !== '') {
            validExtents.push(extent[m]);
          }
        }

        /*
         * mcat is the category name with no spaces and all lower case ("machine" name category)
         * cat is the category
         * dat contains an array of the dataset name, the filename and the metadata filename respectively
         */
        for (let i = 0; i < categoryTags.length; i += 1) {
          cat = categoryTags[i].childNodes[0].nodeValue;

          extendedTool.allCats.indexOf(cat) === -1 ? extendedTool.allCats.push(cat) : null;

          const category = categoryTags[i]?.childNodes[0]?.nodeValue ? categoryTags[i]?.childNodes[0]?.nodeValue : null;
          const clippedRasterName = clpdRstr[i]?.childNodes[0]?.nodeValue ? clpdRstr[i]?.childNodes[0]?.nodeValue : null;
          const sourceFolderName = srcFolder[i]?.childNodes[0]?.nodeValue ? srcFolder[i]?.childNodes[0]?.nodeValue : null;
          const sourceFileName = srcFile[i]?.childNodes[0]?.nodeValue ? srcFile[i]?.childNodes[0]?.nodeValue : null;
          const sourceMetadata = srcMetadata[i]?.childNodes[0]?.nodeValue ? srcMetadata[i]?.childNodes[0]?.nodeValue : null;
          const metadataarray = metadataArr[i]?.childNodes[0]?.nodeValue ? metadataArr[i]?.childNodes[0]?.nodeValue : null;

          let isWMST = false;
          for (let j = 0; j < layers.length; j++) {
            if (
              layers[j].name?.includes(clippedRasterName) ||
              layers[j].wmstName?.includes(clippedRasterName) ||
              layers[j].name?.includes(sourceFolderName) ||
              layers[j].wmstName?.includes(sourceFolderName)
            ) {
              isWMST = layers[j]?.isWMST;
              break;
            }
          }

          var dat;
          // these values are used when forming json data to the server for processing
          if (category.toLowerCase().startsWith('modfis')) {
            const extentValue = validExtents[k]?.childNodes[0]?.nodeValue ? validExtents[k]?.childNodes[0]?.nodeValue : null;

            dat = {
              category: category,
              clpd_rstr: clippedRasterName,
              src_folder: sourceFolderName,
              src_file: sourceFileName,
              src_meta: sourceMetadata,
              metadata: metadataarray,
              layer_extent: extentValue,
            };
            k++;
          } else {
            dat = {
              category: category,
              clpd_rstr: clippedRasterName,
              src_folder: sourceFolderName,
              src_file: sourceFileName,
              src_meta: sourceMetadata,
              metadata: metadataarray,
              layer_extent: null,
            };
          }

          // check if we already have found layers under this category
          if (!extendedTool.categories[cat]) {
            extendedTool.categories[cat] = [];
            extendedTool.categories[cat].push(dat);

            const data = { boxLabel: cat, name: cat, inputValue: cat };

            const node = new Node(data);
            // check for the maxBBoxSize column in the shapefile. If it exists
            // then check the bounding box size and hide/show categories accordingly
            // otherwise continue as normal.
            if (maxBBoxSize.length > 0) {
              if (categoryTags[i].innerHTML === data.name) {
                if (extendedTool.bboxSize >= parseInt(maxBBoxSize[i].innerHTML)) {
                  node.nodeTest = true;
                } else node.nodeTest = false;
              }
              node.addParent(this.rootNode);
            } else node.addParent(this.rootNode);
          } else if (!extendedTool.categories[cat].includes(dat)) {
            // don't add layer if it already exists
            extendedTool.categories[cat].push(dat);
          }
        }
        //const categoryText = Ext.getCmp('categoryText');

        extendedTool.panelMask.hide();
        //categoryText.hide();

        extendedTool.reconfigureDownloadTOC();
      },

      /*
       * Inputs:
       *		start: a point specified by a pair of coordinates (degrees)
       *		start_proj: specifies which projection the start point is in and should be returned in
       *		distance: a value in km that specifies how far away the destination point is
       *		bearing: the direction in which we should find our destination point in radians
       *
       * Methodology/Assumptions:
       *		This is based upon the halversine formula which assumes the Earth is a perfect sphere.
       *		Depending on chosen points the accuracy is generally 0.3% (within 3m per km) but
       *			the error may be as high as 0.5%
       *		In practice the longitude does not seem to be maintained precicely, but seems to be close enough
       *			I am not 100% sure of the reason as of yet. Rounding? General inaccuracy of formula?
       *
       * Returns:
       * 		A point. This point should be the specified distance from the start point based upon the bearing
       * 			as specified in the inputs.
       */
      destinationLatLong(start: Coordinate, startProjection: ProjectionLike, distance: number, bearing: number): Coordinate {
        // make sure we are working with lat/long values
        const lonlat = transform(start, startProjection, 'EPSG:4326');

        // convert to radians
        const lon = (lonlat[0] * Math.PI) / 180;
        const lat = (lonlat[1] * Math.PI) / 180;

        // Math Magic
        let destLat = Math.asin(Math.sin(lat) * Math.cos(distance / this.R) + Math.cos(lat) * Math.sin(distance / this.R) * Math.cos(bearing));
        let destLon =
          lon +
          Math.atan2(
            Math.sin(bearing) * Math.sin(distance / this.R) * Math.cos(lat),
            Math.cos(distance / this.R) - Math.sin(lat) * Math.sin(destLat)
          );

        // convert to degrees
        destLat = (destLat * 180) / Math.PI;
        destLon = (destLon * 180) / Math.PI;

        // shorten number of decimals
        const fixedDestLat = destLat.toFixed(this.precision);
        const fixedDestLon = destLon.toFixed(this.precision);

        // convert the point back to the projection we started with
        return fromLonLat([Number.parseFloat(fixedDestLon), Number.parseFloat(fixedDestLat)], startProjection);
      },

      hidePanelItems(extent: Extent): void {
        const redirectDownload = Ext.getCmp('redirectDownload');
        const downloadPanel = Ext.getCmp('dataDownloadPanel');
        //const categoryText = Ext.getCmp('categoryText');
        const noBoxText = Ext.getCmp('noBoxText');

        noBoxText.hide();

        if (redirectDownload && downloadPanel) {
          if (this.extentIsValid(extent)) {
            extendedTool.bboxIsValid = true;
            if (extendedTool.owningBlock.blockConfig.redirectText) {
              redirectDownload.hide();
            }
            downloadPanel.show();
            //categoryText.setText('Fetching categories...');
          } else {
            extendedTool.bboxIsValid = false;
            redirectDownload.show();
            if (!extendedTool.owningBlock.blockConfig.alwaysDisplayDownloadPanel) {
              downloadPanel.hide();
            } else {
              downloadPanel.hide();
              //categoryText.setText('No Categories Available');
              //categoryText.show();
            }
          }
        }
      },

      /*
       * Inputs:
       *		calcfrom: Location of point to calculate from
       *			 Acceptable values: maxLat, maxLon, 0, 1, minLat, minLon, 2, 3
       *			 maxLat, maxLon, 0 and minLat, minLon, 2 are the same
       *			 All other values default to the default calculation which is from the center
       *		center: coordinates in the form of [x, y]
       *
       * Returns:
       * 		points: an array of 4 points that form a box (usually trapezoidal in nature)
       */
      getWrappedBoxCoordinates(calcfrom?: string, center?: Coordinate): Array<Coordinate> {
        const map = this.getCurrentMap();
        const mapProjection = map.getView().getProjection().getCode();
        const points = [];

        // occasionally, some variables are not initizialized at the start
        if (this.hyp === null || this.a1 === null || this.a2 === null) {
          this.createDefaultVars();
        }

        /*
         * Note: 4 Different Longitude Values Returned; 2 Different Latitude Values Returned.
         * Assuming Longitude value equals the longitude value on at least one other point gives an error of aprox 2km
         * You may notice a very slight discrepency/issue if you try to give the southeast or northwest corners a precise value
         *    the formula used in destinationLatLong cannot guarantee correctness better than 0.5%
         * the specified cases will return a box that looks skewed from the default as they are caculated from a point and not the center
         * call
         */
        const c = center === undefined ? map.getView().getCenter() : center;
        switch (calcfrom) {
          case 'maxLat':
          case 'maxLon':
          case '0':
            points[0] = fromLonLat([parseFloat(this.lon.max), parseFloat(this.lat.max)]);
            points[1] = this.destinationLatLong(points[0], mapProjection, this.lns, Math.PI);
            points[3] = this.destinationLatLong(points[0], mapProjection, this.lew, (3 * Math.PI) / 2);
            points[2] = this.destinationLatLong(points[0], mapProjection, this.hyp * 2, 3 * this.a1 + 2 * this.a2);
            break;

          case '1':
            points[1] = fromLonLat([parseFloat(this.lon.max), parseFloat(this.lat.min)]);
            points[2] = this.destinationLatLong(points[1], mapProjection, this.lew, (3 * Math.PI) / 2);
            points[0] = this.destinationLatLong(points[1], mapProjection, this.lns, 0);
            points[3] = this.destinationLatLong(points[1], mapProjection, this.hyp * 2, 3 * this.a1 + 4 * this.a2);
            break;

          case 'minLat':
          case 'minLon':
          case '2':
            points[2] = fromLonLat([parseFloat(this.lon.min), parseFloat(this.lat.min)]);
            points[1] = this.destinationLatLong(points[2], mapProjection, this.lew, Math.PI / 2);
            points[0] = this.destinationLatLong(points[2], mapProjection, this.hyp * 2, this.a1);
            points[3] = this.destinationLatLong(points[2], mapProjection, this.lns, 0);
            break;

          case '3':
            points[3] = fromLonLat([parseFloat(this.lon.min), parseFloat(this.lat.max)]);
            points[1] = this.destinationLatLong(points[3], mapProjection, this.lns, this.a1 + 2 * this.a2);
            points[0] = this.destinationLatLong(points[3], mapProjection, this.lew, Math.PI / 2);
            points[2] = this.destinationLatLong(points[3], mapProjection, this.hyp * 2, Math.PI);
            break;

          case 'center':
          default:
            points[0] = this.destinationLatLong(c, mapProjection, this.hyp, this.a1);
            points[1] = this.destinationLatLong(c, mapProjection, this.hyp, this.a1 + 2 * this.a2);
            points[2] = this.destinationLatLong(c, mapProjection, this.hyp, 3 * this.a1 + 2 * this.a2);
            points[3] = this.destinationLatLong(c, mapProjection, this.hyp, 3 * this.a1 + 4 * this.a2);
            break;
        }

        // if the box is not over the antimeridian the longitude for both sides should be between -180 and 180
        if (
          points.every((point) => transform(point, mapProjection, 'EPSG:4326')[0] < -180) ||
          points.every((point) => transform(point, mapProjection, 'EPSG:4326')[0] > 180)
        ) {
          for (let i = 0; i < points.length; i += 1) {
            points[i] = toLonLat(points[i]); // it is easier to wrap coordinates in lat/lon and toLonLat automatically wraps for us
            points[i] = fromLonLat(points[i]); // back to the map projection that we need
          }
        }

        return points;
      },

      /*
       * Inputs:
       *		tbname: optional value of textbox (min or max lat; min or max long) that has been changed.
       *	 Allows for calculating polygon from corner point based upon a max or min value
       *
       * Function only adds feature if one does not currently exist
       */
      setFeature(tbname?: string): void {
        const lssource = this.getCurrentMapVectorSource();
        const lsfeatur = lssource.getFeatures();
        const map = this.getCurrentMap();
        const mapProjection = map.getView().getProjection();
        let convertToMiles = extendedTool.owningBlock.blockConfig.convertToMiles;

        if (!lsfeatur[0]) {
          // Grab all the values from the lat/long boxes.
          const minLat = this.lat.min;
          const maxLat = this.lat.max;
          const minLong = this.lon.min;
          const maxLong = this.lon.max;

          //  These work like YX coordinates. To make the top left point of our box, we need the furthest west longitude (y/minLong), and the furthest north latitude (x/maxLat)
          //  Similarly, we can create the rest of the points of our box using these coordinates.
          const topLeft = [minLong, maxLat];
          const topRight = [maxLong, maxLat];
          const bottomLeft = [minLong, minLat];
          const bottomRight = [maxLong, minLat];

          const pointCoordinates = [topLeft, topRight, bottomRight, bottomLeft]; // The points must be added in a clockwise order. This is because OL supports polygons/circles, so we can't just go left -> right for our parallelogram or you wind up with an hourglass shape.
          const bboxCoordinates = []; // This will contain all of the points after their conversion to the proper map projection.

          pointCoordinates.forEach((point) => {
            bboxCoordinates.push(transform(point, 'EPSG:4326', mapProjection));
          });

          bboxCoordinates.push(transform(pointCoordinates[0], 'EPSG:4326', mapProjection));
          this.bboxCoordinates = bboxCoordinates;

          this.feature = new Feature({
            geometry: new Polygon([bboxCoordinates]), // For some reason OL requires the array structure as [ [[y,x],[y,x],[y,x],[y,x]] ]. E.G An array with a length of 1, containing our array of coordinates.
          });
          this.feature.set('id', 'dataDownloadBox');
        }
        const geom = this.feature.getGeometry();
        let display;
        const area = getArea(geom);
        extendedTool.area = Math.floor((area / 1000000) * 100) / 100;

        if (convertToMiles) {
          display = Math.floor((area / 1000000 / 2.59) * 100) / 100;
          extendedTool.measureTooltipElement.innerHTML = `${display}mi<sup>2</sup>`;
        } else {
          display = Math.floor((area / 1000000) * 100) / 100;
          extendedTool.measureTooltipElement.innerHTML = `${display}km<sup>2</sup>`;
        }

        const tooltipCoord = geom.getInteriorPoint().getCoordinates();

        this.createMeasureTooltip();
        extendedTool.measureTooltip.setPosition(tooltipCoord);

        lssource.addFeature(this.feature);
        const writer = new GeoJSON();
        const EPSG3587JsonStr = JSON.parse(writer.writeFeatures([this.feature]));
        extendedTool.userGeoJSON = JSON.stringify(EPSG3587JsonStr);
        this.createTranslate();

        this.updateTextBoxCoords();
      },

      /*
       * Updates the textboxes to make them match the polygon's current location
       * Make call to update the bounding box categories as they may have changed since
       * the textbox coordinates have changed. However, we need to allow for circumstances
       * where the user may still be interacting with the box. This may cause bad values to
       * be used in the updateBBoxCategories() function.
       */
      updateTextBoxCoords(updateCategories: boolean = true): void {
        const map = this.getCurrentMap();
        const mapProjection = map.getView().getProjection();
        const lssource = this.getCurrentMapVectorSource();

        if (lssource) {
          const extent = lssource.getExtent();

          // get the min and max values in latitude and longitude
          const p1 = transform([extent[2], extent[3]], mapProjection, 'EPSG:4326');
          const p3 = transform([extent[0], extent[1]], mapProjection, 'EPSG:4326');

          const minx = p3[0].toFixed(this.precision); // min longitude
          const miny = p3[1].toFixed(this.precision); // min latitude
          const maxx = p1[0].toFixed(this.precision); // max longitude
          const maxy = p1[1].toFixed(this.precision); // max latitude

          // no need to update anything if the box doesn't exist
          if (isFinite(Number.parseFloat(minx)) && isFinite(Number.parseFloat(maxx))) {
            // Update lat/long text boxes while preventing
            // their changed events from fireing.
            const { component } = this;
            const minLatTxtBox = component.query('[name=minLat]')[0];
            const maxLatTxtBox = component.query('[name=maxLat]')[0];
            const minLonTxtBox = component.query('[name=minLon]')[0];
            const maxLonTxtBox = component.query('[name=maxLon]')[0];

            minLatTxtBox.suspendEvents();
            minLatTxtBox.setValue(miny);
            maxLatTxtBox.setValue(maxy);
            minLonTxtBox.setValue(minx);
            maxLonTxtBox.setValue(maxx);
            minLatTxtBox.resumeEvents();

            this.lat.min = miny;
            this.lat.max = maxy;
            this.lon.min = minx;
            this.lon.max = maxx;

            if (updateCategories) {
              this.updateBBoxCategories();
            }
          }
        }
      },

      /*
       * Inputs:
       *		tbname: the name of the textbox being changed.
       *
       *		If one of the values in extent is empty, then it is likely that the textboxes are being programatically
       *			or manually cleared. Calling this.setFeature early may prematurely recaculate values which is undesireable
       *			if we are trying to remove the polygon and hence the text box values.
       *			Also, we can't recaculate from an empty value so we should wait until a valid value is provided.
       */
      handleTextboxChange(tbname?: string): void {
        this.getCurrentMapVectorSource().clear();
        const extent = [this.lon.min, this.lat.min, this.lon.max, this.lat.max];

        if (this.extentIsValid(extent)) {
          this.setFeature(tbname);
        }
        this.toggleDownloadBtn();
      },

      empty(mapWindow): void {
        this.activeMapWindow = mapWindow;
        const lssource = extendedTool.getCurrentMapVectorSource();

        if (lssource) {
          lssource.clear();
          extendedTool.clearForm();
          extendedTool.updateBBoxCategories();
          extendedTool.disableDownloadBtn(); // skip straight to disable as the checks should fail
          if (extendedTool.measureTooltipElement) {
            extendedTool.measureTooltipElement.innerHTML = '';
          }
          const map = extendedTool.getCurrentMap();
          map.getOverlays().clear();
          const drawItems = map.getInteractions();
          drawItems.array_.forEach((item) => {
            if (item instanceof Draw) map.removeInteraction(item);
          });
          //const categoryText = Ext.getCmp('categoryText');
          //categoryText.setText('No Categories Available');
        }
        const noBoxText = Ext.getCmp('noBoxText');
        noBoxText.setText(extendedTool.owningBlock.blockConfig.noBoxText);
        noBoxText.show();
        Ext.getCmp('dataDownloadPanel').hide();
      },

      /*
       ****************
       ** START HERE ** (for most beginning to end code tracing)
       ****************
       The "normal"  entry point for the code from the user perspective
       cDataDownloadBtn Calls this function
       */
      openAndEnable(mapWindowBlock): void {
        extendedTool.activeMapWindow = mapWindowBlock;
        const mapPanelBlock = mapWindowBlock.getReferencedBlock('cMapPanel');
        const { map } = mapPanelBlock.component;
        extendedTool.activeMapPanel = map;
        // extendedTool.addVector();

        Ext.getCmp('redirectDownload').hide();

        this.createDefaultVars();
        this.createDrawInteraction();

        const tools = Ext.getCmp('cTools');
        //  Every second, check if cTools is rendered, when it is clear this interval and trigger bbox
        const toolCheck = setInterval(() => {
          if (tools.rendered) {
            const parent = this.owningBlock.parent.component;
            if (parent && parent.collapsed) {
              parent.expand();
            }

            if (this.owningBlock.rendered === true) {
              if (this.component.collapsed) {
                this.component.expand();
              }
            } else {
              setTimeout(
                function (extendedTool) {
                  if (extendedTool.component.collapsed) {
                    extendedTool.component.expand();
                  }
                },
                200,
                this
              );
            }
            clearInterval(toolCheck);
          }
        }, 1000);

        const btn = Ext.getCmp('wcsDownloadClear');
        btn.setText('Clear');
        this.updateBBoxCategories();
      },

      parseLayers(folders, folderId, level, titleLength): Array<LayerConfig> {
        if (typeof level === 'undefined') level = 0;
        const TOCTree = [];
        let children;

        // var maxTitleLength = 16;
        // if (level === 2) maxTitleLength = 14;
        // else if (level === 3) maxTitleLength = 8;

        const maxTitleLength = titleLength;
        // logger(maxTitleLength);

        for (const o in folders) {
          children = [];
          const fdr = folders[o];

          if (fdr.type === 'folder') {
            children = this.parseLayers(fdr.folder, fdr.id, level + 1, titleLength);
          } else if (fdr.type === 'layer') {
            if (fdr.loadOnly === false && fdr.mask === false) {
              const layerTitle = truncateString(fdr.title, 0, maxTitleLength);

              if (fdr.timeseries !== undefined) {
                children = {
                  id: fdr.id,
                  text: layerTitle,
                  timeSeriesSelected: buildLabel(fdr),
                  period: fdr.timeseries.type,
                  leaf: true,
                  //qtip: fdr.title,
                  description: fdr.description,
                  checked: false,
                  belongsTo: folderId,
                  type: fdr.type,
                };
              } else {
                children = {
                  id: fdr.id,
                  text: layerTitle,
                  period: '',
                  name: fdr.name,
                  leaf: true,
                  //qtip: fdr.title,
                  description: fdr.description,
                  checked: false,
                  belongsTo: folderId,
                  type: fdr.type,
                };
              }
            }
          } else if (fdr.type === 'link') {
            const layerTitle = truncateString(fdr.title, 0, maxTitleLength);

            children = {
              id: fdr.id,
              text: layerTitle,
              iconCls: 'external-link',
              cls: 'external-link',
              //qtip: `Go to: ${fdr.url}`,
              type: fdr.type,
              belongsTo: folderId,
              leaf: true,
              url: fdr.url,
            };
          }

          var expanded;
          if (fdr.versionId === 'All' || !fdr.hasOwnProperty('pushToDownload')) {
            expanded = false;
          } else {
            expanded = true;
          }

          if (fdr.type === 'folder' && children.length > 0) {
            TOCTree.push({
              id: fdr.id,
              text: fdr.title,
              expanded,
              children,
              //qtip: fdr.title,
              description: fdr.description,
              belongsTo: typeof folderId === 'undefined' ? '' : folderId,
              type: fdr.type,
            });
          } else if (fdr.type === 'link' || (fdr.type === 'layer' && fdr.loadOnly === false && fdr.mask === false && !fdr?.pushToDownload)) {
            TOCTree.push(children);
          }
        }

        return TOCTree;
      },

      getLayers(): Array<LayerConfig> {
        const layersConfigId = globalThis.App.Layers.configInstanceId;
        const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
        const layers = globalThis.App.Layers.query(
          layersConfig,
          {
            type: 'layer',
          },
          ['overlays', 'boundaries']
        );
        return layers;
      },
      /*
       * Returns all layers in the layers.json file that are loadOnly and display false (aka the download layers)
       */
      getDownloadLayers(): Array<LayerConfig> {
        const layersConfigId = globalThis.App.Layers.configInstanceId;
        const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
        const layers = globalThis.App.Layers.query(
          layersConfig,
          {
            type: 'layer',
            display: false,
            mask: false,
            loadOnly: true,
          },
          ['overlays', 'boundaries']
        );
        return layers;
      },

      /*
       * Creates and initiates the xml request
       * Calls parseXMLforCategories to actually go through the data
       */
      getXML(extendedTool, url: string) {
        // check that we have a url and that we are not already waiting on a request (don't want to send out several requests at once)
        if (url !== null && this.xmlRequestComplete) {
          const xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function (): void {
            // don't parse data unless we have data to parse
            if (this.readyState === 4 && this.status === 200) {
              extendedTool.parseXMLforCategories(xhttp);
              extendedTool.xmlRequestComplete = true;
            }
          };
          xhttp.open('GET', url, true);
          xhttp.send();
          this.xmlRequestComplete = false;
        }
      },

      updateBBoxCategories(): void {
        const lssource = this.getCurrentMapVectorSource();
        let extent: Extent = [null, null, null, null];
        if (lssource) {
          extent = lssource?.getExtent();
        }

        if (this.extentIsValid(extent) && !this.extentTooBig(extendedTool.area)) {
          let layers = this.getDownloadLayers();
          if (!layers.length) {
            layers = this.getLayers();
          }

          const geoserver = extendedTool.owningBlock.blockConfig.geoserver ? extendedTool.owningBlock.blockConfig.geoserver : layers[0].source.wms;
          const shapeFile = extendedTool.owningBlock.blockConfig.shapeFile ? extendedTool.owningBlock.blockConfig.shapeFile : layers[0].name;

          const noBoxText = Ext.getCmp('noBoxText');
          Ext.getCmp('dataDownloadPanel').show();
          let url = null;
          const baseurl = `${geoserver}request=GetFeature&version=1.1.0&typeName=${shapeFile}&BBOX=`;

          url = `${baseurl + extent[0]},${extent[1]},${extent[2]},${extent[3]}`;
          if (this.rootNode) {
            this.rootNode.removeChildren();
          }
          this.categories = {};

          this.disableDownloadBtn(); // no need to call toggleDownloadBtn as we already know what the result should be
          noBoxText.hide();
        } else if (this.extentTooBig(extendedTool.area)) {
          Ext.getCmp('dataDownloadPanel').hide();
          Ext.getCmp('redirectDownload').show();
          Ext.getCmp('redirectDownloadText').show();
        } else {
          const selectedVersion = globalThis.App.Layers.getSelectedVersion();
          const dataDownloadPanel = Ext.getCmp('dataDownloadPanel');
          dataDownloadPanel.hide();
          const noBoxText = Ext.getCmp('noBoxText');
          const versionCombo = Ext.getCmp('selectVersionCombo');
          noBoxText.show();
          versionCombo.setValue(selectedVersion);
        }
      },
      // Handles the switching of the layers based on the granule state.
      enableTemplateLayer(template: string) {
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

        const panelWindows = getBlocksByName('cMapWindow');
        const mapPanelBlock = panelWindows[0].getReferencedBlock('cMapPanel');
        const { map } = mapPanelBlock.component;

        // // Turn off the displayed rasters
        // for (let i = 0; i < activeRasters.length; i += 1) {
        //   activeRasters[i].active = false;
        //   activeRasters[i].display = false;
        // }

        const hiddenLayers = globalThis.App.Layers.query(
          layerConfig,
          (layer) => {
            return layer.title === template;
          },
          ['hidden']
        );

        const layerToDisplay = hiddenLayers[0];
        layerToDisplay.display = true;
        globalThis.App.OpenLayers.updateMapLayerOpacitiesAndDisplayedLayersFromLayersConfig(layerConfig, map);
      },

      disbaleTemplateLayers() {
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
          ['hidden']
        );

        const panelWindows = getBlocksByName('cMapWindow');
        const mapPanelBlock = panelWindows[0].getReferencedBlock('cMapPanel');
        const { map } = mapPanelBlock.component;

        // Turn off the displayed rasters
        for (let i = 0; i < activeRasters.length; i += 1) {
          activeRasters[i].active = false;
          activeRasters[i].display = false;
        }

        globalThis.App.OpenLayers.updateMapLayerOpacitiesAndDisplayedLayersFromLayersConfig(layerConfig, map);
      },

      // we need to do wfs request to grab the coordinates for a selected template.
      // After we have the coordinates, then we create a geojson in native projection
      getXMLforTemplates(extendedTool, url: string) {
        // check that we have a url and that we are not already waiting on a request (don't want to send out several requests at once)
        if (url !== null && this.xmlRequestComplete) {
          const xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function (): void {
            // don't parse data unless we have data to parse
            if (this.readyState === 4 && this.status === 200) {
              const xmlDoc = xhttp.response;
              const vectorFeatureCoordinates = JSON.parse(xmlDoc).features[0].geometry.coordinates[0];
              const updatedFeature = new Feature({
                geometry: new Polygon(vectorFeatureCoordinates),
              });

              updatedFeature.set('id', 'dataDownloadBox');
              extendedTool.currentFeature = updatedFeature;
              const writer = new GeoJSON();
              const EPSG3857JsonStr = JSON.parse(writer.writeFeatures([updatedFeature]));
              extendedTool.geoJsonStr = EPSG3857JsonStr;
              extendedTool.userGeoJSON = JSON.stringify(EPSG3857JsonStr);
              extendedTool.templateIsActive = true;
              extendedTool.xmlRequestComplete = true;
            }
          };
          xhttp.open('GET', url, true);
          xhttp.send();
          //this.xmlRequestComplete = false;
        }
      },

      mapClickListenerCallbackFunction: async function (eventObject, mapWindow) {
        //tools act upon the mapwindow
        //so this identify tool should
        //get the mapclick event and then modify the
        //featureinfo then post the featureInfoAvailable event

        const event = eventObject;
        const mapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
        const mapperWindow = mapWindowBlock.extendedTool;
        const mapPanelBlock = owningBlock.getReferencedBlock('cMapPanel');
        const map = event.map;

        // // Only execute if the button is pressed
        // const isPressed = this.component.pressed;

        const component = this.component;
        // Get the top-most vector layer
        const vector = map
          .getLayers()
          .getArray()
          .find(function (layer) {
            return layer.getSource()?.key_?.includes('.pbf');
          });

        const layersConfigId = mapWindow.layersConfigId;
        const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);

        if (vector !== undefined) {
          // Set a style function to the vector layer that will highlight the polygons that are stored in the selectedFeatures object
          vector.setStyle(function (feature) {
            const featureProperty = feature.getProperties();
            const downloadPanel = Ext.getCmp('dataDownloadPanel');
            const latText = Ext.getCmp('latText');
            const lonText = Ext.getCmp('lonText');
            const lats = Ext.getCmp('latitudes');
            const lons = Ext.getCmp('longitudes');
            const noBoxText = Ext.getCmp('noBoxText');
            if (extendedTool.selectedFeature[feature.getProperties().POLY_ID]) {
              latText.setVisible(false);
              lonText.setVisible(false);
              lats.setVisible(false);
              lons.setVisible(false);
              noBoxText.hide();
              return highlightStyle;
            }
            // // decrement the fetchCategories counter when the user deselects the feature so they are able to
            // // fetch categories for the same feature if selected again
            // feature.getProperties().fetchCategoriesCounter--;
            return regularStyle;
          });

          // Get the features at the selected pixel
          vector.getFeatures(event.pixel).then((features) => {
            // Don't change the selected features if a vector wasn't selected
            if (!features.length) {
              // extendedTool.selectedFeature = {};
              // vector.changed();
              return;
            }

            const feature = features[0];
            const activeRasters = globalThis.App.Layers.query(
              layersConfig,
              {
                type: 'layer',
                display: true,
                mask: false,
                loadOnly: false,
              },
              ['hidden']
            );

            if (!feature) return;

            // TODO: Since all the layers have different properties that do not match across the board, need to think
            // of a way to make sure the `fid` is calculated based on which template layer is dispalyed.
            // We're using the POLY_ID as the feature ID.
            const featureProperty = feature.getProperties();
            const fid = feature.getProperties().POLY_ID;

            // // assign a new property to the feature to force the fetching of the categories only once
            // // when a feature is already selected and the user zooms in or out
            // featureProperty.fetchCategoriesCounter = 1;

            const URL = globalThis.App.OpenLayers.getFeatureInfoUrl(event.coordinate, map, activeRasters[0]);
            extendedTool.getXMLforTemplates(extendedTool, URL);
            feature.id = 'dataDownloadBox';
            Ext.getCmp('dataDownloadPanel').show();
            extendedTool.fetchCategories(feature.getExtent());

            // create a polygon from the feature extent and get the area of the polygon.
            const area = fromExtent(feature.getExtent()).getArea();
            extendedTool.area = Math.floor((area / 1000000) * 100) / 100;
            // check if the selected feature's area is greater than max area.
            if (extendedTool.area >= extendedTool.owningBlock.blockConfig.maxArea) {
              Ext.getCmp('redirectDownload').show();
              Ext.getCmp('redirectDownloadText').show();
              extendedTool.panelMask.hide();
              Ext.getCmp('dataDownloadPanel').hide();
            } else {
              Ext.getCmp('redirectDownload').hide();
              Ext.getCmp('redirectDownloadText').hide();
            }

            //const fid = feature.getProperties().TEMPLATE;

            // // TODO: We have to place these selected features somewhere where we can access them from the vector tile initial load
            // //  otherwise when the layer is unchecked and re-checked the selected polygons will not be highlighted but will remain in the selectedFeatures list.
            // //  I'm thinking within the Map because one is created for each map window
            if (Object.keys(extendedTool.selectedFeature).length > 0) {
              if (extendedTool.selectedFeature[fid]) {
                // Deselect polygon
                delete extendedTool.selectedFeature[fid];
                const noBoxText = Ext.getCmp('noBoxText');
                extendedTool.clearForm();
                extendedTool.updateBBoxCategories();
                extendedTool.disableDownloadBtn();
                noBoxText.hide();
              } else {
                for (let item in extendedTool.selectedFeature) delete extendedTool.selectedFeature[item];
                // Add selected feature to lookup object
                extendedTool.selectedFeature[fid] = {
                  coords: event.coordinate,
                  layer: feature.getProperties().layer,
                  feature,
                };
              }
            } else {
              // Select polygon

              // Limit the number of selectable polygons based on the selectionLimit property in the template file.
              if (
                owningBlock.blockConfig?.selectionLimit &&
                Object.keys(extendedTool.selectedFeature).length === owningBlock.blockConfig.selectionLimit
              ) {
                // Trigger the vector to update its style
                vector.changed();
                return;
              }

              // Add selected feature to lookup object
              extendedTool.selectedFeature[fid] = {
                coords: event.coordinate,
                layer: feature.getProperties().layer,
                feature,
              };
            }
            // vector.changed();
          });
        }
      },
    };

    mapWindow.on(
      'click',
      function (callbackObj, postingObj, event) {
        const extendedTool = callbackObj;
        const mapperWindow = postingObj;

        // This fixes a weird bug with the template selection + download TOC layer filtering.
        extendedTool.categories = {};
        extendedTool.mapClickListenerCallbackFunction(event, mapperWindow);
      },
      extendedTool
    );

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_CREATED,
      owningBlock.itemDefinition.mapWindowCreated,
      extendedTool
    );

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
  getComponent(extendedTool, items, toolbar, menu): Record<string, any> {
    const block = extendedTool.owningBlock.blockConfig;
    const versionConfigs = globalThis.App.Config.sources.versions;
    const data = [];
    const selectedVersion = globalThis.App.Layers.getSelectedVersion();
    const instanceId = globalThis.App.Layers.getConfigInstanceId();
    const layersConfig = globalThis.App.Layers.getLayersConfigById(instanceId);
    const templates = layersConfig.hidden;

    for (let i = 0, len = versionConfigs.length; i < len; i += 1) {
      const versionConfig = versionConfigs[i];
      data.push({
        value: versionConfig.id,
        text: versionConfig.title,
      });
    }

    const store = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data,
    });

    let drawData = ['Polygon', 'Rectangle'];
    let templateData = [];
    const templateLayers = globalThis.App.Layers.query(layersConfig.hidden, {
      type: 'layer',
    });
    templateLayers.forEach((templates) => {
      templateData.push(templates.title);
    });
    let projectionData = ['NAD 1983 Albers (Standard)', 'Best-Fit UTM (NAD83 Datum)'];

    const drawStore = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data: drawData,
    });

    const templateStore = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data: templateData,
    });

    const projectionStore = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data: projectionData,
    });

    function updateTocStore(config): void {
      const tocExtendedTool = Ext.getCmp('downloadTOCTree');
      let TOCJSON = [];
      var versionConfig = [];
      const titleLength = 70;

      config.overlays[0].folder.forEach((folder) => {
        if (!folder.hasOwnProperty('pushToDownload')) {
          versionConfig.push(folder);
        }
      });

      config?.boundaries.forEach((folder) => {
        if (!folder.hasOwnProperty('pushToDownload')) {
          versionConfig.push(folder);
        }
      });

      const newVersionConfig = extendedTool.enableLayerMasking(versionConfig);

      const overlays = parseLayers(newVersionConfig, undefined, undefined, titleLength);

      TOCJSON = TOCJSON.concat(overlays);

      var store = Ext.create('Ext.data.TreeStore', {
        id: 'downloadTOCTree',
        rootVisible: false,
        lines: true,
        hideHeaders: true,
        root: {
          expanded: false,
          children: TOCJSON,
        },
        listeners: {
          checkchange() {
            extendedTool.toggleDownloadBtn();
            const panel = Ext.getCmp('parentPanel');
            panel.body.scrollTo('top', extendedTool.scrollPosition);
          },
          beforeitemclick() {
            const panel = Ext.getCmp('parentPanel');
            extendedTool.scrollPosition2 = panel.body.getScrollTop();
          },
          afterlayout() {
            const panel = Ext.getCmp('parentPanel');
            panel.body.scrollTo('top', extendedTool.scrollPosition2);
          },
        },
      });
      tocExtendedTool.reconfigure(store);
    }

    function parseLayers(folders, folderId, level, titleLength): Array<LayerConfig> {
      if (typeof level === 'undefined') level = 0;
      const TOCTree = [];
      let children;

      // var maxTitleLength = 16;
      // if (level === 2) maxTitleLength = 14;
      // else if (level === 3) maxTitleLength = 8;

      const maxTitleLength = titleLength;
      // logger(maxTitleLength);

      for (const o in folders) {
        children = [];
        const fdr = folders[o];

        if (fdr.type === 'folder') {
          children = parseLayers(fdr.folder, fdr.id, level + 1, titleLength);
        } else if (fdr.type === 'layer') {
          if (fdr.loadOnly === false && fdr.mask === false) {
            const layerTitle = truncateString(fdr.title, 0, maxTitleLength);

            if (fdr.timeseries !== undefined) {
              children = {
                id: fdr.id,
                text: layerTitle,
                timeSeriesSelected: buildLabel(fdr),
                period: fdr.timeseries.type,
                leaf: true,
                //qtip: fdr.title,
                description: fdr.description,
                checked: false,
                belongsTo: folderId,
                type: fdr.type,
              };
            } else {
              children = {
                id: fdr.id,
                text: layerTitle,
                period: '',
                name: fdr.name,
                leaf: true,
                //qtip: fdr.title,
                description: fdr.description,
                checked: false,
                belongsTo: folderId,
                type: fdr.type,
              };
            }
          }
        } else if (fdr.type === 'link') {
          const layerTitle = truncateString(fdr.title, 0, maxTitleLength);

          children = {
            id: fdr.id,
            text: layerTitle,
            iconCls: 'external-link',
            cls: 'external-link',
            //qtip: `Go to: ${fdr.url}`,
            type: fdr.type,
            belongsTo: folderId,
            leaf: true,
            url: fdr.url,
          };
        }

        var expanded;
        if (fdr.versionId === 'All' || !fdr.hasOwnProperty('pushToDownload')) {
          expanded = false;
        } else {
          expanded = true;
        }

        if (fdr.type === 'folder' && children.length > 0) {
          TOCTree.push({
            id: fdr.id,
            text: fdr.title,
            expanded,
            children,
            //qtip: fdr.title,
            description: fdr.description,
            belongsTo: typeof folderId === 'undefined' ? '' : folderId,
            type: fdr.type,
          });
        } else if (fdr.type === 'link' || (fdr.type === 'layer' && fdr.loadOnly === false && fdr.mask === false && !fdr?.pushToDownload)) {
          TOCTree.push(children);
        }
      }

      return TOCTree;
    }

    const component = {
      extendedTool,
      title: 'Data Download Tool',
      id: 'parentPanel',
      collapsible: Object.prototype.hasOwnProperty.call(block, 'collapsible') ? block.collapsible : true,
      collapsed: Object.prototype.hasOwnProperty.call(block, 'collapsed') ? block.collapsed : true,
      collapseFirst: false,
      componentCls: 'panel-border',
      overflowY: 'hidden',
      scrollable: false,
      autoScroll: true,
      autoHeight: true,
      maxHeight: window.innerHeight,
      grow: true,
      autoSize: true,
      border: 1,
      bodyCls: 'roundCorners',
      cls: 'padPanel',
      layout: 'vbox',
      tools: [
        {
          type: 'help',
          tooltip: 'Get Help',
          callback: function (panel, tool, event) {
            Ext.Msg.show({
              title: 'Data Download Tool',
              msg: 'This tool allows the user to draw an area of interest (AOI) on the map and select products they wish to download. ',
              buttons: Ext.Msg.CANCEL,
              icon: Ext.Msg.QUESTION,
            });
          },
        },
      ],
      items: [
        {
          xtype: 'panel',
          id: 'redirectDownload',
          items: [
            {
              xtype: 'tbtext',
              id: 'redirectDownloadText',
              text: extendedTool.owningBlock.blockConfig.redirectText,
              style: { fontSize: '14px', marginTop: '7px', marginBottom: '5px', marginLeft: '0px' },
              hidden: true,
            },
          ],
        },
        {
          xtype: 'tbtext',
          id: 'noBoxText',
          text: extendedTool.owningBlock.blockConfig.noBoxText,
          style: { fontSize: '14px', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
        },
        {
          xtype: 'tbtext',
          id: 'noRectangleText',
          text: extendedTool.owningBlock.blockConfig.noRectangleText,
          style: { fontSize: '14px', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
        },
        {
          xtype: 'tbtext',
          id: 'noPolygonText',
          text: extendedTool.owningBlock.blockConfig.noPolygonText,
          style: { fontSize: '14px', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
          hidden: true,
        },
        {
          xtype: 'tbtext',
          id: 'noGeoJSONText',
          text: extendedTool.owningBlock.blockConfig.noGeoJSONText,
          style: { fontSize: '14px', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
          hidden: true,
        },
        {
          id: 'featureItems',
          width: 180,
          //style: { fontSize: '14px', fontWeight: 'bold', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
          items: [
            {
              xtype: 'tbtext',
              id: 'drawTest',
              text: 'Method:',
              style: { fontSize: '14px', fontWeight: 'bold', marginTop: '5px', marginBottom: '5px', marginLeft: '10px' },
              hidden: true,
            },
            {
              xtype: 'combobox',
              id: 'drawCombo',
              store: drawStore,
              queryMode: 'local',
              valueField: 'text',
              displayField: 'text',
              width: 170,
              value: 'Rectangle',
              editable: false,
              hidden: true,
              style: { fontSize: '14px', fontWeight: 'bold', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
              listeners: {
                beforerender(): void {
                  const temp = ['Rectangle', 'Polygon', 'GeoJSON', 'Template'];
                  const drawData = [];
                  for (let i = 0, len = temp.length; i < len; i += 1) {
                    const tempConfig = temp[i];
                    drawData.push({
                      value: tempConfig,
                      text: tempConfig,
                    });
                  }
                  drawStore.removeAll();
                  drawStore.loadData(drawData);
                },
                change(drawCombo, value): void {
                  extendedTool.drawComboVal = value;
                  const drawVal = value;
                  const GeoJSON = Ext.getCmp('GeoJSON');
                  const noRectangleText = Ext.getCmp('noRectangleText');
                  const noPolygonText = Ext.getCmp('noPolygonText');
                  const noGeoJSONText = Ext.getCmp('noGeoJSONText');
                  const templateText = Ext.getCmp('templateText');
                  const templateCombo = Ext.getCmp('templateCombo');
                  const noBoxText = Ext.getCmp('noBoxText');
                  const refetchButton = Ext.getCmp('refetchProducts');

                  GeoJSON.setValue('');
                  const GeoJSONText = Ext.getCmp('GeoJSONText');
                  extendedTool.disableDownloadBtn();
                  if (value === 'Rectangle') {
                    GeoJSON.setVisible(false);
                    GeoJSONText.setVisible(false);
                    noBoxText.show();
                    refetchButton.hide();
                    if (extendedTool.downloadPanelToggle === false) {
                      noPolygonText.hide();
                      noGeoJSONText.hide();
                      noRectangleText.show();
                      templateText.hide();
                      templateCombo.hide();
                      templateCombo.clearValue();
                      extendedTool.disbaleTemplateLayers();
                      Ext.getCmp('redirectDownload').hide();
                      Ext.getCmp('redirectDownloadText').hide();
                    } else {
                      noPolygonText.hide();
                      noGeoJSONText.hide();
                      noRectangleText.hide();
                      templateText.hide();
                      templateCombo.hide();
                      templateCombo.clearValue();
                      extendedTool.disbaleTemplateLayers();
                      Ext.getCmp('redirectDownload').hide();
                      Ext.getCmp('redirectDownloadText').hide();
                    }
                    extendedTool.createDrawInteraction(drawVal);
                  } else if (value === 'Polygon') {
                    GeoJSON.setVisible(false);
                    GeoJSONText.setVisible(false);
                    noBoxText.show();
                    refetchButton.hide();
                    if (extendedTool.downloadPanelToggle === false) {
                      noPolygonText.show();
                      noGeoJSONText.hide();
                      noRectangleText.hide();
                      templateText.hide();
                      templateCombo.hide();
                      templateCombo.clearValue();
                      extendedTool.disbaleTemplateLayers();
                      Ext.getCmp('redirectDownload').hide();
                      Ext.getCmp('redirectDownloadText').hide();
                    } else {
                      noPolygonText.hide();
                      noGeoJSONText.hide();
                      noRectangleText.hide();
                      templateText.hide();
                      templateCombo.hide();
                      templateCombo.clearValue();
                      extendedTool.disbaleTemplateLayers();
                      Ext.getCmp('redirectDownload').hide();
                      Ext.getCmp('redirectDownloadText').hide();
                    }
                    extendedTool.createDrawInteraction(drawVal);
                  } else if (value === 'GeoJSON') {
                    GeoJSON.setVisible(true);
                    GeoJSONText.setVisible(true);
                    refetchButton.hide();
                    if (extendedTool.downloadPanelToggle === false) {
                      noPolygonText.hide();
                      noGeoJSONText.show();
                      noRectangleText.hide();
                      templateText.hide();
                      templateCombo.hide();
                      templateCombo.clearValue();
                      extendedTool.disbaleTemplateLayers();
                      Ext.getCmp('redirectDownload').hide();
                      Ext.getCmp('redirectDownloadText').hide();
                    } else {
                      noPolygonText.hide();
                      noGeoJSONText.hide();
                      noRectangleText.hide();
                      templateText.hide();
                      templateCombo.hide();
                      templateCombo.clearValue();
                      extendedTool.disbaleTemplateLayers();
                      Ext.getCmp('redirectDownload').hide();
                      Ext.getCmp('redirectDownloadText').hide();
                    }
                    const map = extendedTool.getCurrentMap();
                    map.getOverlays().clear();
                    const drawItems = map.getInteractions();
                    drawItems.array_.forEach((item) => {
                      if (item.customID) map.removeInteraction(item);
                    });
                  } else {
                    noBoxText.hide();
                    templateText.show();
                    templateCombo.show();
                    GeoJSON.setVisible(false);
                    GeoJSONText.setVisible(false);
                    refetchButton.hide();
                    Ext.getCmp('redirectDownload').hide();
                    Ext.getCmp('redirectDownloadText').hide();
                    const lssource = extendedTool.getCurrentMapVectorSource();
                    if (lssource) {
                      if (extendedTool.measureTooltipElement) {
                        extendedTool.measureTooltipElement.innerHTML = '';
                      }
                      const map = extendedTool.getCurrentMap();
                      map.getOverlays().clear();
                      const drawItems = map.getInteractions();
                      drawItems.array_.forEach((item) => {
                        if (item instanceof Draw) map.removeInteraction(item);
                      });
                    }
                    extendedTool.getCurrentMapVectorSource().clear(); // clears the drawbox
                    extendedTool.getCurrentMap().getOverlays().clear(); // clears the measure tooltip
                    //this.extendedTool.clearForm();
                  }
                },
              },
            },
            {
              xtype: 'tbtext',
              id: 'GeoJSONText',
              text: 'GeoJSON (EPSG:3857):',
              style: { fontSize: '14px', fontWeight: 'bold', marginLeft: '10px', marginTop: '10px' },
              hidden: true,
            },
            {
              extendedTool,
              xtype: 'textfield',
              id: 'GeoJSON',
              name: 'GeoJSON (EPSG:3857):',
              //emptyText: 'GeoJSON (EPSG:3857)',
              width: 170,
              style: { marginLeft: '10px', marginTop: '5px' },
              isUserGeoJSON: false,
              hidden: true,
              listeners: {
                change(textbox, value): void {
                  if (value !== '') extendedTool.userGeoJSON = value;

                  const lssource = extendedTool.getCurrentMapVectorSource();
                  const lsfeatur = lssource.getFeatures();
                  const map = extendedTool.getCurrentMap();
                  const mapProjection = map.getView().getProjection();
                  map.getOverlays().clear();

                  // remove any previous features that the user might have drawn
                  const source = extendedTool.getCurrentMapVectorSource();
                  const featureItems = source.getFeatures();
                  featureItems.forEach((drawItem) => {
                    if (drawItem.values_.id === 'dataDownloadBox') source.removeFeature(drawItem);
                  });

                  if (value !== '') {
                    let GeoJSONobj;
                    try {
                      GeoJSONobj = JSON.parse(value);
                      let validGeoJSON = gjv.valid(GeoJSONobj);
                      if (!validGeoJSON) {
                        alert('GeoJSON is not in the correct format. Please try again.');
                        return;
                      } else {
                        const coordinates = GeoJSONobj.features[0].geometry.coordinates;
                        this.feature = new Feature({
                          geometry: new Polygon(coordinates), // For some reason OL requires the array structure as [ [[y,x],[y,x],[y,x],[y,x]] ]. E.G An array with a length of 1, containing our array of coordinates.
                        });
                        this.feature.set('id', 'dataDownloadBox');

                        // to make sure the provided geojson corresponds to the active region.
                        const currentRegion = Ext.getCmp('cRegionTool').value;
                        const regions = globalThis.App.Config.sources.regions;
                        const currentRegionExtent = regions.find((x) => x.id === currentRegion).bbox;
                        let tempPolygon = fromExtent(currentRegionExtent);
                        const regionFeature = new Feature({
                          geometry: tempPolygon,
                        });

                        const geom = this.feature.getGeometry();
                        if (!regionFeature.getGeometry().intersectsExtent(geom.getExtent())) {
                          alert(
                            'The GeoJSON provided is not associated with the current extent. Please change to the appropriate extent in the Table of Contents using the extent selector.'
                          );
                          Ext.getCmp('noBoxText').hide();
                          Ext.getCmp('redirectDownload').hide();
                          Ext.getCmp('redirectDownloadText').hide();
                          Ext.getCmp('dataDownloadPanel').hide();
                        } else {
                          const area = geom.getArea();
                          extendedTool.area = Math.floor((area / 1000000) * 100) / 100;

                          const writer = new GeoJSON();
                          const EPSG3587JsonStr = JSON.parse(writer.writeFeatures([this.feature]));
                          extendedTool.userGeoJSON = JSON.stringify(EPSG3587JsonStr);
                          const output = Math.floor((geom.getArea() / 1000000 / 2.59) * 100) / 100;
                          extendedTool.bboxSize = output;
                          const tooltipCoord = geom.getInteriorPoint().getCoordinates();

                          extendedTool.createMeasureTooltip();

                          extendedTool.measureTooltipElement.innerHTML = `${output}mi<sup>2</sup>`;
                          extendedTool.measureTooltip.setPosition(tooltipCoord);

                          lssource.addFeature(this.feature);

                          // check if the user entered geoJSON is for a self intersecting polygon.
                          var options = {
                            reportVertexOnVertex: false,
                            useSpatialIndex: false,
                          };
                          var isects = gpsi(
                            GeoJSONobj.features[0],
                            function filterFn(isect) {
                              return [isect];
                            },
                            options
                          );

                          if (isects.length === 0) {
                            const downloadPanel = Ext.getCmp('dataDownloadPanel');
                            const latText = Ext.getCmp('latText');
                            const lonText = Ext.getCmp('lonText');
                            const lats = Ext.getCmp('latitudes');
                            const lons = Ext.getCmp('longitudes');
                            const downloadButton = Ext.getCmp('wcsDownloadBtn');
                            downloadPanel.show();
                            const noBoxText = Ext.getCmp('noBoxText');
                            latText.setVisible(false);
                            lonText.setVisible(false);
                            lats.setVisible(false);
                            lons.setVisible(false);
                            noBoxText.hide();
                            downloadButton.disable();
                            if (extendedTool.area <= extendedTool.owningBlock.blockConfig.maxArea) {
                              Ext.getCmp('redirectDownload').hide();
                              Ext.getCmp('redirectDownloadText').hide();
                              extendedTool.fetchCategories();
                            } else {
                              Ext.getCmp('redirectDownload').show();
                              Ext.getCmp('redirectDownloadText').show();
                              Ext.getCmp('dataDownloadPanel').hide();
                            }
                          } else {
                            alert('Cannot draw a self interacting polygon. Please try again.');
                            map.getOverlays().clear();

                            // remove any previous features that the user might have drawn
                            const featureItems = source.getFeatures();
                            featureItems.forEach((drawItem) => {
                              if (drawItem.values_.id === 'dataDownloadBox') source.removeFeature(drawItem);
                            });
                          }
                        }
                      }
                    } catch (e) {
                      alert('GeoJSON is not in the correct format. Please try again.');
                    }
                  }
                  extendedTool.currentFeature = undefined;
                },
              },
            },
          ],
        },
        {
          xtype: 'tbtext',
          id: 'templateText',
          text: 'Select Template',
          style: { fontSize: '14px', fontWeight: 'bold', marginLeft: '10px', marginTop: '10px' },
          hidden: true,
        },
        {
          extendedTool,
          xtype: 'combobox',
          id: 'templateCombo',
          store: templateStore,
          queryMode: 'local',
          valueField: 'text',
          displayField: 'text',
          width: 190,
          emptyText: 'Select Template',
          editable: false,
          style: { fontSize: '14px', fontWeight: 'bold', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
          hidden: true,
          listeners: {
            beforerender(): void {
              const temp = [];
              const templateLayers = globalThis.App.Layers.query(layersConfig.hidden, {
                type: 'layer',
              });
              templateLayers.forEach((templates) => {
                temp.push(templates.title);
              });
              const templateData = [];
              for (let i = 0, len = temp.length; i < len; i += 1) {
                const tempConfig = temp[i];
                templateData.push({
                  value: tempConfig,
                  text: tempConfig,
                });
              }
              templateStore.removeAll();
              templateStore.loadData(templateData);
            },
            change(templateCombo, value): void {
              // if there is already a feature selected and the user changes to a different template layer, we want to empty out the `extendedTool.selectedFeature` object.
              // This is becuase we are only letting the user select one polygon at a time.
              Object.getOwnPropertyNames(extendedTool.selectedFeature).forEach(function (prop) {
                delete extendedTool.selectedFeature[prop];
              });
              // disable already displayed template layer so the new one can be displayed.
              extendedTool.disbaleTemplateLayers();
              // enable the new template layer.
              if (value !== null) extendedTool.enableTemplateLayer(value);
            },
          },
        },
        {
          xtype: 'panel',
          id: 'dataDownloadPanel',
          width: '100%',
          hidden: !extendedTool.owningBlock.blockConfig.alwaysDisplayDownloadPanel,
          items: [
            {
              xtype: 'tbtext',
              id: 'projectionPickerText',
              text: 'Select Projection',
              style: { fontSize: '14px', fontWeight: 'bold', marginTop: '5px', marginBottom: '5px', marginLeft: '10px' },
              hidden: false,
            },
            {
              extendedTool,
              xtype: 'combobox',
              id: 'projectionCombo',
              store: projectionStore,
              queryMode: 'local',
              value: 'NAD 1983 Albers (Standard)',
              valueField: 'text',
              displayField: 'text',
              width: 170,
              emptyText: 'Select Projection',
              editable: false,
              style: { fontSize: '14px', fontWeight: 'bold', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
              listeners: {
                beforerender(): void {
                  const temp = ['NAD 1983 Albers (Standard)', 'Best-Fit UTM (NAD83 Datum)'];
                  const projectionData = [];
                  for (let i = 0, len = temp.length; i < len; i += 1) {
                    const tempConfig = temp[i];
                    projectionData.push({
                      value: tempConfig,
                      text: tempConfig,
                    });
                  }
                  projectionStore.removeAll();
                  projectionStore.loadData(projectionData);
                },
                change(drawCombo, value): void {
                  extendedTool.projectionOption = value;
                },
              },
            },
            {
              xtype: 'tbtext',
              id: 'selectCategoriesText',
              text: 'Select Products:',
              style: { fontSize: '14px', fontWeight: 'bold', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
              hidden: false,
            },
            {
              xtype: 'combobox',
              id: 'selectVersionCombo',
              displayField: 'text',
              valueField: 'value',
              editable: false,
              value: selectedVersion,
              emptyText: 'Select Version',
              width: 170,
              store,
              style: { fontSize: '14px', fontWeight: 'bold', marginTop: '7px', marginBottom: '15px', marginLeft: '10px' },
              listeners: {
                change(combo) {
                  const value = combo.getValue();
                  let selectedRegion = globalThis.App.Layers.getSelectedRegion();
                  const version_region = value + '_' + selectedRegion;

                  const versionRegionConfig = globalThis.App.Layers.getVersionRegionConfig();

                  updateTocStore(versionRegionConfig[version_region]);
                },
              },
            },
            {
              xtype: 'tbtext',
              id: 'categoryText',
              style: { fontSize: '16px', fontWeight: 'bold', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
            },
            {
              xtype: 'treeStore',
              id: 'downloadTOCTree',
              rootVisible: false,
              lines: true,
              hideHeaders: true,
              expanded: false,
              emptyText: 'The current version/region <br>configuration contains no products',
              root: { expanded: false, text: '', data: '' },
              listeners: {
                checkchange() {
                  extendedTool.toggleDownloadBtn();
                  const panel = Ext.getCmp('parentPanel');
                  panel.body.scrollTo('top', extendedTool.scrollPosition);
                },
                beforeitemclick() {
                  const panel = Ext.getCmp('parentPanel');
                  extendedTool.scrollPosition2 = panel.body.getScrollTop();
                },
                afterlayout() {
                  const panel = Ext.getCmp('parentPanel');
                  panel.body.scrollTo('top', extendedTool.scrollPosition2);
                },
              },
            },
            {
              xtype: 'treeStore',
              id: 'tutorialTOCTree',
              rootVisible: false,
              lines: true,
              hideHeaders: true,
              expanded: false,
              emptyText: 'The current version/region <br>configuration contains no products',
              root: { expanded: false, text: '', data: '' },
              listeners: {},
            },
            {
              xtype: 'tbtext',
              id: 'latText',
              text: 'Latitudes (dd):',
              style: { marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
            },
            {
              id: 'latitudes',
              layout: {
                type: 'table',
                columns: 2,
              },
              width: '90%',
              style: { marginLeft: '10px' },
              items: [
                {
                  xtype: 'tbtext',
                  id: 'topLatText',
                  text: 'Top Latitude:',
                  style: { marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
                },
                {
                  extendedTool,
                  xtype: 'textfield',
                  id: 'bbox2',
                  name: 'maxLat',
                  emptyText: 'max',
                  listeners: {
                    change(textbox, value): void {
                      this.extendedTool.lat.max = value;
                    },
                    blur(textbox): void {
                      this.extendedTool.handleTextboxChange(textbox.name);
                      const refetchButton = Ext.getCmp('refetchProducts');
                      refetchButton.show();
                    },
                  },
                },
                {
                  xtype: 'tbtext',
                  id: 'botLatText',
                  text: 'Bottom Latitude:',
                  style: { marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
                },
                {
                  extendedTool,
                  xtype: 'textfield',
                  id: 'bbox1',
                  name: 'minLat',
                  emptyText: 'minLat',
                  style: {
                    marginRight: '3px',
                  },
                  listeners: {
                    change(textbox, value): void {
                      this.extendedTool.lat.min = value;
                    },
                    blur(textbox): void {
                      this.extendedTool.handleTextboxChange(textbox.name);
                      const refetchButton = Ext.getCmp('refetchProducts');
                      refetchButton.show();
                    },
                  },
                },
              ],
            },
            {
              xtype: 'tbtext',
              text: 'Longitudes (dd):',
              id: 'lonText',
              style: { marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
            },
            {
              id: 'longitudes',
              layout: {
                type: 'table',
                columns: 2,
              },
              width: '90%',
              style: { marginLeft: '10px' },
              items: [
                {
                  xtype: 'tbtext',
                  id: 'leftLonText',
                  text: 'Left Longitude:',
                  style: { marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
                },
                {
                  extendedTool,
                  xtype: 'textfield',
                  id: 'bbox3',
                  name: 'minLon',
                  emptyText: 'min',
                  style: {
                    marginRight: '3px',
                  },
                  listeners: {
                    change(textbox, value): void {
                      this.extendedTool.lon.min = value;
                    },
                    blur(textbox): void {
                      this.extendedTool.handleTextboxChange(textbox.name);
                      const refetchButton = Ext.getCmp('refetchProducts');
                      refetchButton.show();
                    },
                  },
                },
                {
                  xtype: 'tbtext',
                  id: 'rightLonText',
                  text: 'Right Longitude:',
                  style: { marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
                },
                {
                  extendedTool,
                  xtype: 'textfield',
                  id: 'bbox4',
                  name: 'maxLon',
                  emptyText: 'max',
                  listeners: {
                    change(textbox, value): void {
                      this.extendedTool.lon.max = value;
                    },
                    blur(textbox): void {
                      this.extendedTool.handleTextboxChange(textbox.name);
                      const refetchButton = Ext.getCmp('refetchProducts');
                      refetchButton.show();
                    },
                  },
                },
              ],
            },
            {
              extendedTool,
              xtype: 'button',
              text: 'Re-retrieve Products',
              id: 'refetchProducts',
              columnWidth: 0.5,
              hidden: true,
              style: {
                marginLeft: '50px',
              },
              listeners: {
                click(button): void {
                  this.extendedTool.fetchCategories();
                  this.hide();
                },
              },
            },
            {
              extendedTool,
              xtype: 'textfield',
              id: 'Email',
              name: 'Email',
              emptyText: 'Email',
              width: '90%',
              style: { marginLeft: '10px', marginTop: '10px' },
              listeners: {
                change(textbox, value): void {
                  const emailTrimed = value.trim();
                  if (this.extendedTool.emailIsValid(emailTrimed)) {
                    textbox.inputEl.el.dom.style.color = 'black';
                    this.extendedTool.email = emailTrimed;
                  } else {
                    textbox.inputEl.el.dom.style.color = 'crimson';
                    this.extendedTool.email = '';
                  }

                  this.extendedTool.toggleDownloadBtn();
                },
              },
            },
            {
              layout: 'column',
              width: '95%',
              style: {
                marginTop: '10px',
                marginBottom: '10px',
              },
              items: [
                {
                  extendedTool,
                  xtype: 'button',
                  text: 'Clear',
                  id: 'wcsDownloadClear',
                  columnWidth: 0.5,
                  style: {
                    marginLeft: '10px',
                  },
                  listeners: {
                    click(button): void {
                      this.extendedTool.getCurrentMapVectorSource().clear(); // clears the drawbox
                      this.extendedTool.getCurrentMap().getOverlays().clear(); // clears the measure tooltip
                      this.extendedTool.clearForm();
                      this.extendedTool.updateBBoxCategories();
                      this.extendedTool.disableDownloadBtn(); // skip straight to disable as the checks should fail
                      //Ext.getCmp('cbCategories').hide();
                      //Ext.getCmp('categoryText').hide();
                    },
                  },
                },
                {
                  extendedTool,
                  xtype: 'button',
                  text: 'Download',
                  id: 'wcsDownloadBtn',
                  columnWidth: 0.5,
                  disabled: true,
                  style: {
                    marginLeft: '15px',
                  },
                  listeners: {
                    click(): void {
                      extendedTool.activeMapPanel.extendedTool.maskComponent('Submitting Job ...');
                      const tocExtendedTool = Ext.getCmp('downloadTOCTree');
                      const selectedChildren = tocExtendedTool.getChecked();
                      // the categories that the user selected
                      const numOfFiles = {}; // keep track of how many files each category requests to download
                      const requestData = [];
                      const noDataLayers = [];
                      const check = [];
                      // for each node checked (or selected) add the corresponding layers to the requestData array
                      for (const node of selectedChildren) {
                        var categoryData = node.raw.name;
                        categoryData = categoryData.split(':');
                        categoryData = categoryData[1];
                        extendedTool.categoryArray.push(categoryData);
                        requestData.push(categoryData);
                      }

                      const features = extendedTool.getCurrentMapVectorSource().getFeatures();
                      // check if the user drew a bbox on the map, if not that means that the user chose a template.
                      if (features.length > 0) {
                        let ddFeature = features.filter((x) => {
                          if (x.values_?.id == 'dataDownloadBox') return x;
                        });
                        let copyFeature = ddFeature[0].clone(); // If we use the original any subsequent downloads with the same feature will be transformed more than once, breaking the coords
                        let geom = copyFeature.getGeometry();
                        //geom.transform(mapProj, sourceProj);
                        const writer = new GeoJSON();
                        extendedTool.geoJsonStr = JSON.parse(writer.writeFeatures([copyFeature]));
                      }

                      for (const prop in numOfFiles) {
                        // If numOfFiles[prop] is 1, its only layer is mean, so it must have more than that (data, zscore, etc.) to allow a download
                        if (numOfFiles[prop] <= 1) noDataLayers.push(prop);
                      }
                      const rdLength = requestData.length;
                      for (let i = 0; i < rdLength; i++) {
                        check.forEach((item) => {
                          if (requestData[i]?.src_folder?.includes(item)) {
                            requestData.splice(i, 1);
                            i -= 1;
                          }
                        });
                      }

                      for (let i = 0; i < extendedTool.allCats.length; i++) {
                        var current = extendedTool.allCats[i];

                        if (extendedTool.categories[current] !== undefined) {
                          //compare categories with the selectedNodes(jsonstr) and push the matches to requestJSONStr
                          extendedTool.categories[current].forEach((element) => {
                            requestData.forEach((selectedLayer) => {
                              if (element['category'] === 'lf_2014' || element['category'] === 'lf_2012' || element['category'] === 'topo') {
                                if (element['clpd_rstr'] === selectedLayer) {
                                  extendedTool.requestJSONStr.push(element);
                                }
                              } else {
                                if (element['src_file'] === selectedLayer) {
                                  extendedTool.requestJSONStr.push(element);
                                }
                              }
                            });
                          });
                        }
                      }

                      const layers = [];
                      const not_matched = [];
                      extendedTool.requestJSONStr.forEach((element) => {
                        if (element['category'] === 'lf_2014' || element['category'] === 'lf_2012' || element['category'] === 'topo') {
                          layers.push(element.clpd_rstr);
                        } else {
                          layers.push(element.src_file);
                        }
                      });

                      requestData.forEach((element) => {
                        if (!layers.includes(element)) {
                          not_matched.push(element);
                        }
                      });

                      const catstr = extendedTool.categoryArray.join();
                      let optionalNotice = extendedTool.owningBlock.blockConfig.optionalNotice
                        ? extendedTool.owningBlock.blockConfig.optionalNotice
                        : '';

                      let noDuplicateLayers = Array.from(new Set(extendedTool.requestJSONStr));
                      const newjsonstr = JSON.stringify(noDuplicateLayers);

                      if (newjsonstr && newjsonstr !== '[]' && newjsonstr !== '{}' && catstr) {
                        const email = extendedTool.email.trim();
                        const url = encodeURI(extendedTool.owningBlock.blockConfig.addQueueLocation);

                        const request = new XMLHttpRequest();
                        request.open('POST', url, true);
                        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
                        let port = '';
                        if (window.location.port) {
                          port = `:${window.location.port}`;
                        }
                        let coords;
                        if (extendedTool.geoJsonStr.features !== undefined) {
                          coords = extendedTool.geoJsonStr.features[0].geometry.coordinates[0];
                        } else coords = extendedTool.geoJsonStr;

                        const nativeCoords = [];

                        if (JSON.stringify(JSON.parse(extendedTool.userGeoJSON)) === JSON.stringify(extendedTool.geoJsonStr)) {
                          coords.forEach((element) => {
                            nativeCoords.push(transform(element, 'EPSG:3857', 'EPSG:4326'));
                          });
                          // if there are null/NAN values in nativeCoords, we should filter them out.
                          // removing them should not affect on the accuracy of the geojson.
                          nativeCoords[0] = nativeCoords[0].filter((coordinates) => coordinates);

                          extendedTool.geoJsonStr.features[0].geometry.coordinates[0] = nativeCoords;
                        }

                        var proj_Type;

                        if (extendedTool.projectionOption.includes('UTM')) {
                          proj_Type = 'UTM';
                        } else {
                          proj_Type = 'Standard';
                        }

                        request.send(
                          `layers=${newjsonstr}
                          &email=${email}
                          &categories=${catstr}
                          &GeoJSON_viewer_projection=${extendedTool.userGeoJSON}
                          &GeoJSON_native_projection=${JSON.stringify(extendedTool.geoJsonStr)}
                          &projection_Type=${proj_Type}`
                        );

                        request.onreadystatechange = function (): void {
                          if (this.readyState === 4 && this.status === 200) {
                            const response = JSON.parse(request.response);
                            extendedTool.activeMapPanel.extendedTool.unMaskComponent();
                            if (response.success === true && not_matched.length == 0) {
                              let successAlert =
                                `Your download request has successfully been sent and will be processed as soon as possible. You will receive an e-mail with instructions on retrieving your data. Thank you.\n\n` +
                                optionalNotice;
                              extendedTool.requestJSONStr = [];
                              extendedTool.categoryArray = [];
                              alert(successAlert);
                            } else if (response.success === true && not_matched.length > 0) {
                              let partialSuccessAlert =
                                `Your download request has been partially sent and will be processed as soon as possible. You will receive an e-mail with instructions on retrieving your data. \n
                                \nThe following selected layers were not available for the current extent and will not be included in the download request data bundle: \n` +
                                not_matched;
                              extendedTool.requestJSONStr = [];
                              extendedTool.categoryArray = [];
                              alert(partialSuccessAlert);
                            } else {
                              extendedTool.requestJSONStr = [];
                              extendedTool.categoryArray = [];
                              alert(`ERROR: ${response.errorMessage}`);
                            }
                          }
                        };
                      } else {
                        alert(
                          `The selected layers are not available for the current extent. Please select different layers or change the extent and try again.`
                        );
                        extendedTool.activeMapPanel.extendedTool.unMaskComponent();
                      }
                    },
                  },
                },
              ],
            },
          ],
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
        afterrender(): void {
          if (!extendedTool.owningBlock.blockConfig.redirectText) {
            Ext.getCmp('redirectDownload').hide();
          }

          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.forEach((element) => {
              element.el.dom.title = element.type[0].toUpperCase() + element.type.split('-')[0].slice(1);
            });

          if (this.extendedTool.activeMapWindow !== null) {
            this.extendedTool.addVector();
          }

          //  Grab the URL Parameters, check if it contains "bbox", if not- ignore
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);

          if (urlParams.has('downloadBbox')) {
            // activate download button
            const dataDownloadBtn: any = Ext.ComponentQuery.query('[dataDownload=true]');
            dataDownloadBtn[0].toggle();

            const tools = Ext.getCmp('cTools');
            //  Every second, check if cTools is rendered, when it is clear this interval and trigger bbox
            const toolCheck = setInterval(() => {
              if (tools.rendered) {
                const noBoxText = Ext.getCmp('noBoxText');
                Ext.getCmp('dataDownloadPanel').show();
                noBoxText.hide();

                const bboxCoords = urlParams.get('downloadBbox');
                const coordArray = bboxCoords.split(','); //  take the bbox coords and turn them into an array

                coordArray.forEach((coord, index) => {
                  index += 1;
                  const bboxField = Ext.getCmp(`bbox${index}`);
                  bboxField.setValue(coord);
                });
                this.extendedTool.lat.min = parseFloat(coordArray[0]);
                this.extendedTool.lat.max = parseFloat(coordArray[1]);
                this.extendedTool.lon.min = parseFloat(coordArray[2]);
                this.extendedTool.lon.max = parseFloat(coordArray[3]);

                this.extendedTool.setFeature();
                this.extendedTool.updateBBoxCategories();

                this.extendedTool.bboxIsValid = true;

                this.extendedTool.getCurrentMap().getView().fit(this.extendedTool.feature.getGeometry().getExtent());
                clearInterval(toolCheck);
              }
            }, 1000);
          }
        },
        render: function (p) {
          p.body.on(
            'scroll',
            function () {
              extendedTool.scrollPosition = p.body.getScrollTop();
            },
            p
          );
        },
      },
    };

    return component;
  },
};
