import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { buildLabel, truncateString } from '../../../helpers/string';

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
        /*var TOCTree = {};
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

        let TOCTree = [];

        const newLayersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

        const titleLength = owningBlock.blockConfig.titleLength;

        //logger("ddd");
        //logger(titleLength);

        const overlays = this.parseLayers(newLayersConfig.overlays, undefined, undefined, titleLength);
        const boundaries = this.parseLayers(newLayersConfig.boundaries, undefined, undefined, titleLength);
        const baselayers = this.parseLayers(newLayersConfig.baselayers, undefined, undefined, titleLength);

        TOCTree = TOCTree.concat(overlays.reverse()).concat(boundaries).concat(baselayers);

        //logger("test");
        //logger(owningBlock.blockConfig);

        return TOCTree;
      },
      parseLayers: function (folders, folderId, level, titleLength) {
        if (typeof level === 'undefined') level = 0;
        const TOCTree = [];
        let children;

        //var maxTitleLength = 16;
        //if (level === 2) maxTitleLength = 14;
        //else if (level === 3) maxTitleLength = 8;

        const maxTitleLength = titleLength;
        //logger(maxTitleLength);

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
                  layerNodeTitle: `<span title="${fdr.title}">${layerTitle}</span>`,
                  timeSeriesSelected: buildLabel(fdr),
                  period: fdr.timeseries.type,
                  iconCls: fdr.type + 'Cls',
                  glyphCls: 'glyphicon-pencil',
                  leaf: true,
                  //qtip: fdr.title,
                  description: fdr.description,
                  checked: fdr.display,
                  belongsTo: folderId,
                };
              } else {
                children = {
                  id: fdr.id,
                  layerNodeTitle: `<span title="${fdr.title}">${layerTitle}</span>`,
                  period: '',
                  name: fdr.name,
                  leaf: true,
                  //qtip: fdr.title,
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
              layerNodeTitle: `<span title="${fdr.title}">${truncateString(fdr.title, 0, maxTitleLength)}</span>`,
              iconCls: fdr.type + 'Cls',
              expanded: expanded,
              children: children,
              //qtip: fdr.title,
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
          // @ts-ignore
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
          flex: 1,
          //flex : 2.0,
          sortable: true,
          dataIndex: 'layerNodeTitle',
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
