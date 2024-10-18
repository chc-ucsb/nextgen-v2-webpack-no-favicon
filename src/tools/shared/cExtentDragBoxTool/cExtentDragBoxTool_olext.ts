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
import { DragBox } from 'ol/interaction';
import { always } from 'ol/events/condition';

export const cExtentDragBoxTool_olext = {
  options: {
    requiredBlocks: ['cMapPanel', 'cMapWindow'],
  },
  getComponent(extendedTool, items, toolbar, menu) {
    const getDragBoxToggleButton = ({ map, options }) => {
      const dragBox = new DragBox({
        condition: always,
      });
      dragBox.on('boxend', function (evt) {
        const map = dragBox.getMap();
        const extent = dragBox.getGeometry().getExtent();
        const projection = map.getView().getProjection().getCode();
        globalThis.App.OpenLayers.setExtentForMap(map, extent, projection);
      });

      return new Toggle({
        html: '<i class="ms ms-zoom-box"></i>',
        className: 'select',
        title: 'Drag Zoom',
        interaction: dragBox,
        active: false,
        onToggle: function (isToggled) {
          if (isToggled) map.extendedTool.component.activeDataQueryComponent = 'drag-zoom';
          else map.extendedTool.component.activeDataQueryComponent = '';
        },
      });
    };

    globalThis.App.OpenLayers.controls['drag-zoom'] = getDragBoxToggleButton;

    return;
  },
};
