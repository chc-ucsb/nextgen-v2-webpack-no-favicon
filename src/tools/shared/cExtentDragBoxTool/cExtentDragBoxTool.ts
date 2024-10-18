import { always } from 'ol/events/condition';
import { DragBox } from 'ol/interaction';
import { Fill, Stroke, Style } from 'ol/style';
import { getRandomString } from '../../../helpers/string';
import { logger } from '../../../utils';

export const cExtentDragBoxTool = {
  options: {
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
  },
  createExtendedTool: function (owningBlock) {
    const extToolUniqueID = getRandomString(32, 36);

    const owningMapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const owningMapWindow = owningMapWindowBlock.extendedTool;

    const extendedExtentDragBoxTool = {
      owningBlock: owningBlock,
      toggleGroupId: owningMapWindow.toggleGroupId,
      extTool: null,

      //after this gets given away to the toolbar it is copied
      //and can no longer be referenced from this object
      //directly
      //you have to use Ext.getCmp(this.extIdentifyToolID);
      //to access it
      //dont forget that

      extToolID: extToolUniqueID,
      dragBoxInteraction: null,
      dragBoxMouseDownCoords: null,
      dragBoxMouseUpCoords: null,
      mapInteraction: undefined,

      /*handleToggle : function () {
       var mapPanelBlock = owningBlock.getReferencedBlock('cMapPanel');

       var isPressed = Ext.getCmp(this.extTool.id).pressed;
       var map = mapPanelBlock.component.map;

       if (isPressed) {
       if (this.dragBoxInteraction == null) {

       var fill = new Fill({
       color : 'rgba(255,154,0,0.5)'
       });

       var theStyle = new Style({
       stroke : new Stroke({
       color : [255, 154, 0, 1],
       width : 2,

       }),
       fill : fill

       });

       this.dragBoxInteraction = new ol.interaction.DragBox({
       condition : ol.events.condition.always,
       style : theStyle
       });

       this.dragBoxInteraction.on('boxend', function (anOlDragBoxEvent) {
       //this is the dragBoxInteractionItem itself

       var extentToUse = this.dragBoxInteraction.getGeometry().getExtent();
       var mapProjectionEPSGCode = map.getView().getProjection().getCode();
       globalThis.App.OpenLayers.setExtentForMap(map, extentToUse, mapProjectionEPSGCode);

       }, this);

       }

       map.addInteraction(this.dragBoxInteraction);

       } else {
       map.removeInteraction(this.dragBoxInteraction);
       }

       },
       getReady : function (aMapWindow) {}*/
    };

    // const fill = new Fill({
    //   color: 'rgba(255,154,0,0.5)',
    // });
    //
    // const style = new Style({
    //   stroke: new Stroke({
    //     color: [255, 154, 0, 1],
    //     width: 2,
    //   }),
    //   fill: fill,
    // });

    const mapInteraction = new DragBox({
      condition: always,
      // style: style,
    });

    mapInteraction.on('boxend', function (event) {
      var mapPanelBlock = extendedExtentDragBoxTool.owningBlock.getReferencedBlock('cMapPanel');
      // var mapPanelBlock = this.map_.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
      // var map = mapPanelBlock.component.map;
      // const map = this.map_;
      const map = mapInteraction.getMap();
      // var extentToUse = this.mapInteraction.getGeometry().getExtent();
      const extentToUse = mapInteraction.getGeometry().getExtent();
      // const extentToUse = extendedExtentDragBoxTool.mapInteraction
      logger.log(extentToUse.join(','));
      const mapProjectionEPSGCode = map.getView().getProjection().getCode();
      globalThis.App.OpenLayers.setExtentForMap(map, extentToUse, mapProjectionEPSGCode);
    });

    extendedExtentDragBoxTool.mapInteraction = mapInteraction;

    return extendedExtentDragBoxTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const extExtentDragBoxTool = {
      extendedTool: extendedTool,
      iconCls: block.iconClass ? block.iconClass : 'fa fa-search-plus',
      cls: 'x-btn-left',
      tooltip: block.tooltip,
      tooltipType: 'title',
      enableToggle: true,
      toggleGroup: extendedTool.toggleGroupId,
      id: extendedTool.extToolID,
      pressed: block.pressed,
      listeners: {
        toggle: function () {
          const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
          const map = mapPanelBlock.component.map;

          if (this.pressed === true) {
            map.addInteraction(this.extendedTool.mapInteraction);
          } else {
            map.removeInteraction(this.extendedTool.mapInteraction);
          }

          const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
          mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
        },
        afterrender: function () {
          extExtentDragBoxTool.extendedTool.extTool = this;
          extExtentDragBoxTool.extendedTool.owningBlock.rendered = true;
          extExtentDragBoxTool.extendedTool.owningBlock.component = this;

          if (extExtentDragBoxTool.pressed === true) {
            const mapPanelBlock = extExtentDragBoxTool.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            if (mapPanelBlock.rendered === false) {
              mapPanelBlock.on(
                'rendercomponent',
                function (callbackObj, postingObj) {
                  const mapPanel = postingObj;
                  const zoomExtendedTool = callbackObj;
                  const map = mapPanel.owningBlock.component.map;
                  map.addInteraction(zoomExtendedTool.mapInteraction);
                },
                extExtentDragBoxTool.extendedTool
              );
            } else {
              var map = mapPanelBlock.component.map;
              map.addInteraction(extExtentDragBoxTool.extendedTool.mapInteraction);
            }
          }
        },
      },
    };

    return extExtentDragBoxTool;
  },
};
