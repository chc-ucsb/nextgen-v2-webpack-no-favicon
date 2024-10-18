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
import { ZoomToExtent } from 'ol/control';

export const cZoomToRegionTool_olext = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const getZoomToRegionButton = () => {
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

      return new ZoomToExtent({
        extent: region.bbox,
        tipLabel: 'Full Extent',
      });
    };

    globalThis.App.OpenLayers.controls['zoom-to-region'] = getZoomToRegionButton;

    return;
  },
};
