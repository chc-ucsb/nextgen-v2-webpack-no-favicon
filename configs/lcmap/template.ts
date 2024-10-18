import logo from '../../assets/images/logo.png';
import lcmapOverview from '../../assets/images/lcmap/thumbnails/lcmapOverview.png';

export const template = {
  theme: 'ExtJSNeptune',
  cssFallback: true,
  analytics: {
    matomo: {
      baseUrl: '//edcintl.cr.usgs.gov/piwik/',
      id: '18',
    },
    google: {
      id: 'UA-175219423-1',
    },
  },
  blocks: [
    {
      block: 'top',
      name: 'cHeader',
      import: 'js.tools.shared.cHeader.cHeader',
      title: 'LCMAP Viewer',
      add: true,
      width: 'auto',
      height: 70,
      cssClass: '',
      collapsible: true,
      content: `<header id="navbar" class="header-nav" role="banner"><div class="tmp-container"><div class="header-search"><a class="logo-header" href="https://www.usgs.gov/" title="Home"><img class="img" src="${logo}" alt="Home" /></a><span class= "x-panel-header-text-container-default" style='float: left; margin-top: 1em; margin-left: 1%; overflow: visible; font-size: 30px'>LCMAP Viewer</b></span><form action="https://www.usgs.gov/science-explorer-results" method="GET" id="search-box"><div class="fa-wrapper"><label for="se_search" class="only">Search</label><input id="se_search" type="search" name="es" placeholder="Search"><button class="fa fa-search" type="submit"><span class="only">Search</span></button></div></form></div></div></header>`,
    },
    {
      block: 'left',
      name: 'cTOCDesktopLike',
      import: 'js.tools.shared.cTOCDesktopLike.cTOCDesktopLike',
      add: false,
      width: 370,
      height: 'auto',
      title: 'TOC',
      blocks: [
        {
          block: 'top',
          name: 'cTocContainer',
          title: 'LCMAP Datasets (Double click to open)',
          import: 'js.tools.shared.cTocContainer.cTocContainer',
          width: '100%',
          height: 'auto',
          add: true,
          blocks: [
            {
              name: 'cDefaultToc',
              import: 'js.tools.shared.cDefaultToc.cDefaultToc',
              add: true,
              width: '100%',
              height: 'auto',
              titleLength: 20,
            },
          ],
        },
        {
          name: 'cTransparency',
          import: 'js.tools.shared.cTransparency.cTransparency',
          add: true,
          height: 100,
          width: '90%',
        },
      ],
    },
    {
      block: 'left',
      name: 'cToc',
      import: 'js.tools.shared.cToc.cToc',
      add: true,
      width: 400,
      height: 'auto',
      title: 'TOC',
      collapsible: true,
      blocks: [
        {
          block: 'center',
          name: 'cTocTabPanel',
          import: 'js.tools.shared.cTocTabPanel.cTocTabPanel',
          add: true,
          blocks: [
            {
              add: true,
              title: 'Contents',
              name: 'cTocContentsTab',
              import: 'js.tools.shared.cTocContentsTab.cTocContentsTab',
              tooltip: 'View Contents',
              blocks: [
                {
                  block: 'center',
                  add: true,
                  width: '100%',
                  height: '60%',
                  title: 'LCMAP Datasets (Double click to open)',
                  name: 'cTocContainer',
                  import: 'js.tools.shared.cTocContainer.cTocContainer',
                  blocks: [
                    {
                      block: 'center',
                      name: 'cDatasetToc',
                      import: 'js.tools.shared.cDatasetToc.cDatasetToc',
                      add: true,
                      toolbar: {
                        position: 'top',
                        overflowMenu: false,
                        height: 'auto',
                        items: [
                          {
                            name: 'cRegionTool',
                            import: 'js.tools.shared.cRegionTool.cRegionTool',
                            add: true,
                            width: 200,
                            title: true,
                            sort: 'asc',
                          },
                          {
                            name: 'cExternalLinkButtonTool',
                            import: 'js.tools.shared.cExternalLinkButtonTool.cExternalLinkButtonTool',
                            add: true,
                            url: 'https://www.usgs.gov/special-topics/lcmap',
                            tooltip: 'LCMAP - Home',
                            icon: 'fa-home',
                            width: 30,
                          },
                          {
                            name: 'cPopupButtonTool',
                            import: 'js.tools.quickdri.cPopupButtonTool.cPopupButtonTool',
                            add: true,
                            popupTitle: 'LCMAP Product Help',
                            popupBody: `<h3>
                            The following links provide additional information for the 10 LCMAP products:
                          </h3>
                          <ul>
                            <li>
                              <a 
                                href="https://www.usgs.gov/special-topics/lcmap" target="_blank">LCMAP Website
                              </a>
                            </li>
                            <li>
                              <a 
                                href="https://www.usgs.gov/special-topics/lcmap/collection-13-conus-science-products" target="_blank">LCMAP CONUS Collection 1.3
                              </a>
                            </li>
                            <li>
                              <a 
                                href="https://www.usgs.gov/media/files/lcmap-collection-13-science-product-guide" target="_blank">LCMAP CONUS Collection 1.3 Science Product Guide
                              </a>
                            </li>
                            <li>
                              <a 
                                href="https://www.usgs.gov/special-topics/lcmap/collection-1-hawaii-science-products" target="_blank">LCMAP HI Collection 1.0
                              </a>
                            </li>
                            <li>
                              <a 
                                href="https://www.usgs.gov/media/files/lcmap-hawaii-collection-1-science-product-guide" target="_blank">LCMAP HI Collection 1.0 Science Product Guide
                              </a>
                            </li>
                            <li>
                              <a
                                href = "https://www.usgs.gov/media/files/lcmap-web-viewer-quick-guide" target="_blank"> LCMAP Web Viewer Quick Guide
                              </a>
                            </li>
                          </ul>
                              <a 
                                href=" https://www.usgs.gov/media/videos/lcmap-revolutionizing-remote-sensing" target="_blank"><img class="thumbnailOverview" src="${lcmapOverview}" />
                              </a>`,
                            popupHeight: 600,
                            popupWidth: 500,
                            showOnFirstLoad: false,
                            tooltip: 'Additional Information',
                            text: '?',
                            width: 30,
                          },
                          {
                            name: 'cPopupButtonTool',
                            add: true,
                            import: 'js.tools.quickdri.cPopupButtonTool.cPopupButtonTool',
                            popupTitle: 'Notice to users',
                            popupBody: `LCMAP Conterminous United States (CONUS) Collection 1.3 products are available on 
                            <a href="https://earthexplorer.usgs.gov/">EarthExplorer</a>, the
                            <a href="https://eros.usgs.gov/lcmap/viewer/index.html">LCMAP Web Viewer</a>, and the
                            <a href="https://eros.usgs.gov/lcmap/apps/data-downloads">LCMAP Mosaic Download website</a> as of August 2022. CONUS Collection 1.3 includes LCMAP products for 1985-2021. Previous LCMAP collections will remain available on 
                            <a href="https://earthexplorer.usgs.gov/">EarthExplorer</a>; however, users are encouraged to use the most recent release. LCMAP Hawaii (HI) Collection 1.0 products are also available on 
                            <a href="https://earthexplorer.usgs.gov/">EarthExplorer</a>, the 
                            <a href="https://eros.usgs.gov/lcmap/viewer/index.html">LCMAP Web Viewer</a>, and the	
                            <a href="https://eros.usgs.gov/lcmap/apps/data-downloads">LCMAP Mosaic Download website</a> as of January 2022. HI Collection 1.0 includes LCMAP products for 2000-2020. Check out the
                            <a href="https://www.usgs.gov/media/files/lcmap-web-viewer-quick-guide">LCMAP Web Viewer Quick Guide</a> to learn how to get started visualizing and downloading data.`,
                            popupHeight: 350,
                            tooltip: 'Notice',
                            alwaysShow: true,
                            useOkButtons: true,
                            icon: 'fa-exclamation-triangle',
                            width: 30,
                          },
                        ],
                      },
                    },
                  ],
                },
                {
                  block: 'bottom',
                  add: true,
                  width: '100%',
                  height: '60%',
                  title: 'Layers',
                  name: 'cTocContainer',
                  import: 'js.tools.shared.cTocContainer.cTocContainer',
                  blocks: [
                    {
                      block: 'center',
                      name: 'cLayersToc',
                      import: 'js.tools.shared.cLayersToc.cLayersToc',
                      add: true,
                      titleLength: 60,
                      toolbar: {
                        position: 'top',
                        overflowMenu: false,
                        items: [
                          {
                            name: 'cAddWMSLayerTool',
                            import: 'js.tools.shared.cAddWMSLayerTool.cAddWMSLayerTool',
                            add: true,
                            tooltip: 'Add WMS Layer',
                          },
                          {
                            name: 'cRemoveWMSLayerTool',
                            import: 'js.tools.shared.cRemoveWMSLayerTool.cRemoveWMSLayerTool',
                            add: true,
                            tooltip: 'Remove WMS Layer',
                          },
                        ],
                      },
                    },
                    {
                      name: 'cTransparency',
                      import: 'js.tools.shared.cTransparency.cTransparency',
                      add: true,
                      width: '90%',
                      height: '5%',
                      fieldLabel: 'Transparency (Highlighted Layer)',
                    },
                  ],
                },
              ],
            },
            {
              add: true,
              title: 'Legend',
              name: 'cTocLegendTab',
              import: 'js.tools.shared.cTocLegendTab.cTocLegendTab',
              tooltip: 'View Legend',
            },
          ],
        },
      ],
    },
    {
      block: 'center',
      blocks: [
        {
          block: 'relative',
          name: 'cAddWMSLayerForm',
          import: 'js.tools.shared.cAddWMSLayerForm.cAddWMSLayerForm',
          add: true,
          width: 350,
          height: 105,
          x: 390,
          y: 550,
          title: 'Add WMS Layers',
        },
        {
          block: 'relative',
          name: 'cRemoveWMSLayerForm',
          import: 'js.tools.shared.cRemoveWMSLayerForm.cRemoveWMSLayerForm',
          add: true,
          width: 350,
          height: 105,
          x: 390,
          y: 550,
          title: 'Remove WMS Layers',
        },
        {
          block: 'relative',
          name: 'cMapWindow',
          import: 'js.tools.shared.cMapWindow.cMapWindow',
          add: true,
          width: 580,
          height: 650,
          x: 410,
          y: 90,
          collapsible: true,
          blocks: [
            // We add the Ol-Ext tools here and reference them below in MapPanel when describing the layout
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
              name: 'cRevertExtentTool_olext',
              import: 'js.tools.shared.cRevertExtentTool.cRevertExtentTool_olext',
              add: true,
            },
            {
              name: 'cIdentifyTool_olext',
              import: 'js.tools.lcmap.cIdentifyTool.cIdentifyTool_olext',
              pressed: true,
              add: true,
            },
            {
              name: 'cDataDownloadBtn',
              add: true,
              import: 'js.tools.shared.cDataDownloadBtn.cDataDownloadBtn',
              tooltip: 'Data Download Tool',
              olExt: true,
            },
            {
              name: 'cDatePickerTool_olext',
              import: 'js.tools.shared.cDatePickerTool.cDatePickerTool_olext',
              add: true,
              altTitle: 'Select Year',
            },
            {
              name: 'cDatasetExplorerTool_olext',
              import: 'js.tools.shared.cDatasetExplorerTool.cDatasetExplorerTool_olext',
              add: true,
            },
            {
              name: 'cMapLegend_olext',
              import: 'js.tools.shared.cMapLegend.cMapLegend_olext',
              pressed: false,
              add: true,
            },
            {
              name: 'cMapDownloadsTool_olext',
              import: 'js.tools.shared.cMapDownloadsTool.cMapDownloadsTool_olext',
              add: true,
            },
            {
              block: 'top',
              name: 'cMapPanel',
              import: 'js.tools.shared.cMapPanel.cMapPanel',
              add: true,
              interactions: ['pan', 'zoom'],
              controls: [
                {
                  name: 'toolbar',
                  position: 'top-left',
                  controls: [
                    {
                      name: 'notification',
                      options: {
                        active: false,
                        className: 'datePopup',
                      },
                      controls: ['date-picker'],
                    },
                    {
                      name: 'toolbar',
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
                      options: {
                        toggleOne: true,
                        group: true,
                      },
                      controls: ['identify', 'download-tool'],
                    },
                  ],
                },
                'legend',
                // {
                //   name: 'overlay',
                //   options: {
                //     header: '',
                //     width: '18em',
                //   },
                //   controls: ['date-picker'],
                // },
              ],
              mouseCoordinates: {
                show: true,
                projection: 'EPSG:4326',
              },
              blocks: [],
            },
          ],
        },
      ],
    },
    {
      block: 'right',
      name: 'cTools',
      import: 'js.tools.shared.cTools.cTools',
      add: true,
      width: 250,
      height: 'auto',
      collapsible: true,
      collapsed: true,
      title: 'Tools',
      blocks: [
        {
          name: 'cDataDownload',
          add: true,
          collapsible: true,
          collapsed: true,
          import: 'js.tools.shared.cDataDownload.cDataDownload',
          addQueueLocation: '../downloads/addQueue.php',
          redirectButton: false,
          showSlider: true,
          showCombo: false,
          dateSelection: 'yearSliders',
          redirectText: `<div class="x-toolbar-text x-toolbar-text-default" id="redirectDownloadText"><b>NOTICE:</b><br> The extent of your download box<br>is too large. (Greater than 350000<br>square km).
          <br><br>Please select a smaller area of<br>interest or go to:<br><a href="https://earthexplorer.usgs.gov/" target="_blank">https://earthexplorer.usgs.gov/</a><br>to download a complete<br>dataset.</div>`,
          maxArea: 350000,
          noBoxText:
            'A box has not been drawn yet. <br><br> To draw one, please select the <br>Data Download tool <i class="fa fa-arrow-circle-o-down"></i><br>in the map window toolbar.',
        },
        {
          name: 'cSpatialLocking',
          import: 'js.tools.shared.cSpatialLocking.cSpatialLocking',
          add: true,
          title: 'Spatial Locking Tool',
          height: 250,
          collapsible: true,
          cssClass: '',
        },
        {
          name: 'cArrangeWindows',
          import: 'js.tools.shared.cArrangeWindows.cArrangeWindows',
          add: true,
          title: 'Arrange Windows Tool',
          height: 250,
          collapsible: true,
          cssClass: '',
        },
      ],
    },
    {
      block: 'bottom',
      name: 'cFooter',
      import: 'js.tools.shared.cFooter.cFooter',
      add: true,
      width: 'auto',
      height: 94,
      cssClass: '',
      collapsible: false,
      collapsed: false,
      resizable: false,
      content:
        '<footer class="footer"><div class="tmp-container"><div class="footer-doi"><ul class="menu nav"><li class="first leaf menu-links menu-level-1"><a href="https://www.doi.gov/privacy">DOI Privacy Policy</a></li><li class="leaf menu-links menu-level-1"><a href="https://www.usgs.gov/policies-and-notices">Legal</a></li><li class="leaf menu-links menu-level-1"><a href="https://www.usgs.gov/accessibility-and-us-geological-survey">Accessibility</a></li><li class="leaf menu-links menu-level-1"><a href="https://www.usgs.gov/sitemap.html">Site Map</a></li><li class="last leaf menu-links menu-level-1"><a href="https://answers.usgs.gov/">Contact USGS</a></li></ul></div><hr><div class="footer-doi"><ul class="menu nav"><li class="first leaf menu-links menu-level-1"><a href="https://www.doi.gov/">U.S. Department of the Interior</a></li><li class="leaf menu-links menu-level-1"><a href="https://www.doioig.gov/">DOI Inspector General</a></li><li class="leaf menu-links menu-level-1"><a href="https://www.whitehouse.gov/">White House</a></li><li class="leaf menu-links menu-level-1"><a href="https://www.whitehouse.gov/omb/management/egov/">E-gov</a></li><li class="leaf menu-links menu-level-1"><a href="https://www.doi.gov/pmb/eeo/no-fear-act">No Fear Act</a></li><li class="last leaf menu-links menu-level-1"><a href="https://www.usgs.gov/foia">FOIA</a></li></ul></div><div class="footer-social-links"><ul class="social"><li class="follow">Follow</li><li class="twitter"><a href="https://twitter.com/usgs" target="_blank"><i class="fa fa-twitter-square"><span class="only">Twitter</span></i></a></li><li class="facebook"><a href="https://facebook.com/usgeologicalsurvey" target="_blank"><i class="fa fa-facebook-square"><span class="only">Facebook</span></i></a></li><li class="googleplus"><a href="https://plus.google.com/112624925658443863798/posts" target="_blank"><i class="fa fa-google-plus-square"><span class="only">Google+</span></i></a></li><li class="github"><a href="https://github.com/usgs" target="_blank"><i class="fa fa-github"><span class="only">GitHub</span></i></a></li><li class="flickr"><a href="https://flickr.com/usgeologicalsurvey" target="_blank"><i class="fa fa-flickr"><span class="only">Flickr</span></i></a></li><li class="youtube"><a href="http://youtube.com/usgs" target="_blank"><i class="fa fa-youtube-play"><span class="only">YouTube</span></i></a></li><li class="instagram"><a href="https://instagram.com/usgs" target="_blank"><i class="fa fa-instagram"><span class="only">Instagram</span></i></a></li></ul></div></div></footer>',
    },
  ],
  host: 'earlywarning.usgs.gov',
};
