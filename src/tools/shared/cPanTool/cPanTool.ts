import { DragPan } from 'ol/interaction';
import * as olCondition from 'ol/events/condition';
import { getRandomString } from '../../../helpers/string';

export const cPanTool = {
  options: {
    requiredBlocks: ['cMapWindow', 'cMapPanel'],
  },
  createExtendedTool: function (owningBlock) {
    const toolUniqueID = getRandomString(32, 36);

    const owningMapWindowBlock = owningBlock.getReferencedBlock('cMapWindow');
    const owningMapWindow = owningMapWindowBlock.extendedTool;

    const extendedPanTool = {
      owningBlock: owningBlock,
      toggleGroupId: owningMapWindow.toggleGroupId,
      mapInteraction: new DragPan({
        condition: olCondition.always,
      }),
      //after this gets given away to the toolbar it is copied
      //and can no longer be referenced from this object
      //directly
      //you have to use Ext.getCmp(this.extIdentifyToolID);
      //to access it
      //dont forget that

      extToolID: toolUniqueID,
    };
    return extendedPanTool;
  },
  getComponent: function (extendedTool, items, toolbar, menu) {
    const block = extendedTool.owningBlock.blockConfig;

    const extPanTool = {
      extendedTool: extendedTool,
      cls: 'x-btn-left',
      iconCls: block.iconClass ? block.iconClass : 'fa fa-hand-paper-o',
      tooltip: block.tooltip,
      tooltipType: 'title',
      enableToggle: true,
      toggleGroup: extendedTool.toggleGroupId,
      id: extendedTool.extToolID,
      pressed: block.pressed,
      listeners: {
        toggle: function (button, pressed) {
          const me = this;
          const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
          const map = mapPanelBlock.component.map;
          /*if (!(me.pressed || Ext.ButtonToggleManager.getPressed(me.toggleGroup))) {
             me.toggle(true, true);
             }*/

          if (me.pressed) {
            map.addInteraction(me.extendedTool.mapInteraction);
            /*map.getInteractions().clear();
               var d = new ol.interaction.defaults();
               var darr = d.getArray();
               map.getInteractions().extend(darr);*/
          } else {
            map.removeInteraction(me.extendedTool.mapInteraction);
          }

          const mapWindowBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapWindow');
          mapWindowBlock.fire('activate', mapWindowBlock.extendedTool);
        },
        afterrender: function () {
          this.extendedTool.component = this;
          this.extendedTool.owningBlock.component = this;
          this.extendedTool.owningBlock.rendered = true;
          let me = this;

          if (this.pressed === true) {
            const mapPanelBlock = this.extendedTool.owningBlock.getReferencedBlock('cMapPanel');
            if (mapPanelBlock.rendered === false) {
              mapPanelBlock.on(
                'rendercomponent',
                function (callbackObj, postingObj) {
                  const mapPanel = postingObj;
                  const panExtendedTool = callbackObj;
                  const map = mapPanel.owningBlock.component.map;
                  map.addInteraction(panExtendedTool.mapInteraction);
                },
                this.extendedTool
              );
            } else {
              var map = mapPanelBlock.component.map;
              map.addInteraction(me.extendedTool.mapInteraction);
            }
          }
        },
      },
    };

    return extPanTool;
  },
};
