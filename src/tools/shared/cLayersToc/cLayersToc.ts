import { getRandomString, truncateString } from '../../../helpers/string';
import { Dict, LayerConfig } from '../../../@types';
import { addToolBarItems } from '../../../helpers/extjs';
import { query } from '../../../helpers/array';

export const cLayersToc = {
  options: {
    events: ['recordselected'],
  },
  mapWindowFocusedEventHandler: function (eventObject, callbackObject, postingObject) {
    const tocExtendedTool = callbackObject;

    tocExtendedTool.updateTocStore();
  },
  datePickerUpdatedEventHandler: function (eventObject, callbackObject, postingObject) {
    const tocExtendedTool = callbackObject;
    if (tocExtendedTool.shouldIgnoreNextLayerConfigUpdate) {
      tocExtendedTool.shouldIgnoreNextLayerConfigUpdate = false;
    } else {
      tocExtendedTool.updateTocOverLaysTitle();
    }
  },
  createExtendedTool: function (owningBlock) {
    return {
      shouldIgnoreNextLayerConfigUpdate: false,
      owningBlock: owningBlock,
      uniqueId: 'toc-' + getRandomString(32, 36),
      TOCTreeMask: null,
      generateTOC: function () {
        const titleLength = owningBlock.blockConfig?.titleLength ?? 40;
        const TOCTree = [];
        const children = [];

        const newLayersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

        const overlays = globalThis.App.Layers.query(
          newLayersConfig,
          {
            type: 'layer',
            active: true,
            mask: false,
            loadOnly: false,
          },
          ['overlays', 'hidden']
        );

        const additional = globalThis.App.Layers.query(
          newLayersConfig,
          {
            type: 'layer',
            mask: false,
            loadOnly: false,
          },
          ['additional']
        );

        // We still want to display any layers that were added via external sources via the `resource` parameter.
        const addedLayers = globalThis.App.Layers.query(newLayersConfig.overlays, {
          type: 'layer',
          isAdded: true,
        });

        for (let overlay of overlays.concat(addedLayers, additional)) {
          let overlayName = '';
          if (overlay.isAdded === true) {
            overlayName = overlay.title ? overlay.title : overlay.name;
          } else {
            overlayName = globalThis.App.Layers.getLayerTitleById(newLayersConfig, overlay.id);
          }

          children.push({
            id: overlay.id,
            layerNodeTitle: `<span title="${overlayName}">${truncateString(overlayName, 0, titleLength)}</span>`, //overlayName.substr(0, 45) + "
            // ...",
            //qtip: overlayName,
            name: overlayName,
            leaf: true,
            glpyh: 0xf1e0,
            checked: overlay.display,
            description: !overlay.description ? false : overlay.description,
            draggable: false,
            belongsTo: 'overlays',
          });
        }

        TOCTree.push({
          layerNodeTitle: '<span title="Overlays">Overlays</span>',
          iconCls: 'folderCls',
          expanded: true,
          children: children,
          belongsTo: '',
        });

        const boundaries = this.parseLayers(newLayersConfig.boundaries);

        for (let b in boundaries) {
          TOCTree[parseInt(b) + TOCTree.length] = boundaries[b];
        }

        const baselayers = this.parseLayers(newLayersConfig.baselayers);
        for (let l in baselayers) {
          TOCTree[parseInt(l) + TOCTree.length] = baselayers[l];
        }
        return TOCTree;
      },
      parseLayers: function (folders, folderId) {
        const titleLength = owningBlock.blockConfig?.titleLength ?? 40;
        const TOCTree = [];
        let children;

        for (let o in folders) {
          children = [];
          const fdr = folders[o];

          if (fdr.type == 'folder') {
            children = this.parseLayers(fdr.folder, fdr.id);
          } else if (fdr.type == 'layer') {
            if (fdr.loadOnly == false) {
              const layerTitle = truncateString(fdr.title, 0, titleLength);

              if (fdr.timeseries != undefined) {
                children = {
                  id: fdr.id,
                  layerNodeTitle: `<span title="${fdr.title}">${layerTitle}</span>`,
                  info: fdr.title,
                  iconCls: fdr.type + 'Cls',
                  glyphCls: 'glyphicon-pencil',
                  leaf: true,
                  //qtip: fdr.title,
                  checked: fdr.display,
                  belongsTo: folderId,
                };
              } else {
                // Ternary to handle titles that contain HTML - All tags <> + contents are removed via the .replace(). This prevents HTML appearing in the tooltip
                if (fdr.title.includes('>')) fdr.title = fdr.title.replace(/<[^>]*>?/gm, '');
                children = {
                  id: fdr.id,
                  layerNodeTitle: `<span title="${fdr.title}">${layerTitle}</span>`,
                  name: fdr.name,
                  leaf: true,
                  //qtip: fdr.title,
                  glpyh: 0xf1e0,
                  checked: fdr.display,
                  belongsTo: folderId,
                };
              }
            }
          }

          const expanded = fdr.expanded != undefined ? fdr.expanded : false;

          if (fdr.type == 'folder') {
            TOCTree.push({
              id: fdr.id,
              layerNodeTitle: `<span title="${fdr.title}">${fdr.title}</span>`,
              iconCls: fdr.type + 'Cls',
              expanded: expanded,
              info: fdr.title,
              children: children,
              belongsTo: typeof folderId === 'undefined' ? '' : folderId,
            });
          } else if (fdr.type == 'layer' && fdr.loadOnly === false) {
            TOCTree.push(children);
          }
        }

        return TOCTree;
      },
      maskTOC: function () {
        const block = owningBlock.blockConfig;
        if (this.TOCTreeMask == null) {
          // @ts-ignore
          this.TOCTreeMask = new Ext.LoadMask(Ext.getCmp(this.uniqueId), {
            msg: typeof block.progressMessage !== 'undefined' ? block.progressMessage : 'Loading TOC ...',
          });
        }

        this.TOCTreeMask.show();
      },
      unMaskTOC: function () {
        setTimeout(
          function (extendedTool) {
            extendedTool.TOCTreeMask.hide();
          },
          750,
          this
        );
      },
      updateTocStore: function () {
        this.maskTOC();
        const extendedTool = this;

        const TOCJSON = this.generateTOC();

        const store = Ext.create('Ext.data.TreeStore', {
          model: 'layerTree',
          root: {
            expanded: true,
            children: JSON.parse(JSON.stringify(TOCJSON)),
          },
          listeners: {
            datachanged: function (s, eOpts) {
              extendedTool.unMaskTOC();
            },
          },
        });

        const TOCTreeLayersCmp = this.component;
        TOCTreeLayersCmp.reconfigure(store);
      },
      updateTocOverLaysTitle: function () {
        const TOCJSON = this.generateTOC();

        const store = Ext.create('Ext.data.TreeStore', {
          model: 'layerTree',
          root: {
            expanded: true,
            children: JSON.parse(JSON.stringify(TOCJSON)),
          },
        });

        const TOCTreeLayersCmp = this.component;
        TOCTreeLayersCmp.reconfigure(store);
      },
    };
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
    const TOCJSON = extendedTool.generateTOC();

    //we want to setup a model and store instead of using dataUrl
    Ext.define('layerTree', {
      extend: 'Ext.data.TreeModel',
      fields: [
        {
          name: 'layerNodeTitle',
          type: 'string',
        },
        {
          name: 'info',
          type: 'string',
        },
        {
          name: 'id',
          type: 'string',
        },
        {
          name: 'belongsTo',
          type: 'string',
        },
        {
          name: 'draggable',
          type: 'auto',
        },
        {
          name: 'leaf',
          type: 'boolean',
        },
      ],
    });

    const store = Ext.create('Ext.data.TreeStore', {
      model: 'layerTree',
      root: {
        expanded: true,
        children: JSON.parse(JSON.stringify(TOCJSON)),
      },
    });

    let tree: Dict<any> = {
      extendedTool: extendedTool,
      id: extendedTool.uniqueId,
      title: block.title,
      width: '100%',
      // height: '100%',
      minHeight: 100,
      autoScroll: true,
      store: store,
      rootVisible: false,
      lines: true,
      hideHeaders: true,

      forceFit: true,
      // overflowX: 'scroll',
      cls: 'x-autowidth-table',

      viewConfig: {
        // height: '100%',
        // overflow: 'scroll',
        plugins: {
          ptype: 'treeviewdragdrop',
        },
        listeners: {
          nodedragover: function (targetNode, position, dragData) {
            const data = dragData.records[0].data;
            const targetData = targetNode.data;
            if (position === 'append' && data.belongsTo !== targetData.id) return false;
            if (data.belongsTo === '' || targetData.belongsTo === '') return false;
            if (data.belongsTo !== targetData.belongsTo) return false;
          },
          drop: function (targetNode, data, overModel, position) {
            const targetId = overModel.data.id,
              id = data.records[0].data.id,
              layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

            if (id !== '' && overModel.data.belongsTo !== '' && data.records[0].data.belongsTo !== '') {
              globalThis.App.Layers.moveLayer(layersConfig, id, targetId, position);
            }
          },
        },
      },
      columns: [
        {
          xtype: 'treecolumn', //this is so we know which column will show the tree
          flex: 1,
          sortable: true,
          dataIndex: 'layerNodeTitle',
        },
        {
          xtype: 'templatecolumn',
          sortable: false,
          menuDisabled: true,
          dataIndex: 'description',
          width: 33,
          tpl: new Ext.XTemplate(
            // @ts-ignore
            "<tpl if='this.hasDescription({id:id})'><i id='{[ this.getBtnId() ]}' data-layer-id='{id}' class='fa fa-question-circle layer-info-btn'></i><tpl else><i class='noLayerInfoIcon'></tpl>",
            {
              hasDescription: function (obj) {
                const layerId = obj.id;
                const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
                const layers = globalThis.App.Layers.query(layersConfig, { id: layerId }, ['overlays', 'boundaries', 'baselayers', 'additional']);

                if (layers.length > 0) {
                  const layer = layers[0];
                  if (layer.hasOwnProperty('description') && layer.description !== null && layer.description !== '') {
                    return true;
                  }
                }

                return false;
              },
              getBtnId: function () {
                const id = Ext.id();
                Ext.TaskManager.start({
                  scope: this,
                  interval: 100,
                  args: [id],
                  run: function (id) {
                    if (!Ext.fly(id)) return true;
                    Ext.get(id).on('click', function (e) {
                      const layerId = e.target.getAttribute('data-layer-id');
                      const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
                      const layers = globalThis.App.Layers.query(layersConfig, { id: layerId }, [
                        'overlays',
                        'boundaries',
                        'baselayers',
                        'additional',
                      ]);

                      if (layers.length > 0) {
                        const layer = layers[0];
                        if (layer.hasOwnProperty('description') && layer.description !== null && layer.description.trim() !== '') {
                          Ext.Msg.alert(layer.title, layer.description);
                        }
                      }
                    });
                    return false;
                  },
                });
                return id;
              },
            }
          ),
        },
        /*{
       xtype : 'actioncolumn',
       menuDisabled : true,
       sortable : false,
       width : 25,
       dataIndex : 'info',
       items : [{
       getClass : function (v, meta, record) {
       var description = globalThis.App.Layers.getLayerDescriptionByIdentifier(record.data.id);
       if (record.data.leaf === true && (description)) {
       return 'layerInfoIcon';
       } else {
       return 'noLayerInfoIcon';
       }
       },
       getTip : function (v, meta, record) {
       var description = globalThis.App.Layers.getLayerDescriptionByIdentifier(record.data.id);
       if (record.data.leaf === true && description) {
       return "<div class='layerInfo'><b>" + record.data.qtip + "</b><br><br>" + description + "</div>";
       }
       },
       handler : function (grid, rowIndex, colIndex) {
       var record = grid.getStore().getAt(rowIndex);
       var description = globalThis.App.Layers.getLayerDescriptionByIdentifier(record.data.id);
       if (record.data.leaf === true && description) {
       Ext.Msg.alert(record.data.layerNodeTitle, globalThis.App.Layers.getLayerDescriptionByIdentifier(record.data.id));
       }

       }
       }
       ]
       }, */ {
          hidden: true,
          sortable: true,
          dataIndex: 'id',
        },
      ],
      listeners: {
        beforeselect: function (tree, record, index, eOpts) {
          this.extendedTool.owningBlock.fire('recordselected', this, record.data.id);
        },
        checkchange: function (record, checked, eOpts) {
          this.extendedTool.shouldIgnoreNextLayerConfigUpdate = true;
          globalThis.App.Layers.setLayerDisplay(record.data.id, checked);
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED,
      extendedTool.owningBlock.itemDefinition.mapWindowFocusedEventHandler,
      extendedTool
    );

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
      extendedTool.owningBlock.itemDefinition.datePickerUpdatedEventHandler,
      extendedTool
    );

    tree = addToolBarItems(block, tree, toolbar);

    return Ext.create('Ext.tree.TreePanel', tree);
  },
};
