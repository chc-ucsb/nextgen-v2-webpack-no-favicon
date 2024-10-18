export const cBoundaryToggleTool = {
  options: {
    requiredBlocks: ['cStateTool'],
    events: ['toggle'],
  },
  createExtendedTool: function (owningBlock) {
    const extendedTool = {
      owningBlock: owningBlock,
      boundaryId: owningBlock.blockConfig.layers[0].id,
      handleToggle: function () {
        const pressed = this.component.pressed;

        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        let boundary = globalThis.App.Layers.query(layersConfig.boundaries, {
          type: 'layer',
          id: this.boundaryId,
          loadOnly: false,
          mask: false,
        });

        if (boundary.length === 0) return;
        boundary = boundary[0];

        if (pressed) {
          boundary.display = true;
        }

        this.owningBlock.fire('toggle', this);

        globalThis.App.EventHandler.postEvent(
          globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
          layersConfig,
          globalThis.App.Layers.layersConfig
        );

        globalThis.App.EventHandler.postEvent(
          globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED,
          layersConfig,
          globalThis.App.Layers.layersConfig
        );
      },
    };

    const stateBlock = owningBlock.getReferencedBlock('cStateTool');
    if (stateBlock !== null) {
      stateBlock.on(
        'select',
        function (callbackObj, postingObj, eventObj) {
          const extendedTool = callbackObj;
          if (extendedTool.component.isHidden()) {
            extendedTool.component.show();
          }
        },
        extendedTool
      );
    }

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
    const displayedBoundaries = globalThis.App.Layers.query(layersConfig.boundaries, {
      type: 'layer',
      display: true,
      id: extendedTool.owningBlock.blockConfig.layers[0].id,
    });

    let pressed = false;
    if (displayedBoundaries.length > 0) {
      pressed = true;
    }

    const component = {
      extendedTool: extendedTool,
      xtype: 'button',
      width: block.width,
      height: block.height,
      //toggle: true,
      toggleGroup: 'boundaryButtons',
      text: block.text,
      pressed: pressed,
      hidden: true,
      toggleHandler: function () {
        this.extendedTool.handleToggle();
      },
      listeners: {
        /*toggle: function() {
         this.extendedTool.handleToggle();
         },*/
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
        },
      },
    };

    return component;
  },
};
