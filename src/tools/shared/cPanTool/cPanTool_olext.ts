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
import Toggle from 'ol-ext/control/Toggle';
import { DragPan } from 'ol/interaction';
import { always } from 'ol/events/condition';

export const cPanTool_olext = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const getPanToggleButton = ({ map, options }) => {
      const dragPan = new DragPan({
        condition: always,
      });

      return new Toggle({
        html: '<i class="fa fa-hand-paper-o"></i>',
        className: 'select',
        title: 'Pan',
        interaction: dragPan,
        active: true,
        onToggle: function (isToggled) {
          if (isToggled) map.extendedTool.component.activeDataQueryComponent = 'pan';
          else map.extendedTool.component.activeDataQueryComponent = '';
        },
      });
    };

    globalThis.App.OpenLayers.controls['pan'] = getPanToggleButton;

    return;
  },
};
