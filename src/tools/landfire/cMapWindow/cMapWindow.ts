/* hideTitle is a blockConfig setting that will hide the title bar if set to true.
   If this parameter does not exist the title will be displayed  */
import { buildUrl, getBaseUrl, getRandomString, hashCode, objFromUrlQueryParams } from '../../../helpers/string';
import { getRegionWithRegionID } from '../../../utils';
import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict, ExtentType, LayerConfig } from '../../../@types';
import { transform } from 'ol/proj';

export const cMapWindow = {
  options: {
    events: ['click', 'move', 'activate', 'resize', 'collapse', 'expand', 'close', 'destroy', 'rendercomponent', 'overflowmenushow', 'layerchange'],
    requiredBlocks: ['cMapPanel'],
  },
  currentMapWindowId: null,
  createNewMapWindow: function (eventObject, callbackObject, postingObject) {
    var blueprint = callbackObject;

    var block = blueprint.createBlock();
    var renderedParent = block.getClosestRenderedParent();
    renderedParent.render();
    // if (renderedParent) renderedParent.render();
    // else block.render()

    var mapwindowID = block.extendedTool.layersConfigId;
    //can also use block.extendedTool.component.id

    if (mapwindowID !== globalThis.App.Layers.getConfigInstanceId()) {
      globalThis.App.Layers.setConfigInstanceId(mapwindowID);
    }

    globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED, block.extendedTool, block.extendedTool);
  },
  validateIfShouldBeDefocused: function (eventObject, callbackObject, postingObject) {
    var mapperWindow = callbackObject;
    var mapWindow = mapperWindow.component;

    if (mapperWindow.component.getId() != globalThis.App.Layers.getConfigInstanceId()) {
      if (!mapWindow.hasCls('deselected-window')) mapWindow.addCls('deselected-window');
    } else {
      if (mapWindow.hasCls('deselected-window')) mapWindow.removeCls('deselected-window');
    }
  },
  updateMapperLayersConfig: function (newLayerConfig, aMapWindow, postingObject) {
    if (globalThis.App.Layers.getConfigInstanceId() == aMapWindow.layersConfigId) {
      var mapPanelBlock = aMapWindow.owningBlock.getReferencedBlock('cMapPanel');
      var map = mapPanelBlock.component.map;

      globalThis.App.OpenLayers.updateMapLayerOpacitiesAndDisplayedLayersFromLayersConfig(newLayerConfig, map);

      var extWindow = aMapWindow.component;
      var mapWindowTitle = aMapWindow.getTitle(newLayerConfig);

      extWindow.setTitle(mapWindowTitle);

      globalThis.App.EventHandler.postEvent(
        globalThis.App.EventHandler.types.EVENT_MAPWINDOW_LAYER_CONFIGURATION_UPDATED,
        newLayerConfig,
        aMapWindow
      );
    }
  },
  initialized: false,
  init: function (blueprint) {
    if (globalThis.App.Tools.cMapWindow.initialized === false) {
      globalThis.App.EventHandler.registerCallbackForEvent(
        globalThis.App.EventHandler.types.EVENT_REQUESTING_NEW_MAP_WINDOW,
        blueprint.itemDefinition.createNewMapWindow,
        blueprint
      );

      globalThis.App.Tools.cMapWindow.initialized = true;
    }
  },
  createExtendedTool: function (owningBlock) {
    var layersConfigId = globalThis.App.Layers.getConfigInstanceId();
    var layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);

    var toggleGroupId = 'button-group-' + getRandomString(32, 36);

    var mapperWindow = {
      owningBlock: owningBlock,
      toggleGroupId: toggleGroupId,
      layersConfigId: layersConfigId,
      getTitle: function (layersConfig) {
        /* Don't display the title bar if hideTitle is set to true */
        if (owningBlock.blockConfig.hideTitle === true) {
          return null;
        }

        let folderToUse = [];

        const filterOnLayers = (layer: LayerConfig): boolean => {
          return layer.type === 'layer' && (layer.display === true || layer.mask === true);
        };

        const activeOverlayLayer = globalThis.App.Layers.query(layersConfig, filterOnLayers, ['overlays']);
        const activeBoundaryLayers = globalThis.App.Layers.query(layersConfig, filterOnLayers, ['boundaries']);

        if (activeOverlayLayer.length > 0) {
          folderToUse = layersConfig.overlays;
        } else if (activeBoundaryLayers.length > 0) {
          folderToUse = layersConfig.boundaries;
        }

        var mapWindowTitle = globalThis.App.Layers.getTopLayerTitle(folderToUse);

        // var regionFolder = globalThis.App.Layers.query(folderToUse, function (folder) {
        // if (folder.type === 'folder' && folder.hasOwnProperty('regionId')) {
        //     var displayedLayers = globalThis.App.Layers.query(folder.folder, {
        //     type: 'layer',
        //     display: true,
        //     loadOnly: false,
        //     mask: false,
        //     });
        //     if (displayedLayers.length > 0) return true;
        //     return false;
        //   }
        //   return false;
        // });

        var regionFolder = globalThis.App.Layers.query(
          layersConfig,
          function (folder) {
            if (folder.type === 'folder' && typeof folder.regionId !== 'undefined') {
              var displayedLayers = globalThis.App.Layers.query(folder.folder, {
                type: 'layer',
                display: true,
                loadOnly: false,
                mask: false,
              });

              if (displayedLayers.length > 0) return true;
              return false;
            }
            return false;
          },
          ['overlays', 'boundaries']
        );

        if (regionFolder.length > 0) {
          var regionId = regionFolder[0].regionId;
          var regionConfigs = getRegionWithRegionID(regionId);
          mapWindowTitle = regionConfigs.title + ' ' + mapWindowTitle;
        }

        this.title = mapWindowTitle;

        return mapWindowTitle;
      },
      setRegionExtent: function () {
        var mapPanelBlock = this.owningBlock.getReferencedBlock('cMapPanel');
        var map = mapPanelBlock.component.map;
        var layersConfig = globalThis.App.Layers.getLayersConfigById(this.layersConfigId);

        // Support for an 'extent' URL parameter
        // Skip setting the extent to a defined region, but instead zooming to an
        // extent given via the URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('extent')) {
          // set EPSG:4326 as default projection to expect the extent to be in
          // http://localhost:8080/?extent=-96.7573346978623,36.5797045105422,-91.0760196483712,41.9522486525273&srs=EPSG:4326
          let epsg = 'EPSG:4326';

          if (urlParams.has('srs')) {
            epsg = urlParams.get('srs');
          }

          // Parse the extent parameters
          const extent = urlParams
            .get('extent')
            .split(',')
            .map((str) => parseFloat(str));

          const minx = extent[0];
          const miny = extent[1];
          const maxx = extent[2];
          const maxy = extent[3];

          const minxy = [minx, miny];
          const maxxy = [maxx, maxy];

          // Convert to map projection
          const coordMinXY = transform(minxy, epsg, map.getView().getProjection().getCode());
          const coordMaxXY = transform(maxxy, epsg, map.getView().getProjection().getCode());

          const reprojectedBBOX: ExtentType = [coordMinXY[0], coordMinXY[1], coordMaxXY[0], coordMaxXY[1]];

          // update the map's extent
          // http://stackoverflow.com/questions/23682286/zoomtoextent-openlayers-3
          map.getView().fit(reprojectedBBOX, {
            size: map.getSize(),
          });
          return;
        }

        var regionFolders = globalThis.App.Layers.query(
          layersConfig,
          function (folder) {
            if (folder.type === 'folder' && typeof folder.regionId !== 'undefined') {
              var displayedLayers = globalThis.App.Layers.query(folder.folder, {
                type: 'layer',
                display: true,
              });

              if (displayedLayers.length > 0) return true;
              return false;
            }
            return false;
          },
          ['overlays', 'boundaries', 'baselayers']
        );

        if (regionFolders.length > 0) {
          var regions = [];
          for (let i = 0, len = regionFolders.length; i < len; i += 1) {
            var regionFolder = regionFolders[i];
            var regionId = regionFolder.regionId;
            if (regions.indexOf(regionId) === -1) regions.push(regionId);
          }

          for (let i = 0, len = regions.length; i < len; i += 1) {
            regions[i] = getRegionWithRegionID(regions[i]);
          }
          globalThis.App.OpenLayers.setExtentEncompassingSpecifiedRegionsForMap(map, regions);
        }
      },
    };

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
      owningBlock.itemDefinition.updateMapperLayersConfig,
      mapperWindow
    );

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED,
      owningBlock.itemDefinition.validateIfShouldBeDefocused,
      mapperWindow
    );

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_CREATED,
      owningBlock.itemDefinition.validateIfShouldBeDefocused,
      mapperWindow
    );

    return mapperWindow;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    var block = extendedTool.owningBlock.blockConfig;
    var position = block.block;
    var width = block.width;
    var height = block.height;
    var title = block.title;
    var content = block.content;
    var layersConfigId = extendedTool.layersConfigId;
    var layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
    var resizable = block.hasOwnProperty('resizable') ? block.resizable : true;

    var mapWindowConfig: Dict<any> = {
      extendedTool: extendedTool,
      resizable: resizable,
      width: width,
      height: height,
      id: layersConfigId,
      title: extendedTool.getTitle(layersConfig),
      hideTitle: typeof block.hideTitle !== 'undefined' ? block.hideTitle : false,
      layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start',
      },
      bodyStyle: 'padding:5px;',
      border: false,
      collapsible: typeof block.collapsible !== 'undefined' ? block.collapsible : false,
      collapsed: typeof block.collapsed !== 'undefined' ? block.collapsed : false,
      maximizable: true,
      items: items,
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

        move: function () {
          this.extendedTool.owningBlock.fire('move', this.extendedTool);
        },

        activate: function () {
          if (this.id !== globalThis.App.Layers.getConfigInstanceId()) {
            globalThis.App.Layers.setConfigInstanceId(this.id);

            // update Layers._granules with the instance of the new id
            globalThis.App.Layers._granules = globalThis.App.Layers.granuleInstances.get(this.id);

            globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED, this.extendedTool, this.extendedTool);
          }

          this.extendedTool.owningBlock.fire('activate', this.extendedTool);
        },
        beforeDestroy: function () {
          //skin.mapWindow.removeMapWindowInfoForMapWindowId(this.id);
          //this.extendedTool.owningBlock.itemDefinition.removeMapWindowInfoForMapWindowId(this.id);

          //-----------------------------
          //so the toc shows no layer selected
          //just turn off the layer
          //query returns by reference
          var allReferencedLayers = globalThis.App.Layers.query(this.extendedTool.mapWindowMapperLayersConfig, { type: 'layer' }, ['overlays']);

          for (var index in allReferencedLayers) {
            allReferencedLayers[index].display = false;
          }

          globalThis.App.EventHandler.removeAllCallbacksForObject(this.extendedTool);

          globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_MAPWINDOW_DESTROYED, this.extendedTool, this.extendedTool);

          this.extendedTool.owningBlock.fire('destroy');

          var currentId = this.id;
          this.zIndexManager.eachTopDown(function (component) {
            if (component.extendedTool && component.extendedTool.layersConfigId && component.id !== currentId) {
              component.setActive(true);
              return false;
            }
          });
        },
        resize: function (mapWindow, width, height) {
          globalThis.App.EventHandler.postEvent(
            globalThis.App.EventHandler.types.EVENT_MAPWINDOW_RESIZED,
            mapWindow.extendedTool,
            mapWindow.extendedTool
          );

          this.extendedTool.owningBlock.fire('resize', this.extendedTool);
        },
        afterrender: function (mapWindow) {
          mapWindow.extendedTool.component = mapWindow;
          mapWindow.extendedTool.owningBlock.component = mapWindow;
          mapWindow.extendedTool.owningBlock.rendered = true;
          if (mapWindow.extendedTool.component.header)
            mapWindow.extendedTool.component.header.tools.forEach((element) => {
              element.el.dom.title = element.type[0].toUpperCase() + element.type.split('-')[0].slice(1);
            });

          globalThis.App.EventHandler.postEvent(
            globalThis.App.EventHandler.types.EVENT_MAPWINDOW_CREATED,
            mapWindow.extendedTool,
            mapWindow.extendedTool
          );

          setTimeout(
            function (mapWindow) {
              mapWindow.extendedTool.setRegionExtent();
            },
            1,
            mapWindow
          );

          this.extendedTool.owningBlock.fire('rendercomponent', this.extendedTool);
        },
        close: function () {
          this.extendedTool.owningBlock.fire('close');
          this.extendedTool.owningBlock.remove();
        },
        click: {
          element: 'el',
          fn: () => {
            // Activate the window on any click inside it, but only trigger the event if it's a new window being clicked.
            if (layersConfigId !== globalThis.App.Layers.getConfigInstanceId())
              globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED, extendedTool, extendedTool);
          },
        },
      },
    };

    if (!extendedTool.owningBlock.blockConfig.toolbar) {
      return ExtJSPosition(mapWindowConfig, block);
    }

    if (extendedTool.owningBlock.blockConfig.toolbar.overflowMenu === true) {
      var toolbarConfigs = {
        enableOverflow: true,
        extendedTool: extendedTool,
        style: block.toolbar.style,
        listeners: {
          afterrender: function () {
            this.extendedTool.toolbar = this;
          },
          overflowchange: function (lastHiddenCount, hiddenCount, hiddenItems) {
            var overflowHandler = this.layout.overflowHandler;
            var menu = overflowHandler.menu;
            var menuBtn = menu.ownerButton;

            if (typeof menuBtn.hasBeenUpdated === 'undefined') {
              menuBtn.hasBeenUpdated = true;
              menuBtn.extendedTool = this.extendedTool;
              menuBtn.on('click', function () {
                var layersConfigId = this.extendedTool.layersConfigId;
                var layersConfig = globalThis.App.Layers.getLayersConfigById(layersConfigId);
                globalThis.App.Layers.setConfigInstanceId(layersConfigId);
              });
            }

            if (typeof menu.hasBeenUpdated === 'undefined') {
              menu.hasBeenUpdated = true;
              menu.extendedTool = this.extendedTool;
              menu.on('show', function () {
                this.extendedTool.component.setActive(true);
                this.focus();
                this.extendedTool.owningBlock.fire('overflowmenushow');
              });
            }
          },
        },
      };

      mapWindowConfig = addToolBarItems(block, mapWindowConfig, toolbar, toolbarConfigs);
    } else {
      mapWindowConfig = addToolBarItems(block, mapWindowConfig, toolbar);
    }

    return ExtJSPosition(mapWindowConfig, block);

    //how to set auto?
    //aMapWindow.extWindowConfig.width = 580;
    //aMapWindow.extWindowConfig.height = 650;

    //return aMapWindow.extWindowConfig;
  },
};
