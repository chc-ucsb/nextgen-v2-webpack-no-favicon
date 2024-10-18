import VectorLayer from 'ol/layer/Vector';
import OverlayPositioning from 'ol/OverlayPositioning';
import { Dictionary, LayerConfig } from 'src/@types';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import { extend, Extent } from 'ol/extent';
import { getBlocksByName } from '../../../helpers/extjs';
import Overlay from 'ol/Overlay';
import GeometryType from 'ol/geom/GeometryType';
import './cDataDownload.css';
import Draw, { createBox } from 'ol/interaction/Draw';
import GeoJSON from 'ol/format/GeoJSON';
import { monthStrToNum, numMonthToString } from '../../../helpers/date';
import { getArea } from 'ol/sphere';
import { singleDigitToDouble } from '../../../helpers/string';
import { Fill, Stroke, Style } from 'ol/style';
import gjv from 'geojson-validation';
import gpsi from './gpsi';

interface NodeData {
  style?: string;
  boxLabel?: string;
  name: string;
  inputValue?: string;
  maxExtent?: any;
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
   * Disable all  nodes that are children of another node
   */
  addToCmp(cmp): void {
    cmp.items.items = [];
    let q = this.children.concat(); // concat forces to set q by value and not reference

    // For parent folder titles to appear in the checkboxgroup we create an array of objects, each one including the folder it should be under,
    // and a unique property 'downloadCategoryTitle' (layer.name could not be used due to MRLC not using wmstName) a flag is also set for ordering later.
    const categoriesAndLayers = [];
    globalThis.App.Layers.layersConfig.overlays.forEach((folder) => {
      folder.folder.forEach((layer) => {
        if (layer.folder && layer.folder[0]?.additionalAttributes?.downloadCategoryTitle) {
          categoriesAndLayers.push({ category: folder.title, layer: layer.folder[0].additionalAttributes.downloadCategoryTitle });
          globalThis.App.Layers.hasCategories = true;
        }
      });
    });

    while (Array.isArray(q) && q.length) {
      const node = q.shift();
      q = q.concat(node.children);

      if (node.parent === this && node.nodeTest === false) {
        // If categoriesAndLayers contains an object whose layer matches the checkbox name (derived from 'Category' in the XML) & the checkboxgroup does not
        // already contain a textbox with that title, it is added to the list of checkboxes but is not yet ordered (see line ~1340)
        const matchLayer = categoriesAndLayers.find((item) => item.layer === node.data.name);
        if (matchLayer) {
          const matchItem = cmp.items.items.find((item) => item.text === matchLayer.category);
          if (!matchItem) {
            cmp.add({
              xtype: 'tbtext',
              text: matchLayer.category,
              hidden: false,
            });
          }
        }
        node.id = cmp.add(node.data).getId();
        node.enabled = true;
      } else {
        node.data.boxLabel += `<br>(Rectangle Exceeds ${node.data.maxExtent} sqkm)`;
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
}

export const cDataDownload = {
  options: {
    events: ['collapse', 'expand'],
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
  },
  mapWindowCreated(postingObj: Dictionary, callbackObj: Dictionary): void {
    const extendedTool = callbackObj;
    extendedTool.activeMapWindow = postingObj.owningBlock;

    // Checks if the interaction was added to the last map window and if so, add it to the newly selected map window.
    if (extendedTool.interactionAdded === true) {
      extendedTool.addMapInteraction();
    }

    extendedTool.addVector();
  },
  mapWindowFocused(postingObj: Dictionary, callbackObj: Dictionary): void {
    const extendedTool = callbackObj;
    extendedTool.activeMapWindow = postingObj.owningBlock;
    extendedTool.component.expand();
    extendedTool.fetchCategories();
  },
  mapWindowDestroyed(postingObj: Dictionary, callbackObj: Dictionary, eventObj): void {
    const extendedTool = callbackObj;
    const mapWindows = getBlocksByName('cMapWindow');
    const winlen = mapWindows.length;
    if (winlen === 1) {
      // If there is only one map window when this event is called then that means the map window is about to be destroyed so
      // there WILL be no map windows after this callback executes.
      Ext.getCmp('wcsDownloadClear').disable();
      extendedTool.activeMapWindow = null;
      extendedTool.fetchCategories();
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
      drawIsValid: false,
      bboxSize: 0,
      categories: [],
      selectedCategories: [],
      userGeoJSON: null,
      precision: 5,
      currentFeature: null,
      email: '',
      downloadPanelToggle: false,
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
        if (selectedSourceFolder.includes('emodis')) {
          layers = globalThis.App.Layers.query(globalThis.App.Layers._layers, (layer) => {
            if (layer.id.includes('emodis')) return true;
            return false;
          });
        } else if (selectedSourceFolder.includes('eviirs')) {
          layers = globalThis.App.Layers.query(globalThis.App.Layers._layers, (layer) => {
            if (layer.id.includes('eviirs')) return true;
            return false;
          });
        } else if (selectedSourceFolder.includes('mean')) {
          let splitString;

          splitString = selectedSourceFolder.replaceAll('-', ' ').replaceAll('_', ' ').replaceAll(' mean', '');

          let years = splitString.match(/\d{4}/g);

          years.forEach((year) => (splitString = splitString.replaceAll(year, '_')));

          let tempArray = splitString.split(' ');
          let layerName = tempArray.shift();
          tempArray.forEach((item) => {
            if (item !== '_') layerName += `_${item}`;
          });

          layers = globalThis.App.Layers.query(globalThis.App.Layers._layers, {
            type: 'layer',
            id: layerName + '_data',
          });
        } else {
          selectedSourceFolder = selectedSourceFolder.replaceAll('-', '_');
          // if (selectedSourceFolder.includes('2month')) selectedSourceFolder = selectedSourceFolder.replace('2month', '2_month');
          // if (selectedSourceFolder.includes('3month')) selectedSourceFolder = selectedSourceFolder.replace('3month', '3_month');
          layers = globalThis.App.Layers.query(globalThis.App.Layers._layers, {
            type: 'layer',
            id: selectedSourceFolder,
          });
        }

        // get the layer's granule
        const endYearComboBox = Ext.getCmp('endYearCombo');
        const startYearComboBox = Ext.getCmp('yearCombo');
        const g = globalThis.App.Layers._originalGranules.get(layers[0].id);
        let lastDay = new Date(g.intervals[g.intervals.length - 1].end.replaceAll('-', '/'));
        let firstDay = new Date(g.intervals[0].start.replaceAll('-', '/')); // dates in 01/01/01 fashion ignore timezones -- 01-01-01 in CST becomes Dec 31 2000
        let year = startDate.getFullYear();
        let endMonth = endDate.getMonth();
        let startMonth = startDate.getMonth();
        let startIndex, endIndex;

        if (firstDay.getFullYear() <= endYearComboBox.value && lastDay.getFullYear() >= startYearComboBox.value) {
          // Get starting/ending index of date range to slice selected dates from granule array
          if (extendedTool.owningBlock.blockConfig.dateSelection === 'yearCombos') {
            if (g.periodType === 'pentad_10daycomposite') {
              // For pentad_10daycomposite datasets (eVIIRS) The first period of the month goes from the previous month into the current one (Dec 26-Jan-05, Jan-06-Jan-11, etc)
              // So to get the correct intervals, we need to find the index where the END starts with the selected year
              startIndex = g.intervals.findIndex((i) => i.end.startsWith(`${year}-${singleDigitToDouble(startMonth + 1)}`));
            } else {
              // EWX handles date ranges uniquely. If Jan 2002 (start) and March 2005 (end) are selected, the requested layers
              // will be Jan-March 2002, Jan-March 2003, etc.
              startIndex = g.intervals.findIndex((i) => i.start.startsWith(`${year}-${singleDigitToDouble(startMonth + 1)}`)); // Months are zero indexed- add one
            }

            // Mean/Median datasets only need one year, so if the starting index is -1 (out of bounds) we still want a year for our date range
            if ((startIndex === -1 && selectedSourceFolder.includes('mean')) || selectedSourceFolder.includes('median')) {
              startIndex = g.intervals.findIndex((i) => i.start.startsWith(`${firstDay.getFullYear() + 1}-${singleDigitToDouble(startMonth + 1)}`)); // If a dataset starts in July but startMonth is Feb, data will be missing, so we use the first full year
              if (endMonth === 11)
                endIndex = g.intervals.findIndex((i) => i.start.startsWith(`${firstDay.getFullYear() + 2}-${singleDigitToDouble(1)}`));
              else endIndex = g.intervals.findIndex((i) => i.start.startsWith(`${firstDay.getFullYear() + 1}-${singleDigitToDouble(endMonth + 2)}`)); // +1 for month zero indexing and +1 because slice(1,5) returns 1, 2,3, 4- and  we want 5 included
            }
            // if the end month is dec, add 1 to the year and then set the month to 1 which would be January so it includes December.
            else if (endMonth === 11) endIndex = g.intervals.findIndex((i) => i.start.startsWith(`${year + 1}-${singleDigitToDouble(1)}`));
            else endIndex = g.intervals.findIndex((i) => i.start.startsWith(`${year}-${singleDigitToDouble(endMonth + 2)}`));
          } else {
            startIndex = g.intervals.findIndex((i) =>
              i.start.startsWith(
                `${startDate.getFullYear()}-${singleDigitToDouble(startDate.getMonth() + 1)}-${singleDigitToDouble(startDate.getDate())}`
              )
            );
            endIndex = g.intervals.findIndex((i) =>
              i.start.startsWith(`${endDate.getFullYear()}-${singleDigitToDouble(endDate.getMonth() + 1)}-${singleDigitToDouble(endDate.getDate())}`)
            );
            if (endIndex >= 0) endIndex += 1; // +1 for slice index
          }
        } else {
          startIndex = -1;
          endIndex = -1;
        }

        if (startIndex === -1 && endIndex === -1) {
          if (
            lastDay.getMonth() <= endMonth &&
            lastDay.getFullYear() <= endYearComboBox.value &&
            firstDay.getMonth() >= startMonth &&
            firstDay.getFullYear() >= startYearComboBox.value
          )
            endIndex = g.intervals.length;
          // If both indexes are out of bounds but the interval range is within the selected date, we want all granules
          else return null;
        }
        if (startIndex < 0) startIndex = 0; // Using a negative slice value causes it to count at the /end/ of the array
        if (endIndex === -1) endIndex = g.intervals.length; // If selected end date > granule end, use the length to include all available data after start date

        let dateRange = g.intervals.slice(startIndex, endIndex);

        // If a request is January-December and 2002-2002, because datasets like LST start in July, if we don't have the below if block
        // it would include January-June 2002 mean which was NOT requested.
        if ((selectedSourceFolder.includes('mean') || selectedSourceFolder.includes('median')) && startDate < g.start) {
          dateRange = dateRange.filter((obj) => obj.start.split('-')[1] >= g.start.getMonth() + 1);
        }

        // Iterate over each interval and build the array of filenames
        return dateRange.map((element) => {
          let tempName = sourceFileName;
          let [startYear, startMonth, startDay] = element.start.split('-');
          let [endYear, endMonth, endDay] = element.end.split('-');
          if (tempName.includes('mean') || (tempName.includes('median') && tempName.includes('YYYY'))) {
            startYear = 'YYYY';
            endYear = 'YYYY'; // EWX Mean datasets should not replace the YYYY with the year - the year value is a "rolling" value and won't always be the same, as such the backend will handle that portion
          }
          tempName = tempName.replace(/yyyy/i, startYear).replace(/mm/i, startMonth).replace(/dd/i, startDay);
          tempName = tempName.replace(/yyyy/i, endYear).replace(/mm/i, endMonth).replace(/dd/i, endDay); //Replace will only execute on the first match, so it is done twice for both dates. And by using regex (/yyyy/i) we can ignore case
          return tempName;
        });
      },
      getCurrentMap(): Dictionary {
        const mapPanelBlock = this.activeMapWindow?.getReferencedBlock('cMapPanel');
        let map = null;
        if (mapPanelBlock) map = mapPanelBlock.component.map;
        return map;
      },
      // basic email validation
      emailIsValid(email: string): boolean {
        if (/[^@]+@[^@]+\.[^@]+/.test(email) && /\s+/.test(email) === false) {
          return true;
        }
        return false;
      },
      toggleDownloadBtn(): void {
        if (this.emailIsValid(this.email) && this.categoriesAreSelected) {
          const downloadBtn = this.component.query('#wcsDownloadBtn')[0];
          downloadBtn.enable();
        } else {
          const downloadBtn = this.component.query('#wcsDownloadBtn')[0];
          downloadBtn.disable();
        }
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

      createDrawInteraction(typeOfDrawing?: string): void {
        let selfIntersectingPolygon = false;
        // remove any existing drawing that the user might have drawn.
        const map = this.getCurrentMap();
        map.getOverlays().clear();
        const drawItems = map.getInteractions();
        drawItems.array_.forEach((item) => {
          if (item.customID) map.removeInteraction(item);
        });

        // remove any previous features that the user might have drawn
        const source = this.getCurrentMapVectorSource();
        let draw;
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
            const output = Math.floor(geom.getArea() / 1000000);
            // get the size of the drawing that the user draws.
            extendedTool.bboxSize = output;
            const tooltipCoord = geom.getInteriorPoint().getCoordinates();
            if (extendedTool.measureTooltipElement == null) extendedTool.createMeasureTooltip();
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
          extendedTool.currentFeature = feature;
          const source = extendedTool.getCurrentMapVectorSource();
          source.addFeature(extendedTool.currentFeature);
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
          if (isects.length == 0) extendedTool.fetchCategories();
          else {
            selfIntersectingPolygon = true;
            alert('Cannot draw a self intersecting polygon. Please try again.');
            map.getOverlays().clear();

            // remove any previous features that the user might have drawn
            const featureItems = source.getFeatures();
            featureItems.forEach((drawItem) => {
              if (drawItem.values_.id === 'dataDownloadBox') source.removeFeature(drawItem);
            });
          }

          const categoryText = Ext.getCmp('categoryText');
          //categoryText.setText('Fetching categories...');
          if (extendedTool.bboxSize <= extendedTool.owningBlock.blockConfig.maxArea && selfIntersectingPolygon === false)
            extendedTool.activeMapPanel.extendedTool.maskComponent('Fetching Datasets ...');
          extendedTool.measureTooltipElement.className = 'tooltip tooltip-static';
          const drawCombo = Ext.getCmp('drawCombo');
          if (drawCombo.value === 'Rectangle') extendedTool.measureTooltip.setOffset([0, -7]);
          else if (drawCombo.value === 'Polygon') extendedTool.measureTooltip.setOffset([0, -10]);
          extendedTool.measureTooltipElement = null; // unset tooltip so that a new one can be created
          const GeoJson = Ext.getCmp('GeoJSON');
          const GeoJSONText = Ext.getCmp('GeoJSONText');
          GeoJson.setVisible(false);
          GeoJSONText.setVisible(false);
        });
      },
      empty(mapWindow): void {
        this.activeMapWindow = mapWindow;
        const lssource = extendedTool.getCurrentMapVectorSource();
        const noRectangleText = Ext.getCmp('noRectangleText');
        const noGeoJSONText = Ext.getCmp('noGeoJSONText');
        const noPolygonText = Ext.getCmp('noPolygonText');
        const drawCombo = Ext.getCmp('drawCombo');
        if (lssource) {
          lssource.clear();
          extendedTool.fetchCategories();
          extendedTool.toggleDownloadBtn();
          if (extendedTool.measureTooltipElement) {
            extendedTool.measureTooltipElement.innerHTML = '';
          }
          const map = extendedTool.getCurrentMap();
          map.getOverlays().clear();
          const drawItems = map.getInteractions();
          drawItems.array_.forEach((item) => {
            if (item instanceof Draw) map.removeInteraction(item);
          });
          Ext.getCmp('categoryText').setText('No Categories Available');
        }
        Ext.getCmp('dataDownloadPanel').hide();
        Ext.getCmp('featureItems').hide();
        Ext.getCmp('GeoJSONText').hide();
        Ext.getCmp('GeoJSON').hide();

        if (drawCombo.value === 'Rectangle') {
          noRectangleText.setText(extendedTool.owningBlock.blockConfig.noRectangleText);
          noRectangleText.show();
        } else if (drawCombo.value === 'Polygon') {
          noPolygonText.setText(extendedTool.owningBlock.blockConfig.noPolygonText);
          noPolygonText.show();
        } else {
          noGeoJSONText.setText(extendedTool.owningBlock.blockConfig.noGeoJSONText);
          noGeoJSONText.show();
        }
        // collapses the section in the tool panel
        const dataDownloadToolPanel: any = Ext.ComponentQuery.query('[title=Data Download]');
        dataDownloadToolPanel[0].collapse();
      },

      /*
       ****************
       ** START HERE ** (for most beginning to end code tracing)
       ****************
       The "normal"  entry point for the code from the user perspective
       cDataDownloadBtn calls this function
       */
      openAndEnable(mapWindowBlock): void {
        extendedTool.activeMapWindow = mapWindowBlock;
        const { map } = mapWindowBlock.getReferencedBlock('cMapPanel').component;
        extendedTool.activeMapPanel = map;
        Ext.getCmp('redirectDownload').hide();
        Ext.getCmp('featureItems').show();

        this.rootNode = new Node({ name: 'root' });

        this.createDrawInteraction(Ext.getCmp('drawCombo').value);

        const parent = this.owningBlock.parent.component;
        if (parent && parent.collapsed) {
          parent.expand();
        }
        if (this.component.collapsed) {
          this.component.expand();
        }

        Ext.getCmp('wcsDownloadClear').setText('Clear');
        this.fetchCategories();
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
      parseXMLforCategories(request: XMLHttpRequest): void {
        const categoryCheckboxes = Ext.getCmp('cbCategories');
        const categoryText = Ext.getCmp('categoryText');
        // categoryText.setText('Loading...');

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
        const maxBBoxSize = xmlDoc.getElementsByTagName(`${elementTitle}:maxBboxSiz`);

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
            // check for the maxBBoxSize column in the shapefile. If it exists
            // then check the bounding box size and hide/show categories accordingly
            // otherwise continue as normal.
            if (maxBBoxSize.length > 0) {
              if (categoryTags[i].innerHTML === data.name) {
                if (extendedTool.bboxSize >= parseInt(maxBBoxSize[i].innerHTML)) {
                  node.nodeTest = true;
                  node.data.maxExtent = maxBBoxSize[i].innerHTML;
                } else node.nodeTest = false;
              }
              node.addParent(this.rootNode);
            } else node.addParent(this.rootNode);
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

        this.rootNode.addToCmp(categoryCheckboxes);

        // const dataSetComboBox = Ext.getCmp('dataSetExplorerTool1');
        // const dataSetComboBoxValue = dataSetComboBox.rawValue;
        const mapWindows = getBlocksByName('cMapWindow');
        // mapWindows[0].extendedTool.title;
        categoryCheckboxes.items.items.forEach((x) => {
          const tempDataName = x.name.split(' ');
          //mapWindows.forEach((y) => {
          const activeMapWindowTitle = extendedTool.activeMapWindow.extendedTool.title;
          const splitTitle = activeMapWindowTitle.split('('); // split the title of the mapwindow to get the everything before the initial (
          const finalTitle = splitTitle[0].split(' '); // split by space to get the periodicity Ex. Africa CHIRPS Data Pentadal, after split the second to last index would have the periodicity.

          // handle soil moisture categories.
          if (activeMapWindowTitle.includes(tempDataName[0]) && finalTitle[1] == tempDataName[0] && finalTitle[1] == 'Soil') {
            x.setValue(true);
          } // handle every other category.
          else if (activeMapWindowTitle.includes(tempDataName[0]) && finalTitle[finalTitle.length - 2] == tempDataName[1]) {
            x.setValue(true);
          } else {
            x.setValue(false);
          }
        });

        extendedTool.activeMapPanel.extendedTool.unMaskComponent();
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
      fetchCategories(): void {
        const drawCombo = Ext.getCmp('drawCombo');
        const GeoJSONTextFieldLabel = Ext.getCmp('GeoJSONText');
        const GeoJSONTextField = Ext.getCmp('GeoJSON');
        const noRectangleText = Ext.getCmp('noRectangleText');
        const noGeoJSONText = Ext.getCmp('noGeoJSONText');
        const noPolygonText = Ext.getCmp('noPolygonText');
        const dataDownloadPanel = Ext.getCmp('dataDownloadPanel');
        const lssource = this.getCurrentMapVectorSource();
        let extent: Extent = [null, null, null, null];
        if (lssource) {
          extent = lssource?.getExtent();
        }

        const polygon = extendedTool.getPolygonFeature();
        const geom = polygon?.getGeometry();
        const area = geom ? getArea(geom) / 1000000 : undefined;

        if (area <= extendedTool.owningBlock.blockConfig.maxArea) {
          let layers = this.getDownloadLayers();
          if (!layers.length) {
            layers = this.getLayers();
          }
          const geoserver = extendedTool.owningBlock.blockConfig.geoserver ? extendedTool.owningBlock.blockConfig.geoserver : layers[0].source.wfs;
          const shapeFile = extendedTool.owningBlock.blockConfig.shapeFile ? extendedTool.owningBlock.blockConfig.shapeFile : layers[0].name;

          const categoryCheckboxes = Ext.getCmp('cbCategories');
          const categoryText = Ext.getCmp('categoryText');
          Ext.getCmp('dataDownloadPanel').show();
          Ext.getCmp('redirectDownload').hide();
          extendedTool.downloadPanelToggle = true;
          noRectangleText.hide();
          noGeoJSONText.hide();
          noPolygonText.hide();

          const baseurl = `${geoserver}request=GetFeature&version=1.1.0&typeName=${shapeFile}&BBOX=`;
          const url = `${baseurl + extent[0]},${extent[1]},${extent[2]},${extent[3]}`;

          categoryCheckboxes.setValue({});
          categoryCheckboxes.removeAll();
          if (this.rootNode) {
            this.rootNode.removeChildren();
          }
          this.categories = {};
          this.categoriesAreSelected = false;
          this.drawIsValid = true;
          this.toggleDownloadBtn(); // no need to call toggleDownloadBtn as we already know what the result should be
          extendedTool.activeMapPanel.extendedTool.maskComponent('Fetching Datasets ...');
          categoryText.show();
          Ext.getCmp('noRectangleText').hide();
          this.getXML(this, url);
        } else if (area > extendedTool.owningBlock.blockConfig.maxArea) {
          if (drawCombo.value === 'Rectangle') noRectangleText.hide();
          else if (drawCombo.value === 'Polygon') noPolygonText.hide();
          else noGeoJSONText.hide();
          Ext.getCmp('dataDownloadPanel').hide();
          extendedTool.downloadPanelToggle = false;
          Ext.getCmp('redirectDownload').show();
          Ext.getCmp('redirectDownloadText').show();
          this.drawIsValid = false;
        } else {
          // Upon first drawing a box area will be undefined which is when this else block is used

          dataDownloadPanel.hide();
          extendedTool.downloadPanelToggle = false;
          noRectangleText.show();
          this.drawIsValid = false;
          if (drawCombo.value === 'GeoJSON') {
            noRectangleText.hide();
            noGeoJSONText.show();
            GeoJSONTextField.setVisible(true);
            GeoJSONTextFieldLabel.setVisible(true);
            const map = extendedTool.getCurrentMap();
            map.getOverlays().clear();
            const drawItems = map.getInteractions();
            drawItems.array_.forEach((item) => {
              if (item.customID) map.removeInteraction(item);
            });
          } else {
            GeoJSONTextField.setVisible(false);
            GeoJSONTextFieldLabel.setVisible(false);
            if (drawCombo.value === 'Rectangle') {
              noRectangleText.show();
              noPolygonText.hide();
              noGeoJSONText.hide();
            } else {
              noPolygonText.show();
              noRectangleText.hide();
              noGeoJSONText.hide();
            }
          }
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
  getComponent(extendedTool): Record<string, any> {
    const block = extendedTool.owningBlock.blockConfig;
    let endDate;
    let startDate;

    const layers = globalThis.App.Layers._layers;
    // get the end date based on chirps prelim
    Object.keys(layers).forEach((x) => {
      if (layers[x].id === 'chirps_prelim_global_pentad_data') {
        let g = globalThis.App.Layers._granules.get(layers[x].id);
        if (g === undefined) g = globalThis.App.Layers._originalGranules.get(layers[x].id);
        endDate = g.end;
      }
    });

    // get the start date
    globalThis.App.Layers._granules.forEach((layer) => {
      if (!startDate) startDate = layer.start;
      if (layer.start < startDate) startDate = layer.start;
    });

    endDate = new Date(endDate);
    startDate = new Date(startDate);
    const year1 = startDate ? startDate.getFullYear() : null;
    const year2 = endDate ? endDate.getFullYear() : null;
    const instanceId = globalThis.App.Layers.getConfigInstanceId();
    const layersConfig = globalThis.App.Layers.getLayersConfigById(instanceId);
    const layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
    const layerId = layer.id;
    const yearData = [];

    const g = globalThis.App.Layers._granules.get(layerId);

    const monthData = [];
    let months = g.getMonthsInIntervalInYear(2000);

    months.forEach((month) => {
      if (month.value <= endDate.getMonth() + 1) {
        monthData.push({
          value: month.value,
          text: month.text,
        });
      }
    });

    let monthStore = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data: monthData,
    });

    let endMonthStore = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data: monthData.pop(),
    });

    let years = [];
    // get the earliest year the data is available across categories.
    for (let i = startDate.getFullYear(); i <= endDate.getFullYear(); i++) {
      years.push(i);
    }

    // Remove the following year for 3-months if selectableMonths contains cross-year options
    // The extra year is there because the granule_end is in that year.
    if (
      g.periodType === '3month' && // fail-fast
      !g.getIntervalsInYear(g.selectableYears[g.selectableYears.length - 1]?.text).length &&
      (g.selectableMonths.find((m) => m.text === 'Nov-Dec-Jan') || g.selectableMonths.find((m) => m.text === 'Dec-Jan-Feb'))
    ) {
      years = years.slice(0, -1);
    }

    for (let i = 0, len = years.length; i < len; i += 1) {
      const yearsConfig = years[i];
      yearData.push({
        value: yearsConfig,
        text: yearsConfig,
      });
    }

    let drawData = ['Polygon', 'Rectangle'];

    const yearStore = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data: yearData,
    });

    const endYearStore = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data: yearData.pop(),
    });

