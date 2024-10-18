/** cDefaultToc.js
 * Tool to display TOC using the folder and layer structure defined on the data*.json.
 * This tool is based on the cDefaultToc shared tool but modified to make it work for the GEOSUR viewer.
 * The current shared tool does not work for the GEOSUR viewer because it resets
 * the TOC back to the data*.json config info when a change is applied.
 *
 * Required Tools:
 *      N/A
 *
 * Block Parameters:
 *      Required:
 *          name: "cDefaultToc" - The name of the tool.
 *          import: The location of the tools javascript code
 *              Ex: import": "tools.geosur.cDefaultToc.cDefaultToc"
 *          add: Boolean - Indicates whether to load this tool or not
 *          width: tool width
 *          height: tool height
 *          titleLength: title length
 *
 *      Optional:
 *          block: EWX, QuickDri, GLC use this - but I don't see where its being used - should it be removed from their config file?
 *          hideDatePicker: Boolean: Boolean - Indicates whether to hide or show the date picker
 *          progressMessage: progress message when applying changes on the TOC.
 *
 */
import { buildLabel, truncateString } from '../../../helpers/string';
import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { LayerConfig } from '../../../@types';

const getFolderById = (items: Array<LayerConfig>, id: string): LayerConfig => {
  let folder;

  const recurse = (_items: Array<LayerConfig>): void => {
    _items.forEach((item) => {
      if (!folder) {
        if (item.type === 'folder') {
          if (item.id === id) folder = item;
          if (item.folder) recurse(item.folder);
        }
      }
    });
  };

  recurse(items);
  return folder;
};

