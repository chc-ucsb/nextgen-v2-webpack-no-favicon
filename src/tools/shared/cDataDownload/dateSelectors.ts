import { transformExtent } from 'ol/proj';
import { monthStrToNum } from '../../../helpers/date';

export const getDownloadPanel = (extendedTool) => {
  const block = extendedTool.owningBlock.blockConfig;
  let endDate;
  let startDate;
  globalThis.App.Layers._granules.forEach((layer) => {
    if (!endDate) endDate = layer.end;
    if (!startDate) startDate = layer.start;
    if (layer.end > endDate) endDate = layer.end;
    if (layer.start < startDate) startDate = layer.start;
  });
  endDate = new Date(endDate);
  startDate = new Date(startDate);
  const defaultFromDate = new Date(new Date(endDate).setDate(1));
  const year1 = startDate ? startDate.getFullYear() : null;
  const year2 = endDate ? endDate.getFullYear() : null;
  const instanceId = globalThis.App.Layers.getConfigInstanceId();
  const layersConfig = globalThis.App.Layers.getLayersConfigById(instanceId);
  const layer = globalThis.App.Layers.getTopLayer(layersConfig.overlays);
  const layerId = layer.id;
  const yearData = [];
  let monthStore = Ext.create('Ext.data.Store', {
    fields: ['value', 'text'],
  });
  // logic for year and month comboboxes.
  // const yearCombo = document.createElement('select');
  const g = globalThis.App.Layers._granules.get(layerId);
  let years = g.selectableYears;
  const regionValue = Ext.getCmp('regionCombo')?.value;
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
      value: yearsConfig.value,
      text: yearsConfig.text,
    });
  }

  const yearStore = Ext.create('Ext.data.Store', {
    fields: ['value', 'text'],
    data: yearData,
  });

  // FOR LCMAP ONLY
  // update the year slider when the user uses a bboxURL so the year slider changes based on the region we are on.
  const updateYearSlider = (regionValue, slideYears) => {
    //LCMAP region change logic for yearSlider to update accordingly.
    //const slideYears = Ext.getCmp('slideYears');
    let yearSlider = Ext.getCmp('yearSlider');
    const layers = globalThis.App.Layers._layers;
    for (let i = 0; i < layers.length; i++) {
      // we need the layer that correspods to the current region that we are currently on
      if (layers[i]?.additionalAttributes?.rasterDataset.includes(regionValue)) {
        const granule = globalThis.App.Layers._originalGranules.get(layers[i].id);
        if (granule !== undefined) {
          const end = granule.end;
          const start = granule.start;
          const startYear = start ? start.getFullYear() : null;
          const endYear = end ? end.getFullYear() : null;
          slideYears.setText(`${startYear}-${endYear}`);
          yearSlider.setMinValue(startYear);
          yearSlider.setMaxValue(endYear);
          yearSlider.setValue([startYear, endYear]);
          break;
        }
      }
    }
  };
  const getDateSelector = (selection) => {
    const yearSliders = [
      {
        xtype: 'text',
        id: 'selectYears',
        text: 'Select Years:',
        style: { fontSize: '14px', fontWeight: 'bold', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
        hidden: year1 && year2 && block.showSlider ? false : year1 && year2 && block.showSlider === false ? true : !year1 && !year2 ? true : false,
      },
      {
        xtype: 'tbtext',
        id: 'slideYears',
        text: `${year1}-${year2}`,
        style: { marginLeft: '85px', marginBottom: '5px', marginTop: '5px', fontSize: '14px' },
        hidden: year1 && year2 && block.showSlider ? false : year1 && year2 && block.showSlider === false ? true : !year1 && !year2 ? true : false,
        listeners: {
          beforerender() {
            updateYearSlider(regionValue, this);
          },
        },
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
        hidden: !year1 && !year2,
        listeners: {
          beforerender() {
            const yearSlider = Ext.getCmp('slideYears');
            updateYearSlider(regionValue, yearSlider);
          },
          change(el): void {
            const slideYears = Ext.getCmp('slideYears');
            slideYears.setText(`${el.thumbs[0].value}-${el.thumbs[1].value}`);
          },
        },
      },
    ];

    const yearCombos = [
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
            hidden: year1 && year2 && block.showCombo ? false : year1 && year2 && block.showCombo === false ? true : !year1 && !year2 ? true : false,
          },
          {
            xtype: 'tbtext',
            id: 'startMonthComboText',
            text: 'End Year',
            style: { marginLeft: '25px', marginBottom: '5px', marginTop: '5px', fontSize: '14px' },
            hidden: year1 && year2 && block.showCombo ? false : year1 && year2 && block.showCombo === false ? true : !year1 && !year2 ? true : false,
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
            value: g.getYearOfActiveInterval(),
            hidden: year1 && year2 && block.showCombo ? false : year1 && year2 && block.showCombo === false ? true : !year1 && !year2 ? true : false,
            listeners: {
              change(yearCombo, value): void {
                const yearVal = value;
                const months = g.getMonthsInIntervalInYear(yearVal);
                const monthData = [];
                for (let i = 0, len = months.length; i < len; i += 1) {
                  const monthsConfig = months[i];
                  monthData.push({
                    value: monthsConfig.value,
                    text: monthsConfig.text,
                  });
                }
                monthStore.removeAll();
                monthStore.loadData(monthData);
              },
            },
          },
          {
            xtype: 'combobox',
            id: 'endYearCombo',
            store: yearStore,
            queryMode: 'local',
            valueField: 'text',
            displayField: 'text',
            width: 80,
            style: { marginLeft: '10px ' },
            value: g.getYearOfActiveInterval(),
            hidden: year1 && year2 && block.showCombo ? false : year1 && year2 && block.showCombo === false ? true : !year1 && !year2 ? true : false,
            listeners: {
              change(yearCombo, value): void {
                const yearVal = value;
                const months = g.getMonthsInIntervalInYear(yearVal);
                const monthData = [];
                for (let i = 0, len = months.length; i < len; i += 1) {
                  const monthsConfig = months[i];
                  monthData.push({
                    value: monthsConfig.value,
                    text: monthsConfig.text,
                  });
                }
                monthStore.removeAll();
                monthStore.loadData(monthData);
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
            hidden: year1 && year2 && block.showCombo ? false : year1 && year2 && block.showCombo === false ? true : !year1 && !year2 ? true : false,
          },
          {
            xtype: 'tbtext',
            id: 'endMonthComboText',
            text: 'End Month',
            style: { marginLeft: '25px', marginBottom: '5px', marginTop: '5px', fontSize: '14px' },
            hidden: year1 && year2 && block.showCombo ? false : year1 && year2 && block.showCombo === false ? true : !year1 && !year2 ? true : false,
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
            value: g.selectableMonths[g.selectedMonthIndex].text,
            hidden: year1 && year2 && block.showCombo ? false : year1 && year2 && block.showCombo === false ? true : !year1 && !year2 ? true : false,
            listeners: {
              beforerender(): void {
                const yearComboCmp = Ext.getCmp('yearCombo');
                const yearVal = yearComboCmp.value;
                const months = g.getMonthsInIntervalInYear(yearVal);
                const monthData = [];
                for (let i = 0, len = months.length; i < len; i += 1) {
                  const monthsConfig = months[i];
                  monthData.push({
                    value: monthsConfig.value,
                    text: monthsConfig.text,
                  });
                }
                monthStore.removeAll();
                monthStore.loadData(monthData);
              },
              change(monthCombo, value): void {
                const monthVal = value;
              },
            },
          },
          {
            xtype: 'combobox',
            id: 'endMonthCombo',
            store: monthStore,
            queryMode: 'local',
            valueField: 'text',
            displayField: 'text',
            width: 80,
            style: { marginLeft: '10px ' },
            value: g.selectableMonths[g.selectedMonthIndex].text,
            hidden: year1 && year2 && block.showCombo ? false : year1 && year2 && block.showCombo === false ? true : !year1 && !year2 ? true : false,
            listeners: {
              beforerender(): void {
                const yearComboCmp = Ext.getCmp('endYearCombo');
                const yearVal = yearComboCmp.value;
                const months = g.getMonthsInIntervalInYear(yearVal);
                const monthData = [];
                for (let i = 0, len = months.length; i < len; i += 1) {
                  const monthsConfig = months[i];
                  monthData.push({
                    value: monthsConfig.value,
                    text: monthsConfig.text,
                  });
                }
                monthStore.removeAll();
                monthStore.loadData(monthData);
              },
              change(monthCombo, value): void {
                const monthVal = value;
              },
            },
          },
        ],
      },
    ];
    const calendar = [
      {
        xtype: 'text',
        id: 'selectDates',
        text: 'Select Date Range:',
        style: { fontSize: '14px', fontWeight: 'bold', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
      },
      {
        xtype: 'datefield',
        id: 'fromDate',
        fieldLabel: 'From',
        format: 'm/d/y',
        minValue: startDate,
        maxValue: endDate,
        value: defaultFromDate,
        style: { marginLeft: '5px' },
        listeners: {
          select(el): void {
            const toDate = Ext.getCmp('toDate');
            toDate.setValue(el.value);
            toDate.setMinValue(el.value);
            const newEndDate = new Date(el.value.getFullYear() + 1, el.value.getMonth(), el.value.getDate());
            if (newEndDate <= endDate) {
              toDate.setMaxValue(newEndDate);
            }
          },
        },
      },
      {
        xtype: 'datefield',
        id: 'toDate',
        fieldLabel: 'To',
        format: 'm/d/y',
        minValue: defaultFromDate,
        maxValue: endDate,
        value: endDate,
        style: { marginLeft: '5px' },
      },
    ];

    if (selection === 'yearSliders') {
      return yearSliders;
    } else if (selection === 'yearCombos') {
      return yearCombos;
    } else if (selection === 'calendar') {
      return calendar;
    }
  };

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
        id: 'noBoxText',
        text: extendedTool.owningBlock.blockConfig.noBoxText,
        style: { fontSize: '14px', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
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
            xtype: 'tbtext',
            id: 'categoryText',
            style: { fontSize: '14px', marginTop: '7px', marginBottom: '5px', marginLeft: '10px' },
          },
          {
            xtype: 'panel',
            id: 'dateSelectorPanel',
            width: '100%',
            items: getDateSelector(block.dateSelection),
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
            width: '90%',
            style: { marginLeft: '10px' },
            items: [
              {
                extendedTool,
                xtype: 'textfield',
                id: 'bbox1',
                name: 'minLat',
                emptyText: 'min',
                style: {
                  marginRight: '3px',
                },
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
            width: '90%',
            style: { marginLeft: '10px' },
            items: [
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
                    // this listener will need slight rework if potentially configurable items are configured

                    // object used to store layers and turn into JSON for server processing
                    function RequestDataObj(
                      clippedMetadataName = null,
                      clippedRasterName = null,
                      srcFolder = null,
                      srcFile = null,
                      srcMetadataName = null,
                      bbox = null,
                      metadata = null,
                      years = null,
                      version = null // for LCMAP
                    ): void {
                      this.clipped_metadata_name = clippedMetadataName;
                      this.clipped_raster_name = clippedRasterName;
                      this.src_folder = srcFolder;
                      this.src_file = srcFile;
                      this.src_meta = srcMetadataName;
                      this.bbox = bbox;
                      this.metadata = metadata;
                      this.years = years;
                      this.version = version;
                    }

                    const fromDate = Ext.getCmp('fromDate');
                    const toDate = Ext.getCmp('toDate');
                    const noDataLayers = [];
                    const mapProj = this.extendedTool.getCurrentMap().getView().getProjection().getCode();
                    const extent = this.extendedTool.getCurrentMapVectorSource().getExtent();
                    const selectedChildren = this.extendedTool.rootNode.getSelectedChildren(); // the categories that the user checked (selected)
                    const categoryArray = []; // an array of all categories the user has selected from
                    const numOfFiles = {}; // keep track of how many files each category requests to download
                    const requestData = [];
                    const years = Ext.getCmp('slideYears');
                    const yearComboBox = Ext.getCmp('yearCombo');
                    const monthComboBox = Ext.getCmp('monthCombo');
                    const endYearComboBox = Ext.getCmp('endYearCombo');
                    const endMonthComboBox = Ext.getCmp('endMonthCombo');
                    const yearSlider = Ext.getCmp('yearSlider');
                    let srcFileNames = [];
                    // for each node checked (or selected) add the corresponding layers to the requestData array
                    for (const node of selectedChildren) {
                      const categoryData = node.data.inputValue; // categoryData: An individual category name from this.extendedTool.selectedCategories
                      categoryArray.push(categoryData);

                      if (this.extendedTool.categories[categoryData]) {
                        let filter = null;
                        const categoryChildren = node.getSelectedChildren();
                        for (const k in categoryChildren) {
                          if (categoryChildren[k].purpose === 'add') {
                            selectedChildren.push(categoryChildren[k]);
                          } else if (categoryChildren[k].purpose === 'filter' && categoryChildren[k].data.inputValue !== 'all') {
                            filter = new RegExp(categoryChildren[k].data.inputValue);
                          }
                        }

                        // for each layer under this category
                        numOfFiles[categoryData] = 0;
                        for (const layerOfCategeory of this.extendedTool.categories[categoryData]) {
                          /*
                           * selectedClippedMetadataName: A layer underneath one of the categories in this.extendedTool.selectedCategories
                           * selectedSourceRasterName: The source raster file name for the selected layer
                           */
                          const [
                            selectedSourceMetadataName,
                            selectedClippedRasterName,
                            selectedSourceFolder,
                            selectedSourceFile,
                            selectedClippedMetadataName,
                            sourceProjection,
                            metadata,
                            isWMST,
                          ] = layerOfCategeory;

                          if (block.dateSelection === 'calendar') {
                            srcFileNames = this.extendedTool.getSourceFileNames(
                              selectedSourceFolder,
                              fromDate.value,
                              toDate.value,
                              selectedSourceFile
                            );
                          } else if (block.dateSelection === 'yearCombos') {
                            srcFileNames = this.extendedTool.getSourceFileNames(
                              selectedSourceFolder,
                              new Date(yearComboBox.value, monthStrToNum(monthComboBox.value) - 1),
                              new Date(endYearComboBox.value, monthStrToNum(endMonthComboBox.value) - 1),
                              selectedSourceFile
                            );
                          } else {
                            srcFileNames = selectedSourceFile;
                          }

                          if (filter === null || filter.test(selectedClippedMetadataName)) {
                            const yearsValue = isWMST && years !== 'null-null' && block.dateSelection === 'yearSliders' ? years.text : null;
                            const version = extendedTool.version;
                            const transExtent = transformExtent(extent, mapProj, sourceProjection); // transformed extent
                            if (!this.extendedTool.extentIsValid(transExtent) && this.extendedTool.extentTooBig(transExtent)) {
                              alert('The bounding box of your download request is NOT VALID!');
                              break;
                            }
                            if (srcFileNames?.length > 0) {
                              const request = new RequestDataObj(
                                selectedClippedMetadataName,
                                selectedClippedRasterName,
                                selectedSourceFolder,
                                srcFileNames,
                                selectedSourceMetadataName,
                                transExtent,
                                metadata,
                                yearsValue,
                                version ? version : null
                              );
                              requestData.push(request);
                              numOfFiles[categoryData] += 1;
                            } else noDataLayers.push(categoryData);
                          }
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

                      const url = encodeURI(extendedTool.owningBlock.blockConfig.addQueueLocation);

                      const request = new XMLHttpRequest();
                      request.open('POST', url, true);
                      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
                      let port = '';
                      if (window.location.port) {
                        port = `:${window.location.port}`;
                      }
                      let currentURL = ``;
                      // For LCMAP we are going to send the region that the download request is being made from in the bboxURL
                      // Assuming if the variable is defined it is meant to be sent; all viewers beside LCMAP should get to else
                      const regionValue = Ext.getCmp('regionCombo')?.value;
                      if (extendedTool.updatedRegionForBBoxURL !== '') {
                        currentURL = `${window.location.protocol}//${window.location.hostname}${port}${window.location.pathname}?region=${extendedTool.updatedRegionForBBoxURL}&downloadBbox=`;
                      } else if (regionValue) {
                        currentURL = `${window.location.protocol}//${window.location.hostname}${port}${window.location.pathname}?region=${regionValue}&downloadBbox=`;
                      } else {
                        currentURL = `${window.location.protocol}//${window.location.hostname}${port}${window.location.pathname}?downloadBbox=`;
                      }

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
                            let successAlert = `Your download request has successfully been sent and will be processed for you within 24 hours. You will receive an e-mail with instructions on retrieving your data. Thank you.`;
                            if (block.dateSelection === 'calendar' && noDataLayers.length > 0) {
                              successAlert += '\nThe following layers were not included for being outside the date range selected: ';
                              noDataLayers.forEach((layer) => {
                                successAlert += `\n${layer}`;
                              });
                            }
                            alert(successAlert);
                          } else {
                            alert(`ERROR: ${response.errorMessage}`);
                          }
                        }
                      };
                    } else {
                      alert('The date range you have selected is invalid for the following products: ' + `${catstr}`);
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
          const tools = Ext.getCmp('cTools');
          //  Every second, check if cTools is rendered, when it is clear this interval and trigger bbox
          const toolCheck = setInterval(() => {
            if (tools.rendered) {
              // activate download button
              const allButtons = document.querySelectorAll('button');
              allButtons.forEach((btn) => {
                if (btn.outerHTML.includes('Download Tool')) btn.click();
              });

              const categoryText = Ext.getCmp('categoryText');
              const noBoxText = Ext.getCmp('noBoxText');
              Ext.getCmp('dataDownloadPanel').show();
              categoryText.setText('Fetching Categories...');
              categoryText.show();
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
    },
  };

  return component;
};