    const drawStore = Ext.create('Ext.data.Store', {
      fields: ['value', 'text'],
      data: drawData,
    });

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
              text: extendedTool.owningBlock.blockConfig.redirectText,
              style: { fontSize: '14px', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
              hidden: true,
            },
          ],
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
          layout: {
            type: 'table',
            columns: 2,
          },
          width: 180,
          hidden: true,
          style: { marginLeft: '0px' },
          items: [
            {
              xtype: 'tbtext',
              id: 'drawTest',
              text: 'Draw Style:',
              style: { fontSize: '13.5px', marginTop: '10px', marginBottom: '10px', marginLeft: '10px' },
              hidden: false,
            },
            {
              xtype: 'combobox',
              id: 'drawCombo',
              hidden: false,
              store: drawStore,
              queryMode: 'local',
              valueField: 'text',
              displayField: 'text',
              width: 94,
              value: 'Rectangle',
              listeners: {
                beforerender(): void {
                  const temp = ['Rectangle', 'Polygon', 'GeoJSON'];
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
                  GeoJSON.setValue('');
                  const GeoJSONText = Ext.getCmp('GeoJSONText');
                  if (value === 'Rectangle') {
                    GeoJSON.setVisible(false);
                    GeoJSONText.setVisible(false);
                    if (extendedTool.downloadPanelToggle === false) {
                      noPolygonText.hide();
                      noGeoJSONText.hide();
                      noRectangleText.show();
                    } else {
                      noPolygonText.hide();
                      noGeoJSONText.hide();
                      noRectangleText.hide();
                    }
                    extendedTool.createDrawInteraction(drawVal);
                  } else if (value === 'Polygon') {
                    GeoJSON.setVisible(false);
                    GeoJSONText.setVisible(false);
                    if (extendedTool.downloadPanelToggle === false) {
                      noPolygonText.show();
                      noGeoJSONText.hide();
                      noRectangleText.hide();
                    } else {
                      noPolygonText.hide();
                      noGeoJSONText.hide();
                      noRectangleText.hide();
                    }
                    extendedTool.createDrawInteraction(drawVal);
                  } else {
                    GeoJSON.setVisible(true);
                    GeoJSONText.setVisible(true);
                    if (extendedTool.downloadPanelToggle === false) {
                      noPolygonText.hide();
                      noGeoJSONText.show();
                      noRectangleText.hide();
                    } else {
                      noPolygonText.hide();
                      noGeoJSONText.hide();
                      noRectangleText.hide();
                    }
                    const map = extendedTool.getCurrentMap();
                    map.getOverlays().clear();
                    const drawItems = map.getInteractions();
                    drawItems.array_.forEach((item) => {
                      if (item.customID) map.removeInteraction(item);
                    });
                  }
                },
              },
            },
          ],
        },
        {
          xtype: 'tbtext',
          id: 'GeoJSONText',
          text: 'GeoJSON (EPSG:3857)',
          style: { fontSize: '13.5px', marginLeft: '10px', marginTop: '10px' },
          hidden: true,
        },
        {
          extendedTool,
          xtype: 'textfield',
          id: 'GeoJSON',
          name: 'GeoJSON (EPSG:3857)',
          emptyText: 'GeoJSON (EPSG:3857)',
          width: '90%',
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
                  if (!gjv.valid(GeoJSONobj)) {
                    alert('GeoJSON is not in the correct format. Please try again.');
                  }
                } catch (e) {
                  alert('GeoJSON is not in the correct format. Please try again.');
                }

                const coordinates = GeoJSONobj.features[0].geometry.coordinates;
                this.feature = new Feature({
                  geometry: new Polygon(coordinates), // For some reason OL requires the array structure as [ [[y,x],[y,x],[y,x],[y,x]] ]. E.G An array with a length of 1, containing our array of coordinates.
                });
                this.feature.set('id', 'dataDownloadBox');

                const geom = this.feature.getGeometry();
                // const coords = geom.getLinearRing(0).getCoordinates();
                const output = Math.floor(geom.getArea() / 1000000);
                extendedTool.bboxSize = output;
                const tooltipCoord = geom.getInteriorPoint().getCoordinates();

                extendedTool.createMeasureTooltip();

                extendedTool.measureTooltipElement.innerHTML = `${output}km<sup>2</sup>`;
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

                if (isects.length == 0) extendedTool.fetchCategories();
                else {
                  alert('Cannot draw a self interacting polygon. Please try again.');
                  map.getOverlays().clear();

                  // remove any previous features that the user might have drawn
                  const featureItems = source.getFeatures();
                  featureItems.forEach((drawItem) => {
                    if (drawItem.values_.id === 'dataDownloadBox') source.removeFeature(drawItem);
                  });
                }
              }
              extendedTool.currentFeature = undefined;
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
                  if (!Ext.Object.isEmpty(values)) this.extendedTool.categoriesAreSelected = true;
                  else this.extendedTool.categoriesAreSelected = false;

                  const inputs = this.extendedTool.rootNode.getChildren();

                  for (const node of inputs) {
                    if (!Object.prototype.hasOwnProperty.call({}, node.data.name)) {
                      // see if this has been passed in as a selected value
                      if (Object.prototype.hasOwnProperty.call(values, node.data.name)) {
                        node.selected = true;
                        this.extendedTool.categoriesAreSelected = true;
                      } else {
                        node.selected = false;
                      }
                    }
                  }

                  this.extendedTool.toggleDownloadBtn();
                },
              },
            },
            {
              xtype: 'tbtext',
              id: 'categoryText',
              style: { fontSize: '14px', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
            },
            {
              xtype: 'panel',
              id: 'dateSelectorPanel',
              width: '100%',
              items: [
                {
                  id: 'startComboboxes',
                  layout: {
                    type: 'table',
                    columns: 2,
                  },
                  width: '72%',
                  style: { marginLeft: '10px' },
                  items: [
                    {
                      xtype: 'tbtext',
                      id: 'startYearComboText',
                      text: 'Start Year',
                      style: { fontSize: '14px' },
                      hidden:
                        year1 && year2 && block.showCombo
                          ? false
                          : year1 && year2 && block.showCombo === false
                          ? true
                          : !year1 && !year2
                          ? true
                          : false,
                    },
                    {
                      xtype: 'tbtext',
                      id: 'startMonthComboText',
                      text: 'End Year',
                      style: { marginLeft: '25px', marginBottom: '5px', marginTop: '5px', fontSize: '14px' },
                      hidden:
                        year1 && year2 && block.showCombo
                          ? false
                          : year1 && year2 && block.showCombo === false
                          ? true
                          : !year1 && !year2
                          ? true
                          : false,
                    },
                  ],
                },
                {
                  id: 'comboboxes',
                  layout: {
                    type: 'table',
                    columns: 2,
                  },
                  width: '80%',
                  style: { marginLeft: '10px' },
                  items: [
                    {
                      xtype: 'combobox',
                      id: 'yearCombo',
                      store: yearStore,
                      queryMode: 'local',
                      valueField: 'text',
                      displayField: 'text',
                      width: 80,
                      value: `${endDate.getFullYear()}`,
                      hidden:
                        year1 && year2 && block.showCombo
                          ? false
                          : year1 && year2 && block.showCombo === false
                          ? true
                          : !year1 && !year2
                          ? true
                          : false,
                      listeners: {
                        change(yearCombo, newValue, oldValue): void {
                          const monthCombo = Ext.getCmp('monthCombo');
                          const endMonthCombo = Ext.getCmp('endMonthCombo');
                          const endYearComboBox = Ext.getCmp('endYearCombo');
                          const endYearData = [];
                          let startFlag = false;
                          let endFlag = false;
                          const maxYears = extendedTool.owningBlock.blockConfig.maxYearsForDownload
                            ? extendedTool.owningBlock.blockConfig.maxYearsForDownload
                            : 1000;
                          years.forEach((year) => {
                            if (year >= newValue && year <= newValue + maxYears) {
                              endYearData.push({
                                value: year,
                                text: year,
                              });
                            }
                          });

                          endYearStore.removeAll();
                          endYearStore.loadData(endYearData);

                          if (endYearComboBox.getValue() < newValue || endYearComboBox.getValue() > newValue + maxYears)
                            endYearComboBox.setValue(newValue);

                          let months = g.getMonthsInIntervalInYear(2000);
                          let monthData = [];
                          let index = newValue >= endDate.getFullYear() ? endDate.getMonth() : 12;

                          months.forEach((month) => {
                            if (month.value <= index + 1) {
                              monthData.push({
                                value: month.value,
                                text: month.text,
                              });
                              if (month.text === monthCombo.getValue()) startFlag = true;
                              if (month.text === endMonthCombo.getValue()) endFlag = true;
                            }
                          });

                          monthStore.removeAll();
                          monthStore.loadData(monthData);

                          monthData = [];
                          months.forEach((month) => {
                            if (month.value <= index + 1) {
                              if (month.value >= monthStrToNum(monthCombo.value)) {
                                monthData.push({
                                  value: month.value,
                                  text: month.text,
                                });
                              }
                            }
                          });
                          endMonthStore.removeAll();
                          endMonthStore.loadData(monthData);

                          if (newValue >= new Date().getFullYear()) {
                            if (!startFlag) monthCombo.setValue(monthData.shift().text);
                            if (!endFlag) endMonthCombo.setValue(monthData.pop().text);
                          }
                        },
                      },
                    },
                    {
                      xtype: 'combobox',
                      id: 'endYearCombo',
                      store: endYearStore,
                      queryMode: 'local',
                      valueField: 'text',
                      displayField: 'text',
                      width: 80,
                      style: { marginLeft: '10px ' },
                      value: `${endDate.getFullYear()}`,
                      hidden:
                        year1 && year2 && block.showCombo
                          ? false
                          : year1 && year2 && block.showCombo === false
                          ? true
                          : !year1 && !year2
                          ? true
                          : false,
                      listeners: {
                        change(endYearCombo, value, oldValue): void {
                          const yearComboBox = Ext.getCmp('endYearCombo');
                          if (yearComboBox.getValue() < value) yearComboBox.setValue(value);
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'endComboboxes',
                  layout: {
                    type: 'table',
                    columns: 2,
                  },
                  width: '80%',
                  style: { marginLeft: '10px' },
                  items: [
                    {
                      xtype: 'tbtext',
                      id: 'endYearComboText',
                      text: 'Start Month',
                      style: { fontSize: '14px' },
                      hidden:
                        year1 && year2 && block.showCombo
                          ? false
                          : year1 && year2 && block.showCombo === false
                          ? true
                          : !year1 && !year2
                          ? true
                          : false,
                    },
                    {
                      xtype: 'tbtext',
                      id: 'endMonthComboText',
                      text: 'End Month',
                      style: { marginLeft: '15px', marginBottom: '5px', marginTop: '5px', fontSize: '14px' },
                      hidden:
                        year1 && year2 && block.showCombo
                          ? false
                          : year1 && year2 && block.showCombo === false
                          ? true
                          : !year1 && !year2
                          ? true
                          : false,
                    },
                  ],
                },
                {
                  id: 'endcomboboxes',
                  layout: {
                    type: 'table',
                    columns: 2,
                  },
                  width: '80%',
                  style: { marginLeft: '10px' },
                  items: [
                    {
                      xtype: 'combobox',
                      id: 'monthCombo',
                      store: monthStore,
                      queryMode: 'local',
                      valueField: 'text',
                      displayField: 'text',
                      width: 80,
                      value: `${numMonthToString(endDate.getMonth(), 'abbrev')}`,
                      hidden:
                        year1 && year2 && block.showCombo
                          ? false
                          : year1 && year2 && block.showCombo === false
                          ? true
                          : !year1 && !year2
                          ? true
                          : false,
                      listeners: {
                        change(monthCombo, newValue, oldValue): void {
                          const yearCombo = Ext.getCmp('yearCombo');
                          const endMonthCombo = Ext.getCmp('endMonthCombo');

                          let months = g.getMonthsInIntervalInYear(2000);
                          const monthData = [];

                          if (yearCombo.value >= endDate.getFullYear()) {
                            months.forEach((month) => {
                              if (month.value <= endDate.getMonth() + 1) {
                                if (month.value >= monthStrToNum(newValue)) {
                                  monthData.push({
                                    value: month.value,
                                    text: month.text,
                                  });
                                }
                              }
                            });
                          } else {
                            months.forEach((month) => {
                              if (month.value >= monthStrToNum(newValue)) {
                                monthData.push({
                                  value: month.value,
                                  text: month.text,
                                });
                              }
                            });
                          }

                          endMonthStore.removeAll();
                          endMonthStore.loadData(monthData);
                          let check;
                          // loop through the monthData store
                          for (let i = 0; i < monthData.length; i++) {
                            // check if the endMonth value is already in the monthData store.
                            // If it is then dont change the value
                            if (monthData[i].text === endMonthCombo.value) {
                              check = true;
                              break;
                            } else check = false;
                          }
                          // if the endMonth value is not in the monthData store, then chenge the endMonth value to the startMonth value
                          if (!check) {
                            if (yearCombo.value >= endDate.getFullYear()) endMonthCombo.setValue(monthData.pop().text);
                            else endMonthCombo.setValue(newValue);
                          }
                        },
                      },
                    },
                    {
                      xtype: 'combobox',
                      id: 'endMonthCombo',
                      store: endMonthStore,
                      queryMode: 'local',
                      valueField: 'text',
                      displayField: 'text',
                      width: 80,
                      style: { marginLeft: '10px ' },
                      value: `${numMonthToString(endDate.getMonth(), 'abbrev')}`,
                      hidden:
                        year1 && year2 && block.showCombo
                          ? false
                          : year1 && year2 && block.showCombo === false
                          ? true
                          : !year1 && !year2
                          ? true
                          : false,
                      listeners: {},
                    },
                  ],
                },
              ],
            },

            {
              extendedTool,
              xtype: 'textfield',
              name: 'Email',
              emptyText: 'Email',
              width: '90%',
              style: { marginLeft: '10px', marginTop: '10px' },
              listeners: {
                change(textbox, value): void {
                  const emailTrimmed = value.trim();
                  if (this.extendedTool.emailIsValid(emailTrimmed)) {
                    textbox.inputEl.el.dom.style.color = 'black';
                    this.extendedTool.email = emailTrimmed;
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
                      this.extendedTool.fetchCategories();
                      this.extendedTool.toggleDownloadBtn();
                      Ext.getCmp('cbCategories').hide();
                      Ext.getCmp('categoryText').hide();
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
                      function RequestDataObj(
                        clippedMetadataName = null,
                        clippedRasterName = null,
                        srcFolder = null,
                        srcFile = null,
                        srcMetadataName = null,
                        metadata = null,
                        years = null
                      ): void {
                        this.clipped_metadata_name = clippedMetadataName;
                        this.clipped_raster_name = clippedRasterName;
                        this.src_folder = srcFolder;
                        this.src_file = srcFile;
                        this.src_meta = srcMetadataName;
                        this.metadata = metadata;
                        this.years = years;
                      }
                      extendedTool.activeMapPanel.extendedTool.maskComponent('Submitting Job ...');
                      const mapProj = this.extendedTool.getCurrentMap().getView().getProjection().getCode();
                      const selectedChildren = this.extendedTool.rootNode.getSelectedChildren(); // the categories that the user selected
                      const categoryArray = []; // an array of all categories the user has selected from
                      const numOfFiles = {}; // keep track of how many files each category requests to download
                      const requestData = [];
                      const noDataLayers = [];
                      const yearComboBox = Ext.getCmp('yearCombo');
                      const monthComboBox = Ext.getCmp('monthCombo');
                      const endYearComboBox = Ext.getCmp('endYearCombo');
                      const endMonthComboBox = Ext.getCmp('endMonthCombo');
                      const check = [];
                      let geoJsonStr, sourceProj;
                      let srcFileNames = [];
                      // for each node checked (or selected) add the corresponding layers to the requestData array
                      for (const node of selectedChildren) {
                        const categoryData = node.data.inputValue;
                        categoryArray.push(categoryData);

                        if (this.extendedTool.categories[categoryData]) {
                          numOfFiles[categoryData] = 0;
                          for (const layerOfCategeory of this.extendedTool.categories[categoryData]) {
                            const [
                              selectedSourceMetadataName,
                              selectedClippedRasterName,
                              selectedSourceFolder,
                              selectedSourceFile,
                              selectedClippedMetadataName,
                              sourceProjection,
                              metadata,
                            ] = layerOfCategeory;

                            const tempSources = [];
                            let startYear = yearComboBox.value;
                            const endYear =
                              layerOfCategeory[1].includes('mean') || layerOfCategeory[1].includes('median') || layerOfCategeory[1].includes('prelim')
                                ? startYear
                                : endYearComboBox.value;
                            for (let i = startYear; i < parseInt(endYear) + 1; i += 1) {
                              const sourceNames = this.extendedTool.getSourceFileNames(
                                selectedSourceFolder,
                                new Date(i, monthStrToNum(monthComboBox.value) - 1),
                                new Date(i, monthStrToNum(endMonthComboBox.value) - 1),
                                selectedSourceFile
                              );
                              if (sourceNames) tempSources.push(sourceNames); // sourceNames may be null for some years (user chose 1990-2020 but the data begins 2002, for example)
                            }
                            srcFileNames = tempSources.flat();
                            sourceProj = sourceProjection;

                            if (srcFileNames && srcFileNames?.length > 0) {
                              const request = new RequestDataObj(
                                selectedClippedMetadataName,
                                selectedClippedRasterName,
                                selectedSourceFolder,
                                srcFileNames,
                                selectedSourceMetadataName,
                                metadata,
                                null
                              );

                              // for chirps prelim if there are no files then dont add it into the layers object
                              if (request.src_file[0] !== null) requestData.push(request);
                              numOfFiles[categoryData] += 1;
                            } else {
                              const snip = selectedSourceFolder.split('_')[0];
                              if (snip !== 'chirps-prelim') check.push(snip); // If data/anom/zscore/pctn is null we don't want the mean dataset
                            }
                          }
                        }
                      }

                      const features = extendedTool.getCurrentMapVectorSource().getFeatures();
                      let ddFeature = features.filter((x) => {
                        if (x.values_?.id == 'dataDownloadBox') return x;
                      });

                      let copyFeature = ddFeature[0].clone(); // If we use the original any subsequent downloads with the same feature will be transformed more than once, breaking the coords
                      let geom = copyFeature.getGeometry();
                      geom.transform(mapProj, sourceProj);
                      const writer = new GeoJSON();
                      geoJsonStr = JSON.parse(writer.writeFeatures([copyFeature]));

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

                      const catstr = categoryArray.join();
                      const jsonstr = JSON.stringify(requestData);
                      let optionalNotice = extendedTool.owningBlock.blockConfig.optionalNotice
                        ? extendedTool.owningBlock.blockConfig.optionalNotice
                        : '';

                      if (jsonstr && jsonstr !== '[]' && jsonstr !== '{}' && catstr && this.extendedTool.emailIsValid(this.extendedTool.email)) {
                        const email = this.extendedTool.email.trim();
                        const url = encodeURI(extendedTool.owningBlock.blockConfig.addQueueLocation);

                        const request = new XMLHttpRequest();
                        request.open('POST', url, true);
                        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
                        let port = '';
                        if (window.location.port) {
                          port = `:${window.location.port}`;
                        }
                        let currentURL = ``; // Note: due to polygons we wont use bboxUrl (below) moving forward. It's being left for now due to addQueue.php

                        request.send(
                          `layers=${jsonstr}&email=${email}&categories=${catstr}&GeoJSON_viewer_projection=${
                            extendedTool.userGeoJSON
                          }&GeoJSON_native_projection=${JSON.stringify(geoJsonStr)}`
                        );

                        //setTimeout(()=>extendedTool.activeMapPanel.extendedTool.unMaskComponent(), 1000);
                        request.onreadystatechange = function (): void {
                          if (this.readyState === 4 && this.status === 200) {
                            const response = JSON.parse(request.response);
                            if (response.success === true) {
                              let successAlert =
                                `Your download request has successfully been sent and will be processed for you within few hours. You will receive an e-mail with instructions on retrieving your data. Thank you.\n\n` +
                                optionalNotice;
                              if (noDataLayers.length > 0) {
                                successAlert += '\nThe following layers were not included for being outside the date range selected: ';
                                noDataLayers.forEach((layer) => {
                                  successAlert += `\n ${layer}`;
                                });
                              }
                              extendedTool.activeMapPanel.extendedTool.unMaskComponent();
                              alert(successAlert);
                            } else {
                              extendedTool.activeMapPanel.extendedTool.umMaskComponent();
                              alert(`ERROR: ${response.errorMessage}`);
                            }
                          }
                        };
                      } else {
                        alert('The date range you have selected is invalid for the following products: ' + `${catstr}\n\n${optionalNotice}`);
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
        afterrender(): void {
          if (!extendedTool.owningBlock.blockConfig.redirectText) {
            Ext.getCmp('redirectDownload').hide();
          }

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
