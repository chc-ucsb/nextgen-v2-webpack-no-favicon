import { truncateString } from '../../../helpers/string';
import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';

export const cDefaultToc = {
  options: {
    events: ['recordselected'],
  },
  mapWindowFocusedEventHandler(eventObject, callbackObject, postingObject) {
    const tocExtendedTool = callbackObject;

    tocExtendedTool.updateTocStore();
  },
  createExtendedTool(owningBlock) {
    return {
      owningBlock: owningBlock,
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
                }*/

        var TOCTree = [];

        var newLayersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

        var titleLength = owningBlock.blockConfig.titleLength;

        //logger("ddd");
        //logger(titleLength);

        var overlays = this.parseLayers(newLayersConfig.overlays, undefined, undefined, titleLength);
        var boundaries = this.parseLayers(newLayersConfig.boundaries, undefined, undefined, titleLength);
        var baselayers = this.parseLayers(newLayersConfig.baselayers, undefined, undefined, titleLength);

        TOCTree = TOCTree.concat(overlays.reverse()).concat(boundaries).concat(baselayers);

        //logger("test");
        //logger(owningBlock.blockConfig);

        return TOCTree;
      },
      parseLayers(folders, folderId, level, titleLength) {
        if (typeof level === 'undefined') level = 0;
        const TOCTree = [];
        let children;

        //var maxTitleLength = 16;
        //if (level === 2) maxTitleLength = 14;
        //else if (level === 3) maxTitleLength = 8;

        var maxTitleLength = titleLength;
        //logger(maxTitleLength);

        for (var o in folders) {
          children = [];
          var fdr = folders[o];

          if (fdr.type == 'folder') {
            children = this.parseLayers(fdr.folder, fdr.id, level + 1, titleLength);
          } else if (fdr.type == 'layer') {
            if (fdr.loadOnly == false && fdr.mask === false) {
              var layerTitle = truncateString(fdr.title, 0, maxTitleLength);

              if (fdr.timeseries != undefined) {
                var periodicityWrapper = globalThis.App.Periodicity.getPeriodicityWrapperById(fdr.id);

                children = {
                  id: fdr.id,
                  layerNodeTitle: `<span title="${fdr.title}">${layerTitle}</span>`,
                  timeSeriesSelected: periodicityWrapper.buildDisplayLabel(periodicityWrapper.format),
                  period: fdr.timeseries.type,
                  leaf: true,
                  //qtip: fdr.title,
                  description: fdr.description,
                  checked: fdr.display,
                  belongsTo: folderId,
                  type: fdr.type,
                };
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
          } else if (fdr.type === 'link') {
            var layerTitle = truncateString(fdr.title, 0, maxTitleLength);
            children = {
              id: fdr.id,
              layerNodeTitle: `<span title="Go to: ${fdr.url}">${layerTitle}</span>`,
              iconCls: 'external-link',
              cls: 'external-link',
              //qtip: 'Go to: ' + fdr.url,
              type: fdr.type,
              belongsTo: folderId,
              leaf: true,
              url: fdr.url,
            };
          }

          var expanded = fdr.expanded != undefined ? fdr.expanded : false;

          if (fdr.type == 'folder' && children.length > 0) {
            TOCTree.push({
              id: fdr.id,
              layerNodeTitle: `<span title="${fdr.title}">${truncateString(fdr.title, 0, maxTitleLength)}</span>`,
              expanded: expanded,
              children: children,
              //qtip: fdr.title,
              description: fdr.description,
              belongsTo: typeof folderId === 'undefined' ? '' : folderId,
              type: fdr.type,
            });
          } else if (fdr.type === 'link' || (fdr.type == 'layer' && fdr.loadOnly === false && fdr.mask === false)) {
            TOCTree.push(children);
          }
        }

        return TOCTree;
      },
      maskTOC() {
        const block = owningBlock.blockConfig;
        if (this.TOCTreeMask == null) {
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

        var TOCJSON = this.generateTOC();
        var store = Ext.create('Ext.data.TreeStore', {
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

        var TOCTreeCmp = this.component;
        TOCTreeCmp.reconfigure(store);
      },
    };
  },
  getComponent(extendedTool, items, toolbar, menu) {
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

    var store = Ext.create('Ext.data.TreeStore', {
      model: 'layerTree',
      root: {
        expanded: true,
        children: JSON.parse(JSON.stringify(TOCJSON)),
      },
    });

    var tree = {
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
            var data = dragData.records[0].data;
            var targetData = targetNode.data;
            if (position === 'append' && data.belongsTo !== targetData.id) return false;
            if (data.belongsTo === '' && targetData.belongsTo === '' && position === 'append') return false;
            if (data.belongsTo !== targetData.belongsTo) return false;
          },
          drop: function (targetNode, data, overModel, position) {
            var targetId = overModel.data.id,
              id = data.records[0].data.id,
              layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

            if (id !== '') {
              globalThis.App.Layers.moveLayer(layersConfig, id, targetId, position);
            }
          },
        },
      },
      width: block.width,
      //height : block.height,
      //minHeight : 100,

      layout: 'absolute',
      //resizable:false,

      //cls:"disable-scroll",
      overflowY: 'hidden',
      scrollable: false,

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
                var id = Ext.id();
                Ext.TaskManager.start({
                  scope: this,
                  interval: 100,
                  args: [id],
                  run: function (id) {
                    if (!Ext.fly(id)) return true;
                    Ext.get(id).on('click', function (e) {
                      var layerId = e.target.getAttribute('data-layer-id');
                      var layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
                      var layers = globalThis.App.Layers.query(layersConfig, { id: layerId }, ['overlays', 'boundaries', 'baselayers']);

                      if (layers.length > 0) {
                        var layer = layers[0];
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
          var type = record.data.type;
          if (type === 'layer' || type === 'folder') {
            this.extendedTool.owningBlock.fire('recordselected', this, record.data.id);
          }
        },
        checkchange: function (record, checked, eOpts) {
          globalThis.App.Layers.setLayerDisplay(record.data.id, checked);
          if (record.parentNode.data.layerNodeTitle == 'Base Layers') {
            if (record.parentNode.childNodes.length > 1) {
              var checked = record.parentNode.childNodes.filter((e) => e.data.checked == true);
              if (checked.length > 1) {
                var uncheck = checked.find((e) => e.data.id !== record.data.id);
                uncheck.set('checked', false);
                this.extendedTool.owningBlock.fire('recordselected', this, record.data.id);
                globalThis.App.Layers.setLayerDisplay(uncheck.data.id, uncheck.data.checked);
              }
            }
          }
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
        cellclick: function (tree, el, index, record) {
          var type = record.data.type;
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

    return tree;
  },
};
