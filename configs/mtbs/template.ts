import mtbsLogo from '../../assets/images/mtbs/MTBS-logo-bk.png';
import mtbsUSGSLogo from '../../assets/images/mtbs/USGS.png';
import doiLogo from '../../assets/images/mtbs/DOIlogo.png';
import fsShieldLogo from '../../assets/images/mtbs/FSshield.gif';
import iconBbox from '../../assets/images/mtbs/icon-bbox.png';
import iconMap from '../../assets/images/mtbs/icon-map.png';
import iconList from '../../assets/images/mtbs/icon-list.png';

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
      content: `<div id='header-logo-left'><a href='https://www.mtbs.gov' target='_blank'><img src='${mtbsLogo}'></a></div><div id='header-logo-right'><img src='${mtbsUSGSLogo}'><img src='${fsShieldLogo}'><img src='${doiLogo}'></div><h1 class='main'>Interactive Viewer - Monitoring Trends in Burn Severity </h1>`,
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
              import: 'js.tools.mtbs.cDefaultToc.cDefaultToc',
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
          content: `<div class='help-panel'><h3>Fire Data Download Instructions</h3><ol><li>Select a region</li><li>Select area of interest <ol><li>Select bounding box area <img src='${iconBbox}' alt='Select Bounding Box'></li><li>Refine by state, county, or watershed using the select on map <img src='${iconMap}' alt='Select Bounding Box'> or select from list <img src='${iconList}' alt='Select Bounding Box'> tools</li> </ol></li><li>Set the period of interest</li><li>Filter by fire type if desired</li><li>Expand the Fire Bundle Download panel at the bottom to select the fires to download.</li></ol></div>`,
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
                import: 'js.tools.mtbs.cRegionTool.cRegionTool',
                add: true,
                width: 130,
                layers: [
                  {
                    id: 'firePolygons',
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
                    id: 'firePolygons',
                    type: 'overlay',
                  },
                ],
              },
              {
                name: 'cSelectRegionTool',
                import: 'js.tools.mtbs.cSelectRegionTool.cSelectRegionTool',
                title: '',
                add: true,
                cssClass: '',
                tooltip: 'Select on Map',
                layers: [
                  {
                    id: 'firePolygons',
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
                    id: 'watersheds',
                    type: 'child',
                    loadAllFeatures: false,
                    featureInfo: [
                      {
                        displayName: 'Watershed',
                        propertyName: 'name',
                        type: 'display',
                      },
                      {
                        displayName: 'Watershed Id',
                        propertyName: 'globalid',
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
                          {
                            id: 'watersheds',
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
                    import: 'js.tools.mtbs.cStateTool.cStateTool',
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
                        id: 'firePolygons',
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
                          {
                            id: 'watersheds',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: 'cSubStateTool',
                    import: 'js.tools.mtbs.cSubStateTool.cSubStateTool',
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
                        id: 'watersheds',
                        type: 'childBoundary',
                        featureInfo: [
                          {
                            displayName: 'Watershed',
                            propertyName: 'name',
                            type: 'display',
                          },
                          {
                            displayName: 'Id',
                            propertyName: 'globalid',
                            type: 'id',
                          },
                        ],
                      },
                      {
                        id: 'firePolygons',
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
            label: '<div>Step 3</div><div>Date Range (1984-2020)</div>',
            blocks: [
              {
                name: 'cSliderTool',
                import: 'js.tools.mtbs.cSliderTool.cSliderTool',
                title: '',
                add: true,
                cssClass: '',
                height: 15,
                width: 150,
                initialValues: [2019, 2021],
                minValue: 1984,
                maxValue: 2021,
                layers: [
                  {
                    id: 'firePolygons',
                    featureInfo: [
                      {
                        displayName: 'ig_date',
                        propertyName: 'ig_date',
                        type: 'id',
                        dataType: 'date',
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
            name: 'cToolGroupPanel',
            import: 'js.tools.shared.cToolGroupPanel.cToolGroupPanel',
            add: true,
            width: 150,
            height: 80,
            label: '<div>Step 4</div><div>Filter by fire type </div>',
            blocks: [
              {
                name: 'cFireTypeTool',
                import: 'js.tools.mtbs.cFireTypeTool.cFireTypeTool',
                width: 130,
                add: true,
                emptyText: 'Select Fire Type',
                layers: [
                  {
                    id: 'firePolygons',
                    type: 'boundary',
                    featureInfo: [
                      {
                        displayName: 'Fire Type',
                        propertyName: 'incid_type',
                        type: 'display',
                      },
                      {
                        displayName: 'Fire Type',
                        propertyName: 'incid_type',
                        type: 'id',
                      },
                    ],
                  },
                  {
                    id: 'firePolygons',
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
            name: 'cFeatureQueryDisplayPanel',
            import: 'js.tools.shared.cFeatureQueryDisplayPanel.cFeatureQueryDisplayPanel',
            add: true,
            width: 180,
            height: 80,
            label: '{count} Matching Fires',
            blocks: [
              {
                name: 'cQueryParamsDisplay',
                import: 'js.tools.mtbs.cQueryParamsDisplay.cQueryParamsDisplay',
                add: true,
                width: '100%',
                height: 50,
              },
            ],
            layers: [
              {
                id: 'firePolygons',
                featureInfo: [
                  {
                    propertyName: 'event_id',
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
      title: 'Fire Bundle Downloads',
      height: 300,
      toolbar: {
        position: 'top',
        overflowMenu: true,
        items: [
          {
            name: 'cDownloadBtn',
            import: 'js.tools.shared.cDownloadBtn.cDownloadBtn',
            add: true,
            text: 'Download {count} Fires',
            url: 'https://edcintl.cr.usgs.gov/mtbs_remote_zip_servlet/ZipServlet',
            layers: [
              {
                id: 'firePolygons',
                downloadPath: 'mtbs/{ig_date}/{event_id}.zip',
                featureInfo: [
                  {
                    propertyName: 'event_id',
                    type: 'id',
                  },
                  {
                    propertyName: 'ig_date',
                    type: 'display',
                    dataType: 'date',
                    format: '{yyyy}',
                    columnWidth: 100,
                  },
                ],
              },
            ],
          },
          {
            name: 'cExternalLinkButtonTool',
            import: 'js.tools.shared.cExternalLinkButtonTool.cExternalLinkButtonTool',
            add: true,
            url: '/direct-download',
            tooltip: 'National Data Products',
            text: 'National Data Products',
            width: 150,
          },
          {
            name: 'cSpacer',
            import: 'js.tools.shared.cSpacer.cSpacer',
            add: true,
          },
          {
            name: 'cFeatureInfoTableLabel',
            add: false,
            import: 'js.tools.mtbs.cFeatureInfoTableLabel.cFeatureInfoTableLabel',
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
              id: 'firePolygons',
              featureInfo: [
                {
                  displayName: 'Fire Name',
                  propertyName: 'incid_name',
                  type: 'name',
                  dataType: 'string',
                  columnWidth: 250,
                },
                {
                  displayName: 'Acres',
                  propertyName: 'burnbndac',
                  type: 'display',
                  formatNumber: true,
                  dataType: 'integer',
                  columnWidth: 70,
                },
                {
                  displayName: 'Ignition Date',
                  propertyName: 'ig_date',
                  type: 'display',
                  dataType: 'date',
                  format: '{yyyy}-{mm}-{dd}',
                  columnWidth: 100,
                },
                {
                  displayName: 'Fire Type',
                  propertyName: 'incid_type',
                  type: 'display',
                  dataType: 'string',
                  columnWidth: 130,
                },
                {
                  displayName: 'Fire Id',
                  propertyName: 'event_id',
                  type: 'id',
                  dataType: 'string',
                  columnWidth: 180,
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
