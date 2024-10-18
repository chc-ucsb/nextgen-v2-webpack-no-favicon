import { getRandomString, truncateString } from '../../../helpers/string';
import { addToolBarItems } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cDatasetToc = {
  mapWindowFocusedEventHandler: function (eventObject, callbackObject, postingObject) {
    const tocExtendedTool = callbackObject;
    const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
    const layersConfig = globalThis.App.Layers.getLayersConfigById(currentInstanceId);

    tocExtendedTool.updateTocStore();
  },
  createExtendedTool: function (owningBlock) {
    return {
      owningBlock: owningBlock,
      uniqueId: 'toc-' + getRandomString(32, 36),
      TOCTreeMask: null,
      generateTOC: function () {
        const newLayersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

        return this.parseLayers(newLayersConfig.overlays);
      },
      parseLayers: function (folders, counter, folderId) {
        if (typeof counter === 'undefined') counter = 0;
        const TOCTree = [];
        let children;

        for (let o in folders) {
          children = [];
          const fdr = folders[o];

          if (fdr.type == 'folder') {
            var notLoadOnlyLayers = globalThis.App.Layers.query(fdr, function (layer) {
              if (layer.type === 'layer' && layer.loadOnly === false && layer.mask === false) {
                return true;
              }
              return false;
            });

            if (notLoadOnlyLayers.length === 0) {
              children = [];
            } else {
              children = this.parseLayers(fdr.folder, counter + 1, fdr.id);
            }
          } else if (fdr.type == 'layer') {
            if (fdr.loadOnly == false) {
              const layerTitle = truncateString(fdr.title, 0, 15);

              if (fdr.timeseries != undefined) {
                children = {
                  id: fdr.id,
                  layerNodeTitle: `<span title="${fdr.title}">${layerTitle}</span>`,
                  iconCls: fdr.type + 'Cls',
                  glyphCls: 'glyphicon-pencil',
                  leaf: true,
                  //qtip: fdr.title,
                  checked: fdr.display,
                  description: !fdr.description ? false : fdr.description,
                  belongsTo: folderId,
                };
              } else {
                children = {
                  id: fdr.id,
                  layerNodeTitle: `<span title="${fdr.title}">${layerTitle}</span>`,
                  name: fdr.name,
                  leaf: true,
                  //qtip: fdr.title,
                  glpyh: 0xf1e0,
                  description: !fdr.description ? false : fdr.description,
                  checked: fdr.display,
                  belongsTo: folderId,
                };
              }
            }
          }

          const expanded = fdr.expanded != undefined ? fdr.expanded : false;

          const leaf = counter == 1 ? true : false;

          if (fdr.type == 'folder' && notLoadOnlyLayers.length > 0) {
            TOCTree.push({
              id: fdr.id,
              layerNodeTitle: `<span title="${fdr.title}">${fdr.title}</span>`,
              iconCls: fdr.type + 'Cls',
              expanded: expanded,
              leaf: leaf,
              //qtip: fdr.title,
              glpyh: 0xf1e0,
              description: !fdr.description ? false : fdr.description,
              children: children,
              belongsTo: typeof folderId === 'undefined' ? '' : folderId,
            });
          } else if (fdr.type == 'layer') {
            TOCTree.push(children);
          }
        }
        return TOCTree;
      },
      maskTOC: function () {
        const block = owningBlock.blockConfig;
        if (this.TOCTreeMask === null) {
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
        const tocExtendedTool = this;

        const TOCJSON = this.generateTOC();

        const store = Ext.create('Ext.data.TreeStore', {
          model: 'layerTree',
          root: {
            expanded: true,
            children: JSON.parse(JSON.stringify(TOCJSON)),
          },
          listeners: {
            datachanged: function (s, eOpts) {
              tocExtendedTool.unMaskTOC();
            },
          },
        });

        const TOCTreeDatsetCmp = this.component;
        TOCTreeDatsetCmp.reconfigure(store);
      },
    };
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
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
          name: 'description',
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
      ],
    });

    const store = Ext.create('Ext.data.TreeStore', {
      model: 'layerTree',
      root: {
        expanded: true,
        children: JSON.parse(JSON.stringify(TOCJSON)),
      },
    });

    //Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a tree.TreePanel
    let tree: Dict<any> = {
      extendedTool: extendedTool,
      id: extendedTool.uniqueId,
      title: block.title,
      width: '100%',
      minHeight: 100,
      autoScroll: true,
      store: store,
      rootVisible: false,
      lines: true,
      hideHeaders: true,
      viewConfig: {
        plugins: {
          ptype: 'treeviewdragdrop',
        },
        listeners: {
          nodedragover: function (targetNode, position, dragData) {
            const data = dragData.records[0].data;
            const targetData = targetNode.data;
            if (position === 'append' && data.belongsTo !== targetData.id) return false;
            if (data.belongsTo === '' && targetData.belongsTo === '' && position === 'append') return false;
            if (data.belongsTo !== targetData.belongsTo) return false;
          },
          drop: function (targetNode, data, overModel, position) {
            const targetId = overModel.data.id,
              id = data.records[0].data.id,
              layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

            if (id !== '') globalThis.App.Layers.moveLayer(layersConfig, id, targetId, position);
          },
        },
      },
      columns: [
        {
          xtype: 'treecolumn', //this is so we know which column will show the tree
          flex: 1,
          width: '40%',
          sortable: true,
          dataIndex: 'layerNodeTitle',
        },
        {
          xtype: 'templatecolumn',
          sortable: false,
          menuDisabled: true,
          dataIndex: 'description',
          width: '60%',
          tpl: new Ext.XTemplate(
            // @ts-ignore
            "<tpl if='this.hasDescription({id})'><i id='{[ this.getBtnId() ]}' data-layer-id='{id}' class='fa fa-question-circle layer-info-btn'></i><tpl else><i class='noLayerInfoIcon'></tpl>",
            {
              hasDescription: function (obj) {
                const layerId = obj.id;
                const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
                const layers = globalThis.App.Layers.query(layersConfig, { id: layerId }, ['overlays', 'boundaries', 'baselayers']);

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
                      const layers = globalThis.App.Layers.query(layersConfig, { id: layerId }, ['overlays', 'boundaries', 'baselayers']);

                      if (layers.length > 0) {
                        const layer = layers[0];
                        if (layer.hasOwnProperty('description') && layer.description !== null && layer.description.trim() !== '') {
                          //Ext.Msg.alert(layer.title, layer.description);
                          Ext.Msg.show({
                            title: layer.title,
                            msg: layer.description,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.QUESTION,
                          });
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
                                if (description) {
                                    return 'x-fa fa-question-circle-o';
                                } else {
                                    return 'noLayerInfoIcon';
                                }
                            },
                            getTip : function (v, meta, record) {
                                var description = globalThis.App.Layers.getLayerDescriptionByIdentifier(record.data.id);
                                if (description) {
                                    return "<div class='layerInfo'><b>" + record.data.layerNodeTitle + "</b><br><br>" + description.replace(/\"/g, "&apos;") + "</div>";
                                }
                            },
                            handler : function (grid, rowIndex, colIndex) {
                                var record = grid.getStore().getAt(rowIndex);
                                var description = globalThis.App.Layers.getLayerDescriptionByIdentifier(record.data.id);
                                if (description) {
                                    Ext.Msg.alert(record.data.layerNodeTitle, globalThis.App.Layers.getLayerDescriptionByIdentifier(record.data.id));
                                }
                            }
                        }
                    ]
                }, */ {
          hidden: true,
          sortable: true,
          dataIndex: 'period',
        },
        {
          hidden: true,
          sortable: true,
          dataIndex: 'id',
        },
      ],
      listeners: {
        itemdblclick: function (tree, record, item, index, e, eOpts) {
          globalThis.App.Layers.createNewInstanceOfLayersConfig();
          const folderId = record.get('id');
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          const folder = globalThis.App.Layers.query(layersConfig.overlays, { id: folderId });

          const onLayers = globalThis.App.Layers.query(layersConfig.overlays, { active: true });

          for (const layer of onLayers) {
            layer.display = false;
            layer.active = false;
          }

          const layers = globalThis.App.Layers.query(folder[0].folder, {
            type: 'layer',
            mask: false,
            loadOnly: false,
          });
          layers[0].display = true;
          layers[0].active = true;

          /*var firstLayer = layers[0];

                    turnOnOnlyLayerWithIDInOverlaysConfig(layersConfig.overlays, firstLayer.id);*/

          globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_REQUESTING_NEW_MAP_WINDOW, null, null);
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

    tree = addToolBarItems(block, tree, toolbar);

    return Ext.create('Ext.tree.TreePanel', tree);
  },
};

export var toolName = 'cDatasetToc';
export var tool = cDatasetToc;
