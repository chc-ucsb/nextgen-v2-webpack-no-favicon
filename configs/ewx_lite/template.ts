import logoLeft from '../../assets/images/fewsusgs1.jpg';
import logoRight from '../../assets/images/fewsnet.png';
import barGraph from '../../assets/images/bar_graph_black.png';
import lineChart from '../../assets/images/line_chart.png';

export const template = {
  theme: 'ExtJSNeptune',
  cssFallback: true,
  analytics: {
    matomo: {
      baseUrl: '//edcintl.cr.usgs.gov/piwik/',
      id: '13',
    },
    google: {
      id: 'UA-20242140-4',
    },
  },
  blocks: [
    {
      block: 'top',
      name: 'cHeader',
      import: 'js.tools.shared.cHeader.cHeader',
      add: true,
      width: 'auto',
      height: 65,
      cssClass: '',
      bodyStyle: 'padding: 10px',
      collapsible: true,
      content: `<div id='header-logo-left'><img src='${logoLeft}'></div><div id='header-logo-right'><img src='${logoRight}'></div><h1 class='main'>EWX Lite Next Generation Viewer</h1>`,
      link: 'http://earlywarning.usgs.gov',
    },
    {
      block: 'left',
      name: 'cTOCDesktopLike',
      import: 'js.tools.shared.cTOCDesktopLike.cTOCDesktopLike',
      add: true,
      width: 230,
      height: 'auto',
      title: 'TOC',
      blocks: [
        {
          block: 'top',
          name: 'cTocContainer',
          import: 'js.tools.shared.cTocContainer.cTocContainer',
          width: '100%',
          height: 'auto',
          add: true,
          blocks: [
            {
              name: 'cDefaultToc',
              import: 'js.tools.ewx_light.cDefaultToc.cDefaultToc',
              add: true,
              width: '100%',
              height: 'auto',
              titleLength: 30,
            },
          ],
        },
      ],
      toolbar: {
        position: 'top',
        overflowMenu: false,
        items: [
          {
            name: 'cRegionTool',
            import: 'js.tools.shared.cRegionTool.cRegionTool',
            add: true,
            width: 225,
            sort: 'asc',
          },
        ],
      },
    },
    {
      block: 'center',
      name: 'cMapWindow',
      import: 'js.tools.shared.cMapWindow.cMapWindow',
      add: true,
      collapsible: false,
      hideTitle: true,
      toolbar: {
        position: 'top',
        add: true,
        overflowMenu: true,
        items: [
          // {
          //   name: 'cZoomToRegionTool',
          //   title: '',
          //   add: true,
          //   import: 'js.tools.shared.cZoomToRegionTool.cZoomToRegionTool',
          //   cssClass: '',
          //   tooltip: 'Zoom to Region',
          //   iconClass: 'ms ms-max-extent',
          // },
          // {
          //   name: 'cPanTool',
          //   title: '',
          //   add: true,
          //   import: 'js.tools.shared.cPanTool.cPanTool',
          //   cssClass: '',
          //   tooltip: 'Pan Tool',
          //   iconClass: 'ms ms-pan-hand',
          // },
          // {
          //   name: 'cExtentDragBoxTool',
          //   title: '',
          //   add: true,
          //   import: 'js.tools.shared.cExtentDragBoxTool.cExtentDragBoxTool',
          //   cssClass: '',
          //   tooltip: 'Zoom to Extent',
          //   iconClass: 'ms ms-zoom-in',
          // },
          // {
          //   name: 'cRevertExtentTool',
          //   title: '',
          //   add: true,
          //   import: 'js.tools.shared.cRevertExtentTool.cRevertExtentTool',
          //   cssClass: '',
          //   tooltip: 'Zoom to Previous',
          //   iconClass: 'ms ms-zoom-previous',
          // },
          // {
          //   name: 'cGraphTool',
          //   olExt: true,
          //   title: '',
          //   add: true,
          //   import: 'js.tools.shared.cGraphTool.cGraphTool',
          //   cssClass: '',
          //   pressed: true,
          //   tooltip: 'Graph Tool',
          //   iconClass: 'ms ms-topographic-profile',
          //   layers: [
          //     {
          //       id: 'africaAdmin1',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'africaAdmin2',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'africaCropzones',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'africaFNMU',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'eastAfricaAdmin1',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'eastAfricaAdmin2',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'eastAfricaCropzones',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'eastAfricaFNMU',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'camcarAdmin1',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'camcarAdmin2',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'camcarCropzonesLoadOnly',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'camcarFNMU',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'afghanBasins',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'meIraqBasins',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'casiaAdmin1',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'casiaAdmin2',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'casiaPakistanBasins',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'casiaAfghanDam',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'casiaAfghanIr',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'casiaAfghanRf',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'casiaAfghanRg',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'casiaTajikistanBasins',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'casiaFNMU',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'meAdmin1',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'yemenCropzones',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'yemenAdmin2',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'meIraqGaugeBasinsKadaheyeh',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'meIraqGaugeBasinsKeban',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'meIraqGaugeBasinsMosul',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'meFNMU',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'saAdmin1',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'saAdmin2',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'cipAdmin1',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //     {
          //       id: 'cipAdmin2',
          //       featureInfo: [
          //         {
          //           propertyName: 'POLY_NAME',
          //           type: 'display',
          //         },
          //       ],
          //     },
          //   ],
          // },
          {
            name: 'cSpacer',
            add: true,
            import: 'js.tools.shared.cSpacer.cSpacer',
          },
          // {
          //   name: 'cBoundaryLegendPopup',
          //   add: true,
          //   import: 'js.tools.shared.cBoundaryLegendPopup.cBoundaryLegendPopup',
          //   tooltip: 'Show Legend',
          //   text: 'Legend',
          //   title: 'Map Legend',
          // },
        ],
      },
      blocks: [
        {
          name: 'cZoomToRegionTool_olext',
          import: 'js.tools.shared.cZoomToRegionTool.cZoomToRegionTool_olext',
          add: true,
        },
        {
          name: 'cExtentDragBoxTool_olext',
          import: 'js.tools.shared.cExtentDragBoxTool.cExtentDragBoxTool_olext',
          add: true,
        },
        {
          name: 'cPanTool_olext',
          import: 'js.tools.shared.cPanTool.cPanTool_olext',
          add: true,
        },

        {
          name: 'cGraphTool',
          title: '',
          add: true,
          import: 'js.tools.shared.cGraphTool.cGraphTool',
          cssClass: '',
          pressed: false,
          tooltip: 'Graph Tool',
          layers: [
            {
              id: 'africaAdmin1',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'africaAdmin2',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'africaCropzones',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'africaFNMU',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'eastAfricaAdmin1',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'eastAfricaAdmin2',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'eastAfricaCropzones',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'eastAfricaFNMU',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'camcarAdmin1',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'camcarAdmin2',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'camcarCropzonesLoadOnly',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'camcarFNMU',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'afghanBasins',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'meIraqBasins',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'casiaAdmin1',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'casiaAdmin2',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'casiaPakistanBasins',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'casiaAfghanDam',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'casiaAfghanIr',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'casiaAfghanRf',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'casiaAfghanRg',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'casiaTajikistanBasins',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'casiaFNMU',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'meAdmin1',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'yemenCropzones',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'yemenAdmin2',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'meIraqGaugeBasinsKadaheyeh',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'meIraqGaugeBasinsKeban',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'meIraqGaugeBasinsMosul',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'meFNMU',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'saAdmin1',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'saAdmin2',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'cipAdmin1',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
            {
              id: 'cipAdmin2',
              featureInfo: [
                {
                  propertyName: 'POLY_NAME',
                  type: 'display',
                },
              ],
            },
          ],
          olExt: true,
        },

        {
          name: 'cRevertExtentTool_olext',
          import: 'js.tools.shared.cRevertExtentTool.cRevertExtentTool_olext',
          add: true,
        },
        {
          name: 'cIdentifyTool_olext',
          import: 'js.tools.shared.cIdentifyTool.cIdentifyTool_olext',
          add: true,
        },
        // {
        // name: 'cDataDownloadBtn',
        // add: true,
        // import: 'js.tools.shared.cDataDownloadBtn.cDataDownloadBtn',
        // tooltip: 'Data Download Tool',
        // olExt: true,
        // },
        {
          name: 'cMapDownloadsTool_olext',
          import: 'js.tools.shared.cMapDownloadsTool.cMapDownloadsTool_olext',
          add: true,
        },
        // {
        //   name: 'cBoundaryLegendPopup',
        //   add: true,
        //   import: 'js.tools.shared.cBoundaryLegendPopup.cBoundaryLegendPopup',
        //   tooltip: 'Show Legend',
        //   text: 'Legend',
        //   title: 'Map Legend',
        // },
        {
          name: 'cMapLegend_olext',
          import: 'js.tools.ewx_light.cMapLegend.cMapLegend_olext',
          pressed: false,
          add: true,
        },

        {
          block: 'top',
          name: 'cMapPanel',
          import: 'js.tools.shared.cMapPanel.cMapPanel',
          add: true,
          interactions: ['pan', 'zoom'],
          mouseCoordinates: {
            show: true,
            projection: 'EPSG:4326',
          },
          controls: [
            {
              name: 'toolbar',
              position: 'top',
              controls: [
                {
                  name: 'toolbar',
                  position: 'top',
                  options: {
                    toggleOne: true,
                    group: true,
                  },
                  controls: ['pan', 'drag-zoom'],
                },
                'zoom-to-region',
                'revert-extent',
                {
                  name: 'toolbar',
                  position: 'top',
                  options: {
                    toggleOne: true,
                    group: true,
                  },
                  controls: ['chart'],
                },
              ],
            },
            'legend',
          ],
        },
        {
          block: 'bottom',
          title: 'Zonal Statistics Plot',
          name: 'cMapWindowChartArea',
          add: true,
          import: 'js.tools.shared.cMapWindowChartArea.cMapWindowChartArea',
          collapsible: true,
          blocks: [
            {
              block: 'center',
              name: 'cChartTabPanel',
              add: true,
              import: 'js.tools.shared.cChartTabPanel.cChartTabPanel',
              blocks: [
                {
                  block: 'center',
                  name: 'cChartContainer',
                  import: 'js.tools.shared.cChartContainer.cChartContainer',
                  add: true,
                  isDefault: false,
                  closable: false,
                  toolbar: {
                    overflowMenu: true,
                    items: [
                      {
                        name: 'cPeriodTypeCombo',
                        import: 'js.tools.shared.cPeriodTypeCombo.cPeriodTypeCombo',
                        title: '',
                        add: true,
                        tooltip: 'Select Period Type',
                        saveSelection: true,
                        width: 75,
                      },
                      {
                        name: 'cYearsCombo',
                        import: 'js.tools.shared.cYearsCombo.cYearsCombo',
                        title: '',
                        add: true,
                        tooltip: 'Select Years',
                        saveSelection: true,
                        showByDefault: {
                          amountSelected: 2,
                          startSelectionAt: 'latest',
                          others: [],
                        },
                        width: 120,
                        addSelectAllButtons: true,
                      },
                      {
                        name: 'cZonesCombo',
                        import: 'js.tools.shared.cZonesCombo.cZonesCombo',
                        title: '',
                        add: true,
                        tooltip: 'Select Zone',
                        saveSelection: true,
                        width: 105,
                      },
                      {
                        name: 'cChartTypeCombo',
                        import: 'js.tools.shared.cChartTypeCombo.cChartTypeCombo',
                        title: '',
                        add: true,
                        tooltip: 'Select Chart Type',
                        saveSelection: true,
                        width: 50,
                      },
                      {
                        name: 'cSpacer',
                        import: 'js.tools.shared.cSpacer.cSpacer',
                        add: true,
                      },
                      {
                        name: 'cDockChart',
                        import: 'js.tools.shared.cDockChart.cDockChart',
                        title: '',
                        add: false,
                        tooltip: 'Dock Window',
                        saveSelection: true,
                        dockedState: 'docked',
                      },
                      {
                        name: 'cChartToolsMenu',
                        import: 'js.tools.shared.cChartToolsMenu.cChartToolsMenu',
                        title: '',
                        height: 24,
                        width: 45,
                        add: true,
                        tooltip: 'Chart Tools',
                        items: [
                          {
                            name: 'cMenuLabel',
                            add: true,
                            label: 'Download:',
                            import: 'js.tools.shared.cMenuLabel.cMenuLabel',
                          },
                          {
                            name: 'cExportPNG',
                            import: 'js.tools.shared.cExportPNG.cExportPNG',
                            title: 'PNG',
                            add: true,
                            cssClass: '',
                            tooltip: 'Save chart as PNG',
                          },
                          {
                            name: 'cExportCSV',
                            import: 'js.tools.shared.cExportCSV.cExportCSV',
                            title: 'CSV',
                            add: true,
                            cssClass: '',
                            tooltip: 'Export data as CSV',
                          },
                        ],
                      },
                      {
                        name: 'cChartLegend',
                        import: 'js.tools.shared.cChartLegend.cChartLegend',
                        title: '',
                        add: true,
                        cssClass: '',
                        tooltip: 'Show Chart Legend',
                        pressed: true,
                        legendPosition: 'bottom',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          block: 'relative',
          name: 'cMapWindowChartArea',
          import: 'js.tools.shared.cMapWindowChartArea.cMapWindowChartArea',
          title: 'Zonal Statistics Plot',
          width: 850,
          height: 500,
          collapsible: true,
          blocks: [
            {
              name: 'cChartTabPanel',
              import: 'js.tools.shared.cChartTabPanel.cChartTabPanel',
              blocks: [
                {
                  block: 'center',
                  name: 'cChartContainer',
                  import: 'js.tools.shared.cChartContainer.cChartContainer',
                  isDefault: true,
                  add: true,
                  width: 'auto',
                  height: 'auto',
                  closable: false,
                  toolbar: {
                    overflowMenu: true,
                    items: [
                      {
                        name: 'cPeriodTypeCombo',
                        import: 'js.tools.shared.cPeriodTypeCombo.cPeriodTypeCombo',
                        title: '',
                        add: true,
                        tooltip: 'Select Period Type',
                        saveSelection: true,
                        width: 75,
                      },
                      {
                        name: 'cYearsCombo',
                        import: 'js.tools.shared.cYearsCombo.cYearsCombo',
                        title: '',
                        add: true,
                        tooltip: 'Select Years',
                        saveSelection: true,
                        showByDefault: {
                          amountSelected: 2,
                          startSelectionAt: 'latest',
                          others: [],
                        },
                        width: 120,
                        addSelectAllButtons: true,
                      },
                      {
                        name: 'cZonesCombo',
                        import: 'js.tools.shared.cZonesCombo.cZonesCombo',
                        title: '',
                        add: true,
                        tooltip: 'Select Zone',
                        saveSelection: true,
                        width: 105,
                      },
                      {
                        name: 'cChartTypeCombo',
                        import: 'js.tools.shared.cChartTypeCombo.cChartTypeCombo',
                        title: '',
                        add: true,
                        tooltip: 'Select Chart Type',
                        saveSelection: true,
                        width: 60,
                        images: {
                          bar: barGraph,
                          line: lineChart,
                        },
                      },
                      {
                        name: 'cChartDataTruncate',
                        import: 'js.tools.shared.cChartDataTruncate.cChartDataTruncate',
                        add: true,
                        tooltip: 'Set Cumulative Start Date',
                        text: 'Set Start Point',
                      },
                      {
                        name: 'cChartDataTruncateReset',
                        import: 'js.tools.shared.cChartDataTruncateReset.cChartDataTruncateReset',
                        add: true,
                        tooltip: 'Reset Cumulative Start Date',
                        text: 'Reset Start Point',
                      },
                      {
                        name: 'cSpacer',
                        import: 'js.tools.shared.cSpacer.cSpacer',
                        add: true,
                      },
                      {
                        name: 'cDockChart',
                        import: 'js.tools.shared.cDockChart.cDockChart',
                        title: '',
                        add: false,
                        tooltip: 'Dock Window',
                        saveSelection: true,
                        dockedState: 'undocked',
                      },
                      {
                        name: 'cChartToolsMenu',
                        import: 'js.tools.shared.cChartToolsMenu.cChartToolsMenu',
                        title: '',
                        height: 24,
                        width: 45,
                        add: true,
                        tooltip: 'Chart Tools',
                        items: [
                          {
                            name: 'cMenuLabel',
                            add: true,
                            import: 'js.tools.shared.cMenuLabel.cMenuLabel',
                            label: 'Download:',
                          },
                          {
                            name: 'cExportPNG',
                            import: 'js.tools.shared.cExportPNG.cExportPNG',
                            title: 'PNG',
                            add: true,
                            cssClass: '',
                            tooltip: 'Save chart as PNG',
                          },
                          {
                            name: 'cExportCSV',
                            import: 'js.tools.shared.cExportCSV.cExportCSV',
                            title: 'CSV',
                            add: true,
                            cssClass: '',
                            tooltip: 'Export data as CSV',
                          },
                        ],
                      },
                      {
                        name: 'cChartLegend',
                        import: 'js.tools.shared.cChartLegend.cChartLegend',
                        title: '',
                        add: true,
                        cssClass: '',
                        tooltip: 'Show Chart Legend',
                        pressed: true,
                        legendPosition: 'bottom',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  host: 'earlywarning.usgs.gov',
};
