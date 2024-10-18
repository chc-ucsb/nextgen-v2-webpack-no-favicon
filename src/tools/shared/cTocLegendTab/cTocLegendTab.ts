/** cTocLegendTab.js
 * TOC legend tab tool
 *
 * Required Tools:
 *      N/A
 *
 * Block Parameters:
 *      Required:
 *          name: "cTocLegendTab" - The name of the tool.
 *          import: The location of the tools javascript code
 *              Ex: import": "tools.shared.cTocLegendTab.cTocLegendTab"
 *          add: Boolean - Indicates whether to load this tool or not
 *
 *      Optional:
 *          title: String - title text used to display in the panel header. (???)
 *          width: Integer -  width of this component in pixels.
 *          autoScroll: Boolean - set configuration option to show a scroll bar on the legend container, it is set to false.
 *          progressMessage: String - progress message to display when loading legend to the viewer, if not defined "Loading Legend ..." is used.
 *
 */
import { buildUrl } from '../../../helpers/string';
import { objPropExists } from '../../../helpers/object';
import { addToolBarItems, ExtJSPosition } from '../../../helpers/extjs';
import { Dict } from '../../../@types';
import { cToc } from '../cToc/cToc';

export const cTocLegendTab = {
  countLegendItemsLoaded: 0,
  legendMask: undefined,

  getWindowJsonLayers(shouldShowBoundaries) {
    const newLayerConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
    let windowJsonLayers;
    if (shouldShowBoundaries) {
      windowJsonLayers = globalThis.App.Layers.query(
        newLayerConfig,
        {
          type: 'layer',
          display: true,
          mask: false,
        },
        ['overlays', 'boundaries', 'additional']
      );
    } else {
      windowJsonLayers = globalThis.App.Layers.query(
        newLayerConfig,
        {
          type: 'layer',
          display: true,
          mask: false,
        },
        ['overlays', 'additional', 'boundaries']
      );
    }
    return windowJsonLayers;
  },
  sizeLegend(img, shouldShowBoundaries) {
    const legendContainer = Ext.getCmp('legendContainer');
    legendContainer.doLayout();
    this.countLegendItemsLoaded += 1;

    const totalCheckedJsonLayers = this.getWindowJsonLayers(shouldShowBoundaries);

    // Need some boundaries to show in legendtab
    // need some not to show
    // so the ones you do not want to show in legend tab
    // just dont define a legend node in the layer node of the layers.json
    // here we check to make sure we aren't waiting for a legend to load
    // that is not supposed to load
    // so that the legendMask can deactivate
    var checkAmount = 0;
    for (let i = 0; i < totalCheckedJsonLayers.length; i++) {
      var someJsonLayer = totalCheckedJsonLayers[i];
      if (typeof someJsonLayer.legend === 'undefined') {
        cTocLegendTab.legendMask.hide();
      } else {
        checkAmount++;
      }
    }
    if (this.countLegendItemsLoaded === checkAmount) {
      cTocLegendTab.legendMask.hide();
      this.countLegendItemsLoaded = 0;
    }
  },
  layerConfigChangedEventHandler(newLayerConfig, callbackObject, postingObject) {
    const layerConfigToUse = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());

    newLayerConfig = layerConfigToUse;
    const extendedTool = callbackObject;

    const block = extendedTool.owningBlock.blockConfig;
    // globalThis.App.Tools.cTocLegendTab.sizeLegend(this, block.showBoundaries)

    // remove and add collapsable panel
    // make wms request for each
    //---------------------------------------------------------

    const legendContainer = extendedTool.component;
    if (typeof legendContainer === 'undefined') {
      return;
    }
    legendContainer.removeAll();
    const activeRasters = globalThis.App.Layers.query(
      newLayerConfig,
      {
        type: 'layer',
        display: true,
      },
      ['overlays', 'hidden', 'boundaries']
    );
    if (typeof cTocLegendTab.legendMask === 'undefined') {
      if (activeRasters.length > 0 && activeRasters[0].legend !== undefined) {
        // @ts-ignore
        cTocLegendTab.legendMask = new Ext.LoadMask(legendContainer, {
          msg: typeof block.progressMessage !== 'undefined' ? block.progressMessage : 'Loading Legend ...',
        });
      }
    } else if (activeRasters.length === 0 || activeRasters[0].legend === undefined) {
      if (typeof cTocLegendTab.legendMask !== 'undefined') cTocLegendTab.legendMask.hide();
      cTocLegendTab.legendMask = undefined;
    }
    if (legendContainer.isVisible()) {
      if (activeRasters.length > 0 && activeRasters[0].legend !== undefined) cTocLegendTab.legendMask.show();
    }

    const windowJsonLayers = cTocLegendTab.getWindowJsonLayers(block.showBoundaries);
    if (!windowJsonLayers) return;

    // Claudia requested that we have an option to display the legends in the same order as the layers.
    if (block.matchLayerOrder) {
      windowJsonLayers.reverse();
    } else {
      windowJsonLayers.sort(globalThis.App.OpenLayers.zIndexSortAscending);
    }

    for (let layerIndex = 0, len = windowJsonLayers.length; layerIndex < len; layerIndex += 1) {
      if (cTocLegendTab.legendMask !== undefined) cTocLegendTab.legendMask.show();

      const layer = windowJsonLayers[windowJsonLayers.length - 1 - layerIndex];

      var default_options = {
        fontStyle: 'normal',
        fontColor: '000000',
        fontSize: 13,
        absoluteMargins: true,
        labelMargin: 5,
        dx: 10.0,
        dy: 0.2,
        mx: 0.2,
        my: 0.2,
      };

      if (block?.legend?.[0]) {
        const overrides = Object.entries(block.legend[0]);
        overrides.forEach((entry) => {
          const name = entry[0];
          default_options[name] = entry[1];
        });
      }

      const default_entries = Object.entries(default_options);
      var options_str = '';

      default_entries.forEach((element) => {
        options_str += element[0] + ':' + element[1] + ';';
      });

      var layerName;
      if (objPropExists(layer, 'wmstName')) {
        layerName = layer.wmstName;
      } else {
        layerName = layer.name;
      }

      const params = {
        REQUEST: 'GetLegendGraphic',
        VERSION: '1.0.0',
        FORMAT: 'image/png',
        LAYER: layerName,
        STYLE: layer?.legend?.style ?? '',
        WIDTH: 20,
        HEIGHT: 17,
        LEGEND_OPTIONS: options_str,
      };

      const legendURL = buildUrl(layer.source.wms, params);

      if (legendURL != null && layer?.legend) {
        const getLegendGraphicURL = legendURL;

        let shouldCollapse = false;
        //if (layerIndex > 0) shouldCollapse = true;

        const shouldShowBoundaries = block.showBoundaries;
        let legendHTML =
          `<div class="legend-title">${layer.legend.title}</div>` +
          `<div class='legend-body' style="margin-left:10px;">` +
          `<img onload='globalThis.App.Tools.cTocLegendTab.sizeLegend(this, ${shouldShowBoundaries})' src="${getLegendGraphicURL}"/>` +
          `</div>`;

        if (layer.legend.customImageURL != null) {
          legendHTML = `<img onload='globalThis.App.Tools.cTocLegendTab.sizeLegend(this, ${shouldShowBoundaries})' src="${layer.legend.customImageURL}"/>`;
        }

        if (layer.legend.customHtml) {
          legendHTML = layer.legend.customHtml.replace(
            /img /g,
            `img onload='globalThis.App.Tools.cTocLegendTab.sizeLegend(this, ${shouldShowBoundaries})' `
          );
        }

        let titleToUse = layer.title;

        if (typeof layer.legend.title !== 'undefined') {
          titleToUse = layer.legend.title;
        }

        //This is used for Phenology viewer, This viewer includes two titles for the legend
        if (typeof layer.legend.panelTitle !== 'undefined') {
          titleToUse = layer.legend.panelTitle;
        }

        const anItem = {
          title: titleToUse,
          collapsed: shouldCollapse,
          collapsible: true,
          height: 'auto',
          autoScroll: typeof block.autoScroll !== 'undefined' ? block.autoScroll : false,
          width: block.width,
          html: legendHTML,
        };

        legendContainer.add(anItem);
      } else {
        const anItem = {
          title: layer.title,
          collapsed: false,
          collapsible: true,
          height: 'auto',
          autoScroll: typeof block.autoScroll !== 'undefined' ? block.autoScroll : false,
          width: block.width,
          html: `<div class="legend-title">No Legend Available</div>` + `<div class='legend-body' style="margin-left:10px;">`,
        };

        legendContainer.add(anItem);
      }
    }

    legendContainer.doLayout();
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const position = block.block;
    const { width } = block;
    const { height } = block;

    let contentsTab: Dict<any> = {
      extendedTool,
      id: 'legendContainer',
      tabConfig: {
        title: block.title,
        tooltip: block.tooltip,
        tooltipType: 'title',
      },
      autoScroll: typeof block.autoScroll !== 'undefined' ? block.autoScroll : true,
      listeners: {
        afterrender() {
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.rendered = true;

          // manually trigger so it updates on startup
          const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
          this.extendedTool.owningBlock.itemDefinition.layerConfigChangedEventHandler(layersConfig, extendedTool);
        },
      },
    };

    contentsTab = addToolBarItems(block, contentsTab, toolbar);

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_TOC_LAYER_CONFIGURATION_UPDATED,
      extendedTool.owningBlock.itemDefinition.layerConfigChangedEventHandler,
      extendedTool
    );

    globalThis.App.EventHandler.registerCallbackForEvent(
      globalThis.App.EventHandler.types.EVENT_MAPWINDOW_FOCUSED,
      extendedTool.owningBlock.itemDefinition.layerConfigChangedEventHandler,
      extendedTool
    );

    return ExtJSPosition(contentsTab, block);
  },
};
