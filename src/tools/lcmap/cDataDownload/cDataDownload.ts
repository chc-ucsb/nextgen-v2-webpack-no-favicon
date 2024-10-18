import VectorLayer from 'ol/layer/Vector';
import OverlayPositioning from 'ol/OverlayPositioning';
import { Dictionary, LayerConfig } from 'src/@types';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import { transform, transformExtent } from 'ol/proj';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import Draw, { createBox } from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';
import Overlay from 'ol/Overlay';
import { getBlocksByName } from '../../../helpers/extjs';

class Node {
  id: string;
  data: string;
  radio: boolean;
  defaultChecked: boolean;
  selected: boolean;
  prevSelected: boolean;
  enabled: boolean;
  parent: Node;
  children: Array<any>;
  purpose: any;
  metadataFile: string;

  /* Set the initial values for the node */
  constructor(data, radio = false, dc = false, id = null) {
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
    let q = this.children.concat(); // concat forces to set q by value and not reference
    while (Array.isArray(q) && q.length) {
      const node = q.pop();
      q = q.concat(node.children);

      if (node.parent === this) {
        node.id = cmp.add(node.data).getId();
        node.enabled = true;
      }
    }
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
  mapWindowFocused(postingObj: Dictionary, callbackObj: Dictionary): void {
    const mapWindow = postingObj;
    const extendedTool = callbackObj;
    if (mapWindow.owningBlock) {
      extendedTool.activeMapWindow = mapWindow.owningBlock;

      const mapPanelBlock = extendedTool.activeMapWindow.getReferencedBlock('cMapPanel');
      const { map } = mapPanelBlock.component;
      extendedTool.activeMapPanel = map;
      const source = extendedTool.getCurrentMapVectorSource();

      if (source && source.getFeatures().length > 0) {
        extendedTool.updateTextBoxCoords();
        extendedTool.updateBBoxCategories();
        const dataDownloadPanel = Ext.ComponentQuery.query('[title=Data Download]');
        (dataDownloadPanel[0] as Ext.panel.IPanel).expand();

        const geom = source.getFeatures()[0].values_.geometry;
        const coords = geom.getLinearRing(0).getCoordinates();
        const output = Math.floor(geom.getArea(coords) / 2 / 1000000);
        extendedTool.hidePanelItems(output);
      } else {
        extendedTool.clearForm();
        const downloadFlag = Ext.getCmp('redirectDownload');
        const downloadPanel = Ext.getCmp('dataDownloadPanel');
        downloadFlag.hide();
        downloadPanel.hide();

        const categoryCheckboxes = Ext.getCmp('cbCategories');
        categoryCheckboxes.hide();
        const noBBox = Ext.getCmp('noBBox');
        noBBox.show();
      }
    }
  },

  createExtendedTool(owningBlock) {
    // Get the default focused map window on app load.
    const [mapWindow = null] = getBlocksByName('cMapWindow');

    const extendedTool = {
      qsource: null,
      rsource: null,
      owningBlock,
      activeMapWindow: mapWindow,
      activeMapPanel: null,
      measureTooltipElement: null,
      measureTooltip: null,
      interactionAdded: false,
      xmlRequestComplete: true,
      bboxIsValid: false,
      categories: [],
      selectedCategories: [],
      precision: 5,
      email: '',
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
      lew: 274, //  landsat scene size east to west in km (183)
      lns: 255, // landsat scene size north to south in km (170)
      R: 6371, // average radius of the Earth in km
      // variables based upon the variables above
      createDefaultVars(): void {
        this.hyp = (Math.acos(Math.cos(this.lew / this.R) * Math.cos(this.lns / this.R)) * this.R) / 2; // spherical law of cosines
        this.a1 = Math.atan(this.lew / this.lns);
        this.a2 = Math.atan(this.lns / this.lew);
        this.rootNode = new Node('root');
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
      extentIsValid(extent = this.getCurrentMapVectorSource().getExtent()): boolean {
        if (extent[0] === extent[2] || extent[1] === extent[3]) {
          return false;
        }
        for (const extentValue of extent) {
          if (!Number.isFinite(Number(extentValue)) || extentValue === '') {
            return false;
          }
        }

        return true;
      },
      // basic email validation
      emailIsValid(email): boolean {
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
        if (this.emailIsValid(this.email) && this.categoriesAreSelected && this.extentIsValid() && this.bboxIsValid) {
          this.enableDownloadBtn();
        } else {
          this.disableDownloadBtn();
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

        const extent = [this.lon.min, this.lat.min, this.lon.max, this.lat.max];
        if (!this.extentIsValid(extent)) {
          this.clearForm();
          this.toggleDownloadBtn();
        }

        Ext.getCmp('wcsDownloadClear').enable();
      },
      clearForm(): void {
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
        extendedTool.activeMapPanel.addLayer(vector);
      },
      getCurrentMapVectorSource(): any {
        const layers = extendedTool.activeMapPanel.getLayers().array_;
        let vector;
        layers.forEach((layer) => {
          if (layer.values_.id && layer.values_.id === 'dataDownload') vector = layer;
        });
        if (vector) return vector.getSource();
        else return false;
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

      addBox(): void {
        let output;
        const draw = new Draw({
          source: new VectorSource(),
          type: GeometryType.CIRCLE,
          geometryFunction: createBox(),
        });

        extendedTool.activeMapPanel.addInteraction(draw);

        const source = this.getCurrentMapVectorSource();

        draw.on('drawstart', function (evt) {
          // create a measure tool tip
          if (extendedTool.measureTooltipElement.parentNode) {
            extendedTool.measureTooltipElement.parentNode.removeChild(extendedTool.measureTooltipElement);
          }
          extendedTool.activeMapPanel.addOverlay(extendedTool.measureTooltip);
          //  remove any previous drawings
          const drawItems = source.getFeatures();
          drawItems.forEach((drawItem) => {
            if (drawItem.values_.id === 'dataDownloadBox') source.removeFeature(drawItem);
          });

          const sketch = evt.feature;
          this.listener = sketch.getGeometry().on('change', function (evt) {
            const geom = evt.target;
            const coords = geom.getLinearRing(0).getCoordinates();
            output = Math.floor(geom.getArea(coords) / 2 / 1000000);
            const tooltipCoord = geom.getInteriorPoint().getCoordinates();
            extendedTool.measureTooltipElement.innerHTML = `${output}km<sup>2</sup>`;
            extendedTool.measureTooltip.setPosition(tooltipCoord);
          });
        });

        draw.on('drawend', function (evt) {
          const geom = evt.feature.getGeometry();
          const coord = (geom as Polygon).getCoordinates();
          const feature = new Feature({
            geometry: new Polygon(coord),
          });
          feature.set('id', 'dataDownloadBox');
          source.addFeature(feature);
          extendedTool.measureTooltipElement.innerHTML = '';
          extendedTool.hidePanelItems(output);
          extendedTool.updateTextBoxCoords();
        });
      },
      hidePanelItems(result): void {
        const downloadFlag = Ext.getCmp('redirectDownload');
        const downloadPanel = Ext.getCmp('dataDownloadPanel');
        const categoryText = Ext.getCmp('categoryText');
        Ext.getCmp('noBBox').hide();
        // The significance of 275,000 is based on the size of Colorado, which is ~269,000 (in EPSG:4326). This allows for some leeway due to imprecise drawing.
        if (result < 275000) {
          extendedTool.bboxIsValid = true;
          downloadFlag.hide();
          downloadPanel.show();
          categoryText.show();
        } else {
          categoryText.hide();
          extendedTool.bboxIsValid = false;
          downloadFlag.show();
          downloadPanel.hide();
        }
      },

      /*
       * Updates the textboxes to make them match the polygon's current location
       * Make call to update the bounding box categories as they may have changed since
       * the textbox coordinates have changed. However, we need to allow for circumstances
       * where the user may still be interacting with the box. This may cause bad values to
       * be used in the updateBBoxCategories() function.
       */
      updateTextBoxCoords(updateCategories = true): void {
        const map = extendedTool.activeMapPanel;
        const mapProjection = map.getView().getProjection();
        const lssource = this.getCurrentMapVectorSource();
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

          this.lat.min = miny;
          this.lat.max = maxy;
          this.lon.min = minx;
          this.lon.max = maxx;

          if (updateCategories) {
            this.updateBBoxCategories();
          }
        }
      },
      setFeature(): void {
        const lssource = this.getCurrentMapVectorSource();
        const lsfeature = lssource.getFeatures();
        const map = extendedTool.activeMapPanel;
        const mapProjection = map.getView().getProjection();

        if (!lsfeature[0]) {
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

          this.feature = new Feature({
            geometry: new Polygon([bboxCoordinates]), // For some reason OL requires the array structure as [ [[y,x],[y,x],[y,x],[y,x]] ]. E.G An array with a length of 1, containing our array of coordinates.
          });
          this.feature.set('id', 'dataDownloadBox');
          lssource.addFeature(this.feature);
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
      handleTextboxChange(): void {
        this.getCurrentMapVectorSource().clear();
        const extent = [this.lon.min, this.lat.min, this.lon.max, this.lat.max];

        if (this.extentIsValid(extent)) {
          this.setFeature();
        }
        this.toggleDownloadBtn();
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
        extendedTool.addVector();

        Ext.getCmp('redirectDownload').hide();
        this.createDefaultVars();
        this.addBox();

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
        this.updateBBoxCategories();
      },

      empty(mapWindowBlock): void {
        extendedTool.activeMapWindow = mapWindowBlock;
        const mapPanelBlock = mapWindowBlock.getReferencedBlock('cMapPanel');
        const { map } = mapPanelBlock.component;
        extendedTool.activeMapPanel = map;
        const lssource = extendedTool.getCurrentMapVectorSource();
        if (lssource) {
          lssource.clear();
          extendedTool.clearForm();
          extendedTool.updateBBoxCategories();
          extendedTool.disableDownloadBtn(); // skip straight to disable as the checks should fail
          extendedTool.measureTooltipElement.innerHTML = '';
          const map = extendedTool.activeMapPanel;
          const drawItems = map.getInteractions();
          drawItems.array_.forEach((item) => {
            if (item instanceof Draw) map.removeInteraction(item);
          });
          const noCategories = Ext.getCmp('noBBox');
          noCategories.show();
          const downloadPanel = Ext.getCmp('dataDownloadPanel');
          downloadPanel.hide();
        }
      },

      /*
       * Returns all layers in the layers.json file that are loadOnly and display false (aka the download layers)
       */
      // potentially configurable
      getDownloadLayers(): Array<LayerConfig> {
        const layersConfigId = globalThis.App.Layers.configInstanceId;
        const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
        const layers = globalThis.App.Layers.query(layersConfig.overlays, {
          type: 'layer',
          display: false,
          mask: false,
          loadOnly: true,
        });
        return layers;
      },

      /*
       * Creates and initiates the xml request
       * Calls parseXMLforCategories to actually go through the data
       */
      getXML(extendedTool, url): void {
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

      /*
       *	Inputs:
       *		request: the XMLHttpRequest object. Needed to retrieve the xml
       *
       *	Goes through all categories and layers provided.
       *	If the category is not already an object property, we add it as one
       *		We will then also add it as a checkbox
       *		Canopy analytical and cartographic are saved and added at the end to maintain the
       *			appearance of a hierarchical order.
       * 	The layers are pushed onto a numerical array corresponding to the appropriate object property
       *
       *	Example end object structure:
       *		this.categories {
       *	"landcover": 0 => "layer_name1";
       *	"canopy_cartographic": 0 => "layer_name2", 1 => "layername3";
       *	}
       *
       */
      /*
       * potentially configurable getElementsByTagName
       * if categories are not needed this function will need to be bypassed/reconfigured
       * perhaps a if(no categories or no) then lump them in as one category
       */
      parseXMLforCategories(request): void {
        const categoryCheckboxes = Ext.getCmp('cbCategories');
        const noCategories = Ext.getCmp('categoryText');

        noCategories.hide();

        const xmlDoc = request.responseXML; // the xml itself

        //  Take lcmap_Viewer_Layers_Extent_20200211:Viewer_Layers_Extent and cut off after the colon
        const layers = this.getDownloadLayers();
        const elementTitle = layers[0].name.split(':')[0];
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

        /*
         * mcat is the category name with no spaces and all lower case ("machine" name category)
         * cat is the category
         * dat contains an array of the dataset name, the filename and the metadata filename respectively
         */

        const categoryYears = [];
        for (let i = 0; i < categoryTags.length; i += 1) {
          const mcat = categoryTags[i].childNodes[0].nodeValue;
          const cat = mcat.replace('_', ' ').replace(/\b\w/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });

          const sourceMetadataPath = srcMeta[i].childNodes[0].nodeValue;
          const clippedRasterName = clpdRstr[i].childNodes[0].nodeValue;
          const sourceFolderName = srcFolder[i].childNodes[0].nodeValue;
          const sourceFileName = srcFile[i].childNodes[0].nodeValue;
          const clippedMetadataPath = srcMetadata[i].childNodes[0].nodeValue;
          const sourceProjection = srcProj[i].childNodes[0].nodeValue;
          // these values are used when forming json data to the server for processing
          const dat = [sourceMetadataPath, clippedRasterName, sourceFolderName, sourceFileName, clippedMetadataPath, sourceProjection];

          // check if we already have found layers under this category
          if (!this.categories[mcat]) {
            this.categories[mcat] = [];
            this.categories[mcat][0] = dat;

            const data = { boxLabel: cat, name: mcat, inputValue: mcat };
            const node = new Node(data);
            node.addParent(this.rootNode);
          } else if (!this.categories[mcat].includes(dat)) {
            // don't add layer if it already exists
            this.categories[mcat].push(dat);
          }

          const nlcdYearRegex = /NLCD_[0-9]{4}/;
          const yearRegex = /[0-9]{4}/;
          const nlcdYear = dat[1].match(nlcdYearRegex);
          if (nlcdYear) {
            let year = nlcdYear[0].match(yearRegex);
            year = year[0];
            if (!categoryYears[mcat] && year) {
              categoryYears[mcat] = [];
              categoryYears[mcat][0] = year;
            } else if (!categoryYears[mcat].includes(year)) {
              categoryYears[mcat].push(year);
            }
          }
        }

        this.rootNode.addToCmp(categoryCheckboxes);

        // show the newly added textboxes and hide the loading text
        categoryCheckboxes.show();
        // if there is nothing here to download, let the user know
        if (Object.keys(this.categories).length === 0 && this.categories.constructor === Object) {
          noCategories.setText('No Categories Available');
          noCategories.show();
        }
      },

      /*
       * Prepares for the request to get layers and corresponding categories for the area that the polygon is in
       * Calls this.getXML to actually send the prepared request
       */
      updateBBoxCategories(): void {
        const lssource = this.getCurrentMapVectorSource();
        const extent = lssource.getExtent();

        if (this.extentIsValid(extent)) {
          const layers = this.getDownloadLayers();
          const categoryCheckboxes = Ext.getCmp('cbCategories');
          let url = null;
          const baseurl = `${layers[0].source.wfs}request=GetFeature&version=1.1.0&typeName=${layers[0].name}&BBOX=`;

          url = `${baseurl + extent[0]},${extent[1]},${extent[2]},${extent[3]}`;

          categoryCheckboxes.setValue({});
          categoryCheckboxes.removeAll();
          if (this.rootNode) {
            this.rootNode.removeChildren();
          }
          this.categories = {};
          this.categoriesAreSelected = false;
          this.disableDownloadBtn(); // no need to call toggleDownloadBtn as we already know what the result should be
          if (Ext.getCmp('redirectDownload').hidden) Ext.getCmp('categoryText').show();
          this.getXML(this, url);
        }
      },
    };

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED,
      owningBlock.itemDefinition.mapWindowFocused,
      extendedTool
    );

    return extendedTool;
  },
  getComponent(extendedTool): Record<string, any> {
    const block = extendedTool.owningBlock.blockConfig;
    const granules = globalThis.App.Layers._granules.values();
    const startDate = granules.next().value.start;
    const endDate = granules.next().value.end;

    const year1 = startDate.getFullYear();
    const year2 = endDate.getFullYear();

    const component = {
      extendedTool,
      title: 'Data Download',
      collapsible: Object.prototype.hasOwnProperty.call(block, 'collapsible') ? block.collapsible : true,
      collapsed: Object.prototype.hasOwnProperty.call(block, 'collapsed') ? block.collapsed : true,
      componentCls: 'panel-border',
      autoScroll: true,
      autoHeight: true,
      maxHeight: window.innerHeight,
      grow: true,
      autoSize: true,
      border: 1,
      bodyCls: 'roundCorners',
      cls: 'padPanel',
      layout: 'vbox',
      items: [
        {
          xtype: 'panel',
          id: 'redirectDownload',
          items: [
            {
              xtype: 'tbtext',
              id: 'redirectDownloadText',
              text: `<b>NOTICE:</b><br> The extent of your download box<br>is too large. (Greater than 275,000<br>square km).
              <br><br>Please select a smaller area of<br>interest or go to:<br><a href="https://earthexplorer.usgs.gov/" target="_blank">https://earthexplorer.usgs.gov/</a><br>to download tiled LCMAP products<br>available for the entire<br>conterminous U.S.`,
              style: { fontSize: '14px', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
            },
          ],
        },
        {
          xtype: 'tbtext',
          id: 'categoryText',
          text: 'Fetching categories...',
          style: { fontSize: '14px', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
          hidden: true,
        },
        {
          xtype: 'tbtext',
          id: 'noBBox',
          text:
            'A box has not been drawn yet. <br><br> To draw one, please select the <br>Data Download tool <i class="fa fa-arrow-circle-o-down"></i><br>in the map window toolbar.',
          style: { fontSize: '14px', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
        },
        {
          xtype: 'panel',
          id: 'dataDownloadPanel',
          width: '100%',
          items: [
            {
              xtype: 'tbtext',
              id: 'selectCategoriesText',
              text: 'Select Categories:',
              style: { fontSize: '14px', fontWeight: 'bold', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
              hidden: false,
            },
            {
              extendedTool,
              xtype: 'checkboxgroup',
              id: 'cbCategories',
              columns: 1,
              vertical: true,
              items: [],
              hidden: true,
              listeners: {
                change(checkbox, values): void {
                  const obj = {};
                  let updatedRadios;
                  let updatedNodes;
                  const inputs = this.extendedTool.rootNode.getChildren();

                  /*
                   * go through all nodes; we have to go through all nodes to make sure
                   * they are set correctly. If a value is not set it will default to false.
                   * Once we have gone through all the nodes we then set the values
                   */
                  for (const node of inputs) {
                    /*
                     * if we already have the value we don't need to go through this process again
                     * going through the process again may break radio button functionality
                     */
                    if (!Object.prototype.hasOwnProperty.call(obj, node.data.name)) {
                      // see if this has been passed in as a selected value
                      if (Object.prototype.hasOwnProperty.call(values, node.data.name)) {
                        node.selected = true;
                        this.extendedTool.categoriesAreSelected = true;
                        /*
                         * if this is newly selected then we neeed to enable the node's
                         * children and set default values. If it is not then these have
                         * already been set and will be gone through in the parent loop
                         */
                        if (node.selected !== node.prevSelected) {
                          updatedNodes = node.enableChildren();
                          updatedRadios = node.radioBehavior();
                          updatedNodes = updatedNodes.concat(updatedRadios);
                          for (const updatedNode of updatedNodes) {
                            // store values of children
                            obj[updatedNode.data.name] = updatedNode.selected;
                          }
                        }
                      } else {
                        node.selected = false;
                        /*
                         * if this is newly unselected then we neeed to disable the node's
                         * children
                         */
                        if (node.selected !== node.prevSelected) {
                          updatedNodes = node.disableChildren();
                          updatedRadios = node.radioBehavior();
                          updatedNodes = updatedNodes.concat(updatedRadios);
                          for (const updatedNode of updatedNodes) {
                            // store values of children
                            obj[updatedNode.data.name] = updatedNode.selected;
                          }
                        }
                      }
                      // store new values
                      obj[node.data.name] = node.selected;
                      node.prevSelected = node.selected;
                    }
                  }

                  // set all values we have calculated
                  this.setValue(obj);

                  this.extendedTool.categoriesAreSelected = false;
                  for (const v of Object.values(obj)) {
                    if (v === true) {
                      this.extendedTool.categoriesAreSelected = true;
                      break;
                    }
                  }

                  this.extendedTool.toggleDownloadBtn();
                },
              },
            },
            {
              xtype: 'text',
              id: 'selectYears',
              text: 'Select Years:',
              style: { fontSize: '14px', fontWeight: 'bold', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
            },
            {
              xtype: 'tbtext',
              id: 'slideYears',
              text: `${year1}-${year2}`,
              style: { marginLeft: '85px', marginBottom: '5px', marginTop: '5px', fontSize: '14px' },
            },
            {
              xtype: 'multislider',
              width: '90%',
              style: { marginLeft: '10px' },
              id: 'yearSlider',
              values: [year1, year2],
              increment: 1,
              minValue: year1,
              maxValue: year2,
              constrainThumbs: true,
              listeners: {
                change(el): void {
                  const slideYears = Ext.getCmp('slideYears');
                  slideYears.setText(`${el.thumbs[0].value}-${el.thumbs[1].value}`);
                },
              },
            },
            {
              xtype: 'tbtext',
              text: 'Latitude (dd):',
              style: { marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
            },
            {
              id: 'latitudes',
              layout: {
                type: 'table',
                columns: 2,
              },
              width: '100%',
              style: { padding: '5px' },
              items: [
                {
                  extendedTool,
                  xtype: 'textfield',
                  id: 'bbox1',
                  name: 'minLat',
                  emptyText: 'min',
                  listeners: {
                    change(textbox, value): void {
                      this.extendedTool.lat.min = value;
                    },
                    blur(textbox, value): void {
                      this.extendedTool.handleTextboxChange(textbox.name);
                    },
                  },
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
                    blur(textbox, value): void {
                      this.extendedTool.handleTextboxChange(textbox.name);
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
              id: 'longitudes',
              layout: {
                type: 'table',
                columns: 2,
              },
              width: '100%',
              style: { padding: '5px' },
              items: [
                {
                  extendedTool,
                  xtype: 'textfield',
                  id: 'bbox3',
                  name: 'minLon',
                  emptyText: 'min',
                  listeners: {
                    change(textbox, value): void {
                      this.extendedTool.lon.min = value;
                    },
                    blur(textbox): void {
                      this.extendedTool.handleTextboxChange(textbox.name);
                    },
                  },
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
                    },
                  },
                },
              ],
            },
            {
              extendedTool,
              xtype: 'textfield',
              name: 'Email',
              emptyText: 'Email',
              width: '95%',
              style: { marginLeft: '6px' },
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
              columnWidth: '50%',
              width: '100%',
              style: { padding: '5px' },
              items: [
                {
                  extendedTool,
                  xtype: 'button',
                  text: 'Clear',
                  id: 'wcsDownloadClear',
                  columnWidth: 0.5,
                  listeners: {
                    click(): void {
                      const lssource = extendedTool.getCurrentMapVectorSource();
                      if (lssource) {
                        lssource.clear();
                        this.extendedTool.clearForm();
                        this.extendedTool.updateBBoxCategories();
                        this.extendedTool.disableDownloadBtn(); // skip straight to disable as the checks should fail
                        extendedTool.measureTooltipElement.innerHTML = '';
                        const map = extendedTool.activeMapPanel;
                        const drawItems = map.getInteractions();
                        drawItems.array_.forEach((item) => {
                          if (item instanceof Draw) map.removeInteraction(item);
                        });
                        const noCategories = Ext.getCmp('noBBox');
                        noCategories.show();
                        const downloadPanel = Ext.getCmp('dataDownloadPanel');
                        downloadPanel.hide();
                        extendedTool.openAndEnable(extendedTool.activeMapWindow);
                      }
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
                  listeners: {
                    click(): void {
                      // this listener will need slight rework if potentially configurable items are configured

                      // object used to store layers and turn into JSON for server processing
                      function RequestDataObj(src_folder, src_file, src_meta, bbox, years): void {
                        this.src_file = src_file;
                        this.src_folder = src_folder;
                        this.src_meta = src_meta;
                        this.bbox = bbox;
                        this.years = years;
                      }

                      const mapProj = extendedTool.activeMapPanel.getView().getProjection().getCode();
                      const extent = this.extendedTool.getCurrentMapVectorSource().getExtent();
                      const selectedChildren = this.extendedTool.rootNode.getSelectedChildren(); // the categories that the user checked (selected)
                      const categoryArray = []; // an array of all categories the user has selected from
                      const numOfFiles = {}; // keep track of how many files each category requests to download
                      const requestData = [];
                      const years = Ext.getCmp('slideYears').text;
                      // for each node checked (or selected) add the corresponding layers to the requestData array
                      for (const node of selectedChildren) {
                        const categoryData = node.data.inputValue; // categoryData: An individual category name from this.extendedTool.selectedCategories
                        categoryArray.push(categoryData);

                        if (this.extendedTool.categories[categoryData]) {
                          // for each layer under this category
                          numOfFiles[categoryData] = 0;
                          for (const layerOfCategeory of this.extendedTool.categories[categoryData]) {
                            /*
                             * selectedClippedMetadataName: A layer underneath one of the categories in this.extendedTool.selectedCategories
                             * selectedSourceRasterName: The source raster file name for the selected layer
                             */

                            //  xyz exists here because the XML is wrong (2020, 02/21). This will change in the future
                            const [src_meta, selectedClippedRasterName, src_folder, src_file, xyz, sourceProjection] = layerOfCategeory;
                            const transExtent = transformExtent(extent, mapProj, sourceProjection); // transformed extent
                            if (!this.extendedTool.extentIsValid(transExtent)) {
                              alert('The bounding box of your download request is NOT VALID!');
                              break;
                            }
                            requestData.push(new RequestDataObj(src_folder, src_file, src_meta, transExtent, years));
                            numOfFiles[categoryData] += 1;
                          }
                        }
                      }

                      const catstr = categoryArray.join();
                      const jsonstr = JSON.stringify(requestData);

                      if (jsonstr && jsonstr !== '[]' && jsonstr !== '{}' && catstr && this.extendedTool.emailIsValid(this.extendedTool.email)) {
                        const email = this.extendedTool.email.trim();

                        // recording the tld of the email address used to download data
                        const rexpr = /\.[^(.|\s)]+$/; // get tld (last dot plus following letters); only gets .uk in .co.uk
                        const tld = rexpr.exec(email);
                        globalThis.App.Analytics.reportActivity(tld[0].toLowerCase(), 'Downloads', 'Domain');

                        // download tracking: record categories that are being downloaded and how many files each one has
                        for (const cd in numOfFiles) {
                          if (Object.prototype.hasOwnProperty.call(numOfFiles, cd)) {
                            globalThis.App.Analytics.reportActivity(cd, 'Downloads', 'Download', numOfFiles[cd]);
                          }
                        }

                        const url = encodeURI('../downloads/addQueue.php');

                        const request = new XMLHttpRequest();
                        request.open('POST', url, true);
                        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
                        let currentURL = `${window.location.origin}${window.location.pathname}?downloadBbox=`;

                        for (let i = 1; i < 5; i += 1) {
                          currentURL += Ext.getCmp(`bbox${i}`).getValue();
                          if (i < 4) {
                            currentURL += ',';
                          }
                        }

                        request.send(`layers=${jsonstr}&email=${email}&categories=${catstr}&bboxUrl=${encodeURIComponent(currentURL)}`);

                        request.onreadystatechange = function (): void {
                          if (this.readyState === 4 && this.status === 200) {
                            const response = JSON.parse(request.response);
                            if (response.success === true) {
                              alert(
                                `Your download request has successfully been sent and will be processed for you within 24 hours.  You will receive an e-mail with instructions on retrieving your data.  Thank you.`
                              );
                            } else {
                              alert(`ERROR: ${response.errorMessage}`);
                            }
                          }
                        };
                      } else {
                        alert('Due to required values being missing or incorrect we did not attempt to send the request.');
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
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
          if (this.extendedTool.component.header)
            this.extendedTool.component.header.tools.forEach((element) => {
              element.el.dom.title = element.type[0].toUpperCase() + element.type.split('-')[0].slice(1);
            });

          extendedTool.measureTooltipElement = document.createElement('div');
          extendedTool.measureTooltipElement.className = 'tooltip tooltip-measure';
          extendedTool.measureTooltip = new Overlay({
            element: extendedTool.measureTooltipElement,
            offset: [0, -15],
            positioning: OverlayPositioning.TOP_CENTER,
          });

          Ext.getCmp('redirectDownload').hide();
          const downloadPanel = Ext.getCmp('dataDownloadPanel');
          downloadPanel.hide();
          const noBBox = Ext.getCmp('noBBox');
          noBBox.show();
          //  Grab the URL Parameters, check if it contains "bbox"
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);

          if (urlParams.has('downloadBbox')) {
            noBBox.hide();
            downloadPanel.show();
            const dataDownloadPanel: any = Ext.ComponentQuery.query('[dataDownload=true]');
            dataDownloadPanel[0].toggle();
            const tools = Ext.getCmp('cTools');
            //  Every second, check if cTools is rendered, when it is clear this interval and trigger bbox
            const toolCheck = setInterval(() => {
              if (tools.rendered) {
                const bboxCoords = urlParams.get('downloadBbox');
                const coordArray = bboxCoords.split(','); //  take the bbox coords and turn them into an array

                coordArray.forEach((coord, index) => {
                  index += 1;
                  const bboxField = Ext.getCmp(`bbox${index}`);
                  bboxField.setValue(coord);
                });
                this.extendedTool.createDefaultVars();
                this.extendedTool.setFeature();
                this.extendedTool.updateBBoxCategories();

                extendedTool.activeMapPanel.getView().fit(this.extendedTool.feature.getGeometry().getExtent());
                extendedTool.bboxIsValid = true;
                clearInterval(toolCheck);
              }
            }, 1000);
          }
        },
      },
    };
    return component;
  },
};
