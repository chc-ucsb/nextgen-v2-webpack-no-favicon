import intelimonLogo from '../../assets/images/lidar/IntELiMon.png';
import mtbsUSGSLogo from '../../assets/images/lidar/USGS.png';
import doiLogo from '../../assets/images/lidar/DOIlogo.png';
import fwsShieldLogo from '../../assets/images/lidar/logo-usfws.png';
import fsShieldLogo from '../../assets/images/lidar/FSshield.gif';
import iconBbox from '../../assets/images/lidar/icon-bbox.png';
import iconMap from '../../assets/images/lidar/icon-map.png';
import iconList from '../../assets/images/lidar/icon-list.png';

export const template = {
  theme: 'ExtJSNeptune',
  cssFallback: true,
  analytics: {
    matomo: {
      baseUrl: '//edcintl.cr.usgs.gov/piwik/',
      id: '4',
    },
    google: {
      id: 'UA-102809644-1',
    },
  },
  blocks: [
    {
      block: 'top',
      name: 'cHeader',
      import: 'js.tools.shared.cHeader.cHeader',
      add: true,
      width: 'auto',
      height: 60,
      cssClass: '',
      bodyStyle: 'padding: 10px',
      collapsible: true,
      content: `<div id='header-logo-left'><img src='${intelimonLogo}'></div><div id='header-logo-right'><img src='${mtbsUSGSLogo}'><img src='${fwsShieldLogo}'><img src='${fsShieldLogo}'><img src='${doiLogo}'></div><h1 class='main'>Interactive Viewer - IntELiMon - Interagency Ecosystem LiDAR Monitoring</h1>`,
      link: 'http://earlywarning.usgs.gov',
    },
    {
      block: 'left',
      name: 'cTOCDesktopLike',
      import: 'js.tools.shared.cTOCDesktopLike.cTOCDesktopLike',
      add: true,
      width: 270,
      height: 'auto',
      title: 'TOC',
      collapsible: true,
      collapsed: false,
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
              import: 'js.tools.lidar.cDefaultToc.cDefaultToc',
              add: true,
              width: '95%',
              height: 'auto',
              titleLength: 30,
              hideDatePicker: true,
            },
          ],
        },
        {
          name: 'cTextPanel',
          import: 'js.tools.shared.cTextPanel.cTextPanel',
          add: true,
          content: `<div class='help-panel'><h3>Data Download Instructions</h3><ol><li>Select a region</li><li>Select area of interest <ol><li>Select bounding box area <img src='${iconBbox}' alt='Select Bounding Box'></li><li>Refine by state or county using the select on map <img src='${iconMap}' alt='Select Bounding Box'> or select from list <img src='${iconList}' alt='Select Bounding Box'> tools</li> </ol></li><li>Set the period of interest</li><li>Expand the Plot Bundle Download panel at the bottom to select the plots to download.</li></ol></div>`,
        },
        {
          name: 'cTransparency',
          import: 'js.tools.shared.cTransparency.cTransparency',
          add: false,
          height: 100,
          width: '90%',
        },
      ],
      toolbar: {
        position: 'top',
        overflowMenu: true,
        items: [
          {
            name: 'cRegionTool',
            add: false,
            width: 200,
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
        overflowMenu: false,
        style: 'padding: 0 0 0 5px;',
        items: [
          {
            name: 'cToolGroupPanel',
            import: 'js.tools.shared.cToolGroupPanel.cToolGroupPanel',
            add: true,
            width: 150,
            height: 80,
            label: '<div>Step 1</div><div>Region Selector</div>',
            blocks: [
              {
                name: 'cRegionTool',
                import: 'js.tools.lidar.cRegionTool.cRegionTool',
                add: true,
                width: 130,
                layers: [
                  {
                    id: 'lidar_plots',
                    type: 'overlay',
                  },
                ],
              },
            ],
          },
          {
            name: 'cSeparator',
            import: 'js.tools.shared.cSeparator.cSeparator',
            add: true,
            height: 70,
            style: 'border-left-color: #157fcc;',
          },
          {
            name: 'cToolGroupPanel',
            import: 'js.tools.shared.cToolGroupPanel.cToolGroupPanel',
            add: true,
            width: 160,
            height: 80,
            label: '<div>Step 2</div><div>Area Selector</div>',
            blocks: [
              {
                name: 'cSelectBBOXTool',
                import: 'js.tools.shared.cSelectBBOXTool.cSelectBBOXTool',
                title: '',
                add: true,
                cssClass: '',
                tooltip: 'Select Bounding Box',
                layers: [
                  {
                    id: 'lidar_plots',
                    type: 'overlay',
                  },
                ],
              },
              {
                name: 'cSelectRegionTool',
                import: 'js.tools.lidar.cSelectRegionTool.cSelectRegionTool',
                title: '',
                add: true,
                cssClass: '',
                tooltip: 'Select on Map',
                layers: [
                  {
                    id: 'lidar_plots',
                    type: 'overlay',
                  },
                  {
                    id: 'states',
                    type: 'parent',
                    loadAllFeatures: true,
                    featureInfo: [
                      {
                        displayName: 'State',
                        propertyName: 'name',
                        type: 'display',
                      },
                      {
                        displayName: 'State FIPS',
                        propertyName: 'statefp',
                        type: 'id',
                      },
                    ],
                  },
                  {
                    id: 'counties',
                    type: 'child',
                    loadAllFeatures: true,
                    featureInfo: [
                      {
                        displayName: 'County',
                        propertyName: 'name',
                        type: 'display',
                      },
                      {
                        displayName: 'Fips Code',
                        propertyName: 'geoid',
                        type: 'id',
                      },
                    ],
                  },
                  {
                    id: 'protectedAreas',
                    type: 'child',
                    loadAllFeatures: true,
                    featureInfo: [
                      {
                        displayName: 'Protected Area',
                        propertyName: 'label',
                        type: 'display',
                      },
                      {
                        displayName: 'Id',
                        propertyName: 'uniqname',
                        type: 'id',
                      },
                    ],
                  },
                ],
                items: [
                  {
                    name: 'cSelectRegionToolRadioGroup',
                    import: 'js.tools.shared.cSelectRegionToolRadioGroup.cSelectRegionToolRadioGroup',
                    add: true,
                    blocks: [
                      {
                        name: 'cLayerRadioButtons',
                        import: 'js.tools.shared.cLayerRadioButtons.cLayerRadioButtons',
                        add: true,
                        layers: [
                          {
                            id: 'states',
                          },
                          {
                            id: 'counties',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                name: 'cRegionSelectorMenu',
                import: 'js.tools.shared.cRegionSelectorMenu.cRegionSelectorMenu',
                title: '',
                add: true,
                width: 45,
                cssClass: '',
                tooltip: 'Select from List',
                items: [
                  {
                    name: 'cStateTool',
                    import: 'js.tools.lidar.cStateTool.cStateTool',
                    add: true,
                    layers: [
                      {
                        id: 'states',
                        type: 'boundary',
                        featureInfo: [
                          {
                            displayName: 'State',
                            propertyName: 'name',
                            type: 'display',
                          },
                          {
                            displayName: 'State FIPS',
                            propertyName: 'statefp',
                            type: 'id',
                          },
                        ],
                      },
                      {
                        id: 'lidar_plots',
                        type: 'overlay',
                      },
                    ],
                  },
                  {
                    block: 'center',
                    name: 'cSelectRegionMenuRadioGroup',
                    import: 'js.tools.shared.cSelectRegionMenuRadioGroup.cSelectRegionMenuRadioGroup',
                    add: true,
                    blocks: [
                      {
                        name: 'cLayerRadioButtons',
                        import: 'js.tools.shared.cLayerRadioButtons.cLayerRadioButtons',
                        add: true,
                        layers: [
                          {
                            id: 'counties',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: 'cSubStateTool',
                    import: 'js.tools.lidar.cSubStateTool.cSubStateTool',
                    add: true,
                    layers: [
                      {
                        id: 'states',
                        type: 'parentBoundary',
                        featureInfo: [
                          {
                            displayName: 'State',
                            propertyName: 'name',
                            type: 'display',
                          },
                          {
                            displayName: 'State FIPS',
                            propertyName: 'statefp',
                            type: 'id',
                          },
                        ],
                      },
                      {
                        id: 'counties',
                        type: 'childBoundary',
                        featureInfo: [
                          {
                            displayName: 'County',
                            propertyName: 'name',
                            type: 'display',
                          },
                          {
                            displayName: 'FIPS Code',
                            propertyName: 'geoid',
                            type: 'id',
                          },
                        ],
                      },
                      {
                        id: 'lidar_plots',
                        type: 'overlay',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: 'cSeparator',
            import: 'js.tools.shared.cSeparator.cSeparator',
            add: true,
            height: 70,
            style: 'border-left-color: #157fcc;',
          },
          {
            name: 'cToolGroupPanel',
            import: 'js.tools.shared.cToolGroupPanel.cToolGroupPanel',
            add: true,
            width: 200,
            height: 80,
            label: '<div>Step 3</div><div>Date Range</div>',
            blocks: [
              {
                name: 'cSliderTool',
                import: 'js.tools.lidar.cSliderTool.cSliderTool',
                title: '',
                add: true,
                cssClass: '',
                height: 15,
                width: 150,
                initialValues: [2021, 2022],
                minValue: 2021,
                maxValue: 2022,
                layers: [
                  {
                    id: 'lidar_plots',
                    featureInfo: [
                      {
                        displayName: 'Year',
                        propertyName: 'Year',
                        type: 'id',
                        dataType: 'long',
                        format: '{yyyy}',
                        columnWidth: 100,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: 'cSeparator',
            import: 'js.tools.shared.cSeparator.cSeparator',
            add: true,
            height: 70,
            style: 'border-left-color: #157fcc;',
          },
          {
            name: 'cFeatureQueryDisplayPanel',
            import: 'js.tools.shared.cFeatureQueryDisplayPanel.cFeatureQueryDisplayPanel',
            add: true,
            width: 180,
            height: 80,
            label: '{count} Matching Plots',
            blocks: [
              {
                name: 'cQueryParamsDisplay',
                import: 'js.tools.lidar.cQueryParamsDisplay.cQueryParamsDisplay',
                add: true,
                width: '100%',
                height: 50,
              },
            ],
            layers: [
              {
                id: 'lidar_plots',
                featureInfo: [
                  {
                    propertyName: 'Site',
                    type: 'id',
                  },
                  {
                    propertyName: 'Plot',
                    type: 'id',
                  },
                  {
                    propertyName: 'Year',
                    type: 'id',
                  },
                  {
                    propertyName: 'Month',
                    type: 'id',
                  },
                  {
                    propertyName: 'Day',
                    type: 'id',
                  },
                ],
              },
            ],
          },
          {
            name: 'cSeparator',
            import: 'js.tools.shared.cSeparator.cSeparator',
            add: true,
            height: 70,
            style: 'border-left-color: #157fcc;',
          },
          {
            name: 'cResetQuery',
            import: 'js.tools.shared.cResetQuery.cResetQuery',
            add: true,
            tooltip: 'Reset Query',
          },
        ],
      },
      blocks: [
        {
          name: 'cMapPanel',
          import: 'js.tools.shared.cMapPanel.cMapPanel',
          add: true,
          addScaleLine: false,
          interactions: ['pan', 'zoom'],
          mouseCoordinates: {
            show: true,
            projection: 'EPSG:4326',
          },
        },
      ],
    },
    {
      block: 'bottom',
      collapsible: true,
      collapsed: true,
      add: true,
      title: 'Plot Bundle Downloads',
      height: 300,
      toolbar: {
        position: 'top',
        overflowMenu: true,
        items: [
          {
            name: 'cDownloadBtn',
            import: 'js.tools.lidar.cDownloadBtn.cDownloadBtn',
            add: true,
            text: 'Download {count} Plots',
            url: '../downloads/addQueue.php',
            width: 325,
            layers: [
              {
                id: 'lidar_plots',
                featureInfo: [
                  {
                    propertyName: 'gid',
                    type: 'id',
                  },
                  {
                    propertyName: 'Site',
                    type: 'name',
                  },
                  {
                    propertyName: 'Plot',
                    type: 'name',
                  },
                  {
                    propertyName: 'Year',
                    type: 'name',
                  },
                  {
                    propertyName: 'Month',
                    type: 'name',
                  },
                  {
                    propertyName: 'Day',
                    type: 'name',
                  },
                ],
              },
            ],
          },
          {
            name: 'cSpacer',
            import: 'js.tools.shared.cSpacer.cSpacer',
            add: true,
          },
          {
            name: 'cFeatureInfoTableLabel',
            add: false,
            import: 'js.tools.lidar.cFeatureInfoTableLabel.cFeatureInfoTableLabel',
            label: 'Loading...',
            style: {
              fontWeight: 'bold',
              marginTop: 7,
              marginBottom: 5,
              marginRight: 10,
            },
          },
        ],
      },
      blocks: [
        {
          name: 'cFeatureInfoTable',
          import: 'js.tools.shared.cFeatureInfoTable.cFeatureInfoTable',
          height: 225,
          add: true,
          recordsPerPageOptions: [50, 100, 200, 500],
          layers: [
            {
              id: 'lidar_plots',
              featureInfo: [
                {
                  displayName: 'Id',
                  propertyName: 'gid',
                  type: 'id',
                  dataType: 'string',
                  columnWidth: 50,
                },
                {
                  displayName: 'Site',
                  propertyName: 'Site',
                  type: 'name',
                  dataType: 'string',
                  columnWidth: 100,
                },
                {
                  displayName: 'Plot Number',
                  propertyName: 'Plot',
                  type: 'name',
                  dataType: 'string',
                  columnWidth: 100,
                },
                {
                  displayName: 'Year',
                  propertyName: 'Year',
                  type: 'display',
                  columnWidth: 70,
                },
                {
                  displayName: 'Month',
                  propertyName: 'Month',
                  type: 'display',
                  columnWidth: 70,
                },
                {
                  displayName: 'Day',
                  propertyName: 'Day',
                  type: 'display',
                  columnWidth: 50,
                },
                {
                  displayName: 'Trees Number',
                  propertyName: 'TreesN',
                  type: 'display',
                  dataType: 'string',
                  columnWidth: 110,
                },
                {
                  displayName: 'MeanTH',
                  propertyName: 'MeanTH',
                  type: 'display',
                  dataType: 'string',
                  columnWidth: 80,
                },
                {
                  displayName: 'MaxTH',
                  propertyName: 'MaxTH',
                  type: 'display',
                  dataType: 'string',
                  columnWidth: 70,
                },
                {
                  displayName: 'MDBH',
                  propertyName: 'MDBH',
                  type: 'display',
                  dataType: 'string',
                  columnWidth: 70,
                },
                {
                  displayName: 'Basal Area',
                  propertyName: 'Basalarea',
                  type: 'display',
                  formatNumber: true,
                  dataType: 'integer',
                  columnWidth: 100,
                },
                {
                  displayName: 'CBH',
                  propertyName: 'CBH',
                  type: 'display',
                  formatNumber: true,
                  dataType: 'integer',
                  columnWidth: 50,
                },
                {
                  displayName: 'oneHF',
                  propertyName: 'oneHF',
                  type: 'display',
                  formatNumber: true,
                  dataType: 'integer',
                  columnWidth: 70,
                },
                {
                  displayName: 'tenHF',
                  propertyName: 'tenHF',
                  type: 'display',
                  formatNumber: true,
                  dataType: 'integer',
                  columnWidth: 70,
                },
                {
                  displayName: 'hunHF',
                  propertyName: 'hunHF',
                  type: 'display',
                  formatNumber: true,
                  dataType: 'integer',
                  columnWidth: 70,
                },
                {
                  displayName: 'thoHF',
                  propertyName: 'thoHF',
                  type: 'display',
                  formatNumber: true,
                  dataType: 'integer',
                  columnWidth: 70,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  useGoogleAnalytics: {
    add: true,
    onlyLoadIfHostname: 'earlywarning.usgs.gov',
    location: 'configs/google-analytics.js',
  },
  host: 'earlywarning.usgs.gov',
};
