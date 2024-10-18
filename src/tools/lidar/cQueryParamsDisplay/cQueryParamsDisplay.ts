export const cQueryParamsDisplay = {
  // Other tools can change these defaults before rendering this tool.
  defaultFilters: {
    region: null,
    state: null,
    subState: null,
    year: null,
    bbox: null,
    firetype: null,
  },
  layersConfigUpdated: function (eventObj, callbackObj, postingObj) {
    const layersConfig = eventObj;
    const extendedTool = callbackObj;

    let html = '<div style="overflow-y: auto;">';
    const filters = extendedTool.queryFilters;

    let i = 0;
    const len = filters.length;
    for (; i < len; i += 1) {
      if (filters[i].text !== null) html += '<p style="margin: 1px 0;">' + filters[i].text + '</p>';
    }

    html += '</div>';

    extendedTool.component.update(html);
  },
  createExtendedTool: function (owningBlock) {
    const defaultFilters = owningBlock.itemDefinition.defaultFilters;

    const extendedTool = {
      owningBlock: owningBlock,
      queryFilters: [
        {
          type: 'region',
          text: defaultFilters.region,
        },
        {
          type: 'state',
          text: defaultFilters.state,
        },
        {
          type: 'subState',
          text: defaultFilters.subState,
        },
        {
          type: 'year',
          text: defaultFilters.year,
        },
        {
          type: 'bbox',
          text: defaultFilters.bbox,
        },
        {
          type: 'firetype',
          text: defaultFilters.firetype,
        },
      ],
      setFilter: function (type, text) {
        let i = 0;
        const len = this.queryFilters.length;
        for (; i < len; i += 1) {
          const queryFilter = this.queryFilters[i];
          if (queryFilter.type === type) {
            queryFilter.text = text;
            break;
          }
        }
      },
    };

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const component = {
      xtype: 'panel',
      extendedTool: extendedTool,
      height: block.height,
      maxHeight: block.height,
      width: block.width,
      overflowY: 'auto',
      listeners: {
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;

          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          this.extendedTool.owningBlock.itemDefinition.layersConfigUpdated(layersConfig, this.extendedTool);

          globalThis.App.EventHandler.registerCallbackForEvent(
            globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CQL_FILTER_UPDATED,
            this.extendedTool.owningBlock.itemDefinition.layersConfigUpdated,
            this.extendedTool
          );
        },
      },
    };

    return component;
  },
};