export const cDefaultToc = {
  options: {
    events: ['recordselected'],
  },
  mapWindowFocusedEventHandler: function (eventObject, callbackObject, postingObject) {
    const tocExtendedTool = callbackObject;
    const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
    const layersConfig = globalThis.App.Layers.getLayersConfigById(currentInstanceId);

    tocExtendedTool.updateTocStore();
  },
  createExtendedTool: function (owningBlock) {
    return {
      owningBlock: owningBlock,
      TOCTreeMask: null,
      generateTOC: function () {
        let TOCTree = [];

        const newLayersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

        const titleLength = owningBlock.blockConfig.titleLength;

        const overlays = this.parseLayers(newLayersConfig.overlays, undefined, undefined, titleLength);
        const boundaries = this.parseLayers(newLayersConfig.boundaries, undefined, undefined, titleLength);
        const baselayers = this.parseLayers(newLayersConfig.baselayers, undefined, undefined, titleLength);

        TOCTree = TOCTree.concat(overlays.reverse()).concat(boundaries).concat(baselayers);

        return TOCTree;
      },
      parseLayers: function (folders, folderId, level, titleLength) {
        if (typeof level === 'undefined') level = 0;
        const TOCTree = [];
        let children;

        const maxTitleLength = titleLength;

        for (let o in folders) {
          children = [];
          const fdr = folders[o];

          if (fdr.type == 'folder') {
            children = this.parseLayers(fdr.folder, fdr.id, level + 1, titleLength);
          } else if (fdr.type == 'layer') {
            if (fdr.loadOnly == false && fdr.mask === false) {
              const layerTitle = truncateString(fdr.title, 0, maxTitleLength);

              if (fdr.timeseries != undefined) {
                children = {
                  id: fdr.id,
                  layerNodeTitle: layerTitle,
                  timeSeriesSelected: buildLabel(fdr),
                  period: fdr.timeseries.type,
                  iconCls: fdr.type + 'Cls',
                  glyphCls: 'glyphicon-pencil',
                  leaf: true,
                  qtip: fdr.title,
                  description: fdr.description,
                  checked: fdr.display,
                  belongsTo: folderId,
                };
              } else {
                children = {
                  id: fdr.id,
                  layerNodeTitle: layerTitle,
                  period: '',
                  name: fdr.name,
                  leaf: true,
                  qtip: fdr.title,
                  glpyh: 0xf1e0,
                  description: fdr.description,
                  checked: fdr.display,
                  belongsTo: folderId,
                };
              }
            }
          }

          const expanded = fdr.expanded != undefined ? fdr.expanded : false;

          if (fdr.type == 'folder' && children.length > 0) {
            TOCTree.push({
              id: fdr.id,
              layerNodeTitle: truncateString(fdr.title, 0, maxTitleLength),
              iconCls: fdr.type + 'Cls',
              expanded: expanded,
              children: children,
              qtip: fdr.title,
              description: fdr.description,
              belongsTo: typeof folderId === 'undefined' ? '' : folderId,
            });
          } else if (fdr.type == 'layer' && fdr.loadOnly === false && fdr.mask === false) {
            TOCTree.push(children);
          }
        }

        return TOCTree;
      },
      maskTOC: function () {
        const block = owningBlock.blockConfig;
        if (this.TOCTreeMask == null) {
          this.TOCTreeMask = new Ext.LoadMask(this.component, {
            msg: typeof block.progressMessage !== 'undefined' ? block.progressMessage : 'Loading TOC ...',
          });
        }

        this.TOCTreeMask.show();
      },
      unMaskTOC: function () {
        setTimeout(
          function (tocExtendedTool) {
            tocExtendedTool.TOCTreeMask.hide();
          },
          500,
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
            beforeexpand: function (aNode, eOpts) {
              const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
              const layersConfig = globalThis.App.Layers.getLayersConfigById(currentInstanceId);
              const folder = getFolderById(layersConfig.overlays, aNode.raw.id);
              folder.expanded = true;
            },
            beforecollapse: function (aNode, eOpts) {
              const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
              const layersConfig = globalThis.App.Layers.getLayersConfigById(currentInstanceId);
              const folder = getFolderById(layersConfig.overlays, aNode.raw.id);
              folder.expanded = false;
            },
          },
        });

        const TOCTreeCmp = this.component;
        TOCTreeCmp.reconfigure(store);
      },
    };
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const TOCJSON = extendedTool.generateTOC();

    if (Ext.ComponentQuery.query('periodic').length == 0) globalThis.App.Tools.datePicker.defineDatePicker();

    //we want to setup a model and store instead of using dataUrl
    Ext.define('layerTree', {
      extend: 'Ext.data.TreeModel',
      fields: [
        {
          name: 'layerNodeTitle',
          type: 'string',
        },
        {
          name: 'timeSeriesSelected',
          type: 'string',
        },
        {
          name: 'description',
          type: 'string',
        },
        {
          name: 'period',
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
      listeners: {
        beforeexpand: function (aNode, eOpts) {
          const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
          const layersConfig = globalThis.App.Layers.getLayersConfigById(currentInstanceId);
          const folder = getFolderById(layersConfig.overlays, aNode.raw.id);
          folder.expanded = true;
        },
        beforecollapse: function (aNode, eOpts) {
          const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
          const layersConfig = globalThis.App.Layers.getLayersConfigById(currentInstanceId);
          const folder = getFolderById(layersConfig.overlays, aNode.raw.id);
          folder.expanded = false;
        },
      },
    });

    let tree = {
      extendedTool: extendedTool,
      id: extendedTool.uniqueId,
      bodyStyle: {
        borderLeft: '0px',
        borderRight: '0px',
        borderColor: '#ccc',
      },
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

            if (id !== '') {
              globalThis.App.Layers.moveLayer(layersConfig, id, targetId, position);
            }
          },
        },
      },
      width: block.width,
      height: block.height,
      minHeight: 100,
      //split : true,
      autoScroll: true,
      store: store,
      rootVisible: false,
      lines: true,
      hideHeaders: true,
      columns: [
        {
          xtype: 'treecolumn', //this is so we know which column will show the tree
          flex: 1.6,
          //flex : 2.0,
          sortable: true,
          dataIndex: 'layerNodeTitle',
        },
        {
          //flex : 1.2,
          flex: 0.6,
          xtype: 'datePickerColumn',
          dataIndex: 'timeSeriesSelected',
          menuDisabled: true,
          hidden: typeof block.hideDatePicker !== 'undefined' ? block.hideDatePicker : false,
        },
        {
          xtype: 'templatecolumn',
          sortable: false,
          menuDisabled: true,
          dataIndex: 'description',
          width: 33,
          tpl: new Ext.XTemplate(
            // @ts-ignore
            "<tpl if='description'><i id='{[ this.getBtnId() ]}' data-layer-id='{id}' class='fa fa-question-circle layer-info-btn'></i><tpl else><i class='noLayerInfoIcon'></tpl>",
            {
              getBtnId: function (description) {
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
        {
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
        beforeselect: function (tree, record, index, eOpts) {
          this.extendedTool.owningBlock.fire('recordselected', this, record.data.id);
        },
        checkchange: function (record, checked, eOpts) {
          globalThis.App.Layers.setLayerDisplay(record.data.id, checked);
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    tree = Ext.create('Ext.tree.TreePanel', ExtJSPosition(tree, block));

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED,
      extendedTool.owningBlock.itemDefinition.mapWindowFocusedEventHandler,
      extendedTool
    );

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
      extendedTool.owningBlock.itemDefinition.mapWindowFocusedEventHandler,
      extendedTool
    );

    return tree;
  },
};
