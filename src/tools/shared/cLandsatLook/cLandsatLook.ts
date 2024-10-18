/** cLandsatLook.js
 * The LandsatLook tool opens up LandsatLook using the maps current extent.
 *
 * Required Tools:
 *      cMapWindow, cMapPanel
 *
 * Block Parameters:
 *      Required:
 *          name: "cLandsatLook" - The name of the tool.
 *          import: The location of the tools javascript code
 *              Ex: import": "tools.shared.cLandsatLook.cLandsatLook"
 *          add: Boolean - Indicates whether to load this tool or not
 *
 *      Optional:
 *          title:
 *          cssClass:
 *          tooltip: Tip to show when tool is hovered over
 *
 */
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { transformExtent } from 'ol/proj';
import { getRandomString } from '../../../helpers/string';

export const cLandsatLook = {
  options: {
    events: ['aoiSelected'],
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
  },
  createExtendedTool: function (owningBlock) {
    const owningMapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const owningMapWindow = owningMapWindowBlock.extendedTool;

    let toggleGroupId = null;
    if (owningMapWindow !== null) {
      toggleGroupId = owningMapWindow.toggleGroupId;
    }

    const extendedTool = {
      owningBlock: owningBlock,
      toggleGroupId: toggleGroupId,
      toolUniqueID: getRandomString(32, 36),
      vector: new VectorLayer({
        source: new VectorSource(),
      }),
      vectorAdded: false,
    };

    return extendedTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;
    const zoomInPopupTitle = block.popupTitle;
    const zoomInPopupMessage = block.popupMessage;
    const extBBOXTool = {
      extendedTool: extendedTool,
      cls: 'x-btn-left',
      iconCls: 'fa fa-landsat-look',
      xtype: 'button',
      tooltip: block.tooltip,
      tooltipType: 'title',
      id: extendedTool.toolUniqueID,
      listeners: {
        click: function () {
          const me = this;
          const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
          const map = mapPanelBlock.component.map;
          const units = map.getView().getProjection().getUnits();
          const zoom = map.getView().getZoom();
          //Get the projection of the map view
          const mapProjection = map.getView().getProjection().getCode();
          //Get the extent of the map window
          let extent = globalThis.App.OpenLayers.getCurrentMapWindowExtent(map);
          //Transform extent from map's projection to the LandsatLook projection of 4326
          extent = transformExtent(extent, mapProjection, 'EPSG:4326');
          //Create the LandLook URL using the new extent
          const landsatLookURL = 'https://landlook.usgs.gov/landlook/viewer.html?extent=' + extent;

          //Open up a new window with the Landsat Look URL
          window.open(landsatLookURL, '_blank');
        },
      },
    };

    return extBBOXTool;
  },
};
