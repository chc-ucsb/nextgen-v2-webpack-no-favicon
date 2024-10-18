import { buildLabel, truncateString } from '../../../helpers/string';
import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { LayerConfig } from '../../../@types';

const getFolderById = (items: LayerConfig, id: string): LayerConfig => {
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

  Object.keys(items).forEach((key) => {
    if (!folder) recurse(items[key]);
  });

  return folder;
};

export const cDefaultToc = {
  options: {
    events: ['recordselected'],
    requiredBlocks: ['cMapLegend'],
  },
  mapWindowFocusedEventHandler(eventObject, callbackObject, postingObject) {
    const tocExtendedTool = callbackObject;

    tocExtendedTool.updateTocStore();
  },
  createExtendedTool(owningBlock) {
    return {
      owningBlock,
      TOCTreeMask: null,
      generateTOC() {
        /* var TOCTree = {};
                TOCTree["overlays"] = [];

                this.newLayersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

                var TOCTree = this.parseLayers(this.newLayersConfig.overlays);
                var boundaries = this.parseLayers(this.newLayersConfig.boundaries);

                for (var b in boundaries) {
                    TOCTree[parseInt(b) + TOCTree.length] = boundaries[b];
                }

                var baselayers = this.parseLayers(this.newLayersConfig.baselayers);
                for (var l in baselayers) {
                    TOCTree[parseInt(l) + TOCTree.length] = baselayers[l];
                } */

        let TOCTree = [];

        const newLayersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

        const { titleLength } = owningBlock.blockConfig;

        // logger("ddd");
        // logger(titleLength);

        const overlays = this.parseLayers(newLayersConfig.overlays, undefined, undefined, titleLength);
        const boundaries = this.parseLayers(newLayersConfig.boundaries, undefined, undefined, titleLength);
        const baselayers = this.parseLayers(newLayersConfig.baselayers, undefined, undefined, titleLength);

        TOCTree = TOCTree.concat(overlays.reverse()).concat(boundaries).concat(baselayers);

        // logger("test");
        // logger(owningBlock.blockConfig);

        return TOCTree;
      },
      parseLayers(folders, folderId, level, titleLength) {
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
            children = this.parseLayers(fdr.folder, fdr.id, level + 1, titleLength);
          } else if (fdr.type === 'layer') {
            if (fdr.loadOnly === false && fdr.mask === false) {
              const layerTitle = truncateString(fdr.title, 0, maxTitleLength);
              if (fdr.timeseries !== undefined) {
                children = {
                  id: fdr.id,
                  layerNodeTitle: `<span title="${fdr.title}">${layerTitle}</span>`,
                  timeSeriesSelected: buildLabel(fdr),
                  period: fdr.timeseries.type,
                  leaf: true,
                  //qtip: fdr.title,
                  description: fdr.description,
                  checked: fdr.display,
                  belongsTo: folderId,
                  type: fdr.type,
                };
              } else {
                if (fdr.hasOwnProperty('hiddenInTOC')) {
                  if (fdr?.hiddenInTOC === false) {
                    children = {
                      id: fdr.id,
                      layerNodeTitle: `<span title="${fdr.title}">${layerTitle}</span>`,
                      period: '',
                      name: fdr.name,
                      leaf: true,
                      //qtip: fdr.title,
                      description: fdr.description,
                      checked: fdr.display,
                      belongsTo: folderId,
                      type: fdr.type,
                    };
                  } else {
                    // If hiddenInTOC is TRUE then we want to skip adding it to the TOC.
                    continue;
                  }
                } else {
                  children = {
                    id: fdr.id,
                    layerNodeTitle: `<span title="${fdr.title}">${layerTitle}</span>`,
                    period: '',
                    name: fdr.name,
                    leaf: true,
                    //qtip: fdr.title,
                    description: fdr.description,
                    checked: fdr.display,
                    belongsTo: folderId,
                    type: fdr.type,
                  };
                }
              }
            }
          } else if (fdr.type === 'link') {
            const layerTitle = truncateString(fdr.title, 0, maxTitleLength);
            children = {
              id: fdr.id,
              layerNodeTitle: `<span title="Go to: ${fdr.url}">${layerTitle}</span>`,
              iconCls: 'external-link',
              cls: 'external-link',
              //qtip: `Go to: ${fdr.url}`,
              type: fdr.type,
              belongsTo: folderId,
              leaf: true,
              url: fdr.url,
            };
          }

          const expanded = fdr.expanded !== undefined ? fdr.expanded : false;

          if (fdr.type === 'folder' && children.length > 0) {
            TOCTree.push({
              id: fdr.id,
              layerNodeTitle: `<span title="${fdr.title}">${truncateString(fdr.title, 0, maxTitleLength)}</span>`,
              expanded,
              children,
              //qtip: fdr.title,
              description: fdr.description,
              belongsTo: typeof folderId === 'undefined' ? '' : folderId,
              type: fdr.type,
            });
          } else if (fdr.type === 'link' || (fdr.type === 'layer' && fdr.loadOnly === false && fdr.mask === false) || fdr?.hiddenInTOC === false) {
            TOCTree.push(children);
          }
        }

        return TOCTree;
      },
      maskTOC() {
        const block = owningBlock.blockConfig;
        if (this.TOCTreeMask === null) {
          // @ts-ignore
          this.TOCTreeMask = new Ext.LoadMask(this.component, {
            msg: typeof block.progressMessage !== 'undefined' ? block.progressMessage : 'Loading TOC ...',
          });
        }

        this.TOCTreeMask.show();
      },
      unMaskTOC() {
        setTimeout(
          function (tocExtendedTool) {
            tocExtendedTool.TOCTreeMask.hide();
          },
          500,
          this
        );
      },
      updateTocStore() {
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
            datachanged(s, eOpts) {
              tocExtendedTool.unMaskTOC();
            },
            beforeexpand: function (aNode, eOpts) {
              const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
              const layersConfig = globalThis.App.Layers.getLayersConfigById(currentInstanceId);
              const folder = getFolderById(layersConfig, aNode.raw.id);
              folder.expanded = true;
            },
            beforecollapse: function (aNode, eOpts) {
              const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
              const layersConfig = globalThis.App.Layers.getLayersConfigById(currentInstanceId);
              const folder = getFolderById(layersConfig, aNode.raw.id);
              folder.expanded = false;
            },
          },
        });

        const TOCTreeCmp = this.component;
        TOCTreeCmp.reconfigure(store);
      },
    };
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const TOCJSON = extendedTool.generateTOC();

    if (Ext.ComponentQuery.query('periodic').length === 0) globalThis.App.Tools.datePicker.defineDatePicker();

    // we want to setup a model and store instead of using dataUrl
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
        {
          name: 'type',
          type: 'string',
        },
        {
          name: 'url',
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
          const folder = getFolderById(layersConfig, aNode.raw.id);
          folder.expanded = true;
        },
        beforecollapse: function (aNode, eOpts) {
          const currentInstanceId = globalThis.App.Layers.getConfigInstanceId();
          const layersConfig = globalThis.App.Layers.getLayersConfigById(currentInstanceId);
          const folder = getFolderById(layersConfig, aNode.raw.id);
          folder.expanded = false;
        },
      },
    });

    let tree = {
      extendedTool,
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
          nodedragover(targetNode, position, dragData) {
            const { data } = dragData.records[0];
            const targetData = targetNode.data;
            if (position === 'append' && data.belongsTo !== targetData.id) return false;
            if (data.belongsTo === '' && targetData.belongsTo === '' && position === 'append') return false;
            if (data.belongsTo !== targetData.belongsTo) return false;
          },
          drop(targetNode, data, overModel, position) {
            const targetId = overModel.data.id;
            const { id } = data.records[0].data;
            const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

            if (id !== '') {
              globalThis.App.Layers.moveLayer(layersConfig, id, targetId, position);
            }
          },
        },
      },
      width: block.width,
      // height : block.height,
      // minHeight : 100,

      layout: 'absolute',
      // resizable:false,

      // cls:"disable-scroll",
      overflowY: 'hidden',
      scrollable: false,

      // split : true,
      autoScroll: true,
      store,
      rootVisible: false,
      lines: true,
      hideHeaders: true,
      columns: [
        {
          xtype: 'treecolumn', // this is so we know which column will show the tree
          flex: 1.6,
          // flex : 2.0,
          sortable: true,
          dataIndex: 'layerNodeTitle',
        },
        {
          // flex : 1.2,
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
              getBtnId(description) {
                const id = Ext.id();
                Ext.TaskManager.start({
                  scope: this,
                  interval: 100,
                  args: [id],
                  run(id) {
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
        beforeselect(tree, record, index, eOpts) {
          const { type } = record.data;
          if (type === 'layer' || type === 'folder') {
            this.extendedTool.owningBlock.fire('recordselected', this, record.data.id);
          }
        },
        checkchange(record, checked, eOpts) {
          const cMapLegendTool = Ext.getCmp(`cMapLegendTool-${globalThis.App.Layers.getConfigInstanceId()}`);
          if (cMapLegendTool !== undefined) {
            const mapLegendBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapLegend');
            const legendPanel = mapLegendBlock.component;
            // so if the legendPanel is open and the user deselects/selects a layer we should close the panel
            if (legendPanel?.isVisible()) {
              cMapLegendTool.toggle();
            }
          }

          // get all the unselected nodes from the Base Layers parentNode
          // NOTE - `record.data` will always contain data corresponding to the node (checkbox) clicked by the user.
          let unselectedNodes = record.parentNode.childNodes.filter((node) => node.data.id !== record.data.id);
          // Logic to handle the turning on/off the base layers.
          // If the user just wants the turn off the already selected layer AND not turn on the other layers, we will not enter the if logic
          // otherwise proceed as normal.
          if (record.parentNode.data.layerNodeTitle.includes('Base Layers') && checked) {
            // check if the user is turning on a layer, that would mean to turn all the other layers off.
            if (record.data.checked) {
              for (let index in unselectedNodes) {
                globalThis.App.Layers.setLayerDisplay(record.data.id, true);
                unselectedNodes[index].set('checked', false);
                globalThis.App.Layers.setLayerDisplay(unselectedNodes[index].data.id, false);
              }
            } else {
              for (let index in unselectedNodes) {
                globalThis.App.Layers.setLayerDisplay(record.data.id, false);
                unselectedNodes[index].set('checked', true);
                globalThis.App.Layers.setLayerDisplay(unselectedNodes[index].data.id, true);
              }
            }
          } else {
            globalThis.App.Layers.setLayerDisplay(record.data.id, checked);
          }
        },
        afterrender() {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
        cellclick(tree, el, index, record) {
          const { type } = record.data;
          if (type === 'link') {
            window.open(record.data.url, '_blank');
          }
        },
      },
    };

    tree = Ext.create('Ext.tree.TreePanel', ExtJSPosition(tree, block));

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED,
      extendedTool.owningBlock.itemDefinition.mapWindowFocusedEventHandler,
      extendedTool
    );

    // Rebuild the TOC when the EVENT_TOC_LAYER_CONFIGURATION_UPDATED event is fired.
    // We trigger it from the cAddWMSLayerForm component.
    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
      extendedTool.owningBlock.itemDefinition.mapWindowFocusedEventHandler,
      extendedTool
    );

    return tree;
  },
};
