import VectorLayer from 'ol/layer/Vector';
import OverlayPositioning from 'ol/OverlayPositioning';
import { Dictionary, LayerConfig } from 'src/@types';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import { boundingExtent, extend, getCenter } from 'ol/extent';
import { Translate } from 'ol/interaction';
import { fromLonLat, toLonLat, transform, transformExtent, ProjectionLike } from 'ol/proj';
import Feature from 'ol/Feature';
import Polygon, { fromExtent } from 'ol/geom/Polygon';
import { Extent } from 'ol/extent';
import Collection from 'ol/Collection';
import { Coordinate } from 'ol/coordinate';
import { getBlocksByName } from '../../../helpers/extjs';
import Overlay from 'ol/Overlay';
import GeometryType from 'ol/geom/GeometryType';
import Draw, { createBox } from 'ol/interaction/Draw';
import './cDataDownload.css';
import { getDownloadPanel } from './dateSelectors';
import { singleDigitToDouble } from '../../../helpers/string';

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
  addToCmp(cmp, block): void {
    let q = this.children.concat(); // concat forces to set q by value and not reference
    if (block.dateSelection === 'calendar') {
      q.sort((a, b) => b.data.name.localeCompare(a.data.name)); // sort alphabetically for FireDanger
    }
    while (Array.isArray(q) && q.length) {
      const node = q.pop();
      q = q.concat(node.children);

      if (node.parent === this) {
        node.id = cmp.add(node.data).getId();
        node.enabled = true;
      } else {
        node.id = cmp.add(node.data).disable().getId();
        node.enabled = false;
      }

      // make checkbox look like a radio button if node.radio is true
      if (node.radio) {
        Ext.getCmp(node.id).addCls('checkbox-overwrite');
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

    extendedTool.addVector();
  },
  mapWindowFocused(postingObj: Dictionary, callbackObj: Dictionary): void {
    const mapWindow = postingObj;
    const extendedTool = callbackObj;
    extendedTool.activeMapWindow = mapWindow.owningBlock;
    extendedTool.component.expand();
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

    const extendedTool = {
      qsource: null,
      rsource: null,
      owningBlock,
      activeMapPanel: null,
      activeMapWindow: mapWindow,
      measureTooltipElement: null,
      measureTooltip: null,
      interactionAdded: false,
      xmlRequestComplete: true,
      bboxIsValid: false,
      categories: [],
      selectedCategories: [],
      updatedRegionForBBoxURL: '',
      version: '',
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
      extentTooBig(extent: Extent) {
        const area = Math.floor(fromExtent(extent).getArea() / 2 / 1000000);
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

        const extent: Extent = [this.lon.min, this.lat.min, this.lon.max, this.lat.max];
        if (this.extentIsValid(extent)) {
          if (this.extentTooBig()) {
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
        this.measureTooltip = new Overlay({
          element: this.measureTooltipElement,
          offset: [0, -15],
          positioning: OverlayPositioning.BOTTOM_CENTER,
        });
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
      createDrawBox(): void {
        let output;
        let extent;
        const draw = new Draw({
          source: new VectorSource(),
          type: GeometryType.CIRCLE,
          geometryFunction: createBox(),
        });

        const map = this.getCurrentMap();
        map.addInteraction(draw);

        const source = this.getCurrentMapVectorSource();

        draw.on('drawstart', function (evt) {
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
            extent = geom.getExtent();
            const coords = geom.getLinearRing(0).getCoordinates();
            output = Math.floor(geom.getArea(coords) / 2 / 1000000);
            const tooltipCoord = geom.getInteriorPoint().getCoordinates();
            extendedTool.measureTooltipElement.innerHTML = `${output}km<sup>2</sup>`;
            extendedTool.measureTooltip.setPosition(tooltipCoord);
          });
        });

        draw.on('drawend', function (evt) {
          const geom = evt.feature.getGeometry();
          extent = geom.getExtent();
          const coord = (geom as Polygon).getCoordinates();
          const feature = new Feature({
            geometry: new Polygon(coord),
          });
          feature.set('id', 'dataDownloadBox');
          source.addFeature(feature);
          extendedTool.hidePanelItems(extent);
          extendedTool.updateTextBoxCoords();
          extendedTool.measureTooltipElement.className = 'tooltip tooltip-static';
          extendedTool.measureTooltip.setOffset([0, -7]);
          extendedTool.measureTooltipElement = null; // unset tooltip so that a new one can be created
        });
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
        const categoryText = Ext.getCmp('categoryText');
        const noBoxText = Ext.getCmp('noBoxText');

        noBoxText.hide();

        if (redirectDownload && downloadPanel && categoryText) {
          if (this.extentIsValid(extent)) {
            extendedTool.bboxIsValid = true;
            if (extendedTool.owningBlock.blockConfig.redirectText) {
              redirectDownload.hide();
            }
            downloadPanel.show();
            categoryText.setText('Fetching categories...');
          } else {
            extendedTool.bboxIsValid = false;
            redirectDownload.show();
            if (!extendedTool.owningBlock.blockConfig.alwaysDisplayDownloadPanel) {
              downloadPanel.hide();
            } else {
              downloadPanel.hide();
              categoryText.setText('No Categories Available');
              categoryText.show();
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

          this.bboxCoordinates = bboxCoordinates;

          this.feature = new Feature({
            geometry: new Polygon([bboxCoordinates]), // For some reason OL requires the array structure as [ [[y,x],[y,x],[y,x],[y,x]] ]. E.G An array with a length of 1, containing our array of coordinates.
          });
          this.feature.set('id', 'dataDownloadBox');
        }
        const geom = this.feature.getGeometry();
        const coords = geom.getLinearRing(0).getCoordinates();
        const output = Math.floor(geom.getArea(coords) / 2 / 1000000);
        const tooltipCoord = geom.getInteriorPoint().getCoordinates();

        this.createMeasureTooltip();

        extendedTool.measureTooltipElement.innerHTML = `${output}km<sup>2</sup>`;
        extendedTool.measureTooltip.setPosition(tooltipCoord);

        lssource.addFeature(this.feature);
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
            maxLonTxtBox.resumeEvents();

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
      /**
       * Build an array of source file names based on the layer's granule.
       * @param {string} selectedSourceFolder - The source folder name returned from the XML must match the layer's ID property (camel-cased).
       * @param {number} yearVal
       * @param {string} monthVal
       * @param {string} sourceFileName
       * @returns {Array<string>}
       */
      getSourceFileNames(selectedSourceFolder: string, startDate: Date, endDate: Date, sourceFileName: string): Array<string> {
        // Here we query all layers to look for one which matches the src_folder name.
        // NDVI datasets exist in layers.ts but they all share the same start/end dates and period (dekad/pentad/etc).
        // Mean datasets do NOT exist in layers.ts but we can use the ID up to the year range (E.G lstc6_global_month_2003_2018_mean -> lstc6_global_month) to retrieve its granules.
        let layers;
        if (selectedSourceFolder.includes('ndvi')) {
          layers = globalThis.App.Layers.query(globalThis.App.Layers._layers, (layer) => {
            if (layer.id.includes('ndvi')) return true;
            return false;
          });
        } else if (selectedSourceFolder.includes('mean')) {
          let splitter;

          selectedSourceFolder.split('_').forEach((item) => {
            if ((!splitter && item.includes('20')) || item.includes('19')) splitter = item; // Get the first year in selectedSourceFolder
          });

          layers = globalThis.App.Layers.query(globalThis.App.Layers._layers, (layer) => {
            if (layer.id.includes(selectedSourceFolder.split('_' + splitter)[0])) return true; // Use "_splitter" to retrieve the ID (line 1094)
            return false;
          });
        } else {
          selectedSourceFolder = selectedSourceFolder.replaceAll('-', '_');
          layers = globalThis.App.Layers.query(globalThis.App.Layers._layers, {
            type: 'layer',
            id: selectedSourceFolder,
          });
        }

        // get the layer's granule
        const g = globalThis.App.Layers._granules.get(layers[0].id);
        let year = startDate.getFullYear();
        let endMonth = endDate.getMonth();
        let startMonth = startDate.getMonth();
        let startIndex, endIndex;

        // Get starting/ending index of date range to slice selected dates from granule array
        if (extendedTool.owningBlock.blockConfig.dateSelection === 'yearCombos') {
          // EWX handles date ranges uniquely. If Jan 2002 (start) and March 2005 (end) are selected, the requested layers
          // will be Jan-March 2002, Jan-March 2003, etc.
          startIndex = g.intervals.findIndex((i) => i.start.startsWith(`${year}-${singleDigitToDouble(startMonth + 1)}`)); // Months are zero indexed- add one
          endIndex = g.intervals.findIndex((i) => i.start.startsWith(`${year}-${singleDigitToDouble(endMonth + 2)}`)); // +1 for month index and +1 because slice(1,5) returns 1, 2, 3, 4- and we want 5 included
        } else {
          startIndex = g.intervals.findIndex((i) =>
            i.start.startsWith(
              `${startDate.getFullYear()}-${singleDigitToDouble(startDate.getMonth() + 1)}-${singleDigitToDouble(startDate.getDate())}`
            )
          );
          endIndex = g.intervals.findIndex((i) =>
            i.start.startsWith(`${endDate.getFullYear()}-${singleDigitToDouble(endDate.getMonth() + 1)}-${singleDigitToDouble(endDate.getDate())}`)
          );
          if (endIndex >= 0) endIndex += 1; // +1 for slice index see line ~1124
        }

        if (startIndex === -1 && endIndex === -1) return null;
        if (startIndex < 0) startIndex = 0; // Using a negative slice value causes it to count at the /end/ of the array
        if (endIndex === -1) endIndex = g.intervals.length; // If selected end date > granule end, use the length to include all available data after start date

        const dateRange = g.intervals.slice(startIndex, endIndex);

        // Iterate over each interval and build the array of filenames
        return dateRange.map((element) => {
          let tempName = sourceFileName;
          const [startYear, startMonth, startDay] = element.start.split('-');
          const [endYear, endMonth, endDay] = element.end.split('-');
          tempName = tempName.replace(/yyyy/i, startYear).replace(/mm/i, startMonth).replace(/dd/i, startDay);
          tempName = tempName.replace(/yyyy/i, endYear).replace(/mm/i, endMonth).replace(/dd/i, endDay); //Replace will only execute on the first match, so it is done twice for both dates. And by using regex (/yyyy/i) we can ignore case
          return tempName;
        });
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
          const categoryText = Ext.getCmp('categoryText');
          categoryText.setText('No Categories Available');
        }
        const noBoxText = Ext.getCmp('noBoxText');
        noBoxText.setText(extendedTool.owningBlock.blockConfig.noBoxText);
        noBoxText.show();
        Ext.getCmp('dataDownloadPanel').hide();

        // collapses the section in the tool panel
        const dataDownloadToolPanel: any = Ext.ComponentQuery.query('[title=Data Download]');
        dataDownloadToolPanel[0].collapse();
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
        this.createDrawBox();

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

      getLayers(): Array<LayerConfig> {
        const layersConfigId = globalThis.App.Layers.configInstanceId;
        const layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
        const layers = globalThis.App.Layers.query(layersConfig.overlays, {
          type: 'layer',
        });
        return layers;
      },
      /*
       * Returns all layers in the layers.json file that are loadOnly and display false (aka the download layers)
       */
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
      getXML(extendedTool, url: string): void {
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
       * Inputs:
       *   region: the current region the user drew a bbox on
       *
       * updates the year slider based on where the bbox is drawn
       */
      updateYearSlider(region) {
        //LCMAP region change logic for yearSlider to update accordingly.
        const slideYears = Ext.getCmp('slideYears');
        let yearSlider = Ext.getCmp('yearSlider');
        // check if the current viewer has a yearSlider and a slideYear text
        if (slideYears !== undefined && yearSlider !== undefined) {
          const layers = globalThis.App.Layers._layers;
          for (let i = 0; i < layers.length; i++) {
            // we need the layer that correspods to the current region that we are currently on
            if (layers[i]?.additionalAttributes?.rasterDataset.includes(region)) {
              const granule = globalThis.App.Layers._originalGranules.get(layers[i].id);
              if (granule !== undefined) {
                const endDate = granule.end;
                const startDate = granule.start;
                const year1 = startDate ? startDate.getFullYear() : null;
                const year2 = endDate ? endDate.getFullYear() : null;
                slideYears.setText(`${year1}-${year2}`);
                yearSlider.setMinValue(year1);
                yearSlider.setMaxValue(year2);
                yearSlider.setValue([year1, year2]);
                break;
              }
            }
          }
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
      parseXMLforCategories(request: XMLHttpRequest): void {
        const categoryCheckboxes = Ext.getCmp('cbCategories');
        const categoryText = Ext.getCmp('categoryText');

        categoryText.setText('Loading...');

        const xmlDoc = request.responseXML; // the xml itself

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
        const version = xmlDoc.getElementsByTagName(`${elementTitle}:version`);

        /*
         * mcat is the category name with no spaces and all lower case ("machine" name category)
         * cat is the category
         * dat contains an array of the dataset name, the filename and the metadata filename respectively
         */

        const categoryYears = [];
        for (let i = 0; i < categoryTags.length; i += 1) {
          const cat = categoryTags[i].childNodes[0].nodeValue;
          // const mcat = cat.replace(' ', '_').toLowerCase();

          const sourceMetadataPath = srcMeta[i]?.childNodes[0]?.nodeValue ? srcMeta[i]?.childNodes[0]?.nodeValue : null;
          const clippedRasterName = clpdRstr[i]?.childNodes[0]?.nodeValue ? clpdRstr[i]?.childNodes[0]?.nodeValue : null;
          const sourceFolderName = srcFolder[i]?.childNodes[0]?.nodeValue ? srcFolder[i]?.childNodes[0]?.nodeValue : null;
          const sourceFileName = srcFile[i]?.childNodes[0]?.nodeValue ? srcFile[i]?.childNodes[0]?.nodeValue : null;
          const clippedMetadataPath = srcMetadata[i]?.childNodes[0]?.nodeValue ? srcMetadata[i]?.childNodes[0]?.nodeValue : null;
          const sourceProjection = srcProj[i]?.childNodes[0]?.nodeValue ? srcProj[i]?.childNodes[0]?.nodeValue : null;
          // vertsionType is relavent for LCMAP
          const versionType = version[i]?.childNodes[0]?.nodeValue ? version[i]?.childNodes[0]?.nodeValue : null;
          if (versionType !== undefined) extendedTool.version = versionType;

          let metadata = null;
          if (metadataArr.length > 0) {
            metadata = metadataArr[i]?.childNodes[0]?.nodeValue;
          }

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

          // FOR LCMAP
          // logic for handling if the user draws a bbox that is not on the current region active.
          // For ex. current region active is CONUS and the user draws a bbox on Hawaii.
          const region = Ext.getCmp('regionCombo');
          // get the current region from the region combobox
          const currentRegion = region?.value;
          if (currentRegion) {
            // we need to get the region where the bbox is drawn. For that we split the `sourceFolderName` which has the region where the user drew the box.
            const updateRegion = sourceFolderName.split('_')[1];
            // check if the `sourcefolderName` does not include the currentRegion (one from the region combobox)
            if (!sourceFolderName.includes(currentRegion)) {
              // updateYearSlider updates the yealslider and the text above the slider to work with the non-active region
              extendedTool.updateYearSlider(updateRegion);
              isWMST = true;
              // need the region where the user drew the box for the bboxURL for the user to be able to use that.
              extendedTool.updatedRegionForBBoxURL = updateRegion;
            } else {
              extendedTool.updateYearSlider(currentRegion);
            }
          }

          // these values are used when forming json data to the server for processing
          const dat: [string, string, string, string, string, string, string, boolean] = [
            sourceMetadataPath,
            clippedRasterName,
            sourceFolderName,
            sourceFileName,
            clippedMetadataPath,
            sourceProjection,
            metadata,
            isWMST,
          ];

          // check if we already have found layers under this category
          if (!this.categories[cat]) {
            this.categories[cat] = [];
            this.categories[cat][0] = dat;

            const data = { boxLabel: cat, name: cat, inputValue: cat };
            const node = new Node(data);
            node.addParent(this.rootNode);
          } else if (!this.categories[cat].includes(dat)) {
            // don't add layer if it already exists
            this.categories[cat].push(dat);
          }

          const nlcdYearRegex = /NLCD_[0-9]{4}/;
          const yearRegex = /[0-9]{4}/;
          const nlcdYear = dat[1].match(nlcdYearRegex);
          if (nlcdYear) {
            const year = nlcdYear[0].match(yearRegex)[0];
            if (!categoryYears[cat] && year) {
              categoryYears[cat] = [];
              categoryYears[cat][0] = year;
            } else if (!categoryYears[cat].includes(year)) {
              categoryYears[cat].push(year);
            }
          }
        }

        if (
          extendedTool.owningBlock.blockConfig.hasOwnProperty('yearCheckboxes') &&
          Array.isArray(extendedTool.owningBlock.blockConfig.yearCheckboxes)
        ) {
          for (const [catKey, years] of Object.entries(categoryYears)) {
            if (years.length > 1) {
              const lowCatKey = catKey.replace(' ', '_').toLowerCase();
              const pnode = this.rootNode.getNodeByDataName(catKey);

              // don't add the children twice
              if (!Array.isArray(pnode.children) || !pnode.children.length) {
                for (const [index, year] of years.entries()) {
                  if (extendedTool.owningBlock.blockConfig.yearCheckboxes.includes(parseInt(year))) {
                    const c0BoxLabel = `${year} ${catKey} ONLY`;

                    const c0Name = `${lowCatKey}${year}`;

                    let c0IV = null;
                    // for when we want to include files that do not have 2016 in the name for the 2016 only selection
                    const keys = Object.keys(extendedTool.owningBlock.blockConfig?.categories);
                    for (const key of keys) {
                      if (lowCatKey === key) {
                        c0IV = extendedTool.owningBlock.blockConfig.categories[key];
                      }
                    }
                    if (keys && c0IV === null) {
                      c0IV = `${extendedTool.owningBlock.blockConfig.categories['default']}${lowCatKey}`;
                    }

                    const c0data = { style: 'margin-left: 12px', boxLabel: c0BoxLabel, name: c0Name, inputValue: c0IV };
                    const c0node = new Node(c0data, true);
                    c0node.purpose = 'filter';
                    pnode.addChild([c0node]);
                  }
                }

                if (extendedTool.owningBlock.blockConfig.yearCheckboxes.includes('All')) {
                  const c1BoxLabel = `All ${catKey} Years`;
                  const c1Name = `${catKey}All`;

                  const c1data = { style: 'margin-left: 12px', boxLabel: c1BoxLabel, name: c1Name, inputValue: 'all' };

                  const c1node = new Node(c1data, true, true);

                  c1node.purpose = 'filter';

                  pnode.addChild([c1node]);
                }
              }
            }
          }
        }
        const block = extendedTool.owningBlock.blockConfig;
        this.rootNode.addToCmp(categoryCheckboxes, block);

        // show the newly added textboxes and hide the loading text
        categoryCheckboxes.show();
        // if there is nothing here to download, let the user know
        if (Object.keys(this.categories).length === 0 && this.categories.constructor === Object) {
          categoryText.setText('No Categories Available');
          categoryText.show();
        } else {
          categoryText.hide();
        }
      },

      /*
       * Prepares for the request to get layers and corresponding categories for the area that the polygon is in
       * Calls this.getXML to actually send the prepared request
       */
      updateBBoxCategories(): void {
        const lssource = this.getCurrentMapVectorSource();
        let extent: Extent = [null, null, null, null];
        if (lssource) {
          extent = lssource?.getExtent();
        }

        if (this.extentIsValid(extent) && !this.extentTooBig(extent)) {
          let layers = this.getDownloadLayers();
          if (!layers.length) {
            layers = this.getLayers();
          }
          const geoserver = extendedTool.owningBlock.blockConfig.geoserver ? extendedTool.owningBlock.blockConfig.geoserver : layers[0].source.wfs;
          const shapeFile = extendedTool.owningBlock.blockConfig.shapeFile ? extendedTool.owningBlock.blockConfig.shapeFile : layers[0].name;
          const categoryCheckboxes = Ext.getCmp('cbCategories');
          const categoryText = Ext.getCmp('categoryText');
          const noBoxText = Ext.getCmp('noBoxText');
          Ext.getCmp('dataDownloadPanel').show();
          let url = null;
          const baseurl = `${geoserver}request=GetFeature&version=1.1.0&typeName=${shapeFile}&BBOX=`;

          url = `${baseurl + extent[0]},${extent[1]},${extent[2]},${extent[3]}`;

          categoryCheckboxes.setValue({});
          categoryCheckboxes.removeAll();
          if (this.rootNode) {
            this.rootNode.removeChildren();
          }
          this.categories = {};
          this.categoriesAreSelected = false;
          this.disableDownloadBtn(); // no need to call toggleDownloadBtn as we already know what the result should be
          categoryText.setText('Fetching Categories...');
          categoryText.show();
          noBoxText.hide();
          this.getXML(this, url);
        } else if (this.extentTooBig(extent)) {
          Ext.getCmp('dataDownloadPanel').hide();
          Ext.getCmp('redirectDownload').show();
          Ext.getCmp('redirectDownloadText').show();
        } else {
          const dataDownloadPanel = Ext.getCmp('dataDownloadPanel');
          const noBoxText = Ext.getCmp('noBoxText');
          dataDownloadPanel.hide();
          noBoxText.show();
        }
      },
    };

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
    return getDownloadPanel(extendedTool);
  },
};
