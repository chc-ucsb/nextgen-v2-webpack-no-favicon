import introJs from 'intro.js';
import 'intro.js/introJs.css';
import { Dictionary, LayerConfig } from 'src/@types';
import { truncateString, buildLabel } from '../../../helpers/string';
import { getBlocksByName } from '../../../helpers/extjs';
import rectangleImage from '../../../../assets/images/landfire/rectangleDrawBox.png';
import polygonImage from '../../../../assets/images/landfire/polygonDrawBox.png';
import templateImage from '../../../../assets/images/landfire/templateSelection.png';

export const cHelpContents = {
  options: {
    requiredBlocks: ['cMapPanel'],
  },

  getComponent(extendedTool, items, toolbar, menu): Record<string, any> {
    const block = extendedTool.owningBlock.blockConfig;

    function reconfigureDownloadTOC(): void {
      let TOCJSON = [];
      const titleLength = 70;
      var versionConfig = [];
      const tocExtendedTool = Ext.getCmp('tutorialTOCTree');

      let selectedVersionId = globalThis.App.Layers.getSelectedVersion();
      let selectedRegionId = globalThis.App.Layers.getSelectedRegion();
      let version_region = selectedVersionId + '_' + selectedRegionId;
      const versionRegionConfig = globalThis.App.Layers.getVersionRegionConfig();

      let config = versionRegionConfig[version_region];

      config.overlays[0].folder.forEach((folder) => {
        if (!folder.hasOwnProperty('pushToDownload')) {
          versionConfig.push(folder);
        }
      });

      const overlays = parseLayers(versionConfig, undefined, undefined, titleLength);

      TOCJSON = TOCJSON.concat(overlays);

      var store = Ext.create('Ext.data.TreeStore', {
        id: 'tutorialTOCTree',
        rootVisible: false,
        lines: true,
        hideHeaders: true,
        root: {
          expanded: false,
          children: TOCJSON,
        },
        listeners: {},
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
        } else if (fdr.type === 'link' || (fdr.type === 'layer' && fdr.loadOnly === false && fdr.mask === false)) {
          TOCTree.push(children);
        }
      }

      return TOCTree;
    }

    function startDownloadToolTourRectangle() {
      var intro = introJs();
      const mapPanels = getBlocksByName('cMapPanel');
      const mapWindows = getBlocksByName('cMapWindow');
      const downloadTOCTree = Ext.getCmp('downloadTOCTree');
      var mapPanelID = null;
      var downloadBtnID = null;
      var downloadID = null
      downloadTOCTree.hide();
      reconfigureDownloadTOC();

      // Get mapPanelID and downloadBtnID from active map window
      for (var i = 0; i < mapWindows.length; i++) {
        if (!mapWindows[i].component.hasCls('deselected-window')) {
          mapPanelID = '#' + mapPanels[i].extendedTool.uniqueId;

          mapPanels[i].parent.toolbarItems.forEach((element) => {
            if (element.blockConfig.name == 'cDataDownloadBtn') {
              downloadBtnID = '#' + element.extendedTool.uniqueId;
              downloadID = element.extendedTool.uniqueId;
            }
          });
        }
      }

      intro
        .setOptions({
          steps: [
            {
              title: 'Step 1',
              element: document.querySelector(downloadBtnID),
              intro: 'Select the Data Download Tool button from the map window toolbar.',
            },
            {
              title: 'Step 2',
              element: document.querySelector('#drawCombo'),
              intro: `Select the Rectangle or Polygon option from the Method dropdown list.`,
            },
            {
              title: 'Step 3',
              element: document.querySelector(mapPanelID),
              intro: `Draw an Area of Interest (AOI) in the map window. <br><br>
                      Example Rectangle AOI: <img src="${rectangleImage}" style='width: 10.5em; height: 6.3em;'> <br><br>
                      Example Polygon AOI: <img src="${polygonImage}" style='width: 10.5em; height: 6.3em;'>`,
            },
            {
              title: 'Step 4',
              element: document.querySelector('#projectionCombo'),
              intro: `Once an Area of Interest is drawn in the map window, use this dropdown to select the projection of the products you wish to download.`,
            },
            {
              title: 'Step 5',
              element: document.querySelector('#selectVersionCombo'),
              intro: `Use this dropdown to filter the products in the download Table of Contents by version.`,
            },
            {
              title: 'Step 6',
              element: document.querySelector('#tutorialTOCTree'),
              intro: `Select one or more products to download from the list.`,
            },
            {
              title: 'Step 7',
              element: document.querySelector('#Email'),
              intro: `Enter the email that the download link will be sent to.`,
            },
            {
              title: 'Step 8',
              element: document.querySelector('#wcsDownloadBtn'),
              intro: `Click the 'Download' button to submit the download request.`,
            },
            {
              title: 'Step 9',
              intro: `Once your request has been added to the queue it will be processed in the order it was received. <br><br>
                      When your data is available, you will receive an email with a download link.`,
            },
          ],
        })
        .start();

      intro.onchange(function (targetElement) {
        if (targetElement.id == 'projectionCombo') {
          const downloadPanel = Ext.getCmp('dataDownloadPanel');
          const tutorialTOCTree = Ext.getCmp('tutorialTOCTree');
          const noBoxText = Ext.getCmp('noBoxText');

          const templateText = Ext.getCmp('templateText');
          const templateCombo = Ext.getCmp('templateCombo');
          templateText.hide();
          templateCombo.hide();

          tutorialTOCTree.show();
          downloadPanel.show();
          noBoxText.hide();
        } else if (targetElement.id == 'GeoJSON') {
          const GeoJSON = Ext.getCmp('GeoJSON');
          const GeoJSONText = Ext.getCmp('GeoJSONText');
          GeoJSON.show();
          GeoJSONText.show();
        } else if (targetElement.id == 'templateCombo') {
          const GeoJSON = Ext.getCmp('GeoJSON');
          const GeoJSONText = Ext.getCmp('GeoJSONText');
          GeoJSON.hide();
          GeoJSONText.hide();
          const templateText = Ext.getCmp('templateText');
          const templateCombo = Ext.getCmp('templateCombo');
          templateText.show();
          templateCombo.show();
        } else if (targetElement.id == 'Email') {
          //scroll panel down so that the tour element can be in view
          const toolsPanel = Ext.getCmp('cTools');
          toolsPanel.body.dom.scrollTop = 1000;
        } else if (targetElement.id == 'drawCombo') {
          document.getElementById(downloadID).click();
        }
      });

      intro.onexit(function (targetElement) {
        const tutorialTOCTree = Ext.getCmp('tutorialTOCTree');
        const downloadTOCTree = Ext.getCmp('downloadTOCTree');
        const noBoxText = Ext.getCmp('noBoxText');
        const parentPanel = Ext.getCmp('parentPanel');

        parentPanel.collapse();
        downloadTOCTree.show();
        tutorialTOCTree.hide();
        noBoxText.hide();
        document.getElementById('wcsDownloadClear').click();
      });
    }

    function startDownloadToolTourGeoJSON() {
      var intro = introJs();
      const mapPanels = getBlocksByName('cMapPanel');
      const mapWindows = getBlocksByName('cMapWindow');
      const downloadTOCTree = Ext.getCmp('downloadTOCTree');
      var mapPanelID = null;
      var downloadBtnID = null;
      downloadTOCTree.hide();
      reconfigureDownloadTOC();

      // Get mapPanelID and downloadBtnID from active map window
      for (var i = 0; i < mapWindows.length; i++) {
        if (!mapWindows[i].component.hasCls('deselected-window')) {
          mapPanelID = '#' + mapPanels[i].extendedTool.uniqueId;

          mapPanels[i].parent.toolbarItems.forEach((element) => {
            if (element.blockConfig.name == 'cDataDownloadBtn') {
              downloadBtnID = '#' + element.extendedTool.uniqueId;
            }
          });
        }
      }

      intro
        .setOptions({
          steps: [
            {
              title: 'Step 1',
              element: document.querySelector(downloadBtnID),
              intro: 'Select the Data Download Tool button from the map window toolbar.',
            },
            {
              title: 'Step 2',
              element: document.querySelector('#drawCombo'),
              intro: `Select the GeoJSON option from the Method dropdown list.`,
            },
            {
              title: 'Step 3',
              element: document.querySelector('#GeoJSON'),
              intro: `Enter an EPSG:3857 formatted GeoJSON string into the GeoJSON text box and the Area of Interest will appear in the map window.`,
            },
            {
              title: 'Step 4',
              element: document.querySelector('#projectionCombo'),
              intro: `Once an Area of Interest is drawn in the map window, use this dropdown to select the projection of the products you wish to download.`,
            },
            {
              title: 'Step 5',
              element: document.querySelector('#selectVersionCombo'),
              intro: `Use this dropdown to filter the products in the download Table of Contents by version.`,
            },
            {
              title: 'Step 6',
              element: document.querySelector('#tutorialTOCTree'),
              intro: `Select one or more products to download from the list.`,
            },
            {
              title: 'Step 7',
              element: document.querySelector('#Email'),
              intro: `Enter the email that the download link will be sent to.`,
            },
            {
              title: 'Step 8',
              element: document.querySelector('#wcsDownloadBtn'),
              intro: `Click the 'Download' button to submit the download request.`,
            },
            {
              title: 'Step 9',
              intro: `Once your request has been added to the queue it will be processed in the order it was received. <br><br>
                      When your data is available, you will receive an email with a download link.`,
            },
          ],
        })
        .start();

      intro.onchange(function (targetElement) {
        if (targetElement.id == 'projectionCombo') {
          const downloadPanel = Ext.getCmp('dataDownloadPanel');
          const tutorialTOCTree = Ext.getCmp('tutorialTOCTree');
          const noBoxText = Ext.getCmp('noBoxText');

          const templateText = Ext.getCmp('templateText');
          const templateCombo = Ext.getCmp('templateCombo');
          templateText.hide();
          templateCombo.hide();

          tutorialTOCTree.show();
          downloadPanel.show();
          noBoxText.hide();
        } else if (targetElement.id == 'drawCombo') {
          const drawCombo = Ext.getCmp('drawCombo');
          drawCombo.setValue('GeoJSON');
        } else if (targetElement.id == 'GeoJSON') {
          const GeoJSON = Ext.getCmp('GeoJSON');
          const GeoJSONText = Ext.getCmp('GeoJSONText');
          GeoJSON.show();
          GeoJSONText.show();
        } else if (targetElement.id == 'templateCombo') {
          const GeoJSON = Ext.getCmp('GeoJSON');
          const GeoJSONText = Ext.getCmp('GeoJSONText');
          GeoJSON.hide();
          GeoJSONText.hide();
          const templateText = Ext.getCmp('templateText');
          const templateCombo = Ext.getCmp('templateCombo');
          templateText.show();
          templateCombo.show();
        } else if (targetElement.id == 'Email') {
          //scroll panel down so that the tour element can be in view
          const toolsPanel = Ext.getCmp('cTools');
          toolsPanel.body.dom.scrollTop = 1000;
        }
      });

      intro.onexit(function (targetElement) {
        const tutorialTOCTree = Ext.getCmp('tutorialTOCTree');
        const downloadTOCTree = Ext.getCmp('downloadTOCTree');
        const noBoxText = Ext.getCmp('noBoxText');
        const parentPanel = Ext.getCmp('parentPanel');

        parentPanel.collapse();
        downloadTOCTree.show();
        tutorialTOCTree.hide();
        noBoxText.hide();
        document.getElementById('wcsDownloadClear').click();
      });
    }

    function startDownloadToolTourTemplate() {
      var intro = introJs();
      const mapPanels = getBlocksByName('cMapPanel');
      const mapWindows = getBlocksByName('cMapWindow');
      const downloadTOCTree = Ext.getCmp('downloadTOCTree');
      var mapPanelID = null;
      var downloadBtnID = null;
      downloadTOCTree.hide();
      reconfigureDownloadTOC();

      // Get mapPanelID and downloadBtnID from active map window
      for (var i = 0; i < mapWindows.length; i++) {
        if (!mapWindows[i].component.hasCls('deselected-window')) {
          mapPanelID = '#' + mapPanels[i].extendedTool.uniqueId;

          mapPanels[i].parent.toolbarItems.forEach((element) => {
            if (element.blockConfig.name == 'cDataDownloadBtn') {
              downloadBtnID = '#' + element.extendedTool.uniqueId;
            }
          });
        }
      }

      intro
        .setOptions({
          steps: [
            {
              title: 'Step 1',
              element: document.querySelector(downloadBtnID),
              intro: 'Select the Data Download Tool button from the map window toolbar.',
            },
            {
              title: 'Step 2',
              element: document.querySelector('#drawCombo'),
              intro: `Select the Template option from the Method dropdown list.`,
            },
            {
              title: 'Step 3',
              element: document.querySelector('#templateCombo'),
              intro: `Select an option from the Template dropdown list. <br><br>
                      Options: 1x1 Degree WGS84 Grid, 5x5 Degree WGS84 Grid, Atlas State Boundaries, County Boundaries`,
            },
            {
              title: 'Step 4',
              element: document.querySelector(mapPanelID),
              intro: `Click the desired Area of Interest (AOI) in the map window. <br><br>
              Example State Boundary AOI: <img src="${templateImage}" style='width: 10.5em; height: 6.3em;'>`,
            },
            {
              title: 'Step 5',
              element: document.querySelector('#projectionCombo'),
              intro: `Once an Area of Interest appears in the map window, use this dropdown to select the projection of the products you wish to download.`,
            },
            {
              title: 'Step 6',
              element: document.querySelector('#selectVersionCombo'),
              intro: `Use this dropdown to filter the products in the download Table of Contents by version.`,
            },
            {
              title: 'Step 7',
              element: document.querySelector('#tutorialTOCTree'),
              intro: `Select one or more products to download from the list.`,
            },
            {
              title: 'Step 8',
              element: document.querySelector('#Email'),
              intro: `Enter the email that the download link will be sent to.`,
            },
            {
              title: 'Step 9',
              element: document.querySelector('#wcsDownloadBtn'),
              intro: `Click the 'Download' button to submit the download request.`,
            },
            {
              title: 'Step 10',
              intro: `Once your request has been added to the queue it will be processed in the order it was received. <br><br>
                      When your data is available, you will receive an email with a download link.`,
            },
          ],
        })
        .start();

      intro.onchange(function (targetElement) {
        if (targetElement.id == 'projectionCombo') {
          const downloadPanel = Ext.getCmp('dataDownloadPanel');
          const tutorialTOCTree = Ext.getCmp('tutorialTOCTree');
          const noBoxText = Ext.getCmp('noBoxText');

          const templateText = Ext.getCmp('templateText');
          const templateCombo = Ext.getCmp('templateCombo');
          templateText.hide();
          templateCombo.hide();

          tutorialTOCTree.show();
          downloadPanel.show();
          noBoxText.hide();
        } else if (targetElement.id == 'drawCombo') {
          const drawCombo = Ext.getCmp('drawCombo');
          drawCombo.setValue('Template');
        } else if (targetElement.id == 'GeoJSON') {
          const GeoJSON = Ext.getCmp('GeoJSON');
          const GeoJSONText = Ext.getCmp('GeoJSONText');
          GeoJSON.show();
          GeoJSONText.show();
        } else if (targetElement.id == 'templateCombo') {
          const GeoJSON = Ext.getCmp('GeoJSON');
          const GeoJSONText = Ext.getCmp('GeoJSONText');
          GeoJSON.hide();
          GeoJSONText.hide();
          const templateText = Ext.getCmp('templateText');
          const templateCombo = Ext.getCmp('templateCombo');
          templateText.show();
          templateCombo.show();
        } else if (targetElement.id == 'Email') {
          //scroll panel down so that the tour element can be in view
          const toolsPanel = Ext.getCmp('cTools');
          toolsPanel.body.dom.scrollTop = 1000;
        }
      });

      intro.onexit(function (targetElement) {
        const tutorialTOCTree = Ext.getCmp('tutorialTOCTree');
        const downloadTOCTree = Ext.getCmp('downloadTOCTree');
        const noBoxText = Ext.getCmp('noBoxText');
        const parentPanel = Ext.getCmp('parentPanel');

        parentPanel.collapse();
        downloadTOCTree.show();
        tutorialTOCTree.hide();
        noBoxText.hide();
        document.getElementById('wcsDownloadClear').click();
      });
    }

    const component = [
      {
        extendedTool,
        title: 'Additional Help',
        id: 'additionalHelpPanel',
        collapsible: Object.prototype.hasOwnProperty.call(block, 'collapsible') ? block.collapsible : true,
        collapsed: false,
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
        items: [
          {
            xtype: 'button',
            text: 'Viewer User Instructions',
            href: 'https://landfire.gov/User_Instructions.php',
            width: 310,
            columnWidth: 0.5,
            style: {
              margin: '10px',
            },
            hidden: false,
            listeners: {
              click() {},
            },
          },
        ],
        listeners: {},
      },
      {
        extendedTool,
        title: 'Tutorial List',
        id: 'tutorialPanel',
        collapsible: Object.prototype.hasOwnProperty.call(block, 'collapsible') ? block.collapsible : true,
        collapsed: false,
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
        items: [
          {
            xtype: 'button',
            text: 'Data Download Tool: Rectangle or Polygon Method',
            id: 'downloadTourButtonjRectangle',
            width: 310,
            columnWidth: 0.5,
            style: {
              margin: '10px',
            },
            hidden: false,
            listeners: {
              click() {
                startDownloadToolTourRectangle();
                const panel = Ext.getCmp('parentPanel');
                panel.expand();
              },
            },
          },
          {
            xtype: 'button',
            text: 'Data Download Tool: GeoJSON Method',
            id: 'downloadTourButtonGeoJSON',
            width: 310,
            columnWidth: 0.5,
            style: {
              margin: '10px',
            },
            hidden: false,
            listeners: {
              click() {
                startDownloadToolTourGeoJSON();
                const panel = Ext.getCmp('parentPanel');
                panel.expand();
              },
            },
          },
          {
            xtype: 'button',
            text: 'Data Download Tool: Template Method',
            id: 'downloadTourButtonTemplate',
            width: 310,
            columnWidth: 0.5,
            style: {
              margin: '10px',
            },
            hidden: false,
            listeners: {
              click() {
                startDownloadToolTourTemplate();
                const panel = Ext.getCmp('parentPanel');
                panel.expand();
              },
            },
          },
        ],
        listeners: {},
      },
    ];

    return component;
  },
};
