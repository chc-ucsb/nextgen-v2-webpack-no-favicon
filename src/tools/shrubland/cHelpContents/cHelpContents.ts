import introJs from 'intro.js';
import '../../../../assets/css/styles-rangeland-override.css';
import 'intro.js/introJs.css';
import { Dictionary, LayerConfig } from 'src/@types';
import { truncateString, buildLabel } from '../../../helpers/string';
import { getBlocksByName } from '../../../helpers/extjs';
import graphImage from '../../../../assets/images/shrubland/graphingWindow.png';

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
      const maxTitleLength = titleLength;

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

    function startFirstTour() {
      //Switch from the Help tab to the Contents tab
      document.getElementById('tab-1045').click();

      //If the first boundary is not selected, select it, so the graph tool button will appear.
      let element: HTMLElement = document.getElementsByClassName('x-tree-checkbox')[1] as HTMLElement;
      if (!element.classList.contains('x-tree-checkbox-checked')) {
        element.click();
      }

      var intro = introJs();
      const mapPanels = getBlocksByName('cMapPanel');
      const mapWindows = getBlocksByName('cMapWindow');
      var mapPanelID = null;
      var downloadBtnID = null;
      var identifyToolID = null;
      var graphToolID = null;

      // Get mapPanelID and downloadBtnID from active map window
      // Use IDs to point to elements with 'element: document.querySelector(graphToolID)'

      for (var i = 0; i < mapWindows.length; i++) {
        if (!mapWindows[i].component.hasCls('deselected-window')) {
          mapPanelID = '#' + mapPanels[i].extendedTool.uniqueId;

          mapPanels[i].parent.toolbarItems.forEach((element) => {
            if (element.blockConfig.name == 'cDataDownloadBtn') {
              downloadBtnID = '#' + element.extendedTool.id;
            }
          });

          mapPanels[i].parent.toolbarItems.forEach((element) => {
            if (element.blockConfig.name == 'cIdentifyTool') {
              identifyToolID = '#' + element.extendedTool.extToolID;
            }
          });

          mapPanels[i].parent.toolbarItems.forEach((element) => {
            if (element.blockConfig.name == 'cGraphTool') {
              graphToolID = '#' + element.extendedTool.extToolID;
            }
          });
        }
      }

      intro
        .setOptions({
          steps: [
            {
              title: 'Step 1',
              element: document.getElementsByClassName('x-panel')[7] as HTMLElement,
              intro: `The RCMAP time-series tool is initiated by enabling one of the polygon layers (HUC, pasture or allotment) to display on the map.   These layers are in the Layers pane inside the Boundaries folder.   After enabling one or more of these layers, the Graph Tool which opens the Zonal Statistic Plot should appear on the Toolbar.`,
            },
            {
              title: 'Step 2',
              element: document.getElementsByClassName('fa-area-chart')[0] as HTMLElement,
              intro: `Click on the Time-Series Graphing Tool button in the map window.`,
            },
            {
              title: 'Step 3',
              element: document.getElementsByClassName('ol-viewport')[0] as HTMLElement,
              intro: `  Click on any HUC, pasture or allotment polygon on the map to view the time-series data.`,
            },
            {
              title: 'Step 4',
              tooltipClass: 'introJsSlightlyWiderPanel',
              intro: `1) Select the polygon type (HUC/pastures/allotments/etc.) to plot RCMAP time-series<br>
                      2) Drag to zoom to view the years on the X axis<br>
                      3) Hover the mouse over each time-series for detailed statistics<br>
                      4) Toggle the legend area to disable and enable components currently displayed<br><br> <img src="${graphImage}" style='width: 100%; text-align:center;'>`,
            },
          ],
        })
        .start();

      intro.onchange(function (targetElement) {
        //Switch back to the Contents tab if LayersTOC is the target
        if (targetElement.id == 'ext-gen1227') {
          document.getElementById('tab-1045').click();
        }
      });

      intro.onexit(function (targetElement) {
        const noBoxText = Ext.getCmp('noBoxText');

        noBoxText.hide();
        document.getElementById('wcsDownloadClear').click();
      });
    }

    const component = [
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
            text: 'Graph Tool',
            id: 'graphToolTutorial',
            width: 310,
            columnWidth: 0.5,
            style: {
              margin: '10px',
            },
            hidden: false,
            listeners: {
              click() {
                startFirstTour();
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
