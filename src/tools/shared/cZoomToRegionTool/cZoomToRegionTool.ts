/** cZoomToRegionTool.js
 * Zoom to region (full extent) tool to set the region (full) extent on cMapPanel
 *
 * Required Tools:
 *      cMapPanel
 *      cMapWindow
 *
 * Block Parameters:
 *      Required:
 *          name: "cZoomToRegionTool" - The name of the tool.
 *          import: The location of the tools javascript code
 *              Ex: import": "tools.shared.cZoomToRegionTool.cZoomToRegionTool"
 *          add: Boolean - Indicates whether to load this tool or not
 *
 *      Optional:
 *          title:
 *          cssClass:
 *          tooltip: Message display when the cursor is positioned over the icon tool, if not defined "Zoom To Region" is used.
 *
 */
import { getRegionWithRegionID } from '../../../utils';

export const cZoomToRegionTool = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const zoomBtn = {
      extendedTool,
      cls: 'x-btn-left',
      iconCls: block.iconClass ? block.iconClass : 'fa fa-arrows-alt',
      tooltip: typeof block.tooltip !== 'undefined' ? block.tooltip : 'Zoom to Region',
      tooltipType: 'title',
      pressed: false,
      handler() {
        const layersConfig = globalThis.App.Layers.getLayersConfigById(globalThis.App.Layers.getConfigInstanceId());
        const regionFolder = globalThis.App.Layers.query(
          layersConfig,
          function (folder) {
            if (folder.type === 'folder' && Object.prototype.hasOwnProperty.call(folder, 'regionId')) {
              const displayedLayer = globalThis.App.Layers.query(folder.folder, {
                type: 'layer',
                display: true,
                loadOnly: false,
                mask: false,
              });

              if (displayedLayer.length > 0) return true;
            }
            return false;
          },
          ['overlays', 'boundaries', 'baselayers']
        );

        if (regionFolder.length === 0) return;

        const { regionId } = regionFolder[0];
        const region = getRegionWithRegionID(regionId);
        const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
        const { map } = mapPanelBlock.component;

        globalThis.App.OpenLayers.setExtentForMap(map, region.bbox, region.srs);

        const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
        mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
      },
    };

    return zoomBtn;
  },
};
