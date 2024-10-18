import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';

export const cRemoveWMSLayerForm = {
  options: {
    delayRender: true,
  },
  createExtendedTool: function (owningBlock) {
    return {
      owningBlock: owningBlock,
      mask: null,
      maskTool: function () {
        const block = owningBlock.blockConfig;
        if (this.mask === null) {
          // @ts-ignore
          this.mask = new Ext.LoadMask(this.component, {
            msg: typeof block.progressMessage !== 'undefined' ? block.progressMessage : 'Removing Layers ...',
          });
        }

        this.mask.show();
      },
      unmaskTool: function () {
        setTimeout(
          function (extendedTool) {
            extendedTool.mask.hide();
          },
          500,
          this
        );
      },
      getGridStore: function () {
        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

        // Layers that have been added with cAddWMSLayerForm have the `isAdded` property.
        const addedLayers = globalThis.App.Layers.query(
          layersConfig,
          {
            type: 'layer',
            // display: true,
            isAdded: true,
          },
          ['overlays', 'additional']
        );

        // Convert the added layers into an Ext store.
        addedLayers.map((layer) => {
          return {
            title: layer.title != '' ? layer.title : globalThis.App.Layers.getLayerTitleById(layersConfig, layer.id),
            layerId: layer.id,
          };
        });

        // Create and return the grid store
        return Ext.create('Ext.data.Store', {
          fields: ['title', 'layerId'],
          data: addedLayers,
        });
      },
      getCurrentMapWindow: function () {
        const mapWindowComponent = Ext.getCmp(globalThis.App.Layers.getConfigInstanceId());
        if (mapWindowComponent) return mapWindowComponent;
        return null;
      },
    };
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    let removeWmsLayerForm: Dict<any> = {
      extendedTool: extendedTool,
      title: block.title,
      id: 'removeWmsLayerWindow',
      width: 350,
      height: 300,
      ghost: false,
      layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start',
      },
      autoHeight: true,
      x: block.x,
      y: block.y,
      bodyStyle: 'padding:5px;',
      border: false,
      collapsible: true,
      constrain: true,
      items: [
        {
          store: extendedTool.getGridStore(),
          xtype: 'grid',
          id: 'overlaysList',
          columns: [
            {
              text: typeof block.wmsLayerTitleTxt !== 'undefined' ? block.wmsLayerTitleTxt : 'Layer Title',
              dataIndex: 'title',
              width: '100%',
            },
          ],
          width: 300,
          height: 200,
          margin: '10 0 0 0',
          border: 1,
          style: {
            borderStyle: 'solid',
          },
          selModel: {
            mode: 'MULTI',
          },
        },
        {
          xtype: 'button',
          extendedTool: extendedTool,
          text: typeof block.removeSelectedLayersBtnTxt !== 'undefined' ? block.removeSelectedLayersBtnTxt : 'Remove selected layers',
          id: 'removeLayersBtn',
          margin: '10 0 0 0',
          handler: function () {
            this.extendedTool.maskTool();

            const grid = this.extendedTool.component.query('grid')[0];
            const rows: Array<any> = grid.getSelectionModel().getSelection();

            // Skip layer removal logic if the 'Remove Selected Layers' button is clicked without any rows selected.
            if (rows.length) {
              const mapWindow = this.extendedTool.getCurrentMapWindow();
              const mapPanelBlock = mapWindow.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
              const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
              const layersConfigKeys = Object.keys(layersConfig);

              // Remove the layer in each row from the layersConfig.
              rows.forEach((row) => {
                for (const key of layersConfigKeys) {
                  // Remove the layer using the `id` property of the layer.
                  globalThis.App.Layers.removeLayerById(layersConfig[key], row.raw.id);
                }
              });

              globalThis.App.OpenLayers.updateMapLayerOpacitiesAndDisplayedLayersFromLayersConfig(layersConfig, mapPanelBlock.component.map);

              globalThis.App.EventHandler.postEvent(globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED, layersConfig, null);

              // Rebuild and bind the store after changes
              grid.bindStore(this.extendedTool.getGridStore());
            }

            this.extendedTool.unmaskTool();
          },
        },
      ],
      listeners: {
        close: function () {
          this.extendedTool.owningBlock.remove();
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    removeWmsLayerForm = addToolBarItems(block, removeWmsLayerForm, toolbar);

    return ExtJSPosition(removeWmsLayerForm, block);
  },
};
